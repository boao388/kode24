import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, dataTransformers, queryOptimizers } from '@/lib/apiOptimization'

// 동적 캐싱 설정
export const dynamic = 'force-dynamic' // 강제 동적 렌더링
export const revalidate = 0 // 캐시 비활성화

// 메인페이지용 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardKey = searchParams.get('boardKey')
    const { limit } = queryOptimizers.optimizePaginationParams(
      null,
      searchParams.get('limit'),
      10,
      50 // 메인페이지는 최대 50개로 제한
    )

    if (!boardKey) {
      return createErrorResponse('게시판 키가 필요합니다.', 400)
    }

    // 게시판 존재 확인
    const board = await prisma.board.findUnique({
      where: { key: boardKey }
    })

    if (!board) {
      return createErrorResponse('게시판을 찾을 수 없습니다.', 404)
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

    // 데이터 포맷팅 (최적화된 변환 함수 사용)
    const formattedPosts = posts.map(post => {
      const publishedDate = post.publishedAt || post.createdAt

      return {
        id: post.id,
        title: post.title,
        content: dataTransformers.stripHtml(post.content),
        excerpt: post.excerpt || dataTransformers.summarize(post.content, 200),
        authorName: post.authorName,
        isSecret: post.isSecret,
        date: dataTransformers.formatDate(publishedDate),
        time: dataTransformers.formatTime(publishedDate)
      }
    })
    const response = NextResponse.json({posts : formattedPosts, total : formattedPosts.length})
    
    // 캐시 무효화 헤더 설정
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

    // return createSuccessResponse(
    //   {
    //     posts: formattedPosts,
    //     total: formattedPosts.length
    //   },
    //   undefined,
    //   {
    //     maxAge: 300,
    //     sMaxAge: 300,
    //     staleWhileRevalidate: 600
    //   }
    // )

  } catch (error) {
    console.error('메인 페이지 게시글 조회 실패:', error)
    // return createErrorResponse('서버 오류가 발생했습니다.', 500)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
