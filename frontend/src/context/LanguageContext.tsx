import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, translations, getTranslation } from '../data/translations';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  glyph: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', glyph: 'अ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', glyph: 'म' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', glyph: 'ગ' },
  { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी', glyph: 'रा' },
  { code: 'en', name: 'English', nativeName: 'English', glyph: 'A' },
];

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  isHindi: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('krishi_lang');
    return (saved as SupportedLanguage) || 'hi';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('krishi_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isHindi: language === 'hi' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
