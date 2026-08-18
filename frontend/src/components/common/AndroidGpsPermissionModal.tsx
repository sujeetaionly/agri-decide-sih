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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Android 14/15 Dialog Box */}
      <div className="w-full max-w-sm bg-[#F4F6EE] dark:bg-[#1E231B] text-[#1A1C18] dark:text-[#E2E3DC] rounded-[28px] p-6 shadow-2xl border border-primary/20 space-y-5 animate-scaleUp">
        
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">location_on</span>
          </div>
          <h3 className="text-xl font-bold font-headline leading-snug px-1">
            {getTranslation('gpsPermissionTitle', language)}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed px-2">
            {getTranslation('gpsPermissionDesc', language)}
          </p>
        </div>

        {/* Visual Map Radar Illustration */}
        <div className="relative h-20 rounded-2xl bg-primary/5 border border-primary/15 overflow-hidden flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border border-primary/30 animate-ping opacity-75" />
          <div className="absolute w-28 h-28 rounded-full border border-primary/20" />
          <div className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark px-3 py-1.5 rounded-full shadow-sm text-xs font-semibold text-primary">
            <span className="material-symbols-outlined text-base animate-pulse text-emerald-600">my_location</span>
            <span>पुणे / महाराष्ट्र (Auto GPS)</span>
          </div>
        </div>

        {/* Android Action Buttons */}
        <div className="flex flex-col space-y-2 pt-1">
          <button
            onClick={handleAllowUsing}
            className="w-full py-3.5 px-4 rounded-full bg-primary text-on-primary font-bold text-sm tracking-wide shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>{getTranslation('gpsAllowWhileUsing', language)}</span>
          </button>

          <button
            onClick={handleAllowOnce}
            className="w-full py-3 px-4 rounded-full bg-surface-container-high dark:bg-stone-800 text-[#1A1C18] dark:text-[#E2E3DC] font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            {getTranslation('gpsAllowOnlyThisTime', language)}
          </button>

          <button
            onClick={handleDeny}
            className="w-full py-2.5 px-4 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-medium text-xs active:scale-[0.98]"
          >
            {getTranslation('gpsDontAllow', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
