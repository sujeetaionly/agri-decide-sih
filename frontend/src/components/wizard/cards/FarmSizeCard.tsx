import React, { useState } from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';

export const FarmSizeCard: React.FC = () => {
  const { farmData, updateFarmData } = useWizard();
  const { t } = useLanguage();

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

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Question Title & Subtitle */}
      <div className="space-y-1.5 pt-1 pb-1">
        <h2 className="text-2xl font-black font-headline text-stone-900 dark:text-stone-100 leading-snug">
          {t('card1Title')}
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          {t('card1Sub')}
        </p>
      </div>

      {/* Well-Proportioned Farm Size Input Card */}
      <div className="bg-white dark:bg-[#1E231B] border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
        
        {/* Metric Label Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-base font-bold">landscape</span>
          </div>
          <span className="text-sm font-extrabold text-stone-800 dark:text-stone-200">
            {t('landArea')}
          </span>
        </div>

        {/* Well-Proportioned Input Field - Optically Centered */}
        <div className="flex items-center justify-center gap-2.5 bg-stone-50/90 dark:bg-stone-900/60 border-2 border-stone-200 dark:border-stone-700 rounded-2xl h-16 px-4 focus-within:border-primary focus-within:bg-white dark:focus-within:bg-[#1A1E17] focus-within:ring-3 focus-within:ring-primary/15 transition-all max-w-[250px] mx-auto shadow-2xs cursor-text">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0.1"
            max="500"
            value={inputVal}
            onChange={handleChange}
            placeholder="0.0"
            style={{ width: `${Math.max(2.0, (inputVal || '0.0').length * 1.15)}ch` }}
            className="text-center bg-transparent text-stone-950 dark:text-white font-extrabold text-3xl sm:text-4xl focus:outline-none placeholder:text-stone-300 dark:placeholder:text-stone-600 tracking-tight tabular-nums antialiased [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            autoFocus
          />
          <span className="text-lg sm:text-xl font-extrabold text-stone-500 dark:text-stone-400 select-none font-headline flex-shrink-0">
            {t('unitAcres')}
          </span>
        </div>

        {/* Input Validation / Guidance */}
        {!isValid && inputVal.length > 0 ? (
          <p className="text-xs text-red-500 font-semibold flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{t('invalidArea')}</span>
          </p>
        ) : (
          <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1 font-medium text-center">
            <span className="material-symbols-outlined text-xs text-stone-400">info</span>
            <span>{t('decimalValid')}</span>
          </p>
        )}
      </div>
    </div>
  );
};
