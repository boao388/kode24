import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function IssueViewPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-view-wrap issue-view">
          <div className="container">
            <div className="article-header">
              <small className="typed">Security Issues</small>
              <h3 className="typed">보안 이슈 상세</h3>
            </div>
            
            <div className="article-content">
              <div className="view-header">
                <div className="view-info">
                  <h4>신종 AI 딥페이크를 활용한 영상통화 피싱 급증</h4>
                  <ul className="info-list">
                    <li>분류: <span className="category phishing">피싱</span></li>
                    <li>위험도: <span className="level urgent">긴급</span></li>
                    <li>발행일: 2025-01-15</li>
                    <li>최종 업데이트: 2025-01-15 16:30</li>
                    <li>조회수: 2,847</li>
                  </ul>
                </div>
              </div>
              
              <div className="view-content">
                <div className="issue-detail">
                  <div className="content-section">
                    <h5>이슈 개요</h5>
                    <div className="issue-summary">
                      <p>
                        최근 AI 딥페이크 기술을 악용하여 실시간으로 얼굴을 합성하는 
                        신종 몸캠피싱 수법이 급격히 확산되고 있습니다. 
                        기존의 단순한 녹화 방식에서 벗어나 실시간 얼굴 합성을 통해 
                        피해자가 범죄 상황을 인지하기 어렵게 만드는 것이 특징입니다.
                      </p>
                      
                      <div className="threat-level">
                        <div className="level-indicator urgent">
                          <span className="level-icon">🚨</span>
                          <span className="level-text">긴급 경보</span>
                        </div>
                        <p>즉시 대응이 필요한 높은 위험도의 보안 위협</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>위협 상세 분석</h5>
                    <div className="threat-analysis">
                      <div className="analysis-item">
                        <h6>1. 기술적 특징</h6>
                        <ul>
                          <li><strong>실시간 딥페이크:</strong> AI 기술을 활용한 실시간 얼굴 합성</li>
                          <li><strong>고해상도 영상:</strong> 기존 대비 월등히 향상된 영상 품질</li>
                          <li><strong>음성 합성:</strong> 피해자의 음성까지 실시간으로 모방</li>
                          <li><strong>다중 플랫폼:</strong> 여러 메신저와 화상통화 앱에서 동시 작동</li>
                        </ul>
                      </div>
                      
                      <div className="analysis-item">
                        <h6>2. 공격 방식</h6>
                        <ul>
                          <li>소셜미디어를 통한 사전 정보 수집</li>
                          <li>신뢰 관계 구축을 위한 장기간 대화</li>
                          <li>영상통화 유도 및 실시간 합성 영상 생성</li>
                          <li>합성 영상을 이용한 협박 및 금전 요구</li>
                        </ul>
                      </div>
                      
                      <div className="analysis-item">
                        <h6>3. 피해 규모</h6>
                        <div className="damage-stats">
                          <div className="stat-box">
                            <span className="stat-number">+127%</span>
                            <span className="stat-label">전월 대비 신고 증가율</span>
                          </div>
                          <div className="stat-box">
                            <span className="stat-number">18-35세</span>
                            <span className="stat-label">주요 피해 연령층</span>
                          </div>
                          <div className="stat-box">
                            <span className="stat-number">평균 280만원</span>
                            <span className="stat-label">1인당 피해 금액</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>예방 및 대응 방안</h5>
                    <div className="countermeasures">
                      <div className="measure-section prevention">
                        <h6>📋 예방 수칙</h6>
                        <div className="measure-grid">
                          <div className="measure-item">
                            <h7>기본 예방</h7>
                            <ul>
                              <li>모르는 사람과의 영상통화 절대 금지</li>
                              <li>개인 SNS 정보 공개 범위 최소화</li>
                              <li>의심스러운 링크 클릭 금지</li>
                            </ul>
                          </div>
                          <div className="measure-item">
                            <h7>기술적 대응</h7>
                            <ul>
                              <li>최신 보안 소프트웨어 설치</li>
                              <li>웹캠 물리적 차단 장치 사용</li>
                              <li>정기적인 개인정보 보안 점검</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="measure-section response">
                        <h6>🚨 피해 발생 시 대응</h6>
                        <div className="response-steps">
                          <div className="step-item urgent">
                            <span className="step-number">1</span>
                            <div className="step-content">
                              <h7>즉시 신고</h7>
                              <p>112 신고 및 사이버수사대(privacy.go.kr) 신고</p>
                            </div>
                          </div>
                          <div className="step-item urgent">
                            <span className="step-number">2</span>
                            <div className="step-content">
                              <h7>증거 보전</h7>
                              <p>모든 대화 내용, 계좌 정보, 연락처 등 캡처 및 보관</p>
                            </div>
                          </div>
                          <div className="step-item urgent">
                            <span className="step-number">3</span>
                            <div className="step-content">
                              <h7>연락 차단</h7>
                              <p>범인과의 모든 연락 수단 즉시 차단</p>
                            </div>
                          </div>
                          <div className="step-item important">
                            <span className="step-number">4</span>
                            <div className="step-content">
                              <h7>전문 상담</h7>
                              <p>KODE24 (1555-2501) 24시간 긴급 상담 요청</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>KODE24 대응 현황</h5>
                    <div className="kode24-response">
                      <p>
                        KODE24는 해당 위협을 최고 위험도로 분류하고 
                        24시간 모니터링 체계를 가동하고 있습니다.
                      </p>
                      
                      <div className="response-actions">
                        <div className="action-item completed">
                          <span className="action-status">✅</span>
                          <span className="action-text">AI 딥페이크 탐지 시스템 업데이트</span>
                        </div>
                        <div className="action-item completed">
                          <span className="action-status">✅</span>
                          <span className="action-text">주요 플랫폼사와 정보 공유</span>
                        </div>
                        <div className="action-item completed">
                          <span className="action-status">✅</span>
                          <span className="action-text">긴급 대응팀 24시간 대기</span>
                        </div>
                        <div className="action-item in-progress">
                          <span className="action-status">🔄</span>
                          <span className="action-text">범죄자 추적 및 검거 협력</span>
                        </div>
                      </div>
                      
                      <div className="contact-emergency">
                        <h6>긴급 상담 연락처</h6>
                        <div className="emergency-contact">
                          <span className="contact-number">1555-2501</span>
                          <span className="contact-desc">24시간 무료 상담</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>관련 링크</h5>
                    <div className="related-links">
                      <ul>
                        <li><Link href="/report/kode_list" className="hoverable">KODE24 보안리포트</Link></li>
                        <li><Link href="/solve/real_time_list" className="hoverable">긴급 상담 신청</Link></li>
                        <li><a href="https://privacy.go.kr" target="_blank" className="hoverable">개인정보보호위원회 신고센터</a></li>
                        <li><a href="https://cyberbureau.police.go.kr" target="_blank" className="hoverable">사이버수사대</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="view-footer">
                <div className="btn-area">
                  <Link href="/report/issue_list" className="btn-list hoverable">
                    목록으로
                  </Link>
                  <Link href="/solve/real_time_write" className="btn-emergency hoverable">
                    긴급 상담 신청
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