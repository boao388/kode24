import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// JWT 토큰 검증 함수
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  console.log('Auth header:', authHeader ? 'present' : 'missing')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Invalid auth header format')
    return null
  }

  try {
    const token = authHeader.substring(7)
    const jwtSecret = process.env.JWT_SECRET || 'default-secret'
    console.log('Using JWT_SECRET:', jwtSecret.substring(0, 10) + '...')
    console.log('Token format check:', token.split('.').length === 3 ? 'valid' : 'invalid')
    
    const decoded = jwt.verify(token, jwtSecret)
    console.log('Token verified successfully:', decoded)
    return decoded as any
  } catch (error) {
    console.error('JWT verification failed:', error.message)
    return null
  }
}

// 관리자 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    // JWT 토큰 검증
    const adminData = verifyAdminToken(request)
    if (!adminData) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const boardKey = searchParams.get('boardKey')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    if (!boardKey) {
      return NextResponse.json(
        { error: 'boardKey가 필요합니다.' },
        { status: 400 }
      )
    }

    const offset = (page - 1) * limit

    // 게시판 조회
    const board = await prisma.board.findUnique({
      where: { key: boardKey }
    })

    if (!board) {
      return NextResponse.json(
        { error: '존재하지 않는 게시판입니다.' },
        { status: 404 }
      )
    }

    // 검색 조건 설정
    const whereClause: any = {
      boardId: board.id,
      status: 'PUBLISHED'
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { authorName: { contains: search, mode: 'insensitive' } }
      ]
    }

    // 게시글 조회
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        include: {
          board: true,
          _count: {
            select: {
              comments: true
            }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.post.count({
        where: whereClause
      })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        authorName: post.authorName,
        isSecret: post.isSecret,
        isFeatured: post.isFeatured,
        viewCount: post.viewCount,
        commentCount: post._count.comments,
        linkUrl: post.linkUrl,
        imageUrl: post.imageUrl,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        board: {
          key: post.board.key,
          title: post.board.title
        }
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('관리자 게시글 목록 조회 에러:', error)
    return NextResponse.json(
      { error: '게시글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 관리자 게시글 생성
export async function POST(request: NextRequest) {
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
      boardKey, 
      title, 
      content, 
      isFeatured, 
      linkUrl, 
      imageUrl, 
      publishedAt,
      authorName,
      authorEmail
    } = body

    // 필수 필드 검증
    if (!boardKey || !title || !content) {
      return NextResponse.json(
        { error: '필수 필드를 모두 입력해주세요. (게시판, 제목, 내용)' },
        { status: 400 }
      )
    }

    // 게시판 조회
    const board = await prisma.board.findUnique({
      where: { key: boardKey }
    })

    if (!board) {
      return NextResponse.json(
        { error: '존재하지 않는 게시판입니다.' },
        { status: 404 }
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

    // 게시글 생성
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorName: authorName || 'KODE24',
        authorEmail,
        boardId: board.id,
        status: 'PUBLISHED',
        isPublished: true,
        isFeatured: isFeatured || false,
        linkUrl: linkUrl || null,
        imageUrl: imageUrl || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
      include: {
        board: true
      }
    })

    return NextResponse.json({
      post,
      message: '게시글이 성공적으로 생성되었습니다.'
    }, { status: 201 })

  } catch (error) {
    console.error('관리자 게시글 생성 에러:', error)
    return NextResponse.json(
      { error: '게시글 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
} 