import { NextRequest, NextResponse } from 'next/server'

// Edge Runtime 사용으로 빠른 응답
export const runtime = 'edge'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  timestamp: number
  url: string
  userAgent: string
}

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json()

    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vitals Metric:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        url: metric.url,
      })
    }

    // 성능 메트릭 저장 로직 (실제 구현 시 데이터베이스나 분석 서비스로 전송)
    await saveMetricToStorage(metric)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Web Vitals API Error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process metric' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    )
  }
}

// 메트릭 저장 함수 (실제 구현)
async function saveMetricToStorage(metric: WebVitalMetric) {
  // 실제 환경에서는 다음 중 하나를 선택하여 구현:
  
  // 1. 데이터베이스에 저장
  // await prisma.webVitals.create({ data: metric })
  
  // 2. 외부 분석 서비스로 전송 (예: Datadog, New Relic)
  // await sendToDatadog(metric)
  
  // 3. 로그 파일에 저장
  // console.log(JSON.stringify(metric))
  
  // 4. 메모리에 임시 저장 (개발용)
  if (process.env.NODE_ENV === 'development') {
    // 간단한 메모리 저장소
    if (!global.webVitalsStore) {
      global.webVitalsStore = []
    }
    global.webVitalsStore.push({
      ...metric,
      timestamp: new Date().toISOString(),
    })
    
    // 최대 1000개까지만 저장
    if (global.webVitalsStore.length > 1000) {
      global.webVitalsStore = global.webVitalsStore.slice(-1000)
    }
  }
}

// 글로벌 타입 선언
declare global {
  var webVitalsStore: (WebVitalMetric & { timestamp: string })[] | undefined
}
