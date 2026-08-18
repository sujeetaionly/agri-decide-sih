import React, { useState } from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

export const FarmSizeCard: React.FC = () => {
  const { farmData, updateFarmData, nextCard } = useWizard();
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
    const msg = `${t('card1Title')}। कृपया अपने खेत का आकार कीबोर्ड से टाइप करें।`;
    speakText(msg, language);
  };

  const handleContinue = () => {
    if (!isValid) return;
    triggerHaptic('success');
    nextCard();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-44">
      
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
          नीचे दिए गए बॉक्स में अपने खेत का कुल रकबा (एकड़ में) कीबोर्ड द्वारा दर्ज करें।
        </p>
      </div>

      {/* Main Direct Keyboard Input Box */}
      <div className="bg-white dark:bg-[#1E231B] border-2 border-primary/30 rounded-3xl p-6 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider text-center">
          कुल जमीन (खेत का आकार)
        </label>

        <div className="relative flex items-center justify-center max-w-xs mx-auto">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0.1"
            max="500"
            value={inputVal}
            onChange={handleChange}
            placeholder="उदा. 2.5"
            className="w-full text-center py-5 px-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 text-[#1A1C18] dark:text-[#E2E3DC] font-extrabold text-3xl focus:border-primary focus:bg-white dark:focus:bg-[#1A1E17] focus:outline-none shadow-inner tracking-wider"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-center text-sm font-bold text-primary">
          <span className="material-symbols-outlined text-xl">landscape</span>
          <span>इकाई: एकड़ (Acres)</span>
        </div>

        {!isValid && inputVal.length > 0 && (
          <p className="text-xs text-center text-red-500 font-semibold">
            कृपया ०.१ से अधिक मान्य संख्या दर्ज करें।
          </p>
        )}
      </div>

      {/* Sticky Bottom Action Bar with Disabled State until input is entered */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto bg-gradient-to-t from-surface-light via-surface-light to-transparent dark:from-surface-dark dark:via-surface-dark pt-4 pb-2">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!isValid}
          className={`w-full py-4 px-6 rounded-full font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
            isValid
              ? 'bg-primary text-on-primary active:scale-[0.98] cursor-pointer'
              : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{t('continue')} (मिट्टी का प्रकार)</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
