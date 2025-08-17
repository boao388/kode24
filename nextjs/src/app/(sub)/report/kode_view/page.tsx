import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function KodeViewPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-view-wrap kode-view">
          <div className="container">
            <div className="article-header">
              <small className="typed">Security Report</small>
              <h3 className="typed">코드24 보안리포트 상세</h3>
            </div>
            
            <div className="article-content">
              <div className="view-header">
                <div className="view-info">
                  <h4>2025년 1월 몸캠피싱 동향 및 대응 방안</h4>
                  <ul className="info-list">
                    <li>발행일: 2025-01-15</li>
                    <li>리포트 번호: KODE24-2025-001</li>
                    <li>분류: 몸캠피싱</li>
                    <li>위험도: 높음</li>
                    <li>조회수: 1,245</li>
                  </ul>
                </div>
              </div>
              
              <div className="view-content">
                <div className="report-detail">
                  <div className="content-section">
                    <h5>요약</h5>
                    <p>
                      2025년 1월 첫 2주 동안 몸캠피싱 피해 신고가 전월 대비 35% 증가했습니다. 
                      특히 20-30대 남성을 대상으로 한 신종 수법이 확산되고 있어 각별한 주의가 필요합니다.
                    </p>
                  </div>
                  
                  <div className="content-section">
                    <h5>주요 동향</h5>
                    <div className="trend-stats">
                      <div className="stat-item">
                        <h6>피해 증가율</h6>
                        <span className="stat-number">+35%</span>
                        <p>전월 대비 신고 건수 증가</p>
                      </div>
                      <div className="stat-item">
                        <h6>주요 대상</h6>
                        <span className="stat-number">20-30대</span>
                        <p>남성 피해자 비율 증가</p>
                      </div>
                      <div className="stat-item">
                        <h6>평균 피해액</h6>
                        <span className="stat-number">150만원</span>
                        <p>1인당 평균 금전 피해</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>신종 수법 분석</h5>
                    <div className="method-analysis">
                      <div className="method-item">
                        <h6>1. AI 딥페이크 활용</h6>
                        <p>
                          범죄자들이 AI 기술을 악용하여 더욱 정교한 가짜 영상을 제작하고 있습니다. 
                          피해자의 얼굴을 합성한 영상으로 협박하는 사례가 증가하고 있습니다.
                        </p>
                      </div>
                      <div className="method-item">
                        <h6>2. 소셜 엔지니어링 강화</h6>
                        <p>
                          SNS 정보를 사전에 수집하여 피해자의 관심사나 인맥을 파악한 후, 
                          맞춤형 접근을 통해 신뢰를 쌓는 수법이 정교해지고 있습니다.
                        </p>
                      </div>
                      <div className="method-item">
                        <h6>3. 다중 플랫폼 활용</h6>
                        <p>
                          단일 메신저가 아닌 여러 플랫폼을 동시에 활용하여 
                          피해자가 도피할 경로를 차단하는 수법이 나타나고 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>대응 방안</h5>
                    <div className="response-guide">
                      <div className="guide-category">
                        <h6>예방 수칙</h6>
                        <ul>
                          <li>모르는 사람과의 영상통화 절대 금지</li>
                          <li>개인정보 노출 최소화</li>
                          <li>의심스러운 링크 클릭 금지</li>
                          <li>정기적인 개인정보 보안 점검</li>
                        </ul>
                      </div>
                      <div className="guide-category">
                        <h6>피해 발생 시 대응</h6>
                        <ul>
                          <li>즉시 112 신고 및 사이버수사대 신고</li>
                          <li>모든 대화 내용과 증거 보전</li>
                          <li>금전 요구에 절대 응하지 말 것</li>
                          <li>전문기관(KODE24 등) 상담 요청</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>KODE24 대응 현황</h5>
                    <p>
                      KODE24는 1월 첫 2주 동안 총 47건의 몸캠피싱 사건을 처리했으며, 
                      이 중 89%에서 완전한 문제 해결을 달성했습니다. 
                      평균 대응 시간은 2.3시간으로 업계 최고 수준의 신속성을 유지하고 있습니다.
                    </p>
                    
                    <div className="success-stats">
                      <div className="success-item">
                        <span className="success-rate">89%</span>
                        <span className="success-label">완전 해결률</span>
                      </div>
                      <div className="success-item">
                        <span className="success-rate">2.3시간</span>
                        <span className="success-label">평균 대응 시간</span>
                      </div>
                      <div className="success-item">
                        <span className="success-rate">47건</span>
                        <span className="success-label">처리 건수</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="view-footer">
                <div className="btn-area">
                  <Link href="/report/kode_list" className="btn-list hoverable">
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