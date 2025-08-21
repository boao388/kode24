'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Header() {
  
  // jQuery 이벤트와 충돌하지 않도록 완전히 jQuery에 의존
  useEffect(() => {
    // jQuery가 로드될 때까지 대기
    const checkJQuery = () => {
      if (typeof window !== 'undefined' && (window as any).jQuery) {
        const $ = (window as any).jQuery
        console.log('jQuery loaded, nav events should work')
        
        // 모바일 메뉴 링크 클릭 시 메뉴 닫기
        $(document).off('click', '#nav a').on('click', '#nav a', function() {
          $('body').removeClass('nav-opened')
        })
      } else {
        setTimeout(checkJQuery, 100)
      }
    }
    checkJQuery()
  }, [])

  return (
    <>
      {/* header */}
      <header id="header">
        <div className="container">
          <h1 className="logo">
            <Link href="/" className="hoverable">
              <img src="/assets/images/img_logo.svg" alt="" />
            </Link>
          </h1>
          <nav id="gnb">
            <ul>
              <li>
                <Link href="/introduction/introduce" className="hoverable">KODE24 소개</Link>
                <div>
                  <ul>
                    <li><Link href="/introduction/introduce" className="hoverable">KODE24 소개</Link></li>
                    <li><Link href="/introduction/press_list" className="hoverable">보도자료</Link></li>
                    <li><Link href="/introduction/patent_list" className="hoverable">인증특허</Link></li>
                  </ul>
                </div>
              </li>
              <li><Link href="/solution/initial" className="hoverable">솔루션 안내</Link></li>
              <li>
                <Link href="/solve/real_time_list" className="hoverable">긴급해결문의</Link>
                <div>
                  <ul>
                    <li><Link href="/solve/real_time_list" className="hoverable">실시간 해결 문의</Link></li>
                    <li><Link href="/solve/review_list" className="hoverable">솔루션 진행 후기</Link></li>
                  </ul>
                </div>
              </li>
              <li>
                <Link href="/customer/notice_list" className="hoverable">고객센터</Link>
                <div>
                  <ul>
                    <li><Link href="/customer/notice_list" className="hoverable">공지사항</Link></li>
                    <li><Link href="/customer/qna" className="hoverable">자주묻는질문</Link></li>
                    <li><Link href="/customer/sns_list" className="hoverable">SNS 채널</Link></li>
                  </ul>
                </div>
              </li>
              <li>
                <Link href="/report/kode_list" className="hoverable">사이버 보안 리포트</Link>
                <div>
                  <ul>
                    <li><Link href="/report/kode_list" className="hoverable">코드24 보안리포트</Link></li>
                    <li><Link href="/report/app_list" className="hoverable">악성 앱 분석</Link></li>
                    <li><Link href="/report/issue_list" className="hoverable">보안 이슈</Link></li>
                  </ul>
                </div>
              </li>
            </ul>
          </nav>
          <div className="head-util">
            <div className="contact">
              <a href="tel:15552501" className="hoverable">
                <b>1555-2501</b>
                <p>kode24@kode24.co.kr</p>
              </a>
            </div>
            <div className="btn-area">
              <button type="button" className="btn-nav hoverable">
                <img src="/assets/images/ico_btn_nav.png" className="default" alt="" />
                <img src="/assets/images/ico_btn_nav_close.png" className="close" alt="" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* nav - 모바일 사이드바 메뉴 */}
      <nav id="nav" style={{ color: '#fff' }}>
        <div className="container" style={{ padding: '30px 15px' }}>
          <div className="menu">
            <ul>
              <li>
                <Link href="/introduction/introduce" style={{ color: '#fff', textDecoration: 'none' }}>KODE24 소개</Link>
                <ul>
                  <li><Link href="/introduction/introduce" style={{ color: '#fff', textDecoration: 'none' }}>KODE24 소개</Link></li>
                  <li><Link href="/introduction/press_list" style={{ color: '#fff', textDecoration: 'none' }}>보도자료</Link></li>
                  <li><Link href="/introduction/patent_list" style={{ color: '#fff', textDecoration: 'none' }}>인증특허</Link></li>
                </ul>
              </li>
              <li><Link href="/solution/initial" style={{ color: '#fff', textDecoration: 'none' }}>솔루션 안내</Link></li>
              <li>
                <Link href="/solve/real_time_list" style={{ color: '#fff', textDecoration: 'none' }}>긴급해결문의</Link>
                <ul>
                  <li><Link href="/solve/real_time_list" style={{ color: '#fff', textDecoration: 'none' }}>실시간 해결 문의</Link></li>
                  <li><Link href="/solve/review_list" style={{ color: '#fff', textDecoration: 'none' }}>솔루션 진행 후기</Link></li>
                </ul>
              </li>
              <li>
                <Link href="/customer/notice_list" style={{ color: '#fff', textDecoration: 'none' }}>고객센터</Link>
                <ul>
                  <li><Link href="/customer/notice_list" style={{ color: '#fff', textDecoration: 'none' }}>공지사항</Link></li>
                  <li><Link href="/customer/qna" style={{ color: '#fff', textDecoration: 'none' }}>자주묻는질문</Link></li>
                  <li><Link href="/customer/sns_list" style={{ color: '#fff', textDecoration: 'none' }}>SNS 채널</Link></li>
                </ul>
              </li>
              <li>
                <Link href="/report/kode_list" style={{ color: '#fff', textDecoration: 'none' }}>사이버 보안 리포트</Link>
                <ul>
                  <li><Link href="/report/kode_list" style={{ color: '#fff', textDecoration: 'none' }}>코드24 보안리포트</Link></li>
                  <li><Link href="/report/app_list" style={{ color: '#fff', textDecoration: 'none' }}>악성 앱 분석</Link></li>
                  <li><Link href="/report/issue_list" style={{ color: '#fff', textDecoration: 'none' }}>보안 이슈</Link></li>
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
    </>
  )
} 