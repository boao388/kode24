import type { Metadata } from "next";
import '@/styles/sub.css';

export const metadata: Metadata = {
  title: "관리자 페이지 - KODE24",
  description: "KODE24 관리자 페이지",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="admin-layout" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // 관리자 페이지에서 TweenMax 및 커서 기능 비활성화
            if (typeof window !== 'undefined') {
              // TweenMax 함수들을 빈 함수로 오버라이드
              if (window.TweenMax) {
                window.TweenMax.to = function() {};
                window.TweenMax.from = function() {};
                window.TweenMax.fromTo = function() {};
                window.TweenMax.set = function() {};
              }
              
              // 커서 관련 이벤트 리스너 제거
              document.addEventListener('DOMContentLoaded', function() {
                const cursorElements = document.querySelectorAll('.cursor, .cursor__ball');
                cursorElements.forEach(el => {
                  if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                  }
                });
              });
            }
          `,
        }}
      />
      <style jsx global>{`
        /* 관리자 페이지에서 커스텀 커서 완전 비활성화 */
        .admin-layout .cursor,
        .admin-layout .cursor__ball,
        .admin-layout .cursor__ball--big,
        .admin-layout .cursor__ball--small {
          display: none !important;
          pointer-events: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
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