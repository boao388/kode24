'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export interface PostData {
  id: string
  title: string
  content: string
  authorName: string
  authorEmail?: string
  isSecret: boolean
  createdAt: string
  viewCount: number
  board: {
    title: string
    key: string
  }
}

interface PasswordConfirmProps {
  postId: string
  authorName: string
  title: string
  listUrl: string
  onSuccess: (post: PostData) => void
  boardType: 'real_time' | 'review'
}

export default function PasswordConfirm({
  postId,
  authorName,
  title,
  listUrl,
  onSuccess,
  boardType
}: PasswordConfirmProps) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/posts/${postId}/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess(data.post)
      } else {
        setError(data.message || '비밀번호가 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error)
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const boardTypeTitle = {
    real_time: '실시간 문의',
    review: '후기'
  }

  return (
    <article className="pw-confirm-wrap">
      <div className="container">
        <div className="article-header">
          <small className="typed">Password Check</small>
          <h3 className="typed">{boardTypeTitle[boardType]} 확인</h3>
        </div>
        
        <div className="article-content">
          <div className="pw-confirm">
            <strong>
              <span>{authorName}님의 </span>게시글 입니다.
            </strong>
            <p>
              작성자와 관리자만 열람하실 수 있습니다.<br />
              본인이라면 비밀번호를 입력하세요
            </p>
            
            <div className="post-info">
              <h4>{title}</h4>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="비밀번호를 입력해 주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              {error && (
                <div className="error-message" style={{ color: '#ff4444', marginBottom: '15px', fontSize: '13px' }}>
                  {error}
                </div>
              )}
              
              <div className="btn-area">
                <button 
                  type="submit" 
                  className="btn-confirm hoverable"
                  disabled={loading}
                >
                  {loading ? '확인 중...' : '확인'}
                </button>
                <Link href={listUrl} className="btn-list hoverable">
                  목록으로
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  )
} 