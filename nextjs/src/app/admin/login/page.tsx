'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email.trim() || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        // 로그인 성공 시 토큰을 localStorage에 저장
        if (data.token) {
          localStorage.setItem('adminToken', data.token)
          console.log('Admin token saved to localStorage')
        }
        
        // 관리자 대시보드로 이동
        router.push('/admin/dashboard')
      } else {
        setError(data.message || '로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('로그인 실패:', error)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="login-header">
          <Link href="/" className="home-link">
            <img src="/assets/images/img_logo.svg" alt="KODE24" className="logo" />
          </Link>
          <h2>관리자 로그인</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="관리자 이메일을 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="login-footer">
          <Link href="/" className="back-to-home">
            메인 페이지로 돌아가기
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          color: #333;
        }

        .admin-login-container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .home-link {
          display: inline-block;
          margin-bottom: 20px;
        }

        .logo {
          height: 40px;
          width: auto;
        }

        .login-header h2 {
          color: #333;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }

        .login-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          color: #555;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-group input:disabled {
          background-color: #f8f9fa;
          opacity: 0.7;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          border-left: 4px solid #c33;
        }

        .login-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e1e5e9;
        }

        .back-to-home {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .back-to-home:hover {
          color: #667eea;
        }
      `}</style>
    </div>
  )
} 