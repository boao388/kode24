import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function AppListPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-list-wrap app-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Malicious App Analysis</small>
              <h3 className="typed">악성 앱 분석</h3>
              
              <div className="search-form">
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="앱 이름 또는 키워드를 입력해 주세요" />
                  <button type="button" className="btn-search hoverable">
                    <img src="/assets/images/sub/ico_search.png" alt="검색" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="article-content">
              <div className="app-grid">
                <div className="app-item">
                  <div className="app-info">
                    <div className="app-icon">
                      <img src="/assets/images/sub/img_none_frame.png" alt="" />
                    </div>
                    <div className="app-details">
                      <h4>가짜 뱅킹 앱</h4>
                      <p className="app-package">com.fake.banking.app</p>
                      <div className="app-meta">
                        <span className="danger-level high">위험도: 높음</span>
                        <span className="report-date">2025.01.15</span>
                      </div>
                      <p className="app-description">
                        정상적인 은행 앱으로 위장하여 사용자의 금융 정보를 탈취하는 악성 앱입니다.
                      </p>
                      <Link href="/report/app_view" className="btn-view hoverable">
                        상세 분석
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="app-item">
                  <div className="app-info">
                    <div className="app-icon">
                      <img src="/assets/images/sub/img_none_frame.png" alt="" />
                    </div>
                    <div className="app-details">
                      <h4>스파이웨어 카메라 앱</h4>
                      <p className="app-package">com.spy.camera.hidden</p>
                      <div className="app-meta">
                        <span className="danger-level high">위험도: 높음</span>
                        <span className="report-date">2025.01.12</span>
                      </div>
                      <p className="app-description">
                        사용자 몰래 카메라와 마이크를 작동시켜 개인 정보를 수집하는 스파이웨어입니다.
                      </p>
                      <Link href="/report/app_view" className="btn-view hoverable">
                        상세 분석
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="app-item">
                  <div className="app-info">
                    <div className="app-icon">
                      <img src="/assets/images/sub/img_none_frame.png" alt="" />
                    </div>
                    <div className="app-details">
                      <h4>피싱 메신저 앱</h4>
                      <p className="app-package">com.fake.messenger.chat</p>
                      <div className="app-meta">
                        <span className="danger-level medium">위험도: 중간</span>
                        <span className="report-date">2025.01.10</span>
                      </div>
                      <p className="app-description">
                        인기 메신저 앱으로 위장하여 개인정보와 대화 내용을 탈취하는 악성 앱입니다.
                      </p>
                      <Link href="/report/app_view" className="btn-view hoverable">
                        상세 분석
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pagination">
                <a href="#" className="btn-prev">
                  <img src="/assets/images/sub/ico_pagination_prev.png" alt="이전" />
                </a>
                <div className="page-numbers">
                  <a href="#" className="active">1</a>
                  <a href="#">2</a>
                  <a href="#">3</a>
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