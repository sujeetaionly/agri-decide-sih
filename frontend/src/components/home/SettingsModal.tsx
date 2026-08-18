import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLanguagePage: () => void;
  onResetLanguage: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenLanguagePage,
  onResetLanguage,
}) => {
  const { language, isHindi } = useLanguage();

  if (!isOpen) return null;

  const currentLangLabel = isHindi ? 'हिंदी (Hindi)' : 'English';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-level-3 border border-outline-variant p-6 space-y-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[22px]">settings</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">
              {isHindi ? 'सेटिंग्स (Settings)' : 'Settings'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Active Language Setting */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                {isHindi ? 'वर्तमान भाषा' : 'Current Language'}
              </span>
              <div className="font-bold text-base text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">language</span>
                <span>{currentLangLabel}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenLanguagePage();
              }}
              className="px-3 py-1.5 rounded-lg border-2 border-primary text-primary font-bold text-xs hover:bg-primary-container/10 transition-colors btn-tactile cursor-pointer"
            >
              {isHindi ? 'बदलें' : 'Change'}
            </button>
          </div>

          {/* Development / Testing Reset Button */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              <span>{isHindi ? 'परीक्षण हेतु रीसेट' : 'Dev / Testing Reset'}</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {isHindi
                ? 'पहली बार आने वाले किसान (First-Time User) के अनुभव का परीक्षण करने के लिए भाषा चयन रीसेट करें।'
                : 'Reset language onboarding flag to simulate a first-time user visit.'}
            </p>
            <button
              onClick={() => {
                onClose();
                onResetLanguage();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 btn-tactile cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">device_reset</span>
              <span>{isHindi ? 'पहली बार का अनुभव रीसेट करें' : 'Reset First-Time Onboarding'}</span>
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="outline" size="md" fullWidth onClick={onClose}>
            {isHindi ? 'बंद करें' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  );
};
