import type { Metadata } from 'next';
import { Outfit, Kanit } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import LangSwitcher from '@/shared/components/layout/LangSwitcher';

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
  title: 'Layr — สร้างชีวิตดีขึ้น ทีละชั้น',
  description:
    'Layr (เลเยอร์) คือแอปพัฒนาชีวิตแบบเลเยอร์ — เริ่มจากการเงิน ต่อยอดด้วยทักษะและสุขภาพ ติดตามรายรับ-รายจ่าย นำเข้าใบแจ้งยอดธนาคาร ตั้งเป้าหมาย ออกแบบมาเพื่อคนรุ่นใหม่',
  keywords: ['Layr', 'life improvement', 'expense tracker', 'จัดการเงิน', 'ติดตามรายจ่าย', 'พัฒนาตัวเอง', 'ทักษะ', 'สุขภาพ'],
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
