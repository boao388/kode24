'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PostList from '@/components/common/PostList'

export default function AppListPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-list-wrap app-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">App Analysis Report</small>
              <h3 className="typed">악성 앱 분석</h3>
            </div>
            
            <div className="article-content">
              <PostList
                boardKey="app_report"
                boardTitle="악성 앱 분석"
                viewPathPrefix="/report/app_view"
                showSearch={true}
                showCategory={false}
                className="app-list"
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