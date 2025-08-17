'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PostForm from '@/components/common/PostForm'
import PasswordConfirm, { PostData } from '@/components/common/PasswordConfirm'

interface LocalPostData {
  id: string
  title: string
  content: string
  authorName: string
  authorEmail?: string
  isSecret: boolean
  requiresPassword?: boolean
}

function RealTimeModifyContent() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  
  const [post, setPost] = useState<LocalPostData | null>(null)
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
        if (data.requiresPassword) {
          setShowPasswordForm(true)
          setPost({
            id: data.id,
            title: data.title,
            content: '',
            authorName: data.authorName,
            isSecret: data.isSecret
          })
        } else {
          setPost({
            id: data.id,
            title: data.title,
            content: data.content || '',
            authorName: data.authorName,
            authorEmail: data.authorEmail,
            isSecret: data.isSecret
          })
        }
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

  const handlePasswordSuccess = (postData: PostData) => {
    setPost({
      id: postData.id,
      title: postData.title,
      content: postData.content || '',
      authorName: postData.authorName,
      authorEmail: postData.authorEmail,
      isSecret: postData.isSecret
    })
    setShowPasswordForm(false)
  }

  useEffect(() => {
    loadPost()
  }, [postId])

  if (loading) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="board-write-wrap real-time-modify">
            <div className="container">
              <div className="article-header">
                <small className="typed">Real Time Inquiry Modify</small>
                <h3 className="typed">실시간 해결문의 수정</h3>
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

  if (error || !post) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="board-write-wrap real-time-modify">
            <div className="container">
              <div className="article-header">
                <small className="typed">Real Time Inquiry Modify</small>
                <h3 className="typed">실시간 해결문의 수정</h3>
              </div>
              <div className="error-message" style={{ textAlign: 'center', padding: '50px 0', color: '#ff4444' }}>
                {error || '게시글을 찾을 수 없습니다.'}
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
        <article className="board-write-wrap real-time-modify">
          <div className="container">
            <div className="article-header">
              <small className="typed">Real Time Inquiry Modify</small>
              <h3 className="typed">실시간 해결문의 수정</h3>
            </div>
            
            <div className="article-content">
              {showPasswordForm ? (
                <PasswordConfirm
                  postId={post.id}
                  authorName={post.authorName}
                  title={post.title}
                  listUrl="/solve/real_time_list"
                  onSuccess={handlePasswordSuccess}
                  boardType="real_time"
                />
              ) : (
                <PostForm
                  boardKey="real_time"
                  boardTitle="실시간 해결문의"
                  listUrl="/solve/real_time_list"
                  mode="edit"
                  initialData={{
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    authorName: post.authorName,
                    authorEmail: post.authorEmail,
                    isSecret: post.isSecret
                  }}
                  requireAuth={false}
                  showSecretOption={true}
                  className="real-time-modify"
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

export default function RealTimeModifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RealTimeModifyContent />
    </Suspense>
  )
}