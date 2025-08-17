'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default function RealTimeWritePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    authorName: '',
    password: '',
    authorEmail: '',
    phone: '',
    title: '',
    content: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.authorName || !formData.password || !formData.title || !formData.content) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/boards/real_time/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          authorName: formData.authorName,
          authorEmail: formData.authorEmail,
          password: formData.password,
          isSecret: true, // 실시간 문의는 기본적으로 비밀글
          metadata: {
            phone: formData.phone
          }
        }),
      })

      const result = await response.json()

      if (response.ok) {
        router.push('/solve/real_time_confirm')
      } else {
        alert(result.message || '작성 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('작성 실패:', error)
      alert('작성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm('작성을 취소하시겠습니까?')) {
      router.back()
    }
  }

  return (
    <>
      <Header />
      
      <main id="content">
        {/* 원본 HTML 구조와 동일 */}
        <article className="real-time-write writer-wrap">
          <div className="container">
            <div className="article-header">
              <small className="typed">Live Inquiries</small>
              <h3 className="typed">실시간 해결 문의</h3>
            </div>
            
            <div className="article-content">
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
                        placeholder="비밀번호를 입력해주세요"
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
                    {loading ? '작성 중...' : '작성완료'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
} 