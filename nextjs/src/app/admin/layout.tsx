'use client'

import { useEffect } from 'react'
import '@/styles/sub.css';



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Next.js 15 App Router와 호환되는 안전한 스크립트 및 DOM 관리
    const safelyDisableScripts = () => {
      if (typeof window === 'undefined') return;

      try {
        // TweenMax/GSAP 비활성화
        if ('TweenMax' in window) {
          const tweenMax = (window as any).TweenMax;
          if (tweenMax && typeof tweenMax === 'object') {
            tweenMax.killAll = () => {};
            tweenMax.to = () => {};
            tweenMax.from = () => {};
            tweenMax.fromTo = () => {};
            tweenMax.set = () => {};
          }
        }

        // 기타 애니메이션 라이브러리 비활성화
        if ('gsap' in window) {
          (window as any).gsap = { to: () => {}, from: () => {}, set: () => {} };
        }

        // jQuery 애니메이션 비활성화 (필요시)
        if ('$' in window && (window as any).$ && (window as any).$.fn) {
          const $ = (window as any).$;
          if ($.fn.animate) {
            $.fn.animate = function() { return this; };
          }
        }

        // 커스텀 스크립트 비활성화
        ['initCursor', 'initMainScripts', 'initCommonScripts'].forEach(funcName => {
          if (funcName in window) {
            (window as any)[funcName] = () => {};
          }
        });

      } catch (error) {
        console.warn('스크립트 비활성화 중 오류:', error);
      }
    };

    // 안전한 DOM 요소 제거
    const safelyCleanupDOMElements = () => {
      if (typeof window === 'undefined' || !document.body) return;

      try {
        // 커서 관련 요소 제거
        const cursorSelectors = ['.cursor', '.cursor__ball', '.cursor__ball--big', '.cursor__ball--small'];
        cursorSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            try {
              if (el && el.parentNode && el.parentNode.contains(el)) {
                el.remove();
              }
            } catch (removeError) {
              // DOM 조작 오류 무시 (Next.js 15 호환성)
            }
          });
        });

        // 기타 애니메이션 관련 요소 정리
        const animationElements = document.querySelectorAll('[data-aos], .aos-animate, .swiper-container');
        animationElements.forEach(el => {
          try {
            if (el) {
              el.removeAttribute('data-aos');
              el.classList.remove('aos-animate');
            }
          } catch (error) {
            // 속성 제거 오류 무시
          }
        });

      } catch (error) {
        console.warn('DOM 정리 중 오류:', error);
      }
    };

    // 안전한 초기화 실행
    const initializeAdminEnvironment = () => {
      safelyDisableScripts();
      safelyCleanupDOMElements();
    };

    // DOM 완전 로드 후 초기화
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAdminEnvironment);
    } else {
      // 이미 로드된 경우 지연 실행
      setTimeout(initializeAdminEnvironment, 50);
    }

    // 주기적 정리 (더 안전한 간격)
    const intervalId = setInterval(() => {
      safelyDisableScripts();
      safelyCleanupDOMElements();
    }, 2000);

    // cleanup
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('DOMContentLoaded', initializeAdminEnvironment);
    };
  }, []);

  return (
    <>
      {/* Next.js 15 App Router 호환 관리자 환경 격리 */}
      <div 
        className="admin-layout" 
        style={{ 
          backgroundColor: '#f8f9fa', 
          minHeight: '100vh', 
          color: '#333',
          isolation: 'isolate' // CSS isolation으로 스타일 격리
        }}
        data-admin-zone="true" // 관리자 영역 마커
      >
        {children}
      </div>

      <style jsx global>{`
        /* Next.js 15 호환 관리자 페이지 스타일 격리 */
        [data-admin-zone="true"] {
          /* 전역 애니메이션 완전 차단 */
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }

        /* 커서 관련 요소 완전 제거 */
        .admin-layout .cursor,
        .admin-layout .cursor__ball,
        .admin-layout .cursor__ball--big,
        .admin-layout .cursor__ball--small,
        [data-admin-zone="true"] .cursor,
        [data-admin-zone="true"] .cursor__ball,
        [data-admin-zone="true"] .cursor__ball--big,
        [data-admin-zone="true"] .cursor__ball--small {
          display: none !important;
          pointer-events: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          position: absolute !important;
          top: -10000px !important;
          left: -10000px !important;
          width: 0 !important;
          height: 0 !important;
          z-index: -10000 !important;
          transform: none !important;
        }
        
        /* 관리자 페이지에서 기본 커서 강제 사용 */
        .admin-layout,
        .admin-layout *,
        [data-admin-zone="true"],
        [data-admin-zone="true"] * {
          cursor: auto !important;
        }
        
        /* 인터랙티브 요소들은 적절한 커서 유지 */
        .admin-layout button,
        .admin-layout a,
        .admin-layout .btn-primary,
        .admin-layout .btn-secondary,
        .admin-layout .btn-search,
        .admin-layout .btn-reset,
        .admin-layout .btn-view-small,
        .admin-layout .btn-edit-small,
        .admin-layout .btn-delete-small,
        .admin-layout .btn-edit,
        .admin-layout .btn-delete,
        .admin-layout .pagination-btn,
        .admin-layout .logout-btn,
        .admin-layout .back-btn,
        .admin-layout .create-btn,
        .admin-layout .submit-btn,
        .admin-layout .cancel-btn,
        .admin-layout .login-button,
        .admin-layout .checkbox-label,
        .admin-layout input[type="checkbox"],
        .admin-layout select,
        [data-admin-zone="true"] button,
        [data-admin-zone="true"] a,
        [data-admin-zone="true"] input[type="checkbox"],
        [data-admin-zone="true"] select {
          cursor: pointer !important;
        }
        
        /* 비활성화된 요소들 */
        .admin-layout button:disabled,
        .admin-layout .pagination-btn:disabled,
        [data-admin-zone="true"] button:disabled {
          cursor: not-allowed !important;
        }
        
        /* 텍스트 입력 필드 */
        .admin-layout input[type="text"],
        .admin-layout input[type="email"],
        .admin-layout input[type="password"],
        .admin-layout input[type="url"],
        .admin-layout input[type="number"],
        .admin-layout input[type="date"],
        .admin-layout textarea,
        [data-admin-zone="true"] input[type="text"],
        [data-admin-zone="true"] input[type="email"],
        [data-admin-zone="true"] input[type="password"],
        [data-admin-zone="true"] input[type="url"],
        [data-admin-zone="true"] input[type="number"],
        [data-admin-zone="true"] input[type="date"],
        [data-admin-zone="true"] textarea {
          cursor: text !important;
        }

        /* Swiper, Slick 등 외부 라이브러리 비활성화 */
        [data-admin-zone="true"] .swiper-container,
        [data-admin-zone="true"] .slick-slider,
        [data-admin-zone="true"] .aos-animate {
          pointer-events: none !important;
          display: none !important;
        }

        /* 스크립트 오류 방지를 위한 추가 격리 */
        [data-admin-zone="true"] [data-aos],
        [data-admin-zone="true"] [data-swiper],
        [data-admin-zone="true"] [data-slick] {
          display: none !important;
        }
      `}</style>
    </>
  );
} 