'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';
import HeroSection from '@/features/landing/components/HeroSection';
import LayersSection from '@/features/landing/components/LayersSection';
import FeaturesSection from '@/features/landing/components/FeaturesSection';
import HowItWorksSection from '@/features/landing/components/HowItWorksSection';
import WhyLayrSection from '@/features/landing/components/WhyLayrSection';
import TrustSection from '@/features/landing/components/TrustSection';
import FinalCtaSection from '@/features/landing/components/FinalCtaSection';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between bg-white/80 backdrop-blur-lg border-b border-gray-100/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-sm shadow-md shadow-indigo-200">
            🧱
          </div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            {t('app.name')}
          </h1>
        </div>
        <Link
          href="/portal"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
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
      <footer className="py-6 text-center bg-gray-50 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400">
          {t('app.footer')}
        </p>
      </footer>
    </div>
  );
}
