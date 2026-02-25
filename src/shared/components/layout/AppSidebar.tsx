'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Receipt, 
  Landmark, 
  Ellipsis,
  X,
  Plus,
  Upload
} from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';
import { useUIStore } from '@/shared/stores';

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

const AppSidebar = ({ open, onClose }: AppSidebarProps) => {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const { t } = useTranslation();
  const { openTransactionModal, openImportModal } = useUIStore();

  const navItems = [
    { label: t('nav.dashboard'), icon: LayoutDashboard, href: '/expenses', emoji: '📊' },
    { label: t('nav.transactions'), icon: Receipt, href: '/expenses/transactions', emoji: '💸' },
    { label: t('nav.accounts'), icon: Landmark, href: '/expenses/accounts', emoji: '🏦' },
    { label: t('nav.more'), icon: Ellipsis, href: '/expenses/more', emoji: '⚙️' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-[var(--color-surface)] border-r-2 border-[var(--color-border)] transition-transform duration-300 ease-in-out md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-primary)] border-2 border-[var(--color-primary)] flex items-center justify-center text-lg font-bold text-[var(--color-text-inverse)]">
                💰
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight text-[var(--color-text-primary)] font-[var(--font-brand)] uppercase tracking-wider">
                  <span className="animate-blink-char">อ</span>
                  <span className="text-[var(--color-primary)]">อม</span>
                  เก่ง
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                  {t('app.subtitle')}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="h-0.5 bg-[var(--color-border)] mx-6 mb-6" />

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {/* Add New Button */}
            <div className="mb-3">
              <button
                onClick={openTransactionModal}
                className="brutal-btn w-full flex items-center gap-3 px-4 py-3 text-sm"
              >
                <Plus size={20} />
                <span>{t('nav.addNew')}</span>
              </button>
              <button
                onClick={() => { openImportModal(); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 mt-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-primary)] transition-all duration-200 text-sm"
              >
                <Upload size={16} />
                <span>{t('nav.uploadStatement')}</span>
              </button>
            </div>

            <div className="h-0.5 bg-[var(--color-border)] mx-2 mb-2" />

            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 px-4 py-3 transition-all duration-200 border-2 ${
                    isActive 
                      ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)] font-bold shadow-[2px_2px_0px_0px_var(--color-primary)]' 
                      : 'border-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'} 
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-[var(--color-primary)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-6">
            <div className="p-4 bg-[var(--color-surface-2)] border-2 border-[var(--color-border)] text-center">
              <div className="text-2xl mb-2">🚀</div>
              <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider font-[var(--font-brand)]">
                {t('nav.proComingSoon')}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
