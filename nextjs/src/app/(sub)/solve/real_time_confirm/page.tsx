import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function RealTimeConfirmPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-confirm-wrap real-time-confirm">
          <div className="container">
            <div className="article-header">
              <small className="typed">Live Inquiry</small>
              <h3 className="typed">실시간 해결 문의 접수 완료</h3>
            </div>
            
            <div className="article-content">
              <div className="confirm-message">
                <div className="message-icon">
                  <img src="/assets/images/ico_msg.png" alt="" />
                </div>
                <h4>문의가 성공적으로 접수되었습니다.</h4>
                <p>
                  고객님의 소중한 문의를 접수받았습니다.<br />
                  전문 상담사가 검토 후 빠른 시일 내에 연락드리겠습니다.
                </p>
              </div>
              
              <div className="confirm-info">
                <div className="info-box">
                  <h5>접수 정보</h5>
                  <dl>
                    <dt>접수번호</dt>
                    <dd>#KODE24-2025011501</dd>
                    <dt>접수일시</dt>
                    <dd>2025년 01월 15일 14:30</dd>
                    <dt>연락처</dt>
                    <dd>010-****-1234</dd>
                    <dt>상담 예상 시간</dt>
                    <dd>오전 (09:00-12:00)</dd>
                  </dl>
                </div>
                
                <div className="info-box">
                  <h5>처리 절차</h5>
                  <ol>
                    <li>전문 상담사 배정 (접수 후 30분 이내)</li>
                    <li>긴급도 판단 및 우선순위 결정</li>
                    <li>고객 연락 및 상담 진행</li>
                    <li>솔루션 제공 및 사후 관리</li>
                  </ol>
                </div>
                
                <div className="info-box emergency">
                  <h5>긴급 상황 시</h5>
                  <p>
                    <strong>24시간 긴급 상담 전화: 1555-2501</strong><br />
                    생명이 위급하거나 즉시 대응이 필요한 경우<br />
                    언제든지 위 번호로 연락주시기 바랍니다.
                  </p>
                </div>
              </div>
              
              <div className="btn-area">
                <Link href="/" className="btn-home hoverable">
                  홈으로
                </Link>
                <Link href="/solve/real_time_list" className="btn-list hoverable">
                  문의 목록
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}