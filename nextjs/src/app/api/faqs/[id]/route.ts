import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// FAQ 개별 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const faq = await prisma.fAQ.findUnique({
      where: { id }
    })

    if (!faq || !faq.isActive) {
      return NextResponse.json(
        { message: 'FAQ를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 조회수 증가
    await prisma.fAQ.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      viewCount: faq.viewCount + 1,
      sortOrder: faq.sortOrder,
      createdAt: faq.createdAt.toISOString(),
      updatedAt: faq.updatedAt.toISOString()
    })

  } catch (error) {
    console.error('FAQ 조회 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// FAQ 수정 (관리자 전용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { question, answer, category, sortOrder, isActive } = body

    // 입력값 검증
    if (!question?.trim()) {
      return NextResponse.json(
        { message: '질문을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!answer?.trim()) {
      return NextResponse.json(
        { message: '답변을 입력해주세요.' },
        { status: 400 }
      )
    }

    // FAQ 존재 확인
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id }
    })

    if (!existingFaq) {
      return NextResponse.json(
        { message: 'FAQ를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // FAQ 수정
    const updatedFaq = await prisma.fAQ.update({
      where: { id },
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || null,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : existingFaq.isActive
      }
    })

    return NextResponse.json({
      message: 'FAQ가 수정되었습니다.',
      faq: updatedFaq
    })

  } catch (error) {
    console.error('FAQ 수정 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// FAQ 삭제 (관리자 전용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // FAQ 존재 확인
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id }
    })

    if (!existingFaq) {
      return NextResponse.json(
        { message: 'FAQ를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 소프트 삭제 (isActive를 false로 설정)
    await prisma.fAQ.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({
      message: 'FAQ가 삭제되었습니다.'
    })

  } catch (error) {
    console.error('FAQ 삭제 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 