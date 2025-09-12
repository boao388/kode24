'use client'

import React, { useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PasswordConfirm from '@/components/common/PasswordConfirm'
import Link from 'next/link'
import { usePostDetailPage } from '@/hooks/usePostDetail'
import UpdateNotificationBanner from '@/components/ui/UpdateNotificationBanner'

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

function AppViewContent() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  
  // TanStack Query로 최적화된 데이터 관리
  const { 
    post, 
    isLoading, 
    error, 
    submitComment, 
    verifyPassword,
    isSubmittingComment,
    isVerifyingPassword,
    refresh
  } = usePostDetailPage(postId)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [commentData, setCommentData] = useState({
    content: '',
    authorName: '',
    password: '',
    isSecret: false
  })

  // 게시글 로딩 완료 시 비밀번호 폼 상태 설정
  const loading = isLoading
  const showPasswordRequired = post?.requiresPassword && showPasswordForm

  // 비밀번호 확인 성공 핸들러
  const handlePasswordSuccess = useCallback((postData: Post) => {
    setShowPasswordForm(false)
    // TanStack Query가 자동으로 캐시를 업데이트하므로 별도 상태 관리 불필요
  }, [])

  // 댓글 입력 핸들러
  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setCommentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }, [])

  // 댓글 등록 핸들러 (TanStack Query mutation 사용)
  const handleCommentSubmit = useCallback(async () => {
    if (!commentData.content.trim() || !commentData.authorName.trim() || !commentData.password.trim()) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    try {
      await submitComment(commentData)
      alert('댓글이 등록되었습니다.')
      setCommentData({ content: '', authorName: '', password: '', isSecret: false })
      // TanStack Query mutation이 자동으로 캐시 업데이트
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '댓글 등록 중 오류가 발생했습니다.'
      alert(errorMessage)
    }
  }, [commentData, submitComment])

  // 게시글이 로드된 후 비밀번호 폼 상태 설정
  React.useEffect(() => {
    if (post?.requiresPassword) {
      setShowPasswordForm(true)
    }
  }, [post?.requiresPassword])

  // 로딩 상태
  if (loading) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="board-view-wrap app-view">
            <div className="container">
              <div className="article-header">
                <small className="typed">App Analysis</small>
                <h3 className="typed">악성 앱 분석</h3>
                <div className="btn-area">
                  <Link href="/report/app_list" className="hoverable">목록</Link>
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
          <article className="board-view-wrap app-view">
            <div className="container">
              <div className="article-header">
                <small className="typed">App Analysis</small>
                <h3 className="typed">악성 앱 분석</h3>
                <div className="btn-area">
                  <Link href="/report/app_list" className="hoverable">목록</Link>
                </div>
              </div>
              <div className="error-message" style={{ textAlign: 'center', padding: '50px 0', color: '#ff4444' }}>
                {error}
                <br />
                <button 
                  onClick={refresh}
                  className="hoverable"
                  style={{ 
                    marginTop: '10px', 
                    padding: '8px 16px', 
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  다시 시도
                </button>
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
          <article className="board-view-wrap app-view">
            <div className="container">
              <div className="article-header">
                <small className="typed">App Analysis</small>
                <h3 className="typed">악성 앱 분석</h3>
                <div className="btn-area">
                  <Link href="/report/app_list" className="hoverable">목록</Link>
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
        {/* 원본 HTML 구조와 동일 */}
        <article className="app-view view-wrap">
          <div className="container">
            <div className="article-header">
              <small className="typed">App Analysis Report</small>
              <h3 className="typed">악성 앱 분석</h3>
              <div className="btn-area">
                <Link href="/report/app_list" className="hoverable">목록</Link>
              </div>
            </div>
            
            <div className="article-content">
              {/* 실시간 업데이트 알림 (댓글 등 변경사항) */}
              {post?.board?.key && (
                <UpdateNotificationBanner 
                  boardKey={post.board.key}
                  className="detail-notification"
                />
              )}
              
              {showPasswordRequired ? (
                <PasswordConfirm
                  postId={post.id}
                  authorName={post.authorName}
                  title={post.title}
                  listUrl="/report/app_list"
                  onSuccess={handlePasswordSuccess}
                  boardType="real_time"
                />
              ) : (
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
                          disabled={isSubmittingComment}
                          style={{
                            opacity: isSubmittingComment ? 0.6 : 1,
                            cursor: isSubmittingComment ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isSubmittingComment ? '등록 중...' : '등록'}
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
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}

export default function AppViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppViewContent />
    </Suspense>
  )
}