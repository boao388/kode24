'use client'

import { useQuery, useQueries } from '@tanstack/react-query'

// 메인 페이지 게시글 타입
interface MainPost {
  id: string
  title: string
  content: string
  excerpt: string
  authorName: string
  isSecret: boolean
  date: string
  time: string
}

interface MainPostsResponse {
  posts: MainPost[]
  total: number
}

// API 호출 함수들
const fetchMainPosts = async (boardKey: string, limit: number): Promise<MainPostsResponse> => {
  // Vercel 캐시 우회를 위한 timestamp 추가
  const timestamp = Date.now()
  const response = await fetch(`/api/main/posts?boardKey=${boardKey}&limit=${limit}&_t=${timestamp}`, {
    cache: 'no-store', // 브라우저 캐시 비활성화
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${boardKey} posts`)
  }
  return response.json()
}

// 쿼리 키 팩토리
const queryKeys = {
  mainPosts: (boardKey: string, limit: number) => ['main', 'posts', boardKey, limit] as const,
}

// 실시간 문의 게시글 훅
export function useRealTimePosts(limit: number = 12) {
  return useQuery({
    queryKey: queryKeys.mainPosts('real_time', limit),
    queryFn: () => fetchMainPosts('real_time', limit),
    staleTime: 0, // 캐시하지 않음
    gcTime: 1000, // 1초 후 캐시 삭제
    refetchOnWindowFocus: true, // 포커스시 다시 불러오기
    refetchOnMount: true, // 마운트시 다시 불러오기
    retry: 3,
  })
}

// 솔루션 진행 후기 게시글 훅
export function useReviewPosts(limit: number = 6) {
  return useQuery({
    queryKey: queryKeys.mainPosts('review', limit),
    queryFn: () => fetchMainPosts('review', limit),
    staleTime: 0, // 캐시하지 않음
    gcTime: 1000, // 1초 후 캐시 삭제
    refetchOnWindowFocus: true, // 포커스시 다시 불러오기
    refetchOnMount: true, // 마운트시 다시 불러오기
    retry: 3,
  })
}

// 메인 페이지 전체 게시글 데이터 훅 (병렬 처리)
export function useMainPosts() {
  const results = useQueries({
    queries: [
      {
        queryKey: queryKeys.mainPosts('real_time', 12),
        queryFn: () => fetchMainPosts('real_time', 12),
        staleTime: 0, // 캐시하지 않음
        gcTime: 1000, // 1초 후 캐시 삭제
        refetchOnWindowFocus: true, // 포커스시 다시 불러오기
        refetchOnMount: true, // 마운트시 다시 불러오기
        retry: 3,
      },
      {
        queryKey: queryKeys.mainPosts('review', 6),
        queryFn: () => fetchMainPosts('review', 6),
        staleTime: 0, // 캐시하지 않음
        gcTime: 1000, // 1초 후 캐시 삭제
        refetchOnWindowFocus: true, // 포커스시 다시 불러오기
        refetchOnMount: true, // 마운트시 다시 불러오기
        retry: 3,
      },
    ],
  })

  const [realTimeQuery, reviewQuery] = results

  return {
    realTimePosts: realTimeQuery.data?.posts || [],
    reviewPosts: reviewQuery.data?.posts || [],
    isLoading: realTimeQuery.isLoading || reviewQuery.isLoading,
    isError: realTimeQuery.isError || reviewQuery.isError,
    error: realTimeQuery.error || reviewQuery.error,
    // 개별 쿼리 상태도 제공
    realTimeQuery,
    reviewQuery,
  }
}

// 프리페치 헬퍼
export const prefetchMainPosts = async (queryClient: any) => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.mainPosts('real_time', 12),
      queryFn: () => fetchMainPosts('real_time', 12),
      staleTime: 2 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.mainPosts('review', 6),
      queryFn: () => fetchMainPosts('review', 6),
      staleTime: 2 * 60 * 1000,
    }),
  ])
}
