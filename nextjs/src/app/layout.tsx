import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from 'next/script';
import CustomCursor from '@/components/ui/CustomCursor';
import QueryProvider from '@/components/providers/QueryProvider';
import WebVitals from '@/components/monitoring/WebVitals';
import { generateSEO } from '@/lib/seo';
// CSS import 순서 최적화
import '@/styles/globals.css';
// Common CSS import - cursor__ball 설정 포함
import '@/styles/common.css';
import '@/styles/main.css';
// import '@/styles/sub.css';
// HTML Editor styles
import '@/styles/editor.css';
// HTML Content styles for user pages
import '@/styles/editor-content.css';

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

// 루트 레이아웃에 완벽한 SEO 메타데이터 적용
export const metadata: Metadata = generateSEO({
  title: '몸캠피싱해결, 몸캠피싱 피해 예방 및 대처 방법',
  description: '몸캠피싱해결, 몸캠피싱 피해 예방 및 전문적인 법적 대응 서비스를 제공하는 KODE24입니다. 전문가의 조언과 신속한 대응으로 피해를 최소화하세요.',
  keywords: '몸캠피싱, 피해예방, 법적대응, 사이버범죄, 디지털성범죄, 온라인피해, 보안솔루션'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Swiper CSS */}
	<meta name="naver-site-verification" content="96ad28ac10c79f5ca2f8dc59840e9975514ceacb" />

	<script type="text/javascript">
	var protect_id = 'h665';
	</script>
	<script async type="text/javascript" src="//script.boraware.kr/protect_script_v2.js"></script>
	<script type="text/javascript" src="//wcs.pstatic.net/wcslog.js"></script>
	<Script id="wcs-script" strategy="afterInteractive">
          {`
	    if(!wcs_add) var wcs_add = {};
            wcs_add["wa"] = "155435620a621f";
            if (window.wcs) {
              wcs_do();
            }
          `}
        </Script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />

        {/* Slick CSS */}
        <link
          rel="stylesheet"
          type="text/css"
          href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"
        />
      </head>
      <body className={`${notoSansKr.variable} main-page`}>
        <QueryProvider>
          {/* <CustomCursor /> */}
          <WebVitals debug={process.env.NODE_ENV === 'development'} />
          {children}
        </QueryProvider>

        {/* 기존 퍼블리싱 스크립트 */}
        <Script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.4/TweenMax.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" strategy="beforeInteractive" />
        <Script src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js" strategy="beforeInteractive" />
        <Script src="https://unpkg.com/typehangul@1.0.2/dist/typehangul.min.js" strategy="beforeInteractive" />

        <Script src="/assets/js/common.js" strategy="afterInteractive" />
        {/* <Script src="/assets/js/main.js" strategy="beforeInteractive" /> */}
        {/* cursor.js는 React CustomCursor 컴포넌트로 대체됨 - 중복 방지 */}
      </body>
    </html>
  );
}
