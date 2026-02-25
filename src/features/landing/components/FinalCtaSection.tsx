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
    <section className="py-16 sm:py-24 px-4 bg-[var(--color-surface)] border-t-2 border-[var(--color-border)] relative overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="absolute top-8 left-[10%] w-20 h-20 border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/5 animate-float-slow shadow-[4px_4px_0px_0px_var(--color-primary)]" />
      <div className="absolute bottom-12 right-[15%] w-16 h-16 border-2 border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 animate-float-delayed shadow-[4px_4px_0px_0px_var(--color-secondary)]" />
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="text-4xl mb-5 flex justify-center">
          <div className="w-16 h-16 border-2 border-[var(--color-border)] bg-[var(--color-background)] shadow-[4px_4px_0px_0px_var(--color-border)] flex items-center justify-center -rotate-3 hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_var(--color-border)] transition-all">🧱</div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-3 font-[var(--font-brand)] tracking-widest uppercase">
          {t('landing.finalCta')}
        </h2>
        <p className="text-[var(--color-text-secondary)] font-bold text-base sm:text-lg mb-8">
          {t('landing.finalCtaDesc')}
        </p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] text-[var(--color-surface)] text-base sm:text-lg font-bold border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] hover:shadow-[6px_6px_0px_0px_var(--color-border)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_var(--color-border)] uppercase tracking-wider"
        >
          {t('landing.getStarted')} <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
