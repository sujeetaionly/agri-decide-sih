export type Language = 'hi' | 'en' | 'mr' | 'gu' | 'pa' | 'bn';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  subtext: string;
  flagIcon?: string;
}

export interface TranslationDictionary {
  [key: string]: {
    hi: string;
    en: string;
    mr?: string;
    gu?: string;
  };
}
