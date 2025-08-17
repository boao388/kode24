'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function SnsListPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-list-wrap sns-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">SNS</small>
              <h3 className="typed">SNS 소식</h3>
              
              <div className="search-form">
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="검색어를 입력해 주세요" />
                  <button type="button" className="btn-search hoverable">
                    <img src="/assets/images/sub/ico_search.png" alt="검색" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="article-content">
              <div className="sns-grid">
                <div className="sns-item">
                  <div className="sns-thumb">
                    <img src="/assets/images/sub/img_yotube.png" alt="유튜브" />
                    <div className="sns-overlay">
                      <a href="https://www.youtube.com/@코드24" target="_blank" className="btn-play hoverable">
                        <img src="/assets/images/ico_youtube.png" alt="유튜브 재생" />
                      </a>
                    </div>
                  </div>
                  <div className="sns-content">
                    <h4>몸캠피싱 예방법 완전정복</h4>
                    <p>몸캠피싱 피해를 예방하는 방법을 자세히 알려드립니다. 전문가가 직접 설명하는 예방 수칙과 대응 방법을 확인하세요.</p>
                    <div className="sns-meta">
                      <span className="date">2025-01-15</span>
                      <span className="view">조회수 15,234</span>
                    </div>
                  </div>
                </div>
                
                <div className="sns-item">
                  <div className="sns-thumb">
                    <img src="/assets/images/sub/img_blog.png" alt="블로그" />
                    <div className="sns-overlay">
                      <a href="https://blog.naver.com/numerous13288" target="_blank" className="btn-link hoverable">
                        <img src="/assets/images/ico_blog.png" alt="블로그 바로가기" />
                      </a>
                    </div>
                  </div>
                  <div className="sns-content">
                    <h4>AI 딥페이크 범죄 대응 가이드</h4>
                    <p>최신 AI 기술을 악용한 딥페이크 범죄의 특징과 대응 방법을 소개합니다. 피해 예방을 위한 필수 정보를 확인하세요.</p>
                    <div className="sns-meta">
                      <span className="date">2025-01-12</span>
                      <span className="view">조회수 8,921</span>
                    </div>
                  </div>
                </div>
                
                <div className="sns-item">
                  <div className="sns-thumb">
                    <img src="/assets/images/sub/img_yotube.png" alt="유튜브" />
                    <div className="sns-overlay">
                      <a href="https://www.youtube.com/@코드24" target="_blank" className="btn-play hoverable">
                        <img src="/assets/images/ico_youtube.png" alt="유튜브 재생" />
                      </a>
                    </div>
                  </div>
                  <div className="sns-content">
                    <h4>디지털 성범죄 신고 방법</h4>
                    <p>디지털 성범죄 피해를 당했을 때 올바른 신고 절차와 증거 보전 방법을 안내합니다.</p>
                    <div className="sns-meta">
                      <span className="date">2025-01-10</span>
                      <span className="view">조회수 12,456</span>
                    </div>
                  </div>
                </div>
                
                <div className="sns-item">
                  <div className="sns-thumb">
                    <img src="/assets/images/sub/img_blog.png" alt="블로그" />
                    <div className="sns-overlay">
                      <a href="https://blog.naver.com/numerous13288" target="_blank" className="btn-link hoverable">
                        <img src="/assets/images/ico_blog.png" alt="블로그 바로가기" />
                      </a>
                    </div>
                  </div>
                  <div className="sns-content">
                    <h4>사이버 범죄 최신 동향</h4>
                    <p>2025년 새로운 사이버 범죄 수법과 대응 전략을 분석한 리포트입니다.</p>
                    <div className="sns-meta">
                      <span className="date">2025-01-08</span>
                      <span className="view">조회수 6,789</span>
                    </div>
                  </div>
                </div>
                
                <div className="sns-item">
                  <div className="sns-thumb">
                    <img src="/assets/images/sub/img_yotube.png" alt="유튜브" />
                    <div className="sns-overlay">
                      <a href="https://www.youtube.com/@코드24" target="_blank" className="btn-play hoverable">
                        <img src="/assets/images/ico_youtube.png" alt="유튜브 재생" />
                      </a>
                    </div>
                  </div>
                  <div className="sns-content">
                    <h4>법적 대응 절차 안내</h4>
                    <p>디지털 성범죄 피해자를 위한 법적 대응 절차와 지원 제도를 상세히 설명합니다.</p>
                    <div className="sns-meta">
                      <span className="date">2025-01-05</span>
                      <span className="view">조회수 9,876</span>
                    </div>
                  </div>
                </div>
                
                <div className="sns-item">
                  <div className="sns-thumb">
                    <img src="/assets/images/sub/img_blog.png" alt="블로그" />
                    <div className="sns-overlay">
                      <a href="https://blog.naver.com/numerous13288" target="_blank" className="btn-link hoverable">
                        <img src="/assets/images/ico_blog.png" alt="블로그 바로가기" />
                      </a>
                    </div>
                  </div>
                  <div className="sns-content">
                    <h4>심리적 트라우마 극복 방법</h4>
                    <p>디지털 성범죄 피해로 인한 심리적 상처를 치유하는 방법과 전문 상담 정보를 제공합니다.</p>
                    <div className="sns-meta">
                      <span className="date">2025-01-03</span>
                      <span className="view">조회수 11,234</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* pagination */}
              <div className="pagination">
                <a href="#" className="btn-prev disabled">
                  <img src="/assets/images/sub/ico_pagination_prev.png" alt="이전" />
                </a>
                <div className="page-numbers">
                  <a href="#" className="active">1</a>
                  <a href="#">2</a>
                  <a href="#">3</a>
                  <a href="#">4</a>
                  <a href="#">5</a>
                </div>
                <a href="#" className="btn-next">
                  <img src="/assets/images/sub/ico_pagination_next.png" alt="다음" />
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
} 