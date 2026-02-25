'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar, AppHeader } from '@/shared/components/layout';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import GlobalModals from '@/shared/components/layout/GlobalModals';
import BottomNav from '@/shared/components/layout/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/login');
    }
  }, [mounted, loading, user, router]);

  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-background)]">
        <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin" />
        <p className="text-sm text-[var(--color-text-secondary)] font-medium">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main 
        className="flex-1 transition-all duration-300 ease-in-out w-full md:w-[calc(100%-280px)] md:ml-[280px]"
      >
        <AppHeader onMenuClick={() => setSidebarOpen(true)} />
        <div className="h-16" /> {/* Spacer for fixed header */}
        
        <div className="p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      <GlobalModals />
      <BottomNav />
    </div>
  );
}
