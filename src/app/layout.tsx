import type { Metadata } from 'next';
import { Outfit, Kanit } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import LangSwitcher from '@/presentation/components/layout/LangSwitcher';

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit',
  display: 'swap',
});

const kanit = Kanit({ 
  subsets: ['thai', 'latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Layr — จัดการเงินส่วนตัว',
  description:
    'Layr (เลเยอร์) คือแอปจัดการเงินส่วนตัว ติดตามรายรับ-รายจ่าย นำเข้าใบแจ้งยอดธนาคาร ตั้งเป้าหมายงบประมาณ ออกแบบมาเพื่อคนรุ่นใหม่',
  keywords: ['จัดการเงิน', 'ติดตามรายจ่าย', 'งบประมาณ', 'Layr', 'expense tracker', 'budget'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${outfit.variable} ${kanit.variable} font-sans antialiased text-gray-900 bg-gray-50`} suppressHydrationWarning>
        <Providers>
          <LangSwitcher />
          {children}
        </Providers>
      </body>
    </html>
  );
}
