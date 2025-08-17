'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  authorName: string
  createdAt: string
  isSecret: boolean
  isAdmin: boolean
}

interface PostViewProps {
  postId: string
  title: string
  content: string
  authorName?: string
  createdAt: string
  viewCount?: number
  category?: string
  boardType: 'kode' | 'app' | 'issue' | 'notice' | 'real_time' | 'review'
  listUrl: string
  showComments?: boolean
  className?: string
}

export default function PostView({
  postId,
  title,
  content,
  authorName = '관리자',
  createdAt,
  viewCount = 0,
  category: _category,
  boardType: _boardType,
  listUrl,
  showComments = true,
  className = ''
}: PostViewProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentForm, setCommentForm] = useState({
    content: '',
    authorName: '',
    password: '',
    isSecret: false
  })
  const [loading, setLoading] = useState(false)

  // 댓글 목록 불러오기
  const loadComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('댓글 로딩 실패:', error)
    }
  }, [postId])

  // 댓글 등록
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentForm.content.trim() || !commentForm.authorName.trim()) {
      alert('내용과 이름을 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentForm)
      })

      if (response.ok) {
        setCommentForm({ content: '', authorName: '', password: '', isSecret: false })
        loadComments() // 댓글 목록 새로고침
      } else {
        alert('댓글 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error('댓글 등록 실패:', error)
      alert('댓글 등록 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 댓글 목록 로드
  useEffect(() => {
    if (showComments) {
      loadComments()
    }
  }, [showComments, loadComments])

  return (
    <div className={`board-view ${className}`}>
      <div className="view-header">
        <b className="title">{title}</b>
        <p className="writer">{authorName}</p>
        <ul className="info">
          <li>{new Date(createdAt).toLocaleDateString('ko-KR').replace(/\./g, '.').slice(0, -1)}</li>
          {viewCount > 0 && <li className="hit">{viewCount}</li>}
          {showComments && <li className="comment">{comments.length}</li>}
        </ul>
      </div>
      
      <div className="view-body">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* 댓글 섹션 */}
      {showComments && (
        <div className="comment">
          <div className="comment-top">
            <b>댓글</b>
          </div>
          <div className="comment-body">
            {/* 댓글 작성 폼 */}
            <form onSubmit={handleCommentSubmit} className="secret-comment">
              <ul>
                <li>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="댓글을 입력해 주세요."
                      value={commentForm.content}
                      onChange={(e) => setCommentForm({
                        ...commentForm,
                        content: e.target.value
                      })}
                    />
                  </div>
                </li>
                <li>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="이름"
                      value={commentForm.authorName}
                      onChange={(e) => setCommentForm({
                        ...commentForm,
                        authorName: e.target.value
                      })}
                    />
                  </div>
                </li>
                <li>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="비밀번호"
                      value={commentForm.password}
                      onChange={(e) => setCommentForm({
                        ...commentForm,
                        password: e.target.value
                      })}
                    />
                  </div>
                </li>
                <li>
                  <label className="hoverable">
                    <input
                      type="checkbox"
                      checked={commentForm.isSecret}
                      onChange={(e) => setCommentForm({
                        ...commentForm,
                        isSecret: e.target.checked
                      })}
                    /> 비밀글
                  </label>
                </li>
              </ul>
              <button
                type="submit"
                className="btn-submit hoverable"
                disabled={loading}
              >
                {loading ? '등록 중...' : '등록'}
              </button>
            </form>

            {/* 댓글 목록 */}
            <div className="comment-list">
              {comments.length > 0 ? (
                <ul>
                  {comments.map((comment) => (
                    <li key={comment.id}>
                      <div className="info">
                        <span>
                          {comment.isSecret ? (
                            comment.isAdmin ? '관리자 (비밀댓글)' : '익명 (비밀댓글)'
                          ) : (
                            comment.isAdmin ? '관리자' : comment.authorName
                          )}
                        </span>
                        <span>{new Date(comment.createdAt).toLocaleDateString('ko-KR').replace(/\./g, '.').slice(0, -1)}</span>
                      </div>
                      <p>
                        {comment.isSecret && !comment.isAdmin ? 
                          '비밀댓글입니다.' : 
                          comment.content
                        }
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="none-comment">등록된 댓글이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="view-footer">
        <div className="btn-area">
          <Link href={listUrl} className="btn-list hoverable">
            목록으로
          </Link>
        </div>
      </div>
    </div>
  )
} 