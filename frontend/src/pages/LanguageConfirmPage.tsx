import React, { useEffect, useState } from 'react';
import { SupportedLanguage, getTranslation, LANGUAGE_REGISTRY } from '../data/translations';
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

  const currentLangMeta = (LANGUAGE_REGISTRY as any)[language];
  const displayName = currentLangMeta?.nativeName || 'हिन्दी';
  const glyph = currentLangMeta?.glyph || 'अ';

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between p-6 max-w-md mx-auto">
      
      {/* Top Bar with Clean Spacing */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <button
          onClick={handleChange}
          className="flex items-center gap-1 text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-primary active:scale-95 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>{getTranslation('back', language)}</span>
        </button>

        <button
          onClick={handlePlayVoice}
          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
            isSpeaking
              ? 'bg-primary text-white border-primary animate-pulse shadow-md'
              : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
          }`}
        >
          <span className="material-symbols-outlined text-base">volume_up</span>
          <span>{getTranslation('listen', language)}</span>
        </button>
      </div>

      {/* Confirmation Hero Card with Strong Visual Hierarchy */}
      <div className="my-auto w-full bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm text-center space-y-5">
        {/* Native Script Glyph instead of generic tick */}
        <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto text-3xl font-extrabold shadow-md mb-1">
          {glyph}
        </div>

        <div className="space-y-2.5">
          <h2 className="text-2xl font-black font-headline text-on-surface-light dark:text-on-surface-dark tracking-tight">
            {getTranslation('confirmLangTitle', language)}
          </h2>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-100 dark:bg-stone-800 text-on-surface-light dark:text-on-surface-dark rounded-full text-sm font-bold border border-stone-200 dark:border-stone-700">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>{displayName}</span>
          </div>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-medium px-2">
          {getTranslation('confirmLangMessage', language)}
        </p>
      </div>

      {/* Action Buttons with Sleek Width & Safe Area Inset */}
      <div className="space-y-3 max-w-[290px] w-full mx-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleYes}
          className="w-full py-3.5 px-6 rounded-full bg-primary text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <span>{getTranslation('confirmLangYes', language)}</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>

        <button
          type="button"
          onClick={handleChange}
          className="w-full py-3 px-6 rounded-full bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs shadow-2xs hover:bg-stone-50 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-base text-primary">translate</span>
          <span>{getTranslation('confirmLangChange', language)}</span>
        </button>
      </div>
    </div>
  );
};
