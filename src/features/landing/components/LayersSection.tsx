'use client';

import React from 'react';
import { useTranslation } from '@/shared/lib/i18n';

const LAYERS = [
  { key: 'financial', active: true },
  { key: 'knowledge', active: false },
  { key: 'health', active: false },
] as const;

export default function LayersSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 px-4 bg-[var(--color-background)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] text-center mb-3 font-[var(--font-brand)] tracking-widest uppercase">
          {t('landing.layersTitle')}
        </h2>
        <p className="text-center text-[var(--color-text-secondary)] font-bold text-base sm:text-lg mb-12 max-w-2xl mx-auto">
          {t('landing.layersDesc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LAYERS.map((layer) => (
            <div
              key={layer.key}
              className={`relative p-5 border-2 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 ${
                layer.active
                  ? 'border-[var(--color-primary)] bg-[var(--color-surface)] shadow-[6px_6px_0px_0px_var(--color-primary)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-2)] opacity-75 hover:opacity-100 shadow-[4px_4px_0px_0px_var(--color-border)]'
              }`}
            >
              {/* Badge */}
              <span
                className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 border-2 tracking-widest uppercase ${
                  layer.active
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-muted)]'
                }`}
              >
                {layer.active ? t('landing.layer.active') : t('landing.layer.comingSoon')}
              </span>

              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1.5 pr-16 tracking-wide">
                {t(`landing.layer.${layer.key}`)}
              </h3>
              <p className="text-sm font-bold text-[var(--color-text-secondary)] leading-relaxed">
                {t(`landing.layer.${layer.key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
