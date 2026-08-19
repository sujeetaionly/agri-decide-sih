import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2000,
}) => {
  const { isHindi } = useLanguage();
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade-out slightly before duration completes
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, durationMs - 400);

    const finishTimer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] pattern-bg flex flex-col items-center justify-between p-8 md:p-12 transition-opacity duration-400 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top spacing / Network Live Dot */}
      <div className="w-full flex justify-center items-center gap-2 pt-4">
        <span className="w-2 h-2 rounded-full bg-[#3e6a00] animate-pulse"></span>
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/80">
          फसल-दिशा • Fasal Disha
        </span>
      </div>

      {/* Center Brand Emblem & Identity */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm animate-in fade-in zoom-in-95 duration-500">
        {/* Animated Icon Container with concentric pulse rings */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-secondary-container/50 animate-ping opacity-30"></div>
          <div className="absolute w-28 h-28 rounded-full bg-primary-container/20 animate-pulse"></div>

          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-level-3 border-2 border-white/40">
            <span
              className="material-symbols-outlined text-[48px] md:text-[56px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              agriculture
            </span>
          </div>
        </div>

        {/* Brand Typography */}
        <div className="space-y-1.5">
          <h1 className="font-headline-lg text-headline-lg text-3xl md:text-4xl font-bold tracking-tight text-primary">
            फसल-दिशा (Fasal Disha)
          </h1>
          <div className="text-sm md:text-base font-semibold text-emerald-800">
            हर खेत को मिले सही दिशा
          </div>
          <p className="text-xs md:text-sm text-on-surface-variant font-medium pt-1 max-w-[280px] mx-auto leading-relaxed">
            {isHindi
              ? 'एआई आधारित सटीक फसल चयन व कृषि निर्णय प्रणाली'
              : 'AI-Powered Intelligent Crop Advisory & Multi-Region Decision Engine'}
          </p>
        </div>

        {/* Indeterminate Loading Bar */}
        <div className="w-48 h-1.5 bg-surface-variant rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-primary rounded-full animate-[pulse_1.2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      {/* Footer Attribution */}
      <div className="text-center space-y-1 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/60 text-xs font-semibold text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
          <span>{isHindi ? 'मौसम एवं मृदा विश्लेषण' : 'Weather & Soil Intelligence'}</span>
        </div>
        <p className="text-[11px] text-on-surface-variant/70">
          v1.0.0 • {isHindi ? 'भारत के किसानों के लिए समर्पित' : 'Built for Indian Farmers'}
        </p>
      </div>
    </div>
  );
};
