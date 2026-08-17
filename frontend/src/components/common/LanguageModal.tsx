import React from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Language } from '@/types/language';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, isHindi } = useLanguage();

  if (!isOpen) return null;

  const handleSelect = (langCode: Language) => {
    setLanguage(langCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-level-3 border border-outline-variant p-6 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[28px]">language</span>
            <h3 className="text-xl font-bold text-on-surface">
              {isHindi ? 'भाषा चुनें' : 'Select Language'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {LANGUAGE_OPTIONS.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all text-left btn-tactile ${
                  isSelected
                    ? 'border-primary bg-primary-container/10 text-primary font-bold shadow-sm ring-1 ring-primary/20'
                    : 'border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 text-on-surface'
                }`}
              >
                <div>
                  <div className="text-base font-bold">{opt.nativeName}</div>
                  <div className="text-xs text-on-surface-variant/80">{opt.name} • {opt.subtext}</div>
                </div>
                {isSelected ? (
                  <span className="material-symbols-outlined text-primary fill text-[24px]">
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-outline text-[24px]">
                    radio_button_unchecked
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <Button variant="outline" size="md" fullWidth onClick={onClose}>
            {isHindi ? 'बंद करें' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  );
};
