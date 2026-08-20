import React, { useState } from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

type TimingChoice = 'THIS_WEEK' | 'NEXT_MONTH' | 'CUSTOM_DATE';

export const SowingSeasonCard: React.FC = () => {
  const { farmData, updateFarmData, nextCard, prevCard } = useWizard();
  const { language, t } = useLanguage();

  // Helper to format ISO date strings (YYYY-MM-DD)
  const getOffsetDateIso = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const todayIso = getOffsetDateIso(0);
  const maxDateIso = getOffsetDateIso(365);

  const [selectedTiming, setSelectedTiming] = useState<TimingChoice>(() => {
    if (farmData.plannedSowingDate) {
      return 'CUSTOM_DATE';
    }
    return 'THIS_WEEK';
  });

  const [customDate, setCustomDate] = useState<string>(
    farmData.plannedSowingDate || getOffsetDateIso(14)
  );

  const handleSelectTiming = (timing: TimingChoice) => {
    triggerHaptic('medium');
    setSelectedTiming(timing);

    if (timing === 'THIS_WEEK') {
      const date = getOffsetDateIso(3);
      updateFarmData({ season: 'KHARIF', plannedSowingDate: date });
    } else if (timing === 'NEXT_MONTH') {
      const date = getOffsetDateIso(25);
      updateFarmData({ season: 'KHARIF', plannedSowingDate: date });
    } else if (timing === 'CUSTOM_DATE') {
      updateFarmData({ season: 'KHARIF', plannedSowingDate: customDate });
    }
  };

  const handleCustomDateChange = (val: string) => {
    if (!val) return;
    setCustomDate(val);
    setSelectedTiming('CUSTOM_DATE');
    updateFarmData({ season: 'KHARIF', plannedSowingDate: val });
  };

  const formatDisplayDate = (isoStr: string) => {
    try {
      const parts = isoStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      return isoStr;
    } catch {
      return isoStr;
    }
  };

  const handleAudio = () => {
    triggerHaptic('light');
    let msg = `${t('card5Title')}। सही बुवाई समय से मानसूनी बारिश का अधिकतम लाभ और कीट-रोग का जोखिम कम होता है। `;
    if (selectedTiming === 'THIS_WEEK') msg += 'वर्तमान चयन: इसी हफ्ते।';
    else if (selectedTiming === 'NEXT_MONTH') msg += 'वर्तमान चयन: अगले एक महीने में।';
    else if (selectedTiming === 'CUSTOM_DATE') msg += `वर्तमान चयन: तारीख ${formatDisplayDate(customDate)}।`;
    speakText(msg, language);
  };

  const handleSubmit = () => {
    triggerHaptic('success');
    if (selectedTiming === 'CUSTOM_DATE') {
      updateFarmData({ season: 'KHARIF', plannedSowingDate: customDate || getOffsetDateIso(14) });
    } else if (selectedTiming === 'NEXT_MONTH') {
      const date = getOffsetDateIso(25);
      updateFarmData({ season: 'KHARIF', plannedSowingDate: date });
    } else {
      const date = getOffsetDateIso(3);
      updateFarmData({ season: 'KHARIF', plannedSowingDate: date });
    }
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
            {t('card5Category')}
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
          {t('card5Title')}
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          {t('card5Sub')}
        </p>
      </div>

      {/* Sowing Options List */}
      <div className="space-y-3.5">
        
        {/* Option 1: THIS WEEK */}
        <button
          type="button"
          onClick={() => handleSelectTiming('THIS_WEEK')}
          className={`w-full text-left p-5 rounded-3xl border-2 transition-all active:scale-[0.98] flex gap-4 items-center cursor-pointer ${
            selectedTiming === 'THIS_WEEK'
              ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-md ring-2 ring-primary/20'
              : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <span className="material-symbols-outlined text-3xl [font-variation-settings:'FILL'_1]">bolt</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-black font-headline text-stone-950 dark:text-stone-50 leading-snug tracking-tight">
                {t('sowingTimingWeek')}
              </h3>
              <div
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selectedTiming === 'THIS_WEEK'
                    ? 'border-primary bg-primary text-white'
                    : 'border-stone-300 dark:border-stone-600 bg-transparent'
                }`}
              >
                {selectedTiming === 'THIS_WEEK' && (
                  <span className="material-symbols-outlined text-sm font-black leading-none">check</span>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium mt-1.5 leading-relaxed">
              तुरंत बुवाई की तैयारी के लिए मौसम अनुसार उपयुक्त विकल्प
            </p>
          </div>
        </button>

        {/* Option 2: NEXT MONTH */}
        <button
          type="button"
          onClick={() => handleSelectTiming('NEXT_MONTH')}
          className={`w-full text-left p-5 rounded-3xl border-2 transition-all active:scale-[0.98] flex gap-4 items-center cursor-pointer ${
            selectedTiming === 'NEXT_MONTH'
              ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-md ring-2 ring-primary/20'
              : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <span className="material-symbols-outlined text-3xl [font-variation-settings:'FILL'_1]">cloud_sync</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-black font-headline text-stone-950 dark:text-stone-50 leading-snug tracking-tight">
                {t('sowingTimingMonth')}
              </h3>
              <div
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selectedTiming === 'NEXT_MONTH'
                    ? 'border-primary bg-primary text-white'
                    : 'border-stone-300 dark:border-stone-600 bg-transparent'
                }`}
              >
                {selectedTiming === 'NEXT_MONTH' && (
                  <span className="material-symbols-outlined text-sm font-black leading-none">check</span>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium mt-1.5 leading-relaxed">
              मानसूनी बारिश के आगमन अनुसार योजना
            </p>
          </div>
        </button>

        {/* Option 3: CUSTOM CALENDAR DATE (Fully Integrated & Interactive) */}
        <div
          onClick={() => handleSelectTiming('CUSTOM_DATE')}
          className={`w-full p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-3 ${
            selectedTiming === 'CUSTOM_DATE'
              ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-md ring-2 ring-primary/20'
              : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
          }`}
        >
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary border border-primary/20 shadow-xs">
              <span className="material-symbols-outlined text-3xl [font-variation-settings:'FILL'_1]">calendar_month</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-black font-headline text-stone-950 dark:text-stone-50 leading-snug tracking-tight">
                  {t('sowingTimingCustomDate')}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    selectedTiming === 'CUSTOM_DATE'
                      ? 'border-primary bg-primary text-white'
                      : 'border-stone-300 dark:border-stone-600 bg-transparent'
                  }`}
                >
                  {selectedTiming === 'CUSTOM_DATE' && (
                    <span className="material-symbols-outlined text-sm font-black leading-none">check</span>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium mt-1 leading-relaxed">
                कैलेंडर से अपनी सुविधानुसार सटीक तारीख चुनें
              </p>
            </div>
          </div>

          {/* Interactive Date Picker Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="pt-2 border-t border-stone-200/80 dark:border-stone-800 space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-300">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-base">event</span>
                <span>चयनित बुवाई तारीख:</span>
              </span>
              <span className="text-sm font-black text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-xl">
                {formatDisplayDate(customDate)}
              </span>
            </div>

            <div className="relative">
              <div className="w-full bg-white dark:bg-stone-900 border-2 border-primary/50 rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                  <span className="text-base font-black text-stone-900 dark:text-stone-100 tracking-wider">
                    {customDate.split('-').length === 3
                      ? `${customDate.split('-')[2]}/${customDate.split('-')[1]}/${customDate.split('-')[0]}`
                      : customDate}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-stone-400">DD/MM/YYYY</span>
              </div>
              <input
                type="date"
                min={todayIso}
                max={maxDateIso}
                value={customDate}
                onChange={(e) => handleCustomDateChange(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
            </div>
          </div>
        </div>

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
          onClick={handleSubmit}
          className="flex-1 h-13 min-h-[50px] px-6 rounded-full bg-primary hover:bg-primary/95 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-md whitespace-nowrap"
        >
          <span>{t('continue')}</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
