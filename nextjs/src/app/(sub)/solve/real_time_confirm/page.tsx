'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default function RealTimeConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [postId, setPostId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const id = searchParams.get('id')
    const author = searchParams.get('author')
    
    if (id) setPostId(id)
    if (author) setAuthorName(author)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const result = await response.json()

      if (response.ok) {
        // 인증 성공 시 해당 게시글로 이동
        router.push(`/solve/real_time_view?id=${postId}&verified=true`)
      } else {
        alert(result.message || '비밀번호가 일치하지 않습니다.')
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error)
      alert('비밀번호 확인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      
      <main id="content">
        {/* 원본 HTML 구조와 완전히 동일 */}
        <article className="pw-confirm-wrap">
          <div className="container">
            <div className="pw-confirm">
              <strong>
                <span>{authorName || 'ㅇㅇ'}님의 </span>게시글 입니다.
              </strong>
              <span>비밀글 기능으로 보호된 글입니다.</span>
              <p>
                작성자와 관리자만 열람하실 수 있습니다.<br />
                본인이라면 비밀번호를 입력하세요
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="비밀번호를 입력해 주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="btn-area">
                  <button 
                    type="submit" 
                    className="btn-confirm hoverable"
                    disabled={loading}
                  >
                    {loading ? '확인 중...' : '확인'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}