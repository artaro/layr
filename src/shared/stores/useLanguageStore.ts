import { create } from 'zustand';

export type Language = 'th' | 'en';

interface LanguageState {
  language: Language;
  _hydrated: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  /** Call once on mount to sync with localStorage (avoids hydration mismatch) */
  hydrate: () => void;
}

// Always start with 'th' on both server and client to avoid hydration mismatch.
// The real value from localStorage is loaded via hydrate() after mount.

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'th',
  _hydrated: false,
  hydrate: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('aomkeng_language') as Language | null;
    if (stored && (stored === 'th' || stored === 'en')) {
      set({ language: stored, _hydrated: true });
    } else {
      set({ _hydrated: true });
    }
  },
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aomkeng_language', lang);
    }
    set({ language: lang });
  },
  toggleLanguage: () =>
    set((state) => {
      const next = state.language === 'th' ? 'en' : 'th';
      if (typeof window !== 'undefined') {
        localStorage.setItem('aomkeng_language', next);
      }
      return { language: next };
    }),
}));
