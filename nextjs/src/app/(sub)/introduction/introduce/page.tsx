'use client'

import { useEffect } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function IntroducePage() {
  useEffect(() => {
    // 클라이언트 사이드 스크립트 초기화
    const initPageScripts = () => {
      // 모달 관련 스크립트
      const modalBtns = document.querySelectorAll('[href^="#"]')
      modalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const href = btn.getAttribute('href')
          if (href?.startsWith('#') && href !== '#') {
            e.preventDefault()
            const target = document.querySelector(href)
            if (target) {
              target.classList.add('show')
            }
          }
        })
      })

      // 모달 닫기
      const closeBtns = document.querySelectorAll('.btn-modal-close')
      closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const modal = btn.closest('.modal-pop')
          if (modal) {
            modal.classList.remove('show')
          }
        })
      })

      // respond hover 효과
      const respondItems = document.querySelectorAll('.respond li')
      respondItems.forEach((item) => {
        item.addEventListener('mouseenter', () => {
          respondItems.forEach(i => i.classList.remove('active'))
          item.classList.add('active')
        })
      })

      // page header show 효과
      const pageHeader = document.querySelector('.page-header')
      if (pageHeader) {
        setTimeout(() => {
          pageHeader.classList.add('show')
        }, 100)
      }
    }

    initPageScripts()
  }, [])

  return (
    <>
      <Header />

      {/* content */}
      <main id="content">
        
        {/* introduction-header - 원본과 완전히 동일한 구조 */}
        <div className="page-header introduction-header">
          <div className="container-fluid">
            <div className="backdrop">
              <video autoPlay muted loop playsInline>
                <source src="/assets/images/sub/video_introduction_frame.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="summary">
              <div className="v-align">
                <h3>K<span></span>DE24</h3>
                <p><b>INTRO</b><br className="visible-sm" /> DUCTION</p>
              </div>
            </div>
          </div>
        </div>
        <div className="line-banner">
          <div className="gray">
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
          </div>
        </div>
        
        <article className="overview">
          <div className="container">
            <h3>OVERVIEW.</h3>
            <p>
              <b className="blue">KODE24(코드24)</b>는 <b>디지털성범죄를 대응하여, 몸캠피싱 및 사이버성범죄, A.I. 피싱범죄</b>에 대응하고,<br />
              악성코드 분석, 삭제, 방어하여 <b className="blue">온라인 범죄를 근절</b>하기 위해 설립된 기업입니다.
            </p>
          </div>
        </article>
        
        <div className="line-banner">
          <div className="gray">
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
          </div>
        </div>
        
        {/* respond - 원본과 완전히 동일한 구조 */}
        <article className="respond">
          <ol>
            <li className="active">
              <div className="box hoverable">
                <span>01</span>
                <div className="summary">
                  <strong>하루 평균 8건 이상의<br /> 몸캠피싱 범죄 대응</strong>
                  <p>
                    KODE24는 하루 평균 8~10건이상의 몸캠피싱 범죄를 처리합니다.<br />
                    매일 해결하는 몸캠피싱 범죄에 관해,<br className="visible-lg" />
                    지속적으로 쌓이는 범죄 케이스와 데이터를 기반으로<br className="visible-lg" />
                    확실한 몸캠피싱 유포 대응전략을 구축하여,<br className="visible-lg" />
                    몸캠피싱 범죄를 즉시 해결합니다.<br /><br />
                    KODE24의 기술적 몸캠피싱 해결은 100% 안심할 수 있도록 최선을 다할 것을 약속드립니다.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="box hoverable">
                <span>02</span>
                <div className="summary">
                  <strong>보안 전문가 팀구성,<br /> A.I. 범죄 대응 및<br /> 딥페이크 대응</strong>
                  <p>
                    KODE24는 디지털 보안 전문가로 팀을 구성하여,<br className="visible-lg" />
                    A.I. 범죄와 딥페이크 범죄에도 빠르게 대응하고<br className="visible-lg" />
                    필요에 따라서 기업간의 디지털 업무 공조를 통해 보안 솔루션을 제공하고 있습니다.<br /><br />
                    전문성, 신뢰감, 안정성, 만족감에 포커스를 맞춰<br className="visible-lg" />
                    고객님이 만족하는 결과물을 만들어내기 위해 끊임없이 노력하는 기업입니다.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="box hoverable">
                <span>03</span>
                <div className="summary">
                  <strong>디지털 성범죄<br /> 예방 교육 및<br /> 몸캠피싱 예방 캠페인</strong>
                  <p>
                    KODE24는 공공기관 및 기업들과 연계를 통해<br className="visible-lg" />
                    몸캠피싱 예방 캠페인 및 디지털 성범죄 예방 교육 진행을 수립하고, 지원해드립니다.<br /><br />
                    공공기관, 대학교, 중고등학교 등에서도 디지털, 몸캠피싱 예방 캠페인을 진행하여,<br className="visible-lg" />
                    많은 예방교육을 통해 범죄가 확산되지 않도록 최선을 다합니다.
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </article>
        
        {/* location - 원본과 완전히 동일한 구조 */}
        <article className="location effect">
          <div className="container-fluid">
            <div className="map-area">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.0671867939486!2d127.18995262644876!3d37.57703557352516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x615eea1341abeaa3%3A0x585d25e37356338f!2z7L2U65OcMjQ!5e0!3m2!1sko!2skr!4v1754989422637!5m2!1sko!2skr" 
                width="600" 
                height="450" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="summary">
              <b>디지털 성범죄 대응센터</b>
              <h3>KODE24</h3>
              <hr />
              <ul>
                <li>
              <dl>
                    <dt>TEL</dt>
                <dd><a href="tel:1555-2501" className="hoverable">1555-2501</a></dd>
              </dl>
                </li>
                <li>
                  <dl>
                    <dt>ADDRESS</dt>
                    <dd><address>경기도 하남시 미사강변한강로224번길 17-1, 101호</address></dd>
                  </dl>
                </li>
                <li>
              <dl>
                    <dt>E-MAIL</dt>
                <dd><a href="mailto:kode24@kode24.co.kr" className="hoverable">kode24@kode24.co.kr</a></dd>
              </dl>
                </li>
              </ul>
              <div className="btn-area">
                <a href="https://pf.kakao.com/_xexaDxgG/chat" className="btn-inquiry hoverable">
                  <span>문의하기</span>
                </a>
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
            <a href="https://pf.kakao.com/_xexaDxgG/chat" className="hoverable">
              <img src="/assets/images/ico_quick03.svg" alt="" />
              <i className="icon"></i>
              <p>상담문의</p>
            </a>
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

      {/* modal - 원본과 완전히 동일 */}
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
    </>
  )
}