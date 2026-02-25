'use client';

import React from 'react';
import { DollarSign, FileUp, Target, BarChart3 } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';

const FEATURES = [
  { key: '1', icon: DollarSign, color: 'from-green-400 to-emerald-500' },
  { key: '2', icon: FileUp, color: 'from-blue-400 to-indigo-500' },
  { key: '3', icon: Target, color: 'from-orange-400 to-red-500' },
  { key: '4', icon: BarChart3, color: 'from-purple-400 to-pink-500' },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ key, icon: Icon, color }) => (
            <div
              key={key}
              className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-50"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                {t(`landing.feature${key}`)}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(`landing.feature${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
