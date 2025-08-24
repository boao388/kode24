import type { Metadata } from 'next'
import { pageSEO } from '@/lib/seo'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PostList from '@/components/common/PostList'

export const metadata: Metadata = pageSEO.kodeList()

export default function KodeListPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-list-wrap kode-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Kode24 Security Report</small>
              <h3 className="typed">코드24 보안리포트</h3>
            </div>
            
            <div className="article-content">
              <PostList
                boardKey="kode_report"
                boardTitle="코드24 보안리포트"
                viewPathPrefix="/report/kode_view"
                showSearch={true}
                showCategory={false}
                className="kode-list"
                pageSize={10}
                boardType="default"
              />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}