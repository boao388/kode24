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
    let isDestroyed = false // 컴포넌트 파괴 상태 추적
    
    // DOM이 완전히 로드될 때까지 대기
    const initSlider = () => {
      if (isDestroyed || typeof window === 'undefined' || !window.$ || !window.$.fn.slick) {
        return
      }

      try {
        const $slider = window.$(selector)
        
        if ($slider.length === 0) {
          return
        }

        sliderRef.current = $slider

        // 이미 초기화된 경우 안전한 정리
        if (isInitializedRef.current && $slider.hasClass('slick-initialized')) {
          try {
            // DOM이 여전히 존재하는지 확인
            if ($slider.length > 0 && document.contains($slider[0])) {
              $slider.slick('unslick')
            }
          } catch (e) {
            // unslick 실패 시 조용히 무시 - DOM이 이미 제거된 경우
            console.debug(`Slick unslick failed for ${selector}`, e)
          }
        }

        // React가 DOM을 완전히 업데이트한 후 슬라이더 초기화
        setTimeout(() => {
          if (isDestroyed) return // 파괴된 상태면 초기화하지 않음
          
          try {
            // DOM 요소가 여전히 존재하고 초기화되지 않은 경우만 실행
            if ($slider.length > 0 && 
                !$slider.hasClass('slick-initialized') && 
                document.contains($slider[0])) {
              $slider.slick(options)
              isInitializedRef.current = true
            }
          } catch (error) {
            console.debug(`Slick initialization failed for ${selector}:`, error)
          }
        }, 100)

      } catch (error) {
        console.warn(`Slider setup error for ${selector}:`, error)
      }
    }

    // 데이터 로딩이 완료된 후에만 슬라이더 초기화
    const timer = setTimeout(initSlider, 500)

    return () => {
      isDestroyed = true // 파괴 상태 표시
      clearTimeout(timer)
      
      // 컴포넌트 언마운트 또는 의존성 변경 시 안전한 정리
      if (isInitializedRef.current && sliderRef.current) {
        try {
          // DOM이 여전히 존재하는 경우에만 unslick 실행
          if (sliderRef.current.hasClass('slick-initialized') && 
              sliderRef.current.length > 0 && 
              document.contains(sliderRef.current[0])) {
            sliderRef.current.slick('unslick')
          }
        } catch (e) {
          // 정리 실패는 조용히 무시 - React가 DOM을 정리할 것임
          console.debug(`Slick cleanup failed for ${selector}`, e)
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
