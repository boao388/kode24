// JSON-LD 구조화 데이터 생성 라이브러리
import React from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kode24.co.kr'
const SITE_NAME = 'KODE24'

// 회사 정보
const ORGANIZATION_INFO = {
  name: 'KODE24',
  legalName: '코드24',
  url: BASE_URL,
  logo: `${BASE_URL}/assets/images/logo.png`,
  description: '몸캠피싱 피해 예방 및 전문적인 법적 대응 서비스를 제공하는 KODE24입니다.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '서울특별시 강남구',
    addressLocality: '강남구',
    addressRegion: '서울특별시',
    postalCode: '06292',
    addressCountry: 'KR'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+82-1588-0000',
    contactType: 'customer service',
    availableLanguage: 'Korean'
  }
}

// 웹사이트 스키마
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_NAME,
    url: BASE_URL,
    description: '몸캠피싱 피해 예방 및 전문적인 법적 대응 서비스를 제공하는 KODE24입니다.',
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

// 조직 스키마
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${BASE_URL}/#organization`,
    ...ORGANIZATION_INFO,
    sameAs: [
      'https://www.facebook.com/kode24',
      'https://www.instagram.com/kode24',
      'https://blog.naver.com/kode24'
    ],
    serviceType: '몸캠피싱 대응 서비스',
    areaServed: {
      '@type': 'Country',
      name: '대한민국'
    }
  }
}

// 기사/게시글 스키마
export function generateArticleSchema({
  title,
  content,
  datePublished,
  dateModified,
  author,
  url,
  imageUrl,
  category
}: {
  title: string
  content?: string
  datePublished: string
  dateModified?: string
  author?: string
  url: string
  imageUrl?: string
  category?: string
}) {
  const description = content 
    ? content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
    : title

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url,
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author || 'KODE24 관리자'
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1200,
        height: 630
      }
    }),
    ...(category && {
      articleSection: category,
      keywords: category
    })
  }
}

// FAQ 페이지 스키마
export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${BASE_URL}/customer/qna/#faqpage`,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.replace(/<[^>]*>/g, '')
      }
    }))
  }
}

// 브레드크럼 스키마
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }
}

// 서비스 스키마
export function generateServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE_URL}/solution/#service`,
    name: '몸캠피싱 대응 서비스',
    description: '몸캠피싱 피해 예방부터 사후 대응까지 체계적이고 전문적인 솔루션을 제공합니다.',
    provider: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`
    },
    areaServed: {
      '@type': 'Country',
      name: '대한민국'
    },
    serviceType: 'Legal Service',
    offers: [
      {
        '@type': 'Offer',
        name: '사전 예방 서비스',
        description: 'AI 기반 실시간 모니터링과 위험 상황 사전 차단'
      },
      {
        '@type': 'Offer', 
        name: '신속 대응 서비스',
        description: '24시간 전문가 상담과 즉시 대응 시스템'
      },
      {
        '@type': 'Offer',
        name: '법적 지원 서비스',
        description: '전문 변호사와 함께하는 법적 대응 및 피해 구제'
      }
    ]
  }
}

// 리뷰 스키마
export function generateReviewSchema({
  title,
  content,
  author,
  rating = 5,
  datePublished,
  url
}: {
  title: string
  content: string
  author: string
  rating?: number
  datePublished: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': url,
    itemReviewed: {
      '@type': 'Service',
      name: '몸캠피싱 대응 서비스',
      provider: {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`
      }
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1
    },
    author: {
      '@type': 'Person',
      name: author
    },
    datePublished,
    reviewBody: content.replace(/<[^>]*>/g, ''),
    name: title
  }
}

// JSON-LD 스크립트 태그 생성 헬퍼
export function createJsonLdScript(schema: object | object[]): React.ReactElement {
  const schemaArray = Array.isArray(schema) ? schema : [schema]
  
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(schemaArray, null, 0)
    }
  })
}
