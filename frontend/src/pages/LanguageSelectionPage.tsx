import React, { useState } from 'react';
import { SupportedLanguage, getTranslation } from '../data/translations';
import { triggerHaptic } from '../lib/utils';
import { speakText, stopSpeaking } from '../lib/speech';

interface LanguageOption {
  code: SupportedLanguage;
  nativeName: string;
  glyph: string;
  audioLabel: string;
  sampleAudio: string;
  isRegionalDefault?: boolean;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'hi',
    nativeName: 'हिंदी',
    glyph: 'अ',
    audioLabel: 'सुनें',
    sampleAudio: 'नमस्ते किसान भाई, आपका कृषि-वाइज़ में स्वागत है।',
    isRegionalDefault: true,
  },
  {
    code: 'mr',
    nativeName: 'मराठी',
    glyph: 'म',
    audioLabel: 'ऐका',
    sampleAudio: 'नमस्कार शेतकरी मित्रांनो, कृषी-वाइज ॲपमध्ये आपले स्वागत आहे.',
    isRegionalDefault: true,
  },
  {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    glyph: 'ગ',
    audioLabel: 'સાંભળો',
    sampleAudio: 'નમસ્તે ખેડૂત મિત્રો, કૃષિ-વાઇઝમાં આપનું સ્વાગત છે.',
  },
  {
    code: 'raj',
    nativeName: 'राजस्थानी',
    glyph: 'रा',
    audioLabel: 'सुणो',
    sampleAudio: 'खम्मा घणी किसान भाई, आपरो कृषि-वाइज़ में स्वागत है।',
  },
  {
    code: 'en',
    nativeName: 'English',
    glyph: 'A',
    audioLabel: 'Listen',
    sampleAudio: 'Hello farmer friend, welcome to Krishi-Wise crop decision support.',
  },
];

interface LanguageSelectionPageProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onConfirm: () => void;
}

export const LanguageSelectionPage: React.FC<LanguageSelectionPageProps> = ({
  currentLanguage,
  onSelectLanguage,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<SupportedLanguage>(currentLanguage);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSelect = (lang: LanguageOption) => {
    triggerHaptic('medium');
    setSelected(lang.code);
    onSelectLanguage(lang.code);

    // Audio preview
    setIsPlayingAudio(true);
    speakText(
      lang.sampleAudio,
      lang.code,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const handleProceed = () => {
    stopSpeaking();
    triggerHaptic('success');
    onConfirm();
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between p-4 max-w-md mx-auto">
      
      {/* Top Header */}
      <div className="pt-3 pb-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">translate</span>
            <h1 className="text-xl font-bold font-headline">
              {getTranslation('chooseLanguageTitle', selected)}
            </h1>
          </div>
          {isPlayingAudio && (
            <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full animate-pulse">
              <span className="material-symbols-outlined text-sm">volume_up</span>
              {getTranslation('speaking', selected)}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {getTranslation('chooseLanguageSub', selected)}
        </p>
      </div>

      {/* Regional Suggested Badge */}
      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
        <span className="material-symbols-outlined text-base">near_me</span>
        <span>स्थानिक भाषा (महाराष्ट्र): मराठी आणि हिंदी</span>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-2 gap-2.5 my-auto py-1">
        {LANGUAGES.slice(0, 4).map((lang) => {
          const isSelected = selected === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang)}
              className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all active:scale-[0.97] cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/30'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1E231B] hover:border-primary/40'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-xs">check</span>
                </div>
              )}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-xl font-extrabold mb-1.5 ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200'
                }`}
              >
                {lang.glyph}
              </div>
              <span className="text-base font-bold tracking-wide">
                {lang.nativeName}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-primary mt-1 font-semibold">
                <span className="material-symbols-outlined text-xs">volume_up</span>
                <span>{lang.audioLabel}</span>
              </div>
            </button>
          );
        })}

        {/* 5th Option: English as a comfortable wide tile */}
        {(() => {
          const eng = LANGUAGES[4];
          const isSelected = selected === eng.code;
          return (
            <button
              key={eng.code}
              type="button"
              onClick={() => handleSelect(eng)}
              className={`col-span-2 relative flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all active:scale-[0.98] cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/30'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1E231B] hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-extrabold ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200'
                  }`}
                >
                  {eng.glyph}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold tracking-wide">{eng.nativeName}</div>
                  <div className="text-[11px] text-stone-500">Universal fallback</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[11px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-xs">volume_up</span>
                  <span>{eng.audioLabel}</span>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow">
                    <span className="material-symbols-outlined text-xs">check</span>
                  </div>
                )}
              </div>
            </button>
          );
        })()}
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="pt-2 pb-5">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-extrabold text-base shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{getTranslation('getStarted', selected)}</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
