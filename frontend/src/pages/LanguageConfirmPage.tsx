import React, { useEffect, useState } from 'react';
import { SupportedLanguage, getTranslation } from '../data/translations';
import { triggerHaptic } from '../lib/utils';
import { speakText, stopSpeaking } from '../lib/speech';

interface LanguageConfirmPageProps {
  language: SupportedLanguage;
  onConfirm: () => void;
  onChangeLanguage: () => void;
}

export const LanguageConfirmPage: React.FC<LanguageConfirmPageProps> = ({
  language,
  onConfirm,
  onChangeLanguage,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Auto speak confirmation sentence
    const msg = getTranslation('confirmLangMessage', language);
    speakText(
      msg,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );

    return () => {
      stopSpeaking();
    };
  }, [language]);

  const handlePlayVoice = () => {
    triggerHaptic('light');
    const msg = getTranslation('confirmLangMessage', language);
    speakText(
      msg,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleYes = () => {
    stopSpeaking();
    triggerHaptic('success');
    onConfirm();
  };

  const handleChange = () => {
    stopSpeaking();
    triggerHaptic('light');
    onChangeLanguage();
  };

  const getLanguageDisplayName = (l: SupportedLanguage) => {
    switch (l) {
      case 'mr': return 'मराठी';
      case 'gu': return 'ગુજરાતી';
      case 'en': return 'English';
      default: return 'हिंदी';
    }
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between p-6 max-w-md mx-auto">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handleChange}
          className="flex items-center gap-1 text-sm font-semibold text-primary active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>{getTranslation('back', language)}</span>
        </button>
        <button
          onClick={handlePlayVoice}
          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border border-primary/30 transition-all ${
            isSpeaking ? 'bg-primary text-white animate-pulse' : 'bg-primary/10 text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-base">volume_up</span>
          <span>{getTranslation('listen', language)}</span>
        </button>
      </div>

      {/* Confirmation Hero Card */}
      <div className="my-auto text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center mx-auto text-primary shadow-inner">
          <span className="material-symbols-outlined text-5xl animate-bounce">check_circle</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold font-headline leading-tight">
            {getTranslation('confirmLangTitle', language)}
          </h2>
          <div className="inline-block bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-base font-bold text-primary">
            {getLanguageDisplayName(language)}
          </div>
          <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed px-4">
            {getTranslation('confirmLangMessage', language)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-6">
        <button
          onClick={handleYes}
          className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-bold text-base shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span>{getTranslation('confirmLangYes', language)}</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>

        <button
          onClick={handleChange}
          className="w-full py-3.5 px-6 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-semibold text-sm active:scale-[0.98]"
        >
          {getTranslation('confirmLangChange', language)}
        </button>
      </div>
    </div>
  );
};
