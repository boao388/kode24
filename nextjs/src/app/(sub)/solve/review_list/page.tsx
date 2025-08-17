'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PostList from '@/components/common/PostList'

export default function ReviewListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(searchInput)
  }

  return (
    <>
      <Header />
      
      <main id="content">
        <article className="board-list-wrap review-list">
          <div className="container">
            <div className="article-header">
              <small className="typed">Solution Feedback</small>
              <h3 className="typed">솔루션 진행 후기</h3>
              
              {/* 원본 HTML 구조에 맞게 search-form을 article-header 안에 배치 */}
              <div className="search-form">
                <form onSubmit={handleSearch} className="form-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="검색어를 입력해 주세요"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit" className="btn-search hoverable">
                    <img src="/assets/images/sub/ico_search.png" alt="" />
                  </button>
                </form>
                <div className="btn-area">
                  <Link href="/solve/review_write" className="btn-write hoverable">글쓰기</Link>
                </div>
              </div>
            </div>
            
            <div className="article-content">
              {/* PostList에서 검색 폼 제거하고 search term을 props로 전달 */}
              <PostList
                boardKey="review"
                boardTitle="솔루션 진행 후기"
                viewPathPrefix="/solve/review_view"
                showSearch={false}
                showCategory={false}
                className="review-list"
                pageSize={10}
                boardType="review"
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}