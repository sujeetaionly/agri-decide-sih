import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAudio } from '@/context/AudioContext';
import { LanguageModal } from '@/components/common/LanguageModal';

interface HomeTopAppBarProps {
  onOpenLanguagePage?: () => void;
}

export const HomeTopAppBar: React.FC<HomeTopAppBarProps> = ({
  onOpenLanguagePage,
}) => {
  const { isHindi } = useLanguage();
  const { isPlaying, activeAudioId, playAudio, stopAudio } = useAudio();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const isAudioPlaying = isPlaying && activeAudioId === 'home-top-audio';

  const handleAudioToggle = () => {
    if (isAudioPlaying) {
      stopAudio();
    } else {
      playAudio(
        'home-top-audio',
        'एग्री-डिसाइड में आपका स्वागत है। अपने खेत की मिट्टी और मौसम के अनुसार सबसे उपयुक्त फसल चुनने के लिए नीचे दिए गए बटन को दबाएं।',
        'Welcome to Agri-Decide. Find the best crop recommendations based on your soil, monsoon forecasts, and mandi prices.'
      );
    }
  };

  const handleLanguageClick = () => {
    if (onOpenLanguagePage) {
      onOpenLanguagePage();
    } else {
      setIsLangModalOpen(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex flex-col px-margin-mobile py-base bg-surface shadow-[0px_1px_2px_rgba(0,0,0,0.05)] mt-[28px]">
        <div className="flex items-center justify-between h-[48px] max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={handleLanguageClick}
              aria-label="Change language"
              className="h-touch-target-min w-touch-target-min flex items-center justify-center text-on-surface-variant rounded-full hover:bg-surface-container-high transition-transform duration-150 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                language
              </span>
            </button>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight whitespace-nowrap">
              Agri-Decide
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Connectivity Chip */}
            <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-full px-3 py-1 h-[32px]">
              <span className="w-2 h-2 rounded-full bg-[#3e6a00]"></span>
              <span className="font-label-md text-label-md text-on-surface-variant text-xs">
                {isHindi ? 'कनेक्टेड' : 'Connected'}
              </span>
            </div>

            {/* Audio TTS Button */}
            <button
              onClick={handleAudioToggle}
              aria-label="Listen audio"
              className={`h-touch-target-min w-touch-target-min flex items-center justify-center rounded-full hover:bg-surface-container-high transition-transform duration-150 active:scale-95 cursor-pointer ${
                isAudioPlaying ? 'text-primary bg-primary/10 animate-pulse' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                volume_up
              </span>
            </button>
          </div>
        </div>
      </header>

      <LanguageModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
    </>
  );
};
