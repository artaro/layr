'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTranslation } from '@/shared/lib/i18n';
import { useLanguageStore } from '@/shared/stores/useLanguageStore';

interface AppHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function AppHeader({ onMenuClick, title }: AppHeaderProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : '??';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await signOut();
    router.push('/');
  };

  return (
    <header 
      className="fixed top-0 right-0 z-40 h-16 bg-[var(--color-surface)]/95 backdrop-blur-md border-b-2 border-[var(--color-border)] transition-all duration-300"
      style={{
        width: '100%',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto md:ml-[280px]">
        <div className="flex items-center gap-3">
          {/* Hamburger only on desktop — mobile uses BottomNav */}
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          {title && (
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] font-[var(--font-brand)] uppercase tracking-wider">
              {title}
            </h1>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 text-xs font-bold border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] flex items-center gap-1.5 bg-[var(--color-surface)]"
          >
            {language === 'th' ? '🇹🇭 TH' : '🇬🇧 EN'}
          </button>

          <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-accent)] rounded-full ring-2 ring-[var(--color-surface)]" />
          </button>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-9 h-9 text-sm font-bold text-[var(--color-text-inverse)] bg-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:shadow-[3px_3px_0px_0px_var(--color-primary)] transition-all cursor-pointer"
            >
              {userInitials}
            </button>

            {/* Profile dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-primary)] py-1 animate-fade-in">
                <div className="px-4 py-3 border-b-2 border-[var(--color-border)]">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {user?.email || 'User'}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {t('header.account')}
                  </p>
                </div>
                
                <div className="p-1">
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {t('header.profile')}
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('header.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
