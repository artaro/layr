import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import LangSwitcher from '@/shared/components/layout/LangSwitcher';

// ── Fonts are loaded via @import in globals.css (Chakra Petch + IBM Plex Sans Thai) ──
// No next/font/google used — Google Fonts handles variable weights directly.

export const metadata: Metadata = {
  title: 'ออมเก่ง — ฝึกออมทุกวัน จนออมเก่ง',
  description:
    'ออมเก่ง — บันทึกง่าย AI อ่านสลิปธนาคารให้อัตโนมัติ ฝึกออมทุกวัน จนออมเก่ง',
  keywords: [
    'ออมเก่ง', 'Aomkeng', 'จดรายจ่าย', 'แอปออม', 'expense tracker',
    'จัดการเงิน', 'ติดตามรายจ่าย', 'Gen-Z', 'บัญชีรายรับรายจ่าย',
  ],
  openGraph: {
    title: 'ออมเก่ง — ฝึกออมทุกวัน จนออมเก่ง',
    description: 'แอปจดรายรับ-รายจ่ายที่ไม่น่าเบื่อ AI อ่านสลิปให้ ฟรี ไม่ต้องใช้บัตร',
    locale: 'th_TH',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#00FFAB" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className="antialiased"
        style={{
          fontFamily: "'IBM Plex Sans Thai', sans-serif",
          backgroundColor: '#0D0D0D',
          color: '#F5F5F5',
        }}
        suppressHydrationWarning
      >
        <Providers>
          <LangSwitcher />
          {children}
        </Providers>
      </body>
    </html>
  );
}
