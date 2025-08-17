'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PostView from '@/components/common/PostView'
import PasswordConfirm from '@/components/common/PasswordConfirm'

interface Comment {
  id: string
  content: string
  authorName: string
  isSecret: boolean
  isAdmin: boolean
  createdAt: string
}

interface Post {
  id: string
  title: string
  content?: string
  authorName: string
  createdAt: string
  viewCount: number
  isSecret: boolean
  requiresPassword?: boolean
  board: {
    title: string
    key: string
  }
  comments?: Comment[]
}

function KodeViewContent() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const loadPost = async () => {
    if (!postId) {
      setError('게시글 ID가 없습니다.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}`)
      const data = await response.json()

      if (response.ok) {
        setPost(data)
        setShowPasswordForm(data.requiresPassword || false)
      } else {
        setError(data.message || '게시글을 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('게시글 로딩 실패:', error)
      setError('게시글을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSuccess = (postData: Post) => {
    setPost(postData)
    setShowPasswordForm(false)
  }

  useEffect(() => {
    loadPost()
  }, [postId])

  // 로딩 상태
  if (loading) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="board-view-wrap kode-view">
            <div className="container">
              <div className="article-header">
                <small className="typed">Security Report</small>
                <h3 className="typed">코드24 보안리포트</h3>
              </div>
              <div className="loading-message" style={{ textAlign: 'center', padding: '50px 0' }}>
                게시글을 불러오는 중입니다...
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="board-view-wrap kode-view">
            <div className="container">
              <div className="article-header">
                <small className="typed">Security Report</small>
                <h3 className="typed">코드24 보안리포트</h3>
              </div>
              <div className="error-message" style={{ textAlign: 'center', padding: '50px 0', color: '#ff4444' }}>
                {error}
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </>
    )
  }

  // 게시글이 없는 경우
  if (!post) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="board-view-wrap kode-view">
            <div className="container">
              <div className="article-header">
                <small className="typed">Security Report</small>
                <h3 className="typed">코드24 보안리포트</h3>
              </div>
              <div className="error-message" style={{ textAlign: 'center', padding: '50px 0' }}>
                게시글을 찾을 수 없습니다.
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      
      <main id="content">
        <article className="kode-view view-wrap">
          <div className="container">
            <div className="article-header">
              <small className="typed">Kode24 Security Report</small>
              <h3 className="typed">코드24 보안리포트</h3>
              <div className="btn-area">
                <a href="/report/kode_list" className="hoverable">목록</a>
              </div>
            </div>
            
            <div className="article-content">
              {showPasswordForm && post.isSecret ? (
                <PasswordConfirm
                  postId={post.id}
                  authorName={post.authorName}
                  title={post.title}
                  listUrl="/report/kode_list"
                  onSuccess={handlePasswordSuccess}
                  boardType="real_time"
                />
              ) : (
                <PostView
                  postId={post.id}
                  title={post.title}
                  content={post.content || ''}
                  authorName={post.authorName}
                  createdAt={post.createdAt}
                  viewCount={post.viewCount}
                  boardType="kode"
                  listUrl="/report/kode_list"
                  showComments={true}
                  className="kode-view"
                />
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}

export default function KodeViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KodeViewContent />
    </Suspense>
  )
}