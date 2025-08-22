'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Popup, PopupFormData } from '@/types'

export default function PopupsManagePage() {
  const router = useRouter()
  const [popups, setPopups] = useState<Popup[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null)
  const [formData, setFormData] = useState<PopupFormData>({
    title: '',
    imageUrl: '',
    linkUrl: '',
    isActive: true,
    sortOrder: 1,
    startDate: '',
    endDate: ''
  })

  // 팝업 목록 조회
  const loadPopups = async () => {
    try {
      console.log('팝업 목록 조회 시작...')
      const token = localStorage.getItem('adminToken')
      console.log('토큰 확인:', token ? '존재함' : '없음')
      
      if (!token) {
        console.log('토큰이 없어서 로그인 페이지로 이동')
        router.push('/admin/login')
        return
      }

      console.log('API 호출 시작...')
      const response = await fetch('/api/popups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('API 응답 상태:', response.status)
      if (!response.ok) {
        if (response.status === 401) {
          console.log('인증 실패 - 토큰 제거 후 로그인 페이지로 이동')
          localStorage.removeItem('adminToken')
          router.push('/admin/login')
          return
        }
        throw new Error('팝업 목록 조회에 실패했습니다.')
      }

      const data = await response.json()
      console.log('받은 데이터:', data)
      setPopups(data.popups || [])
      console.log('팝업 목록 설정 완료')
    } catch (error) {
      console.error('팝업 목록 조회 실패:', error)
      alert('팝업 목록 조회에 실패했습니다.')
    } finally {
      console.log('로딩 상태 false로 변경')
      setLoading(false)
    }
  }

  // 팝업 저장
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert('팝업 제목을 입력해주세요.')
      return
    }

    if (!formData.imageUrl.trim()) {
      alert('팝업 이미지를 업로드해주세요.')
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const url = editingPopup ? `/api/popups/${editingPopup.id}` : '/api/popups'
      const method = editingPopup ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.message || '팝업 저장에 실패했습니다.')
        return
      }

      alert(result.message || '팝업이 저장되었습니다.')
      setShowForm(false)
      setEditingPopup(null)
      resetForm()
      loadPopups()
    } catch (error) {
      console.error('팝업 저장 실패:', error)
      alert('팝업 저장에 실패했습니다.')
    }
  }

  // 팝업 삭제
  const handleDelete = async (popup: Popup) => {
    if (!confirm(`"${popup.title}" 팝업을 삭제하시겠습니까?`)) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`/api/popups/${popup.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.message || '팝업 삭제에 실패했습니다.')
        return
      }

      alert(result.message || '팝업이 삭제되었습니다.')
      loadPopups()
    } catch (error) {
      console.error('팝업 삭제 실패:', error)
      alert('팝업 삭제에 실패했습니다.')
    }
  }

  // 팝업 편집
  const handleEdit = (popup: Popup) => {
    setEditingPopup(popup)
    setFormData({
      title: popup.title,
      imageUrl: popup.imageUrl,
      linkUrl: popup.linkUrl || '',
      isActive: popup.isActive,
      sortOrder: popup.sortOrder,
      startDate: popup.startDate ? new Date(popup.startDate).toISOString().split('T')[0] : '',
      endDate: popup.endDate ? new Date(popup.endDate).toISOString().split('T')[0] : ''
    })
    setShowForm(true)
  }

  // 폼 리셋
  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      linkUrl: '',
      isActive: true,
      sortOrder: 1,
      startDate: '',
      endDate: ''
    })
  }

  // 파일 업로드
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('파일 업로드에 실패했습니다.')
      }

      const result = await response.json()
      setFormData(prev => ({ ...prev, imageUrl: result.url }))
    } catch (error) {
      console.error('파일 업로드 실패:', error)
      alert('파일 업로드에 실패했습니다.')
    }
  }

  useEffect(() => {
    loadPopups()
  }, [])

  if (loading) {
    return (
      <div className="admin-container" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          로딩 중...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>팝업 관리</h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingPopup(null)
              resetForm()
            }}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            팝업 추가
          </button>
        </div>

        {/* 팝업 목록 */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#666', margin: 0 }}>
              • 최대 3개의 팝업을 활성화할 수 있습니다.<br />
              • 순서는 1, 2, 3으로 설정하며, 중복될 수 없습니다.<br />
              • 시작일/종료일을 설정하지 않으면 항상 표시됩니다.
            </p>
          </div>

          {popups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              등록된 팝업이 없습니다.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>순서</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>이미지</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>제목</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>링크</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>상태</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>기간</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {popups.map((popup) => (
                    <tr key={popup.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          display: 'inline-block',
                          width: '30px',
                          height: '30px',
                          backgroundColor: popup.isActive ? '#007bff' : '#6c757d',
                          color: 'white',
                          borderRadius: '50%',
                          textAlign: 'center',
                          lineHeight: '30px',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {popup.sortOrder}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div style={{ width: '80px', height: '60px', position: 'relative', border: '1px solid #dee2e6', borderRadius: '4px', overflow: 'hidden' }}>
                          <Image
                            src={popup.imageUrl}
                            alt={popup.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div style={{ fontWeight: '500' }}>{popup.title}</div>
                      </td>
                      <td style={{ padding: '15px' }}>
                        {popup.linkUrl ? (
                          <a href={popup.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                            {popup.linkUrl.length > 30 ? `${popup.linkUrl.substring(0, 30)}...` : popup.linkUrl}
                          </a>
                        ) : (
                          <span style={{ color: '#6c757d' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: popup.isActive ? '#d4edda' : '#f8d7da',
                          color: popup.isActive ? '#155724' : '#721c24'
                        }}>
                          {popup.isActive ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {popup.startDate && (
                            <div>시작: {new Date(popup.startDate).toLocaleDateString()}</div>
                          )}
                          {popup.endDate && (
                            <div>종료: {new Date(popup.endDate).toLocaleDateString()}</div>
                          )}
                          {!popup.startDate && !popup.endDate && (
                            <div>항상 표시</div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEdit(popup)}
                          className="btn-edit-small"
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginRight: '8px'
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(popup)}
                          className="btn-delete-small"
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 팝업 폼 모달 */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                {editingPopup ? '팝업 수정' : '팝업 추가'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    팝업 제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="팝업 제목을 입력하세요"
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    팝업 이미지 *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginBottom: '10px'
                    }}
                  />
                  {formData.imageUrl && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ width: '200px', height: '150px', position: 'relative', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                        <Image
                          src={formData.imageUrl}
                          alt="미리보기"
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    링크 URL (선택사항)
                  </label>
                  <input
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="클릭 시 이동할 URL을 입력하세요"
                  />
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      표출 순서 *
                    </label>
                    <select
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      required
                    >
                      <option value={1}>1순위</option>
                      <option value={2}>2순위</option>
                      <option value={3}>3순위</option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      활성 상태
                    </label>
                    <select
                      value={formData.isActive.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="true">활성</option>
                      <option value="false">비활성</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      시작일 (선택사항)
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      종료일 (선택사항)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingPopup(null)
                      resetForm()
                    }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {editingPopup ? '수정' : '저장'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
