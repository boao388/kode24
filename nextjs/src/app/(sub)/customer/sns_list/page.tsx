'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default function SnsListPage() {
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
              <ul>
                <li>
                  <a href="https://www.youtube.com/@%EC%BD%94%EB%93%9C24" target="_blank" className="hoverable">
                    <figure>
                      <img src="/assets/images/sub/img_yotube.png" alt="" />
                    </figure>
                  </a>
                </li>
                <li>
                  <a href="https://blog.naver.com/numerous13288" target="_blank" className="hoverable">
                    <figure>
                      <img src="/assets/images/sub/img_blog.png" alt="" />
                    </figure>
                  </a>
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