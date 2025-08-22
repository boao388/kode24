'use client'

import { useEffect } from 'react'
import '@/styles/sub.css';



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // TweenMax 완전 비활성화
    const disableTweenMax = () => {
      if (typeof window !== 'undefined' && 'TweenMax' in window) {
        // TweenMax 함수들을 빈 함수로 완전히 오버라이드
        const tweenMax = (window as unknown as Record<string, unknown>).TweenMax as Record<string, unknown>;
        if (tweenMax) {
          tweenMax.to = () => {};
          if ('from' in tweenMax) tweenMax.from = () => {};
          if ('fromTo' in tweenMax) tweenMax.fromTo = () => {};
          if ('set' in tweenMax) tweenMax.set = () => {};
          if ('killAll' in tweenMax) tweenMax.killAll = () => {};
        }
      }
    };

    // 커서 요소 완전 제거
    const removeCursorElements = () => {
      const cursorElements = document.querySelectorAll('.cursor, .cursor__ball, .cursor__ball--big, .cursor__ball--small');
      cursorElements.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };

    // 즉시 실행
    disableTweenMax();
    removeCursorElements();

    // DOM 변경 감지하여 지속적으로 제거
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const element = node as Element;
            if (element.matches && element.matches('.cursor, .cursor__ball, .cursor__ball--big, .cursor__ball--small')) {
              element.remove();
            }
            // 자식 요소들도 확인
            const childCursors = element.querySelectorAll?.('.cursor, .cursor__ball, .cursor__ball--big, .cursor__ball--small');
            childCursors?.forEach(cursor => cursor.remove());
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 주기적으로 커서 요소 제거 (강력한 보장)
    const interval = setInterval(() => {
      disableTweenMax();
      removeCursorElements();
    }, 100);

    // cleanup
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="admin-layout" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
        {children}
      </div>

      <style jsx global>{`
        /* 관리자 페이지에서 커스텀 커서 완전 비활성화 */
        .admin-layout .cursor,
        .admin-layout .cursor__ball,
        .admin-layout .cursor__ball--big,
        .admin-layout .cursor__ball--small,
        .cursor,
        .cursor__ball,
        .cursor__ball--big,
        .cursor__ball--small {
          display: none !important;
          pointer-events: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          position: fixed !important;
          top: -9999px !important;
          left: -9999px !important;
          width: 0 !important;
          height: 0 !important;
          z-index: -9999 !important;
        }
        
        /* 관리자 페이지에서 기본 커서 사용 */
        .admin-layout,
        .admin-layout * {
          cursor: auto !important;
        }
        
        /* 버튼과 링크는 pointer 커서 유지 */
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
        .admin-layout select {
          cursor: pointer !important;
        }
        
        /* 비활성화된 요소들 */
        .admin-layout button:disabled,
        .admin-layout .pagination-btn:disabled {
          cursor: not-allowed !important;
        }
        
        /* 텍스트 입력 필드 */
        .admin-layout input[type="text"],
        .admin-layout input[type="email"],
        .admin-layout input[type="password"],
        .admin-layout input[type="url"],
        .admin-layout input[type="number"],
        .admin-layout input[type="date"],
        .admin-layout textarea {
          cursor: text !important;
        }
      `}</style>
    </>
  );
} 