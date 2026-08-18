import React from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../data/translations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();

  if (!isOpen) return null;

  const handleSelect = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#1E231B] rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-2xl">language</span>
            <h3 className="text-xl font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC]">
              {t('chooseLanguageTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto">
          {LANGUAGE_OPTIONS.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all text-center ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm ring-2 ring-primary/30'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1E231B] text-stone-800 dark:text-stone-200'
                }`}
              >
                <span className="text-2xl font-bold mb-1">{opt.glyph}</span>
                <span className="text-base font-bold">{opt.nativeName}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-sm"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
