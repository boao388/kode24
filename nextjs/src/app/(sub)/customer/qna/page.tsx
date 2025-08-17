'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  viewCount: number
  sortOrder: number
  createdAt: string
}

export default function QnaPage() {
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
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <>
      <Header />
      
      {/* nav - 원본과 완전히 동일한 구조 */}
      <nav id="nav">
        <div className="container">
          <div className="menu">
            <ul>
              <li>
                <Link href="/introduction/introduce" className="hoverable">KODE24 소개</Link>
                <ul>
                  <li><Link href="/introduction/introduce" className="hoverable">KODE24 소개</Link></li>
                  <li><Link href="/introduction/press_list" className="hoverable">보도자료</Link></li>
                  <li><Link href="/introduction/patent_list" className="hoverable">인증특허</Link></li>
                </ul>
              </li>
              <li><Link href="/solution/initial" className="hoverable">솔루션 안내</Link></li>
              <li>
                <Link href="/solve/real_time_list" className="hoverable">긴급해결문의</Link>
                <ul>
                  <li><Link href="/solve/real_time_list" className="hoverable">실시간 해결 문의</Link></li>
                  <li><Link href="/solve/review_list" className="hoverable">솔루션 진행 후기</Link></li>
                </ul>
              </li>
              <li>
                <Link href="/customer/notice_list" className="hoverable">고객센터</Link>
                <ul>
                  <li><Link href="/customer/notice_list" className="hoverable">공지사항</Link></li>
                  <li><Link href="/customer/qna" className="hoverable">자주묻는질문</Link></li>
                  <li><Link href="/customer/sns_list" className="hoverable">SNS 채널</Link></li>
                </ul>
              </li>
              <li>
                <Link href="/report/kode_list" className="hoverable">사이버 보안 리포트</Link>
                <ul>
                  <li><Link href="/report/kode_list" className="hoverable">코드24 보안리포트</Link></li>
                  <li><Link href="/report/app_list" className="hoverable">악성 앱 분석</Link></li>
                  <li><Link href="/report/issue_list" className="hoverable">보안 이슈</Link></li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="nav-foot">
            <Link href="tel:15552501">
              <div>
                <img src="/assets/images/ico_contact.png" alt="" />
              </div>
              <div>
                <b>1555-2501</b>
                <p>kode24@kode24.co.kr</p>
              </div>
            </Link>
          </div>
        </div>
      </nav>
      
      <main id="content">
        {/* qna-wrap */}
        <article className="qna-wrap">
          <div className="container">
            <div className="article-header">
              <small className="typed">Q&A</small>
              <h3 className="typed">자주묻는질문</h3>
            </div>
            
            <div className="article-content">
              <div className="qna-list">
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
                  <ul>
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
                            <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}