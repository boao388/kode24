'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

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

  const response = await fetch(`/api/boards/${boardKey}/posts?${queryParams}`)
  
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
    staleTime: 3 * 60 * 1000, // 3분간 fresh
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // 4xx 에러는 재시도하지 않음
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 3
    },
    // 이전 데이터 유지하여 로딩 중에도 UI가 깜빡이지 않음
    placeholderData: (previousData) => previousData,
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

// 캐시 무효화 헬퍼
export function useInvalidatePostList() {
  const queryClient = useQueryClient()

  const invalidateBoard = useCallback(
    (boardKey: string) => {
      return queryClient.invalidateQueries({
        queryKey: ['posts', 'list', boardKey],
      })
    },
    [queryClient]
  )

  const invalidateAll = useCallback(() => {
    return queryClient.invalidateQueries({
      queryKey: ['posts', 'list'],
    })
  }, [queryClient])

  return {
    invalidateBoard,
    invalidateAll,
  }
}
