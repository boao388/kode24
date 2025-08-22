'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  viewCount: number
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminFaqsPage() {
  const router = useRouter()
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    sortOrder: 0
  })

  useEffect(() => {
    loadFaqs()
  }, [])

  const loadFaqs = async () => {
    try {
      const response = await fetch('/api/faqs?limit=100')
      if (response.ok) {
        const data = await response.json()
        setFaqs(data.faqs)
      } else {
        alert('FAQ 목록을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('FAQ 로딩 실패:', error)
      alert('FAQ를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sortOrder' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('질문과 답변을 모두 입력해주세요.')
      return
    }

    try {
      const url = editingFaq ? `/api/faqs/${editingFaq.id}` : '/api/faqs'
      const method = editingFaq ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(editingFaq ? 'FAQ가 수정되었습니다.' : 'FAQ가 등록되었습니다.')
        resetForm()
        loadFaqs()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'FAQ 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('FAQ 저장 실패:', error)
      alert('FAQ 저장 중 오류가 발생했습니다.')
    }
  }

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
      sortOrder: faq.sortOrder
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 FAQ를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('FAQ가 삭제되었습니다.')
        loadFaqs()
      } else {
        alert('FAQ 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('FAQ 삭제 실패:', error)
      alert('FAQ 삭제 중 오류가 발생했습니다.')
    }
  }

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      sortOrder: 0
    })
    setEditingFaq(null)
    setShowCreateForm(false)
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="loading">FAQ 목록을 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-left">
          <Link href="/admin/dashboard">
            <img src="/assets/images/img_logo.svg" alt="KODE24" className="logo" />
          </Link>
          <h1>FAQ 관리</h1>
        </div>
        <div className="header-right">
          <Link href="/admin/dashboard" className="back-btn">대시보드</Link>
        </div>
      </header>

      <div className="admin-content">
        <div className="content-header">
          <h2>자주묻는질문 관리</h2>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-btn"
          >
            {showCreateForm ? '취소' : 'FAQ 추가'}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-form-container">
            <h3>{editingFaq ? 'FAQ 수정' : 'FAQ 추가'}</h3>
            <form onSubmit={handleSubmit} className="create-form">
              <div className="form-group">
                <label htmlFor="question">질문 *</label>
                <input
                  type="text"
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="자주 묻는 질문을 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="answer">답변 *</label>
                <textarea
                  id="answer"
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  placeholder="답변을 입력하세요"
                  rows={5}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">카테고리</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="카테고리 (선택사항)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sortOrder">정렬순서</label>
                  <input
                    type="number"
                    id="sortOrder"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingFaq ? '수정' : '등록'}
                </button>
                <button type="button" onClick={resetForm} className="cancel-btn">
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="faqs-list">
          {faqs.length === 0 ? (
            <div className="no-data">등록된 FAQ가 없습니다.</div>
          ) : (
            <div className="faqs-grid">
              {faqs.map(faq => (
                <div key={faq.id} className="faq-card">
                  <div className="faq-header">
                    <div className="faq-meta">
                      {faq.category && (
                        <span className="category">{faq.category}</span>
                      )}
                      <span className="sort-order">순서: {faq.sortOrder}</span>
                      <span className="view-count">조회: {faq.viewCount}</span>
                    </div>
                    <div className="faq-actions">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="edit-btn"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="delete-btn"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  
                  <div className="faq-question">
                    <strong>Q: {faq.question}</strong>
                  </div>
                  
                  <div className="faq-answer">
                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                  
                  <div className="faq-footer">
                    <small>
                      생성일: {new Date(faq.createdAt).toLocaleDateString('ko-KR')}
                      {faq.updatedAt !== faq.createdAt && (
                        <span> | 수정일: {new Date(faq.updatedAt).toLocaleDateString('ko-KR')}</span>
                      )}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          background-color: #f8f9fa;
          color: #333;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #dee2e6;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          height: 32px;
        }

        .header-left h1 {
          color: #333;
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .back-btn {
          background: #6c757d;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          text-decoration: none;
          transition: background 0.3s;
        }

        .back-btn:hover {
          background: #545b62;
        }

        .admin-content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .content-header h2 {
          margin: 0;
          color: #333;
        }

        .create-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s;
        }

        .create-btn:hover {
          background: #218838;
        }

        .create-form-container {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .create-form-container h3 {
          margin: 0 0 1.5rem 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 150px;
          gap: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }

        .form-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        .submit-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .submit-btn:hover {
          background: #0056b3;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background: #545b62;
        }

        .faqs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .faq-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-left: 4px solid #007bff;
        }

        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .faq-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.8rem;
        }

        .category {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .sort-order,
        .view-count {
          background: #f8f9fa;
          color: #6c757d;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .faq-actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn {
          background: #ffc107;
          color: #212529;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .faq-question {
          margin-bottom: 1rem;
          font-size: 1rem;
          color: #333;
        }

        .faq-answer {
          margin-bottom: 1rem;
          color: #666;
          line-height: 1.6;
        }

        .faq-footer {
          font-size: 0.8rem;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 0.5rem;
        }

        .no-data {
          text-align: center;
          padding: 3rem;
          color: #666;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          font-size: 1.1rem;
          color: #666;
        }
      `}</style>
    </div>
  )
} 