import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    $: any
    jQuery: any
  }
}

interface SlickOptions {
  slidesToShow?: number
  slidesToScroll?: number
  vertical?: boolean
  autoplay?: boolean
  autoplaySpeed?: number
  arrows?: boolean
  infinite?: boolean
  pauseOnHover?: boolean
  pauseOnFocus?: boolean
}

export const useSlickSlider = (
  selector: string,
  options: SlickOptions,
  dependencies: any[] = []
) => {
  const isInitializedRef = useRef(false)
  const sliderRef = useRef<any>(null)

  useEffect(() => {
    // DOM이 완전히 로드될 때까지 대기
    const initSlider = () => {
      if (typeof window === 'undefined' || !window.$ || !window.$.fn.slick) {
        return
      }

      try {
        const $slider = window.$(selector)
        
        if ($slider.length === 0) {
          return
        }

        sliderRef.current = $slider

        // 이미 초기화된 경우 정리
        if (isInitializedRef.current && $slider.hasClass('slick-initialized')) {
          try {
            $slider.slick('unslick')
          } catch (e) {
            // unslick 실패 시 조용히 무시
            console.warn(`Slick unslick failed for ${selector}`, e)
          }
        }

        // React가 DOM을 완전히 업데이트한 후 슬라이더 초기화
        setTimeout(() => {
          try {
            if ($slider.length > 0 && !$slider.hasClass('slick-initialized')) {
              $slider.slick(options)
              isInitializedRef.current = true
            }
          } catch (error) {
            console.warn(`Slick initialization failed for ${selector}:`, error)
          }
        }, 100)

      } catch (error) {
        console.warn(`Slider setup error for ${selector}:`, error)
      }
    }

    // 데이터 로딩이 완료된 후에만 슬라이더 초기화
    const timer = setTimeout(initSlider, 500)

    return () => {
      clearTimeout(timer)
      // 컴포넌트 언마운트 또는 의존성 변경 시 정리
      if (isInitializedRef.current && sliderRef.current) {
        try {
          if (sliderRef.current.hasClass('slick-initialized')) {
            sliderRef.current.slick('unslick')
          }
        } catch (e) {
          // 정리 실패는 조용히 무시 - React가 DOM을 정리할 것임
        }
        isInitializedRef.current = false
      }
    }
  }, dependencies)

  // 컴포넌트 완전 언마운트 시 최종 정리
  useEffect(() => {
    return () => {
      isInitializedRef.current = false
      sliderRef.current = null
    }
  }, [])
}
