'use client';

import React from 'react';
import { Upload, Eye, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';

const STEPS = [
  { num: '01', key: '1', icon: Upload, color: 'text-blue-600 bg-blue-50' },
  { num: '02', key: '2', icon: Eye, color: 'text-purple-600 bg-purple-50' },
  { num: '03', key: '3', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
];

export default function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-14 text-gray-900">
          {t('landing.howTitle')}
        </h2>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-12 left-[16.7%] right-[16.7%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {STEPS.map(({ num, key, icon: Icon, color }) => (
              <div key={key} className="flex flex-col items-center text-center">
                <div className={`relative w-24 h-24 rounded-2xl ${color} flex items-center justify-center mb-5 shadow-sm`}>
                  <Icon size={32} />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t(`landing.step${key}Title`)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
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
