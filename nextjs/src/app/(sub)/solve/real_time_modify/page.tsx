import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function RealTimeModifyPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-write-wrap real-time-modify">
          <div className="container">
            <div className="article-header">
              <small className="typed">Live Inquiry</small>
              <h3 className="typed">실시간 해결 문의 수정</h3>
            </div>
            
            <div className="article-content">
              <form className="write-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>이름 <span className="required">*</span></label>
                    <input type="text" name="name" defaultValue="김○○" placeholder="이름을 입력해 주세요" required />
                  </div>
                  <div className="form-group">
                    <label>연락처 <span className="required">*</span></label>
                    <input type="tel" name="phone" defaultValue="010-****-1234" placeholder="연락처를 입력해 주세요" required />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>이메일</label>
                    <input type="email" name="email" defaultValue="kim****@email.com" placeholder="이메일을 입력해 주세요" />
                  </div>
                  <div className="form-group">
                    <label>희망 상담 시간</label>
                    <select name="consultation_time">
                      <option value="">선택해 주세요</option>
                      <option value="morning" selected>오전 (09:00-12:00)</option>
                      <option value="afternoon">오후 (13:00-18:00)</option>
                      <option value="evening">저녁 (18:00-21:00)</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>제목 <span className="required">*</span></label>
                    <input type="text" name="title" defaultValue="몸캠피싱 피해 긴급 상담 요청" placeholder="제목을 입력해 주세요" required />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>상담 내용 <span className="required">*</span></label>
                    <textarea name="content" rows={10} placeholder="상담 받고 싶은 내용을 자세히 입력해 주세요" required>
어제 저녁에 SNS를 통해 접근한 사람과 영상통화를 하던 중 몸캠피싱 피해를 당했습니다. 
현재 가족들과 지인들에게 영상이 유포될까 봐 매우 불안한 상태입니다.

범인은 제 연락처와 SNS 정보를 모두 알고 있는 상황이며, 
금전을 요구하고 있습니다. 어떻게 대응해야 할지 급히 상담받고 싶습니다.
                    </textarea>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <input type="checkbox" name="privacy_agree" defaultChecked required />
                      개인정보 수집 및 이용에 동의합니다. <span className="required">*</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-footer">
                  <div className="btn-area">
                    <Link href="/solve/real_time_view" className="btn-cancel hoverable">
                      취소
                    </Link>
                    <button type="submit" className="btn-submit hoverable">
                      수정 완료
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}