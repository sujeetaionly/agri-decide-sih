import React, { useState } from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

export const FarmSizeCard: React.FC = () => {
  const { farmData, updateFarmData, nextCard, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const [inputVal, setInputVal] = useState<string>(
    farmData.landAcres !== null ? String(farmData.landAcres) : ''
  );

  const parsedArea = parseFloat(inputVal);
  const isValid = !isNaN(parsedArea) && parsedArea > 0 && parsedArea <= 500;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      updateFarmData({ landAcres: num });
    } else {
      updateFarmData({ landAcres: null });
    }
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = `${t('card1Title')}। सटीक रकबे से खाद, बीज और शुद्ध मुनाफे की सही गणना होती है।`;
    speakText(msg, language);
  };

  const handleContinue = () => {
    if (!isValid) return;
    triggerHaptic('success');
    nextCard();
  };

  const handleBack = () => {
    triggerHaptic('light');
    prevCard();
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Question Title & Reassurance Subtitle with Audio */}
      <div className="space-y-2 pt-1 pb-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {t('card1Category')}
          </span>
          <button
            type="button"
            onClick={handleAudio}
            aria-label={t('listen')}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 active:scale-95 transition-all cursor-pointer shadow-none"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        <h2 className="text-2xl font-black font-headline text-stone-900 dark:text-stone-100 leading-snug">
          {t('card1Title')}
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          {t('card1Sub')}
        </p>
      </div>

      {/* Redesigned Clean Farm Size Input Card */}
      <div className="bg-white dark:bg-[#1E231B] border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
        
        {/* Card Header Label */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-lg font-bold">landscape</span>
          </div>
          <span className="text-sm font-black font-headline text-stone-900 dark:text-stone-100">
            {t('landArea')}
          </span>
        </div>

        {/* Hero Number Input Area */}
        <div className="rounded-2xl bg-stone-50 dark:bg-stone-900/60 border-2 border-stone-300 dark:border-stone-700 focus-within:border-primary focus-within:bg-white dark:focus-within:bg-[#1A1E17] focus-within:ring-2 focus-within:ring-primary/20 transition-all p-4">
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0.1"
              max="500"
              value={inputVal}
              onChange={handleChange}
              placeholder="0.0"
              className="w-48 text-center bg-transparent text-[#1A1C18] dark:text-[#E2E3DC] font-black text-4xl sm:text-5xl focus:outline-none placeholder:text-stone-300 dark:placeholder:text-stone-700 font-headline tracking-tight"
              autoFocus
            />
            <span className="text-xl font-black text-stone-600 dark:text-stone-300 select-none">
              {t('unitAcres')}
            </span>
          </div>
        </div>

        {/* Input Validation / Guidance */}
        {!isValid && inputVal.length > 0 ? (
          <p className="text-xs text-red-500 font-semibold flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{t('invalidArea')}</span>
          </p>
        ) : (
          <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1.5 font-medium text-center">
            <span className="material-symbols-outlined text-sm text-stone-400">info</span>
            <span>{t('decimalValid')}</span>
          </p>
        )}
      </div>

      {/* Inline Pill Action Buttons (Tight to Card) */}
      <div className="pt-4 pb-4 flex items-center justify-center gap-3 max-w-[300px] mx-auto w-full">
        <button
          type="button"
          onClick={handleBack}
          className="h-13 min-h-[50px] px-6 rounded-full bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-extrabold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!isValid}
          className={`flex-1 h-13 min-h-[50px] px-6 rounded-full font-extrabold text-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            isValid
              ? 'bg-primary hover:bg-primary/95 text-white active:scale-95 cursor-pointer shadow-md'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{t('continue')}</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
