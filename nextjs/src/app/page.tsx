'use client'

import { useEffect } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Script from 'next/script'

export default function HomePage() {
  useEffect(() => {
    // main.js의 기능을 직접 구현
    const initMainPageEffects = () => {
      // jumbotron show 효과
      setTimeout(() => {
        const jumbotron = document.querySelector('.jumbotron')
        if (jumbotron) {
          jumbotron.classList.add('show')
        }
      }, 500)

      // 스크롤 이벤트 처리
      const handleScroll = () => {
        const scrollY = window.scrollY
        const effects = document.querySelectorAll('.effect')
        
        effects.forEach((effect) => {
          const elementTop = effect.getBoundingClientRect().top + scrollY
          const elementHeight = (effect as HTMLElement).offsetHeight
          const windowHeight = window.innerHeight
          
          if (scrollY > elementTop - windowHeight + elementHeight / 2) {
            effect.classList.add('show')
          }
        })
      }

      // 스크롤 이벤트 등록
      window.addEventListener('scroll', handleScroll)
      
      // 초기 실행
      handleScroll()
      
      // cleanup
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }

    // DOM이 준비된 후 실행
    const cleanup = initMainPageEffects()
    
    return cleanup
  }, [])

  useEffect(() => {
    // main.js의 기능을 직접 구현
    const initMainPageEffects = () => {
      // jumbotron show 효과
      setTimeout(() => {
        const jumbotron = document.querySelector('.jumbotron')
        if (jumbotron) {
          jumbotron.classList.add('show')
        }
      }, 500)

      // 스크롤 이벤트로 effect 클래스에 show 추가
      const handleScroll = () => {
        const effects = document.querySelectorAll('.effect')
        effects.forEach((elem) => {
          const elemTop = elem.getBoundingClientRect().top
          const windowHeight = window.innerHeight
          if (elemTop < windowHeight / 2) {
            elem.classList.add('show')
          }
        })
      }

      // 스크롤 이벤트 등록
      window.addEventListener('scroll', handleScroll)
      
      // 초기 실행
      handleScroll()

      // 탭 기능
      const handleTabClick = (e: Event) => {
        const target = e.target as HTMLElement
        if (target.matches('.tab-menu > ul > li > a')) {
          e.preventDefault()
          const tabMenu = target.closest('.tab-menu')
          const tabContent = tabMenu?.parentElement?.querySelector('.tab-content')
          
          // 모든 탭 비활성화
          tabMenu?.querySelectorAll('li').forEach((li: Element) => li.classList.remove('active'))
          tabContent?.querySelectorAll('.tab-pane').forEach((pane: Element) => pane.classList.remove('active'))
          
          // 클릭된 탭 활성화
          target.parentElement?.classList.add('active')
          const targetPane = document.querySelector(target.getAttribute('href') || '')
          if (targetPane) {
            targetPane.classList.add('active')
          }
        }
      }

      document.addEventListener('click', handleTabClick)

      return () => {
        window.removeEventListener('scroll', handleScroll)
        document.removeEventListener('click', handleTabClick)
      }
    }

    // DOM이 완전히 로드된 후 실행
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMainPageEffects)
    } else {
      initMainPageEffects()
    }
  }, [])

  return (
    <>
      <Header />
      
      {/* nav - 원본과 완전히 동일한 구조 */}
      <nav id="nav">
        <div className="container">
          <div className="menu">
            <ul>
              <li>
                <a href="/introduction/introduce">KODE24 소개</a>
                <ul>
                  <li><a href="/introduction/introduce">KODE24 소개</a></li>
                  <li><a href="/introduction/press_list">보도자료</a></li>
                  <li><a href="/introduction/patent_list">인증특허</a></li>
                </ul>
              </li>
              <li><a href="/solution/initial">솔루션 안내</a></li>
              <li>
                <a href="/solve/real_time_list">긴급해결문의</a>
                <ul>
                  <li><a href="/solve/real_time_list">실시간 해결 문의</a></li>
                  <li><a href="/solve/review_list">솔루션 진행 후기</a></li>
                </ul>
              </li>
              <li>
                <a href="/customer/notice_list">고객센터</a>
                <ul>
                  <li><a href="/customer/notice_list.html">공지사항</a></li>
                  <li><a href="/customer/qna.html">자주묻는질문</a></li>
                  <li><a href="/customer/sns_list.html">SNS 채널</a></li>
                </ul>
              </li>
              <li>
                <a href="/report/kode_list.html">사이버 보안 리포트</a>
                <ul>
                  <li><a href="/report/kode_list.html">코드24 보안리포트</a></li>
                  <li><a href="/report/app_list.html">악성 앱 분석</a></li>
                  <li><a href="/report/issue_list.html">보안 이슈</a></li>
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
        
        {/* jumbotron */}
        <div className="jumbotron effect">
          <div className="container">
            <div className="v-align">
              <div className="summary">
                <h3><img src="/assets/images/main/img_logo_big.png" alt="" /></h3>
                <p>
                  <b>몸캠피싱, 디지털성범죄, AI딥페이크범죄</b><br /> <b className="blue">KODE24</b>가 지켜드립니다.
                </p>
                <span>We solve digital sex crimes.</span>
                <div className="btn-area">
                  <a href="#consult-pop" className="btn-inquiry hoverable">
                    <span>문의하기</span>
                  </a>
                </div>
              </div>
              <div className="backdrop">
                <video autoPlay muted loop playsInline>
                  <source src="/assets/images/main/bg_jumbotron.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
        
        {/* cross-txt */}
        <div className="cross-txt">
          <div className="violet">
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
          </div>
          <div className="white">
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
          </div>
        </div>
        
        {/* awards */}
        <section className="awards effect">
          <div className="container">
            <div className="section-header">
              <h3>AWARDS <span className="visible-lg">·</span><br className="visible-sm" /> CERTIFICATES</h3>
            </div>
            <div className="section-content">
              <div className="tab-wrap">
                <div className="tab-menu">
                  <ul>
                    <li className="active">
                      <a href="#ch-1" className="hoverable">AWARDS</a>
                    </li>
                    <li>
                      <a href="#ch-2" className="hoverable">CERTIFICATES</a>
                    </li>
                  </ul>
                </div>
                <div className="tab-content">
                  <div className="tab-pane active" id="ch-1">
                    <div className="swiper-wrap">
                      <div className="frame">
                        <div className="frame-swiper frame-swiper1 swiper">
                          <ul className="swiper-wrapper">
                            <li className="swiper-slide">
                              <figure>
                                <img src="/assets/images/main/img_awards01.png" alt="" />
                              </figure>
                            </li>
                            <li className="swiper-slide">
                              <figure>
                                <img src="/assets/images/main/img_awards02.png" alt="" />
                              </figure>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="swiper-nav">
                        <div className="list-swiper list-swiper1 swiper">
                          <ul className="swiper-wrapper">
                            <li className="swiper-slide">
                              <a role="button" tabIndex={0} className="hoverable">
                                <dl>
                                  <dt>2024</dt>
                                  <dd>재창업 데모데이 IR피칭부문 &ldquo;우수상&rdquo;(중소벤처기업진흥원)</dd>
                                </dl>
                              </a>
                            </li>
                            <li className="swiper-slide">
                              <a role="button" tabIndex={0} className="hoverable">
                                <dl>
                                  <dt>2025</dt>
                                  <dd>초기창업패키지 선정기업(CNT테크 주관사)</dd>
                                </dl>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="ch-2">
                    <div className="swiper-wrap">
                      <div className="frame">
                        <div className="frame-swiper frame-swiper2 swiper">
                          <ul className="swiper-wrapper">
                            <li className="swiper-slide">
                              <figure>
                                <img src="/assets/images/main/img_certificate01.png" alt="" />
                              </figure>
                            </li>
                            <li className="swiper-slide">
                              <figure>
                                <img src="/assets/images/main/img_certificate02.png" alt="" />
                              </figure>
                            </li>
                            <li className="swiper-slide">
                              <figure>
                                <img src="/assets/images/main/img_certificate03.png" alt="" />
                              </figure>
                            </li>
                            <li className="swiper-slide">
                              <figure>
                                <img src="/assets/images/main/img_certificate04.png" alt="" />
                              </figure>
                            </li>
                            <li className="swiper-slide">
                              <figure>
                                <img src="/assets/images/main/img_certificate05.png" alt="" />
                              </figure>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="swiper-nav">
                        <div className="list-swiper list-swiper2 swiper">
                          <ul className="swiper-wrapper">
                            <li className="swiper-slide">
                              <a role="button" tabIndex={0} className="hoverable">
                                <dl>
                                  <dt>AI 채팅분석 특허</dt>
                                  <dd>AI기반의 채팅분석을 통한 범죄자 판단 몸캠피싱 방지 시스템(특허출원)</dd>
                                </dl>
                              </a>
                            </li>
                            <li className="swiper-slide">
                              <a role="button" tabIndex={0} className="hoverable">
                                <dl>
                                  <dt>인공지능 배포 시스템 특허</dt>
                                  <dd>인공지능 기반 연락처 탈취 감지 및 더미 데이터 배포 시스템(특허출원)</dd>
                                </dl>
                              </a>
                            </li>
                            <li className="swiper-slide">
                              <a role="button" tabIndex={0} className="hoverable">
                                <dl>
                                  <dt>연구소 인증서</dt>
                                  <dd>연구개발전담부서 인정서</dd>
                                </dl>
                              </a>
                            </li>
                            <li className="swiper-slide">
                              <a role="button" tabIndex={0} className="hoverable">
                                <dl>
                                  <dt>창업기업확인서</dt>
                                  <dd>창업기업확인서</dd>
                                </dl>
                              </a>
                            </li>
                            <li className="swiper-slide">
                              <a role="button" tabIndex={0} className="hoverable">
                                <dl>
                                  <dt>자격증</dt>
                                  <dd>한국검정평가원 탐정사 1급 자격증</dd>
                                </dl>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="certificate-list sub-list">
                      <div className="certificate-content sub-content">
                        
                      </div>
                      <div className="certificate-tab sub-tab">
                        <ul>
                          
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* project-review */}
        <section className="project-review effect">
          <div className="container">
            <div className="section-header">
              <h3>PROJECT REVIEW.</h3>
            </div>
            <div className="section-content">
              <article className="live">
                <div className="article-header">
                  <h3>실시간 문의</h3>
                  <small>Live Inquiries</small>
                  <div className="btn-area">
                    <a href="/solve/real_time_list.html" className="hoverable">
                      <img src="/assets/images/main/ico_more.png" alt="" />
                    </a>
                  </div>
                </div>
                <div className="article-content">
                  <ul className="live-slider">
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/real_time_list.html" className="hoverable">
                        <b>이윤호님의 빠른 상담 요청글입니다.</b>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                      </a>
                    </li>
                  </ul>
                </div>
              </article>
              <article className="review">
                <div className="article-header">
                  <h3>솔루션 진행 후기</h3>
                  <small>Feedback</small>
                  <div className="btn-area">
                    <a href="/solve/review_list.html" className="hoverable">
                      <img src="/assets/images/main/ico_more.png" alt="" />
                    </a>
                  </div>
                </div>
                <div className="article-content">
                  <ul className="review-slider">
                    <li>
                      <a href="/solve/review_list.html" className="hoverable">
                        <b>정말 힘들 뻔 했는데</b>
                        <p>
                          피싱범이 유포한다고 협박할 때 검색해서 들어왔는데 24시간이고 상담원분께서 친절하게 말씀해 주셔서 마음이 놓이고 안정됐습니다.<br />
                          이제 거의 한 달째가 돼가는데 협박범한테서 연락도 없고 주변 지인들한테 연락도 안 오고 있습니다 감사합니다!
                        </p>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                        <span className="writer">익명</span>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/review_list.html" className="hoverable">
                        <b>정말 힘들 뻔 했는데</b>
                        <p>
                          피싱범이 유포한다고 협박할 때 검색해서 들어왔는데 24시간이고 상담원분께서 친절하게 말씀해 주셔서 마음이 놓이고 안정됐습니다.<br />
                          이제 거의 한 달째가 돼가는데 협박범한테서 연락도 없고 주변 지인들한테 연락도 안 오고 있습니다 감사합니다!
                        </p>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                        <span className="writer">익명</span>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/review_list.html" className="hoverable">
                        <b>정말 힘들 뻔 했는데</b>
                        <p>
                          피싱범이 유포한다고 협박할 때 검색해서 들어왔는데 24시간이고 상담원분께서 친절하게 말씀해 주셔서 마음이 놓이고 안정됐습니다.<br />
                          이제 거의 한 달째가 돼가는데 협박범한테서 연락도 없고 주변 지인들한테 연락도 안 오고 있습니다 감사합니다!
                        </p>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                        <span className="writer">익명</span>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/review_list.html" className="hoverable">
                        <b>정말 힘들 뻔 했는데</b>
                        <p>
                          피싱범이 유포한다고 협박할 때 검색해서 들어왔는데 24시간이고 상담원분께서 친절하게 말씀해 주셔서 마음이 놓이고 안정됐습니다.<br />
                          이제 거의 한 달째가 돼가는데 협박범한테서 연락도 없고 주변 지인들한테 연락도 안 오고 있습니다 감사합니다!
                        </p>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                        <span className="writer">익명</span>
                      </a>
                    </li>
                    <li>
                      <a href="/solve/review_list.html" className="hoverable">
                        <b>정말 힘들 뻔 했는데</b>
                        <p>
                          피싱범이 유포한다고 협박할 때 검색해서 들어왔는데 24시간이고 상담원분께서 친절하게 말씀해 주셔서 마음이 놓이고 안정됐습니다.<br />
                          이제 거의 한 달째가 돼가는데 협박범한테서 연락도 없고 주변 지인들한테 연락도 안 오고 있습니다 감사합니다!
                        </p>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                        <span className="writer">익명</span>
                      </a>
          </li>
                    <li>
                      <a href="/solve/review_list.html" className="hoverable">
                        <b>정말 힘들 뻔 했는데</b>
                        <p>
                          피싱범이 유포한다고 협박할 때 검색해서 들어왔는데 24시간이고 상담원분께서 친절하게 말씀해 주셔서 마음이 놓이고 안정됐습니다.<br />
                          이제 거의 한 달째가 돼가는데 협박범한테서 연락도 없고 주변 지인들한테 연락도 안 오고 있습니다 감사합니다!
                        </p>
                        <ul className="info">
                          <li>2025-07-09</li>
                          <li>16:30</li>
                        </ul>
                        <span className="writer">익명</span>
                      </a>
          </li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>
        
        {/* txt-banner */}
        <div className="txt-banner">
          <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
          <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
        </div>
        
        {/* solution-area */}
        <section className="solution-area effect">
          <div className="container">
            <div className="section-header">
              <h3>SOLUTION.</h3>
            </div>
            <div className="section-content">
              <div className="first">
                <ul>
                  <li>
                    <a href="#" className="hoverable card">
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution01.png" alt="" />
                      </div>
                      <div className="details">
                        <b>초기 긴급 블락<br /> <span>+ 매뉴얼북 제공</span></b>
                        <p>
                          몸캠피싱 영상유포 협박을 조기에 대응하여<br />
                          긴급유포 방지,시간지연을 시킵니다.<br />
                          이를 통해 피싱 공격의 위험성을 줄이고,<br />
                          고객의 개인 정보를 안전하게 지킵니다
                        </p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hoverable card">
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution02.png" alt="" />
                      </div>
                      <div className="details">
                        <b>영상유포차단</b>
                        <p>
                          영상 유포 차단 솔루션은 가해자의 C&C 서버에 더미<br />
                          데이터를 업로드하여 가해자가 피해자를 특정하지<br />
                          못하도록 방해합니다. 이를 통해 가해자의 공격을<br />
                          무력화하고 피해 확산을 방지하여 개인의 안전을 지킵니다.
                        </p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hoverable card">
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution03.png" alt="" />
                      </div>
                      <div className="details">
                        <b>데이터재밍</b>
                        <p>
                          특정된 가해자가 영상유포를 하지못하도록<br />
                          유포데이터 검증기법, 가해자 트래픽 재밍 등의<br />
                          기술을 통해 유포방지 솔루션을 적용시킵니다.<br />
                          안전한 환경에서 피해자들이 안심할 수 있도록<br />
                          맞춤형 적용되는 솔루션입니다.
                        </p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => e.preventDefault()} className="hoverable card">
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution04.png" alt="" />
                      </div>
                      <div className="details">
                        <b>사후관리서비스</b>
                        <p>
                          당사는 서비스 제공 이후에도 고객의 안전과 만족을<br />
                          최우선으로 고려하여,<br />
                          문제 발생 시점을 기준으로 1년간 동일 사안에 대한<br />
                          지속적인 사후관리 서비스를 제공합니다.
                        </p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => e.preventDefault()} className="hoverable card">
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution05.png" alt="" />
                      </div>
                      <div className="details">
                        <b>A.I. 딥페이크 이미지 스왑</b>
                        <p>
                          본 기술은 인공지능(AI) 기반의 고도화된 딥페이크<br />
                          이미지 스왑(Image Swap) 기법을 활용하여,<br />
                          피해자의 얼굴이 포함된 영상 또는 이미지 내 인물을<br />
                          외형상 완전히 다른 가상의 인물로 변환함으로써,<br />
                          제3자가 해당 인물의 실제 신원을 식별할 수 없도록 설계되었습니다.
                        </p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => e.preventDefault()} className="hoverable card">
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution06.png" alt="" />
                      </div>
                      <div className="details">
                        <b>작업 완료 보고서</b>
                        <p>
                          모든작업이 완료된 후, 당사는 해당 고객을 위한 맞춤형<br />
                          작업 완료 보고서를 제공하여, 수행된 모든 조치의<br />
                          세부내용과 그 결과를 정확하고 투명하게 문서화합니다.<br />
                          이 보고서는 단순한 결과 요약이 아닌,<br />
                          고객이 처한 구체적인 상황에 기반한 분석, 해결,<br />
                          그리고 예방까지 아우르는 종합적 기록으로 구성됩니다.
                        </p>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="second">
                <div className="round-txt">
                  <img src="/assets/images/main/img_round_txt.png" alt="" />
                </div>
                <a href="/solution/initial" className="hoverable card">
                  <div className="glows"></div>
                  <p><b>차원이</b><br /> 다른<br className="d-block" /> <b>솔루션</b>을<br /> <b>확인</b>해 보세요</p>
                  <img src="/assets/images/main/ico_arrow_big.png" alt="" />
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* honor */}
        <div className="honor effect">
          <div className="container">
            <div className="summary">
              <h3>당신의 <b>디지털 명예,<br /> KODE24</b>가 지켜드립니다.</h3>
              <small>We protect your digital dignity.</small>
              <div className="btn-area">
                <a href="#consult-pop" className="btn-inquiry hoverable">
                  <span>문의하기</span>
                </a>
              </div>
            </div>
            <figure>
              <img src="/assets/images/main/img_honor.png" alt="" />
            </figure>
          </div>
        </div>
        
        {/* partners */}
        <section className="partners effect">
          <div className="section-header">
            <div className="container">
              <h3>PARTNERS.</h3>
            </div>
          </div>
          <div className="section-content">
            <div className="visible-lg">
              <div className="swiper partners-swiper">
                <ul className="swiper-wrapper">
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners01.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners02.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners03.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners04.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners05.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners01.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners02.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners03.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners04.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners05.png" alt="" />
                    </a>
                  </li>
                </ul>
              </div>
              
              <div className="swiper partners-swiper" dir="rtl">
                <ul className="swiper-wrapper">
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners06.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners07.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners08.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners09.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners10.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners06.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners07.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners08.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners09.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0} className="hoverable">
                      <img src="/assets/images/main/img_partners10.png" alt="" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="visible-sm">
              <div className="swiper partners-swiper">
                <ul className="swiper-wrapper">
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners01.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners02.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners03.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners01.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners02.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners03.png" alt="" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="swiper partners-swiper" dir="rtl">
                <ul className="swiper-wrapper" dir="rtl">
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners04.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners05.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners06.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners07.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners04.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners05.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners06.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners07.png" alt="" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="swiper partners-swiper">
                <ul className="swiper-wrapper">
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners08.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners09.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners10.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners08.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners09.png" alt="" />
                    </a>
                  </li>
                  <li className="swiper-slide">
                    <a role="button" tabIndex={0}>
                      <img src="/assets/images/main/img_partners10.png" alt="" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
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
            <a href="/solve/real_time_list" target="_blank" className="hoverable">
              <img src="/assets/images/ico_quick03.svg" alt="" />
              <i className="icon"></i>
              <p>상담문의</p>
            </a>
          </li>
          <li>
            <a href="/solve/review_list" target="_blank" className="hoverable">
              <img src="/assets/images/ico_quick04.svg" alt="" />
              <i className="icon"></i>
              <p>솔루션후기</p>
            </a>
          </li>
        </ul>
      </nav>
      
      {/* modal */}
      <div className="modal">
        <div className="modal-backdrop"></div>
        <div className="modal-pop" id="consult-pop">
          <div className="consult-form">
            <div className="form-head">
              <h3>실시간 해결 문의</h3>
              <p>항상 고객과 함께하는 KODE24입니다. 아래 양식을 작성해주시면 빠르게 연락드리겠습니다.</p>
              <button type="button" className="btn-modal-close">
                <img src="/assets/images/ico_modal_close.png" alt="" />
              </button>
            </div>
            <div className="form-body">
              <div className="board-write">
                <ul>
                  <li>
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="성함을 입력해주세요" />
                    </div>
                  </li>
                  <li>
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="비밀번호를 입력해주세요" />
                    </div>
                  </li>
                  <li>
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="이메일을 입력해주세요" />
                    </div>
                  </li>
                  <li>
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="휴대폰 번호를 입력해주세요" />
                    </div>
                  </li>
                  <li>
                    <div className="form-group">
                      <textarea className="form-control" placeholder="상담내용을 입력해주세요"></textarea>
                    </div>
                  </li>
                </ul>
                <div className="agree">
                  <label className="hoverable"><input type="checkbox" /> 개인정보수집이용에 동의합니다.</label>
                </div>
              </div>
              <div className="btn-area">
                <button type="button" className="btn btn-submit hoverable">문의하기</button>
              </div>
            </div>
          </div>
        </div>
    </div>
      
      <Footer />
      
      {/* Swiper 및 Slick 초기화 스크립트 */}
      <Script id="main-page-scripts" strategy="afterInteractive">
        {`
          $(document).ready(function() {
            // solution slider 관련
            if (typeof Swiper !== 'undefined') {
              var listSwiper1 = new Swiper(".list-swiper1", {
                  direction: 'vertical',
                  slidesPerView: 5,
                  watchSlidesProgress: true,
              });
              var frameSwiper1 = new Swiper(".frame-swiper1", {
                  loop: true,
                  spaceBetween: 10,
                  autoplay: {
                      delay: 4000,
                  },
                  thumbs: {
                      swiper: listSwiper1,
                  },
              });
              
              var listSwiper2 = new Swiper(".list-swiper2", {
                  direction: 'vertical',
                  slidesPerView: 5,
                  watchSlidesProgress: true,
              });
              var frameSwiper2 = new Swiper(".frame-swiper2", {
                  loop: true,
                  spaceBetween: 10,
                  autoplay: {
                      delay: 4000,
                  },
                  thumbs: {
                      swiper: listSwiper2,
                  },
              });

              // Partners Swiper
              var partnersSwiper1 = new Swiper(".partners-swiper", {
                  slidesPerView: "auto",
                  loop: true,
                  observeParents: true,
                  observe: true,
                  speed: 5000,
                  touchRatio: 0,
                  autoplay: {
                      delay: 0,
                      disableOnInteraction: false
                  },
              });
            }
            
            // Slick 슬라이더 초기화
            if (typeof $ !== 'undefined' && $.fn.slick) {
              // live
              $('.live-slider').slick({
                  slidesToShow: 6,
                  slidesToScroll: 1,
                  vertical: true, 
                  autoplay: true,
                  autoplaySpeed: 4000,
                  arrows: false,
              });
              
              //review
              $('.review-slider').slick({
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  vertical: true, 
                  autoplay: true,
                  autoplaySpeed: 4000,
                  arrows: false,
              });
            }
          });
        `}
      </Script>
    </>
  )
}