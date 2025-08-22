'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PasswordConfirm, { PostData } from '@/components/common/PasswordConfirm'
import { isAdminAuthenticated } from '@/lib/auth'

interface LocalPostData {
  id: string
  title: string
  content: string
  authorName: string
  authorEmail?: string
  isSecret: boolean
  requiresPassword?: boolean
  phone?: string
}

interface PostDataWithMetadata extends PostData {
  metadata?: {
    phone?: string
  }
}

// 수정 폼 컴포넌트
function RealTimeModifyForm({ post }: { post: LocalPostData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    authorName: post.authorName || '',
    password: '',
    authorEmail: post.authorEmail || '',
    phone: post.phone || '',
    title: post.title || '',
    content: post.content || ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.authorName || !formData.title || !formData.content) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      // 헤더 설정
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      // 관리자 토큰 또는 사용자 인증 토큰 추가
      const adminAuth = isAdminAuthenticated()
      if (adminAuth) {
        const adminToken = localStorage.getItem('adminToken')
        if (adminToken) {
          headers['Authorization'] = `Bearer ${adminToken}`
        }
      } else {
        const verifyToken = sessionStorage.getItem(`post_verify_${post.id}`)
        if (verifyToken) {
          headers['x-verify-token'] = verifyToken
        }
      }

      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          authorName: formData.authorName,
          authorEmail: formData.authorEmail,
          password: formData.password || undefined,
          isSecret: true, // 실시간 문의는 기본적으로 비밀글
          metadata: {
            phone: formData.phone
          }
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert('게시글이 수정되었습니다.')
        router.push(`/solve/real_time_view?id=${post.id}`)
      } else {
        alert(result.message || '수정 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('수정 실패:', error)
      alert('수정 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm('수정을 취소하시겠습니까?')) {
      router.push(`/solve/real_time_view?id=${post.id}`)
    }
  }

  return (
    <div className="board-write">
      <ul>
        <li>
          <div className="form-group">
            <input 
              type="text" 
              className="form-control" 
              name="authorName"
              value={formData.authorName}
              onChange={handleInputChange}
              placeholder="이름을 입력해주세요"
              disabled={loading}
            />
          </div>
        </li>
        <li>
          <div className="form-group">
            <input 
              type="password" 
              className="form-control" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력해주세요 (변경시에만 입력)"
              disabled={loading}
            />
          </div>
        </li>
        <li>
          <div className="form-group">
            <input 
              type="email" 
              className="form-control" 
              name="authorEmail"
              value={formData.authorEmail}
              onChange={handleInputChange}
              placeholder="이메일을 입력해주세요"
              disabled={loading}
            />
          </div>
        </li>
        <li>
          <div className="form-group">
            <input 
              type="tel" 
              className="form-control" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="휴대폰 번호를 입력해주세요"
              disabled={loading}
            />
          </div>
        </li>
        <li>
          <div className="form-group">
            <input 
              type="text" 
              className="form-control" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="제목을 입력해 주세요"
              disabled={loading}
            />
          </div>
        </li>
        <li>
          <div className="form-group">
            <textarea 
              className="form-control" 
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="내용을 입력해주세요"
              disabled={loading}
            />
          </div>
        </li>
      </ul>
      
      <div className="btn-area">
        <a 
          href="#" 
          className="btn btn-cancel hoverable"
          onClick={(e) => {
            e.preventDefault()
            handleCancel()
          }}
        >
          취소
        </a>
        <button 
          type="button" 
          className="btn btn-submit hoverable"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '수정 중...' : '작성완료'}
        </button>
      </div>
    </div>
  )
}

function RealTimeModifyContent() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  
  const [post, setPost] = useState<LocalPostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

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
      // 관리자인 경우 토큰을 헤더에 포함
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (adminAuth) {
        const adminToken = localStorage.getItem('adminToken')
        if (adminToken) {
          headers['Authorization'] = `Bearer ${adminToken}`
        }
      } else {
        // 일반 사용자인 경우 인증 토큰 확인
        const verifyToken = sessionStorage.getItem(`post_verify_${postId}`)
        if (verifyToken) {
          headers['x-verify-token'] = verifyToken
        }
      }

      const response = await fetch(`/api/posts/${postId}`, { headers })
      const data = await response.json()

      if (response.ok) {
        // 관리자인 경우 바로 게시글 표시
        if (adminAuth) {
          setPost({
            id: data.id,
            title: data.title,
            content: data.content || '',
            authorName: data.authorName,
            authorEmail: data.authorEmail,
            isSecret: data.isSecret,
            phone: data.metadata?.phone || ''
          })
          setShowPasswordForm(false)
        } else {
          if (data.requiresPassword) {
            setShowPasswordForm(true)
            setPost({
              id: data.id,
              title: data.title,
              content: '',
              authorName: data.authorName,
              isSecret: data.isSecret,
              phone: data.metadata?.phone || ''
            })
          } else {
            setPost({
              id: data.id,
              title: data.title,
              content: data.content || '',
              authorName: data.authorName,
              authorEmail: data.authorEmail,
              isSecret: data.isSecret,
              phone: data.metadata?.phone || ''
            })
            setShowPasswordForm(false)
          }
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
  }, [postId])

  const handlePasswordSuccess = (postData: PostData, verifyToken?: string) => {
    // 인증 성공 시 토큰을 세션 스토리지에 저장
    if (verifyToken) {
      sessionStorage.setItem(`post_verify_${postId}`, verifyToken)
    }
    setPost({
      id: postData.id,
      title: postData.title,
      content: postData.content || '',
      authorName: postData.authorName,
      authorEmail: postData.authorEmail,
      isSecret: postData.isSecret,
      phone: (postData as PostDataWithMetadata).metadata?.phone || ''
    })
    setShowPasswordForm(false)
  }

  useEffect(() => {
    loadPost()
  }, [loadPost])

  if (loading) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="real-time-write writer-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Live Inquiries</small>
                <h3 className="typed">실시간 해결 문의</h3>
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
          <article className="real-time-write writer-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Live Inquiries</small>
                <h3 className="typed">실시간 해결 문의</h3>
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
        <article className="real-time-write writer-wrap">
          <div className="container">
            <div className="article-header">
              <small className="typed">Live Inquiries</small>
              <h3 className="typed">실시간 해결 문의</h3>
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
                <RealTimeModifyForm post={post} />
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