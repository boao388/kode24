'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Script from 'next/script'
import Link from 'next/link'

export default function RealTimeListPage() {
  return (
    <>
      <Header />
      
      {/* nav - 원본과 완전히 동일한 구조 */}
      <nav id="nav">
        <div className="container">
          <div className="menu">
            <ul>
              <li>
                <Link href="/introduction/introduce">KODE24 소개</Link>
                <ul>
                  <li><Link href="/introduction/introduce">KODE24 소개</Link></li>
                  <li><Link href="/introduction/press_list">보도자료</Link></li>
                  <li><Link href="/introduction/patent_list">인증특허</Link></li>
                </ul>
              </li>
              <li><Link href="/solution/initial">솔루션 안내</Link></li>
              <li>
                <Link href="/solve/real_time_list">긴급해결문의</Link>
                <ul>
                  <li><Link href="/solve/real_time_list">실시간 해결 문의</Link></li>
                  <li><Link href="/solve/review_list">솔루션 진행 후기</Link></li>
                </ul>
              </li>
              <li>
                <Link href="/customer/notice_list">고객센터</Link>
                <ul>
                  <li><Link href="/customer/notice_list">공지사항</Link></li>
                  <li><Link href="/customer/qna">자주묻는질문</Link></li>
                  <li><Link href="/customer/sns_list">SNS 채널</Link></li>
                </ul>
              </li>
              <li>
                <Link href="/report/kode_list">사이버 보안 리포트</Link>
                <ul>
                  <li><Link href="/report/kode_list">코드24 보안리포트</Link></li>
                  <li><Link href="/report/app_list">악성 앱 분석</Link></li>
                  <li><Link href="/report/issue_list">보안 이슈</Link></li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="nav-foot">
            <a href="tel:15552501">
              <div>
                <img src="/assets/images/ico_contact.png" alt="" />
              </div>
              <div>
                <b>1555-2501</b>
                <p>kode24@kode24.co.kr</p>
              </div>
            </a>
          </div>
        </div>
      </nav>
      
      {/* content */}
      <main id="content">
        
        {/* board-list */}
        <article className="board-list real-time-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Real-time Problem Solving Inquiry</small>
              <h3 className="typed">실시간 해결 문의</h3>
            </div>
            <div className="article-content">
              <div className="board-head">
                <div className="search">
                  <div className="form-group">
                    <select className="form-control">
                      <option value="">전체</option>
                      <option value="title">제목</option>
                      <option value="content">내용</option>
                      <option value="writer">작성자</option>
                    </select>
                    <input type="text" className="form-control" placeholder="검색어를 입력하세요" />
                    <button type="button" className="btn-search hoverable">
                      <img src="/assets/images/sub/ico_search.png" alt="" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="board-body">
                <div className="board-table">
                  <table>
                    <thead>
                      <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>조회</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td className="title">
                          <Link href="/solve/real_time_view" className="hoverable">
                            <img src="/assets/images/sub/ico_lock.png" alt="" />
                            <span>몸캠피싱 피해 긴급 문의드립니다.</span>
                          </Link>
                        </td>
                        <td>김**</td>
                        <td>2025-01-01</td>
                        <td>15</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td className="title">
                          <Link href="/solve/real_time_view" className="hoverable">
                            <img src="/assets/images/sub/ico_lock.png" alt="" />
                            <span>텔레그램 협박 관련 문의</span>
                          </Link>
                        </td>
                        <td>박**</td>
                        <td>2025-01-02</td>
                        <td>23</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td className="title">
                          <Link href="/solve/real_time_view" className="hoverable">
                            <img src="/assets/images/sub/ico_lock.png" alt="" />
                            <span>딥페이크 영상 유포 차단 요청</span>
                          </Link>
                        </td>
                        <td>이**</td>
                        <td>2025-01-03</td>
                        <td>8</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td className="title">
                          <Link href="/solve/real_time_view" className="hoverable">
                            <img src="/assets/images/sub/ico_lock.png" alt="" />
                            <span>카카오톡 사기 피해 신고</span>
                          </Link>
                        </td>
                        <td>최**</td>
                        <td>2025-01-04</td>
                        <td>12</td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td className="title">
                          <Link href="/solve/real_time_view" className="hoverable">
                            <img src="/assets/images/sub/ico_lock.png" alt="" />
                            <span>인스타그램 해킹 피해 문의</span>
                          </Link>
                        </td>
                        <td>정**</td>
                        <td>2025-01-05</td>
                        <td>19</td>
                      </tr>
                    </tbody>
                  </table>
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
                <div className="btn-area">
                  <Link href="/solve/real_time_write" className="btn btn-write hoverable">문의하기</Link>
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