'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ArrowLeftRight, Tag, Landmark } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const items: NavItem[] = [
    { href: '/expenses', labelKey: 'nav.dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/expenses/transactions', labelKey: 'nav.transactions', icon: <ArrowLeftRight size={20} /> },
    { href: '/expenses/categories', labelKey: 'nav.categories', icon: <Tag size={20} /> },
    { href: '/expenses/accounts', labelKey: 'nav.accounts', icon: <Landmark size={20} /> },
  ];

  const isActive = (href: string) => {
    if (href === '/expenses') return pathname === '/expenses';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/60 safe-area-bottom">
      <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-0.5 flex-1 relative
                transition-colors duration-200
                ${active 
                  ? 'text-indigo-600' 
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full" />
              )}
              
              <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'font-bold' : ''}`}>
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
