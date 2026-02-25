'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/shared/stores/useLanguageStore';

/**
 * Client component that syncs the html lang attribute with the language store.
 * This enables CSS rules like html[lang="th"] to apply font switching.
 */
export default function LangSwitcher() {
  const language = useLanguageStore((s) => s.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
