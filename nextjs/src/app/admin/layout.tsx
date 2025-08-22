'use client'

import { useEffect } from 'react'
import '@/styles/sub.css';



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Next.js 15 + React 19 호환 안전한 스크립트 비활성화
    const disableAnimationLibraries = () => {
      if (typeof window === 'undefined') return;

      try {
        // TweenMax 비활성화 (한 번만 실행)
        if ('TweenMax' in window && (window as any).TweenMax) {
          const tweenMax = (window as any).TweenMax;
          if (typeof tweenMax === 'object') {
            tweenMax.killAll = () => {};
            tweenMax.to = () => {};
            tweenMax.from = () => {};
            tweenMax.fromTo = () => {};
            tweenMax.set = () => {};
          }
        }

        // GSAP 비활성화
        if ('gsap' in window) {
          (window as any).gsap = { to: () => {}, from: () => {}, set: () => {} };
        }

        // jQuery 애니메이션 비활성화
        if ('$' in window && (window as any).$?.fn?.animate) {
          (window as any).$.fn.animate = function() { return this; };
        }

      } catch (error) {
        // 오류 무시 (라이브러리가 로드되지 않은 경우)
      }
    };

    // 단일 실행으로 초기화
    const timer = setTimeout(() => {
      disableAnimationLibraries();
    }, 100);

    // cleanup
    return () => {
      clearTimeout(timer);
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