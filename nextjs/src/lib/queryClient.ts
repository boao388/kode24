import { QueryClient } from '@tanstack/react-query'

// QueryClient 인스턴스 생성 (최적화된 설정)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 데이터를 fresh로 유지 (서버 요청 없이 캐시 사용)
      staleTime: 5 * 60 * 1000, // 5분
      // 30분간 캐시 유지 (백그라운드에서 자동 갱신)
      gcTime: 30 * 60 * 1000, // 30분 (구 cacheTime)
      // 네트워크 에러 시 3번 재시도
      retry: 3,
      // 재시도 딜레이 (지수 백오프)
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 윈도우 포커스 시 자동 리페치 비활성화 (성능 향상)
      refetchOnWindowFocus: false,
      // 마운트 시 자동 리페치 (데이터 일관성)
      refetchOnMount: true,
      // 네트워크 재연결 시 자동 리페치
      refetchOnReconnect: true,
    },
    mutations: {
      // 뮤테이션 에러 시 3번 재시도
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

// 쿼리 키 팩토리 (일관된 쿼리 키 관리)
export const queryKeys = {
  // 게시글 관련 쿼리 키
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (boardKey: string, params?: Record<string, unknown>) => 
      [...queryKeys.posts.lists(), boardKey, params] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    comments: (postId: string) => [...queryKeys.posts.detail(postId), 'comments'] as const,
  },
  // 메인 페이지 관련 쿼리 키
  main: {
    all: ['main'] as const,
    posts: (boardKey: string, limit: number) => 
      [...queryKeys.main.all, 'posts', boardKey, limit] as const,
  },
  // FAQ 관련 쿼리 키
  faqs: {
    all: ['faqs'] as const,
    lists: () => [...queryKeys.faqs.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => 
      [...queryKeys.faqs.lists(), params] as const,
  },
  // 특허 관련 쿼리 키
  patents: {
    all: ['patents'] as const,
    lists: () => [...queryKeys.patents.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => 
      [...queryKeys.patents.lists(), params] as const,
  },
  // 팝업 관련 쿼리 키
  popups: {
    all: ['popups'] as const,
    active: () => [...queryKeys.popups.all, 'active'] as const,
  },
  // SNS 채널 관련 쿼리 키
  snsChannels: {
    all: ['snsChannels'] as const,
    lists: () => [...queryKeys.snsChannels.all, 'list'] as const,
  },
} as const

// 프리페치 헬퍼 함수들
export const prefetchHelpers = {
  // 메인 페이지 데이터 프리페치
  async prefetchMainData() {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.main.posts('real_time', 12),
        queryFn: () => fetch('/api/main/posts?boardKey=real_time&limit=12').then(res => res.json()),
        staleTime: 2 * 60 * 1000, // 2분
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.main.posts('review', 6),
        queryFn: () => fetch('/api/main/posts?boardKey=review&limit=6').then(res => res.json()),
        staleTime: 2 * 60 * 1000, // 2분
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.popups.active(),
        queryFn: () => fetch('/api/popups/active').then(res => res.json()),
        staleTime: 10 * 60 * 1000, // 10분 (팝업은 자주 변경되지 않음)
      }),
    ])
  },

  // 게시글 목록 프리페치
  async prefetchPostList(boardKey: string, page: number = 1, limit: number = 10) {
    const params = { page, limit }
    await queryClient.prefetchQuery({
      queryKey: queryKeys.posts.list(boardKey, params),
      queryFn: () => {
        const queryString = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        }).toString()
        return fetch(`/api/boards/${boardKey}/posts?${queryString}`).then(res => res.json())
      },
      staleTime: 3 * 60 * 1000, // 3분
    })
  },

  // FAQ 데이터 프리페치
  async prefetchFAQs() {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.faqs.list(),
      queryFn: () => fetch('/api/faqs').then(res => res.json()),
      staleTime: 10 * 60 * 1000, // 10분 (FAQ는 자주 변경되지 않음)
    })
  },
}

// 캐시 무효화 헬퍼 함수들
export const invalidateHelpers = {
  // 특정 게시판의 모든 게시글 캐시 무효화
  invalidatePostList(boardKey: string) {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.posts.list(boardKey),
    })
  },

  // 특정 게시글의 댓글 캐시 무효화
  invalidatePostComments(postId: string) {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.posts.comments(postId),
    })
  },

  // 메인 페이지 데이터 캐시 무효화
  invalidateMainData() {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.main.all,
    })
  },
}
