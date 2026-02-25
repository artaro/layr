'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Palette, Zap } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';

const REASONS = [
  { key: '1', icon: Sparkles },
  { key: '2', icon: ShieldCheck },
  { key: '3', icon: Palette },
  { key: '4', icon: Zap },
];

export default function WhyLayrSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 px-4 bg-[var(--color-surface)] border-t-2 border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] text-center mb-12 font-[var(--font-brand)] tracking-widest uppercase">
          {t('landing.whyTitle')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {REASONS.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex gap-4 p-5 border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-primary)] transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_var(--color-primary)]"
            >
              <div className="flex-shrink-0 w-11 h-11 border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10 flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-primary)]">
                <Icon size={20} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-0.5 tracking-wide">
                  {t(`landing.why${key}Title`)}
                </h3>
                <p className="text-sm font-bold text-[var(--color-text-secondary)]">
                  {t(`landing.why${key}Desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
