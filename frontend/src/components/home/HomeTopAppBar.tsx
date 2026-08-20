import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic } from '../../lib/utils';
import { speakText, stopSpeaking } from '../../lib/speech';

interface HomeTopAppBarProps {
  onOpenLanguagePage?: () => void;
  audioText?: string;
  onAudioClick?: () => void;
}

export const HomeTopAppBar: React.FC<HomeTopAppBarProps> = ({
  onOpenLanguagePage,
  audioText,
  onAudioClick,
}) => {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAudioToggle = () => {
    triggerHaptic('light');
    if (onAudioClick) {
      onAudioClick();
      return;
    }
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      let msg = audioText || 'नमस्ते किसान भाई। फसल-दिशा में आपका स्वागत है। अपनी जमीन के लिए सबसे उपयुक्त फसल और मुनाफा जानने के लिए नीचे दिए गए बटन को दबाएं।';
      if (!audioText) {
        if (language === 'mr') {
          msg = 'नमस्कार शेतकरी बंधूंनो. पीक दिशा मध्ये आपले स्वागत आहे. आपल्या शेतीसाठी योग्य पीक सल्ला मिळवण्यासाठी खालील बटण दाबा.';
        } else if (language === 'gu') {
          msg = 'નમસ્તે ખેડૂત મિત્રો. પાક દિશામાં આપનું સ્વાગત છે. યોગ્ય પાક સલાહ મેળવવા માટે નીચેનું બટન દબાવો.';
        } else if (language === 'raj') {
          msg = 'राम राम किसान भाई। फसल-दिशा में थारो स्वागत है। आपरी जमीन सारू सही फसल और मुनाफो जाणबा सारू नीचे दियो बटन दबाओ।';
        } else if (language === 'en') {
          msg = 'Welcome to Fasal-Disha. Tap the button below to get crop recommendations tailored for your farm.';
        }
      }
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
    <header className="sticky top-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-xl border-b border-stone-300/80 dark:border-stone-700/80 px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-3 shadow-xs">
      <div className="flex items-center justify-between max-w-md mx-auto">
        
        {/* Exact Brand Branding */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <span className="material-symbols-outlined text-2xl">agriculture</span>
          </div>
          <div>
            <span className="font-black text-lg font-headline text-on-surface-light dark:text-on-surface-dark tracking-tight block">
              {t('appName')}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">
              {t('appTagline')}
            </span>
          </div>
        </div>

        {/* Right Section: Audio TTS Button */}
        <button
          type="button"
          onClick={handleAudioToggle}
          aria-label={t('listen')}
          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
            isSpeaking
              ? 'bg-primary text-white border-primary animate-pulse shadow-md'
              : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
          }`}
        >
          <span className="material-symbols-outlined text-base">volume_up</span>
          <span>{t('listen')}</span>
        </button>
      </div>
    </header>
  );
};
