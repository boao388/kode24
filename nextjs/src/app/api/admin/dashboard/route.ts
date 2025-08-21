import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/auth'

// 대시보드 통계 조회
export async function GET(request: NextRequest) {
  try {
    // JWT 토큰 검증
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 401 }
      )
    }

    // 통계 데이터 병렬 조회
    const [
      totalPosts,
      totalComments,
      totalFaqs,
      totalSnsChannels,
      recentPosts,
      postsByBoard,
      commentsByBoard,
      secretPosts,
      featuredPosts
    ] = await Promise.all([
      // 전체 게시글 수
      prisma.post.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // 전체 댓글 수
      prisma.comment.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // FAQ 수
      prisma.fAQ.count({
        where: { isActive: true }
      }),
      
      // SNS 채널 수
      prisma.snsChannel.count({
        where: { isActive: true }
      }),
      
      // 최근 게시글 (최근 7일)
      prisma.post.count({
        where: {
          status: 'PUBLISHED',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // 게시판별 게시글 수
      prisma.board.findMany({
        select: {
          title: true,
          _count: {
            select: {
              posts: {
                where: { status: 'PUBLISHED' }
              }
            }
          }
        }
      }),
      
      // 게시판별 댓글 수
      prisma.board.findMany({
        select: {
          title: true,
          posts: {
            select: {
              _count: {
                select: {
                  comments: {
                    where: { status: 'PUBLISHED' }
                  }
                }
              }
            }
          }
        }
      }),
      
      // 비밀글 수
      prisma.post.count({
        where: {
          status: 'PUBLISHED',
          isSecret: true
        }
      }),
      
      // 중요 공지 수
      prisma.post.count({
        where: {
          status: 'PUBLISHED',
          isFeatured: true
        }
      })
    ])

    // 게시판별 댓글 수 집계
    const boardComments = commentsByBoard.map((board: any) => ({
      title: board.title,
      commentCount: board.posts.reduce((total: number, post: any) => total + post._count.comments, 0)
    }))

    const stats = {
      overview: {
        totalPosts,
        totalComments,
        totalFaqs,
        totalSnsChannels,
        recentPosts,
        secretPosts,
        featuredPosts
      },
      boards: postsByBoard.map((board: any) => ({
        name: board.title,
        posts: board._count.posts,
        comments: boardComments.find((bc: any) => bc.title === board.title)?.commentCount || 0
      })),
      activity: {
        recentPostsWeek: recentPosts,
        totalEngagement: totalComments,
        avgCommentsPerPost: totalPosts > 0 ? Math.round((totalComments / totalPosts) * 10) / 10 : 0
      }
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('대시보드 통계 조회 실패:', error)
    return NextResponse.json(
      { error: '통계 데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 