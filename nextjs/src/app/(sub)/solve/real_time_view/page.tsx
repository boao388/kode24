'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PasswordConfirm from '@/components/common/PasswordConfirm'
import Link from 'next/link'

interface Reply {
  id: string
  content: string
  authorName: string
  createdAt: string
}

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
  reply?: Reply
}

function RealTimeViewContent() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const loadPost = useCallback(async () => {
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
  }, [postId])

  const handlePasswordSuccess = (postData: any) => {
    setPost(postData)
    setShowPasswordForm(false)
  }

  useEffect(() => {
    loadPost()
  }, [loadPost])

  // 로딩 상태
  if (loading) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="real-time-view view-wrap">
            <div className="container">
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
          <article className="real-time-view view-wrap">
            <div className="container">
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
          <article className="real-time-view view-wrap">
            <div className="container">
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
        {showPasswordForm && post.isSecret ? (
          <PasswordConfirm
            postId={post.id}
            authorName={post.authorName}
            title={post.title}
            listUrl="/solve/real_time_list"
            onSuccess={handlePasswordSuccess}
            boardType="real_time"
          />
        ) : (
          <article className="real-time-view view-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Live Inquiries</small>
                <h3 className="typed">실시간 해결 문의</h3>
                <div className="btn-area">
                  <Link href="/solve/real_time_list" className="hoverable">목록</Link>
                  <Link href={`/solve/real_time_modify?id=${post.id}`} className="hoverable">수정</Link>
                  <Link href="/solve/real_time_write" className="hoverable">글쓰기</Link>
                </div>
              </div>
              
              <div className="article-content">
                <div className="board-view">
                  <div className="view-header">
                    <b className="title">{post.title}</b>
                    <p className="writer">{post.authorName}</p>
                    <ul className="info">
                      <li>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</li>
                      <li className="hit">{post.viewCount}</li>
                      <li className="comment">{post.comments?.length || 0}</li>
                    </ul>
                  </div>
                  
                  <div className="view-body">
                    <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                  </div>
                  
                  {/* 관리자 답변 영역 - 원본 HTML 구조와 동일 */}
                  {post.reply && (
                    <div className="reply">
                      <div className="reply-top">
                        <b>답변</b>
                        <span className="writer">KODE24</span>
                      </div>
                      <div className="reply-body">
                        <div dangerouslySetInnerHTML={{ __html: post.reply.content }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </>
  )
}

export default function RealTimeViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RealTimeViewContent />
    </Suspense>
  )
}