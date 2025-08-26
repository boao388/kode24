'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  viewCount: number
  sortOrder: number
  createdAt: string
}

export default function QnaClient() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const response = await fetch('/api/faqs')
        if (response.ok) {
          const data = await response.json()
          setFaqs(data.faqs)
        } else {
          setError('FAQ를 불러오는데 실패했습니다.')
        }
      } catch (error) {
        console.error('FAQ 로딩 실패:', error)
        setError('FAQ를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadFaqs()
  }, [])

  const toggleAnswer = (index: number) => {
    // setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <>
      <Header />
      
      <main id="content">
        {/* qna */}
        <article className="qna">
          <div className="container">
            <div className="article-header">
              <small className="typed">Q&A</small>
              <h3 className="typed">자주 묻는 질문</h3>
            </div>
            
            <div className="article-content">
              {loading ? (
                <div className="loading-message" style={{ textAlign: 'center', padding: '50px 0' }}>
                  FAQ를 불러오는 중입니다...
                </div>
              ) : error ? (
                <div className="error-message" style={{ textAlign: 'center', padding: '50px 0', color: '#ff4444' }}>
                  {error}
                </div>
              ) : faqs.length === 0 ? (
                <div className="no-faqs" style={{ textAlign: 'center', padding: '50px 0' }}>
                  등록된 FAQ가 없습니다.
                </div>
              ) : (
                <ul className="qna-list">
                  {faqs.map((faq, index) => (
                    <li key={faq.id} className={activeIndex === index ? 'active' : ''}>
                      <button 
                        type="button" 
                        className="btn-qna hoverable"
                        onClick={() => toggleAnswer(index)}
                      >
                        <span>Q.</span> {faq.question}
                      </button>
                      <div className="answer" style={{ display: activeIndex === index ? 'block' : 'none' }}>
                        <div>
                          <b>KODE24</b>
                          <div 
                            className="editor-content" 
                            dangerouslySetInnerHTML={{ __html: faq.answer }} 
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
} 