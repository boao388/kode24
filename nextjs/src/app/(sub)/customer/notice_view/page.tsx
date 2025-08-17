'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function NoticeViewPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-view-wrap notice-view">
          <div className="container">
            <div className="article-header">
              <small className="typed">Notice</small>
              <h3 className="typed">공지사항</h3>
            </div>
            
            <div className="article-content">
              <div className="view-header">
                <div className="view-info">
                  <h4>몸캠피싱 피해 예방을 위한 중요 안내사항</h4>
                  <ul className="info-list">
                    <li>작성일: 2025-01-15</li>
                    <li>조회수: 1,245</li>
                    <li>작성자: 관리자</li>
                  </ul>
                </div>
              </div>
              
              <div className="view-content">
                <div className="content-body">
                  <p>안녕하세요, KODE24입니다.</p>
                  <p>최근 몸캠피싱 범죄가 증가하고 있어 피해 예방을 위한 중요한 안내사항을 공지드립니다.</p>
                  
                  <h5>주요 예방 수칙</h5>
                  <ul>
                    <li>모르는 사람과의 화상통화는 절대 하지 마세요</li>
                    <li>개인정보나 신체 노출이 포함된 영상은 촬영하지 마세요</li>
                    <li>의심스러운 링크나 파일은 클릭하지 마세요</li>
                    <li>피해를 당했다면 즉시 전문가에게 상담받으세요</li>
                  </ul>
                  
                  <h5>긴급 연락처</h5>
                  <p>피해를 당하셨거나 의심스러운 상황이 발생하면 즉시 아래 연락처로 문의해주세요.</p>
                  <ul>
                    <li>24시간 상담전화: 1555-2501</li>
                    <li>이메일: kode24@kode24.co.kr</li>
                    <li>온라인 상담: 홈페이지 실시간 문의</li>
                  </ul>
                  
                  <p>여러분의 안전한 인터넷 생활을 위해 KODE24가 항상 함께하겠습니다.</p>
                  <p>감사합니다.</p>
                </div>
              </div>
              
              <div className="view-nav">
                <ul>
                  <li className="prev">
                    <Link href="/customer/notice_list" className="hoverable">
                      <span>이전글</span>
                      <b>KODE24 서비스 업데이트 안내</b>
                    </Link>
                  </li>
                  <li className="next">
                    <Link href="/customer/notice_list" className="hoverable">
                      <span>다음글</span>
                      <b>연말연시 상담 일정 안내</b>
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="btn-area">
                <Link href="/customer/notice_list" className="btn-list hoverable">목록으로</Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
} 