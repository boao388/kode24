'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createAuthHeaders } from '@/lib/auth'

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
  showListButton?: boolean  // 목록 버튼 표시 여부
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
  showListButton = false,  // 기본값을 false로 설정
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR').replace(/\./g, '.').slice(0, -1)
  }

  // 댓글 로드
  const loadComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        headers: createAuthHeaders()
      })
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
    
    if (!commentForm.content.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentForm),
      })

      if (response.ok) {
        setCommentForm({
          content: '',
          authorName: '',
          password: '',
          isSecret: false
        })
        loadComments() // 댓글 목록 새로고침
      } else {
        const errorData = await response.json()
        alert(errorData.message || '댓글 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error('댓글 등록 실패:', error)
      alert('댓글 등록 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setCommentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  useEffect(() => {
    if (showComments) {
      loadComments()
    }
  }, [showComments, loadComments])

  return (
    <div className={`board-view ${className}`.trim()}>
      <div className="view-header">
        <b className="title">{title}</b>
        <p className="writer">{authorName}</p>
        <ul className="info">
          <li>{formatDate(createdAt)}</li>
          <li className="hit">{viewCount}</li>
          <li className="comment">{comments.length}</li>
        </ul>
      </div>
      
      <div className="view-body">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* 댓글 영역 */}
      {showComments && (
        <div className="comment">
          <div className="comment-top">
            <b>댓글</b>
          </div>
          
          <div className="comment-body">
            {/* 댓글 작성 폼 */}
            <div className="secret-comment">
              <form onSubmit={handleCommentSubmit}>
                <ul>
                  <li>
                    <div className="form-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        name="content"
                        value={commentForm.content}
                        onChange={handleInputChange}
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
                        value={commentForm.authorName}
                        onChange={handleInputChange}
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
                        value={commentForm.password}
                        onChange={handleInputChange}
                        placeholder="비밀번호"
                      />
                    </div>
                  </li>
                  <li>
                    <label className="hoverable">
                      <input 
                        type="checkbox" 
                        name="isSecret"
                        checked={commentForm.isSecret}
                        onChange={handleInputChange}
                      /> 비밀글
                    </label>
                  </li>
                </ul>
                <button 
                  type="submit" 
                  className="btn-submit hoverable"
                  disabled={loading}
                >
                  등록
                </button>
              </form>
            </div>
            
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

      {/* 하단 버튼 - 조건부 렌더링 */}
      {showListButton && (
        <div className="view-footer">
          <div className="btn-area">
            <Link href={listUrl} className="btn-list hoverable">
              목록으로
            </Link>
          </div>
        </div>
      )}
    </div>
  )
} 