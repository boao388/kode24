import { NextResponse } from 'next/server'

// API 응답 최적화 유틸리티

// 응답 데이터 압축 및 최적화
export function optimizeApiResponse<T>(
  data: T,
  options: {
    cache?: {
      maxAge?: number // 초 단위
      sMaxAge?: number // 초 단위
      staleWhileRevalidate?: number // 초 단위
    }
    compress?: boolean
    removeNullValues?: boolean
    removeEmptyStrings?: boolean
  } = {}
): NextResponse {
  const {
    cache = { maxAge: 300, sMaxAge: 300, staleWhileRevalidate: 600 },
    compress = true,
    removeNullValues = true,
    removeEmptyStrings = true,
  } = options

  // 데이터 정리
  let optimizedData = data
  if (removeNullValues || removeEmptyStrings) {
    optimizedData = cleanObject(data, { removeNullValues, removeEmptyStrings })
  }

  // JSON 응답 생성
  const response = NextResponse.json(optimizedData)

  // 캐싱 헤더 설정
  if (cache.maxAge || cache.sMaxAge) {
    const cacheControl = [
      'public',
      cache.maxAge && `max-age=${cache.maxAge}`,
      cache.sMaxAge && `s-maxage=${cache.sMaxAge}`,
      cache.staleWhileRevalidate && `stale-while-revalidate=${cache.staleWhileRevalidate}`,
    ].filter(Boolean).join(', ')

    response.headers.set('Cache-Control', cacheControl)
    response.headers.set('CDN-Cache-Control', `public, max-age=${cache.maxAge || 300}`)
    response.headers.set('Vercel-CDN-Cache-Control', `public, max-age=${cache.maxAge || 300}`)
  }

  // 압축 헤더 설정
  if (compress) {
    response.headers.set('Content-Encoding', 'gzip')
    response.headers.set('Vary', 'Accept-Encoding')
  }

  // 성능 최적화 헤더
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

// 객체에서 null/빈 값 제거
function cleanObject(
  obj: any,
  options: { removeNullValues?: boolean; removeEmptyStrings?: boolean }
): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item, options)).filter(item => {
      if (options.removeNullValues && (item === null || item === undefined)) {
        return false
      }
      if (options.removeEmptyStrings && item === '') {
        return false
      }
      return true
    })
  }

  if (typeof obj === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = cleanObject(value, options)
      
      // null 값 제거
      if (options.removeNullValues && (cleanedValue === null || cleanedValue === undefined)) {
        continue
      }
      
      // 빈 문자열 제거
      if (options.removeEmptyStrings && cleanedValue === '') {
        continue
      }
      
      cleaned[key] = cleanedValue
    }
    return cleaned
  }

  return obj
}

// 페이지네이션 응답 최적화
export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  },
  cacheOptions?: {
    maxAge?: number
    sMaxAge?: number
    staleWhileRevalidate?: number
  }
) {
  const response = {
    success: true,
    data,
    pagination: {
      ...pagination,
      hasNext: pagination.page < pagination.totalPages,
      hasPrev: pagination.page > 1,
    },
    meta: {
      timestamp: new Date().toISOString(),
      count: data.length,
    },
  }

  return optimizeApiResponse(response, {
    cache: cacheOptions,
    compress: true,
    removeNullValues: true,
    removeEmptyStrings: true,
  })
}

// 에러 응답 최적화
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: any
) {
  const errorResponse = {
    success: false,
    error: {
      message,
      status,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
    },
  }

  const response = NextResponse.json(errorResponse, { status })
  
  // 에러는 캐싱하지 않음
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  
  return response
}

// 성공 응답 최적화
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  cacheOptions?: {
    maxAge?: number
    sMaxAge?: number
    staleWhileRevalidate?: number
  }
) {
  const successResponse = {
    success: true,
    data,
    ...(message && { message }),
    meta: {
      timestamp: new Date().toISOString(),
    },
  }

  return optimizeApiResponse(successResponse, {
    cache: cacheOptions,
    compress: true,
    removeNullValues: true,
    removeEmptyStrings: true,
  })
}

// 데이터 변환 유틸리티
export const dataTransformers = {
  // HTML 태그 제거
  stripHtml: (html: string | null): string => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  },

  // 날짜 포맷팅
  formatDate: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toISOString().split('T')[0] // YYYY-MM-DD
  },

  // 시간 포맷팅
  formatTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  },

  // 텍스트 요약
  summarize: (text: string | null, maxLength: number = 200): string => {
    if (!text) return ''
    const cleaned = dataTransformers.stripHtml(text)
    return cleaned.length > maxLength 
      ? cleaned.substring(0, maxLength) + '...'
      : cleaned
  },

  // 민감한 정보 마스킹
  maskSensitiveData: (data: any): any => {
    if (typeof data !== 'object' || data === null) return data
    
    const masked = { ...data }
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'apiKey']
    
    for (const field of sensitiveFields) {
      if (field in masked) {
        delete masked[field]
      }
    }
    
    return masked
  },
}

// 쿼리 최적화 헬퍼
export const queryOptimizers = {
  // 페이지네이션 파라미터 검증 및 최적화
  optimizePaginationParams: (
    page?: string | null,
    limit?: string | null,
    defaultLimit: number = 10,
    maxLimit: number = 100
  ) => {
    const parsedPage = Math.max(1, parseInt(page || '1'))
    const parsedLimit = Math.min(maxLimit, Math.max(1, parseInt(limit || defaultLimit.toString())))
    const offset = (parsedPage - 1) * parsedLimit

    return {
      page: parsedPage,
      limit: parsedLimit,
      offset,
    }
  },

  // 검색 쿼리 최적화
  optimizeSearchQuery: (search?: string | null) => {
    if (!search) return null
    
    return search
      .trim()
      .replace(/\s+/g, ' ') // 다중 공백 제거
      .substring(0, 100) // 최대 100자로 제한
  },

  // 정렬 파라미터 검증
  validateSortParams: (
    sort?: string | null,
    order?: string | null,
    allowedSortFields: string[] = ['createdAt', 'updatedAt', 'title']
  ) => {
    const validSort = allowedSortFields.includes(sort || '') ? sort : 'createdAt'
    const validOrder = ['asc', 'desc'].includes(order || '') ? order : 'desc'
    
    return {
      sort: validSort,
      order: validOrder as 'asc' | 'desc',
    }
  },
}
