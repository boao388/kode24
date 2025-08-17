import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function ReviewConfirmPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-confirm-wrap review-confirm">
          <div className="container">
            <div className="article-header">
              <small className="typed">Review</small>
              <h3 className="typed">솔루션 진행 후기 등록 완료</h3>
            </div>
            
            <div className="article-content">
              <div className="confirm-message">
                <div className="message-icon">
                  <img src="/assets/images/ico_msg.png" alt="" />
                </div>
                <h4>후기가 성공적으로 등록되었습니다.</h4>
                <p>
                  소중한 후기를 작성해 주셔서 감사합니다.<br />
                  고객님의 경험이 다른 분들에게 큰 도움이 될 것입니다.
                </p>
              </div>
              
              <div className="confirm-info">
                <div className="info-box">
                  <h5>등록 정보</h5>
                  <dl>
                    <dt>후기 번호</dt>
                    <dd>#REVIEW-2025011501</dd>
                    <dt>등록일시</dt>
                    <dd>2025년 01월 15일 16:45</dd>
                    <dt>제목</dt>
                    <dd>KODE24 덕분에 몸캠피싱 피해를 완전히 해결했습니다</dd>
                    <dt>만족도</dt>
                    <dd>⭐⭐⭐⭐⭐ 매우 만족</dd>
                    <dt>공개 여부</dt>
                    <dd>공개</dd>
                  </dl>
                </div>
                
                <div className="info-box">
                  <h5>후기 활용</h5>
                  <ul>
                    <li>고객님의 후기는 다른 피해자들에게 희망과 용기를 줄 것입니다</li>
                    <li>KODE24 서비스 개선을 위한 소중한 자료로 활용됩니다</li>
                    <li>익명으로 처리되어 개인정보는 완전히 보호됩니다</li>
                    <li>언제든지 수정이나 삭제를 요청하실 수 있습니다</li>
                  </ul>
                </div>
                
                <div className="info-box reward">
                  <h5>후기 작성 혜택</h5>
                  <div className="reward-content">
                    <div className="reward-icon">🎁</div>
                    <div className="reward-text">
                      <p><strong>감사의 마음을 담아 소정의 선물을 준비했습니다</strong></p>
                      <p>
                        등록해 주신 연락처로 별도 안내드릴 예정입니다.<br />
                        (모바일 상품권 또는 생활용품 중 선택 가능)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="info-box additional-support">
                  <h5>지속적인 지원</h5>
                  <p>
                    KODE24는 문제 해결 후에도 지속적인 사후 관리를 제공합니다.<br />
                    혹시 추가적인 도움이 필요하시거나 궁금한 점이 있으시면<br />
                    언제든지 <strong>1555-2501</strong>로 연락주시기 바랍니다.
                  </p>
                </div>
              </div>
              
              <div className="btn-area">
                <Link href="/" className="btn-home hoverable">
                  홈으로
                </Link>
                <Link href="/solve/review_list" className="btn-list hoverable">
                  후기 목록
                </Link>
                <Link href="/solve/review_view" className="btn-view hoverable">
                  내 후기 보기
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