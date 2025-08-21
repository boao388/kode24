import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/auth'

// 답변 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    
    // 게시글과 함께 답변 조회
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        comments: {
          where: {
            isAdmin: true,
            status: 'PUBLISHED'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1 // 가장 최근 관리자 답변만 가져오기
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const adminAnswer = post.comments[0] || null

    return NextResponse.json({
      hasAnswer: !!adminAnswer,
      answer: adminAnswer ? {
        id: adminAnswer.id,
        content: adminAnswer.content,
        createdAt: adminAnswer.createdAt,
        updatedAt: adminAnswer.updatedAt
      } : null
    })
  } catch (error) {
    console.error('답변 조회 실패:', error)
    return NextResponse.json(
      { message: '답변을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 답변 생성/수정
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const body = await request.json()
    const { content } = body

    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { message: '관리자 권한이 필요합니다.' },
        { status: 401 }
      )
    }

    // 입력값 검증
    if (!content?.trim()) {
      return NextResponse.json(
        { message: '답변 내용을 입력해주세요.' },
        { status: 400 }
      )
    }

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 기존 관리자 답변 확인
    const existingAnswer = await prisma.comment.findFirst({
      where: {
        postId,
        isAdmin: true,
        status: 'PUBLISHED'
      }
    })

    let answer
    if (existingAnswer) {
      // 기존 답변 수정
      answer = await prisma.comment.update({
        where: { id: existingAnswer.id },
        data: {
          content: content.trim(),
          updatedAt: new Date()
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true
        }
      })
    } else {
      // 새 답변 생성
      answer = await prisma.comment.create({
        data: {
          content: content.trim(),
          authorName: 'KODE24',
          isAdmin: true,
          isSecret: false,
          postId,
          status: 'PUBLISHED'
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true
        }
      })
    }

    return NextResponse.json({
      message: existingAnswer ? '답변이 수정되었습니다.' : '답변이 등록되었습니다.',
      answer
    })
  } catch (error) {
    console.error('답변 저장 실패:', error)
    return NextResponse.json(
      { message: '답변 저장에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 답변 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params

    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { message: '관리자 권한이 필요합니다.' },
        { status: 401 }
      )
    }

    // 관리자 답변 찾기
    const adminAnswer = await prisma.comment.findFirst({
      where: {
        postId,
        isAdmin: true,
        status: 'PUBLISHED'
      }
    })

    if (!adminAnswer) {
      return NextResponse.json(
        { message: '삭제할 답변이 없습니다.' },
        { status: 404 }
      )
    }

    // 답변 삭제 (실제로는 상태 변경)
    await prisma.comment.update({
      where: { id: adminAnswer.id },
      data: { status: 'REJECTED' }
    })

    return NextResponse.json({
      message: '답변이 삭제되었습니다.'
    })
  } catch (error) {
    console.error('답변 삭제 실패:', error)
    return NextResponse.json(
      { message: '답변 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
