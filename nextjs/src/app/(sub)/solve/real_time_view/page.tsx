import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function RealTimeViewPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-view-wrap real-time-view">
          <div className="container">
            <div className="article-header">
              <small className="typed">Live Inquiry</small>
              <h3 className="typed">실시간 해결 문의 상세</h3>
            </div>
            
            <div className="article-content">
              <div className="view-header">
                <div className="view-info">
                  <h4>몸캠피싱 피해 긴급 상담 요청</h4>
                  <ul className="info-list">
                    <li>작성자: 김○○</li>
                    <li>작성일: 2025-01-15 14:30</li>
                    <li>상태: <span className="status processing">처리중</span></li>
                    <li>조회수: 1</li>
                  </ul>
                </div>
              </div>
              
              <div className="view-content">
                <div className="inquiry-detail">
                  <div className="content-section">
                    <h5>상담 내용</h5>
                    <div className="content-text">
                      <p>어제 저녁에 SNS를 통해 접근한 사람과 영상통화를 하던 중 몸캠피싱 피해를 당했습니다. 
                      현재 가족들과 지인들에게 영상이 유포될까 봐 매우 불안한 상태입니다.</p>
                      
                      <p>범인은 제 연락처와 SNS 정보를 모두 알고 있는 상황이며, 
                      금전을 요구하고 있습니다. 어떻게 대응해야 할지 급히 상담받고 싶습니다.</p>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>연락처 정보</h5>
                    <div className="contact-info">
                      <p>연락처: 010-****-1234</p>
                      <p>이메일: kim****@email.com</p>
                      <p>희망 상담 시간: 평일 오후 2-6시</p>
                    </div>
                  </div>
                  
                  <div className="content-section">
                    <h5>전문가 답변</h5>
                    <div className="expert-reply">
                      <div className="reply-header">
                        <span className="expert-name">KODE24 전문상담사</span>
                        <span className="reply-date">2025-01-15 15:45</span>
                      </div>
                      <div className="reply-content">
                        <p>안녕하세요. KODE24 전문상담사입니다.</p>
                        <p>우선 신고해 주셔서 감사드리며, 현재 상황이 매우 심각함을 이해하고 있습니다. 
                        즉시 다음과 같은 조치를 취해주시기 바랍니다:</p>
                        
                        <ol>
                          <li><strong>경찰신고:</strong> 즉시 112 신고 또는 사이버수사대 신고</li>
                          <li><strong>증거보전:</strong> 대화내용, 계좌정보 등 모든 증거 캡처 및 보관</li>
                          <li><strong>금전요구 거부:</strong> 절대 돈을 보내지 마세요</li>
                          <li><strong>연락차단:</strong> 범인과의 모든 연락을 차단하세요</li>
                        </ol>
                        
                        <p>저희 KODE24에서 24시간 긴급 상담 서비스를 제공하고 있습니다. 
                        1555-2501로 즉시 연락 주시면 전문가가 직접 상담해 드리겠습니다.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="view-footer">
                <div className="btn-area">
                  <Link href="/solve/real_time_modify" className="btn-modify hoverable">
                    수정
                  </Link>
                  <Link href="/solve/real_time_list" className="btn-list hoverable">
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