import React, { useState, useMemo } from 'react';
import { SupportedLanguage, getTranslation, getLanguagesForState, LanguageMeta, matchLanguage } from '../data/translations';
import { triggerHaptic } from '../lib/utils';
import { speakText, stopSpeaking } from '../lib/speech';
import { requestDeviceLocation } from '../lib/location';

interface LanguageSelectionPageProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onConfirm: () => void;
  detectedState?: string;
}

export const LanguageSelectionPage: React.FC<LanguageSelectionPageProps> = ({
  currentLanguage,
  onSelectLanguage,
  onConfirm,
  detectedState = 'Rajasthan',
}) => {
  const [selected, setSelected] = useState<SupportedLanguage>(currentLanguage || 'hi');
  const [playingCode, setPlayingCode] = useState<string | null>(null);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListeningVoiceSearch, setIsListeningVoiceSearch] = useState(false);

  // Dynamically resolve primary and additional languages from centralized i18n engine
  const { primary: primaryLanguages, additional: additionalLanguages } = useMemo(
    () => getLanguagesForState(detectedState),
    [detectedState]
  );

  const handleSelect = (code: string | SupportedLanguage) => {
    triggerHaptic('medium');
    setSelected(code as SupportedLanguage);
    onSelectLanguage(code as SupportedLanguage);
  };

  const handlePlaySample = (sample: string, code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');

    if (playingCode === code) {
      stopSpeaking();
      setPlayingCode(null);
      return;
    }

    setPlayingCode(code);
    speakText(
      sample,
      code as SupportedLanguage,
      () => setPlayingCode(code),
      () => setPlayingCode(null),
      () => setPlayingCode(null)
    );
  };

  const handleHeaderAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');

    const effectiveLang = selected || 'hi';
    const headerText = getTranslation('chooseLanguageTitle', effectiveLang);

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

  const handleVoiceSearch = () => {
    triggerHaptic('medium');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakText('कृपया भाषा का नाम टाइप करें।', selected || 'hi');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListeningVoiceSearch(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const rawTranscript = event.results[0][0].transcript || '';
        // Strip punctuation like ?, ., !, quotes, extra spaces
        const cleanedTranscript = rawTranscript.replace(/[?.,!/\\()_#@$%^&*~`'"+=\-[\]{}|:;<>]/g, ' ').trim();
        setSearchQuery(cleanedTranscript);
        setIsListeningVoiceSearch(false);
      };

      recognition.onerror = () => {
        setIsListeningVoiceSearch(false);
      };

      recognition.onend = () => {
        setIsListeningVoiceSearch(false);
      };
    } catch {
      setIsListeningVoiceSearch(false);
    }
  };

  const handleProceed = () => {
    stopSpeaking();
    triggerHaptic('success');
    requestDeviceLocation().catch(() => {});
    onSelectLanguage(selected);
    onConfirm();
  };

  const isAdditionalSelected = additionalLanguages.some((l) => l.code === selected);
  const currentAdditionalLang = additionalLanguages.find((l) => l.code === selected);

  const titleText = getTranslation('chooseLanguageTitle', selected);
  const buttonText = getTranslation('getStarted', selected);

  const filteredAdditionalLanguages = additionalLanguages.filter((l) =>
    matchLanguage(searchQuery, l)
  );

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between p-4 max-w-md mx-auto">
      
      {/* Top Header with Clean Spacing */}
      <header className="pt-1 pb-2">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">translate</span>
          </div>

          <h1 className="text-xl font-bold font-headline text-on-surface-light dark:text-on-surface-dark tracking-tight text-center flex-1 px-2">
            {titleText}
          </h1>

          <button
            type="button"
            onClick={handleHeaderAudio}
            aria-label="Listen to heading"
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 aspect-square transition-all cursor-pointer border ${
              playingCode === 'header'
                ? 'text-primary bg-primary/15 border-primary/40 animate-pulse'
                : 'text-primary border-primary/20 hover:bg-primary/5'
            }`}
          >
            <span className="material-symbols-outlined text-xl">volume_up</span>
          </button>
        </div>
      </header>

      {/* 2x2 Square Cards Grid */}
      <div className="grid grid-cols-2 gap-3 my-auto py-2">
        {/* 3 Primary Cards */}
        {primaryLanguages.map((lang) => {
          const isSelected = selected === lang.code;
          const isItemPlaying = playingCode === lang.code;

          return (
            <div
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-[0.97] cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/30'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-primary/40'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-xs">check</span>
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-1.5 shadow-sm ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200'
                }`}
              >
                {lang.glyph}
              </div>

              <span className="text-base font-bold tracking-wide font-headline text-on-surface-light dark:text-on-surface-dark">
                {lang.nativeName}
              </span>

              <button
                type="button"
                onClick={(e) => handlePlaySample(lang.sampleAudio, lang.code, e)}
                className={`flex items-center gap-1 text-xs mt-1.5 font-semibold px-2.5 py-0.5 rounded-full transition-all cursor-pointer border ${
                  isItemPlaying
                    ? 'text-primary bg-primary/15 border-primary/40 animate-pulse'
                    : 'text-primary border-primary/20 hover:bg-primary/10'
                }`}
              >
                <span className="material-symbols-outlined text-xs">volume_up</span>
                <span>{lang.audioLabel}</span>
              </button>
            </div>
          );
        })}

        {/* 4th Square Card: Other Languages Option (Lighter action appearance) */}
        <div
          onClick={() => {
            triggerHaptic('light');
            setIsMoreModalOpen(true);
          }}
          className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-[0.97] cursor-pointer ${
            isAdditionalSelected
              ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/30'
              : 'border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/40 hover:border-primary/50 shadow-xs'
          }`}
        >
          {isAdditionalSelected && (
            <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-xs">check</span>
            </div>
          )}

          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-1.5 shadow-xs ${
              isAdditionalSelected
                ? 'bg-primary text-white'
                : 'bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-300/40 dark:border-stone-700'
            }`}
          >
            {isAdditionalSelected && currentAdditionalLang ? (
              currentAdditionalLang.glyph
            ) : (
              <span className="font-headline font-black text-xl tracking-tighter">अ/A</span>
            )}
          </div>

          <span className={`text-base font-bold tracking-wide font-headline ${
            isAdditionalSelected
              ? 'text-on-surface-light dark:text-on-surface-dark'
              : 'text-stone-700 dark:text-stone-300'
          }`}>
            {isAdditionalSelected && currentAdditionalLang
              ? currentAdditionalLang.nativeName
              : 'अन्य भाषा चुनें'}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isAdditionalSelected && currentAdditionalLang) {
                handlePlaySample(currentAdditionalLang.sampleAudio, currentAdditionalLang.code, e);
              } else {
                handlePlaySample('अन्य भाषाओं में से चुनने के लिए यहाँ दबाएं।', 'more', e);
              }
            }}
            className={`flex items-center gap-1 text-xs mt-1.5 font-semibold px-2.5 py-0.5 rounded-full transition-all cursor-pointer border ${
              playingCode === (isAdditionalSelected && currentAdditionalLang ? currentAdditionalLang.code : 'more')
                ? 'text-primary bg-primary/15 border-primary/40 animate-pulse'
                : isAdditionalSelected
                ? 'text-primary border-primary/20 hover:bg-primary/10'
                : 'text-stone-600 dark:text-stone-400 border-stone-300/70 dark:border-stone-700 hover:bg-stone-200/50'
            }`}
          >
            <span className="material-symbols-outlined text-xs">volume_up</span>
            <span>{isAdditionalSelected && currentAdditionalLang ? currentAdditionalLang.audioLabel : 'सुनें'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Action Button with Safe-Area Padding */}
      <div className="pt-3 pb-[calc(env(safe-area-inset-bottom,16px)+1.5rem)] flex justify-center">
        <button
          type="button"
          onClick={handleProceed}
          className="max-w-[280px] w-full py-3.5 px-8 rounded-full bg-primary hover:bg-primary/95 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <span>{buttonText}</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* Additional Languages Modal Sheet with Proper Visual Hierarchy */}
      {isMoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-[32px] p-6 shadow-2xl border border-stone-200 dark:border-stone-700 space-y-5 animate-scaleUp">
            
            {/* Prominent Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-2xl">translate</span>
                <h2 className="text-xl font-black font-headline text-on-surface-light dark:text-on-surface-dark tracking-tight">
                  अन्य भाषा चुनें
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsMoreModalOpen(false);
                }}
                className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Redesigned Search & Voice Bar */}
            <div className="space-y-2.5">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-stone-400 text-xl pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="भाषा खोजें..."
                  className="w-full pl-11 pr-10 py-3 bg-stone-100/90 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 text-sm text-on-surface-light dark:text-on-surface-dark placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 w-6 h-6 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">clear</span>
                  </button>
                )}
              </div>

              {/* Bol Ke Bataye Voice Button */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`w-full py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold tracking-wide transition-all cursor-pointer border shadow-xs ${
                  isListeningVoiceSearch
                    ? 'bg-primary text-white border-primary animate-pulse'
                    : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 active:scale-[0.98]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {isListeningVoiceSearch ? 'mic' : 'keyboard_voice'}
                </span>
                <span>{isListeningVoiceSearch ? 'सुन रहे हैं... बोलें' : 'बोल के बताएं'}</span>
              </button>
            </div>

            {/* Languages Grid with Consistent Full-Scale Cards */}
            <div className="grid grid-cols-2 gap-3 py-1 max-h-[320px] overflow-y-auto pr-0.5">
              {filteredAdditionalLanguages.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-xs font-medium text-stone-500">
                  कोई भाषा नहीं मिली
                </div>
              ) : (
                filteredAdditionalLanguages.map((lang) => {
                  const isSelected = selected === lang.code;
                  const isItemPlaying = playingCode === lang.code;

                  return (
                    <div
                      key={lang.code}
                      onClick={() => {
                        handleSelect(lang.code);
                        setSearchQuery('');
                        setIsMoreModalOpen(false);
                      }}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-[0.97] cursor-pointer shadow-xs ${
                        isSelected
                          ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-primary/40'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-1.5 shadow-sm ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200'
                        }`}
                      >
                        {lang.glyph}
                      </div>

                      <span className="text-base font-bold tracking-wide font-headline text-on-surface-light dark:text-on-surface-dark">
                        {lang.nativeName}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySample(lang.sampleAudio, lang.code, e);
                        }}
                        className={`flex items-center gap-1 text-xs mt-1.5 font-semibold px-2.5 py-0.5 rounded-full transition-all cursor-pointer border ${
                          isItemPlaying
                            ? 'text-primary bg-primary/15 border-primary/30 animate-pulse'
                            : 'text-primary border-primary/20 hover:bg-primary/10'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">volume_up</span>
                        <span>{lang.audioLabel}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
