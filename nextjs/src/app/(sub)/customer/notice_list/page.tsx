'use client'

import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PostList from '@/components/common/PostList'

export default function NoticeListPage() {
  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-list-wrap notice-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Notice</small>
              <h3 className="typed">공지사항</h3>
            </div>
            
            <div className="article-content">
              <PostList
                boardKey="notice"
                boardTitle="공지사항"
                viewPathPrefix="/customer/notice_view"
                showSearch={true}
                showCategory={false}
                className="notice-list"
                pageSize={10}
                boardType="notice"
              />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}