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

function ReviewConfirmContent() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const loadPost = async () => {
    if (!postId) {
      setError('후기 ID가 없습니다.')
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
        setError(data.message || '후기를 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('후기 로딩 실패:', error)
      setError('후기를 불러오는 중 오류가 발생했습니다.')
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
          <article className="pw-confirm-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Review Confirm</small>
                <h3 className="typed">후기 확인</h3>
              </div>
              <div className="loading-message" style={{ textAlign: 'center', padding: '50px 0' }}>
                후기를 불러오는 중입니다...
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
          <article className="pw-confirm-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Review Confirm</small>
                <h3 className="typed">후기 확인</h3>
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
          <article className="pw-confirm-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Review Confirm</small>
                <h3 className="typed">후기 확인</h3>
              </div>
              <div className="error-message" style={{ textAlign: 'center', padding: '50px 0' }}>
                후기를 찾을 수 없습니다.
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
            listUrl="/solve/review_list"
            onSuccess={handlePasswordSuccess}
            boardType="review"
          />
        ) : (
          <article className="board-view-wrap review-view">
            <div className="container">
              <div className="article-header">
                <small className="typed">Review</small>
                <h3 className="typed">솔루션 진행 후기</h3>
              </div>
              
              <div className="article-content">
                <PostView
                  postId={post.id}
                  title={post.title}
                  content={post.content || ''}
                  authorName={post.authorName}
                  createdAt={post.createdAt}
                  viewCount={post.viewCount}
                  boardType="review"
                  listUrl="/solve/review_list"
                  showComments={true}
                  className="review-view"
                />
              </div>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </>
  )
}

export default function ReviewConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewConfirmContent />
    </Suspense>
  )
}