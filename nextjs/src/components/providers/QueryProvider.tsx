'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, ReactNode } from 'react'

interface QueryProviderProps {
  children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // 각 사용자 세션마다 새로운 QueryClient 인스턴스 생성
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // 5분간 데이터를 fresh로 유지 (서버 요청 없이 캐시 사용)
        staleTime: 5 * 60 * 1000, // 5분
        // 30분간 캐시 유지 (백그라운드에서 자동 갱신)
        gcTime: 30 * 60 * 1000, // 30분
        // 네트워크 에러 시 3번 재시도
        retry: (failureCount, error: any) => {
          // 4xx 에러는 재시도하지 않음 (클라이언트 에러)
          if (error?.status >= 400 && error?.status < 500) {
            return false
          }
          // 최대 3번까지 재시도
          return failureCount < 3
        },
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
        retry: (failureCount, error: any) => {
          // 4xx 에러는 재시도하지 않음
          if (error?.status >= 400 && error?.status < 500) {
            return false
          }
          return failureCount < 3
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 DevTools 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}
