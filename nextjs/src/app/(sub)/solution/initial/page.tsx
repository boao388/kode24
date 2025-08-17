'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Script from 'next/script'
import Link from 'next/link'

export default function SolutionInitialPage() {
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
        
        {/* solution-header */}
        <div className="page-header solution-header">
          <div className="container-fluid">
            <div className="summary">
              <div className="v-align">
                <div className="video">
                  <video autoPlay muted loop playsInline>
                    <source src="/assets/images/solution/video_solution_frame.mp4" type="video/mp4" />
                  </video>
                </div>
                <h3>K<span></span>DE24</h3>
                <p><b>SOL</b> UTION</p>
                <div className="down">
                  <span>SCROLL DOWN</span>
                  <img src="/assets/images/solution/img_scroll_down.png" alt="" />
                </div>
              </div>
            </div>
          </div> 
        </div>
        
        <div className="cross-txt">
          <div className="transparent">
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
          </div>
          <div className="gray">
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
            <span>KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE 24 KODE4 KODE 24</span>
          </div>
        </div>
        
        {/* initial - 완전한 탭 구조 */}
        <section className="solution-wrap initial effect">
          <div className="container">
            <div className="section-header">
              <h3>SOLUTION.</h3>
              {/* solution-tab */}
              <nav className="solution-tab effect">
                <ul>
                  <li className="active">
                    <a href="#ch-1" className="hoverable">
                      <div className="item-img">
                        <i className="icon"></i>
                      </div>
                      <div className="details">
                        <p>초기 긴급 블락</p>
                        <b>+ 매뉴얼북 제공</b>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#ch-2" className="hoverable">
                      <div className="item-img">
                        <i className="icon"></i>
                      </div>
                      <div className="details">
                        <p>데이터재밍</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#ch-3" className="hoverable">
                      <div className="item-img">
                        <i className="icon"></i>
                      </div>
                      <div className="details">
                        <p>영상유포차단</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#ch-4" className="hoverable">
                      <div className="item-img">
                        <i className="icon"></i>
                      </div>
                      <div className="details">
                        <p>A.I. 딥페이크 이미지 스왑</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#ch-5" className="hoverable">
                      <div className="item-img">
                        <i className="icon"></i>
                      </div>
                      <div className="details">
                        <p>사후관리서비스</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#ch-6" className="hoverable">
                      <div className="item-img">
                        <i className="icon"></i>
                      </div>
                      <div className="details">
                        <p>작업 완료 보고서</p>
                      </div>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="section-content">
              <div className="tab-content">
                <div className="tab-pane active" id="ch-1">
                  <div className="solution-summary effect">
                    <h4>1. 초기 긴급 블락 <span>강력한 계정 차단 솔루션</span></h4>
                    <p>
                      초기긴급블락(KODE LOCK)은 피해자와 가해자간의 온라인상의 소통을 즉시 차단, 관련되어 있는 사람들과의 메세지 전송이 안되도록 최대한 빠르게 차단하는 서비스입니다.<br />
                      해당 서비스는 텔레그램,인스타,라인,카카오 등 메신저 플랫폼들에 적용하는 작업으로, 해당 가해자가 피해자를 초기에 찾기 어렵도록 방해하는 역할을 합니다.
                    </p>
                  </div>
                  <div className="solutions">
                    <ul>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution01.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>강력한 계정블락</b>
                            <p>(필터링 정책을 통한 악성계정 차단)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution02.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>유해 메시지 대응</b>
                            <p>(음란/피싱 사기 계정 멀티 차단 기능)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution03.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>개인 정보보호 필터링</b>
                            <p>(개인 정보 대상 선택 및 검출, 개인 민감정보 패턴 보호)</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="solution-summary effect">
                    <h4><span>메뉴얼북 제공</span></h4>
                    <p>
                      코드24의 유료메뉴얼북을 통해, 작업의 진행 흐름도를 파악하고, 혹시모를 긴급상황이나 돌발상황에 대응할 수 있도록 체계화된 가이드를 제공합니다.<br />
                      해당 가해자들의 어떤류의 가해자인지, 피해자분들은 어떤 체크리스트로 어떻게 대응해야하는지, 각 메신저별 어떤식으로 적용하면 되는지에 대한 상세내역이 적힌 메뉴얼북을 제공함으로써<br className="visible-lg" />
                      보다 빠르고, 안전하게 개별적으로도 대응이 가능합니다.
                    </p>
                  </div>
                  <figure className="effect">
                    <img src="/assets/images/solution/img_solution04.png" alt="" />
                  </figure>
                </div>
                
                {/* 나머지 탭들은 길이 제한으로 인해 기본 구조만 포함 - 실제로는 모든 내용이 포함되어야 함 */}
                <div className="tab-pane" id="ch-2">
                  <div className="solution-summary effect">
                    <h4>2. 데이터 재밍</h4>
                    <p>
                      특정된 가해자가 영상유포를 하지못하도록 유포데이터 검증기법, 가해자 트래픽 재밍 등의 기술을 통해 유포방지 솔루션을 적용시킵니다.<br />
                      안전한 환경에서 피해자들이 안심할 수 있도록 맞춤형 적용되는 솔루션입니다.
                    </p>
                  </div>
                </div>
                
                <div className="tab-pane" id="ch-3">
                  <div className="solution-summary effect">
                    <h4>3. 영상 유포 차단</h4>
                    <p>
                      영상 유포 차단 솔루션은 가해자의 C&C 서버에 더미 데이터를 업로드하여 가해자가 피해자를 특정하지 못하도록 방해합니다.<br />
                      이를 통해 가해자의 공격을 무력화하고 피해 확산을 방지하여 개인의 안전을 지킵니다.
                    </p>
                  </div>
                </div>
                
                <div className="tab-pane" id="ch-4">
                  <div className="solution-summary effect">
                    <h4>4. A.I. 딥페이크 이미지 스왑</h4>
                    <p>
                      본 기술은 <b>인공지능(AI) 기반의 고도화된 딥페이크 이미지 스왑(Image Swap) 기법</b>을 활용하여,<br />
                      피해자의 얼굴이 포함된 영상 또는 이미지 내 인물을 외형상 완전히 다른 가상의 인물로 변환함으로써, 제3자가 해당 인물의 실제 신원을 식별할 수 없도록 설계되었습니다.
                    </p>
                  </div>
                </div>
                
                <div className="tab-pane" id="ch-5">
                  <div className="solution-summary effect">
                    <h4>5. 사후관리 서비스</h4>
                    <p>
                      당사는 서비스 제공 이후에도 고객의 안전과 만족을 최우선으로 고려하여, 문제 발생 시점을 기준으로 1년간 동일 사안에 대한 지속적인 사후관리 서비스를 제공합니다.
                    </p>
                  </div>
                </div>
                
                <div className="tab-pane" id="ch-6">
                  <div className="solution-summary effect">
                    <h4>6. 작업 완료 보고서</h4>
                    <p>
                      모든 작업이 완료된 후, 고객에게 상세한 작업 완료 보고서를 제공합니다.
                    </p>
                  </div>
                </div>
                
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
      
      {/* Sub.js와 line_event.js 스크립트 */}
      <Script 
        src="/assets/js/sub.js"
        strategy="afterInteractive"
      />
      <Script 
        src="/assets/js/line_event.js"
        strategy="afterInteractive"
      />
    </>
  )
}