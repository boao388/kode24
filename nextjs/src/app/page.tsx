'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Script from 'next/script'
import { useSlickSlider } from '@/hooks/useSlickSlider'
// 메인 페이지 전용 CSS
import '@/styles/main.css'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  authorName: string
  isSecret: boolean
  date: string
  time: string
}

// jQuery, Slick 및 Swiper 타입 선언
declare global {
  interface Window {
    $: any
    jQuery: any
    Swiper: any
  }
}

export default function HomePage() {
  const [realTimePosts, setRealTimePosts] = useState<Post[]>([])
  const [reviewPosts, setReviewPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // 슬라이더 초기화 - 안전한 의존성 관리
  useSlickSlider('.live-slider', {
    slidesToShow: 6,
    slidesToScroll: 1,
    vertical: true, 
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    infinite: true,
    pauseOnHover: false,
    pauseOnFocus: false,
  }, [!loading && realTimePosts.length > 0])

  useSlickSlider('.review-slider', {
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true, 
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    infinite: true,
    pauseOnHover: false,
    pauseOnFocus: false,
  }, [!loading && reviewPosts.length > 0])

  // API에서 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        
        // 실시간 문의 데이터 가져오기
        const realTimeResponse = await fetch('/api/main/posts?boardKey=real_time&limit=12')
        if (realTimeResponse.ok) {
          const realTimeData = await realTimeResponse.json()
          setRealTimePosts(realTimeData.posts)
        }

        // 솔루션 진행 후기 데이터 가져오기
        const reviewResponse = await fetch('/api/main/posts?boardKey=review&limit=6')
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json()
          setReviewPosts(reviewData.posts)
        }
      } catch (error) {
        console.error('게시글 데이터 로딩 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])



  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let swiperInstances: any[] = [] // Swiper 인스턴스 추적
    
    // main.js의 기능을 통합 구현 - 슬라이더 안전성 강화
    const initMainPageEffects = () => {
      // jumbotron show 효과
      setTimeout(() => {
        const jumbotron = document.querySelector('.jumbotron')
        if (jumbotron) {
          jumbotron.classList.add('show')
        }
      }, 500)

      // 스크롤 이벤트 디바운싱 - 슬라이더 보호
      const handleScroll = () => {
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          // effect 클래스에 show 추가 (안전한 처리)
          const effects = document.querySelectorAll('.effect')
          effects.forEach((elem) => {
            if (document.contains(elem)) { // DOM 존재 확인
              const elemTop = elem.getBoundingClientRect().top
              const windowHeight = window.innerHeight
              if (elemTop < windowHeight / 2) {
                elem.classList.add('show')
              }
            }
          })
          
          // 슬라이더 상태 확인 (재초기화 방지)
          if (typeof window.$ !== 'undefined') {
            const $liveSlider = window.$('.live-slider')
            const $reviewSlider = window.$('.review-slider')
            
            // 슬라이더가 깨진 경우 로그만 출력 (React가 관리)
            if ($liveSlider.length && !$liveSlider.hasClass('slick-initialized')) {
              console.debug('Live slider needs reinitialization')
            }
            if ($reviewSlider.length && !$reviewSlider.hasClass('slick-initialized')) {
              console.debug('Review slider needs reinitialization')
            }
          }
        }, 50) // 디바운스 시간 단축
      }

      // 탭 기능 - jQuery 이벤트 위임으로 안전한 처리
      const initTabEvents = () => {
        if (typeof window !== 'undefined' && (window as any).jQuery) {
          const $ = (window as any).jQuery
          
          // 기존 이벤트 해제 후 재등록
          $(document).off('click', '.tab-menu > ul > li > a').on('click', '.tab-menu > ul > li > a', function(e) {
            $('.tab-menu > ul > li a').parent().removeClass('active')
            $('.tab-content > .tab-pane').removeClass('active')
            $(this).parent().addClass('active')
            $($(this).attr('href')).addClass('active')
            e.preventDefault()
          })
        }
      }
      
      // jQuery 로드 대기 후 탭 이벤트 초기화
      const checkJQueryForTabs = () => {
        if (typeof window !== 'undefined' && (window as any).jQuery) {
          initTabEvents()
        } else {
          setTimeout(checkJQueryForTabs, 100)
        }
      }
      checkJQueryForTabs()

      // Swiper 초기화 - 안전한 타이밍
      const initSwipers = () => {
        if (typeof window === 'undefined' || !window.Swiper) return
        
        try {
          // Awards/Certificates Swiper 초기화
          const listSwiper1Element = document.querySelector('.list-swiper1')
          const frameSwiper1Element = document.querySelector('.frame-swiper1')
          
          if (listSwiper1Element && frameSwiper1Element) {
            const listSwiper1 = new window.Swiper('.list-swiper1', {
              direction: 'vertical',
              slidesPerView: 5,
              watchSlidesProgress: true,
            })
            swiperInstances.push(listSwiper1)
            
            const frameSwiper1 = new window.Swiper('.frame-swiper1', {
              loop: false,
              spaceBetween: 10,
              autoplay: {
                delay: 4000,
              },
              thumbs: {
                swiper: listSwiper1,
              },
            })
            swiperInstances.push(frameSwiper1)
          }

          const listSwiper2Element = document.querySelector('.list-swiper2')
          const frameSwiper2Element = document.querySelector('.frame-swiper2')
          
          if (listSwiper2Element && frameSwiper2Element) {
            const listSwiper2 = new window.Swiper('.list-swiper2', {
              direction: 'vertical',
              slidesPerView: 5,
              watchSlidesProgress: true,
            })
            swiperInstances.push(listSwiper2)
            
            const frameSwiper2 = new window.Swiper('.frame-swiper2', {
              loop: false,
              spaceBetween: 10,
              autoplay: {
                delay: 4000,
              },
              thumbs: {
                swiper: listSwiper2,
              },
            })
            swiperInstances.push(frameSwiper2)
          }

          // Partners Swiper 초기화 - 각각 개별 처리
          const partnersElements = document.querySelectorAll('.partners-swiper')
          partnersElements.forEach((element, index) => {
            if (element && !element.classList.contains('swiper-initialized')) {
              const partnersSwiper = new window.Swiper(element, {
                slidesPerView: 'auto',
                loop: true,
                speed: 5000,
                touchRatio: 0,
                autoplay: {
                  delay: 0,
                  disableOnInteraction: false,
                  reverseDirection: element.getAttribute('dir') === 'rtl'
                },
                on: {
                  beforeDestroy: function () {
                    try {
                      if (this.autoplay && this.autoplay.stop) {
                        this.autoplay.stop()
                      }
                    } catch (e) {
                      console.debug('Partners swiper cleanup:', e)
                    }
                  }
                }
              })
              swiperInstances.push(partnersSwiper)
            }
          })
          
        } catch (error) {
          console.debug('Swiper initialization error:', error)
        }
      }

      // Swiper 초기화를 지연 실행
      setTimeout(initSwipers, 1000)

      // 이벤트 등록 - passive 옵션으로 성능 향상
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      // 초기 실행
      handleScroll()

      return () => {
        clearTimeout(scrollTimeout)
        
        // Swiper 인스턴스 정리
        swiperInstances.forEach(swiper => {
          try {
            if (swiper && swiper.destroy) {
              swiper.destroy(true, true)
            }
          } catch (e) {
            console.debug('Swiper cleanup error:', e)
          }
        })
        swiperInstances = []
        
        // jQuery 이벤트 정리
        if (typeof window !== 'undefined' && (window as any).jQuery) {
          const $ = (window as any).jQuery
          $(document).off('click', '.tab-menu > ul > li > a')
        }
        
        window.removeEventListener('scroll', handleScroll)
      }
    }

    // DOM 준비 상태 확인 후 실행
    let cleanup: (() => void) | undefined
    
    if (document.readyState === 'loading') {
      const onDOMReady = () => {
        cleanup = initMainPageEffects()
        document.removeEventListener('DOMContentLoaded', onDOMReady)
      }
      document.addEventListener('DOMContentLoaded', onDOMReady)
    } else {
      cleanup = initMainPageEffects()
    }
    
    return () => {
      if (cleanup) cleanup()
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
                  <li><a href="/customer/notice_list">공지사항</a></li>
                  <li><a href="/customer/qna">자주묻는질문</a></li>
                  <li><a href="/customer/sns_list">SNS 채널</a></li>
                </ul>
              </li>
              <li>
                <a href="/report/kode_list">사이버 보안 리포트</a>
                <ul>
                  <li><a href="/report/kode_list">코드24 보안리포트</a></li>
                  <li><a href="/report/app_list">악성 앱 분석</a></li>
                  <li><a href="/report/issue_list">보안 이슈</a></li>
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
                    <a href="/solve/real_time_list" className="hoverable">
                      <img src="/assets/images/main/ico_more.png" alt="" />
                    </a>
                  </div>
                </div>
                <div className="article-content">
                  <ul className="live-slider">
                    {(
                      realTimePosts.map((post) => (
                        <li key={post.id}>
                          <a 
                            href={post.isSecret ? `/solve/real_time_confirm?id=${post.id}&author=${post.authorName}` : `/solve/real_time_view?id=${post.id}`}
                            className="hoverable"
                          >
                            <b>{post.isSecret ? '비밀글입니다.' : post.title}</b>
                            <ul className="info">
                              <li>{post.date}</li>
                              <li>{post.time}</li>
                            </ul>
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </article>
              <article className="review">
                <div className="article-header">
                  <h3>솔루션 진행 후기</h3>
                  <small>Feedback</small>
                  <div className="btn-area">
                    <a href="/solve/review_list" className="hoverable">
                      <img src="/assets/images/main/ico_more.png" alt="" />
                    </a>
                  </div>
                </div>
                <div className="article-content">
                  <ul className="review-slider">
                    { (
                      reviewPosts.map((post) => (
                        <li key={post.id}>
                          <a href={`/solve/review_view?id=${post.id}`} className="hoverable">
                            <b>{post.title}</b>
                            <p>
                              {post.content.length > 200 
                                ? post.content.substring(0, 200) + '...' 
                                : post.content
                              }
                            </p>
                            <ul className="info">
                              <li>{post.date}</li>
                              <li>{post.time}</li>
                            </ul>
                            <span className="writer">{post.authorName}</span>
                          </a>
                        </li>
                      ))
                    )}
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
            <a href="https://pf.kakao.com/_xexaDxgG/chat" target="_blank" className="hoverable">
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
      
      {/* jQuery 기반 Swiper 스크립트 제거 - React useEffect에서 처리 */}
      
      {/* Line Event 스크립트 - 메인페이지에서만 로드 (preload 경고 해결) */}
      <Script 
        src="/assets/js/line_event.js" 
        strategy="lazyOnload"
        onLoad={() => console.debug('Line event script loaded')}
        onError={() => console.debug('Line event script failed to load')}
      />
    </>
  )
}