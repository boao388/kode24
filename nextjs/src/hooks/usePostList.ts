'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { fetchWithCacheInvalidation } from '@/lib/cacheInvalidation'

// 게시글 타입 정의
interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  authorName: string
  isSecret: boolean
  createdAt: string
  publishedAt: string
  viewCount?: number
  commentCount?: number
  metadata?: Record<string, any>
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface PostListResponse {
  posts: Post[]
  pagination: Pagination
}

interface PostListParams {
  boardKey: string
  page?: number
  limit?: number
  search?: string
  category?: string
}

// API 호출 함수
const fetchPostList = async (params: PostListParams): Promise<PostListResponse> => {
  const { boardKey, page = 1, limit = 10, search, category } = params
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  
  if (search?.trim()) {
    queryParams.append('search', search.trim())
  }
  
  if (category?.trim()) {
    queryParams.append('category', category.trim())
  }

  const response = await fetchWithCacheInvalidation(`/api/boards/${boardKey}/posts?${queryParams}`, {
    cache: 'default', // 기본 브라우저 캐시 활성화
    // 서버에서 Cache-Control 헤더로 캐시 정책 관리
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

// 쿼리 키 팩토리
const createQueryKey = (params: PostListParams) => [
  'posts',
  'list',
  params.boardKey,
  {
    page: params.page || 1,
    limit: params.limit || 10,
    search: params.search || '',
    category: params.category || '',
  },
] as const

// 게시글 목록 훅
export function usePostList(params: PostListParams) {
  const queryKey = createQueryKey(params)
  
  return useQuery({
    queryKey,
    queryFn: () => fetchPostList(params),
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분 후 캐시 삭제  
    refetchOnWindowFocus: true, // 포커스시 최신 데이터 확인 (실시간 동기화)
    refetchOnMount: true, // 마운트시 최신 데이터 확인
    refetchInterval: 10 * 60 * 1000, // 10분마다 백그라운드 업데이트
    refetchIntervalInBackground: true, // 백그라운드에서도 업데이트
    retry: (failureCount, error: any) => {
      // 4xx 에러는 재시도하지 않음
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 3
    }
  })
}

// 검색 기능이 있는 게시글 목록 훅
export function usePostListWithSearch(
  boardKey: string,
  initialPage: number = 1,
  pageSize: number = 10
) {
  const queryClient = useQueryClient()

  // 검색 함수
  const searchPosts = useCallback(
    (searchTerm: string, page: number = 1) => {
      const params: PostListParams = {
        boardKey,
        page,
        limit: pageSize,
        search: searchTerm,
      }
      
      return queryClient.fetchQuery({
        queryKey: createQueryKey(params),
        queryFn: () => fetchPostList(params),
        staleTime: 3 * 60 * 1000,
      })
    },
    [boardKey, pageSize, queryClient]
  )

  // 페이지 변경 함수
  const changePage = useCallback(
    (page: number, searchTerm?: string) => {
      const params: PostListParams = {
        boardKey,
        page,
        limit: pageSize,
        search: searchTerm,
      }
      
      return queryClient.fetchQuery({
        queryKey: createQueryKey(params),
        queryFn: () => fetchPostList(params),
        staleTime: 3 * 60 * 1000,
      })
    },
    [boardKey, pageSize, queryClient]
  )

  // 프리페치 함수
  const prefetchNextPage = useCallback(
    (currentPage: number, searchTerm?: string) => {
      const nextPageParams: PostListParams = {
        boardKey,
        page: currentPage + 1,
        limit: pageSize,
        search: searchTerm,
      }
      
      queryClient.prefetchQuery({
        queryKey: createQueryKey(nextPageParams),
        queryFn: () => fetchPostList(nextPageParams),
        staleTime: 3 * 60 * 1000,
      })
    },
    [boardKey, pageSize, queryClient]
  )

  return {
    searchPosts,
    changePage,
    prefetchNextPage,
  }
}

// 캐시 무효화 헬퍼 (강화된 버전)
export function useInvalidatePostList() {
  const queryClient = useQueryClient()

  const invalidateBoard = useCallback(
    async (boardKey: string) => {
      // 해당 게시판의 모든 페이지 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['posts', 'list', boardKey],
      })
      
      // 즉시 최신 데이터 리페치
      await queryClient.refetchQueries({
        queryKey: ['posts', 'list', boardKey],
        type: 'active'
      })
      
      console.log(`캐시 무효화 완료: ${boardKey}`)
    },
    [queryClient]
  )

  const invalidateAll = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['posts', 'list'],
    })
    
    // 모든 활성 쿼리 즉시 리페치
    await queryClient.refetchQueries({
      queryKey: ['posts', 'list'],
      type: 'active'
    })
    
    console.log('전체 포스트 캐시 무효화 완료')
  }, [queryClient])

  // 특정 게시글 추가 후 해당 보드 캐시 무효화 및 업데이트
  const invalidateAfterPostCreate = useCallback(
    async (boardKey: string, newPost?: any) => {
      // 1. 캐시 무효화
      await invalidateBoard(boardKey)
      
      // 2. 첫 번째 페이지 데이터 미리 업데이트 (옵티미스틱 업데이트)
      if (newPost) {
        const firstPageKey = ['posts', 'list', boardKey, { page: 1, limit: 10, search: '', category: '' }]
        queryClient.setQueryData(firstPageKey, (oldData: any) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            posts: [newPost, ...oldData.posts.slice(0, 9)], // 새글을 맨 앞에 추가
            pagination: {
              ...oldData.pagination,
              totalCount: oldData.pagination.totalCount + 1
            }
          }
        })
      }
    },
    [invalidateBoard, queryClient]
  )

  // 게시글 삭제 후 캐시 업데이트
  const invalidateAfterPostDelete = useCallback(
    async (boardKey: string, deletedPostId: string) => {
      await invalidateBoard(boardKey)
      
      // 모든 페이지에서 삭제된 게시글 제거
      queryClient.setQueriesData(
        { queryKey: ['posts', 'list', boardKey] },
        (oldData: any) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            posts: oldData.posts.filter((post: any) => post.id !== deletedPostId),
            pagination: {
              ...oldData.pagination,
              totalCount: Math.max(0, oldData.pagination.totalCount - 1)
            }
          }
        }
      )
    },
    [invalidateBoard, queryClient]
  )

  return {
    invalidateBoard,
    invalidateAll,
    invalidateAfterPostCreate,
    invalidateAfterPostDelete,
  }
}

