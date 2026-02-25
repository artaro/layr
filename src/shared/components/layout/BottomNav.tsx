'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ArrowLeftRight, Landmark, Ellipsis, Plus, Receipt, Upload } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';
import { useUIStore } from '@/shared/stores';

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { openTransactionModal, openImportModal } = useUIStore();
  const [addOpen, setAddOpen] = useState(false);

  const leftItems: NavItem[] = [
    { href: '/expenses', labelKey: 'nav.dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/expenses/transactions', labelKey: 'nav.transactions', icon: <ArrowLeftRight size={20} /> },
  ];

  const rightItems: NavItem[] = [
    { href: '/expenses/accounts', labelKey: 'nav.accounts', icon: <Landmark size={20} /> },
    { href: '/expenses/more', labelKey: 'nav.more', icon: <Ellipsis size={20} /> },
  ];

  const isActive = (href: string) => {
    if (href === '/expenses') return pathname === '/expenses';
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`
          flex flex-col items-center justify-center gap-0.5 flex-1 relative
          transition-colors duration-200
          ${active 
            ? 'text-[var(--color-primary)]' 
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          }
        `}
      >
        {active && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[var(--color-primary)]" />
        )}
        <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
          {item.icon}
        </div>
        <span className={`text-[10px] font-semibold ${active ? 'font-bold' : ''}`}>
          {t(item.labelKey)}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Backdrop for add menu */}
      {addOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setAddOpen(false)}
        />
      )}

      {/* Pop-up actions */}
      {addOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 md:hidden flex flex-col items-center gap-2 animate-fade-in">
          <button
            onClick={() => { openImportModal(); setAddOpen(false); }}
            className="flex items-center gap-3 bg-[var(--color-surface)] pl-4 pr-5 py-2.5 border-2 border-[var(--color-border)] shadow-[3px_3px_0px_0px_var(--color-primary)] hover:shadow-[5px_5px_0px_0px_var(--color-primary)] transition-all"
          >
            <div className="w-8 h-8 bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center">
              <Upload size={16} />
            </div>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">{t('nav.uploadStatement')}</span>
          </button>
          <button
            onClick={() => { openTransactionModal(); setAddOpen(false); }}
            className="flex items-center gap-3 bg-[var(--color-surface)] pl-4 pr-5 py-2.5 border-2 border-[var(--color-border)] shadow-[3px_3px_0px_0px_var(--color-primary)] hover:shadow-[5px_5px_0px_0px_var(--color-primary)] transition-all"
          >
            <div className="w-8 h-8 bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center">
              <Receipt size={16} />
            </div>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">{t('nav.addManually')}</span>
          </button>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--color-surface)]/95 backdrop-blur-xl border-t-2 border-[var(--color-border)] safe-area-bottom">
        <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto">
          {/* Left items */}
          {leftItems.map(renderNavItem)}

          {/* Center Add Button */}
          <div className="flex items-center justify-center flex-1">
            <button
              onClick={() => setAddOpen(!addOpen)}
              className={`w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 -mt-5 border-2 ${
                addOpen 
                  ? 'bg-[var(--color-text-muted)] border-[var(--color-text-muted)] text-[var(--color-text-inverse)] rotate-45' 
                  : 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-text-inverse)] hover:shadow-[4px_4px_0px_0px_var(--color-primary)] hover:scale-105'
              }`}
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* Right items */}
          {rightItems.map(renderNavItem)}
        </div>
      </nav>
    </>
  );
}
