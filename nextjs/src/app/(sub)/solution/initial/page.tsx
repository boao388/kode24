'use client'

import { useEffect } from 'react'
import { generateServiceSchema, generateBreadcrumbSchema, createJsonLdScript } from '@/lib/jsonld'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function SolutionInitialPage() {
  // JSON-LD 구조화 데이터
  const serviceSchema = generateServiceSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '홈', url: '/' },
    { name: '솔루션', url: '/solution/initial' }
  ])

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
      {/* JSON-LD 구조화 데이터 */}
      {createJsonLdScript([serviceSchema, breadcrumbSchema])}
      
      <Header />
      
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
                      영상 유포 차단 솔루션은 가해자의 C&C 서버에 더미 데이터를 업로드하여 가해자가 피해자를 특정하지 못하도록 방해합니다.<br />
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
                                    <b>1년간 지속 지원</b>
                                    <p>
                                        문제 발생 시점부터 동일 사안에 대해 12개월간<br className="visible-lg"/> 무제한 사후 서비스를 제공합니다.
                                    </p>
                                </div>
                            </div>
                        </li> 
                        <li>
                            <div className="box">
                                <figure>
                                    <img src="/assets/images/solution/img_solution20.png" alt="" />
                                </figure>
                                <div className="details">
                                    <b>전문 지원팀</b>
                                    <p>
                                        숙련된 기술·법률 전문가가 심층 분석부터<br className="visible-lg"/> 실질 조치까지 전담합니다.
                                    </p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="box">
                                <figure>
                                    <img src="/assets/images/solution/img_solution21.png" alt="" />
                                </figure>
                                <div className="details">
                                    <b>신속 대응 체계</b>
                                    <p>
                                        고객 문의 즉시 대응 프로토콜이 가동되어<br className="visible-lg"/> 문제를 빠르게 진단·해결합니다.
                                    </p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="box">
                                <figure>
                                    <img src="/assets/images/solution/img_solution22.png" alt="" />
                                </figure>
                                <div className="details">
                                    <b>재발 방지·예방 조치</b>
                                    <p>
                                        해결 후에도 취약점 보완 가이드와 예방 전략을 제시해<br className="visible-lg"/> 동일 문제 재발을 차단합니다.
                                    </p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="box">
                                <figure>
                                    <img src="/assets/images/solution/img_solution23.png" alt="" />
                                </figure>
                                <div className="details">
                                    <b>복잡·민감 사안 지원</b>
                                    <p>
                                        법적 · 기술적 난이도가 높은 케이스도 외부 전문가<br className="visible-lg"/> 네트워크와 협력해 최적 해법을 제공합니다.
                                    </p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="box">
                                <figure>
                                    <img src="/assets/images/solution/img_solution24.png" alt="" />
                                </figure>
                                <div className="details">
                                    <b>장기적 신뢰 구축</b>
                                    <p>
                                        단발성 A/S를 넘어, 서비스 안정성과 고객 신뢰를<br className="visible-lg"/> 확보하는 지속적인 파트너십을 지향합니다.
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <figure>
                      <img src="/assets/images/solution/img_solution25.png" alt="" />
                    </figure>
                  </div>
                </div>
                <div className="tab-pane" id="ch-6">
                            <div className="solution-summary effect">
                                <h4>6. 작업 완료 보고서</h4>
                                <p>
                                    모든 작업이 완료된 후, 당사는 해당 고객을 위한 맞춤형 작업 완료 보고서를 제공하여, 수행된 모든 조치의 세부 내용과 그 결과를 정확하고 투명하게 문서화합니다.<br />
                                    이 보고서는 단순한 결과 요약이 아닌, 고객이 처한 구체적인 상황에 기반한 분석, 해결, 그리고 예방까지 아우르는 종합적 기록으로 구성됩니다.
                                </p>
                            </div>
                            <div className="solutions">
                                <ul>
                                    <li>
                                        <div className="box">
                                            <figure>
                                                <img src="/assets/images/solution/img_solution26.png" alt="" />
                                            </figure>
                                            <div className="details">
                                                <b>고객 환경에 특화된</b><br/><b>문제 원인 분석</b>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="box">
                                            <figure>
                                                <img src="/assets/images/solution/img_solution27.png" alt="" />
                                            </figure>
                                            <div className="details">
                                                <b>실제 적용된</b><br/><b>기술적 조치 및 그 근거</b>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="box">
                                            <figure>
                                                <img src="/assets/images/solution/img_solution28.png" alt="" />
                                            </figure>
                                            <div className="details">
                                                <b>조치 결과에 대한</b><br/><b>성능 및 효과 검증</b>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="box">
                                            <figure>
                                                <img src="/assets/images/solution/img_solution29.png" alt="" />
                                            </figure>
                                            <div className="details">
                                                <b>서비스 개선 또는</b><br/><b>보호를 위한 후속 권고</b>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="box">
                                            <figure>
                                                <img src="/assets/images/solution/img_solution30.png" alt="" />
                                            </figure>
                                            <div className="details">
                                                <b>향후 동일한 문제 발생 시의</b><br/><b>대응 전략</b>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="solution-summary effect">
                                <p>
                                    이 보고서는 해당 고객만을 위해 개별적으로 작성되며, 외부에 공유되지 않는 전용 문서로서, 고객의 보안 요구 및 내부 검토 절차를 고려해 설계됩니다.<br />
                                    고객은 이를 통해 문제 해결의 전 과정을 명확히 이해하고, 조직 내에서 신속한 의사결정이나 향후 유사 상황 대비를 위한 전략 수립에 활용할 수 있습니다.<br />
                                    또한, 본 보고서는 사후 관리 및 기술 지원 이력의 핵심 기반 자료로 기능하며, 책임성과 신뢰성을 확보하는 중요한 수단으로 작용합니다.
                                </p>
                            </div>
                            <div className="solutions">
                                <figure>
                                    <img src="/assets/images/solution/img_solution31.png" alt="" />
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