import type { Metadata } from 'next'
import { pageSEO } from '@/lib/seo'
import QnaClient from './QnaClient'

export const metadata: Metadata = pageSEO.qna()

export default function QnaPage() {
  return <QnaClient />
}