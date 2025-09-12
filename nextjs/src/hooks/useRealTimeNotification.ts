'use client'

import { useEffect, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CacheInvalidationManager } from '@/lib/cacheInvalidation'

interface NotificationState {
  hasNewPosts: boolean
  hasUpdatedPosts: boolean
  lastUpdateTime: number
  newPostsCount: number
}

interface UseRealTimeNotificationOptions {
  boardKey: string
  showToast?: boolean
  autoRefresh?: boolean
}

// 실시간 알림 훅
export function useRealTimeNotification({
  boardKey,
  showToast = false,
  autoRefresh = false
}: UseRealTimeNotificationOptions) {
  const queryClient = useQueryClient()
  const [notification, setNotification] = useState<NotificationState>({
    hasNewPosts: false,
    hasUpdatedPosts: false,
    lastUpdateTime: Date.now(),
    newPostsCount: 0
  })

  // 알림 상태 리셋
  const resetNotification = useCallback(() => {
    setNotification({
      hasNewPosts: false,
      hasUpdatedPosts: false,
      lastUpdateTime: Date.now(),
      newPostsCount: 0
    })
  }, [])

  // 수동 새로고침
  const refreshData = useCallback(async () => {
    await queryClient.refetchQueries({
      queryKey: ['posts', 'list', boardKey],
      type: 'active'
    })
    resetNotification()
  }, [queryClient, boardKey, resetNotification])

  // 토스트 알림 표시 (브라우저 알림 API 사용)
  const showNotificationToast = useCallback((title: string, message: string) => {
    if (!showToast || !('Notification' in window)) return

    // 알림 권한 요청
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `post-update-${boardKey}`, // 중복 알림 방지
        silent: true, // 조용한 알림
        requireInteraction: false
      })
    }
  }, [showToast, boardKey])

  useEffect(() => {
    const manager = CacheInvalidationManager.getInstance()

    // 캐시 무효화 이벤트 리스너 등록
    const unsubscribe = manager.addEventListener((event) => {
      // 해당 게시판의 이벤트만 처리
      if (event.boardKey !== boardKey) return

      console.log(`📢 [${boardKey}] 실시간 업데이트:`, event.type)

      switch (event.type) {
        case 'POST_CREATED':
          setNotification(prev => ({
            ...prev,
            hasNewPosts: true,
            newPostsCount: prev.newPostsCount + 1,
            lastUpdateTime: Date.now()
          }))

          showNotificationToast(
            '새 게시글 알림',
            `새로운 게시글이 등록되었습니다: ${event.postData?.title || '제목 없음'}`
          )

          // 자동 새로고침 활성화 시 즉시 데이터 업데이트
          if (autoRefresh) {
            setTimeout(() => refreshData(), 1000) // 1초 후 새로고침
          }
          break

        case 'POST_UPDATED':
          setNotification(prev => ({
            ...prev,
            hasUpdatedPosts: true,
            lastUpdateTime: Date.now()
          }))

          showNotificationToast(
            '게시글 수정 알림',
            '게시글이 수정되었습니다.'
          )

          if (autoRefresh) {
            setTimeout(() => refreshData(), 1000)
          }
          break

        case 'POST_DELETED':
          setNotification(prev => ({
            ...prev,
            hasUpdatedPosts: true,
            lastUpdateTime: Date.now()
          }))

          showNotificationToast(
            '게시글 삭제 알림',
            '게시글이 삭제되었습니다.'
          )

          if (autoRefresh) {
            setTimeout(() => refreshData(), 1000)
          }
          break
      }
    })

    return unsubscribe
  }, [boardKey, showNotificationToast, autoRefresh, refreshData])

  // 페이지 포커스 시 알림 리셋
  useEffect(() => {
    const handleFocus = () => {
      if (notification.hasNewPosts || notification.hasUpdatedPosts) {
        setTimeout(() => resetNotification(), 2000) // 2초 후 알림 리셋
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [notification, resetNotification])

  return {
    notification,
    refreshData,
    resetNotification,
    // 편의 메서드들
    hasUpdates: notification.hasNewPosts || notification.hasUpdatedPosts,
    updateMessage: notification.hasNewPosts 
      ? `새 게시글 ${notification.newPostsCount}개`
      : notification.hasUpdatedPosts 
        ? '게시글이 업데이트됨'
        : null
  }
}

// 알림 배지 컴포넌트용 훅
export function useNotificationBadge(boardKey: string) {
  const { notification, hasUpdates, updateMessage } = useRealTimeNotification({
    boardKey,
    showToast: false,
    autoRefresh: false
  })

  return {
    show: hasUpdates,
    count: notification.newPostsCount,
    message: updateMessage,
    lastUpdate: new Date(notification.lastUpdateTime).toLocaleTimeString()
  }
}

// 자동 새로고침 훅
export function useAutoRefresh(boardKey: string, enabled = true) {
  return useRealTimeNotification({
    boardKey,
    showToast: false,
    autoRefresh: enabled
  })
}

// 토스트 알림 훅  
export function useToastNotification(boardKey: string, enabled = true) {
  return useRealTimeNotification({
    boardKey,
    showToast: enabled,
    autoRefresh: false
  })
}
