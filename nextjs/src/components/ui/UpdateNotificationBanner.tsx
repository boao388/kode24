'use client'

import React from 'react'
import { useRealTimeNotification } from '@/hooks/useRealTimeNotification'

interface UpdateNotificationBannerProps {
  boardKey: string
  className?: string
}

export default function UpdateNotificationBanner({ 
  boardKey, 
  className = '' 
}: UpdateNotificationBannerProps) {
  const { hasUpdates, updateMessage, refreshData, resetNotification } = useRealTimeNotification({
    boardKey,
    showToast: false,
    autoRefresh: false
  })

  if (!hasUpdates) return null

  return (
    <div className={`update-notification-banner ${className}`}>
      <div 
        className="notification-content"
        style={{
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '8px',
          padding: '12px 16px',
          margin: '10px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 4px rgba(33, 150, 243, 0.1)',
          animation: 'slideDown 0.3s ease-out'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#2196f3',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}
          />
          <span style={{ color: '#1976d2', fontWeight: '500' }}>
            🔄 {updateMessage} - 새로운 내용이 있습니다
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={refreshData}
            className="hoverable"
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#1976d2'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#2196f3'
            }}
          >
            새로고침
          </button>
          <button
            onClick={resetNotification}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#f5f5f5'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'
            }}
          >
            닫기
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
