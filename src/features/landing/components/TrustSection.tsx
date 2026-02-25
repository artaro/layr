'use client';

import React from 'react';
import { Lock, Eye, Database } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';

export default function TrustSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 px-4 bg-[var(--color-background)] border-t-2 border-[var(--color-border)]">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center gap-3 mb-6">
          <div className="w-10 h-10 border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10 flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-primary)]">
            <Lock size={18} className="text-[var(--color-primary)]" />
          </div>
          <div className="w-10 h-10 border-2 border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-secondary)]">
            <Eye size={18} className="text-[var(--color-secondary)]" />
          </div>
          <div className="w-10 h-10 border-2 border-[var(--color-expense)] bg-[var(--color-expense)]/10 flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-expense)]">
            <Database size={18} className="text-[var(--color-expense)]" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-3 font-[var(--font-brand)] tracking-widest uppercase">
          {t('landing.trustTitle')}
        </h2>
        <p className="text-[var(--color-text-secondary)] font-bold text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          {t('landing.trustDesc')}
        </p>
      </div>
    </section>
  );
}
