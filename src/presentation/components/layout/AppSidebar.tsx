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
import { APP_NAME } from '@/lib/constants';
import { useTranslation } from '@/lib/i18n';
import { useUIStore } from '@/presentation/stores';

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
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity md:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-xl shadow-lg shadow-primary/20">
                💜
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight text-gray-900">
                  {APP_NAME}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  {t('app.subtitle')}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="h-px bg-gray-100 mx-6 mb-6" />

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {/* Add New Button */}
            <div className="mb-3">
              <button
                onClick={openTransactionModal}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md shadow-indigo-200 group"
              >
                <Plus size={20} />
                <span>{t('nav.addNew')}</span>
              </button>
              <button
                onClick={() => { openImportModal(); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 mt-1 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 text-sm"
              >
                <Upload size={16} className="text-gray-400" />
                <span>{t('nav.uploadStatement')}</span>
              </button>
            </div>

            <div className="h-px bg-gray-100 mx-2 mb-2" />

            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} 
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100/50 text-center">
              <div className="text-2xl mb-2">🚀</div>
              <p className="text-xs font-semibold text-indigo-900/60">
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
