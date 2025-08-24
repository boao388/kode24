'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PasswordConfirm from '@/components/common/PasswordConfirm'
import Link from 'next/link'
import { isAdminAuthenticated } from '@/lib/auth'

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

function ReviewViewContent() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [commentData, setCommentData] = useState({
    content: '',
    authorName: '',
    password: '',
    isSecret: false
  })

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
          setPost(data)
          setShowPasswordForm(false)
        } else {
          setPost(data)
          // 비밀번호가 필요한 경우에만 비밀번호 폼 표시
          setShowPasswordForm(data.requiresPassword || false)
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

  const handlePasswordSuccess = (postData: any, verifyToken?: string) => {
    // 인증 성공 시 토큰을 세션 스토리지에 저장
    if (verifyToken) {
      sessionStorage.setItem(`post_verify_${postId}`, verifyToken)
    }
    setPost(postData)
    setShowPasswordForm(false)
  }

  // 수정 버튼 클릭 핸들러
  const handleModifyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // 관리자인 경우 바로 수정 페이지로 이동
    if (isAdmin) {
      window.location.href = `/solve/review_modify?id=${postId}`
      return
    }
    
    // 일반 사용자인 경우 비밀글이면 권한 확인 필요
    if (post?.isSecret) {
      // 이미 인증된 토큰이 있는지 확인
      const verifyToken = sessionStorage.getItem(`post_verify_${postId}`)
      if (verifyToken) {
        // 토큰이 있으면 바로 수정 페이지로 이동
        window.location.href = `/solve/review_modify?id=${postId}`
      } else {
        // 토큰이 없으면 비밀번호 확인 필요
        alert('수정하려면 비밀번호 확인이 필요합니다.')
        setShowPasswordForm(true)
      }
    } else {
      // 일반글이면 바로 수정 페이지로 이동
      window.location.href = `/solve/review_modify?id=${postId}`
    }
  }

  const loadComments = useCallback(async () => {
    if (!postId) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (response.ok) {
        const result = await response.json()
        const comments = result.data || result // API 응답 구조 호환성
        setPost(prev => prev ? { ...prev, comments } : null)
      }
    } catch (error) {
      console.error('댓글 로딩 실패:', error)
    }
  }, [postId])

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setCommentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleCommentSubmit = async () => {
    if (!commentData.content.trim() || !commentData.authorName.trim() || !commentData.password.trim()) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      })

      if (response.ok) {
        alert('댓글이 등록되었습니다.')
        setCommentData({ content: '', authorName: '', password: '', isSecret: false })
        loadComments() // 댓글만 새로고침 (효율성 개선)
      } else {
        const errorData = await response.json()
        alert(errorData.message || '댓글 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error('댓글 등록 실패:', error)
      alert('댓글 등록 중 오류가 발생했습니다.')
    }
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
          <article className="review-view view-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Solution Feedback</small>
                <h3 className="typed">솔루션 진행 후기</h3>
                <div className="btn-area">
                  <Link href="/solve/review_list" className="hoverable">목록</Link>
                  <Link href={`/solve/review_modify?id=${postId}`} className="hoverable">수정</Link>
                  <Link href="/solve/review_write" className="hoverable">글쓰기</Link>
                </div>
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
          <article className="review-view view-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Solution Feedback</small>
                <h3 className="typed">솔루션 진행 후기</h3>
                <div className="btn-area">
                  <Link href="/solve/review_list" className="hoverable">목록</Link>
                  <Link href={`/solve/review_modify?id=${postId}`} className="hoverable">수정</Link>
                  <Link href="/solve/review_write" className="hoverable">글쓰기</Link>
                </div>
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
          <article className="review-view view-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Solution Feedback</small>
                <h3 className="typed">솔루션 진행 후기</h3>
                <div className="btn-area">
                  <Link href="/solve/review_list" className="hoverable">목록</Link>
                  <Link href={`/solve/review_modify?id=${postId}`} className="hoverable">수정</Link>
                  <Link href="/solve/review_write" className="hoverable">글쓰기</Link>
                </div>
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
          <article className="review-view view-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Solution Feedback</small>
                <h3 className="typed">솔루션 진행 후기</h3>
                <div className="btn-area">
                  <Link href="/solve/review_list" className="hoverable">목록</Link>
                  {post.isSecret || isAdmin ? (
                    <a href="#" onClick={handleModifyClick} className="hoverable">수정</a>
                  ) : null}
                  <Link href="/solve/review_write" className="hoverable">글쓰기</Link>
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
                    <div 
                      className="editor-content" 
                      dangerouslySetInnerHTML={{ __html: post.content || '' }} 
                    />
                  </div>
                  
                  {/* 댓글 영역 - 원본 HTML 구조와 동일 */}
                  <div className="comment">
                    <div className="comment-top">
                      <b>댓글</b>
                    </div>
                    
                    <div className="comment-body">
                      {/* 댓글 작성 폼 */}
                      <div className="secret-comment">
                        <ul>
                          <li>
                            <div className="form-group">
                              <input 
                                type="text" 
                                className="form-control" 
                                name="content"
                                value={commentData.content}
                                onChange={handleCommentChange}
                                placeholder="댓글을 입력해 주세요."
                              />
                            </div>
                          </li>
                          <li>
                            <div className="form-group">
                              <input 
                                type="text" 
                                className="form-control" 
                                name="authorName"
                                value={commentData.authorName}
                                onChange={handleCommentChange}
                                placeholder="이름"
                              />
                            </div>
                          </li>
                          <li>
                            <div className="form-group">
                              <input 
                                type="password" 
                                className="form-control" 
                                name="password"
                                value={commentData.password}
                                onChange={handleCommentChange}
                                placeholder="비밀번호"
                              />
                            </div>
                          </li>
                          <li>
                            <label className="hoverable">
                              <input 
                                type="checkbox" 
                                name="isSecret"
                                checked={commentData.isSecret}
                                onChange={handleCommentChange}
                              /> 비밀글
                            </label>
                          </li>
                        </ul>
                        <button 
                          type="button" 
                          className="btn-submit hoverable"
                          onClick={handleCommentSubmit}
                        >
                          등록
                        </button>
                      </div>
                      
                      {/* 댓글 목록 */}
                      <div className="comment-list">
                        {post.comments && post.comments.length > 0 ? (
                          <ul>
                            {post.comments.map((comment) => (
                              <li key={comment.id}>
                                <div className="info">
                                  <span>{comment.authorName}</span>
                                  <span>{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</span>
                                </div>
                                <p>{comment.isSecret ? '[비밀 댓글입니다]' : comment.content}</p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="none-comment">등록된 댓글이 없습니다.</p>
                        )}
                      </div>
                    </div>
                  </div>
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

export default function ReviewViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewViewContent />
    </Suspense>
  )
}