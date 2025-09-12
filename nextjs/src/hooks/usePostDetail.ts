'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { fetchWithCacheInvalidation } from '@/lib/cacheInvalidation'

// 게시글 상세 타입
interface PostDetail {
  id: string
  title: string
  content: string
  excerpt?: string
  authorName: string
  authorEmail?: string
  viewCount: number
  likeCount: number
  isSecret: boolean
  isFeatured: boolean
  requiresPassword?: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
  board: {
    title: string
    key: string
  }
  category?: {
    name: string
    key: string
  }
  comments: Comment[]
}

interface Comment {
  id: string
  content: string
  authorName: string
  isSecret: boolean
  isAdmin: boolean
  createdAt: string
  replies?: Comment[]
}

interface CommentData {
  content: string
  authorName: string
  password: string
  isSecret: boolean
  parentId?: string
}

// API 호출 함수들
const fetchPostDetail = async (postId: string): Promise<PostDetail> => {
  const response = await fetchWithCacheInvalidation(`/api/posts/${postId}`)
  
  if (!response.ok) {
    throw new Error(`게시글 조회 실패: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

const fetchComments = async (postId: string): Promise<Comment[]> => {
  const response = await fetchWithCacheInvalidation(`/api/posts/${postId}/comments`)
  
  if (!response.ok) {
    throw new Error(`댓글 조회 실패: ${response.status} ${response.statusText}`)
  }
  
  const result = await response.json()
  return result.data || result
}

const submitComment = async (postId: string, commentData: CommentData): Promise<Comment> => {
  const response = await fetchWithCacheInvalidation(`/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentData),
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || '댓글 등록에 실패했습니다.')
  }
  
  const result = await response.json()
  return result.data
}

// 게시글 상세 조회 훅
export function usePostDetail(postId: string | null) {
  return useQuery({
    queryKey: ['posts', 'detail', postId],
    queryFn: () => fetchPostDetail(postId!),
    enabled: !!postId, // postId가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: true, // 포커스 시 최신 데이터 확인
    refetchOnMount: true, // 마운트 시 최신 데이터 확인
    retry: (failureCount, error: any) => {
      // 404 에러 (게시글 없음)는 재시도하지 않음
      if (error?.message?.includes('404')) {
        return false
      }
      // 4xx 에러는 재시도하지 않음
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 3
    },
  })
}

// 댓글 목록 조회 훅 (별도로 필요한 경우)
export function useComments(postId: string | null) {
  return useQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: () => fetchComments(postId!),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2분간 fresh 유지 (댓글은 더 자주 업데이트)
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
    refetchOnWindowFocus: true,
  })
}

// 댓글 등록 훅
export function useCommentSubmit(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentData: CommentData) => submitComment(postId, commentData),
    onSuccess: (newComment) => {
      // 댓글 목록 캐시 무효화 및 업데이트
      queryClient.invalidateQueries({
        queryKey: ['posts', postId, 'comments'],
      })
      
      // 게시글 상세의 댓글도 업데이트
      queryClient.setQueryData(['posts', 'detail', postId], (oldData: PostDetail | undefined) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          comments: [...(oldData.comments || []), newComment]
        }
      })

      console.log('댓글 등록 성공, 캐시 업데이트 완료')
    },
    onError: (error) => {
      console.error('댓글 등록 실패:', error)
    },
  })
}

// 비밀번호 확인 훅
export function usePasswordVerification(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ password, authorName }: { password: string; authorName: string }) => {
      const response = await fetchWithCacheInvalidation(`/api/posts/${postId}/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, authorName }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '비밀번호가 일치하지 않습니다.')
      }
      
      return response.json()
    },
    onSuccess: (postData) => {
      // 성공 시 게시글 상세 캐시 업데이트
      queryClient.setQueryData(['posts', 'detail', postId], postData)
      console.log('비밀번호 확인 성공, 캐시 업데이트 완료')
    },
  })
}

// 캐시 무효화 헬퍼들
export function usePostDetailInvalidation() {
  const queryClient = useQueryClient()

  const invalidatePost = useCallback(
    async (postId: string) => {
      await queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', postId],
      })
      console.log(`게시글 ${postId} 캐시 무효화 완료`)
    },
    [queryClient]
  )

  const invalidateComments = useCallback(
    async (postId: string) => {
      await queryClient.invalidateQueries({
        queryKey: ['posts', postId, 'comments'],
      })
      console.log(`게시글 ${postId} 댓글 캐시 무효화 완료`)
    },
    [queryClient]
  )

  const refreshPost = useCallback(
    async (postId: string) => {
      await queryClient.refetchQueries({
        queryKey: ['posts', 'detail', postId],
        type: 'active'
      })
      console.log(`게시글 ${postId} 새로고침 완료`)
    },
    [queryClient]
  )

  return {
    invalidatePost,
    invalidateComments,
    refreshPost,
  }
}

// 게시글 상세 페이지용 올인원 훅
export function usePostDetailPage(postId: string | null) {
  const postQuery = usePostDetail(postId)
  const commentMutation = useCommentSubmit(postId || '')
  const passwordMutation = usePasswordVerification(postId || '')
  const { refreshPost } = usePostDetailInvalidation()

  const submitComment = useCallback(
    async (commentData: CommentData) => {
      return commentMutation.mutateAsync(commentData)
    },
    [commentMutation]
  )

  const verifyPassword = useCallback(
    async (password: string, authorName: string) => {
      return passwordMutation.mutateAsync({ password, authorName })
    },
    [passwordMutation]
  )

  const refresh = useCallback(async () => {
    if (postId) {
      await refreshPost(postId)
    }
  }, [postId, refreshPost])

  return {
    // 게시글 데이터
    post: postQuery.data,
    isLoading: postQuery.isLoading,
    error: postQuery.error?.message || null,
    
    // 상태
    isSubmittingComment: commentMutation.isPending,
    isVerifyingPassword: passwordMutation.isPending,
    
    // 액션들
    submitComment,
    verifyPassword,
    refresh,
    
    // 원본 쿼리/뮤테이션 (고급 사용)
    postQuery,
    commentMutation,
    passwordMutation,
  }
}
