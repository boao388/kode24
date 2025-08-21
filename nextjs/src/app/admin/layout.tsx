import type { Metadata } from "next";
import '@/styles/sub.css';
import '@/styles/admin-dark.css';

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
    <div className="admin-layout">
      {children}
    </div>
  );
} 