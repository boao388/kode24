'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Script from 'next/script'
import Link from 'next/link'

export default function PressListPage() {
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
        
        {/* press-list */}
        <article className="gallery-list press-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Press Releases</small>
              <h3 className="typed">보도자료</h3>
            </div>
            <div className="article-content">
              <ul>
                <li>
                  <a href="https://www.dailysecu.com/news/articleView.html?idxno=166144" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press01.png" alt="" />
                    </div>
                    <div className="details">
                      <p>몸캠피싱 해결전문기업 코드24, 중소벤처기업부 '2025년 초기창업패키지' 최종 선정</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.epnc.co.kr/news/articleView.html?idxno=308655" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press02.png" alt="" />
                    </div>
                    <div className="details">
                      <p>'코드24', 2024 재창업 데모데이 우수 기업 선정</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.newsculture.press/news/articleView.html?idxno=555536" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press03.png" alt="" />
                    </div>
                    <div className="details">
                      <p>코드24, 몸캠피싱·딥페이크 영상 해결 처리속도 10배 A.I. 가속장비 도입</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="http://www.livesnews.com/news/article.html?no=42717" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press04.png" alt="" />
                    </div>
                    <div className="details">
                      <p>코드24, 몸캠피싱 피해 유포방지 9월 무상 지원 서비스 24시간 운영</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://v.daum.net/v/20240828114201397" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press05.png" alt="" />
                    </div>
                    <div className="details">
                      <p>'서울대 딥페이크' 공범 징역 5년... 판사도 "역겨운 내용"</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.woodkorea.co.kr/news/articleView.html?idxno=80837" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press06.png" alt="" />
                    </div>
                    <div className="details">
                      <p>몸캠피싱 대응 전문기업 '코드24', 긴급해결 TFT팀 구축</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.gpkorea.com/news/articleView.html?idxno=118221" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_none_frame.png" alt="" />
                    </div>
                    <div className="details">
                      <p>몸캠피씽(몸또) 해결 전문 코드24, 무료 지원으로 사회적 기여 확대</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.gpkorea.com/news/articleView.html?idxno=118084" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_none_frame.png" alt="" />
                    </div>
                    <div className="details">
                      <p>코드24(KODE24), 몸캠피싱 무료 해결 서비스 지원</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="http://www.ikunkang.com/news/articleView.html?idxno=40473" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press07.png" alt="" />
                    </div>
                    <div className="details">
                      <p>갈수록 교묘해지는 몸캠피싱…피해자 영상 유포 막아주는 '코드24'</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.newsis.com/view/?id=NISX20240313_0002658911&cID=10803&pID=14000" target="_blank" className="hoverable">
                    <div className="item-img">
                      <img src="/assets/images/sub/img_press08.png" alt="" />
                    </div>
                    <div className="details">
                      <p>'몸캠·메신저피싱' 9억대 뜯어낸 中총책…2년반만에 검거</p>
                      <span className="date">2025-05-16</span>
                    </div>
                  </a>
                </li>
              </ul>
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