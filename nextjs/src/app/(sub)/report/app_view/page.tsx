import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function AppViewPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-view-wrap app-view">
          <div className="container">
            <div className="article-header">
              <small className="typed">Malicious App Analysis</small>
              <h3 className="typed">악성 앱 분석 상세</h3>
            </div>
            
            <div className="article-content">
              <div className="view-header">
                <div className="view-info">
                  <h4>가짜 뱅킹 앱 보안 위협 분석</h4>
                  <ul className="info-list">
                    <li>앱 이름: 가짜 뱅킹 앱</li>
                    <li>패키지명: com.fake.banking.app</li>
                    <li>위험도: <span className="danger-high">높음</span></li>
                    <li>발견일: 2025-01-15</li>
                    <li>분석일: 2025-01-15</li>
                  </ul>
                </div>
              </div>
              
              <div className="view-content">
                <div className="app-analysis">
                  <div className="content-section">
                    <h5>앱 개요</h5>
                    <div className="app-overview">
                      <div className="app-icon-large">
                        <img src="/assets/images/sub/img_none_frame.png" alt="앱 아이콘" />
                      </div>
                      <div className="app-basic-info">
                        <dl>
                          <dt>앱 이름</dt>
                          <dd>KB국민은행 (가짜)</dd>
                          <dt>패키지명</dt>
                          <dd>com.fake.banking.app</dd>
                          <dt>버전</dt>
                          <dd>1.2.3</dd>
                          <dt>크기</dt>
                          <dd>15.2MB</dd>
                          <dt>타겟 SDK</dt>
                          <dd>API Level 30</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>위험 요소 분석</h5>
                    <div className="risk-analysis">
                      <div className="risk-item high">
                        <h6>🔴 높은 위험</h6>
                        <ul>
                          <li>사용자 인증 정보 탈취 기능</li>
                          <li>SMS 인터셉트 기능</li>
                          <li>연락처 정보 무단 수집</li>
                          <li>루트 권한 탈취 시도</li>
                        </ul>
                      </div>
                      <div className="risk-item medium">
                        <h6>🟡 중간 위험</h6>
                        <ul>
                          <li>위치 정보 추적</li>
                          <li>앱 사용 패턴 수집</li>
                          <li>디바이스 정보 수집</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>악성 행위 상세</h5>
                    <div className="malicious-behavior">
                      <div className="behavior-item">
                        <h6>1. 피싱 페이지 표시</h6>
                        <p>
                          정상적인 은행 앱과 동일한 UI를 제공하여 사용자가 실제 은행 앱으로 
                          착각하게 만듭니다. 로그인 시 입력한 모든 정보는 외부 서버로 전송됩니다.
                        </p>
                      </div>
                      <div className="behavior-item">
                        <h6>2. SMS 인증번호 탈취</h6>
                        <p>
                          SMS 권한을 획득하여 은행에서 발송하는 인증번호를 자동으로 
                          가로채어 범죄자에게 전달합니다.
                        </p>
                      </div>
                      <div className="behavior-item">
                        <h6>3. 연락처 정보 수집</h6>
                        <p>
                          디바이스의 모든 연락처 정보를 수집하여 추가 피해자를 
                          확보하는 데 사용합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>기술적 분석</h5>
                    <div className="technical-analysis">
                      <div className="analysis-category">
                        <h6>요청 권한</h6>
                        <ul>
                          <li>READ_SMS, RECEIVE_SMS</li>
                          <li>READ_CONTACTS</li>
                          <li>ACCESS_FINE_LOCATION</li>
                          <li>CAMERA, RECORD_AUDIO</li>
                          <li>WRITE_EXTERNAL_STORAGE</li>
                        </ul>
                      </div>
                      <div className="analysis-category">
                        <h6>네트워크 통신</h6>
                        <ul>
                          <li>C&C 서버: 185.xxx.xxx.xxx</li>
                          <li>데이터 전송: HTTPS (암호화)</li>
                          <li>통신 주기: 매 5분마다</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>대응 방안</h5>
                    <div className="countermeasures">
                      <div className="measure-category immediate">
                        <h6>즉시 조치사항</h6>
                        <ul>
                          <li>해당 앱 즉시 삭제</li>
                          <li>은행 앱은 공식 스토어에서만 다운로드</li>
                          <li>비밀번호 및 인증 정보 변경</li>
                          <li>계좌 거래 내역 확인</li>
                        </ul>
                      </div>
                      <div className="measure-category prevention">
                        <h6>예방 수칙</h6>
                        <ul>
                          <li>앱 설치 전 개발자 정보 확인</li>
                          <li>과도한 권한 요청 앱 설치 금지</li>
                          <li>정기적인 보안 앱 검사</li>
                          <li>의심스러운 링크 클릭 금지</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>KODE24 대응</h5>
                    <p>
                      KODE24는 해당 악성 앱을 발견 즉시 주요 보안업체와 정보를 공유했으며, 
                      Google Play Protect 및 주요 안티바이러스 업체에 탐지 규칙을 제공했습니다. 
                      현재 대부분의 보안 솔루션에서 해당 앱을 탐지 및 차단하고 있습니다.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="view-footer">
                <div className="btn-area">
                  <Link href="/report/app_list" className="btn-list hoverable">
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