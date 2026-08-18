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
    <div className="space-y-5 animate-fadeIn pb-36">
      
      {/* Question Title & Reassurance Subtitle with Audio */}
      <div className="space-y-2 pb-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug flex-1">
            {t('card1Title')}
          </h2>
          <button
            type="button"
            onClick={handleAudio}
            className="flex-shrink-0 h-8 flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-stone-100 dark:bg-stone-800 px-3 rounded-full border border-stone-300 dark:border-stone-700 active:scale-95 hover:bg-stone-200 cursor-pointer shadow-2xs mt-0.5"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          सटीक रकबे से खाद, बीज और शुद्ध मुनाफे की सही गणना होती है।
        </p>
      </div>

      {/* Main Form Input Card matching App Design */}
      <div className="bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-stone-700 dark:text-stone-300 tracking-wide flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-emerald-700 dark:text-emerald-400">landscape</span>
            <span>जमीन का कुल रकबा</span>
          </label>
          <span className="text-[11px] font-bold text-stone-400">
            दशमलव मान्य (उदा. 2.5)
          </span>
        </div>

        {/* Input Bar with Integrated Unit Badge */}
        <div className="h-16 rounded-2xl bg-stone-50 dark:bg-stone-900/80 border-2 border-stone-300 dark:border-stone-700 focus-within:border-emerald-700 dark:focus-within:border-emerald-500 focus-within:bg-white dark:focus-within:bg-[#1A1E17] focus-within:ring-4 focus-within:ring-emerald-700/10 transition-all shadow-inner px-4 flex items-center justify-between gap-3">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0.1"
            max="500"
            value={inputVal}
            onChange={handleChange}
            placeholder="उदा. 2.5"
            className="w-full bg-transparent text-[#1A1C18] dark:text-[#E2E3DC] font-black text-3xl focus:outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600"
            autoFocus
          />
          <div className="flex-shrink-0 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-600">
            एकड़
          </div>
        </div>

        {!isValid && inputVal.length > 0 ? (
          <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>कृपया ०.१ से अधिक मान्य संख्या दर्ज करें।</span>
          </p>
        ) : (
          <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-stone-400">info</span>
            <span>उदाहरण: १ एकड़, २.५ एकड़, ५ एकड़ आदि</span>
          </p>
        )}
      </div>

      {/* True Progressive Blur Layer with Gradient Mask */}
      <div
        className="fixed bottom-16 inset-x-0 z-30 pointer-events-none max-w-md mx-auto h-28"
        style={{
          background: 'linear-gradient(to top, rgba(249,249,246,0.95) 20%, rgba(249,249,246,0.7) 60%, transparent 100%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Action Buttons Floating on top of Progressive Blur */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto pb-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="py-3.5 px-5 rounded-full bg-white/95 dark:bg-[#1E231B]/95 backdrop-blur-sm border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>{t('back')}</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!isValid}
            className={`flex-1 py-3.5 px-6 rounded-full font-extrabold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
              isValid
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-[0.98] cursor-pointer'
                : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{t('continue')}</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
