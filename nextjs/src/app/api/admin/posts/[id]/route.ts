import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// JWT 토큰 검증 함수
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    return decoded as any
  } catch (error) {
    return null
  }
}

// 관리자 개별 게시글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // JWT 토큰 검증
    const adminData = verifyAdminToken(request)
    if (!adminData) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        board: true,
        comments: {
          include: {
            replies: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorName: post.authorName,
        authorEmail: post.authorEmail,
        isSecret: post.isSecret,
        isFeatured: post.isFeatured,
        viewCount: post.viewCount,
        linkUrl: post.linkUrl,
        imageUrl: post.imageUrl,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        board: {
          key: post.board.key,
          title: post.board.title
        },
        comments: post.comments,
        commentCount: post._count.comments
      }
    })

  } catch (error) {
    console.error('관리자 게시글 조회 에러:', error)
    return NextResponse.json(
      { error: '게시글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 관리자 게시글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // JWT 토큰 검증
    const adminData = verifyAdminToken(request)
    if (!adminData) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      title, 
      content, 
      isFeatured, 
      linkUrl, 
      imageUrl, 
      publishedAt,
      authorName,
      authorEmail
    } = body

    const { id } = await params
    
    // 기존 게시글 확인
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 필수 필드 검증
    if (!title || !content) {
      return NextResponse.json(
        { error: '필수 필드를 모두 입력해주세요. (제목, 내용)' },
        { status: 400 }
      )
    }

    // URL 검증 (링크가 있는 경우)
    if (linkUrl) {
      try {
        new URL(linkUrl)
      } catch {
        return NextResponse.json(
          { error: '올바른 링크 URL을 입력해주세요.' },
          { status: 400 }
        )
      }
    }

    // 게시글 수정
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        authorName: authorName || existingPost.authorName,
        authorEmail,
        isFeatured: isFeatured || false,
        linkUrl: linkUrl || null,
        imageUrl: imageUrl || null,
        publishedAt: publishedAt ? new Date(publishedAt) : existingPost.publishedAt,
      },
      include: {
        board: true
      }
    })

    return NextResponse.json({
      post: updatedPost,
      message: '게시글이 성공적으로 수정되었습니다.'
    })

  } catch (error) {
    console.error('관리자 게시글 수정 에러:', error)
    return NextResponse.json(
      { error: '게시글 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 관리자 게시글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // JWT 토큰 검증
    const adminData = verifyAdminToken(request)
    if (!adminData) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // 기존 게시글 확인
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 게시글 삭제 (관련 댓글도 자동 삭제됨 - Cascade)
    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json({
      message: '게시글이 성공적으로 삭제되었습니다.'
    })

  } catch (error) {
    console.error('관리자 게시글 삭제 에러:', error)
    return NextResponse.json(
      { error: '게시글 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
} 