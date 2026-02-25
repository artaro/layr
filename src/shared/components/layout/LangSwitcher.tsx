'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/shared/stores/useLanguageStore';

/**
 * Client component that:
 * 1. Hydrates the language store from localStorage AFTER mount (prevents hydration mismatch)
 * 2. Syncs the <html lang> attribute whenever language changes
 */
export default function LangSwitcher() {
  const language = useLanguageStore((s) => s.language);
  const hydrate = useLanguageStore((s) => s.hydrate);

  // Hydrate from localStorage after mount — server always renders 'th'
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Sync <html lang> attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
