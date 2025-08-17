import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function IssueListPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-list-wrap issue-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Security Issues</small>
              <h3 className="typed">보안 이슈</h3>
              
              <div className="search-form">
                <div className="form-group">
                  <select className="form-control category-filter">
                    <option value="">전체 분류</option>
                    <option value="phishing">피싱</option>
                    <option value="malware">악성코드</option>
                    <option value="vulnerability">취약점</option>
                    <option value="social_engineering">사회공학</option>
                  </select>
                  <input type="text" className="form-control" placeholder="검색어를 입력해 주세요" />
                  <button type="button" className="btn-search hoverable">
                    <img src="/assets/images/sub/ico_search.png" alt="검색" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="article-content">
              <div className="issue-grid">
                <div className="issue-item urgent">
                  <div className="issue-header">
                    <span className="issue-category phishing">피싱</span>
                    <span className="issue-level urgent">긴급</span>
                    <span className="issue-date">2025.01.15</span>
                  </div>
                  <div className="issue-content">
                    <h4>
                      <Link href="/report/issue_view" className="hoverable">
                        신종 AI 딥페이크를 활용한 영상통화 피싱 급증
                      </Link>
                    </h4>
                    <p>
                      최근 AI 기술을 악용하여 실시간으로 얼굴을 합성하는 
                      신종 몸캠피싱 수법이 확산되고 있어 각별한 주의가 필요합니다.
                    </p>
                    <div className="issue-tags">
                      <span className="tag">#AI딥페이크</span>
                      <span className="tag">#몸캠피싱</span>
                      <span className="tag">#실시간합성</span>
                    </div>
                  </div>
                </div>
                
                <div className="issue-item high">
                  <div className="issue-header">
                    <span className="issue-category malware">악성코드</span>
                    <span className="issue-level high">높음</span>
                    <span className="issue-date">2025.01.12</span>
                  </div>
                  <div className="issue-content">
                    <h4>
                      <Link href="/report/issue_view" className="hoverable">
                        금융 앱으로 위장한 스파이웨어 대량 유포
                      </Link>
                    </h4>
                    <p>
                      주요 은행 앱으로 위장한 악성 앱이 대량으로 유포되고 있으며, 
                      사용자의 금융 정보와 개인정보를 탈취하고 있습니다.
                    </p>
                    <div className="issue-tags">
                      <span className="tag">#금융앱</span>
                      <span className="tag">#스파이웨어</span>
                      <span className="tag">#정보탈취</span>
                    </div>
                  </div>
                </div>
                
                <div className="issue-item medium">
                  <div className="issue-header">
                    <span className="issue-category vulnerability">취약점</span>
                    <span className="issue-level medium">보통</span>
                    <span className="issue-date">2025.01.10</span>
                  </div>
                  <div className="issue-content">
                    <h4>
                      <Link href="/report/issue_view" className="hoverable">
                        인기 메신저 앱 보안 취약점 발견
                      </Link>
                    </h4>
                    <p>
                      국내 인기 메신저 앱에서 중요한 보안 취약점이 발견되어 
                      개인정보 유출 위험이 있는 것으로 확인되었습니다.
                    </p>
                    <div className="issue-tags">
                      <span className="tag">#메신저</span>
                      <span className="tag">#취약점</span>
                      <span className="tag">#개인정보</span>
                    </div>
                  </div>
                </div>
                
                <div className="issue-item high">
                  <div className="issue-header">
                    <span className="issue-category social_engineering">사회공학</span>
                    <span className="issue-level high">높음</span>
                    <span className="issue-date">2025.01.08</span>
                  </div>
                  <div className="issue-content">
                    <h4>
                      <Link href="/report/issue_view" className="hoverable">
                        택배 배송 알림을 가장한 스미싱 공격 증가
                      </Link>
                    </h4>
                    <p>
                      연말연시 택배 물량 증가를 틈타 택배 배송 알림으로 
                      위장한 스미싱 공격이 크게 증가하고 있습니다.
                    </p>
                    <div className="issue-tags">
                      <span className="tag">#스미싱</span>
                      <span className="tag">#택배사칭</span>
                      <span className="tag">#악성링크</span>
                    </div>
                  </div>
                </div>
                
                <div className="issue-item medium">
                  <div className="issue-header">
                    <span className="issue-category phishing">피싱</span>
                    <span className="issue-level medium">보통</span>
                    <span className="issue-date">2025.01.05</span>
                  </div>
                  <div className="issue-content">
                    <h4>
                      <Link href="/report/issue_view" className="hoverable">
                        가상화폐 투자 사기 사이트 급증
                      </Link>
                    </h4>
                    <p>
                      가상화폐 시세 상승과 함께 가짜 투자 플랫폼을 통한 
                      투자 사기가 급격히 증가하고 있어 주의가 필요합니다.
                    </p>
                    <div className="issue-tags">
                      <span className="tag">#가상화폐</span>
                      <span className="tag">#투자사기</span>
                      <span className="tag">#가짜플랫폼</span>
                    </div>
                  </div>
                </div>
                
                <div className="issue-item low">
                  <div className="issue-header">
                    <span className="issue-category vulnerability">취���점</span>
                    <span className="issue-level low">낮음</span>
                    <span className="issue-date">2025.01.03</span>
                  </div>
                  <div className="issue-content">
                    <h4>
                      <Link href="/report/issue_view" className="hoverable">
                        구형 브라우저 보안 패치 권고사항
                      </Link>
                    </h4>
                    <p>
                      구형 브라우저에서 발견된 보안 취약점에 대한 
                      패치가 배포되어 즉시 업데이트를 권고합니다.
                    </p>
                    <div className="issue-tags">
                      <span className="tag">#브라우저</span>
                      <span className="tag">#보안패치</span>
                      <span className="tag">#업데이트</span>
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