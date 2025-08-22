'use client'

import { useEffect } from 'react'
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals'

interface WebVitalsProps {
  onMetric?: (metric: Metric) => void
  debug?: boolean
}

export default function WebVitals({ onMetric, debug = false }: WebVitalsProps) {
  useEffect(() => {
    const handleMetric = (metric: Metric) => {
      // 콘솔에 메트릭 출력 (개발 환경)
      if (debug && process.env.NODE_ENV === 'development') {
        console.log(`📊 Web Vital: ${metric.name}`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
        })
      }

      // 사용자 정의 핸들러 호출
      onMetric?.(metric)

      // 성능 데이터를 서버로 전송 (프로덕션 환경)
      if (process.env.NODE_ENV === 'production') {
        sendToAnalytics(metric)
      }
    }

    // Core Web Vitals 측정 (FID는 INP로 대체됨)
    onCLS(handleMetric)
    onINP(handleMetric) // Interaction to Next Paint (FID 대체)
    onFCP(handleMetric)
    onLCP(handleMetric)
    onTTFB(handleMetric)
  }, [onMetric, debug])

  return null
}

// 분석 서비스로 메트릭 전송
function sendToAnalytics(metric: Metric) {
  try {
    // Google Analytics 4로 전송
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Vercel Analytics로 전송
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', 'Web Vitals', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      })
    }

    // 커스텀 API로 전송
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(error => {
      console.error('Failed to send web vitals:', error)
    })
  } catch (error) {
    console.error('Error sending analytics:', error)
  }
}

// 글로벌 gtag 타입 선언
declare global {
  function gtag(...args: any[]): void
}
