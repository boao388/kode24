'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function RealTimeWritePage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-write-wrap real-time-write">
          <div className="container">
            <div className="article-header">
              <small className="typed">Live Inquiry</small>
              <h3 className="typed">실시간 해결 문의 작성</h3>
            </div>
            
            <div className="article-content">
              <form className="write-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>이름 <span className="required">*</span></label>
                    <input type="text" name="name" placeholder="이름을 입력해주세요" required />
                  </div>
                  <div className="form-group">
                    <label>연락처 <span className="required">*</span></label>
                    <input type="tel" name="phone" placeholder="연락처를 입력해주세요" required />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>이메일</label>
                    <input type="email" name="email" placeholder="이메일을 입력해주세요" />
                  </div>
                  <div className="form-group">
                    <label>문의 유형 <span className="required">*</span></label>
                    <select name="type" required>
                      <option value="">문의 유형을 선택해주세요</option>
                      <option value="몸캠피싱">몸캠피싱 피해</option>
                      <option value="딥페이크">AI 딥페이크 범죄</option>
                      <option value="디지털성범죄">디지털 성범죄</option>
                      <option value="사이버스토킹">사이버 스토킹</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>제목 <span className="required">*</span></label>
                  <input type="text" name="title" placeholder="제목을 입력해주세요" required />
                </div>
                
                <div className="form-group">
                  <label>문의 내용 <span className="required">*</span></label>
                  <textarea 
                    name="content" 
                    rows={10} 
                    placeholder="문의하실 내용을 자세히 작성해주세요.&#10;&#10;※ 개인정보나 민감한 정보는 기재하지 마시고, 상담 시 구두로 말씀해주세요.&#10;※ 긴급한 경우 1555-2501로 전화주세요."
                    required
                  ></textarea>
                  <div className="char-count">
                    <span>0</span> / 2000
                  </div>
                </div>
                
                <div className="form-group">
                  <label>첨부파일</label>
                  <div className="file-upload">
                    <input type="file" name="files" multiple accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx" />
                    <div className="file-upload-text">
                      <span>파일을 선택하거나 드래그하여 업로드하세요</span>
                      <small>최대 10MB, JPG/PNG/GIF/PDF/DOC 파일만 업로드 가능</small>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="checkbox-group">
                    <label className="checkbox">
                      <input type="checkbox" name="agree_privacy" required />
                      <span className="checkmark"></span>
                      개인정보 수집 및 이용에 동의합니다. <span className="required">*</span>
                      <a href="#" className="link-privacy">내용보기</a>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="checkbox-group">
                    <label className="checkbox">
                      <input type="checkbox" name="agree_marketing" />
                      <span className="checkmark"></span>
                      마케팅 정보 수신에 동의합니다. (선택)
                    </label>
                  </div>
                </div>
                
                <div className="notice-box">
                  <h5>📋 문의 전 확인사항</h5>
                  <ul>
                    <li>긴급한 상황의 경우 전화상담(1555-2501)을 이용해주세요.</li>
                    <li>개인정보나 민감한 정보는 온라인으로 전송하지 마세요.</li>
                    <li>문의 접수 후 24시간 이내에 연락드립니다.</li>
                    <li>상담은 무료이며, 비밀보장을 원칙으로 합니다.</li>
                  </ul>
                </div>
                
                <div className="btn-area">
                  <Link href="/solve/real_time_list" className="btn-cancel hoverable">취소</Link>
                  <button type="submit" className="btn-submit hoverable">문의 등록</button>
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