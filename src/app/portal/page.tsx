'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, Layers } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLayerStore } from '@/features/portal/stores/useLayerStore';
import { useTranslation } from '@/shared/lib/i18n';
import LayerStack from '@/features/portal/components/LayerStack';

export default function PortalPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  const {
    layers,
    hasCompletedSetup,
    initLayers,
    completeSetup,
  } = useLayerStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Auth guard
  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/login');
    }
  }, [mounted, loading, user, router]);

  // Auto-init layers when user arrives
  useEffect(() => {
    if (mounted && !loading && user && layers.length === 0) {
      initLayers();
    }
  }, [mounted, loading, user, layers.length, initLayers]);

  // Already completed setup → go to expenses
  useEffect(() => {
    if (mounted && !loading && user && hasCompletedSetup) {
      router.push('/expenses');
    }
  }, [mounted, loading, user, hasCompletedSetup, router]);

  // Loading state
  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-background)]">
        <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  // Redirect in progress
  if (hasCompletedSetup) return null;

  const handleEnterApp = () => {
    completeSetup();
    router.push('/expenses');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 sm:px-6 flex items-center gap-2.5">
        <div className="w-8 h-8 flex items-center justify-center text-sm border-2 border-[var(--color-border)] shadow-[2px_2px_0px_0px_var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          🧱
        </div>
        <h1 className="text-lg font-bold text-[var(--color-text-primary)] font-[var(--font-brand)] tracking-widest uppercase">
          {t('app.name')}
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] font-[var(--font-brand)] tracking-widest uppercase">
            {t('portal.title')}
          </h1>
          <p className="text-sm sm:text-base font-bold text-[var(--color-text-secondary)] mt-1.5">
            {t('portal.subtitle')}
          </p>
        </div>

        {/* Layer visualization */}
        <div className="flex flex-col items-center gap-8">
          <LayerStack layers={layers} animate />

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-3">
            {/* Enter app button */}
            <button
              onClick={handleEnterApp}
              className="group flex items-center gap-2 px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] text-[var(--color-surface)] font-bold text-base border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] transition-all duration-300 active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_var(--color-border)] uppercase tracking-wider"
            >
              {t('portal.enterApp')}
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            {/* View layers button */}
            <button
              onClick={() => router.push('/expenses')}
              className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors uppercase tracking-wider"
            >
              <Layers size={14} />
              {t('portal.viewLayers')}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t-2 border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
        <p className="text-xs font-bold text-[var(--color-text-muted)] tracking-wider">
          {t('app.footer')}
        </p>
      </footer>
    </div>
  );
}
