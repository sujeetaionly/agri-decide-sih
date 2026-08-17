import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface StickyActionBarProps {
  onBack?: () => void;
  onContinue: () => void;
  continueText?: string;
  continueTextHi?: string;
  backText?: string;
  backTextHi?: string;
  showBack?: boolean;
  continueDisabled?: boolean;
  className?: string;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  onBack,
  onContinue,
  continueText,
  continueTextHi,
  backText,
  backTextHi,
  showBack = true,
  continueDisabled = false,
  className,
}) => {
  const { isHindi } = useLanguage();

  const cText = isHindi ? (continueTextHi || 'आगे बढ़ें') : (continueText || 'Continue');
  const bText = isHindi ? (backTextHi || 'पीछे जाएं') : (backText || 'Back');

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 p-4 bg-surface/95 backdrop-blur-md border-t border-outline-variant/60 shadow-sticky-bottom',
        className
      )}
    >
      <div className="max-w-xl mx-auto flex items-center gap-3">
        {showBack && onBack && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            className="w-1/3 min-h-[56px] text-base md:text-lg"
          >
            {bText}
          </Button>
        )}

        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth={!showBack || !onBack}
          disabled={continueDisabled}
          onClick={onContinue}
          className="flex-1 min-h-[56px] text-base md:text-[18px] flex items-center justify-center gap-2"
        >
          <span>{cText}</span>
          <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
        </Button>
      </div>
    </div>
  );
};
