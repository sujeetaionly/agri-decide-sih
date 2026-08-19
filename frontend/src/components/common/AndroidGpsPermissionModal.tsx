import React from 'react';
import { triggerHaptic } from '../../lib/utils';
import { SupportedLanguage, getTranslation } from '../../data/translations';

interface AndroidGpsPermissionModalProps {
  isOpen: boolean;
  language: SupportedLanguage;
  onAllow: (precise: boolean) => void;
  onDeny: () => void;
}

export const AndroidGpsPermissionModal: React.FC<AndroidGpsPermissionModalProps> = ({
  isOpen,
  language,
  onAllow,
  onDeny,
}) => {
  if (!isOpen) return null;

  const handleAllowUsing = () => {
    triggerHaptic('medium');
    onAllow(true);
  };

  const handleAllowOnce = () => {
    triggerHaptic('light');
    onAllow(false);
  };

  const handleDeny = () => {
    triggerHaptic('light');
    onDeny();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Android 14/15 Dialog Box */}
      <div className="w-full max-w-sm bg-white dark:bg-stone-900 text-on-surface-light dark:text-on-surface-dark rounded-[28px] p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5 animate-scaleUp">
        
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-3xl">location_on</span>
          </div>
          <h3 className="text-xl font-bold font-headline leading-snug px-1">
            {getTranslation('gpsPermissionTitle', language)}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed px-2">
            {getTranslation('gpsPermissionDesc', language)}
          </p>
        </div>

        {/* Visual Map Radar Illustration */}
        <div className="relative h-20 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 overflow-hidden flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border border-primary/30 animate-ping opacity-75" />
          <div className="absolute w-28 h-28 rounded-full border border-primary/20" />
          <div className="flex items-center gap-2 bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-700 px-3.5 py-1.5 rounded-full shadow-xs text-xs font-bold text-on-surface-light dark:text-on-surface-dark">
            <span className="material-symbols-outlined text-base animate-pulse text-primary">my_location</span>
            <span>जयपुर / राजस्थान (Auto GPS)</span>
          </div>
        </div>

        {/* Android Action Buttons */}
        <div className="flex flex-col space-y-2.5 pt-1">
          <button
            onClick={handleAllowUsing}
            className="w-full py-3.5 px-4 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm tracking-wide shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>{getTranslation('gpsAllowWhileUsing', language)}</span>
          </button>

          <button
            onClick={handleAllowOnce}
            className="w-full py-3 px-4 rounded-full bg-stone-100 dark:bg-stone-800 text-on-surface-light dark:text-on-surface-dark font-bold text-sm active:scale-[0.98] transition-transform border border-stone-200 dark:border-stone-700 shadow-xs hover:bg-stone-200/60 cursor-pointer"
          >
            {getTranslation('gpsAllowOnlyThisTime', language)}
          </button>

          <button
            onClick={handleDeny}
            className="w-full py-2.5 px-4 rounded-full text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-bold text-xs active:scale-[0.98] cursor-pointer"
          >
            {getTranslation('gpsDontAllow', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
