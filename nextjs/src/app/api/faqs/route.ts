import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// FAQ 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50') // FAQ는 보통 한 페이지에 많이 표시

    const offset = (page - 1) * limit

    // 검색 조건 구성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereConditions: any = {
      isActive: true
    }

    if (category.trim()) {
      whereConditions.category = category
    }

    // 총 FAQ 수 조회
    const totalCount = await prisma.fAQ.count({
      where: whereConditions
    })

    // FAQ 목록 조회
    const faqs = await prisma.fAQ.findMany({
      where: whereConditions,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    })

    // 페이지네이션 정보
    const totalPages = Math.ceil(totalCount / limit)
    const pagination = {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    }

    return NextResponse.json({
      faqs: faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        viewCount: faq.viewCount,
        sortOrder: faq.sortOrder,
        createdAt: faq.createdAt.toISOString()
      })),
      pagination
    })

  } catch (error) {
    console.error('FAQ 목록 조회 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// FAQ 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer, category, sortOrder } = body

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

    // FAQ 생성
    const newFaq = await prisma.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || null,
        sortOrder: sortOrder || 0,
        isActive: true
      }
    })

    return NextResponse.json({
      message: 'FAQ가 등록되었습니다.',
      faq: newFaq
    }, { status: 201 })

  } catch (error) {
    console.error('FAQ 생성 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 