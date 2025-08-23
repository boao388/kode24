'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    TweenMax: {
      to: (target: HTMLElement, duration: number, vars: Record<string, unknown>) => void;
    };
  }
}

export default function CustomCursor() {
  const pathname = usePathname()
  
  // 관리자 페이지에서는 커서 비활성화
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }
  
  const isCursorActiveRef = useRef(false)
  const elementsRef = useRef<{
    $bigBall: HTMLElement | null;
    $smallBall: HTMLElement | null;
    $hoverables: NodeListOf<Element> | null;
  }>({
    $bigBall: null,
    $smallBall: null,
    $hoverables: null
  })

  useEffect(() => {
    // 마우스 이동 처리 - 안전한 TweenMax 사용
    function onMouseMove(e: MouseEvent) {
      const { $bigBall, $smallBall } = elementsRef.current;
      if (!$bigBall || !$smallBall || typeof window.TweenMax === 'undefined') return;

      // DOM 요소가 여전히 존재하는지 확인
      if (!document.contains($bigBall) || !document.contains($smallBall)) return;

      try {
        // 원본과 동일한 좌표계 사용
        window.TweenMax.to($bigBall, 0.4, {
          x: e.pageX - 15,
          y: e.pageY - 15
        });
        window.TweenMax.to($smallBall, 0.1, {
          x: e.pageX - 5,
          y: e.pageY - 7
        });
      } catch (error) {
        console.debug('TweenMax animation error:', error);
      }
    }

    // hover 시 확대 - 안전한 TweenMax 사용
    function onMouseHover() {
      const { $bigBall } = elementsRef.current;
      if (!$bigBall || typeof window.TweenMax === 'undefined') return;
      if (!document.contains($bigBall)) return;
      
      try {
        window.TweenMax.to($bigBall, 0.3, { scale: 4 });
      } catch (error) {
        console.debug('TweenMax hover error:', error);
      }
    }

    // hover 해제 시 원래 크기 - 안전한 TweenMax 사용
    function onMouseHoverOut() {
      const { $bigBall } = elementsRef.current;
      if (!$bigBall || typeof window.TweenMax === 'undefined') return;
      if (!document.contains($bigBall)) return;
      
      try {
        window.TweenMax.to($bigBall, 0.3, { scale: 1 });
      } catch (error) {
        console.debug('TweenMax hover out error:', error);
      }
    }

    // 커서 초기화 - 안전성 개선
    function initCursor() {
      const $bigBall = document.querySelector('.cursor__ball--big') as HTMLElement;
      const $smallBall = document.querySelector('.cursor__ball--small') as HTMLElement;
      const $hoverables = document.querySelectorAll('.hoverable');

      if (!$bigBall || !$smallBall) return;

      // 참조 저장
      elementsRef.current = { $bigBall, $smallBall, $hoverables };

      // 안전한 이벤트 리스너 등록
      if (document.body) {
        document.body.addEventListener('mousemove', onMouseMove);
      }
      
      $hoverables.forEach(el => {
        if (el && el.addEventListener) {
          el.addEventListener('mouseenter', onMouseHover);
          el.addEventListener('mouseleave', onMouseHoverOut);
        }
      });
      isCursorActiveRef.current = true;
    }

    // 커서 제거 - 안전성 개선
    function destroyCursor() {
      const { $hoverables } = elementsRef.current;
      
      // DOM 요소 존재 확인 후 이벤트 리스너 제거
      if (document.body) {
        document.body.removeEventListener('mousemove', onMouseMove);
      }
      
      if ($hoverables) {
        $hoverables.forEach(el => {
          // 각 요소가 여전히 DOM에 존재하는지 확인
          if (el && el.removeEventListener) {
            el.removeEventListener('mouseenter', onMouseHover);
            el.removeEventListener('mouseleave', onMouseHoverOut);
          }
        });
      }
      isCursorActiveRef.current = false;
    }

    // 처음 실행 시 화면 크기 체크 - 안전성 강화
    function checkCursorActivation() {
      // 페이지가 완전히 로드되기 전에는 실행하지 않음
      if (document.readyState === 'loading') return;
      
      if (window.innerWidth >= 1024) {
        if (!isCursorActiveRef.current) initCursor();
      } else {
        if (isCursorActiveRef.current) destroyCursor();
      }
    }

    // TweenMax 로딩 대기 후 실행 - 안전한 타이밍
    const checkTweenMaxAndInit = () => {
      if (typeof window.TweenMax !== 'undefined') {
        checkCursorActivation();
      } else {
        // TweenMax가 로드되지 않았으면 다시 시도
        setTimeout(checkTweenMaxAndInit, 50);
      }
    };
    
    const initTimer = setTimeout(checkTweenMaxAndInit, 100);

    // 리사이즈 이벤트 등록 - 원본과 동일
    window.addEventListener('resize', checkCursorActivation);

    // cleanup
    return () => {
      clearTimeout(initTimer);
      destroyCursor();
      window.removeEventListener('resize', checkCursorActivation);
    };
  }, [])

  // 원본 HTML 구조와 100% 동일하게 복원
  return (
    <div className="cursor">
      <div className="cursor__ball cursor__ball--big">
        <svg height="30" width="30">
          <circle cx="15" cy="15" r="12" strokeWidth="0"></circle>
        </svg>
      </div>
      <div className="cursor__ball cursor__ball--small">
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="4" strokeWidth="0"></circle>
        </svg>
      </div>
    </div>
  )
} 