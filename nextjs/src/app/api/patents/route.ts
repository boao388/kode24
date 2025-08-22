import { NextRequest, NextResponse } from 'next/server'
import { Patent, PatentListResponse, PatentSearchParams } from '@/types'

// 캐싱 설정 - 10분간 캐싱 (인증서는 자주 변경되지 않음)
export const revalidate = 600 // 10분

// 더미 데이터 (실제로는 데이터베이스에서 가져옴)
const dummyPatents: Patent[] = [
  {
    id: '1',
    title: '재도전 참여패키지 참여선정기업',
    description: '재도전 참여패키지 참여선정기업 관련 인증서입니다.',
    imageUrl: '/assets/images/sub/img_patent01.png',
    date: '2025-05-16',
    category: 'certification',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2025-05-16'),
    updatedAt: new Date('2025-05-16')
  },
  {
    id: '2',
    title: '몸캠피싱 24시 해결 코드24',
    description: '몸캠피싱 24시 해결 서비스 관련 특허입니다.',
    imageUrl: '/assets/images/sub/img_patent02.png',
    date: '2025-05-16',
    category: 'patent',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2025-05-16'),
    updatedAt: new Date('2025-05-16')
  },
  {
    id: '3',
    title: 'AI 기반 법률 상담 시스템 특허',
    description: 'AI 기반 법률 상담 시스템 관련 특허입니다.',
    imageUrl: '/assets/images/sub/img_patent01.png',
    date: '2025-04-20',
    category: 'patent',
    isActive: true,
    sortOrder: 3,
    createdAt: new Date('2025-04-20'),
    updatedAt: new Date('2025-04-20')
  },
  {
    id: '4',
    title: '디지털 포렌식 분석 도구 인증',
    description: '디지털 포렌식 분석 도구 관련 인증서입니다.',
    imageUrl: '/assets/images/sub/img_patent02.png',
    date: '2025-04-15',
    category: 'certification',
    isActive: true,
    sortOrder: 4,
    createdAt: new Date('2025-04-15'),
    updatedAt: new Date('2025-04-15')
  },
  {
    id: '5',
    title: '블록체인 기반 증거 보전 시스템',
    description: '블록체인 기반 증거 보전 시스템 특허입니다.',
    imageUrl: '/assets/images/sub/img_patent01.png',
    date: '2025-03-30',
    category: 'patent',
    isActive: true,
    sortOrder: 5,
    createdAt: new Date('2025-03-30'),
    updatedAt: new Date('2025-03-30')
  },
  {
    id: '6',
    title: '사이버 범죄 예방 솔루션 인증',
    description: '사이버 범죄 예방 솔루션 관련 인증서입니다.',
    imageUrl: '/assets/images/sub/img_patent02.png',
    date: '2025-03-25',
    category: 'certification',
    isActive: true,
    sortOrder: 6,
    createdAt: new Date('2025-03-25'),
    updatedAt: new Date('2025-03-25')
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 쿼리 파라미터 추출
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const q = searchParams.get('q')

    let filteredPatents = [...dummyPatents]

    // 카테고리 필터링
    if (category) {
      filteredPatents = filteredPatents.filter(patent => patent.category === category)
    }

    // 검색어 필터링
    if (q) {
      const searchQuery = q.toLowerCase()
      filteredPatents = filteredPatents.filter(patent => 
        patent.title.toLowerCase().includes(searchQuery) ||
        patent.description?.toLowerCase().includes(searchQuery)
      )
    }

    // 정렬
    filteredPatents.sort((a, b) => {
      let aValue: any = a[sort as keyof Patent]
      let bValue: any = b[sort as keyof Patent]

      if (sort === 'date') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (order === 'desc') {
        return bValue > aValue ? 1 : -1
      } else {
        return aValue > bValue ? 1 : -1
      }
    })

    // 페이지네이션
    const total = filteredPatents.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedPatents = filteredPatents.slice(offset, offset + limit)

    const response: PatentListResponse = {
      success: true,
      data: paginatedPatents,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      message: 'Patents retrieved successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching patents:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch patents' 
      },
      { status: 500 }
    )
  }
}

// POST - 새 인증특허 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 여기서는 간단한 응답만 반환 (실제로는 데이터베이스에 저장)
    const newPatent: Patent = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl || '/assets/images/sub/img_patent01.png',
      date: body.date || new Date().toISOString().split('T')[0],
      category: body.category || 'certification',
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      data: newPatent,
      message: 'Patent created successfully'
    })
  } catch (error) {
    console.error('Error creating patent:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create patent' 
      },
      { status: 500 }
    )
  }
}
