import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic } from '../../lib/utils';
import { speakText, stopSpeaking } from '../../lib/speech';

interface HomeTopAppBarProps {
  onOpenLanguagePage?: () => void;
}

export const HomeTopAppBar: React.FC<HomeTopAppBarProps> = ({
  onOpenLanguagePage,
}) => {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAudioToggle = () => {
    triggerHaptic('light');
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const msg = `${t('appName')}। ${t('homeHeroTitle')} ${t('homeHeroSub')}`;
      speakText(
        msg,
        language,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        
        {/* App Title & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">agriculture</span>
          </div>
          <span className="font-bold text-lg text-primary tracking-tight font-headline">
            {t('appName')}
          </span>
        </div>

        {/* Right Section: Single Network Indicator & Audio Button */}
        <div className="flex items-center gap-2">
          {/* Single Top Network Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] font-semibold text-stone-600 dark:text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ऑनलाइन</span>
          </div>

          {/* Audio TTS Button */}
          <button
            onClick={handleAudioToggle}
            className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all active:scale-95 ${
              isSpeaking
                ? 'bg-primary text-white border-primary shadow-sm animate-pulse'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-primary/10 hover:text-primary'
            }`}
            title={t('listen')}
          >
            <span className="material-symbols-outlined text-xl">
              {isSpeaking ? 'volume_up' : 'volume_up'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
