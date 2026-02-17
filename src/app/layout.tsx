import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'LifePulse — Track Your Expenses',
  description:
    'LifePulse is your daily life tracker. Start with expense tracking — import bank & credit card statements, track categories, and set budget goals. Built for teens who want to stay on top of their cash.',
  keywords: ['expense tracker', 'budget', 'finance', 'money management', 'LifePulse'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
