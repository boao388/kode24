'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRootPage() {
  const router = useRouter()

  useEffect(() => {
    // 관리자 토큰 확인
    const adminToken = localStorage.getItem('adminToken')
    
    if (!adminToken) {
      // 토큰이 없으면 로그인 페이지로 리디렉트
      router.push('/admin/login')
    } else {
      // 토큰이 있으면 대시보드로 리디렉트
      router.push('/admin/dashboard')
    }
  }, [router])

  // 리디렉트 처리 중 표시할 로딩 화면
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      관리자 페이지로 이동 중...
    </div>
  )
} 