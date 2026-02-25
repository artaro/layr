'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';
import { useAuth } from '@/features/auth/hooks/useAuth';
import HeroSection from '@/features/landing/components/HeroSection';
import LayersSection from '@/features/landing/components/LayersSection';
import FeaturesSection from '@/features/landing/components/FeaturesSection';
import HowItWorksSection from '@/features/landing/components/HowItWorksSection';
import WhyLayrSection from '@/features/landing/components/WhyLayrSection';
import TrustSection from '@/features/landing/components/TrustSection';
import FinalCtaSection from '@/features/landing/components/FinalCtaSection';

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const ctaHref = user ? '/portal' : '/login';

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between bg-[var(--color-background)] border-b-2 border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center text-sm border-2 border-[var(--color-border)] shadow-[2px_2px_0px_0px_var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            🧱
          </div>
          <h1 className="text-lg font-bold text-[var(--color-text-primary)] font-[var(--font-brand)] tracking-widest uppercase">
            {t('app.name')}
          </h1>
        </div>
        <Link
          href={ctaHref}
          className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] text-[var(--color-surface)] text-sm font-bold border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] hover:shadow-[6px_6px_0px_0px_var(--color-border)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_var(--color-border)] flex items-center gap-1.5 uppercase tracking-wider"
        >
          {t('landing.openApp')} <ArrowRight size={14} />
        </Link>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Sections */}
      <main>
        <HeroSection />
        <LayersSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WhyLayrSection />
        <TrustSection />
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center bg-[var(--color-surface)] border-t-2 border-[var(--color-border)]">
        <p className="text-xs font-bold text-[var(--color-text-muted)] tracking-wider">
          {t('app.footer')}
        </p>
      </footer>
    </div>
  );
}
