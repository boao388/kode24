'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createAuthHeaders } from '@/lib/auth'

interface DashboardStats {
  overview: {
    totalPosts: number
    totalComments: number
    totalFaqs: number
    totalSnsChannels: number
    recentPosts: number
    secretPosts: number
    featuredPosts: number
  }
  boards: Array<{
    name: string
    posts: number
    comments: number
  }>
  activity: {
    recentPostsWeek: number
    totalEngagement: number
    avgCommentsPerPost: number
  }
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminInfo, setAdminInfo] = useState<{
    name: string
    email: string
    role: string
  } | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    let isMounted = true // 컴포넌트 마운트 상태 추적
    
    try {
      // 관리자 토큰 확인
      const adminToken = localStorage.getItem('adminToken')
      if (!adminToken) {
        if (isMounted) router.push('/admin/login')
        return
      }

      // 대시보드 통계 API 호출
      const response = await fetch('/api/admin/dashboard', {
        headers: createAuthHeaders()
      })

      if (response.ok) {
        const dashboardData = await response.json()
        setStats(dashboardData)
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken')
        if (isMounted) router.push('/admin/login')
      } else {
        console.error('대시보드 데이터 로드 실패')
      }

      setAdminInfo({
        name: 'KODE24 관리자',
        email: 'admin@kode24.co.kr',
        role: 'SUPER_ADMIN'
      })
    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      router.push('/admin/login')
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loading-message">대시보드를 로딩 중입니다...</div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <Link href="/">
            <img src="/assets/images/img_logo.svg" alt="KODE24" className="logo" />
          </Link>
          <h1>관리자 대시보드</h1>
        </div>
        <div className="header-right">
          <span className="admin-name">{adminInfo?.name}</span>
          <button onClick={handleLogout} className="logout-btn">로그아웃</button>
        </div>
      </header>

      <div className="dashboard-content">
        {stats && (
          <>
            <div className="dashboard-overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{stats.overview.totalPosts}</div>
                  <div className="stat-label">총 게시글</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.overview.totalComments}</div>
                  <div className="stat-label">총 댓글</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.overview.totalFaqs}</div>
                  <div className="stat-label">FAQ</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.overview.totalSnsChannels}</div>
                  <div className="stat-label">SNS 채널</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.overview.recentPosts}</div>
                  <div className="stat-label">최근 7일 게시글</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.overview.secretPosts}</div>
                  <div className="stat-label">비밀글</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.overview.featuredPosts}</div>
                  <div className="stat-label">중요 공지</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.activity.avgCommentsPerPost}</div>
                  <div className="stat-label">평균 댓글 수</div>
                </div>
              </div>
            </div>

            <div className="dashboard-boards">
              <h3>게시판별 통계</h3>
              <div className="boards-grid">
                {stats.boards.map((board, index) => (
                  <div key={index} className="board-card">
                    <div className="board-name">{board.name}</div>
                    <div className="board-stats">
                      <span>게시글: {board.posts}</span>
                      <span>댓글: {board.comments}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="dashboard-sections">
          <section className="section">
            <h2>게시판 관리</h2>
            <div className="action-grid">
              <Link href="/admin/posts/kode_report" className="action-card">
                <div className="action-icon">🛡️</div>
                <div className="action-title">코드24 보안리포트</div>
                <div className="action-desc">보안 리포트 관리</div>
              </Link>
              
              <Link href="/admin/posts/app_report" className="action-card">
                <div className="action-icon">📱</div>
                <div className="action-title">악성 앱 분석</div>
                <div className="action-desc">악성 앱 분석 리포트 관리</div>
              </Link>
              
              <Link href="/admin/posts/issue_report" className="action-card">
                <div className="action-icon">⚠️</div>
                <div className="action-title">보안 이슈</div>
                <div className="action-desc">보안 이슈 관리</div>
              </Link>
              
              <Link href="/admin/posts/notice" className="action-card">
                <div className="action-icon">📢</div>
                <div className="action-title">공지사항</div>
                <div className="action-desc">공지사항 관리</div>
              </Link>
              
              <Link href="/admin/posts/real_time" className="action-card">
                <div className="action-icon">🚨</div>
                <div className="action-title">실시간 해결문의</div>
                <div className="action-desc">문의 관리 및 답변</div>
              </Link>
              
              <Link href="/admin/posts/review" className="action-card">
                <div className="action-icon">⭐</div>
                <div className="action-title">솔루션 진행 후기</div>
                <div className="action-desc">후기 관리</div>
              </Link>
              
              <Link href="/admin/faqs" className="action-card">
                <div className="action-icon">❓</div>
                <div className="action-title">자주묻는질문</div>
                <div className="action-desc">FAQ 관리</div>
              </Link>
              
              <Link href="/admin/posts/press" className="action-card">
                <div className="action-icon">📰</div>
                <div className="action-title">보도자료</div>
                <div className="action-desc">보도자료 관리</div>
              </Link>
              
              <Link href="/admin/posts/patent" className="action-card">
                <div className="action-icon">🏆</div>
                <div className="action-title">인증특허</div>
                <div className="action-desc">인증특허 관리</div>
              </Link>
              
              <Link href="/admin/sns-channels" className="action-card">
                <div className="action-icon">📱</div>
                <div className="action-title">SNS 채널</div>
                <div className="action-desc">SNS 채널 관리</div>
              </Link>
            </div>
          </section>

          <section className="section">
            <h2>활동 통계</h2>
            <div className="activity-stats">
              <div className="activity-item">
                <span className="label">최근 7일 게시글:</span>
                <span className="value">{stats?.activity.recentPostsWeek || 0}개</span>
              </div>
              <div className="activity-item">
                <span className="label">총 참여도:</span>
                <span className="value">{stats?.activity.totalEngagement || 0}</span>
              </div>
              <div className="activity-item">
                <span className="label">게시글당 평균 댓글:</span>
                <span className="value">{stats?.activity.avgCommentsPerPost || 0}개</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #dee2e6;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          height: 32px;
        }

        .header-left h1 {
          color: #333;
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-name {
          color: #666;
          font-weight: 500;
        }

        .logout-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .logout-btn:hover {
          background: #c82333;
        }

        .dashboard-content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-overview {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #666;
          font-size: 0.8rem;
        }

        .dashboard-boards {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .dashboard-boards h3 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .boards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .board-card {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .board-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

                 .board-stats {
           font-size: 0.9rem;
           color: #666;
         }

         .activity-stats {
           display: flex;
           flex-direction: column;
           gap: 1rem;
         }

         .activity-item {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 0.75rem;
           background: #f8f9fa;
           border-radius: 8px;
         }

         .activity-item .label {
           color: #666;
           font-weight: 500;
         }

         .activity-item .value {
           color: #333;
           font-weight: 600;
         }

        .section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .section h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .action-card {
          display: block;
          padding: 1.5rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .action-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
        }

        .action-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .action-title {
          color: #333;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .action-desc {
          color: #666;
          font-size: 0.9rem;
        }

        .recent-posts {
          space-y: 1rem;
        }

        .recent-post-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .post-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .post-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #666;
        }

        .board-name {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .edit-btn {
          background: #007bff;
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.85rem;
          transition: background 0.3s;
        }

        .edit-btn:hover {
          background: #0056b3;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .loading-message {
          font-size: 1.1rem;
          color: #666;
        }
      `}</style>
    </div>
  )
} 