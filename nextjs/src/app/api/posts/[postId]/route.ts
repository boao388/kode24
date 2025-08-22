import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyAdminToken, extractTokenFromHeader } from '@/lib/auth'

// 게시글 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    
    // 관리자 토큰 확인
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const isAdmin = token ? !!verifyAdminToken(token) : false
    
    // 사용자 인증 토큰 확인 (비밀번호로 인증된 경우)
    const userAuthHeader = request.headers.get('x-verify-token')
    let isVerifiedUser = false
    if (userAuthHeader) {
      try {
        const decoded = jwt.verify(userAuthHeader, process.env.JWT_SECRET || 'default-secret') as any
        if (decoded.type === 'post_access' && decoded.postId === postId) {
          isVerifiedUser = true
        }
      } catch (error) {
        // 토큰이 유효하지 않음
        console.log('Invalid user verify token:', error)
      }
    }
    
    // 먼저 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 비밀글인 경우 - 관리자이거나 인증된 사용자라면 전체 정보 반환, 아니면 기본 정보만 반환
    if (post.isSecret) {
      if (isAdmin || isVerifiedUser) {
        // 관리자이거나 인증된 사용자인 경우 전체 정보 반환 및 조회수 증가
        const fullPost = await prisma.post.findUnique({
          where: { id: postId },
          include: {
            board: {
              select: {
                title: true,
                key: true
              }
            },
            category: {
              select: {
                name: true,
                key: true
              }
            },
            comments: {
              where: { status: 'PUBLISHED' },
              orderBy: { createdAt: 'asc' },
              include: {
                replies: {
                  where: { status: 'PUBLISHED' },
                  orderBy: { createdAt: 'asc' }
                }
              }
            }
          }
        })

        if (fullPost) {
          // 조회수 증가
          await prisma.post.update({
            where: { id: postId },
            data: { viewCount: { increment: 1 } }
          })
        }

        return NextResponse.json(fullPost)
      } else {
        // 일반 사용자인 경우 기본 정보만 반환
        const postInfo = await prisma.post.findUnique({
          where: { id: postId },
          select: {
            id: true,
            title: true,
            authorName: true,
            createdAt: true,
            viewCount: true,
            isSecret: true,
            board: {
              select: {
                title: true,
                key: true
              }
            }
          }
        })

        return NextResponse.json({
          ...postInfo,
          requiresPassword: true
        })
      }
    }

    // 일반글인 경우 전체 정보 반환 및 조회수 증가
    const fullPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        board: {
          select: {
            title: true,
            key: true
          }
        },
        category: {
          select: {
            name: true,
            key: true
          }
        },
        comments: {
          where: { status: 'PUBLISHED' },
          orderBy: { createdAt: 'asc' },
          include: {
            replies: {
              where: { status: 'PUBLISHED' },
              orderBy: { createdAt: 'asc' }
            }
          }
        }
      }
    })

    if (!fullPost) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 조회수 증가
    await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json({
      ...fullPost,
      viewCount: fullPost.viewCount + 1
    })

  } catch (error) {
    console.error('게시글 조회 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 게시글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const body = await request.json()
    
    const { title, content, authorName, authorEmail, password, isSecret } = body

    // 입력값 검증
    if (!title?.trim()) {
      return NextResponse.json(
        { message: '제목을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { message: '내용을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!authorName?.trim()) {
      return NextResponse.json(
        { message: '작성자명을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (isSecret && !password) {
      return NextResponse.json(
        { message: '비밀글의 경우 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 게시글 존재 확인
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { board: true }
    })

    if (!existingPost) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 권한 확인 - 관리자 또는 인증된 사용자만 수정 가능
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const isAdmin = token ? !!verifyAdminToken(token) : false

    const userAuthHeader = request.headers.get('x-verify-token')
    let isVerifiedUser = false
    if (userAuthHeader) {
      try {
        const decoded = jwt.verify(userAuthHeader, process.env.JWT_SECRET || 'default-secret') as any
        if (decoded.type === 'post_access' && decoded.postId === postId) {
          isVerifiedUser = true
        }
      } catch (error) {
        console.log('Invalid user verify token:', error)
      }
    }

    // 비밀글인 경우 권한 확인
    if (existingPost.isSecret && !isAdmin && !isVerifiedUser) {
      return NextResponse.json(
        { message: '수정 권한이 없습니다.' },
        { status: 403 }
      )
    }

    // 비밀번호 해시화 (비밀글인 경우)
    let hashedPassword = existingPost.password // 기존 비밀번호 유지
    if (isSecret && password) {
      hashedPassword = await bcrypt.hash(password, 10)
    } else if (!isSecret) {
      hashedPassword = null // 비밀글에서 일반글로 변경 시 비밀번호 제거
    }

    // 게시글 수정
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title.trim(),
        content: content.trim(),
        excerpt: content.trim().substring(0, 200),
        authorName: authorName.trim(),
        authorEmail: authorEmail?.trim() || null,
        password: hashedPassword,
        isSecret: Boolean(isSecret),
        updatedAt: new Date()
      },
      include: {
        board: { select: { title: true, key: true } }
      }
    })

    return NextResponse.json({
      message: '게시글이 수정되었습니다.',
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        boardKey: updatedPost.board.key
      }
    })

  } catch (error) {
    console.error('게시글 수정 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 게시글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params

    // 게시글 존재 확인
    const existingPost = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!existingPost) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 댓글 먼저 삭제
    await prisma.comment.deleteMany({
      where: { postId: postId }
    })

    // 게시글 삭제
    await prisma.post.delete({
      where: { id: postId }
    })

    return NextResponse.json({
      message: '게시글이 삭제되었습니다.'
    })

  } catch (error) {
    console.error('게시글 삭제 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 