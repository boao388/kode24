import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// 비밀번호 확인
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const body = await request.json()
    const { password } = body

    // 입력값 검증
    if (!password) {
      return NextResponse.json(
        { message: '비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 게시글 조회 (비밀글인 경우만)
    const post = await prisma.post.findUnique({
      where: { 
        id: postId,
        isSecret: true
      },
      include: {
        board: true,
        category: true,
        comments: {
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

    if (!post) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 비밀번호 확인
    if (!post.password) {
      return NextResponse.json(
        { message: '비밀번호가 설정되지 않은 게시글입니다.' },
        { status: 400 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, post.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // 조회수 증가
    await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } }
    })

    // 비밀번호가 맞으면 게시글 정보 반환 (비밀번호는 제외)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...postWithoutPassword } = post

    return NextResponse.json({ 
      message: '비밀번호가 확인되었습니다.',
      post: postWithoutPassword
    })
  } catch (error) {
    console.error('비밀번호 확인 실패:', error)
    return NextResponse.json(
      { message: '비밀번호 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 