'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    TweenMax: {
      to: (target: HTMLElement, duration: number, vars: Record<string, unknown>) => void;
    };
  }
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
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
    // 마우스 이동 처리 - 원본과 동일하게 pageX/pageY 사용
    function onMouseMove(e: MouseEvent) {
      const { $bigBall, $smallBall } = elementsRef.current;
      if (!$bigBall || !$smallBall || typeof window.TweenMax === 'undefined') return;

      // 원본과 동일한 좌표계 사용
      window.TweenMax.to($bigBall, 0.4, {
        x: e.pageX - 15,
        y: e.pageY - 15
      });
      window.TweenMax.to($smallBall, 0.1, {
        x: e.pageX - 5,
        y: e.pageY - 7
      });
    }

    // hover 시 확대 - 원본과 동일
    function onMouseHover() {
      const { $bigBall } = elementsRef.current;
      if (!$bigBall || typeof window.TweenMax === 'undefined') return;
      
      window.TweenMax.to($bigBall, 0.3, { scale: 4 });
    }

    // hover 해제 시 원래 크기 - 원본과 동일
    function onMouseHoverOut() {
      const { $bigBall } = elementsRef.current;
      if (!$bigBall || typeof window.TweenMax === 'undefined') return;
      
      window.TweenMax.to($bigBall, 0.3, { scale: 1 });
    }

    // 커서 초기화 - 원본과 동일 (JavaScript 강제 적용 제거)
    function initCursor() {
      const $bigBall = document.querySelector('.cursor__ball--big') as HTMLElement;
      const $smallBall = document.querySelector('.cursor__ball--small') as HTMLElement;
      const $hoverables = document.querySelectorAll('.hoverable');

      if (!$bigBall || !$smallBall) return;

      // 참조 저장 (JavaScript 강제 스타일 적용 제거)
      elementsRef.current = { $bigBall, $smallBall, $hoverables };

      document.body.addEventListener('mousemove', onMouseMove);
      $hoverables.forEach(el => {
        el.addEventListener('mouseenter', onMouseHover);
        el.addEventListener('mouseleave', onMouseHoverOut);
      });
      isCursorActiveRef.current = true;
    }

    // 커서 제거 - 원본과 동일
    function destroyCursor() {
      const { $hoverables } = elementsRef.current;
      
      document.body.removeEventListener('mousemove', onMouseMove);
      if ($hoverables) {
        $hoverables.forEach(el => {
          el.removeEventListener('mouseenter', onMouseHover);
          el.removeEventListener('mouseleave', onMouseHoverOut);
        });
      }
      isCursorActiveRef.current = false;
    }

    // 처음 실행 시 화면 크기 체크 - 원본과 동일
    function checkCursorActivation() {
      if (window.innerWidth >= 1024) {
        if (!isCursorActiveRef.current) initCursor();
      } else {
        if (isCursorActiveRef.current) destroyCursor();
      }
    }

    // TweenMax 로딩 대기 후 실행 (동적 CSS 스타일 주입 제거)
    const initTimer = setTimeout(() => {
      checkCursorActivation();
    }, 100);

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