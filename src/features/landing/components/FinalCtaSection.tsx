'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function FinalCtaSection() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const ctaHref = user ? '/portal' : '/login';

  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-[#6C5CE7] via-[#7C6CF7] to-[#A29BFE] relative overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="absolute top-8 left-[10%] w-20 h-20 rounded-full bg-white/5 animate-float-slow" />
      <div className="absolute bottom-12 right-[15%] w-16 h-16 rounded-2xl bg-white/5 animate-float-delayed" />
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="text-4xl mb-5">🧱</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          {t('landing.finalCta')}
        </h2>
        <p className="text-white/70 text-base sm:text-lg mb-8">
          {t('landing.finalCtaDesc')}
        </p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-indigo-700 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
        >
          {t('landing.getStarted')} <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
