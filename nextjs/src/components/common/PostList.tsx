'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

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
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const loadPosts = useCallback(async (page: number = 1, search: string = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString()
      })
      
      if (search.trim()) {
        params.append('search', search.trim())
      }

      const response = await fetch(`/api/boards/${boardKey}/posts?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPosts(data.posts)
        setPagination(data.pagination)
      } else {
        setError(data.message || '게시글을 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('게시글 로딩 실패:', error)
      setError('게시글을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [boardKey, pageSize])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(searchInput)
    setCurrentPage(1)
    loadPosts(1, searchInput)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadPosts(page, searchTerm)
  }

  useEffect(() => {
    const effectiveSearchTerm = externalSearchTerm || searchTerm
    loadPosts(currentPage, effectiveSearchTerm)
  }, [loadPosts, currentPage, searchTerm, externalSearchTerm])

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
                if (hasPrevPage) handlePageChange(currentPage - 1)
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
                  handlePageChange(page)
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
                if (hasNextPage) handlePageChange(currentPage + 1)
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
              <b className={post.authorName === 'KODE24' ? 'admin' : ''}>
                {post.authorName}
              </b>
            </li>
            <li className="date">{formatDate(post.publishedAt || post.createdAt)}</li>
          </ul>
        )
    }
  }

  return (
    <div className="article-content">
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
          ) : error ? (
            <div className="error-message" style={{ textAlign: 'center', padding: '50px 0', color: '#ff4444' }}>
              {error}
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
      {pagination && pagination.totalPages > 1 && renderPagination()}
    </div>
  )
} 