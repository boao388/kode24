'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SnsChannel {
  id: string
  name: string
  description?: string
  imageUrl: string
  linkUrl: string
  platform: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export default function AdminSnsChannelsPage() {
  const router = useRouter()
  
  const [snsChannels, setSnsChannels] = useState<SnsChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingChannel, setEditingChannel] = useState<SnsChannel | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    platform: 'youtube',
    isActive: true,
    sortOrder: 0
  })

  // 관리자 인증 확인
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin/login')
      return
    }
  }, [router])

  // SNS 채널 목록 로드
  const loadSnsChannels = async () => {
    try {
      const response = await fetch('/api/sns-channels')
      if (response.ok) {
        const data = await response.json()
        setSnsChannels(data.snsChannels)
      }
    } catch (error) {
      console.error('SNS 채널 로딩 실패:', error)
      alert('SNS 채널을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSnsChannels()
  }, [])

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : 
              value
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
      uploadFormData.append('bucket', 'sns-images')

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

    try {
      const method = editingChannel ? 'PUT' : 'POST'
      const url = editingChannel 
        ? `/api/sns-channels/${editingChannel.id}` 
        : '/api/sns-channels'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        resetForm()
        loadSnsChannels()
      } else {
        const errorData = await response.json()
        alert(errorData.error || '처리에 실패했습니다.')
      }
    } catch (error) {
      console.error('SNS 채널 저장 에러:', error)
      alert('SNS 채널 저장 중 오류가 발생했습니다.')
    }
  }

  // 편집 시작
  const handleEdit = (channel: SnsChannel) => {
    setEditingChannel(channel)
    setFormData({
      name: channel.name,
      description: channel.description || '',
      imageUrl: channel.imageUrl,
      linkUrl: channel.linkUrl,
      platform: channel.platform,
      isActive: channel.isActive,
      sortOrder: channel.sortOrder
    })
    setShowForm(true)
  }

  // 삭제 처리
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`'${name}' SNS 채널을 삭제하시겠습니까?`)) return

    try {
      const response = await fetch(`/api/sns-channels/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        loadSnsChannels()
      } else {
        const errorData = await response.json()
        alert(errorData.error || '삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('SNS 채널 삭제 에러:', error)
      alert('SNS 채널 삭제 중 오류가 발생했습니다.')
    }
  }

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      platform: 'youtube',
      isActive: true,
      sortOrder: 0
    })
    setEditingChannel(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          SNS 채널을 불러오는 중입니다...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>SNS 채널 관리</h1>
        <div className="admin-actions">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? '목록 보기' : 'SNS 채널 추가'}
          </button>
          <button 
            onClick={() => router.push('/admin/dashboard')}
            className="btn-secondary"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>

      {showForm && (
        <div className="admin-form-section">
          <h2>{editingChannel ? 'SNS 채널 수정' : 'SNS 채널 추가'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">채널명 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="예: YouTube, 네이버 블로그"
              />
            </div>

            <div className="form-group">
              <label htmlFor="platform">플랫폼 *</label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                required
              >
                <option value="youtube">YouTube</option>
                <option value="blog">블로그</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="linkUrl">채널 링크 *</label>
              <input
                type="url"
                id="linkUrl"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleInputChange}
                required
                placeholder="https://www.youtube.com/@channel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">설명</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="채널에 대한 간단한 설명을 입력하세요"
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUpload">이미지 업로드 *</label>
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
                  <img src={formData.imageUrl} alt="미리보기" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  <p>현재 이미지: {formData.imageUrl}</p>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sortOrder">정렬 순서</label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                활성화
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingChannel ? '수정' : '생성'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-content">
        <h2>SNS 채널 목록 ({snsChannels.length}개)</h2>
        {snsChannels.length === 0 ? (
          <p>등록된 SNS 채널이 없습니다.</p>
        ) : (
          <div className="sns-channels-grid">
            {snsChannels.map((channel) => (
              <div key={channel.id} className="sns-channel-card">
                <div className="sns-channel-image">
                  <img src={channel.imageUrl} alt={channel.name} />
                </div>
                <div className="sns-channel-info">
                  <h3>{channel.name}</h3>
                  <p className="platform">플랫폼: {channel.platform}</p>
                  {channel.description && (
                    <p className="description">{channel.description}</p>
                  )}
                  <p className="link">
                    <a href={channel.linkUrl} target="_blank" rel="noopener noreferrer">
                      채널 바로가기 →
                    </a>
                  </p>
                  <div className="sns-channel-meta">
                    <span className={`status ${channel.isActive ? 'active' : 'inactive'}`}>
                      {channel.isActive ? '활성' : '비활성'}
                    </span>
                    <span className="sort">정렬: {channel.sortOrder}</span>
                  </div>
                  <div className="sns-channel-actions">
                    <button 
                      onClick={() => handleEdit(channel)}
                      className="btn-edit"
                    >
                      수정
                    </button>
                    <button 
                      onClick={() => handleDelete(channel.id, channel.name)}
                      className="btn-delete"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-container {
          padding: 20px;
          max-width: 1200px;
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
        }

        .admin-actions {
          display: flex;
          gap: 10px;
        }

        .admin-form-section {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .admin-form {
          max-width: 600px;
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
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .image-preview {
          margin-top: 10px;
          padding: 10px;
          background: #fff;
          border-radius: 4px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }

        .sns-channels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .sns-channel-card {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .sns-channel-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .sns-channel-image {
          width: 100%;
          height: 150px;
          overflow: hidden;
        }

        .sns-channel-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sns-channel-info {
          padding: 20px;
        }

        .sns-channel-info h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .sns-channel-info .platform {
          color: #666;
          font-size: 14px;
          margin: 5px 0;
        }

        .sns-channel-info .description {
          color: #777;
          font-size: 14px;
          margin: 10px 0;
          line-height: 1.4;
        }

        .sns-channel-info .link a {
          color: #0066cc;
          text-decoration: none;
          font-size: 14px;
        }

        .sns-channel-meta {
          display: flex;
          justify-content: space-between;
          margin: 15px 0;
          font-size: 12px;
        }

        .status.active {
          color: #28a745;
          font-weight: 600;
        }

        .status.inactive {
          color: #dc3545;
          font-weight: 600;
        }

        .sns-channel-actions {
          display: flex;
          gap: 10px;
        }

        .btn-primary, .btn-secondary, .btn-edit, .btn-delete {
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

        .btn-edit {
          background: #28a745;
          color: white;
        }

        .btn-edit:hover {
          background: #218838;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
        }

        .btn-delete:hover {
          background: #c82333;
        }
      `}</style>
    </div>
  )
} 