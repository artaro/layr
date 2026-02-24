import { create } from 'zustand';

export type Language = 'th' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('layr_language') as Language) || 'th';
  }
  return 'th';
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: getInitialLanguage(),
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('layr_language', lang);
    }
    set({ language: lang });
  },
  toggleLanguage: () =>
    set((state) => {
      const next = state.language === 'th' ? 'en' : 'th';
      if (typeof window !== 'undefined') {
        localStorage.setItem('layr_language', next);
      }
      return { language: next };
    }),
}));
