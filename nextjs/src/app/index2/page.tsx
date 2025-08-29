'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import MainPopup from '@/components/common/MainPopup'
import Link from 'next/link'
// 메인 페이지 전용 CSS (common.css는 루트 레이아웃에서 이미 로드됨)
import '@/styles/main.css'

export default function Index2Page() {
  return (
    <>
      <Header />
      
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
                <span>전문가와 함께하는 안전한 디지털 환경</span>
                <div className="btn-area">
                  <a href="https://pf.kakao.com/_xexaDxgG/chat" target="_blank" className="btn-kakao-inquiry hoverable">
                    <span>긴급 해결 문의</span>
                    <img src="/assets/images/ico_inquiry_arrow.png" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* solution-area */}
        <div className="solution-area effect">
          <div className="container">
            <div className="section-header">
              <h3>SOLUTION</h3>
            </div>
            <div className="section-content">
              <div className="first">
                <ul>
                  <li>
                    <a href="#" className="card hoverable" onClick={(e) => e.preventDefault()}>
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution01.png" alt="" />
                      </div>
                      <div className="details">
                        <b>실시간 <span>해결 문의</span></b>
                        <p>몸캠피싱 피해 발생 시<br />즉시 전문가 상담</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="card hoverable" onClick={(e) => e.preventDefault()}>
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution02.png" alt="" />
                      </div>
                      <div className="details">
                        <b>솔루션 <span>진행 후기</span></b>
                        <p>실제 해결 사례와<br />고객 만족도 확인</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="card hoverable" onClick={(e) => e.preventDefault()}>
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution03.png" alt="" />
                      </div>
                      <div className="details">
                        <b>고객센터 <span>지원</span></b>
                        <p>24시간 상담 및<br />지속적인 케어</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="card hoverable" onClick={(e) => e.preventDefault()}>
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution04.png" alt="" />
                      </div>
                      <div className="details">
                        <b>사이버 보안 <span>리포트</span></b>
                        <p>최신 보안 동향과<br />예방 가이드 제공</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="card hoverable" onClick={(e) => e.preventDefault()}>
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution05.png" alt="" />
                      </div>
                      <div className="details">
                        <b>법적 대응 <span>서비스</span></b>
                        <p>전문 변호사와<br />체계적인 대응 전략</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="card hoverable" onClick={(e) => e.preventDefault()}>
                      <div className="glows"></div>
                      <div className="item-img">
                        <img src="/assets/images/main/img_solution06.png" alt="" />
                      </div>
                      <div className="details">
                        <b>피해 예방 <span>교육</span></b>
                        <p>사전 예방을 위한<br />교육 및 컨설팅</p>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="second">
                <div className="round-txt">
                  <img src="/assets/images/main/img_round_txt.png" alt="" />
                </div>
                <a href="#" onClick={(e) => e.preventDefault()} className="hoverable">
                  <p><b>MORE</b></p>
                  <img src="/assets/images/main/ico_more.png" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* awards */}
        <div className="awards effect">
          <div className="container">
            <div className="section-header">
              <h3>AWARDS</h3>
            </div>
            <div className="section-content">
              <div className="awards-list">
                <div className="award-item">
                  <img src="/assets/images/main/img_awards01.png" alt="대한민국 법무대상" />
                </div>
                <div className="award-item">
                  <img src="/assets/images/main/img_awards02.png" alt="우수 법률서비스 인증" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* honor */}
        <div className="honor effect">
          <div className="container">
            <div className="summary">
              <h3><b>15년 경력</b>의 전문가가<br />함께합니다</h3>
              <small>KODE24와 함께하는 안전한 디지털 환경</small>
              <div className="certificates">
                <img src="/assets/images/main/img_certificate01.png" alt="변호사 자격증" />
                <img src="/assets/images/main/img_certificate02.png" alt="사이버 보안 전문가" />
                <img src="/assets/images/main/img_certificate03.png" alt="디지털 포렌식 자격증" />
                <img src="/assets/images/main/img_certificate04.png" alt="정보보호 전문가" />
              </div>
            </div>
            <figure>
              <img src="/assets/images/main/img_honor.png" alt="전문가 이미지" />
            </figure>
          </div>
        </div>

        {/* partners */}
        <div className="partners effect">
          <div className="section-header">
            <h3>PARTNERS</h3>
          </div>
          <div className="partners-list">
            <div className="partner-item">
              <img src="/assets/images/main/img_partners01.png" alt="파트너 1" />
            </div>
            <div className="partner-item">
              <img src="/assets/images/main/img_partners02.png" alt="파트너 2" />
            </div>
            <div className="partner-item">
              <img src="/assets/images/main/img_partners03.png" alt="파트너 3" />
            </div>
            <div className="partner-item">
              <img src="/assets/images/main/img_partners04.png" alt="파트너 4" />
            </div>
            <div className="partner-item">
              <img src="/assets/images/main/img_partners05.png" alt="파트너 5" />
            </div>
            <div className="partner-item">
              <img src="/assets/images/main/img_partners06.png" alt="파트너 6" />
            </div>
            <div className="partner-item">
              <img src="/assets/images/main/img_partners07.png" alt="파트너 7" />
            </div>
            <div className="partner-item">
              <img src="/assets/images/main/img_partners08.png" alt="파트너 8" />
            </div>
            <div className="partner-item">
              <img src="/assets/images/main/img_partners09.png" alt="파트너 9" />
            </div>
            <div className="partner-item">
              <img src="/assets/images/main/img_partners10.png" alt="파트너 10" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* 팝업 컴포넌트 */}
      <MainPopup />
    </>
  )
} 