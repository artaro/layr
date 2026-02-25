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
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--color-background)] -z-10" />
      
      {/* Floating layer cards decoration */}
      <div className="absolute top-1/4 left-[10%] w-16 h-16 sm:w-20 sm:h-20 border-2 border-[var(--color-border)] bg-[var(--color-surface)] animate-float-slow -z-0 hidden sm:block shadow-[4px_4px_0px_0px_var(--color-primary)]" />
      <div className="absolute top-1/3 right-[12%] w-14 h-14 sm:w-16 sm:h-16 border-2 border-[var(--color-border)] bg-[var(--color-primary)]/10 animate-float-delayed -z-0 hidden sm:block shadow-[4px_4px_0px_0px_var(--color-secondary)]" />
      <div className="absolute bottom-1/3 left-[15%] w-12 h-12 sm:w-14 sm:h-14 border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] animate-float -z-0 hidden sm:block shadow-[2px_2px_0px_0px_var(--color-expense)]" />

      {/* Layer stack visual — only 3 core layers */}
      <div className="mb-8 relative">
        <div className="flex flex-col items-center gap-1.5">
          {['💰', '📚', '💪'].map((emoji, i) => (
            <div
              key={emoji}
              className="w-14 h-10 sm:w-16 sm:h-11 border-2 border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-lg shadow-[4px_4px_0px_0px_var(--color-primary)] transition-all duration-500"
              style={{
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
      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-5 tracking-wide max-w-4xl font-[var(--font-brand)] uppercase">
        <span className="text-[var(--color-primary)] text-shadow-sm">
          {t('landing.hero')}
        </span>
      </h1>

      {/* Sub-headline */}
      <p className="max-w-xl mx-auto text-base sm:text-lg lg:text-xl text-[var(--color-text-secondary)] font-bold mb-10 leading-relaxed">
        {t('landing.heroDesc')}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          href={ctaHref}
          className="px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] text-[var(--color-surface)] text-base sm:text-lg font-bold border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] hover:shadow-[6px_6px_0px_0px_var(--color-border)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_var(--color-border)] flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          {t('landing.getStarted')} <ArrowRight size={18} />
        </Link>
        <a
          href="#how-it-works"
          className="px-8 py-3.5 bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-base sm:text-lg font-bold border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] hover:shadow-[6px_6px_0px_0px_var(--color-border)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_var(--color-border)] flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          {t('landing.ctaSecondary')} <ChevronDown size={18} />
        </a>
      </div>

      {/* Phase note */}
      <p className="mt-6 text-sm text-[var(--color-text-muted)] font-bold tracking-widest uppercase">
        {t('landing.phaseNote')}
      </p>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-bounce-slow">
        <ChevronDown size={24} className="text-[var(--color-text-muted)] opacity-50" />
      </div>
    </section>
  );
}
