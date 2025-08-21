import type { Metadata } from "next";
import Script from 'next/script';
// common.css는 루트 레이아웃에서 이미 로드됨 - 중복 제거
// 서브 페이지 전용 CSS만 로드
import '@/styles/sub.css';

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

      {/* sub.js는 각 페이지 컴포넌트에서 개별 처리 - DOM 조작 충돌 방지 */}
    </>
  );
} 