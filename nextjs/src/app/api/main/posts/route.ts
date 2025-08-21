import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 메인페이지용 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardKey = searchParams.get('boardKey')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!boardKey) {
      return NextResponse.json(
        { error: '게시판 키가 필요합니다.' },
        { status: 400 }
      )
    }

    // 게시판 존재 확인
    const board = await prisma.board.findUnique({
      where: { key: boardKey }
    })

    if (!board) {
      return NextResponse.json(
        { error: '게시판을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 게시글 목록 조회 (최신순)
    const posts = await prisma.post.findMany({
      where: {
        boardId: board.id,
        status: 'PUBLISHED',
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        authorName: true,
        isSecret: true,
        createdAt: true,
        publishedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // 데이터 포맷팅
    const formattedPosts = posts.map(post => {
      // HTML 태그 제거하여 텍스트만 추출
      const getPlainText = (html: string | null) => {
        if (!html) return ''
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      }

      return {
        id: post.id,
        title: post.title,
        content: getPlainText(post.content),
        excerpt: post.excerpt || getPlainText(post.content)?.substring(0, 200),
        authorName: post.authorName,
        isSecret: post.isSecret,
        date: (post.publishedAt || post.createdAt).toISOString().split('T')[0], // YYYY-MM-DD
        time: (post.publishedAt || post.createdAt).toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      }
    })

    return NextResponse.json({
      posts: formattedPosts,
      total: formattedPosts.length
    })

  } catch (error) {
    console.error('메인 페이지 게시글 조회 실패:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
