import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function ReviewModifyPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-write-wrap review-modify">
          <div className="container">
            <div className="article-header">
              <small className="typed">Review</small>
              <h3 className="typed">솔루션 진행 후기 수정</h3>
            </div>
            
            <div className="article-content">
              <form className="write-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>작성자 <span className="required">*</span></label>
                    <input type="text" name="author" defaultValue="김○○" placeholder="작성자명을 입력해 주세요" required />
                  </div>
                  <div className="form-group">
                    <label>이용 서비스 <span className="required">*</span></label>
                    <select name="service_type" defaultValue="emergency" required>
                      <option value="">선택해 주세요</option>
                      <option value="emergency">긴급 대응 서비스</option>
                      <option value="legal">법적 대응 서비스</option>
                      <option value="counseling">심리 상담 서비스</option>
                      <option value="evidence">증거 수집 서비스</option>
                      <option value="monitoring">사후 관리 서비스</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>만족도 <span className="required">*</span></label>
                    <div className="rating-group">
                      <input type="radio" name="rating" value="5" id="rating5" defaultChecked />
                      <label htmlFor="rating5">⭐⭐⭐⭐⭐ 매우 만족</label>
                      
                      <input type="radio" name="rating" value="4" id="rating4" />
                      <label htmlFor="rating4">⭐⭐⭐⭐ 만족</label>
                      
                      <input type="radio" name="rating" value="3" id="rating3" />
                      <label htmlFor="rating3">⭐⭐⭐ 보통</label>
                      
                      <input type="radio" name="rating" value="2" id="rating2" />
                      <label htmlFor="rating2">⭐⭐ 불만족</label>
                      
                      <input type="radio" name="rating" value="1" id="rating1" />
                      <label htmlFor="rating1">⭐ 매우 불만족</label>
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>제목 <span className="required">*</span></label>
                    <input type="text" name="title" defaultValue="KODE24 덕분에 몸캠피싱 피해를 완전히 해결했습니다" placeholder="후기 제목을 입력해 주세요" required />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>후기 내용 <span className="required">*</span></label>
                    <textarea 
                      name="content" 
                      rows={15} 
                      required 
                      defaultValue={`작년 12월 말에 몸캠피싱 피해를 당하게 되었습니다. 처음에는 어떻게 대응해야 할지 전혀 몰라서 혼란스러웠는데, 인터넷 검색을 통해 KODE24를 알게 되었습니다.

24시간 상담 전화로 연락했는데, 새벽 시간이었음에도 불구하고 전문 상담사가 친절하게 응답해 주셨습니다. 제 상황을 자세히 듣고 즉시 대응 방안을 제시해 주셨습니다.

특히 감정적으로 매우 불안했던 상황에서 차분하게 설명해 주시고, 단계별로 해야 할 일들을 정리해 주셔서 큰 도움이 되었습니다.

KODE24 전문가들이 각 단계마다 세심하게 가이드해 주셨고, 법적 대응까지 함께 진행해 주셨습니다. 지금은 일상생활을 완전히 회복했고, 더 이상 불안하지 않습니다.

KODE24 덕분에 새로운 삶을 시작할 수 있게 되었습니다. 정말 감사드립니다.`}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>추천 여부</label>
                    <div className="recommend-group">
                      <input type="radio" name="recommend" value="yes" id="recommend_yes" defaultChecked />
                      <label htmlFor="recommend_yes">추천합니다</label>
                      
                      <input type="radio" name="recommend" value="no" id="recommend_no" />
                      <label htmlFor="recommend_no">추천하지 않습니다</label>
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <input type="checkbox" name="privacy_agree" defaultChecked required />
                      개인정보 수집 및 이용에 동의합니다. <span className="required">*</span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input type="checkbox" name="public_agree" defaultChecked />
                      후기를 공개적으로 게시하는 것에 동의합니다.
                    </label>
                  </div>
                </div>
                
                <div className="form-footer">
                  <div className="btn-area">
                    <Link href="/solve/review_view" className="btn-cancel hoverable">
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