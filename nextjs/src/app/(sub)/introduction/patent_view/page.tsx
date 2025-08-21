'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Script from 'next/script'
import Link from 'next/link'

export default function PatentViewPage() {
  return (
    <>
      {/* cursor-pointer */}
      {/* <div className="cursor">
        <div className="cursor__ball cursor__ball--big">
          <svg height="30" width="30">
            <circle cx="15" cy="15" r="12" strokeWidth="0"></circle>
          </svg>
        </div>
        <div className="cursor__ball cursor__ball--small">
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" strokeWidth="0"></circle>
          </svg>
        </div>
      </div> */}
      
      <Header />
      
      {/* nav */}
      <nav id="nav" className="">
        <div className="container">
          <ul>
            <li>
              <Link href="/introduction/introduce" className="hoverable">KODE24 소개</Link>
              <ul>
                <li><Link href="/introduction/introduce" className="hoverable">KODE24 소개</Link></li>
                <li><Link href="/introduction/press_list" className="hoverable">보도자료</Link></li>
                <li><Link href="/introduction/patent_list" className="hoverable">인증특허</Link></li>
              </ul>
            </li>
            <li><Link href="/solution/initial" className="hoverable">솔루션 안내</Link></li>
            <li>
              <Link href="/solve/real_time_list" className="hoverable">긴급해결문의</Link>
              <ul>
                <li><Link href="/solve/real_time_list" className="hoverable">실시간 해결 문의</Link></li>
                <li><Link href="/solve/review_list" className="hoverable">솔루션 진행 후기</Link></li>
              </ul>
            </li>
            <li>
              <Link href="/customer/notice_list" className="hoverable">고객센터</Link>
              <ul>
                <li><Link href="/customer/notice_list" className="hoverable">공지사항</Link></li>
                <li><Link href="/customer/qna" className="hoverable">자주묻는질문</Link></li>
                <li><Link href="/customer/sns_list" className="hoverable">SNS 채널</Link></li>
              </ul>
            </li>
            <li>
              <Link href="/report/kode_list" className="hoverable">사이버 보안 리포트</Link>
              <ul>
                <li><Link href="/report/kode_list" className="hoverable">코드24 보안리포트</Link></li>
                <li><Link href="/report/app_list" className="hoverable">악성 앱 분석</Link></li>
                <li><Link href="/report/issue_list" className="hoverable">보안 이슈</Link></li>
              </ul>
            </li>
          </ul>
          <div className="contact">
            <a href="tel:15552501" className="hoverable">
              <b>1555-2501</b>
              <p>kode24@kode24.co.kr</p>
            </a>
          </div>
        </div>
      </nav>
      
      {/* content */}
      <main id="content">
        
        {/* patent-view */}
        <article className="patent-view view-wrap">
          <div className="container">
            <div className="article-header">
              <small className="typed">Certifications &amp; Patents</small>
              <h3 className="typed">인증특허</h3>
              <div className="btn-area">
                <Link href="/introduction/patent_list" className="hoverable">목록</Link>
              </div>
            </div>
            <div className="article-content">
              <div className="board-view">
                <div className="view-header">
                  <b className="title">[ 코드24 보호장비 및 기술 안내 ]</b>
                  <p className="writer">KODE24</p>
                  <ul className="info">
                    <li>2025.05.16 02:23</li>
                    <li className="hit">15</li>
                    <li className="comment">0</li>
                  </ul>
                </div>
                <div className="view-body">
                  <p>
                    안녕하세요.<br />
                    코드24 입니다.<br /><br />
                    많이 문의하시는 부분들 중 하나인 &ldquo;코드24는 어떻게 몸캠피싱을 방어하나요?&rdquo; 에 대한<br />
                    답변으로 몇 자료를 공유하려 합니다.<br />
                    일단 저희 코드24 &ldquo;main front device&rdquo; 장비들입니다.<br />
                    주로 &ldquo;Data jamming&rdquo; 과 &ldquo;A.I. deepfake face swap&rdquo;그리고, &ldquo;가해자 tracking&rdquo;으로 활용되고 있으며<br />
                    실시간 긴급 대응용으로 활용되어 고객님들이 보다 빠르게 몸캠피싱 피해에서 벗어날 수 있도록 구축되어진<br />
                    시스템을 갖추고 있습니다. 
                  </p>
                </div>
                {/* comment */}
                <div className="comment">
                  <div className="comment-top">
                    <b>댓글</b>
                  </div>
                  <div className="comment-body">
                    <div className="secret-comment">
                      <ul>
                        <li>
                          <div className="form-group">
                            <input type="text" className="form-control" placeholder="댓글을 입력해 주세요." />
                          </div>
                        </li>
                        <li>
                          <div className="form-group">
                            <input type="text" className="form-control" placeholder="이름" />
                          </div>
                        </li>
                        <li>
                          <div className="form-group">
                            <input type="password" className="form-control" placeholder="비밀번호" />
                          </div>
                        </li>
                        <li><label className="hoverable"><input type="checkbox" /> 비밀글</label></li>
                      </ul>
                      <button type="button" className="btn-submit hoverable">등록</button>
                    </div>
                    <div className="comment-list">
                      <p className="none-comment">등록된 댓글이 없습니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
        
      </main>
      
      {/* quick-link */}
      <nav className="quick-link">
        <ul>
          <li>
            <a href="tel:1555-2501" className="hoverable">
              <span>2<br />4<br />h</span>
              <img src="/assets/images/ico_quick01.svg" alt="" />
              <i className="icon"></i>
              <p>전화하기</p>
            </a>
          </li>
          <li>
            <a href="https://pf.kakao.com/_xexaDxgG/chat" target="_blank" className="hoverable">
              <img src="/assets/images/ico_quick02.svg" alt="" />
              <i className="icon"></i>
              <p>카카오톡</p>
            </a>
          </li>
          <li>
            <Link href="https://pf.kakao.com/_xexaDxgG/chat" className="hoverable">
              <img src="/assets/images/ico_quick03.svg" alt="" />
              <i className="icon"></i>
              <p>상담문의</p>
            </Link>
          </li>
          <li>
            <Link href="/solve/review_list" className="hoverable">
              <img src="/assets/images/ico_quick04.svg" alt="" />
              <i className="icon"></i>
              <p>솔루션후기</p>
            </Link>
          </li>
        </ul>
      </nav>
      
      <Footer />
      
      {/* Sub.js 스크립트 */}
      <Script 
        src="/assets/js/sub.js"
        strategy="afterInteractive"
      />
    </>
  )
}