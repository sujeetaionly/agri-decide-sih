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
      case 'raj': return 'राजस्थानी';
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
          className="flex items-center gap-1 text-sm font-semibold text-emerald-800 dark:text-emerald-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>{getTranslation('back', language)}</span>
        </button>
        <button
          onClick={handlePlayVoice}
          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 transition-all cursor-pointer ${
            isSpeaking ? 'bg-emerald-700 text-white animate-pulse' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200'
          }`}
        >
          <span className="material-symbols-outlined text-base">volume_up</span>
          <span>{getTranslation('listen', language)}</span>
        </button>
      </div>

      {/* Confirmation Hero Card */}
      <div className="my-auto w-full bg-white dark:bg-[#1E231B] border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-7 shadow-md text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300 shadow-sm">
          <span className="material-symbols-outlined text-3xl [font-variation-settings:'FILL'_1]">check_circle</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] tracking-tight">
            {getTranslation('confirmLangTitle', language)}
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-bold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{getLanguageDisplayName(language)}</span>
          </div>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-medium px-2">
          {getTranslation('confirmLangMessage', language)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-6">
        <button
          onClick={handleYes}
          className="w-full py-4 px-6 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{getTranslation('confirmLangYes', language)}</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>

        <button
          onClick={handleChange}
          className="w-full py-3.5 px-6 rounded-full bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-600/40 text-stone-800 dark:text-stone-200 font-bold text-sm shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base text-stone-500">translate</span>
          <span>{getTranslation('confirmLangChange', language)}</span>
        </button>
      </div>
    </div>
  );
};
