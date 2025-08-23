import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/auth'

// 댓글 삭제 (관리자 전용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params

    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { message: '관리자 권한이 필요합니다.' },
        { status: 401 }
      )
    }

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    })

    if (!comment) {
      return NextResponse.json(
        { message: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 댓글 삭제 (실제로는 상태 변경)
    await prisma.comment.update({
      where: { id: commentId },
      data: { 
        status: 'REJECTED',
        updatedAt: new Date()
      }
    })

    // 관련 캐시 무효화
    try {
      revalidateTag(`admin-post-${comment.postId}`)
      revalidateTag(`posts-${comment.postId}`)
    } catch (error) {
      console.log('캐시 무효화 중 오류:', error)
    }

    const response = NextResponse.json({
      message: '댓글이 삭제되었습니다.'
    })
    
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    return response
  } catch (error) {
    console.error('댓글 삭제 실패:', error)
    return NextResponse.json(
      { message: '댓글 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 댓글 상세 조회 (관리자 전용)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params

    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { message: '관리자 권한이 필요합니다.' },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            board: {
              select: {
                key: true,
                title: true
              }
            }
          }
        },
        replies: {
          where: { status: 'PUBLISHED' },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            authorName: true,
            isSecret: true,
            isAdmin: true,
            createdAt: true
          }
        }
      }
    })

    if (!comment) {
      return NextResponse.json(
        { message: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error('댓글 조회 실패:', error)
    return NextResponse.json(
      { message: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
