'use client';

import React, { useEffect, useRef } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/query';
import GlobalLoader from '@/shared/components/GlobalLoader';
import { useUIStore } from '@/shared/stores';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const TOAST_DURATION_MS = 4000;

function Toast() {
  const { snackbar, hideSnackbar } = useUIStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-close after TOAST_DURATION_MS
  useEffect(() => {
    if (snackbar.open) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(hideSnackbar, TOAST_DURATION_MS);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [snackbar.open, snackbar.message, hideSnackbar]);

  if (!snackbar.open) return null;

  const config = {
    error:   { bg: 'bg-red-600',    icon: <AlertCircle size={16} />,    bar: 'bg-red-400' },
    success: { bg: 'bg-emerald-600', icon: <CheckCircle size={16} />,    bar: 'bg-emerald-400' },
    info:    { bg: 'bg-indigo-600',  icon: <Info size={16} />,           bar: 'bg-indigo-400' },
    warning: { bg: 'bg-amber-500',   icon: <AlertTriangle size={16} />,  bar: 'bg-amber-300' },
  };

  const { bg, icon, bar } = config[snackbar.severity as keyof typeof config] || config.info;

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[9999]
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl shadow-black/15
        text-white min-w-[260px] max-w-[420px]
        animate-in slide-in-from-top-2 fade-in duration-200
        ${bg}
      `}
    >
      <span className="flex-shrink-0 opacity-90">{icon}</span>
      <span className="text-sm font-medium flex-1">{snackbar.message}</span>
      <button
        onClick={hideSnackbar}
        className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
      >
        <X size={14} />
      </button>

      {/* Auto-close progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 rounded-b-xl ${bar} opacity-60`}
        style={{
          animation: `shrink ${TOAST_DURATION_MS}ms linear forwards`,
        }}
      />
    </div>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalLoader />
      {children}
      <Toast />
    </QueryClientProvider>
  );
}
