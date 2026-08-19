import React, { useState } from 'react';
import { SupportedLanguage, getTranslation } from '../data/translations';
import { triggerHaptic } from '../lib/utils';
import { speakText, stopSpeaking } from '../lib/speech';

interface LanguageOption {
  code: SupportedLanguage;
  nativeName: string;
  englishName: string;
  glyph: string;
  audioLabel: string;
  sampleAudio: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    glyph: 'अ',
    audioLabel: 'सुनें',
    sampleAudio: 'नमस्ते किसान भाई, आपका फसल-दिशा में स्वागत है।',
  },
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    glyph: 'A',
    audioLabel: 'Listen',
    sampleAudio: 'Hello farmer friend, welcome to Fasal Disha crop decision support.',
  },
  {
    code: 'mr',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    glyph: 'म',
    audioLabel: 'ऐका',
    sampleAudio: 'नमस्कार शेतकरी मित्रांनो, फसल-दिशा ॲपमध्ये आपले स्वागत आहे.',
  },
  {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    englishName: 'Gujarati',
    glyph: 'ગ',
    audioLabel: 'સાંભળો',
    sampleAudio: 'નમસ્તે ખેડૂત મિત્રો, ફસલ-દિશામાં આપનું સ્વાગત છે.',
  },
  {
    code: 'raj',
    nativeName: 'राजस्थानी',
    englishName: 'Rajasthani',
    glyph: 'रा',
    audioLabel: 'सुणो',
    sampleAudio: 'खम्मा घणी किसान भाई, आपरो फसल-दिशा में स्वागत है।',
  },
];

interface LanguageSelectionPageProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onConfirm: () => void;
}

export const LanguageSelectionPage: React.FC<LanguageSelectionPageProps> = ({
  currentLanguage: _currentLanguage,
  onSelectLanguage,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<SupportedLanguage | null>(null);
  const [playingCode, setPlayingCode] = useState<string | null>(null);

  const handleSelect = (lang: LanguageOption) => {
    triggerHaptic('medium');
    setSelected(lang.code);
    onSelectLanguage(lang.code);
  };

  const handlePlaySample = (lang: LanguageOption, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');

    if (playingCode === lang.code) {
      stopSpeaking();
      setPlayingCode(null);
      return;
    }

    setPlayingCode(lang.code);
    speakText(
      lang.sampleAudio,
      lang.code,
      () => setPlayingCode(lang.code),
      () => setPlayingCode(null),
      () => setPlayingCode(null)
    );
  };

  const handleHeaderAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');

    const effectiveLang = selected || 'en';
    const headerText = effectiveLang === 'en'
      ? 'Which language do you prefer? Choose your preferred language to continue using Fasal Disha.'
      : 'आप कौन सी भाषा पसंद करते हैं? फसल-दिशा का उपयोग करने के लिए अपनी पसंदीदा भाषा चुनें।';

    if (playingCode === 'header') {
      stopSpeaking();
      setPlayingCode(null);
      return;
    }

    setPlayingCode('header');
    speakText(
      headerText,
      effectiveLang,
      () => setPlayingCode('header'),
      () => setPlayingCode(null),
      () => setPlayingCode(null)
    );
  };

  const handleProceed = () => {
    if (!selected) return;
    stopSpeaking();
    triggerHaptic('success');
    onConfirm();
  };

  const titleText = selected
    ? getTranslation('chooseLanguageTitle', selected)
    : 'Which language do you prefer?';

  const subText = selected
    ? getTranslation('chooseLanguageSub', selected)
    : 'Choose your preferred language to continue using Krishi-Wise.';

  const buttonText = selected
    ? getTranslation('getStarted', selected)
    : 'Get Started';

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between p-5 max-w-md mx-auto">
      
      {/* Header - Spacious, Centered & Clean */}
      <header className="pt-6 pb-2 text-center space-y-2.5">
        <div className="w-14 h-14 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
          <span className="material-symbols-outlined text-[28px]">language</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] tracking-tight flex items-center justify-center gap-2">
            <span>{titleText}</span>
          </h1>

          <button
            type="button"
            onClick={handleHeaderAudio}
            aria-label="Listen to heading"
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-all cursor-pointer ${
              playingCode === 'header'
                ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 animate-pulse'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">volume_up</span>
          </button>

          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium max-w-xs mx-auto leading-relaxed">
            {subText}
          </p>
        </div>
      </header>

      {/* Language Options - 2x2 Square Cards Grid + English Full Width */}
      <div className="grid grid-cols-2 gap-3 my-auto py-2">
        {/* 4 Square Indic Cards */}
        {[
          { code: 'hi', nativeName: 'हिन्दी', glyph: 'अ', audioLabel: 'सुनें', sampleAudio: 'नमस्ते किसान भाई, आपका कृषि-वाइज़ में स्वागत है।' },
          { code: 'mr', nativeName: 'मराठी', glyph: 'म', audioLabel: 'ऐका', sampleAudio: 'नमस्कार शेतकरी मित्रांनो, कृषी-वाइज ॲपमध्ये आपले स्वागत आहे।' },
          { code: 'gu', nativeName: 'ગુજરાતી', glyph: 'ગ', audioLabel: 'સાંભળો', sampleAudio: 'નમસ્તે ખેડૂત મિત્રો, કૃષિ-વાઇઝમાં આપનું સ્વાગત છે।' },
          { code: 'raj', nativeName: 'राजस्थानी', glyph: 'रा', audioLabel: 'सुणो', sampleAudio: 'खम्मा घणी किसान भाई, आपरो कृषि-वाइज़ में स्वागत है।' },
        ].map((lang) => {
          const isSelected = selected === lang.code;
          const isItemPlaying = playingCode === lang.code;

          return (
            <div
              key={lang.code}
              onClick={() => handleSelect(lang as any)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all active:scale-[0.97] cursor-pointer shadow-sm ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-600/30'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1E231B] hover:border-emerald-500/40'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-xs">check</span>
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black mb-2 shadow-sm ${
                  isSelected
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                }`}
              >
                {lang.glyph}
              </div>

              <span className="text-base font-bold tracking-wide font-headline text-[#1A1C18] dark:text-[#E2E3DC]">
                {lang.nativeName}
              </span>

              <button
                type="button"
                onClick={(e) => handlePlaySample(lang as any, e)}
                className={`flex items-center gap-1 text-xs mt-1.5 font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  isItemPlaying
                    ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 animate-pulse'
                    : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50'
                }`}
              >
                <span className="material-symbols-outlined text-xs">volume_up</span>
                <span>{lang.audioLabel}</span>
              </button>
            </div>
          );
        })}

        {/* 5th Option: English as a comfortable wide tile */}
        {(() => {
          const eng = { code: 'en', nativeName: 'English', glyph: 'A', audioLabel: 'Listen', sampleAudio: 'Hello farmer friend, welcome to Fasal Disha crop decision support.' };
          const isSelected = selected === eng.code;
          const isItemPlaying = playingCode === eng.code;

          return (
            <div
              key={eng.code}
              onClick={() => handleSelect(eng as any)}
              className={`col-span-2 relative flex items-center justify-between px-5 py-3.5 rounded-3xl border-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-600/30'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1E231B] hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black shadow-sm ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  {eng.glyph}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold tracking-wide text-[#1A1C18] dark:text-[#E2E3DC]">{eng.nativeName}</div>
                  <div className="text-[11px] text-stone-500">Universal fallback</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handlePlaySample(eng as any, e)}
                  className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    isItemPlaying
                      ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 animate-pulse'
                      : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">volume_up</span>
                  <span>{eng.audioLabel}</span>
                </button>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow">
                    <span className="material-symbols-outlined text-xs">check</span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Bottom Action Button - Disabled & Greyed Out when unselected */}
      <div className="pt-2 pb-4">
        <button
          type="button"
          onClick={handleProceed}
          disabled={!selected}
          className={`w-full py-4 px-6 rounded-full font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
            selected
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl active:scale-[0.98] cursor-pointer'
              : 'bg-stone-300 dark:bg-stone-800 text-stone-500 dark:text-stone-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>{buttonText}</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
