import React from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '@/context/LanguageContext';
import { useAudio } from '@/context/AudioContext';
import { Language } from '@/types/language';

interface LanguageSelectionPageProps {
  onContinue: () => void;
}

export const LanguageSelectionPage: React.FC<LanguageSelectionPageProps> = ({
  onContinue,
}) => {
  const { language, setLanguage, isHindi } = useLanguage();
  const { isPlaying, activeAudioId, playAudio, stopAudio } = useAudio();

  const handleSelect = (code: Language) => {
    setLanguage(code);
  };

  const handleAudio = (id: string, textHi: string, textEn: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlaying && activeAudioId === id) {
      stopAudio();
    } else {
      playAudio(id, textHi, textEn);
    }
  };

  // Avatar glyph map for language badges matching Stitch
  const glyphMap: Record<Language, string> = {
    en: 'A',
    hi: 'अ',
    mr: 'म',
    gu: 'ગુ',
    pa: 'ਪੰ',
    bn: 'বা',
  };

  return (
    <div className="pattern-bg text-on-background min-h-screen flex items-center justify-center p-gutter md:p-card-padding antialiased font-body-md">
      {/* Modal Container */}
      <main className="bg-surface-container-lowest rounded-xl shadow-[0px_-4px_12px_rgba(0,0,0,0.08)] w-full max-w-[480px] p-card-padding md:p-8 relative overflow-hidden flex flex-col gap-6 md:gap-8 border border-surface-variant animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <header className="text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container mb-1 shadow-sm">
            <span className="material-symbols-outlined text-[32px]">language</span>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h1 className="font-headline-lg text-headline-lg text-primary font-bold text-center">
              {isHindi ? 'आप कौन सी भाषा पसंद करते हैं?' : 'Which language do you prefer?'}
            </h1>
            <button
              onClick={(e) =>
                handleAudio(
                  'lang-header-audio',
                  'नमस्ते! कृपया अपनी पसंदीदा भाषा चुनें और शुरू करें बटन दबाएं।',
                  'Which language do you prefer? Choose your preferred language to continue using Agri-Decide.',
                  e
                )
              }
              aria-label="Listen to heading"
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all min-h-[48px] ${
                isPlaying && activeAudioId === 'lang-header-audio'
                  ? 'text-primary bg-primary-container/20 animate-pulse'
                  : 'text-primary hover:bg-primary-container/10'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">volume_up</span>
            </button>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant text-center">
            {isHindi
              ? 'एग्री-डिसाइड का उपयोग जारी रखने के लिए अपनी पसंदीदा भाषा चुनें।'
              : 'Choose your preferred language to continue using Agri-Decide.'}
          </p>
        </header>

        {/* Language Options */}
        <div className="flex flex-col gap-3">
          {LANGUAGE_OPTIONS.map((opt) => {
            const isSelected = language === opt.code;
            const audioId = `lang-opt-${opt.code}`;
            const isItemAudioPlaying = isPlaying && activeAudioId === audioId;

            return (
              <div
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-150 btn-tactile ${
                  isSelected
                    ? 'border-2 border-primary bg-primary-container/10 shadow-sm'
                    : 'border border-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {/* Avatar Circle & Language Title */}
                <div className="flex-1 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
                      isSelected
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    <span>{glyphMap[opt.code] || opt.name.charAt(0)}</span>
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`font-button-text text-button-text font-bold ${
                        isSelected ? 'text-primary' : 'text-on-background'
                      }`}
                    >
                      {opt.nativeName}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {opt.name}
                    </span>
                  </div>
                </div>

                {/* Individual Language Audio Button */}
                <button
                  onClick={(e) =>
                    handleAudio(
                      audioId,
                      opt.code === 'hi'
                        ? 'हिंदी भाषा चुनी गई है।'
                        : `${opt.name} language selected.`,
                      `${opt.name} language selected.`,
                      e
                    )
                  }
                  aria-label={`Listen to ${opt.name}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-all min-h-[48px] ${
                    isItemAudioPlaying
                      ? 'text-primary bg-primary-container/20 animate-pulse'
                      : isSelected
                      ? 'text-primary hover:bg-primary-container/20'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">volume_up</span>
                </button>

                {/* Selection Check Circle */}
                {isSelected ? (
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-outline-variant text-[24px]">
                    radio_button_unchecked
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Area */}
        <div className="mt-2">
          <button
            onClick={onContinue}
            className="w-full bg-primary text-on-primary font-button-text text-button-text py-4 px-6 rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-none hover:translate-y-[2px] transition-all duration-150 flex items-center justify-center gap-2 min-h-[56px] btn-tactile cursor-pointer"
          >
            <span className="font-bold text-[18px]">
              {isHindi ? 'शुरू करें' : 'Get Started'}
            </span>
            <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};
