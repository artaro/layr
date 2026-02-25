'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function HeroSection() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const ctaHref = user ? '/portal' : '/login';

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8F7FF] via-[#EDE8FF] to-[#F0EEFF] -z-10" />
      
      {/* Floating layer cards decoration */}
      <div className="absolute top-1/4 left-[10%] w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-200/60 to-purple-300/40 backdrop-blur-sm animate-float-slow -z-0 hidden sm:block" />
      <div className="absolute top-1/3 right-[12%] w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-pink-200/50 to-pink-300/30 backdrop-blur-sm animate-float-delayed -z-0 hidden sm:block" />
      <div className="absolute bottom-1/3 left-[15%] w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-indigo-200/50 to-indigo-300/30 backdrop-blur-sm animate-float -z-0 hidden sm:block" />

      {/* Layer stack visual — only 3 core layers */}
      <div className="mb-8 relative">
        <div className="flex flex-col items-center gap-1.5">
          {['💰', '📚', '💪'].map((emoji, i) => (
            <div
              key={emoji}
              className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl flex items-center justify-center text-lg shadow-md transition-all duration-500"
              style={{
                background: `rgba(108, 92, 231, ${0.15 + i * 0.07})`,
                animationDelay: `${i * 0.15}s`,
                transform: `scale(${1 - i * 0.02})`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-5 tracking-tight max-w-4xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] via-[#A29BFE] to-[#FD79A8]">
          {t('landing.hero')}
        </span>
      </h1>

      {/* Sub-headline */}
      <p className="max-w-xl mx-auto text-base sm:text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed">
        {t('landing.heroDesc')}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          href={ctaHref}
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base sm:text-lg font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          {t('landing.getStarted')} <ArrowRight size={18} />
        </Link>
        <a
          href="#how-it-works"
          className="px-8 py-3.5 bg-white/70 hover:bg-white text-indigo-700 text-base sm:text-lg font-semibold rounded-2xl border border-indigo-100 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          {t('landing.ctaSecondary')} <ChevronDown size={18} />
        </a>
      </div>

      {/* Phase note */}
      <p className="mt-6 text-sm text-gray-400 font-medium">
        {t('landing.phaseNote')}
      </p>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-bounce-slow">
        <ChevronDown size={24} className="text-indigo-300" />
      </div>
    </section>
  );
}
