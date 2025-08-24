import type { Metadata } from 'next'
import { pageSEO } from '@/lib/seo'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PostList from '@/components/common/PostList'

export const metadata: Metadata = pageSEO.issueList()

export default function IssueListPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-list-wrap app-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Security Issue</small>
              <h3 className="typed">보안 이슈</h3>
            </div>
            
            <div className="article-content">
              <PostList
                boardKey="issue_report"
                boardTitle="보안 이슈"
                viewPathPrefix="/report/issue_view"
                showSearch={true}
                showCategory={false}
                className="issue-list"
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