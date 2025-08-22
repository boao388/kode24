'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Patent, PatentListResponse, PatentSearchParams } from '@/types'

export default function PatentListPage() {
  const [patents, setPatents] = useState<Patent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 6

  // API 호출 함수
  const fetchPatents = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      const params: PatentSearchParams = {
        page,
        limit,
        sort: 'createdAt',
        order: 'desc'
      }

      const queryString = new URLSearchParams({
        page: params.page?.toString() || '1',
        limit: params.limit?.toString() || '6',
        sort: params.sort || 'createdAt',
        order: params.order || 'desc'
      }).toString()

      const response = await fetch(`/api/patents?${queryString}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch patents')
      }

      const data: PatentListResponse = await response.json()
      
      if (data.success) {
        setPatents(data.data)
        setCurrentPage(data.pagination.page)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching patents:', error)
      // 에러 시 더미 데이터 사용
      setPatents(getDummyPatents())
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [limit])

  // 더미 데이터 함수 (API가 없을 때 사용)
  const getDummyPatents = (): Patent[] => [
    {
      id: '1',
      title: '재도전 참여패키지 참여선정기업',
      description: '재도전 참여패키지 참여선정기업 관련 인증서',
      imageUrl: '/assets/images/sub/img_patent01.png',
      date: '2025-05-16',
      category: 'certification',
      isActive: true,
      sortOrder: 1,
      createdAt: new Date('2025-05-16'),
      updatedAt: new Date('2025-05-16')
    },
    {
      id: '2',
      title: '몸캠피싱 24시 해결 코드24',
      description: '몸캠피싱 24시 해결 서비스 관련 특허',
      imageUrl: '/assets/images/sub/img_patent02.png',
      date: '2025-05-16',
      category: 'patent',
      isActive: true,
      sortOrder: 2,
      createdAt: new Date('2025-05-16'),
      updatedAt: new Date('2025-05-16')
    }
  ]

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      fetchPatents(page)
    }
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPatents(1)
  }, [fetchPatents])

  // 페이지네이션 렌더링 함수
  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // 이전 페이지 버튼
    pages.push(
      <li key="prev" className="prev">
        <a
          href="#"
          className="hoverable"
          onClick={(e) => {
            e.preventDefault()
            handlePageChange(currentPage - 1)
          }}
          aria-label="이전 페이지"
        />
      </li>
    )

    // 페이지 번호들
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={currentPage === i ? 'active' : ''}>
          <a
            href="#"
            className="hoverable"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(i)
            }}
          >
            {i}
          </a>
        </li>
      )
    }

    // 다음 페이지 버튼
    pages.push(
      <li key="next" className="next">
        <a
          href="#"
          className="hoverable"
          onClick={(e) => {
            e.preventDefault()
            handlePageChange(currentPage + 1)
          }}
          aria-label="다음 페이지"
        />
      </li>
    )

    return pages
  }

  return (
    <>
      <Header />
      
      <main id="content">
        <article className="gallery-list patent-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Certifications & Patents</small>
              <h3 className="typed">인증특허</h3>
            </div>
            <div className="article-content">
              { (
                <>
                  <ul>
                    {patents.map((patent) => (
                      <li key={patent.id}>
                        <Link href={`/introduction/patent_view?id=${patent.id}`} className="hoverable">
                          <div className="item-img">
                            <Image 
                              src={patent.imageUrl} 
                              alt={patent.title}
                              width={300}
                              height={200}
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div className="details">
                            <p>{patent.title}</p>
                            <span className="date">{patent.date}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  
                  {/* pagination */}
                  {totalPages > 0 && (
                    <nav className="pagination">
                      <ol>
                        {renderPagination()}
                      </ol>
                    </nav>
                  )}
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