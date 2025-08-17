'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Link from 'next/link'

export default function SubPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <div className="page-header">
          <div className="container">
            <h2>서브 페이지</h2>
            <div className="breadcrumb">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li>서브 페이지</li>
              </ul>
            </div>
          </div>
        </div>

        <section className="sub-content">
          <div className="container">
            <div className="section-header">
              <h3>서브 페이지 컨텐츠</h3>
              <p>이곳은 서브 페이지의 기본 템플릿입니다.</p>
            </div>
            
            <div className="section-content">
              <div className="content-wrap">
                <h4>서브 페이지 안내</h4>
                <p>
                  이 페이지는 서브 페이지의 기본 구조를 보여주는 템플릿 페이지입니다.
                  실제 콘텐츠는 각 페이지의 목적에 맞게 수정하여 사용하시면 됩니다.
                </p>
                
                <div className="feature-list">
                  <ul>
                    <li>반응형 디자인 지원</li>
                    <li>접근성 고려한 마크업</li>
                    <li>SEO 최적화</li>
                    <li>모바일 친화적 인터페이스</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
} 