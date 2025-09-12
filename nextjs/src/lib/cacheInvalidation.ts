// 전역 캐시 무효화 시스템
'use client'

import { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

// 캐시 무효화 이벤트 타입
interface CacheInvalidationEvent {
  type: 'POST_CREATED' | 'POST_UPDATED' | 'POST_DELETED'
  boardKey: string
  postId?: string
  postData?: any
}

// 전역 캐시 무효화 매니저
export class CacheInvalidationManager {
  private static instance: CacheInvalidationManager
  private queryClient: QueryClient | null = null
  private eventListeners: ((event: CacheInvalidationEvent) => void)[] = []

  private constructor() {}

  public static getInstance(): CacheInvalidationManager {
    if (!CacheInvalidationManager.instance) {
      CacheInvalidationManager.instance = new CacheInvalidationManager()
    }
    return CacheInvalidationManager.instance
  }

  public setQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient
  }

  // 이벤트 리스너 등록
  public addEventListener(listener: (event: CacheInvalidationEvent) => void) {
    this.eventListeners.push(listener)
    return () => {
      const index = this.eventListeners.indexOf(listener)
      if (index > -1) {
        this.eventListeners.splice(index, 1)
      }
    }
  }

  // 캐시 무효화 이벤트 트리거
  public async triggerInvalidation(event: CacheInvalidationEvent) {
    console.log('🔄 캐시 무효화 트리거:', event)
    
    if (this.queryClient) {
      switch (event.type) {
        case 'POST_CREATED':
          await this.handlePostCreated(event)
          break
        case 'POST_UPDATED':
          await this.handlePostUpdated(event)
          break
        case 'POST_DELETED':
          await this.handlePostDeleted(event)
          break
      }
    }

    // 등록된 모든 리스너에게 이벤트 전달
    this.eventListeners.forEach(listener => listener(event))
  }

  private async handlePostCreated(event: CacheInvalidationEvent) {
    if (!this.queryClient) return

    // 해당 게시판의 모든 페이지 캐시 무효화
    await this.queryClient.invalidateQueries({
      queryKey: ['posts', 'list', event.boardKey],
    })

    // 첫 번째 페이지에 새 게시글 옵티미스틱 업데이트
    if (event.postData) {
      const firstPageKey = ['posts', 'list', event.boardKey, { page: 1, limit: 10, search: '', category: '' }]
      this.queryClient.setQueryData(firstPageKey, (oldData: any) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          posts: [event.postData, ...oldData.posts.slice(0, 9)],
          pagination: {
            ...oldData.pagination,
            totalCount: oldData.pagination.totalCount + 1
          }
        }
      })
    }

    // 메인 페이지 캐시도 무효화 (최신 게시글 목록 업데이트)
    await this.queryClient.invalidateQueries({
      queryKey: ['main-posts'],
    })
  }

  private async handlePostUpdated(event: CacheInvalidationEvent) {
    if (!this.queryClient) return

    // 해당 게시판 캐시 무효화
    await this.queryClient.invalidateQueries({
      queryKey: ['posts', 'list', event.boardKey],
    })

    // 게시글 상세 캐시도 무효화
    if (event.postId) {
      await this.queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', event.postId],
      })
    }
  }

  private async handlePostDeleted(event: CacheInvalidationEvent) {
    if (!this.queryClient || !event.postId) return

    // 해당 게시판 캐시 무효화
    await this.queryClient.invalidateQueries({
      queryKey: ['posts', 'list', event.boardKey],
    })

    // 모든 페이지에서 삭제된 게시글 제거
    this.queryClient.setQueriesData(
      { queryKey: ['posts', 'list', event.boardKey] },
      (oldData: any) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          posts: oldData.posts.filter((post: any) => post.id !== event.postId),
          pagination: {
            ...oldData.pagination,
            totalCount: Math.max(0, oldData.pagination.totalCount - 1)
          }
        }
      }
    )

    // 게시글 상세 캐시 제거
    this.queryClient.removeQueries({
      queryKey: ['posts', 'detail', event.postId],
    })
  }
}

// API 응답 헤더에서 캐시 무효화 정보 추출 및 처리
export function checkAndHandleCacheInvalidation(response: Response) {
  const revalidated = response.headers.get('X-Revalidated')
  const invalidationType = response.headers.get('X-Invalidation-Type')
  const invalidationData = response.headers.get('X-Invalidation-Data')

  if (revalidated && invalidationType) {
    const manager = CacheInvalidationManager.getInstance()
    const boardKey = revalidated.replace('posts-', '')
    
    let parsedData = null
    if (invalidationData) {
      try {
        parsedData = JSON.parse(invalidationData)
      } catch (e) {
        console.warn('무효화 데이터 파싱 실패:', e)
      }
    }

    switch (invalidationType) {
      case 'POST_CREATED':
        manager.triggerInvalidation({
          type: 'POST_CREATED',
          boardKey,
          postData: parsedData
        })
        break

      case 'POST_UPDATED':
        manager.triggerInvalidation({
          type: 'POST_UPDATED',
          boardKey,
          postId: parsedData?.id,
          postData: parsedData
        })
        break

      case 'POST_DELETED':
        manager.triggerInvalidation({
          type: 'POST_DELETED',
          boardKey,
          postId: parsedData?.id
        })
        break

      default:
        console.log('알 수 없는 캐시 무효화 타입:', invalidationType)
    }
  }
}

// fetch 래퍼 (자동 캐시 무효화 처리)
export async function fetchWithCacheInvalidation(url: string, options?: RequestInit) {
  const response = await fetch(url, options)
  
  // 응답 헤더 체크 및 자동 캐시 무효화
  checkAndHandleCacheInvalidation(response)
  
  return response
}

// React Hook - 전역 캐시 무효화 이벤트 구독
export function useCacheInvalidationListener() {
  const manager = CacheInvalidationManager.getInstance()

  useEffect(() => {
    const unsubscribe = manager.addEventListener((event) => {
      console.log('📢 캐시 무효화 이벤트 수신:', event.type, event.boardKey)
    })

    return unsubscribe
  }, [manager])
}
