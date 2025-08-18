'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

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

export default function SnsListPage() {
  const [snsChannels, setSnsChannels] = useState<SnsChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // SNS 채널 데이터 로드
  useEffect(() => {
    const loadSnsChannels = async () => {
      try {
        const response = await fetch('/api/sns-channels?isActive=true')
        if (response.ok) {
          const data = await response.json()
          setSnsChannels(data.snsChannels)
        } else {
          setError('SNS 채널을 불러오는데 실패했습니다.')
        }
      } catch (error) {
        console.error('SNS 채널 로딩 실패:', error)
        setError('SNS 채널을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadSnsChannels()
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <main id="content">
          <article className="sns-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">SNS</small>
                <h3 className="typed">SNS 채널</h3>
              </div>
              <div className="article-content">
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  SNS 채널을 불러오는 중입니다...
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
          <article className="sns-wrap">
            <div className="container">
              <div className="article-header">
                <small className="typed">SNS</small>
                <h3 className="typed">SNS 채널</h3>
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
        <article className="sns-wrap">
          <div className="container">
            <div className="article-header">
              <small className="typed">SNS</small>
              <h3 className="typed">SNS 채널</h3>
            </div>
            
            <div className="article-content">
              {snsChannels.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  등록된 SNS 채널이 없습니다.
                </div>
              ) : (
                <ul>
                  {snsChannels.map((channel) => (
                    <li key={channel.id}>
                      <a 
                        href={channel.linkUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hoverable"
                        title={channel.description || channel.name}
                      >
                        <figure>
                          <img 
                            src={channel.imageUrl} 
                            alt={channel.name}
                            onError={(e) => {
                              // 이미지 로드 실패 시 대체 이미지 설정
                              const target = e.target as HTMLImageElement
                              target.src = '/assets/images/sub/img_none_frame.png'
                            }}
                          />
                        </figure>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
} 