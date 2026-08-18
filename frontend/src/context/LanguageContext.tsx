import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LanguageOption } from '@/types/language';
import { translations } from '@/data/translations';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', subtext: 'हिंदी में प्रयोग करें' },
  { code: 'en', name: 'English', nativeName: 'English', subtext: 'Use in English' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', subtext: 'मराठी मध्ये वापरा' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', subtext: 'ગુજરાતીમાં વાપરો' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', subtext: 'ਪੰਜਾਬੀ ਵਿੱਚ ਵਰਤੋਂ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', subtext: 'বাংলায় ব্যবহার করুন' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
  isHindi: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('krishi_lang');
    return (saved as Language) || 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('krishi_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof typeof translations): string => {
    const entry = translations[key];
    if (!entry) return key;
    if (language === 'hi') return entry.hi || entry.en;
    if (language === 'en') return entry.en;
    return entry.hi || entry.en;
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
