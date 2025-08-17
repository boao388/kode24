import type { Metadata } from "next";
import Script from 'next/script';
// Next.js 스타일의 CSS import - 서브 페이지 전용 (원본과 동일)
import '@/styles/sub.css';
// Common CSS import - cursor__ball 설정 포함
import '@/styles/common.css';

export const metadata: Metadata = {
  title: "KODE24 | 몸캠피싱 피해 예방 및 대처 서비스",
  description: "KODE24의 전문적인 디지털 성범죄 대응 서비스를 확인하세요.",
};

export default function SubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      {/* 서브페이지 전용 스크립트 */}
      <Script src="/assets/js/sub.js" strategy="afterInteractive" />
    </>
  );
} 