'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

interface Patent {
  id: string
  title: string
  content?: string
  excerpt?: string
  authorName: string
  date: string
  viewCount: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
  imageUrl?: string
  category: string
  board: {
    title: string
    key: string
  }
}

function PatentViewContent() {
  const searchParams = useSearchParams()
  const patentId = searchParams.get('id')
  
  const [patent, setPatent] = useState<Patent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPatent = useCallback(async () => {
    if (!patentId) {
      setError('인증특허 ID가 없습니다.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/patents/${patentId}`)
      const data = await response.json()

      if (data.success && data.data) {
        setPatent(data.data)
      } else {
        setError(data.error || '인증특허를 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('인증특허 로딩 실패:', error)
      setError('인증특허를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [patentId])

  // 한국시간 날짜 포맷팅 함수
  const formatKoreanDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\. /g, '.').replace(',', '')
  }

  useEffect(() => {
    loadPatent()
  }, [loadPatent])

  // 로딩 상태
  if (loading) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="patent-view view-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Certifications &amp; Patents</small>
                <h3 className="typed">인증특허</h3>
                <div className="btn-area">
                  <Link href="/introduction/patent_list" className="hoverable">목록</Link>
                </div>
              </div>
              <div className="loading-message" style={{ textAlign: 'center', padding: '50px 0' }}>
                인증특허를 불러오는 중입니다...
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
          <article className="patent-view view-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Certifications &amp; Patents</small>
                <h3 className="typed">인증특허</h3>
                <div className="btn-area">
                  <Link href="/introduction/patent_list" className="hoverable">목록</Link>
                </div>
              </div>
              <div className="error-message" style={{ textAlign: 'center', padding: '50px 0', color: '#ff4444' }}>
                {error}
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </>
    )
  }

  // 인증특허가 없는 경우
  if (!patent) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="patent-view view-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">Certifications &amp; Patents</small>
                <h3 className="typed">인증특허</h3>
                <div className="btn-area">
                  <Link href="/introduction/patent_list" className="hoverable">목록</Link>
                </div>
              </div>
              <div className="error-message" style={{ textAlign: 'center', padding: '50px 0' }}>
                인증특허를 찾을 수 없습니다.
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
        {/* patent-view */}
        <article className="patent-view view-wrap">
          <div className="container">
            <div className="article-header">
              <small className="typed">Certifications &amp; Patents</small>
              <h3 className="typed">인증특허</h3>
              <div className="btn-area">
                <Link href="/introduction/patent_list" className="hoverable">목록</Link>
              </div>
            </div>
            <div className="article-content">
              <div className="board-view">
                <div className="view-header">
                  <b className="title">{patent.title}</b>
                  <p className="writer">{patent.authorName}</p>
                  <ul className="info">
                    <li>{formatKoreanDateTime(patent.publishedAt || patent.createdAt)}</li>
                    <li className="hit">{patent.viewCount}</li>
                    <li className="comment">0</li>
                  </ul>
                </div>
                <div className="view-body">
                  {/* report_view 스타일과 동일한 에디터 콘텐츠 */}
                  <div 
                    className="editor-content" 
                    dangerouslySetInnerHTML={{ __html: patent.content || patent.excerpt || '' }} 
                  />
                </div>
                {/* comment - 인증특허는 댓글 기능 없음 */}
                <div className="comment" style={{ display: 'none' }}>
                  <div className="comment-top">
                    <b>댓글</b>
                  </div>
                  <div className="comment-body">
                    <p className="none-comment">인증특허는 댓글을 지원하지 않습니다.</p>
                  </div>
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

export default function PatentViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatentViewContent />
    </Suspense>
  )
}