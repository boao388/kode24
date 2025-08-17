import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function ReviewViewPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-view-wrap review-view">
          <div className="container">
            <div className="article-header">
              <small className="typed">Review</small>
              <h3 className="typed">솔루션 진행 후기</h3>
            </div>
            
            <div className="article-content">
              <div className="view-header">
                <div className="view-info">
                  <h4>KODE24 덕분에 몸캠피싱 피해를 완전히 해결했습니다</h4>
                  <ul className="info-list">
                    <li>작성자: 김○○</li>
                    <li>작성일: 2025-01-10</li>
                    <li>이용 서비스: 긴급 대응 서비스</li>
                    <li>만족도: ⭐⭐⭐⭐⭐ 매우 만족</li>
                    <li>조회수: 245</li>
                  </ul>
                </div>
              </div>
              
              <div className="view-content">
                <div className="review-detail">
                  <div className="content-section">
                    <h5>서비스 이용 계기</h5>
                    <p>
                      작년 12월 말에 몸캠피싱 피해를 당하게 되었습니다. 
                      처음에는 어떻게 대응해야 할지 전혀 몰라서 혼란스러웠는데, 
                      인터넷 검색을 통해 KODE24를 알게 되었습니다.
                    </p>
                  </div>
                  
                  <div className="content-section">
                    <h5>상담 과정에서의 경험</h5>
                    <p>
                      24시간 상담 전화로 연락했는데, 새벽 시간이었음에도 불구하고 
                      전문 상담사가 친절하게 응답해 주셨습니다. 
                      제 상황을 자세히 듣고 즉시 대응 방안을 제시해 주셨습니다.
                    </p>
                    <p>
                      특히 감정적으로 매우 불안했던 상황에서 차분하게 설명해 주시고, 
                      단계별로 해야 할 일들을 정리해 주셔서 큰 도움이 되었습니다.
                    </p>
                  </div>
                  
                  <div className="content-section">
                    <h5>문제 해결 과정</h5>
                    <p>
                      상담 후 즉시 다음과 같은 조치를 취했습니다:
                    </p>
                    <ul>
                      <li>경찰 신고 및 사이버수사대 접수</li>
                      <li>모든 증거 자료 수집 및 보전</li>
                      <li>범인과의 연락 차단</li>
                      <li>금융 계좌 및 개인정보 보안 강화</li>
                    </ul>
                    <p>
                      KODE24 전문가들이 각 단계마다 세심하게 가이드해 주셨고, 
                      법적 대응까지 함께 진행해 주셨습니다.
                    </p>
                  </div>
                  
                  <div className="content-section">
                    <h5>만족스러웠던 점</h5>
                    <ul>
                      <li><strong>신속한 대응:</strong> 24시간 언제든지 상담 가능</li>
                      <li><strong>전문성:</strong> 경험 많은 전문가의 체계적인 솔루션</li>
                      <li><strong>심리적 지원:</strong> 정신적 충격에 대한 케어까지</li>
                      <li><strong>사후 관리:</strong> 문제 해결 후에도 지속적인 모니터링</li>
                      <li><strong>완전한 해결:</strong> 범인 검거까지 성공적으로 완료</li>
                    </ul>
                  </div>
                  
                  <div className="content-section">
                    <h5>추천 이유</h5>
                    <p>
                      몸캠피싱 피해를 당하신 분들께 KODE24를 적극 추천합니다. 
                      혼자서는 절대 해결할 수 없었던 문제를 완벽하게 해결해 주셨고, 
                      무엇보다 피해자의 입장에서 이해하고 도와주시는 모습이 인상적이었습니다.
                    </p>
                    <p>
                      지금은 일상생활을 완전히 회복했고, 더 이상 불안하지 않습니다. 
                      KODE24 덕분에 새로운 삶을 시작할 수 있게 되었습니다. 정말 감사드립니다.
                    </p>
                  </div>
                </div>
                
                <div className="review-rating">
                  <div className="rating-summary">
                    <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                    <span className="rating-text">매우 만족</span>
                    <span className="recommend-badge">추천합니다</span>
                  </div>
                </div>
              </div>
              
              <div className="view-footer">
                <div className="btn-area">
                  <Link href="/solve/review_list" className="btn-list hoverable">
                    목록으로
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}