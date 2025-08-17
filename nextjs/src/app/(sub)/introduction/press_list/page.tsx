'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default function PressListPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        {/* 원본 HTML 구조와 동일 */}
        <article className="gallery-list press-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Press Releases</small>
              <h3 className="typed">보도자료</h3>
            </div>
            
            <div className="article-content">
              <ul>
                <li>
                  <a href="https://www.dailysecu.com/news/articleView.html?idxno=166144" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press01.png" alt="" />
                    </div>
                    <div className="details">
                      <p>몸캠피싱 해결전문기업 코드24, 중소벤처기업부 '2025년 초기창업패키지' 최종 선정</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.epnc.co.kr/news/articleView.html?idxno=308655" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press02.png" alt="" />
                    </div>
                    <div className="details">
                      <p>'코드24', 2024 재창업 데모데이 우수 기업 선정</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.asiatime.co.kr/news/articleView.html?idxno=527651" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press03.png" alt="" />
                    </div>
                    <div className="details">
                      <p>'몸캠피싱 해결 전문기업' 코드24, 2024 재창업데모데이서 우수기업상 수상</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.joseilbo.com/news/htmls/2024/11/20241113523058.html" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press04.png" alt="" />
                    </div>
                    <div className="details">
                      <p>코드24(KODE24), '2024 재창업 데모데이' 우수기업상 수상</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.joseilbo.com/news/htmls/2024/11/20241113523058.html" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press05.png" alt="" />
                    </div>
                    <div className="details">
                      <p>몸캠피싱 해결전문기업 코드24, 중소벤처기업부 '2025년 초기창업패키지' 최종 선정</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.joseilbo.com/news/htmls/2024/11/20241113523058.html" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press06.png" alt="" />
                    </div>
                    <div className="details">
                      <p>몸캠피싱 해결전문기업 코드24, 중소벤처기업부 '2025년 초기창업패키지' 최종 선정</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.joseilbo.com/news/htmls/2024/11/20241113523058.html" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press07.png" alt="" />
                    </div>
                    <div className="details">
                      <p>몸캠피싱 해결전문기업 코드24, 중소벤처기업부 '2025년 초기창업패키지' 최종 선정</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.joseilbo.com/news/htmls/2024/11/20241113523058.html" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press08.png" alt="" />
                    </div>
                    <div className="details">
                      <p>몸캠피싱 해결전문기업 코드24, 중소벤처기업부 '2025년 초기창업패키지' 최종 선정</p>
                      <span className="date">2025-05-16</span>
                    </div>
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