'use client';

import React from 'react';
import { Upload, Eye, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';

const STEPS = [
  { num: '01', key: '1', icon: Upload, color: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)] shadow-[4px_4px_0px_0px_var(--color-primary)]' },
  { num: '02', key: '2', icon: Eye, color: 'text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 border-2 border-[var(--color-secondary)] shadow-[4px_4px_0px_0px_var(--color-secondary)]' },
  { num: '03', key: '3', icon: TrendingUp, color: 'text-[var(--color-expense)] bg-[var(--color-expense)]/10 border-2 border-[var(--color-expense)] shadow-[4px_4px_0px_0px_var(--color-expense)]' },
];

export default function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 bg-[var(--color-surface)] border-t-2 border-[var(--color-border)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] text-center mb-14 font-[var(--font-brand)] tracking-widest uppercase">
          {t('landing.howTitle')}
        </h2>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-12 left-[16.7%] right-[16.7%] border-t-2 border-dashed border-[var(--color-border)]" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {STEPS.map(({ num, key, icon: Icon, color }) => (
              <div key={key} className="flex flex-col items-center text-center">
                <div className={`relative w-24 h-24 ${color} flex items-center justify-center mb-5 hover:-translate-y-1 hover:-translate-x-1 transition-transform`}>
                  <Icon size={32} />
                  <span className="absolute -top-3 -right-3 w-7 h-7 border-2 border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] text-xs font-bold flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-border)]">
                    {num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 tracking-wide">
                  {t(`landing.step${key}Title`)}
                </h3>
                <p className="text-sm font-bold text-[var(--color-text-secondary)] leading-relaxed max-w-[240px]">
                  {t(`landing.step${key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
