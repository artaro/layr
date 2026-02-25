'use client';

import React from 'react';
import { useTranslation } from '@/shared/lib/i18n';

const LAYERS = [
  { key: 'financial', active: true },
  { key: 'knowledge', active: false },
  { key: 'health', active: false },
  { key: 'relationships', active: false },
  { key: 'custom', active: false },
] as const;

export default function LayersSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-3 text-gray-900">
          {t('landing.layersTitle')}
        </h2>
        <p className="text-center text-gray-500 text-base sm:text-lg mb-12 max-w-2xl mx-auto">
          {t('landing.layersDesc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {LAYERS.map((layer) => (
            <div
              key={layer.key}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                layer.active
                  ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md'
                  : 'border-gray-100 bg-gray-50/50 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Badge */}
              <span
                className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  layer.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {layer.active ? t('landing.layer.active') : t('landing.layer.comingSoon')}
              </span>

              <h3 className="text-lg font-bold text-gray-900 mb-1.5 pr-16">
                {t(`landing.layer.${layer.key}`)}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(`landing.layer.${layer.key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
