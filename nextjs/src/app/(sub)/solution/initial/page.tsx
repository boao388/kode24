'use client'

import { useEffect } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function SolutionInitialPage() {
  useEffect(() => {
    // 탭 기능 초기화
    const initTabFunction = () => {
      const tabLinks = document.querySelectorAll('.solution-tab a')
      const tabPanes = document.querySelectorAll('.tab-pane')
      const tabItems = document.querySelectorAll('.solution-tab li')

      tabLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          
          // 모든 탭 비활성화
          tabItems.forEach(item => item.classList.remove('active'))
          tabPanes.forEach(pane => pane.classList.remove('active'))
          
          // 클릭된 탭 활성화
          tabItems[index].classList.add('active')
          const targetId = link.getAttribute('href')?.substring(1)
          if (targetId) {
            const targetPane = document.getElementById(targetId)
            if (targetPane) {
              targetPane.classList.add('active')
            }
          }
        })
      })

      // 모달 관련 스크립트
      const modalBtns = document.querySelectorAll('[href^="#"]')
      modalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const href = btn.getAttribute('href')
          if (href?.startsWith('#') && href !== '#' && !href.startsWith('#ch-')) {
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

      // page header show 효과
      const pageHeader = document.querySelector('.page-header')
      if (pageHeader) {
        setTimeout(() => {
          pageHeader.classList.add('show')
        }, 100)
      }
    }

    initTabFunction()
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
          </div>
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
                <div className="tab-pane" id="ch-2">
                  <div className="solution-summary effect">
                    <h4>2. 데이터 재밍</h4>
                    <p>
                      특정된 가해자가 영상유포를 하지못하도록 유포데이터 검증기법, 가해자 트래픽 재밍 등의 기술을 통해 유포방지 솔루션을 적용시킵니다.<br />
                      안전한 환경에서 피해자들이 안심할 수 있도록 맞춤형 적용되는 솔루션입니다.
                    </p>
                  </div>
                  <div className="solutions">
                    <ul>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution05.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>타겟분산 대응</b>
                            <p>(해당 가해자가 피해자에 대한 관심 집중도를 낮춥니다.)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution06.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>타겟전환 필터링</b>
                            <p>(해당 가해자가 제3의 피해자(더미데이터)로<br className="visible-lg" /> 타겟이 전환되게 유도합니다.)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution07.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>트래픽 JAMMING</b>
                            <p>(가해자의 활동영역에 작업을 지연,<br className="visible-lg" /> 피해자를 보호할 작업시간을 생성)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution08.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>A.I. R.T.S(real.talk.service)</b>
                            <p>(가해자들은 코드24의 A.I.봇들과 대화를 하게 유도하여<br className="visible-lg" /> 가해자들의 작업을 방해합니다.)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution09.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>어카운트 정지</b>
                            <p>(해당 대화들을 기반으로 가해자 계정에 대한<br className="visible-lg" /> 운영 정지요청을 진행)</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <figure>
                      <img src="/assets/images/solution/img_solution10.png" alt="" />
                    </figure>
                  </div>
                </div>
                <div className="tab-pane" id="ch-3">
                  <div className="solution-summary effect">
                    <h4>3. 영상 유포 차단</h4>
                    <p>
                      영상 유포 차단 솔루션은 가해자의 C&amp;C 서버에 더미 데이터를 업로드하여 가해자가 피해자를 특정하지 못하도록 방해합니다.<br />
                      이를 통해 가해자의 공격을 무력화하고 피해 확산을 방지하여 개인의 안전을 지킵니다.
                    </p>
                  </div>
                  <div className="solutions">
                    <figure>
                      <img src="/assets/images/solution/img_solution11.png" alt="" />
                    </figure>
                  </div>
                </div>
                <div className="tab-pane" id="ch-4">
                  <div className="solution-summary effect">
                    <h4>4. A.I. 딥페이크 이미지 스왑</h4>
                    <p>
                      본 기술은 <b>인공지능(AI) 기반의 고도화된 딥페이크 이미지 스왑(Image Swap) 기법</b>을 활용하여,<br />
                      피해자의 얼굴이 포함된 영상 또는 이미지 내 인물을 외형상 완전히 다른 가상의 인물로 변환함으로써, 제3자가 해당 인물의 실제 신원을 식별할 수 없도록 설계되었습니다.<br />
                      기술의 핵심 목표는 피해자의 신원을 철저히 비식별화(De-identification) 함으로써, 향후 2차 피해나 사회적 낙인, 사생활 침해 등의 위험을 최소화하고,<br />
                      나아가 법적·사회적 대응이 보다 안전하게 이루어질 수 있도록 하는 데 있습니다. 실제 인물로 인식되지 않도록 외모의 모든 생체적 단서를 제거하면서도,<br />
                      영상의 맥락과 정황, 감정 전달 등의 주요 정보는 유지되도록 구현됩니다.<br /><br />

                      이러한 방식은 <b>특히 디지털 성범죄나 사이버 괴롭힘, 불법 합성물 유포와 같은 민감 사안에서 피해자가 노출되는 것을 방지</b>하면서,<br />
                      사건의 사실 관계를 시각적으로 설명하거나 기록할 수 있는 수단으로 활용됩니다.<br />
                      또한, 해당 기술은 신경망 기반 얼굴 대체 기술(GAN, encoder-decoder architecture, facial reenactment 등)을 활용하여,<br />
                      교체된 인물의 표정, 시선, 움직임 등이 자연스럽게 영상에 동기화되도록 처리되며, 조명, 피부 톤, 해상도 등을 자동 보정하여 영상의 일관성과 몰입도를 유지합니다.<br />
                      이처럼 본 기술은 영상의 진위를 유지하면서도 피해자의 신원은 완전히 보호할 수 있도록 설계되어,<br />
                      윤리적 AI 기술의 모범 사례이자, 법적 대응과 사회적 증언이 필요한 다양한 맥락에서 안전하고 효과적으로 활용될 수 있습니다.
                    </p>
                  </div>
                  <div className="solutions">
                    <ul>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution12.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>비식별화(De‑identification)</b>
                            <p>
                              피해자의 얼굴을 완전히 가상의 인물로 치환해 실제 신원 노출·2차 피해·사회적 낙인을 원천 차단합니다.
                            </p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution13.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>딥러닝 기반 얼굴 대체 기술</b>
                            <p>
                              GAN·encoder‑decoder·facial reenactment 모델을 사용해 표정·시선·움직임을 자연스럽게 동기화합니다.
                            </p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution14.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>맥락 보존</b>
                            <p>
                              외형 정보를 제거하면서도 사건 흐름·감정 전달·영상 진위는 그대로 유지하여 증거로서 신뢰성을 확보합니다.
                            </p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution15.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>고품질 합성·자동 보정</b>
                            <p>
                              조명, 피부 톤, 해상도 등을 실시간으로 일치시켜 시청각적 이질감을 최소화하고 몰입도를 높입니다.
                            </p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution16.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>법적‧사회적 활용성</b>
                            <p>
                              디지털 성범죄·사이버 괴롭힘 등 민감 사안에서 피해자를 드러내지 않고도 사실관계 입증 및 대응이 가능합니다.
                            </p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution17.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>윤리적 AI 모범 사례</b>
                            <p>
                              개인정보 보호 원칙과 AI 윤리 가이드라인을 준수해, 안전하고 책임감 있는 기술 활용을 실현합니다.
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <figure>
                      <img src="/assets/images/solution/img_solution18.png" alt="" />
                    </figure>
                  </div>
                </div>
                <div className="tab-pane" id="ch-5">
                  <div className="solution-summary effect">
                    <h4>5. 사후관리서비스</h4>
                    <p>
                      사후관리서비스는 피해자의 안전을 지속적으로 보장하기 위해 제공되는 종합적인 지원 시스템입니다.<br />
                      초기 대응 완료 후에도 재발 방지와 피해자의 정신적·사회적 회복을 위한 체계적인 관리를 제공합니다.
                    </p>
                  </div>
                  <div className="solutions">
                    <ul>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution19.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>지속적 모니터링</b>
                            <p>(재유포 방지를 위한 24시간 모니터링 시스템 운영)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution20.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>심리적 지원</b>
                            <p>(전문 상담사를 통한 트라우마 회복 프로그램 제공)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution21.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>법적 지원</b>
                            <p>(전문 변호사 연계를 통한 법적 대응 지원)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution22.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>예방 교육</b>
                            <p>(재피해 방지를 위한 개인 보안 교육 및 가이드 제공)</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <figure>
                      <img src="/assets/images/solution/img_solution23.png" alt="" />
                    </figure>
                  </div>
                </div>
                <div className="tab-pane" id="ch-6">
                  <div className="solution-summary effect">
                    <h4>6. 작업 완료 보고서</h4>
                    <p>
                      모든 대응 작업 완료 후 상세한 보고서를 제공하여 처리 과정과 결과를 투명하게 공개합니다.<br />
                      피해자가 안심할 수 있도록 전 과정에 대한 명확한 기록과 향후 대응 방안을 제시합니다.
                    </p>
                  </div>
                  <div className="solutions">
                    <ul>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution24.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>처리 과정 상세 기록</b>
                            <p>(모든 대응 단계별 상세 처리 내역 문서화)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution25.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>결과 분석 리포트</b>
                            <p>(차단/삭제 성공률 및 효과 분석 데이터 제공)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution26.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>향후 대응 가이드</b>
                            <p>(유사 사례 재발 방지를 위한 예방 조치 방안 제시)</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="box">
                          <figure>
                            <img src="/assets/images/solution/img_solution27.png" alt="" />
                          </figure>
                          <div className="details">
                            <b>보안 강화 권고사항</b>
                            <p>(개인정보 보호 및 보안 강화를 위한 맞춤형 권고안)</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <figure>
                      <img src="/assets/images/solution/img_solution28.png" alt="" />
                    </figure>
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