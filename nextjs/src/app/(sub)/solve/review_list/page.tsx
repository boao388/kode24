'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Script from 'next/script'
import Link from 'next/link'

export default function ReviewListPage() {
  return (
    <>
      {/* cursor-pointer */}
      <div className="cursor">
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
      </div>
      
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
        
        {/* review-list */}
        <article className="board-list-wrap review-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Solution Feedback</small>
              <h3 className="typed">솔루션 진행 후기</h3>
              {/* search-form */}
              <div className="search-form">
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="검색어를 입력해 주세요" />
                  <button type="button" className="btn-search hoverable">
                    <img src="/assets/images/sub/ico_search.png" alt="" />
                  </button>
                </div>
                <div className="btn-area">
                  <Link href="/solve/review_write" className="btn-write hoverable">글쓰기</Link>
                </div>
              </div>
            </div>
            <div className="article-content">
              <div className="board-list">
                <div className="thead">
                  <ul>
                    <li>제목</li>
                    <li>조회수</li>
                    <li>작성자</li>
                    <li>작성일</li>
                  </ul>
                </div>
                <div className="tbody">
                  <ul>
                    <li>
                      <ul>
                        <li>
                          <Link href="/solve/review_view" className="hoverable">감사드립니다...</Link>
                        </li>
                        <li className="hit">15</li>
                        <li className="writer">이세현</li>
                        <li className="date">2025-07-25</li>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <li>
                          <Link href="/solve/review_confirm" className="hoverable">감사드립니다...</Link>
                        </li>
                        <li className="hit">15</li>
                        <li className="writer">이세현</li>
                        <li className="date">2025-07-25</li>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <li>
                          <Link href="/solve/review_view" className="hoverable">감사드립니다...</Link>
                        </li>
                        <li className="hit">15</li>
                        <li className="writer">이세현</li>
                        <li className="date">2025-07-25</li>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <li>
                          <Link href="/solve/review_confirm" className="hoverable">감사드립니다...</Link>
                        </li>
                        <li className="hit">15</li>
                        <li className="writer">이세현</li>
                        <li className="date">2025-07-25</li>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <li>
                          <Link href="/solve/review_view" className="hoverable">감사드립니다...</Link>
                        </li>
                        <li className="hit">15</li>
                        <li className="writer">이세현</li>
                        <li className="date">2025-07-25</li>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <li>
                          <Link href="/solve/review_confirm" className="hoverable">감사드립니다...</Link>
                        </li>
                        <li className="hit">15</li>
                        <li className="writer">이세현</li>
                        <li className="date">2025-07-25</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              {/* pagination */}
              <nav className="pagination">
                <ol>
                  <li className="prev"><a href="#" className="hoverable" onClick={(e) => e.preventDefault()}></a></li>
                  <li className="active"><a href="#" className="hoverable" onClick={(e) => e.preventDefault()}>1</a></li>
                  <li><a href="#" className="hoverable" onClick={(e) => e.preventDefault()}>2</a></li>
                  <li><a href="#" className="hoverable" onClick={(e) => e.preventDefault()}>3</a></li>
                  <li><a href="#" className="hoverable" onClick={(e) => e.preventDefault()}>4</a></li>
                  <li><a href="#" className="hoverable" onClick={(e) => e.preventDefault()}>5</a></li>
                  <li className="next"><a href="#" className="hoverable" onClick={(e) => e.preventDefault()}></a></li>
                </ol>
              </nav>
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
            <a href="#consult-pop" className="hoverable">
              <img src="/assets/images/ico_quick03.svg" alt="" />
              <i className="icon"></i>
              <p>문의하기</p>
            </a>
          </li>
          <li>
            <Link href="/customer/sns_list" className="hoverable">
              <img src="/assets/images/ico_quick04.svg" alt="" />
              <i className="icon"></i>
              <p>SNS채널</p>
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