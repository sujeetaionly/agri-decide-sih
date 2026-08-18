import React from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

export const FarmSizeCard: React.FC = () => {
  const { farmData, updateFarmData, nextCard } = useWizard();
  const { language, t } = useLanguage();

  const QUICK_ACRES = [1, 2, 2.5, 3, 5, 10];

  const handleSelectArea = (acres: number) => {
    triggerHaptic('medium');
    updateFarmData({ landAcres: acres });
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = `${t('card1Title')}। ${t('card1Sub')}। वर्तमान चयन ${farmData.landAcres} एकड़ है।`;
    speakText(msg, language);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-36">
      
      {/* Card Header & Audio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {t('stepOf')} १ / ५
          </span>
          <button
            onClick={handleAudio}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        <h2 className="text-2xl font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug">
          {t('card1Title')}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t('card1Sub')}
        </p>
      </div>

      {/* Primary Visual Area Display */}
      <div className="bg-white dark:bg-[#1E231B] border-2 border-primary/20 rounded-3xl p-6 text-center space-y-3 shadow-sm">
        <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          कुल जमीन (खेत का आकार)
        </span>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-extrabold text-primary font-headline">
            {farmData.landAcres}
          </span>
          <span className="text-xl font-bold text-stone-700 dark:text-stone-300">
            {t('acre')}
          </span>
        </div>
      </div>

      {/* Quick Select Preset Tiles */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
          जल्दी चुनें:
        </label>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACRES.map((val) => {
            const isSelected = farmData.landAcres === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSelectArea(val)}
                className={`py-3.5 px-2 rounded-2xl border-2 font-bold text-sm transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-md ring-2 ring-primary/30'
                    : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-primary/40'
                }`}
              >
                {val} {t('acre')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Range Slider for Custom Sizing */}
      <div className="space-y-2 bg-stone-50 dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800">
        <div className="flex justify-between text-xs font-bold text-stone-600 dark:text-stone-400">
          <span>०.५ एकड़</span>
          <span>कस्टम साइज बदलें</span>
          <span>२५ एकड़</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="25"
          step="0.5"
          value={farmData.landAcres}
          onChange={(e) => updateFarmData({ landAcres: parseFloat(e.target.value) })}
          className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto">
        <button
          onClick={() => {
            triggerHaptic('success');
            nextCard();
          }}
          className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-bold text-base shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span>{t('continue')} (मिट्टी का प्रकार)</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
