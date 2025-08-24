import { Suspense } from 'react'
import type { Metadata } from 'next'
import { generatePostSEO } from '@/lib/seo'
import { generateArticleSchema, createJsonLdScript } from '@/lib/jsonld'
import NoticeViewClient from './NoticeViewClient'

// generateMetadata 함수 (서버 사이드에서 실행)
export async function generateMetadata({ searchParams }: { searchParams: { id?: string } }): Promise<Metadata> {
  const postId = searchParams.id
  
  if (!postId) {
    return {
      title: '공지사항 - KODE24',
      description: 'KODE24의 공지사항을 확인하세요.'
    }
  }

  try {
    // 서버사이드에서 게시글 데이터 페치
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/posts/${postId}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const post = await response.json()
      return generatePostSEO({
        title: post.title,
        content: post.content,
        authorName: post.authorName,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        boardType: '공지사항'
      })
    }
  } catch (error) {
    console.error('Meta 생성 중 오류:', error)
  }

  // 기본값 반환
  return {
    title: '공지사항 - KODE24',
    description: 'KODE24의 공지사항을 확인하세요.'
  }
}

export default async function NoticeViewPage({ searchParams }: { searchParams: { id?: string } }) {
  const postId = searchParams.id
  let articleSchema = null

  // 서버사이드에서 게시글 데이터를 가져와서 JSON-LD 생성
  if (postId) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/posts/${postId}`, {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const post = await response.json()
        articleSchema = generateArticleSchema({
          title: post.title,
          content: post.content,
          datePublished: post.createdAt,
          dateModified: post.updatedAt,
          author: post.authorName,
          url: `${baseUrl}/customer/notice_view?id=${postId}`,
          category: '공지사항'
        })
      }
    } catch (error) {
      console.error('게시글 데이터 로드 실패:', error)
    }
  }

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      {articleSchema && createJsonLdScript(articleSchema)}
      
      <Suspense fallback={<div>Loading...</div>}>
        <NoticeViewClient />
      </Suspense>
    </>
  )
} 