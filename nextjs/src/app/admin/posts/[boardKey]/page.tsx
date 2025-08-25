'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import HtmlEditor from '@/components/ui/HtmlEditor'

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
  
  // 인라인 편집 상태 관리
  const [inlineEditing, setInlineEditing] = useState<{ id: string; field: 'viewCount' | 'createdAt' } | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  
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
    let isMounted = true // 컴포넌트 마운트 상태 추적
    
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      console.log('Admin token not found, redirecting to login')
      if (isMounted) router.push('/admin/login')
      return
    }
    
    // 토큰 유효성 검사
    try {
      const tokenData = JSON.parse(atob(adminToken.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      if (tokenData.exp && tokenData.exp < currentTime) {
        console.log('Admin token expired, redirecting to login')
        localStorage.removeItem('adminToken')
        if (isMounted) router.push('/admin/login')
        return
      }
      
      console.log('Admin token valid, loading posts')
    } catch (error) {
      console.error('Invalid token format:', error)
      localStorage.removeItem('adminToken')
      if (isMounted) router.push('/admin/login')
      return
    }
    
    return () => { isMounted = false }
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
        ...(search && { search }),
        _t: Date.now().toString() // 캐시 무력화를 위한 타임스탬프
      })

      const response = await fetch(`/api/admin/posts?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate', // 강력한 캐시 무력화
          'Pragma': 'no-cache'
        },
        cache: 'no-store' // 브라우저 캐시 무력화
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

  // 인라인 편집 시작
  const handleInlineEdit = (postId: string, field: 'viewCount' | 'createdAt', currentValue: string | number) => {
    setInlineEditing({ id: postId, field })
    if (field === 'createdAt') {
      // 날짜를 YYYY-MM-DD HH:mm 형식으로 변환
      const date = new Date(currentValue)
      const formattedDate = date.toISOString().slice(0, 16)
      setEditingValue(formattedDate)
    } else {
      setEditingValue(String(currentValue))
    }
  }

  // 인라인 편집 취소
  const handleInlineCancel = () => {
    setInlineEditing(null)
    setEditingValue('')
  }

  // 인라인 편집 저장
  const handleInlineSave = async () => {
    if (!inlineEditing) return

    setIsUpdating(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      
      // 현재 편집 중인 게시글 찾기
      const currentPost = posts.find(post => post.id === inlineEditing.id)
      if (!currentPost) {
        alert('게시글을 찾을 수 없습니다.')
        return
      }

      // 기본 데이터 (필수 필드 포함)
      const updateData: any = {
        title: currentPost.title,
        content: currentPost.content
      }

      if (inlineEditing.field === 'viewCount') {
        const viewCount = parseInt(editingValue)
        if (isNaN(viewCount) || viewCount < 0) {
          alert('조회수는 0 이상의 숫자여야 합니다.')
          return
        }
        updateData.viewCount = viewCount
      } else if (inlineEditing.field === 'createdAt') {
        const date = new Date(editingValue)
        if (isNaN(date.getTime())) {
          alert('올바른 날짜 형식을 입력해주세요.')
          return
        }
        updateData.createdAt = date.toISOString()
        updateData.publishedAt = date.toISOString() // 사용자 페이지 반영을 위해 publishedAt도 함께 수정
      }

      const response = await fetch(`/api/admin/posts/${inlineEditing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        alert('수정되었습니다.')
        
        // 즉시 로컬 상태 업데이트 (더 빠른 반영)
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === inlineEditing.id) {
            const updatedPost = { ...post }
            if (inlineEditing.field === 'viewCount') {
              updatedPost.viewCount = parseInt(editingValue)
            } else if (inlineEditing.field === 'createdAt') {
              // datetime-local 형식을 Date 객체로 변환
              const newDate = new Date(editingValue).toISOString()
              updatedPost.createdAt = newDate
              updatedPost.publishedAt = newDate // 사용자 페이지에서 보는 publishedAt도 업데이트
            }
            return updatedPost
          }
          return post
        }))
        
        setInlineEditing(null)
        setEditingValue('')
        
        // 배경에서 최신 데이터 동기화 (캐시 무력화 포함)
        setTimeout(() => {
          loadPosts(currentPage, searchTerm)
        }, 100)
      } else {
        const errorData = await response.json()
        alert(errorData.error || '수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('인라인 수정 실패:', error)
      alert('수정 중 오류가 발생했습니다.')
    } finally {
      setIsUpdating(false)
    }
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
              <HtmlEditor
                value={formData.content}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, content: value }))
                }}
                placeholder="게시글 내용을 입력하세요..."
                height={500}
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
                      {/* 조회수 - 인라인 편집 가능 */}
                      <td className="editable-cell">
                        {inlineEditing?.id === post.id && inlineEditing.field === 'viewCount' ? (
                          <div className="inline-edit-container">
                            <input
                              type="number"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="inline-edit-input"
                              min="0"
                              disabled={isUpdating}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleInlineSave()
                                if (e.key === 'Escape') handleInlineCancel()
                              }}
                              autoFocus
                            />
                            <div className="inline-edit-buttons">
                              <button 
                                onClick={handleInlineSave}
                                disabled={isUpdating}
                                className="btn-save-inline"
                                title="저장"
                              >
                                ✓
                              </button>
                              <button 
                                onClick={handleInlineCancel}
                                disabled={isUpdating}
                                className="btn-cancel-inline"
                                title="취소"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span 
                            className="editable-value"
                            onClick={() => handleInlineEdit(post.id, 'viewCount', post.viewCount)}
                            title="클릭하여 편집"
                          >
                            {post.viewCount.toLocaleString()}
                          </span>
                        )}
                      </td>
                      
                      <td>{post.commentCount}</td>
                      
                      {/* 등록일 - 인라인 편집 가능 */}
                      <td className="editable-cell">
                        {inlineEditing?.id === post.id && inlineEditing.field === 'createdAt' ? (
                          <div className="inline-edit-container">
                            <input
                              type="datetime-local"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="inline-edit-input"
                              disabled={isUpdating}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleInlineSave()
                                if (e.key === 'Escape') handleInlineCancel()
                              }}
                              autoFocus
                            />
                            <div className="inline-edit-buttons">
                              <button 
                                onClick={handleInlineSave}
                                disabled={isUpdating}
                                className="btn-save-inline"
                                title="저장"
                              >
                                ✓
                              </button>
                              <button 
                                onClick={handleInlineCancel}
                                disabled={isUpdating}
                                className="btn-cancel-inline"
                                title="취소"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span 
                            className="editable-value"
                            onClick={() => handleInlineEdit(post.id, 'createdAt', post.createdAt)}
                            title="클릭하여 편집"
                          >
                            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => {
                              // 보도자료나 인증특허에서 외부링크가 있으면 링크로 이동
                              if ((boardKey === 'press' || boardKey === 'patent') && post.linkUrl) {
                                window.open(post.linkUrl, '_blank', 'noopener,noreferrer')
                              } else {
                                // 일반적인 경우 상세 페이지로 이동
                                router.push(`/admin/posts/${boardKey}/${post.id}`)
                              }
                            }}
                            className="btn-view-small"
                          >
                            {(boardKey === 'press' || boardKey === 'patent') && post.linkUrl ? '링크' : '상세'}
                          </button>
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
          background-color: #f8f9fa;
          min-height: 100vh;
          color: #333;
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
        .btn-view-small, .btn-edit-small, .btn-delete-small {
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

        .btn-view-small {
          background: #17a2b8;
          color: white;
          padding: 4px 8px;
          font-size: 12px;
        }

        .btn-view-small:hover {
          background: #138496;
        }

        /* 인라인 편집 스타일 */
        .editable-cell {
          position: relative;
          min-width: 120px;
        }

        .editable-value {
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 3px;
          display: inline-block;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .editable-value:hover {
          background-color: #f8f9fa;
          border-color: #dee2e6;
        }

        .inline-edit-container {
          display: flex;
          align-items: center;
          gap: 5px;
          min-width: 200px;
        }

        .inline-edit-input {
          flex: 1;
          padding: 4px 8px;
          border: 1px solid #007bff;
          border-radius: 3px;
          font-size: 13px;
          min-width: 80px;
        }

        .inline-edit-input:focus {
          outline: none;
          border-color: #0056b3;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .inline-edit-buttons {
          display: flex;
          gap: 2px;
        }

        .btn-save-inline,
        .btn-cancel-inline {
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-save-inline {
          background: #28a745;
          color: white;
        }

        .btn-save-inline:hover:not(:disabled) {
          background: #218838;
        }

        .btn-cancel-inline {
          background: #dc3545;
          color: white;
        }

        .btn-cancel-inline:hover:not(:disabled) {
          background: #c82333;
        }

        .btn-save-inline:disabled,
        .btn-cancel-inline:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
} 