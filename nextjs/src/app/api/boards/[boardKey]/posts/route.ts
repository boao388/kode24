import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// 게시판별 게시글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardKey: string }> }
) {
  try {
    const { boardKey } = await params
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    
    const offset = (page - 1) * limit

    // 게시판 존재 확인
    const board = await prisma.board.findUnique({
      where: { key: boardKey }
    })

    if (!board) {
      return NextResponse.json(
        { message: '게시판을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 검색 조건 구성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereConditions: any = {
      boardId: board.id,
      status: 'PUBLISHED'
    }

    if (search.trim()) {
      whereConditions.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { authorName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category.trim()) {
      whereConditions.category = {
        key: category
      }
    }

    // 총 게시글 수 조회
    const totalCount = await prisma.post.count({
      where: whereConditions
    })

    // 게시글 목록 조회
    const posts = await prisma.post.findMany({
      where: whereConditions,
      include: {
        board: { select: { title: true, key: true } },
        category: { select: { name: true, key: true } },
        _count: { select: { comments: true } }
      },
      orderBy: [
        { isFeatured: 'desc' }, // 공지사항 우선
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    })

    // 응답 데이터 포맷팅
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      authorName: post.authorName,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      isSecret: post.isSecret,
      isFeatured: post.isFeatured,
      status: post.status, // 게시글 상태 (DRAFT, PUBLISHED, ANSWERED 등)
      publishedAt: post.publishedAt?.toISOString(),
      createdAt: post.createdAt.toISOString(),
      category: post.category ? {
        name: post.category.name,
        key: post.category.key
      } : null,
      commentCount: post._count.comments
    }))

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
      posts: formattedPosts,
      pagination
    })

  } catch (error) {
    console.error('게시글 목록 조회 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 게시글 생성
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardKey: string }> }
) {
  try {
    const { boardKey } = await params
    const body = await request.json()
    
    const { title, content, authorName, authorEmail, password, isSecret } = body

    // 입력값 검증
    if (!title?.trim()) {
      return NextResponse.json(
        { message: '제목을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { message: '내용을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!authorName?.trim()) {
      return NextResponse.json(
        { message: '작성자명을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (isSecret && !password) {
      return NextResponse.json(
        { message: '비밀글의 경우 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 게시판 존재 확인
    const board = await prisma.board.findUnique({
      where: { key: boardKey }
    })

    if (!board) {
      return NextResponse.json(
        { message: '게시판을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 비밀번호 해시화 (비밀글인 경우)
    let hashedPassword = null
    if (isSecret && password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    // 게시글 생성
    const newPost = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        excerpt: content.trim().substring(0, 200), // 처음 200자를 발췌로 사용
        authorName: authorName.trim(),
        authorEmail: authorEmail?.trim(),
        password: hashedPassword,
        isSecret: Boolean(isSecret),
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: new Date(),
        boardId: board.id
      },
      include: {
        board: { select: { title: true, key: true } }
      }
    })

    return NextResponse.json({
      message: '게시글이 등록되었습니다.',
      post: {
        id: newPost.id,
        title: newPost.title,
        boardKey: board.key
      }
    }, { status: 201 })

  } catch (error) {
    console.error('게시글 생성 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 