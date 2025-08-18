'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Post {
  id: string
  title: string
  content?: string
  authorName?: string
  isSecret: boolean
  isFeatured: boolean
  viewCount: number
  commentCount: number
  linkUrl?: string
  imageUrl?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
  board: {
    key: string
    title: string
  }
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

// 게시판별 설정 정보
const BOARD_CONFIGS: Record<string, any> = {
  notice: {
    title: '공지사항',
    icon: '📢',
    fields: ['title', 'content', 'isFeatured'],
    hasImage: false,
    hasLink: false,
    hasPublishedAt: false,
    authorEditable: false
  },
  kode_report: {
    title: '코드24 보안리포트',
    icon: '🛡️',
    fields: ['title', 'content'],
    hasImage: false,
    hasLink: false,
    hasPublishedAt: false,
    authorEditable: false
  },
  app_report: {
    title: '악성 앱 분석',
    icon: '📱',
    fields: ['title', 'content'],
    hasImage: false,
    hasLink: false,
    hasPublishedAt: false,
    authorEditable: false
  },
  issue_report: {
    title: '보안 이슈',
    icon: '⚠️',
    fields: ['title', 'content'],
    hasImage: false,
    hasLink: false,
    hasPublishedAt: false,
    authorEditable: false
  },
  press: {
    title: '보도자료',
    icon: '📰',
    fields: ['title', 'content', 'linkUrl', 'imageUrl', 'publishedAt'],
    hasImage: true,
    hasLink: true,
    hasPublishedAt: true,
    authorEditable: false
  },
  patent: {
    title: '인증특허',
    icon: '🏆',
    fields: ['title', 'content', 'linkUrl', 'imageUrl'],
    hasImage: true,
    hasLink: true,
    hasPublishedAt: false,
    authorEditable: false
  },
  real_time: {
    title: '실시간 해결문의',
    icon: '🚨',
    fields: ['title', 'content', 'authorName'],
    hasImage: false,
    hasLink: false,
    hasPublishedAt: false,
    authorEditable: true,
    userGenerated: true
  },
  review: {
    title: '솔루션 진행 후기',
    icon: '⭐',
    fields: ['title', 'content', 'authorName'],
    hasImage: false,
    hasLink: false,
    hasPublishedAt: false,
    authorEditable: true,
    userGenerated: true
  }
}

export default function AdminPostsPage() {
  const router = useRouter()
  const params = useParams()
  const boardKey = params.boardKey as string
  
  const config = BOARD_CONFIGS[boardKey]
  
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorName: '',
    authorEmail: '',
    isFeatured: false,
    linkUrl: '',
    imageUrl: '',
    publishedAt: ''
  })

  // 관리자 인증 확인
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin/login')
      return
    }
  }, [router])

  // 게시글 목록 로드
  const loadPosts = async (page = 1, search = '') => {
    try {
      setLoading(true)
      const adminToken = localStorage.getItem('adminToken')
      const queryParams = new URLSearchParams({
        boardKey,
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/posts?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        const data: ApiResponse = await response.json()
        setPosts(data.posts)
        setPagination(data.pagination)
        setCurrentPage(page)
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
      } else {
        const errorData = await response.json()
        alert(errorData.error || '게시글을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('게시글 로딩 실패:', error)
      alert('게시글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (config) {
      loadPosts(1, searchTerm)
    }
  }, [boardKey, config])

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadPosts(1, searchTerm)
  }

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('bucket', 'post-images')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, imageUrl: data.url }))
        alert('이미지가 성공적으로 업로드되었습니다.')
      } else {
        const errorData = await response.json()
        alert(errorData.error || '이미지 업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('이미지 업로드 에러:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploadingImage(false)
    }
  }

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      alert('제목과 내용은 필수 입력 사항입니다.')
      return
    }

    try {
      const adminToken = localStorage.getItem('adminToken')
      const method = editingPost ? 'PUT' : 'POST'
      const url = editingPost 
        ? `/api/admin/posts/${editingPost.id}` 
        : '/api/admin/posts'

      const requestData = {
        boardKey,
        title: formData.title,
        content: formData.content,
        ...(config.authorEditable && formData.authorName && { authorName: formData.authorName }),
        ...(formData.authorEmail && { authorEmail: formData.authorEmail }),
        ...(config.fields.includes('isFeatured') && { isFeatured: formData.isFeatured }),
        ...(config.hasLink && formData.linkUrl && { linkUrl: formData.linkUrl }),
        ...(config.hasImage && formData.imageUrl && { imageUrl: formData.imageUrl }),
        ...(config.hasPublishedAt && formData.publishedAt && { publishedAt: formData.publishedAt })
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        resetForm()
        loadPosts(currentPage, searchTerm)
      } else {
        const errorData = await response.json()
        alert(errorData.error || '처리에 실패했습니다.')
      }
    } catch (error) {
      console.error('게시글 저장 에러:', error)
      alert('게시글 저장 중 오류가 발생했습니다.')
    }
  }

  // 편집 시작
  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content || '',
      authorName: post.authorName || '',
      authorEmail: '',
      isFeatured: post.isFeatured,
      linkUrl: post.linkUrl || '',
      imageUrl: post.imageUrl || '',
      publishedAt: post.publishedAt ? post.publishedAt.split('T')[0] : ''
    })
    setShowForm(true)
  }

  // 삭제 처리
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`'${title}' 게시글을 삭제하시겠습니까?`)) return

    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        loadPosts(currentPage, searchTerm)
      } else {
        const errorData = await response.json()
        alert(errorData.error || '삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('게시글 삭제 에러:', error)
      alert('게시글 삭제 중 오류가 발생했습니다.')
    }
  }

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      authorName: '',
      authorEmail: '',
      isFeatured: false,
      linkUrl: '',
      imageUrl: '',
      publishedAt: ''
    })
    setEditingPost(null)
    setShowForm(false)
  }

  // 페이지 변경
  const handlePageChange = (page: number) => {
    loadPosts(page, searchTerm)
  }

  if (!config) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          존재하지 않는 게시판입니다.
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          게시글을 불러오는 중입니다...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>
          <span className="board-icon">{config.icon}</span>
          {config.title} 관리
        </h1>
        <div className="admin-actions">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? '목록 보기' : '게시글 추가'}
          </button>
          <button 
            onClick={() => router.push('/admin/dashboard')}
            className="btn-secondary"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>

      {/* 검색 폼 */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목, 내용, 작성자로 검색..."
            className="search-input"
          />
          <button type="submit" className="btn-search">검색</button>
          {searchTerm && (
            <button 
              type="button" 
              onClick={() => {
                setSearchTerm('')
                loadPosts(1, '')
              }}
              className="btn-reset"
            >
              전체보기
            </button>
          )}
        </form>
      </div>

      {showForm && (
        <div className="admin-form-section">
          <h2>{editingPost ? '게시글 수정' : '게시글 추가'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="title">제목 *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="게시글 제목을 입력하세요"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">내용 *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={15}
                placeholder="게시글 내용을 입력하세요 (HTML 태그 사용 가능)"
              />
            </div>

            {config.authorEditable && (
              <div className="form-group">
                <label htmlFor="authorName">작성자명</label>
                <input
                  type="text"
                  id="authorName"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  placeholder="작성자명"
                />
              </div>
            )}

            {config.fields.includes('isFeatured') && (
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  중요 공지 (상단 고정)
                </label>
              </div>
            )}

            {config.hasLink && (
              <div className="form-group">
                <label htmlFor="linkUrl">외부 링크</label>
                <input
                  type="url"
                  id="linkUrl"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
            )}

            {config.hasImage && (
              <div className="form-group">
                <label htmlFor="imageUpload">대표 이미지</label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p>이미지 업로드 중...</p>}
                {formData.imageUrl && (
                  <div className="image-preview">
                    <img src={formData.imageUrl} alt="미리보기" style={{ width: '200px', height: '150px', objectFit: 'cover' }} />
                    <p>현재 이미지: {formData.imageUrl}</p>
                  </div>
                )}
              </div>
            )}

            {config.hasPublishedAt && (
              <div className="form-group">
                <label htmlFor="publishedAt">발행일</label>
                <input
                  type="date"
                  id="publishedAt"
                  name="publishedAt"
                  value={formData.publishedAt}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingPost ? '수정' : '생성'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-content">
        <div className="content-header">
          <h2>게시글 목록 ({pagination?.totalPosts || 0}개)</h2>
          {searchTerm && (
            <p className="search-result">'{searchTerm}' 검색 결과</p>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="no-posts">
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}
          </div>
        ) : (
          <>
            <div className="posts-table">
              <table>
                <thead>
                  <tr>
                    <th>제목</th>
                    {config.authorEditable && <th>작성자</th>}
                    <th>조회수</th>
                    <th>댓글수</th>
                    <th>등록일</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="title-cell">
                        <div className="post-title">
                          {post.isFeatured && <span className="featured-badge">공지</span>}
                          {post.isSecret && <span className="secret-badge">비밀</span>}
                          <span className="title-text">{post.title}</span>
                        </div>
                        {post.linkUrl && (
                          <a 
                            href={post.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="external-link"
                            title="외부 링크"
                          >
                            🔗
                          </a>
                        )}
                      </td>
                      {config.authorEditable && (
                        <td>{post.authorName || '-'}</td>
                      )}
                      <td>{post.viewCount}</td>
                      <td>{post.commentCount}</td>
                      <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleEdit(post)}
                            className="btn-edit-small"
                          >
                            수정
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id, post.title)}
                            className="btn-delete-small"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination-section">
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="pagination-btn"
                  >
                    이전
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const startPage = Math.max(1, currentPage - 2)
                    const pageNum = startPage + i
                    if (pageNum > pagination.totalPages) return null
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="pagination-btn"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .admin-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .admin-header h1 {
          color: #333;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .board-icon {
          font-size: 1.2em;
        }

        .admin-actions {
          display: flex;
          gap: 10px;
        }

        .search-section {
          margin-bottom: 20px;
        }

        .search-form {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .search-input {
          flex: 1;
          max-width: 400px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .admin-form-section {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .admin-form {
          max-width: 800px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 200px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
        }

        .image-preview {
          margin-top: 10px;
          padding: 10px;
          background: #fff;
          border-radius: 4px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .search-result {
          color: #666;
          font-style: italic;
        }

        .no-posts {
          text-align: center;
          padding: 50px 0;
          color: #666;
        }

        .posts-table {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .posts-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .posts-table th,
        .posts-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .posts-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #555;
        }

        .title-cell {
          max-width: 400px;
        }

        .post-title {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .featured-badge {
          background: #dc3545;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
        }

        .secret-badge {
          background: #6c757d;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
        }

        .title-text {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .external-link {
          color: #007bff;
          text-decoration: none;
          font-size: 16px;
        }

        .action-buttons {
          display: flex;
          gap: 5px;
        }

        .pagination-section {
          margin-top: 30px;
          display: flex;
          justify-content: center;
        }

        .pagination {
          display: flex;
          gap: 5px;
        }

        .pagination-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: #fff;
          color: #555;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f8f9fa;
        }

        .pagination-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Button Styles */
        .btn-primary, .btn-secondary, .btn-search, .btn-reset,
        .btn-edit-small, .btn-delete-small {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-search {
          background: #28a745;
          color: white;
        }

        .btn-search:hover {
          background: #218838;
        }

        .btn-reset {
          background: #17a2b8;
          color: white;
        }

        .btn-reset:hover {
          background: #138496;
        }

        .btn-edit-small {
          background: #28a745;
          color: white;
          padding: 4px 8px;
          font-size: 12px;
        }

        .btn-edit-small:hover {
          background: #218838;
        }

        .btn-delete-small {
          background: #dc3545;
          color: white;
          padding: 4px 8px;
          font-size: 12px;
        }

        .btn-delete-small:hover {
          background: #c82333;
        }
      `}</style>
    </div>
  )
} 