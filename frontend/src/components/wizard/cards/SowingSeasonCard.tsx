import React, { useState, useRef } from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';

type TimingChoice = 'THIS_WEEK' | 'NEXT_MONTH' | 'CUSTOM_DATE';

export const SowingSeasonCard: React.FC = () => {
  const { farmData, updateFarmData } = useWizard();
  const { t } = useLanguage();
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  const openDatePicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelectTiming('CUSTOM_DATE');
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          dateInputRef.current.showPicker();
        } catch {
          dateInputRef.current.focus();
        }
      } else {
        dateInputRef.current.focus();
      }
    }
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

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Question Title & Subtitle */}
      <div className="space-y-1.5 pt-1 pb-1">
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
          className={`w-full text-left p-4 sm:p-5 rounded-3xl border-2 transition-all active:scale-[0.98] flex gap-4 items-center cursor-pointer ${
            selectedTiming === 'THIS_WEEK'
              ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-md ring-2 ring-primary/20'
              : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
          }`}
        >
          <div className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <span className="material-symbols-outlined text-2xl sm:text-3xl [font-variation-settings:'FILL'_1]">bolt</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-black font-headline text-stone-950 dark:text-stone-50 leading-snug tracking-tight">
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
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium mt-1 leading-relaxed">
              तुरंत बुवाई की तैयारी (सटीक व तत्काल सिफारिश)
            </p>
          </div>
        </button>

        {/* Option 2: NEXT MONTH */}
        <button
          type="button"
          onClick={() => handleSelectTiming('NEXT_MONTH')}
          className={`w-full text-left p-4 sm:p-5 rounded-3xl border-2 transition-all active:scale-[0.98] flex gap-4 items-center cursor-pointer ${
            selectedTiming === 'NEXT_MONTH'
              ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-md ring-2 ring-primary/20'
              : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
          }`}
        >
          <div className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <span className="material-symbols-outlined text-2xl sm:text-3xl [font-variation-settings:'FILL'_1]">calendar_add_on</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-black font-headline text-stone-950 dark:text-stone-50 leading-snug tracking-tight">
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
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium mt-1 leading-relaxed">
              आगामी बुवाई की अग्रिम तैयारी व फसल योजना
            </p>
          </div>
        </button>

        {/* Option 3: CUSTOM CALENDAR DATE */}
        <div
          onClick={() => handleSelectTiming('CUSTOM_DATE')}
          className={`w-full p-4 sm:p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-3 ${
            selectedTiming === 'CUSTOM_DATE'
              ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-md ring-2 ring-primary/20'
              : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
          }`}
        >
          <div className="flex gap-4 items-center">
            <div className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary border border-primary/20 shadow-xs">
              <span className="material-symbols-outlined text-2xl sm:text-3xl [font-variation-settings:'FILL'_1]">calendar_month</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-black font-headline text-stone-950 dark:text-stone-50 leading-snug tracking-tight">
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
                कैलेंडर से अपनी सुविधानुसार कोई भी तारीख तय करें
              </p>
            </div>
          </div>

          {/* Interactive Unified Date Selector Box */}
          {selectedTiming === 'CUSTOM_DATE' && (
            <div
              onClick={openDatePicker}
              className="relative mt-2 p-3.5 bg-white dark:bg-stone-900 border-2 border-primary/40 hover:border-primary rounded-2xl flex items-center justify-between shadow-2xs cursor-pointer active:scale-[0.99] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">event</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 block uppercase tracking-wider">
                    बुवाई की चुनी गई तारीख
                  </span>
                  <span className="text-base font-black text-stone-950 dark:text-stone-50 font-headline">
                    {formatDisplayDate(customDate)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">edit_calendar</span>
                <span>बदलें</span>
              </div>

              <input
                ref={dateInputRef}
                type="date"
                min={todayIso}
                max={maxDateIso}
                value={customDate}
                onChange={(e) => handleCustomDateChange(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-auto z-10"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
