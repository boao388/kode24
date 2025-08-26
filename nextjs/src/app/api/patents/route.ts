import { NextRequest, NextResponse } from 'next/server'
import { Patent, PatentListResponse } from '@/types'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

// 캐싱 설정 - 10분간 캐싱 (인증서는 자주 변경되지 않음)
export const revalidate = 600 // 10분

// Post를 Patent 타입으로 변환하는 헬퍼 함수
interface PostWithCategory {
  id: string
  title: string
  content: string | null
  excerpt: string | null
  imageUrl: string | null
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
  category?: { key: string } | null
}

// 한국시간 날짜 포맷팅 함수
const formatToKST = (date: Date): string => {
  const kstOffset = 9 * 60 // KST는 UTC+9
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
  const kstTime = new Date(utc + (kstOffset * 60000))
  return kstTime.toISOString().split('T')[0]
}

const postToPatent = (post: PostWithCategory): Patent => {
  return {
    id: post.id,
    title: post.title,
    description: post.excerpt || post.content?.substring(0, 200) || '',
    imageUrl: post.imageUrl || '/assets/images/sub/img_patent01.png',
    date: post.publishedAt ? formatToKST(post.publishedAt) : formatToKST(post.createdAt),
    category: post.category?.key || 'certification',
    isActive: post.isPublished || true,
    sortOrder: 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 쿼리 파라미터 추출
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc'
    const q = searchParams.get('q')

    // patent 게시판 조회
    const patentBoard = await prisma.board.findUnique({
      where: { key: 'patent' }
    })

    if (!patentBoard) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Patent board not found' 
        },
        { status: 404 }
      )
    }

    // 기본 where 조건
    const whereCondition = {
      boardId: patentBoard.id,
      isPublished: true,
      status: 'PUBLISHED' as const,
      ...(q && {
        OR: [
          { title: { contains: q, mode: 'insensitive' as const } },
          { content: { contains: q, mode: 'insensitive' as const } },
          { excerpt: { contains: q, mode: 'insensitive' as const } }
        ]
      })
    }

    // 정렬 조건 설정
    const orderBy = 
      sort === 'date' ? { publishedAt: order } :
      sort === 'title' ? { title: order } :
      { createdAt: order }

    // 전체 개수 조회
    const total = await prisma.post.count({ where: whereCondition })

    // 게시글 조회
    const posts = await prisma.post.findMany({
      where: whereCondition,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true
      }
    })

    // Post를 Patent 타입으로 변환
    const patents = posts.map(postToPatent)

    const totalPages = Math.ceil(total / limit)

    const response: PatentListResponse = {
      success: true,
      data: patents,
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
    // 관리자 인증 확인
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyAdminToken(token)
    if (!decoded) {
      return NextResponse.json(
        { message: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // 입력값 검증
    if (!body.title?.trim()) {
      return NextResponse.json(
        { message: '제목을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!body.content?.trim()) {
      return NextResponse.json(
        { message: '내용을 입력해주세요.' },
        { status: 400 }
      )
    }

    // patent 게시판 조회
    const patentBoard = await prisma.board.findUnique({
      where: { key: 'patent' }
    })

    if (!patentBoard) {
      return NextResponse.json(
        { message: 'Patent board not found' },
        { status: 404 }
      )
    }

    // 게시글 생성
    const newPost = await prisma.post.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        excerpt: body.description?.trim() || body.content.substring(0, 200),
        authorName: 'KODE24',
        boardId: patentBoard.id,
        status: 'PUBLISHED' as const,
        isPublished: true,
        publishedAt: new Date(),
        imageUrl: body.imageUrl || '/assets/images/sub/img_patent01.png',
        linkUrl: body.linkUrl
      },
      include: {
        category: true
      }
    })

    // Post를 Patent 형태로 변환하여 반환
    const patent = postToPatent(newPost)

    return NextResponse.json({
      success: true,
      data: patent,
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
