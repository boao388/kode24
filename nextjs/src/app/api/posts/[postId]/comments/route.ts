import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// 댓글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        status: 'PUBLISHED'
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        content: true,
        authorName: true,
        isSecret: true,
        isAdmin: true,
        createdAt: true,
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

    return NextResponse.json(comments)
  } catch (error) {
    console.error('댓글 조회 실패:', error)
    return NextResponse.json(
      { message: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 댓글 등록
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const body = await request.json()
    const { content, authorName, password, isSecret, parentId } = body

    // 입력값 검증
    if (!content?.trim() || !authorName?.trim()) {
      return NextResponse.json(
        { message: '내용과 이름을 입력해주세요.' },
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

    // 비밀번호 해시화 (비밀댓글인 경우)
    let hashedPassword = null
    if (isSecret && password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorName: authorName.trim(),
        password: hashedPassword,
        isSecret: Boolean(isSecret),
        isAdmin: false,
        postId,
        parentId: parentId || null,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        content: true,
        authorName: true,
        isSecret: true,
        isAdmin: true,
        createdAt: true
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('댓글 등록 실패:', error)
    return NextResponse.json(
      { message: '댓글 등록에 실패했습니다.' },
      { status: 500 }
    )
  }
} 