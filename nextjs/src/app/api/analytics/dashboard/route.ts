import { NextRequest, NextResponse } from 'next/server'

// 성능 대시보드 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '24h' // 24h, 7d, 30d
    
    // 실제 환경에서는 데이터베이스에서 조회
    const performanceData = await getPerformanceData(period)
    
    const dashboard = {
      summary: {
        totalPageViews: performanceData.totalPageViews,
        avgLoadTime: performanceData.avgLoadTime,
        bounceRate: performanceData.bounceRate,
        errorRate: performanceData.errorRate,
      },
      webVitals: {
        lcp: {
          value: performanceData.lcp.avg,
          rating: getRating('LCP', performanceData.lcp.avg),
          trend: performanceData.lcp.trend,
        },
        fid: {
          value: performanceData.fid.avg,
          rating: getRating('FID', performanceData.fid.avg),
          trend: performanceData.fid.trend,
        },
        cls: {
          value: performanceData.cls.avg,
          rating: getRating('CLS', performanceData.cls.avg),
          trend: performanceData.cls.trend,
        },
        fcp: {
          value: performanceData.fcp.avg,
          rating: getRating('FCP', performanceData.fcp.avg),
          trend: performanceData.fcp.trend,
        },
        ttfb: {
          value: performanceData.ttfb.avg,
          rating: getRating('TTFB', performanceData.ttfb.avg),
          trend: performanceData.ttfb.trend,
        },
      },
      topSlowPages: performanceData.topSlowPages,
      recentErrors: performanceData.recentErrors,
      recommendations: generateRecommendations(performanceData),
    }

    return NextResponse.json(dashboard, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5분 캐싱
      },
    })
  } catch (error) {
    console.error('Performance Dashboard API Error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    )
  }
}

// 성능 데이터 조회 (실제 구현)
async function getPerformanceData(period: string) {
  // 실제 환경에서는 데이터베이스에서 조회
  // const data = await prisma.webVitals.findMany({ ... })
  
  // 개발용 더미 데이터
  return {
    totalPageViews: 12543,
    avgLoadTime: 1.2,
    bounceRate: 0.35,
    errorRate: 0.02,
    lcp: { avg: 2.1, trend: -0.3 }, // 개선됨
    fid: { avg: 45, trend: 0.1 },   // 약간 악화
    cls: { avg: 0.08, trend: -0.02 }, // 개선됨
    fcp: { avg: 1.8, trend: -0.1 },  // 개선됨
    ttfb: { avg: 0.4, trend: 0.05 }, // 약간 악화
    topSlowPages: [
      { path: '/solution/initial', avgLoadTime: 3.2, views: 1234 },
      { path: '/admin/dashboard', avgLoadTime: 2.8, views: 567 },
      { path: '/report/kode_list', avgLoadTime: 2.1, views: 890 },
    ],
    recentErrors: [
      { 
        message: 'ChunkLoadError: Loading chunk failed',
        count: 12,
        lastSeen: new Date().toISOString(),
      },
      {
        message: 'TypeError: Cannot read property of undefined',
        count: 8,
        lastSeen: new Date().toISOString(),
      },
    ],
  }
}

// Web Vitals 등급 계산
function getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],    // ms
    FID: [100, 300],      // ms
    CLS: [0.1, 0.25],     // score
    FCP: [1800, 3000],    // ms
    TTFB: [800, 1800],    // ms
  }

  const [good, poor] = thresholds[metric] || [0, 0]
  
  if (value <= good) return 'good'
  if (value <= poor) return 'needs-improvement'
  return 'poor'
}

// 성능 개선 권장사항 생성
function generateRecommendations(data: any) {
  const recommendations = []

  // LCP 개선 권장사항
  if (data.lcp.avg > 2500) {
    recommendations.push({
      type: 'LCP',
      priority: 'high',
      title: 'Largest Contentful Paint 개선 필요',
      description: 'LCP가 2.5초를 초과합니다. 이미지 최적화와 서버 응답 시간 개선이 필요합니다.',
      actions: [
        '이미지를 WebP 형식으로 변환',
        'Critical CSS 인라인 처리',
        'CDN 사용 검토',
        '서버 응답 시간 최적화'
      ]
    })
  }

  // FID 개선 권장사항
  if (data.fid.avg > 100) {
    recommendations.push({
      type: 'FID',
      priority: 'medium',
      title: 'First Input Delay 개선 필요',
      description: 'FID가 100ms를 초과합니다. JavaScript 실행 시간을 줄여야 합니다.',
      actions: [
        'JavaScript 코드 분할',
        '불필요한 JavaScript 제거',
        'Web Workers 활용 검토',
        'Third-party 스크립트 최적화'
      ]
    })
  }

  // CLS 개선 권장사항
  if (data.cls.avg > 0.1) {
    recommendations.push({
      type: 'CLS',
      priority: 'high',
      title: 'Cumulative Layout Shift 개선 필요',
      description: 'CLS가 0.1을 초과합니다. 레이아웃 이동을 줄여야 합니다.',
      actions: [
        '이미지와 비디오에 크기 속성 추가',
        '동적 콘텐츠를 위한 공간 미리 할당',
        '웹폰트 로딩 최적화',
        'Skeleton UI 구현'
      ]
    })
  }

  return recommendations
}
