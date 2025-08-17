'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function PatentListPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        {/* 원본 HTML 구조와 동일 */}
        <article className="gallery-list patent-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Certifications &amp; Patents</small>
              <h3 className="typed">인증특허</h3>
            </div>
            
            <div className="article-content">
              <ul>
                <li>
                  <Link href="/introduction/patent_view" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_patent01.png" alt="" />
                    </div>
                    <div className="details">
                      <p>재도전 참여패키지 참여선정기업</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/introduction/patent_view" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_patent02.png" alt="" />
                    </div>
                    <div className="details">
                      <p>몸캠피싱 24시 해결 코드24</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}