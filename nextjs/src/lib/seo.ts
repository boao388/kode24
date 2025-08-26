import type { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kode24.co.kr'
const SITE_NAME = 'KODE24'
const DEFAULT_TITLE = '몸캠피싱 피해 예방 및 대처 방법 | 코드24의 법적 대응과 전문가 조언'
const DEFAULT_DESCRIPTION = '몸캠피싱 피해 예방 및 전문적인 법적 대응 서비스를 제공하는 KODE24입니다. 전문가의 조언과 신속한 대응으로 피해를 최소화하세요.'
const DEFAULT_KEYWORDS = '몸캠피싱, 피해예방, 법적대응, 사이버범죄, 디지털성범죄, 온라인피해, 보안솔루션'

export function generateSEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const finalDescription = description || DEFAULT_DESCRIPTION
  const finalKeywords = keywords || DEFAULT_KEYWORDS
  const finalImage = ogImage || '/assets/images/og-image.jpg'

  const metadata: Metadata = {
    title: fullTitle,
    description: finalDescription,
    keywords: finalKeywords,
    
    openGraph: {
      type: ogType,
      title: fullTitle,
      description: finalDescription,
      url: BASE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'ko_KR',
    },

    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: finalDescription,
      images: [finalImage],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    verification: {
      google: process.env.GOOGLE_VERIFICATION_ID,
      other: {
        'naver-site-verification': process.env.NAVER_VERIFICATION_ID || '9a45d6fd048dbd26a8d3f3feded9727878fc4ae0',
      },
    },
  }

  // Article 타입일 때 추가 메타데이터
  if (ogType === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    }
  }

  return metadata
}

// 페이지별 SEO 메타데이터 생성 함수들
export const pageSEO = {
  // 메인 페이지
  home: (): Metadata => generateSEO(),

  // 소개 페이지
  introduce: (): Metadata => generateSEO({
    title: 'KODE24 소개',
    description: '몸캠피싱 전문 대응 솔루션 KODE24입니다. 전문적인 법적 대응과 기술적 해결책으로 디지털 성범죄 피해를 예방하고 해결합니다.',
    keywords: 'KODE24 소개, 몸캠피싱 전문업체, 디지털성범죄 전문, 법적대응, 보안솔루션'
  }),

  // 솔루션 안내
  solution: (): Metadata => generateSEO({
    title: '솔루션 안내',
    description: 'KODE24의 몸캠피싱 대응 솔루션을 확인하세요. AI 기술과 법적 전문성을 결합한 종합적인 해결 방안을 제공합니다.',
    keywords: '몸캠피싱 솔루션, AI 대응기술, 법적대응 서비스, 디지털성범죄 해결방안'
  }),

  // 실시간 문의
  realTimeList: (): Metadata => generateSEO({
    title: '실시간 해결 문의',
    description: '몸캠피싱 피해 발생 시 실시간 긴급 상담을 받으세요. 24시간 전문 상담사가 신속하게 대응해드립니다.',
    keywords: '실시간 상담, 긴급 문의, 몸캠피싱 신고, 24시간 상담, 즉시 대응'
  }),

  // 후기 목록
  reviewList: (): Metadata => generateSEO({
    title: '솔루션 진행 후기',
    description: 'KODE24 솔루션을 경험한 고객들의 실제 후기를 확인하세요. 전문적인 대응으로 피해를 해결한 사례들을 만나보세요.',
    keywords: '고객 후기, 해결 사례, 몸캠피싱 대응 후기, 성공 사례, 고객 만족도'
  }),

  // 공지사항
  noticeList: (): Metadata => generateSEO({
    title: '공지사항',
    description: 'KODE24의 최신 소식과 중요한 공지사항을 확인하세요. 서비스 업데이트와 보안 관련 정보를 제공합니다.',
    keywords: '공지사항, 최신소식, 서비스 업데이트, 보안 정보, KODE24 뉴스'
  }),

  // 자주묻는질문
  qna: (): Metadata => generateSEO({
    title: '자주묻는질문',
    description: '몸캠피싱과 관련하여 자주 묻는 질문과 답변을 확인하세요. 궁금한 점을 빠르게 해결할 수 있습니다.',
    keywords: 'FAQ, 자주묻는질문, 몸캠피싱 FAQ, 궁금한점, 질문답변'
  }),

  // 보도자료
  pressList: (): Metadata => generateSEO({
    title: '보도자료',
    description: 'KODE24의 언론 보도자료를 확인하세요. 몸캠피싱 대응 기술과 서비스에 대한 미디어 소식을 만나보세요.',
    keywords: '보도자료, 언론보도, 미디어 소식, KODE24 뉴스, 기술 발표'
  }),

  // 인증특허
  patentList: (): Metadata => generateSEO({
    title: '인증특허',
    description: 'KODE24의 기술력을 증명하는 인증서와 특허를 확인하세요. 전문적이고 검증된 기술로 안전한 서비스를 제공합니다.',
    keywords: '특허, 인증서, 기술 인증, 보안 기술, 전문 기술력'
  }),

  // 보안리포트
  kodeList: (): Metadata => generateSEO({
    title: '코드24 보안리포트',
    description: 'KODE24의 전문 보안 분석 리포트를 확인하세요. 최신 사이버 보안 트렌드와 위협 분석 정보를 제공합니다.',
    keywords: '보안리포트, 사이버보안, 위협분석, 보안동향, 악성코드 분석'
  }),

  // 악성앱 분석
  appList: (): Metadata => generateSEO({
    title: '악성 앱 분석',
    description: '악성 앱에 대한 전문 분석 리포트를 확인하세요. 모바일 보안 위협과 대응 방안을 상세히 안내합니다.',
    keywords: '악성앱 분석, 모바일 보안, 앱 위협, 모바일 악성코드, 스마트폰 보안'
  }),

  // 보안 이슈
  issueList: (): Metadata => generateSEO({
    title: '보안 이슈',
    description: '최신 사이버 보안 이슈와 대응 방안을 확인하세요. 실시간 보안 위협 정보와 예방 가이드를 제공합니다.',
    keywords: '보안이슈, 사이버위협, 보안취약점, 해킹동향, 보안대응'
  })
}

// 동적 게시글 SEO 생성
export function generatePostSEO(post: {
  title: string
  content?: string
  authorName?: string
  createdAt: string
  updatedAt?: string
  category?: string
  boardType?: string
}): Metadata {
  const description = post.content 
    ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
    : `KODE24의 ${post.title} 게시글입니다.`

  const boardTypeMap: { [key: string]: string } = {
    'notice': '공지사항',
    'real_time': '실시간 문의',
    'review': '후기',
    'kode': '보안리포트',
    'app': '악성앱 분석',
    'issue': '보안이슈',
    'press': '보도자료',
    'patent': '인증특허'
  }

  const section = post.boardType ? boardTypeMap[post.boardType] : undefined

  return generateSEO({
    title: post.title,
    description,
    ogType: 'article',
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt || post.createdAt,
    author: post.authorName,
    section,
    keywords: `${post.title}, ${section}, KODE24, 몸캠피싱, 사이버보안`
  })
} 