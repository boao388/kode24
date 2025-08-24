import type { Metadata } from 'next'
import { pageSEO } from '@/lib/seo'
import { generateFAQPageSchema, createJsonLdScript } from '@/lib/jsonld'
import QnaClient from './QnaClient'

export const metadata: Metadata = pageSEO.qna()

export default async function QnaPage() {
  // 서버사이드에서 FAQ 데이터 가져오기
  let faqSchema = null
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/faqs`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const faqs = await response.json()
      if (faqs && faqs.length > 0) {
        faqSchema = generateFAQPageSchema(
          faqs.map((faq: any) => ({
            question: faq.question,
            answer: faq.answer
          }))
        )
      }
    }
  } catch (error) {
    console.error('FAQ 데이터 로드 실패:', error)
  }

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      {faqSchema && createJsonLdScript(faqSchema)}
      
      <QnaClient />
    </>
  )
}