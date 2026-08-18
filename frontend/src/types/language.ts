import { SupportedLanguage } from '../data/translations';

export type Language = SupportedLanguage;

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  glyph: string;
  subtext?: string;
  flagIcon?: string;
}
