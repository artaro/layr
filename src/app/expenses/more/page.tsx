'use client';

import React from 'react';
import Link from 'next/link';
import { Tags, Settings, ChevronRight, Upload } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface PortalCard {
  href: string;
  icon: React.ReactNode;
  emoji: string;
  titleKey: string;
  descKey: string;
  gradient: string;
}

export default function MorePage() {
  const { t } = useTranslation();

  const cards: PortalCard[] = [
    {
      href: '/expenses/more/categories',
      icon: <Tags className="w-6 h-6 text-white" />,
      emoji: '🏷️',
      titleKey: 'more.categoryManagement',
      descKey: 'more.categoryManagementDesc',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      href: '/expenses/upload',
      icon: <Upload className="w-6 h-6 text-white" />,
      emoji: '📄',
      titleKey: 'import.title',
      descKey: 'import.subtitle',
      gradient: 'from-emerald-400 to-teal-500',
    },
    {
      href: '/expenses/more/settings',
      icon: <Settings className="w-6 h-6 text-white" />,
      emoji: '⚙️',
      titleKey: 'more.settings',
      descKey: 'more.settingsDesc',
      gradient: 'from-indigo-400 to-purple-500',
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {t('more.title')}
        </h1>
        <p className="text-gray-500">
          {t('more.subtitle')}
        </p>
      </div>

      {/* Portal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 active:scale-[0.98]"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm shrink-0`}>
                {card.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 mb-0.5 flex items-center gap-1.5">
                  {t(card.titleKey)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t(card.descKey)}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight 
                size={20} 
                className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" 
              />
            </div>
          </Link>
        ))}
      </div>

      {/* App info */}
      <div className="pt-4 text-center">
        <p className="text-xs text-gray-400 font-medium">
          Layr v0.1.0 • {t('app.footer')}
        </p>
      </div>
    </div>
  );
}
