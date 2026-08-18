import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageModal } from './LanguageModal';
import { cn } from '@/lib/utils';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  titleHi?: string;
  audioPromptHi?: string;
  audioPromptEn?: string;
  audioId?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  title,
  titleHi,
  audioPromptHi,
  audioPromptEn,
  audioId,
  className,
}) => {
  const { language, isHindi } = useLanguage();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const displayTitle = isHindi && titleHi ? titleHi : title || (isHindi ? 'Agri-Decide' : 'Agri-Decide');

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 bg-surface/95 backdrop-blur-md border-b border-outline-variant/60 shadow-level-1 transition-all',
          className
        )}
      >
        <div className="flex items-center gap-3">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="Go Back"
              className="flex items-center justify-center w-11 h-11 rounded-full text-on-surface hover:bg-surface-container active:scale-95 transition-all btn-tactile"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container text-on-primary-container shadow-sm">
              <span className="material-symbols-outlined text-[22px]">agriculture</span>
            </div>
          )}

          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-on-surface leading-tight">
              {displayTitle}
            </h1>
            <p className="text-[11px] text-on-surface-variant/80 font-medium leading-none hidden sm:block">
              {isHindi ? 'कृषि निर्णय सलाहकार' : 'AI Precision Farming'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Trigger */}
          <button
            onClick={() => setIsLangModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container-lowest text-xs font-bold text-on-surface hover:border-primary/60 transition-all btn-tactile"
            aria-label="Change language"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">language</span>
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </header>

      <LanguageModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
    </>
  );
};
