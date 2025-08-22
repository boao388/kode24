import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 성능 모니터링 및 최적화 미들웨어
export function middleware(request: NextRequest) {
  const startTime = Date.now()
  const response = NextResponse.next()

  // 성능 헤더 추가
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`)
  response.headers.set('X-Powered-By', 'Next.js + Vercel')

  // API 라우트에 대한 CORS 헤더 설정
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-verify-token')
  }

  // 정적 자산에 대한 캐싱 헤더
  if (
    request.nextUrl.pathname.startsWith('/assets/') ||
    request.nextUrl.pathname.startsWith('/_next/static/') ||
    request.nextUrl.pathname.startsWith('/_next/image/')
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // 보안 헤더 설정
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  // 개발 환경에서 성능 로깅
  if (process.env.NODE_ENV === 'development') {
    const responseTime = Date.now() - startTime
    if (responseTime > 1000) {
      console.log(`🐌 느린 요청: ${request.nextUrl.pathname} - ${responseTime}ms`)
    }
  }

  return response
}

// 미들웨어 적용 경로 설정
export const config = {
  matcher: [
    // API 라우트
    '/api/:path*',
    // 정적 자산
    '/assets/:path*',
    '/_next/static/:path*',
    '/_next/image/:path*',
    // 페이지 (관리자 페이지 제외)
    '/((?!admin|_next/static|_next/image|favicon.ico).*)',
  ],
}
