'use client';

import React from 'react';
import { DollarSign, FileUp, Target, BarChart3 } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';

const FEATURES = [
  { key: '1', icon: DollarSign, color: 'text-[var(--color-primary)]' },
  { key: '2', icon: FileUp, color: 'text-[var(--color-secondary)]' },
  { key: '3', icon: Target, color: 'text-[var(--color-expense)]' },
  { key: '4', icon: BarChart3, color: 'text-[var(--color-primary)]' },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 px-4 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        {/* Section badge — Phase 1 indicator */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1.5 uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--color-primary)]">
            💰 {t('landing.featuresPhase')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ key, icon: Icon, color }) => (
            <div
              key={key}
              className="group p-6 bg-[var(--color-surface)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 hover:-translate-y-1.5 hover:-translate-x-1.5 hover:shadow-[6px_6px_0px_0px_var(--color-primary)]"
            >
              <div className={`w-12 h-12 bg-[var(--color-surface-2)] border-2 border-[var(--color-border)] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-[2px_2px_0px_0px_var(--color-border)]`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1.5 font-[var(--font-brand)] tracking-wide">
                {t(`landing.feature${key}`)}
              </h3>
              <p className="text-sm font-bold text-[var(--color-text-secondary)] leading-relaxed">
                {t(`landing.feature${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
