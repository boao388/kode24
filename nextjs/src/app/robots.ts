import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kode24.co.kr'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/introduction/',
          '/solution/',
          '/customer/',
          '/solve/',
          '/report/',
          '/assets/images/',
          '/assets/css/',
          '/assets/js/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/_next/',
          '/solve/real_time_write',
          '/solve/review_write',
          '/solve/real_time_modify',
          '/solve/review_modify',
          '/solve/real_time_confirm',
          '/solve/review_confirm',
          '/*?password=*',
          '/*?secret=*',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/introduction/',
          '/solution/',
          '/customer/',
          '/solve/',
          '/report/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/_next/',
          '/solve/*_write',
          '/solve/*_modify',
          '/solve/*_confirm',
        ],
        crawlDelay: 0.5,
      },
      {
        userAgent: 'NaverBot',
        allow: [
          '/',
          '/introduction/',
          '/solution/',
          '/customer/',
          '/solve/',
          '/report/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/_next/',
          '/solve/*_write',
          '/solve/*_modify', 
          '/solve/*_confirm',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'DaumBot',
        allow: [
          '/',
          '/introduction/',
          '/solution/',
          '/customer/',
          '/solve/',
          '/report/',
        ],
        disallow: [
          '/admin/',
          '/api/', 
          '/private/',
          '/_next/',
          '/solve/*_write',
          '/solve/*_modify',
          '/solve/*_confirm',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
