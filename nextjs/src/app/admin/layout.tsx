import type { Metadata } from "next";
import '@/styles/sub.css';

export const metadata: Metadata = {
  title: "관리자 페이지 - KODE24",
  description: "KODE24 관리자 페이지",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
      {children}
    </div>
  );
} 