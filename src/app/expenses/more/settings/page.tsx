'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { Languages, Info, Sparkles } from 'lucide-react';
import { useLanguageStore } from '@/presentation/stores/useLanguageStore';

export default function SettingsPage() {
  const { t, language } = useTranslation();
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {t('settings.title')}
        </h1>
        <p className="text-gray-500">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* General Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-50">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            {t('settings.general')}
          </h3>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Languages size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{t('settings.language')}</span>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setLanguage('th')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                language === 'th'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🇹🇭 ไทย
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🇺🇸 EN
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-50">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            {t('settings.about')}
          </h3>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <Info size={18} className="text-purple-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{t('settings.version')}</span>
          </div>
          <span className="text-sm text-gray-400 font-medium">0.1.0</span>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Sparkles size={18} className="text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Pro</span>
          </div>
          <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full">
            {t('nav.proComingSoon')}
          </span>
        </div>
      </div>
    </div>
  );
}
