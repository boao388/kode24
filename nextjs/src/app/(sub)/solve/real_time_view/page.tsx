'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { isAdminAuthenticated } from '@/lib/auth'
import Link from 'next/link'

interface Reply {
  id: string
  content: string
  authorName: string
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
  board: {
    title: string
    key: string
  }
  reply?: Reply
}

function RealTimeViewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const postId = searchParams.get('id')
  const verified = searchParams.get('verified')
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  // 날짜 형식을 원본과 동일하게 변환하는 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}.${month}.${day} ${hours}:${minutes}`
  }

  const loadPost = useCallback(async () => {
    if (!postId) {
      setError('게시글 ID가 없습니다.')
      setLoading(false)
      return
    }

    // 관리자 권한 확인
    const adminAuth = isAdminAuthenticated()
    setIsAdmin(adminAuth)

    try {
      const response = await fetch(`/api/posts/${postId}`)
      const data = await response.json()

      if (response.ok) {
        // 비밀글이면서 verified가 없고 관리자가 아니면 비밀번호 확인 페이지로 이동
        if (data.isSecret && !verified && !adminAuth) {
          router.push(`/solve/real_time_confirm?id=${postId}&author=${encodeURIComponent(data.authorName)}`)
          return
        }
        setPost(data)
      } else {
        setError(data.message || '게시글을 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('게시글 로딩 실패:', error)
      setError('게시글을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [postId, verified, router])

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
        {/* 원본 HTML 구조와 완전히 동일 */}
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
                    <li>{formatDate(post.createdAt)}</li>
                    <li className="hit">{post.viewCount}</li>
                    <li className="comment">0</li>
                  </ul>
                </div>
                
                <div className="view-body">
                  {post.content ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  ) : (
                    <p>상담요청입니다.</p>
                  )}
                </div>
                
                {/* 관리자 답변 영역 - 원본 HTML 구조와 완전히 동일 */}
                <div className="reply">
                  <div className="reply-top">
                    <b>답변</b>
                    <span className="writer">KODE24</span>
                  </div>
                  <div className="reply-body">
                    {post.reply ? (
                      <div dangerouslySetInnerHTML={{ __html: post.reply.content }} />
                    ) : (
                      <p>답변입니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
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