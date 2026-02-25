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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 sm:px-6 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-sm shadow-md shadow-indigo-200">
          🧱
        </div>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">
          {t('app.name')}
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('portal.title')}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">
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
              className="group flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl transition-all duration-300 active:scale-95"
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
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-500 transition-colors font-medium"
            >
              <Layers size={14} />
              {t('portal.viewLayers')}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs font-semibold text-gray-300">
          {t('app.footer')}
        </p>
      </footer>
    </div>
  );
}
