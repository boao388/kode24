'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content?: string
  linkUrl?: string
  imageUrl?: string
  publishedAt: string
  createdAt: string
  authorName?: string
}

interface ApiResponse {
  posts: Post[]
  pagination: {
    currentPage: number
    totalPages: number
    totalPosts: number
    hasNext: boolean
    hasPrev: boolean
  }
}

function PressListContent() {
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1')
  
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 보도자료 데이터 로드
  useEffect(() => {
    const loadPressData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/boards/press/posts?page=${currentPage}&limit=8`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else {
          setError('보도자료를 불러오는데 실패했습니다.')
        }
      } catch (error) {
        console.error('보도자료 로딩 실패:', error)
        setError('보도자료를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadPressData()
  }, [currentPage])

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0] // YYYY-MM-DD 형식
  }

  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (!data?.pagination) return null

    const { currentPage, totalPages, hasNext, hasPrev } = data.pagination
    const pageNumbers = []
    
    // 표시할 페이지 번호 계산
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, startPage + 4)
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <nav className="pagination">
        <ol>
          <li className={`prev ${!hasPrev ? 'disabled' : ''}`}>
            {hasPrev ? (
              <Link href={`?page=${currentPage - 1}`} className="hoverable"></Link>
            ) : (
              <span className="hoverable"></span>
            )}
          </li>
          
          {pageNumbers.map(pageNum => (
            <li key={pageNum} className={currentPage === pageNum ? 'active' : ''}>
              <Link href={`?page=${pageNum}`} className="hoverable">
                {pageNum}
              </Link>
            </li>
          ))}
          
          <li className={`next ${!hasNext ? 'disabled' : ''}`}>
            {hasNext ? (
              <Link href={`?page=${currentPage + 1}`} className="hoverable"></Link>
            ) : (
              <span className="hoverable"></span>
            )}
          </li>
        </ol>
      </nav>
    )
  }

  if (loading) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="gallery-list press-list">
            <div className="container">
              <div className="article-header">
                <small className="typed">Press Releases</small>
                <h3 className="typed">보도자료</h3>
              </div>
              <div className="article-content">
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  보도자료를 불러오는 중입니다...
                </div>
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="gallery-list press-list">
            <div className="container">
              <div className="article-header">
                <small className="typed">Press Releases</small>
                <h3 className="typed">보도자료</h3>
              </div>
              <div className="article-content">
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#ff4444' }}>
                  {error}
                </div>
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
        {/* 원본 HTML 구조와 동일 */}
        <article className="gallery-list press-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Press Releases</small>
              <h3 className="typed">보도자료</h3>
            </div>
            
            <div className="article-content">
              {!data?.posts || data.posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  등록된 보도자료가 없습니다.
                </div>
              ) : (
                <>
                  <ul>
                    {data.posts.map((post) => (
                      <li key={post.id}>
                        <a 
                          href={post.linkUrl || '#'} 
                          target={post.linkUrl ? "_blank" : "_self"}
                          rel={post.linkUrl ? "noopener noreferrer" : undefined}
                          className="hoverable"
                        >
                          <div className="item-img">
                            <img 
                              src={post.imageUrl || '/assets/images/sub/img_none_frame.png'} 
                              alt={post.title}
                              onError={(e) => {
                                // 이미지 로드 실패 시 대체 이미지 설정
                                const target = e.target as HTMLImageElement
                                target.src = '/assets/images/sub/img_none_frame.png'
                              }}
                            />
                          </div>
                          <div className="details">
                            <p>{post.title}</p>
                            <span className="date">
                              {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>

                  {/* 페이지네이션 - 원본 HTML 구조와 동일 */}
                  {renderPagination()}
                </>
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}

export default function PressListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PressListContent />
    </Suspense>
  )
}