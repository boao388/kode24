import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function ReviewWritePage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-write-wrap review-write">
          <div className="container">
            <div className="article-header">
              <small className="typed">Review</small>
              <h3 className="typed">솔루션 진행 후기 작성</h3>
            </div>
            
            <div className="article-content">
              <form className="write-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>작성자 <span className="required">*</span></label>
                    <input type="text" name="author" placeholder="작성자명을 입력해 주세요" required />
                  </div>
                  <div className="form-group">
                    <label>이용 서비스 <span className="required">*</span></label>
                    <select name="service_type" required>
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
                      <input type="radio" name="rating" value="5" id="rating5" />
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
                    <input type="text" name="title" placeholder="후기 제목을 입력해 주세요" required />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>후기 내용 <span className="required">*</span></label>
                    <textarea 
                      name="content" 
                      rows={15} 
                      placeholder="KODE24 서비스를 이용하신 경험을 자세히 공유해 주세요.&#10;&#10;- 서비스 이용 계기&#10;- 상담 과정에서의 경험&#10;- 문제 해결 과정&#10;- 만족스러웠던 점&#10;- 개선이 필요한 점 등" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>추천 여부</label>
                    <div className="recommend-group">
                      <input type="radio" name="recommend" value="yes" id="recommend_yes" />
                      <label htmlFor="recommend_yes">추천합니다</label>
                      
                      <input type="radio" name="recommend" value="no" id="recommend_no" />
                      <label htmlFor="recommend_no">추천하지 않습니다</label>
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <input type="checkbox" name="privacy_agree" required />
                      개인정보 수집 및 이용에 동의합니다. <span className="required">*</span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input type="checkbox" name="public_agree" />
                      후기를 공개적으로 게시하는 것에 동의합니다.
                    </label>
                  </div>
                </div>
                
                <div className="form-footer">
                  <div className="btn-area">
                    <Link href="/solve/review_list" className="btn-cancel hoverable">
                      취소
                    </Link>
                    <button type="submit" className="btn-submit hoverable">
                      후기 등록
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