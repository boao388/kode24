import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// 게시글 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    
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

    // 비밀글인 경우 기본 정보만 반환 (내용 제외)
    if (post.isSecret) {
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