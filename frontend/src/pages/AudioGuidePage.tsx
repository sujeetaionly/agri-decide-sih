import React, { useState, useEffect } from 'react';
import { SupportedLanguage, getTranslation } from '../data/translations';
import { triggerHaptic } from '../lib/utils';
import { speakText, stopSpeaking } from '../lib/speech';

interface AudioGuidePageProps {
  language: SupportedLanguage;
  onProceed: () => void;
}

export const AudioGuidePage: React.FC<AudioGuidePageProps> = ({
  language,
  onProceed,
}) => {
  const [hasTestedAudio, setHasTestedAudio] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSource, setSpeakingSource] = useState<'intro' | 'test' | null>(null);

  // Automatically play voice guidance onboarding on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePlayIntroAudio();
    }, 400);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [language]);

  const handlePlayIntroAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');

    if (speakingSource === 'intro' && isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setSpeakingSource(null);
      return;
    }

    const introMsg = getTranslation('audioGuideIntroSpeech', language) || getTranslation('audioGuideLine1', language);
    setIsSpeaking(true);
    setSpeakingSource('intro');

    speakText(
      introMsg,
      language,
      () => {
        setIsSpeaking(true);
        setSpeakingSource('intro');
      },
      () => {
        setIsSpeaking(false);
        setSpeakingSource(null);
      },
      () => {
        setIsSpeaking(false);
        setSpeakingSource(null);
      }
    );
  };

  const handleTestAudio = () => {
    triggerHaptic('medium');
    const msg = getTranslation('audioGuideSuccess', language);

    setIsSpeaking(true);
    setSpeakingSource('test');
    setHasTestedAudio(true);

    speakText(
      msg,
      language,
      () => {
        setIsSpeaking(true);
        setSpeakingSource('test');
      },
      () => {
        setIsSpeaking(false);
        setSpeakingSource(null);
      },
      () => {
        setIsSpeaking(false);
        setSpeakingSource(null);
      }
    );
  };

  const handleContinue = () => {
    if (!hasTestedAudio) return;
    stopSpeaking();
    triggerHaptic('success');
    onProceed();
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between p-6 max-w-md mx-auto">
      
      {/* Top Header with Title & Speaker Button & Clean Spacing */}
      <header className="pt-1 pb-2 space-y-1.5 text-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-black font-headline text-on-surface-light dark:text-on-surface-dark tracking-tight">
            {getTranslation('audioGuideTitle', language)}
          </h1>

          <button
            type="button"
            onClick={handlePlayIntroAudio}
            aria-label="Listen to instructions"
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-all cursor-pointer border ${
              speakingSource === 'intro' && isSpeaking
                ? 'text-primary bg-primary/15 border-primary/40 animate-pulse'
                : 'text-primary border-primary/20 hover:bg-primary/5'
            }`}
          >
            <span className="material-symbols-outlined text-xl">volume_up</span>
          </button>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium max-w-xs mx-auto leading-relaxed">
          {getTranslation('audioGuideLine1', language)}
        </p>
      </header>

      {/* Center Interactive Speaker Button - Direct on surface without artificial box */}
      <div className="my-auto text-center space-y-4">
        <button
          type="button"
          onClick={handleTestAudio}
          aria-label="Test Speaker Audio"
          className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto transition-all cursor-pointer shadow-md active:scale-95 ${
            speakingSource === 'test' && isSpeaking
              ? 'bg-primary text-white border-primary ring-4 ring-primary/20 scale-105 animate-pulse shadow-lg'
              : hasTestedAudio
              ? 'bg-primary/10 border-primary text-primary hover:bg-primary/15'
              : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/15 hover:border-primary'
          }`}
        >
          <span className="material-symbols-outlined text-4xl">
            volume_up
          </span>
        </button>

        <p className="text-sm font-bold font-headline text-on-surface-light dark:text-on-surface-dark tracking-wide">
          {speakingSource === 'test' && isSpeaking
            ? 'आवाज बज रही है...'
            : hasTestedAudio
            ? 'बहुत बढ़िया! आवाज सही चल रही है'
            : 'दबाकर आवाज की जांच करें'}
        </p>
      </div>

      {/* Bottom Action Button with Sleek Width & Safe Area Padding */}
      <div className="pb-[max(1rem,env(safe-area-inset-bottom))] flex justify-center">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!hasTestedAudio}
          className={`max-w-[280px] w-full py-3.5 px-8 rounded-full font-extrabold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            hasTestedAudio
              ? 'bg-primary text-white shadow-md active:scale-95 cursor-pointer'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed shadow-none'
          }`}
        >
          <span>{getTranslation('audioGuideProceed', language)}</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
