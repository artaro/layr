'use client';

import React from 'react';
import { useTranslation } from '@/shared/lib/i18n';
import { Languages, Info, Sparkles } from 'lucide-react';
import { useLanguageStore } from '@/shared/stores/useLanguageStore';

export default function SettingsPage() {
  const { t, language } = useTranslation();
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1 font-[var(--font-brand)] uppercase tracking-wider">
          {t('settings.title')}
        </h1>
        <p className="text-[var(--color-text-secondary)] font-bold">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* General Section */}
      <div className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] overflow-hidden">
        <div className="px-5 py-3 border-b-2 border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
            {t('settings.general')}
          </h3>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between px-5 py-4 hover:bg-[var(--color-surface-2)] transition-colors border-b-2 border-[var(--color-border)] last:border-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10 flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-primary)]">
              <Languages size={18} className="text-[var(--color-primary)]" />
            </div>
            <span className="text-sm font-bold text-[var(--color-text-primary)] tracking-wide">{t('settings.language')}</span>
          </div>
          <div className="flex bg-[var(--color-surface-2)] border-2 border-[var(--color-border)] p-1">
            <button
              onClick={() => setLanguage('th')}
              className={`px-3 py-1.5 text-sm font-bold transition-all border-2 ${
                language === 'th'
                  ? 'bg-[var(--color-primary)] text-[var(--color-surface)] border-[var(--color-border)] shadow-[2px_2px_0px_0px_var(--color-border)]'
                  : 'text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text-primary)]'
              }`}
            >
              🇹🇭 ไทย
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 text-sm font-bold transition-all border-2 ${
                language === 'en'
                  ? 'bg-[var(--color-primary)] text-[var(--color-surface)] border-[var(--color-border)] shadow-[2px_2px_0px_0px_var(--color-border)]'
                  : 'text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text-primary)]'
              }`}
            >
              🇺🇸 EN
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] overflow-hidden">
        <div className="px-5 py-3 border-b-2 border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
            {t('settings.about')}
          </h3>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[var(--color-border)] last:border-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-secondary)]">
              <Info size={18} className="text-[var(--color-secondary)]" />
            </div>
            <span className="text-sm font-bold text-[var(--color-text-primary)] tracking-wide">{t('settings.version')}</span>
          </div>
          <span className="text-sm font-bold text-[var(--color-text-muted)] border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5">0.1.0</span>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[var(--color-border)] last:border-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10 flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-primary)]">
              <Sparkles size={18} className="text-[var(--color-primary)]" />
            </div>
            <span className="text-sm font-bold text-[var(--color-text-primary)] tracking-wide">Pro</span>
          </div>
          <span className="text-xs text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)] px-2.5 py-1 tracking-widest uppercase shadow-[2px_2px_0px_0px_var(--color-primary)]">
            {t('nav.proComingSoon')}
          </span>
        </div>
      </div>
    </div>
  );
}
