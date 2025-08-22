'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import HtmlEditor from '@/components/ui/HtmlEditor'
import { isAdminAuthenticated } from '@/lib/auth'

interface PostFormData {
  id?: string
  title: string
  content: string
  authorName: string
  authorEmail?: string
  password?: string
  isSecret: boolean
}

interface PostFormProps {
  boardKey: string
  boardTitle: string
  listUrl: string
  initialData?: PostFormData
  mode: 'create' | 'edit'
  className?: string
  requireAuth?: boolean
  showSecretOption?: boolean
}

export default function PostForm({
  boardKey,
  boardTitle,
  listUrl,
  initialData,
  mode = 'create',
  className = '',
  requireAuth = false,
  showSecretOption = true
}: PostFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    authorName: '',
    authorEmail: '',
    password: '',
    isSecret: false,
    ...initialData
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // 유효성 검사
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.')
      return
    }
    if (!formData.authorName.trim()) {
      setError('작성자명을 입력해주세요.')
      return
    }
    if (formData.isSecret && !formData.password) {
      setError('비밀글의 경우 비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const url = mode === 'create' 
        ? `/api/boards/${boardKey}/posts`
        : `/api/posts/${formData.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      // 헤더 설정
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      // 수정 모드일 때 권한 헤더 추가
      if (mode === 'edit') {
        const adminAuth = isAdminAuthenticated()
        if (adminAuth) {
          const adminToken = localStorage.getItem('adminToken')
          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`
          }
        } else {
          // 일반 사용자인 경우 인증 토큰 확인
          const verifyToken = sessionStorage.getItem(`post_verify_${formData.id}`)
          if (verifyToken) {
            headers['x-verify-token'] = verifyToken
          }
        }
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          authorName: formData.authorName.trim(),
          authorEmail: formData.authorEmail?.trim() || undefined,
          password: formData.isSecret ? formData.password : undefined,
          isSecret: formData.isSecret
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(mode === 'create' ? '게시글이 등록되었습니다.' : '게시글이 수정되었습니다.')
        setTimeout(() => {
          if (data.post?.id) {
            // 등록/수정 완료 후 상세 페이지로 이동
            const viewUrl = listUrl.replace('_list', '_view')
            router.push(`${viewUrl}?id=${data.post.id}`)
          } else {
            router.push(listUrl)
          }
        }, 1500)
      } else {
        setError(data.message || '처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('폼 제출 실패:', error)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(listUrl)
  }

  return (
    <div className="board-write">
      {(error || success) && (
        <div className={`form-message ${error ? 'error' : 'success'}`} style={{
          textAlign: 'center',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: error ? '#ffe6e6' : '#e6f7e6',
          color: error ? '#d63031' : '#00b894',
          border: `1px solid ${error ? '#d63031' : '#00b894'}`
        }}>
          {error || success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder="작성자명을 입력하세요"
                required
                disabled={loading}
              />
            </div>
          </li>
          
          {!requireAuth && (
            <li>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  name="authorEmail"
                  value={formData.authorEmail || ''}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요 (선택사항)"
                  disabled={loading}
                />
              </div>
            </li>
          )}

          <li>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="제목을 입력하세요"
                required
                disabled={loading}
              />
            </div>
          </li>

          {showSecretOption && (
            <li>
              <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <input
                    type="checkbox"
                    name="isSecret"
                    checked={formData.isSecret}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <span>비밀글로 작성</span>
                </label>
              </div>
            </li>
          )}

          {showSecretOption && formData.isSecret && (
            <li>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  required={formData.isSecret}
                  disabled={loading}
                />
              </div>
            </li>
          )}

          <li>
            <div className="form-group">
              <HtmlEditor
                value={formData.content}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, content: value }))
                }}
                placeholder="내용을 입력하세요..."
                height={400}
              />
            </div>
          </li>
        </ul>

        <div className="btn-area">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-cancel hoverable"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn btn-submit hoverable"
            disabled={loading}
          >
            {loading 
              ? '처리중...' 
              : mode === 'create' 
                ? '작성완료' 
                : '수정완료'
            }
          </button>
        </div>
      </form>
    </div>
  )
} 