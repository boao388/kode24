'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalPosts: number
  totalComments: number
  pendingComments: number
  recentPosts: Array<{
    id: string
    title: string
    boardTitle: string
    authorName: string
    createdAt: string
  }>
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
    try {
      // 실제로는 API를 호출해야 하지만 현재는 목업 데이터 사용
      setStats({
        totalPosts: 156,
        totalComments: 342,
        pendingComments: 8,
        recentPosts: [
          {
            id: '1',
            title: '몸캠피싱 피해 긴급 상담 요청',
            boardTitle: '실시간 해결문의',
            authorName: '김○○',
            createdAt: '2024-01-20'
          },
          {
            id: '2', 
            title: 'KODE24 덕분에 완전히 해결되었습니다',
            boardTitle: '솔루션 진행 후기',
            authorName: '이○○',
            createdAt: '2024-01-19'
          },
          {
            id: '3',
            title: '신종 AI 딥페이크 피싱 급증 경보',
            boardTitle: '보안 이슈',
            authorName: 'KODE24',
            createdAt: '2024-01-18'
          }
        ]
      })

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
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <div className="stat-number">{stats?.totalPosts}</div>
              <div className="stat-label">총 게시글</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <div className="stat-number">{stats?.totalComments}</div>
              <div className="stat-label">총 댓글</div>
            </div>
          </div>
          
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-number">{stats?.pendingComments}</div>
              <div className="stat-label">승인 대기 댓글</div>
            </div>
          </div>
        </div>

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
            </div>
          </section>

          <section className="section">
            <h2>최근 게시글</h2>
            <div className="recent-posts">
              {stats?.recentPosts.map(post => (
                <div key={post.id} className="recent-post-item">
                  <div className="post-info">
                    <div className="post-title">{post.title}</div>
                    <div className="post-meta">
                      <span className="board-name">{post.boardTitle}</span>
                      <span className="author">{post.authorName}</span>
                      <span className="date">{post.createdAt}</span>
                    </div>
                  </div>
                  <div className="post-actions">
                    <Link href={`/admin/posts/edit/${post.id}`} className="edit-btn">
                      수정
                    </Link>
                  </div>
                </div>
              ))}
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-card.pending {
          border-left: 4px solid #ffc107;
        }

        .stat-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 50%;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
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