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
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-gray-900">
          {t('landing.whyTitle')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {REASONS.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-indigo-100 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-50"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Icon size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-0.5">
                  {t(`landing.why${key}Title`)}
                </h3>
                <p className="text-sm text-gray-500">
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
