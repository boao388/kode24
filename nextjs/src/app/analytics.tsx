'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Core Web Vitals 측정
export function WebVitals() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if ('performance' in window && 'PerformanceObserver' in window) {
      // CLS (Cumulative Layout Shift) 측정
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        
        // 개발 환경에서만 콘솔에 출력
        if (process.env.NODE_ENV === 'development' && clsValue > 0) {
          console.log('CLS:', clsValue)
        }

        // 실제 분석 서비스로 전송 (예: Google Analytics)
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'web_vital', {
            name: 'CLS',
            value: clsValue,
            page: pathname
          })
        }
      })

      // FID (First Input Delay) 측정  
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = entry.processingStart - entry.startTime
          
          if (process.env.NODE_ENV === 'development') {
            console.log('FID:', fid)
          }

          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              name: 'FID',
              value: fid,
              page: pathname
            })
          }
        }
      })

      // LCP (Largest Contentful Paint) 측정
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const lcp = entry.startTime
          
          if (process.env.NODE_ENV === 'development') {
            console.log('LCP:', lcp)
          }

          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
              name: 'LCP', 
              value: lcp,
              page: pathname
            })
          }
        }
      })

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        fidObserver.observe({ entryTypes: ['first-input'] })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (error) {
        console.warn('Performance Observer not supported:', error)
      }

      return () => {
        clsObserver.disconnect()
        fidObserver.disconnect()  
        lcpObserver.disconnect()
      }
    }
  }, [pathname, searchParams])

  return null
}

// Google Analytics 4 연동
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!gaId) return

    // 페이지뷰 추적
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [pathname, searchParams, gaId])

  return (
    <>
      <script 
        async 
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} 
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}
