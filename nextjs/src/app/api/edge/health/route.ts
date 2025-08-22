import { NextRequest } from 'next/server'

// Edge Runtime 사용으로 빠른 응답
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  // 기본 헬스 체크
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime?.() || 0,
    memory: process.memoryUsage?.() || null,
    responseTime: Date.now() - startTime,
    region: process.env.VERCEL_REGION || 'unknown',
    environment: process.env.NODE_ENV || 'development',
  }

  return new Response(JSON.stringify(health), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Powered-By': 'Vercel Edge Functions',
    },
  })
}
