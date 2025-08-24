import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kode24.co.kr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지들
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // 회사 소개
    {
      url: `${BASE_URL}/introduction/introduce`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/introduction/patent_list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/introduction/press_list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // 솔루션
    {
      url: `${BASE_URL}/solution/initial`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // 고객센터
    {
      url: `${BASE_URL}/customer/notice_list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/customer/qna`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/customer/sns_list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    // 해결 서비스
    {
      url: `${BASE_URL}/solve/real_time_list`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/solve/real_time_write`,
      lastModified: new Date(),
      changeFrequency: 'never',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/solve/review_list`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/solve/review_write`,
      lastModified: new Date(),
      changeFrequency: 'never',
      priority: 0.6,
    },
    // 보고서
    {
      url: `${BASE_URL}/report/kode_list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/report/app_list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/report/issue_list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  try {
    // 게시글들 가져오기
    const [posts, patents] = await Promise.all([
      // 모든 게시판의 게시글
      prisma.post.findMany({
        where: {
          status: 'PUBLISHED'
        },
        select: {
          id: true,
          updatedAt: true,
          board: {
            select: {
              key: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }),
      // 특허 정보
      prisma.patent.findMany({
        where: {
          status: 'PUBLISHED'
        },
        select: {
          id: true,
          updatedAt: true
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })
    ])

    // 게시글별 동적 라우트
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
      let url = ''
      let priority = 0.5
      
      switch (post.board.key) {
        case 'notice':
          url = `${BASE_URL}/customer/notice_view?id=${post.id}`
          priority = 0.6
          break
        case 'real_time':
          url = `${BASE_URL}/solve/real_time_view?id=${post.id}`
          priority = 0.7
          break
        case 'review':
          url = `${BASE_URL}/solve/review_view?id=${post.id}`
          priority = 0.6
          break
        case 'kode_report':
          url = `${BASE_URL}/report/kode_view?id=${post.id}`
          priority = 0.8
          break
        case 'app_report':
          url = `${BASE_URL}/report/app_view?id=${post.id}`
          priority = 0.7
          break
        case 'issue_report':
          url = `${BASE_URL}/report/issue_view?id=${post.id}`
          priority = 0.7
          break
        default:
          return null
      }

      if (!url) return null

      return {
        url,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority,
      }
    }).filter(Boolean) as MetadataRoute.Sitemap

    // 특허별 동적 라우트
    const patentRoutes: MetadataRoute.Sitemap = patents.map((patent) => ({
      url: `${BASE_URL}/introduction/patent_view?id=${patent.id}`,
      lastModified: patent.updatedAt,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }))

    // 모든 라우트 결합
    return [...staticRoutes, ...postRoutes, ...patentRoutes]
  } catch (error) {
    console.error('사이트맵 생성 중 오류:', error)
    // 오류 발생시 정적 라우트만 반환
    return staticRoutes
  }
}
