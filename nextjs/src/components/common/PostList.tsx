'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePostList, usePostListWithSearch } from '@/hooks/usePostList'
import UpdateNotificationBanner from '@/components/ui/UpdateNotificationBanner'

interface Post {
  id: string
  title: string
  excerpt?: string
  authorName: string
  viewCount: number
  likeCount: number
  isSecret: boolean
  isFeatured: boolean
  publishedAt: string
  createdAt: string
  category?: {
    name: string
    key: string
  }
  commentCount: number
  status?: 'PENDING' | 'ANSWERED' | 'COMPLETED'
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

interface PostListProps {
  boardKey: string
  boardTitle: string
  viewPathPrefix: string
  writeUrl?: string
  showSearch?: boolean
  showCategory?: boolean
  className?: string
  pageSize?: number
  boardType?: 'default' | 'real_time' | 'review' | 'notice'
  searchTerm?: string
}

export default function PostList({
  boardKey,
  boardTitle,
  viewPathPrefix,
  writeUrl,
  showSearch = true,
  showCategory = false,
  className = '',
  pageSize = 10,
  boardType = 'default',
  searchTerm: externalSearchTerm
}: PostListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // TanStack Query를 사용한 데이터 페칭
  const { data, isLoading, error, refetch } = usePostList({
    boardKey,
    page: currentPage,
    limit: pageSize,
    search: externalSearchTerm || searchTerm
  })

  // 검색 및 페이지 변경 헬퍼 함수들
  const { searchPosts, changePage, prefetchNextPage } = usePostListWithSearch(
    boardKey,
    currentPage,
    pageSize
  )

  const posts = data?.posts || []
  const pagination = data?.pagination || null
  const loading = isLoading
  const errorMessage = error ? '게시글을 불러오는 중 오류가 발생했습니다.' : ''

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(searchInput)
    setCurrentPage(1)
    // TanStack Query가 자동으로 다시 페칭합니다
  }, [searchInput])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    
    // 다음 페이지 프리페치 (성능 최적화)
    if (pagination?.hasNextPage) {
      prefetchNextPage(page, externalSearchTerm || searchTerm)
    }
  }, [pagination?.hasNextPage, prefetchNextPage, externalSearchTerm, searchTerm])

  // 페이지 변경 시 스크롤을 맨 위로 이동 (UX 개선)
  const handlePageChangeWithScroll = useCallback((page: number) => {
    handlePageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [handlePageChange])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '-').replace(/-$/, '')
  }

  // 페이지네이션 렌더링 (원본 HTML 구조와 동일)
  const renderPagination = () => {
    if (!pagination) return null

    const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination
    const pages = []
    
    // 현재 페이지 기준으로 앞뒤 2개씩
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <nav className="pagination">
        <ol>
          <li className="prev">
            <a 
              href="#" 
              className={`hoverable ${!hasPrevPage ? 'disabled' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                if (hasPrevPage) handlePageChangeWithScroll(currentPage - 1)
              }}
            ></a>
          </li>
          
          {pages.map(page => (
            <li key={page} className={page === currentPage ? 'active' : ''}>
              <a 
                href="#" 
                className="hoverable"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChangeWithScroll(page)
                }}
              >
                {page}
              </a>
            </li>
          ))}
          
          <li className="next">
            <a 
              href="#" 
              className={`hoverable ${!hasNextPage ? 'disabled' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                if (hasNextPage) handlePageChangeWithScroll(currentPage + 1)
              }}
            ></a>
          </li>
        </ol>
      </nav>
    )
  }

  // 게시판 타입에 따른 헤더 컬럼
  const getTableHeaders = () => {
    switch (boardType) {
      case 'real_time':
        return ['제목', '작성자', '작성일']
      default:
        return ['제목', '조회수', '작성자', '작성일']
    }
  }

  // 게시판 타입에 따른 행 데이터
  const renderTableRow = (post: Post) => {
    const baseClasses = []
    if (post.isSecret) baseClasses.push('secret')
    if (post.isFeatured) baseClasses.push('notice')

    const titleClasses = baseClasses.join(' ')
    
    // solve/ 페이지들은 작성자 영역에 <b> 태그 사용 안함 (퍼블리싱 원본과 동일)
    const isSolvePage = boardType === 'real_time' || boardKey === 'review'

    switch (boardType) {
      case 'real_time':
        return (
          <ul>
            <li className={titleClasses}>
              <Link href={`${viewPathPrefix}?id=${post.id}`} className="hoverable">
                {post.isSecret && '🔒 '}
                {post.title}
              </Link>
              {post.status === 'ANSWERED' && (
                <span className="reply-success">답변완료</span>
              )}
            </li>
            <li className="writer">{post.authorName}</li>
            <li className="date">{formatDate(post.publishedAt || post.createdAt)}</li>
          </ul>
        )
        
      default:
        return (
          <ul>
            <li className={titleClasses}>
              <Link href={`${viewPathPrefix}?id=${post.id}`} className="hoverable">
                {post.isFeatured && '[공지] '}
                {post.isSecret && '[비밀] '}
                {post.title}
              </Link>
            </li>
            <li className="hit">{post.viewCount}</li>
            <li className="writer">
              {isSolvePage ? (
                // solve/ 페이지들: 일반 텍스트만 (퍼블리싱 원본과 동일)
                post.authorName
              ) : (
                // report/, notice 페이지들: 항상 <b class="admin"> 적용 (퍼블리싱 원본과 동일)
                <b className="admin">{post.authorName}</b>
              )}
            </li>
            <li className="date">{formatDate(post.publishedAt || post.createdAt)}</li>
          </ul>
        )
    }
  }

  return (
    <div className="article-content">
      {/* 실시간 업데이트 알림 */}
      <UpdateNotificationBanner boardKey={boardKey} />
      
      {/* 검색 폼 */}
      {showSearch && (
        <div className="board-search" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="검색어를 입력하세요"
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minWidth: '200px'
              }}
            />
            <button
              type="submit"
              className="hoverable"
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              검색
            </button>
            {(searchTerm || externalSearchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  setSearchTerm('')
                  setCurrentPage(1)
                }}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                초기화
              </button>
            )}
          </form>
        </div>
      )}
      
      <div className="board-list">
        {/* 테이블 헤더 (게시판 타입에 따라 다름) */}
        <div className="thead">
          <ul>
            {getTableHeaders().map((header, index) => (
              <li key={index}>{header}</li>
            ))}
          </ul>
        </div>
        
        {/* 테이블 본문 */}
        <div className="tbody">
          {loading ? (
            <div className="loading-message" style={{ textAlign: 'center', padding: '50px 0' }}>
              게시글을 불러오는 중입니다...
            </div>
          ) : errorMessage ? (
            <div className="error-message" style={{ textAlign: 'center', padding: '50px 0', color: '#ff4444' }}>
              {errorMessage}
            </div>
          ) : posts.length === 0 ? (
            <div className="no-posts" style={{ textAlign: 'center', padding: '50px 0' }}>
              등록된 게시글이 없습니다.
            </div>
          ) : (
            <ul>
              {posts.map((post) => (
                <li key={post.id}>
                  {renderTableRow(post)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* 페이지네이션 (원본 HTML 구조와 동일) */}
      {renderPagination()}
    </div>
  )
} 