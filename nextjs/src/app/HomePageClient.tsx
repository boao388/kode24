'use client'

import { useEffect } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import MainPopup from '@/components/common/MainPopup'
import Script from 'next/script'
import { useSlickSlider } from '@/hooks/useSlickSlider'
import { useMainPosts } from '@/hooks/useMainPosts'
import { generateWebsiteSchema, generateOrganizationSchema, generateServiceSchema, createJsonLdScript } from '@/lib/jsonld'

// jQuery, Slick 및 Swiper 타입 선언
declare global {
  interface Window {
    $: any
    jQuery: any
    Swiper: any
  }
}

export default function HomePageClient() {
  const { realTimePosts, reviewPosts, isLoading } = useMainPosts()
  const slickConfig = useSlickSlider()

  // JSON-LD 구조화 데이터
  const websiteSchema = generateWebsiteSchema()
  const organizationSchema = generateOrganizationSchema()
  const serviceSchema = generateServiceSchema()

  useEffect(() => {
    // TweenMax 및 기타 애니메이션 초기화
    const initAnimations = () => {
      // scrollTrigger 초기화
      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger)
        
        // 애니메이션 설정
        window.gsap.timeline({
          scrollTrigger: {
            trigger: '.main-visual',
            start: 'top center',
            end: 'bottom center',
            scrub: true
          }
        })
      }

      // 타이핑 애니메이션 초기화
      const typeElements = document.querySelectorAll('.typed')
      typeElements.forEach(el => {
        if (window.Typed) {
          new window.Typed(el, {
            strings: [el.textContent],
            typeSpeed: 50,
            showCursor: false
          })
        }
      })

      // 슬라이더 초기화
      if (window.$ && window.$.fn.slick) {
        $('.solution-slide').slick(slickConfig.solution)
        $('.review-slide').slick(slickConfig.review)
      }

      // Swiper 초기화
      if (window.Swiper) {
        new window.Swiper('.main-visual .swiper', {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        })
      }
    }

    // 스크립트 로드 후 초기화
    const timer = setTimeout(initAnimations, 1000)
    
    return () => {
      clearTimeout(timer)
    }
  }, [slickConfig])

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      {createJsonLdScript([websiteSchema, organizationSchema, serviceSchema])}
      
      <Header />
      
      <main id="content">
        {/* MAIN VISUAL */}
        <section className="main-visual">
          <div className="swiper">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="slide-content">
                  <div className="container">
                    <div className="text-area">
                      <h2 className="typed">
                        몸캠피싱 피해<br />
                        <span>전문가의 도움</span>을 받으세요
                      </h2>
                      <p className="typed">
                        KODE24는 몸캠피싱 피해 예방부터 사후 대응까지<br />
                        체계적이고 전문적인 솔루션을 제공합니다
                      </p>
                      <div className="btn-area">
                        <a href="/solve/real_time_write" className="btn-primary hoverable">
                          무료 상담 신청
                        </a>
                        <a href="/introduction/introduce" className="btn-secondary hoverable">
                          서비스 소개
                        </a>
                      </div>
                    </div>
                    <div className="img-area">
                      <img src="/assets/images/main/img_main_visual.png" alt="KODE24 메인 비주얼" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="slide-content">
                  <div className="container">
                    <div className="text-area">
                      <h2 className="typed">
                        실시간 위협 탐지<br />
                        <span>보안 솔루션</span>
                      </h2>
                      <p className="typed">
                        첨단 AI 기술을 활용한 실시간 위협 탐지로<br />
                        몸캠피싱을 사전에 차단합니다
                      </p>
                      <div className="btn-area">
                        <a href="/solution/initial" className="btn-primary hoverable">
                          솔루션 보기
                        </a>
                        <a href="/report/kode_list" className="btn-secondary hoverable">
                          보안 리포트
                        </a>
                      </div>
                    </div>
                    <div className="img-area">
                      <img src="/assets/images/main/img_main_visual2.png" alt="보안 솔루션" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-pagination"></div>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
        </section>

        {/* SOLUTION SECTION */}
        <section className="main-solution">
          <div className="container">
            <div className="section-header">
              <h3 className="typed">KODE24의 핵심 솔루션</h3>
              <p className="typed">
                몸캠피싱 피해 예방부터 사후 대응까지<br />
                전문적이고 체계적인 서비스를 제공합니다
              </p>
            </div>
            
            <div className="solution-slide">
              <div className="solution-item">
                <div className="item-icon">
                  <img src="/assets/images/main/ico_solution01.svg" alt="예방 서비스" />
                </div>
                <h4>사전 예방 서비스</h4>
                <p>
                  AI 기반 실시간 모니터링과<br />
                  위험 상황 사전 차단
                </p>
                <a href="/solution/initial" className="btn-more hoverable">자세히 보기</a>
              </div>
              
              <div className="solution-item">
                <div className="item-icon">
                  <img src="/assets/images/main/ico_solution02.svg" alt="대응 서비스" />
                </div>
                <h4>신속 대응 서비스</h4>
                <p>
                  24시간 전문가 상담과<br />
                  즉시 대응 시스템
                </p>
                <a href="/solve/real_time_write" className="btn-more hoverable">상담 신청</a>
              </div>
              
              <div className="solution-item">
                <div className="item-icon">
                  <img src="/assets/images/main/ico_solution03.svg" alt="법적 지원" />
                </div>
                <h4>법적 지원 서비스</h4>
                <p>
                  전문 변호사와 함께하는<br />
                  법적 대응 및 피해 구제
                </p>
                <a href="/introduction/introduce" className="btn-more hoverable">지원 내용</a>
              </div>
            </div>
          </div>
        </section>

        {/* REAL TIME POSTS SECTION */}
        <section className="main-posts real-time-posts">
          <div className="container">
            <div className="section-header">
              <h3 className="typed">실시간 해결문의</h3>
              <p className="typed">최근 접수된 상담 사례를 확인해보세요</p>
              <a href="/solve/real_time_list" className="btn-more hoverable">전체 보기</a>
            </div>
            
            <div className="posts-grid">
              {isLoading ? (
                <div className="loading">상담 사례를 불러오는 중...</div>
              ) : realTimePosts && realTimePosts.length > 0 ? (
                realTimePosts.slice(0, 6).map((post) => (
                  <div key={post.id} className="post-item">
                    <a href={`/solve/real_time_view?id=${post.id}`} className="hoverable">
                      <h4>{post.title}</h4>
                      <p className="post-meta">
                        <span>{post.authorName}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                      </p>
                      <p className="post-excerpt">
                        {post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 80) + '...' : '상담 요청'}
                      </p>
                    </a>
                  </div>
                ))
              ) : (
                <div className="no-posts">등록된 상담 사례가 없습니다.</div>
              )}
            </div>
          </div>
        </section>

        {/* REVIEW POSTS SECTION */}
        <section className="main-posts review-posts">
          <div className="container">
            <div className="section-header">
              <h3 className="typed">솔루션 후기</h3>
              <p className="typed">고객들의 실제 후기를 확인해보세요</p>
              <a href="/solve/review_list" className="btn-more hoverable">전체 보기</a>
            </div>
            
            <div className="review-slide">
              {isLoading ? (
                <div className="loading">후기를 불러오는 중...</div>
              ) : reviewPosts && reviewPosts.length > 0 ? (
                reviewPosts.map((post) => (
                  <div key={post.id} className="review-item">
                    <a href={`/solve/review_view?id=${post.id}`} className="hoverable">
                      <h4>{post.title}</h4>
                      <div className="review-rating">
                        {/* 별점 표시 - 임시로 5점 만점 */}
                        <span className="stars">★★★★★</span>
                      </div>
                      <p className="review-content">
                        {post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : '후기 내용'}
                      </p>
                      <p className="review-meta">
                        <span>{post.authorName}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                      </p>
                    </a>
                  </div>
                ))
              ) : (
                <div className="no-reviews">등록된 후기가 없습니다.</div>
              )}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="main-cta">
          <div className="container">
            <div className="cta-content">
              <h3 className="typed">
                몸캠피싱 피해,<br />
                혼자 고민하지 마세요
              </h3>
              <p className="typed">
                전문가의 도움으로 빠르고 안전하게 해결할 수 있습니다.<br />
                24시간 무료 상담을 통해 맞춤형 솔루션을 제공합니다.
              </p>
              <div className="btn-area">
                <a href="/solve/real_time_write" className="btn-primary hoverable">
                  무료 상담 신청
                </a>
                <a href="tel:1588-0000" className="btn-secondary hoverable">
                  긴급 상담 전화
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MainPopup />
      
      {/* External Scripts */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.5/swiper-bundle.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"
        strategy="lazyOnload"
      />
    </>
  )
}
