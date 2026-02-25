'use client';

import React from 'react';
import { Lock, Eye, Database } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';

export default function TrustSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 px-4 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Lock size={18} className="text-green-600" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Eye size={18} className="text-blue-600" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Database size={18} className="text-purple-600" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
          {t('landing.trustTitle')}
        </h2>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          {t('landing.trustDesc')}
        </p>
      </div>
    </section>
  );
}
