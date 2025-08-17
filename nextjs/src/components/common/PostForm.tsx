'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

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

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className={`post-form-container ${className}`}>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-header">
          <h4>{mode === 'create' ? `${boardTitle} 작성` : `${boardTitle} 수정`}</h4>
        </div>

        {(error || success) && (
          <div className={`form-message ${error ? 'error' : 'success'}`}>
            {error || success}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="authorName">작성자 <span className="required">*</span></label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={formData.authorName}
            onChange={handleInputChange}
            placeholder="작성자명을 입력하세요"
            required
            disabled={loading}
          />
        </div>

        {!requireAuth && (
          <div className="form-group">
            <label htmlFor="authorEmail">이메일</label>
            <input
              type="email"
              id="authorEmail"
              name="authorEmail"
              value={formData.authorEmail || ''}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요 (선택사항)"
              disabled={loading}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">제목 <span className="required">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="제목을 입력하세요"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">내용 <span className="required">*</span></label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="내용을 입력하세요"
            rows={15}
            required
            disabled={loading}
          />
        </div>

        {showSecretOption && (
          <>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
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

            {formData.isSecret && (
              <div className="form-group">
                <label htmlFor="password">비밀번호 <span className="required">*</span></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  required={formData.isSecret}
                  disabled={loading}
                />
              </div>
            )}
          </>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancel hoverable"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn-submit hoverable"
            disabled={loading}
          >
            {loading 
              ? '처리중...' 
              : mode === 'create' 
                ? '등록' 
                : '수정'
            }
          </button>
        </div>
      </form>
    </div>
  )
} 