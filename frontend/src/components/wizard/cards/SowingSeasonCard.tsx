import React, { useState } from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

type TimingChoice = 'THIS_WEEK' | 'NEXT_MONTH' | 'CUSTOM_DATE';

export const SowingSeasonCard: React.FC = () => {
  const { farmData, updateFarmData, fetchRecommendations, isLoadingRecommendation, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const [selectedTiming, setSelectedTiming] = useState<TimingChoice | null>(null);
  
  // Format today's date + offsets for ISO format (YYYY-MM-DD)
  const getOffsetDateIso = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

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

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomDate(val);
    updateFarmData({ season: 'KHARIF', plannedSowingDate: val });
  };

  const isSelectedAny = selectedTiming !== null && (selectedTiming !== 'CUSTOM_DATE' || Boolean(customDate));

  const handleAudio = () => {
    triggerHaptic('light');
    let msg = `${t('card5Title')}। ${t('card5Sub')}। `;
    if (selectedTiming === 'THIS_WEEK') msg += 'वर्तमान चयन: इसी हफ्ते।';
    else if (selectedTiming === 'NEXT_MONTH') msg += 'वर्तमान चयन: अगले एक महीने में।';
    else if (selectedTiming === 'CUSTOM_DATE') msg += `वर्तमान चयन: तारीख ${customDate}।`;
    speakText(msg, language);
  };

  const handleSubmit = () => {
    if (!isSelectedAny || isLoadingRecommendation) return;
    triggerHaptic('success');
    fetchRecommendations();
  };

  const TIMING_OPTIONS: {
    id: TimingChoice;
    title: string;
    sub: string;
    icon: string;
    iconBg: string;
  }[] = [
    {
      id: 'THIS_WEEK',
      title: t('sowingTimingWeek'),
      sub: 'तुरंत बुवाई की तैयारी के लिए मौसम अनुसार सलाह',
      icon: 'spa',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30',
    },
    {
      id: 'NEXT_MONTH',
      title: t('sowingTimingMonth'),
      sub: 'मानसूनी बारिश के आगमन अनुसार योजना',
      icon: 'event',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
    },
    {
      id: 'CUSTOM_DATE',
      title: t('sowingTimingCustomDate'),
      sub: 'कैलेंडर से अपनी सुविधानुसार तारीख चुनें',
      icon: 'calendar_month',
      iconBg: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      
      {/* Card Header & Audio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {t('stepOf')} ५ / ५
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
          {t('card5Title')}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t('card5Sub')}
        </p>
      </div>

      {/* Sowing Timing Options List */}
      <div className="space-y-3.5">
        {TIMING_OPTIONS.map((opt) => {
          const isSelected = selectedTiming === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleSelectTiming(opt.id)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-3 active:scale-[0.99] shadow-sm ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/30'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${opt.iconBg}`}>
                  <span className="material-symbols-outlined text-3xl [font-variation-settings:'FILL'_1]">{opt.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                      {opt.title}
                    </h3>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-primary bg-primary text-white' : 'border-stone-400'
                    }`}>
                      {isSelected && <span className="material-symbols-outlined text-xs">check</span>}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    {opt.sub}
                  </p>
                </div>
              </div>

              {/* Friendly Visual Calendar Picker for Option 3 */}
              {opt.id === 'CUSTOM_DATE' && isSelected && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 pt-3 border-t border-primary/20 space-y-2 bg-white dark:bg-[#151813] p-3.5 rounded-2xl animate-fadeIn"
                >
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    📅 बुवाई की अनुमानित तारीख चुनें:
                  </label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={handleCustomDateChange}
                    className="w-full py-3 px-4 rounded-xl border-2 border-primary/40 bg-stone-50 dark:bg-stone-900 text-[#1A1C18] dark:text-[#E2E3DC] font-bold text-base focus:border-primary focus:outline-none shadow-sm cursor-pointer"
                  />
                  {customDate && (
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>चयनित तारीख: {new Date(customDate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Action Bar with Submit (Disabled until selected) */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto bg-gradient-to-t from-surface-light via-surface-light to-transparent dark:from-surface-dark dark:via-surface-dark pt-4 pb-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isSelectedAny || isLoadingRecommendation}
          className={`w-full py-4 px-6 rounded-full font-extrabold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
            isSelectedAny && !isLoadingRecommendation
              ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 active:scale-[0.98] cursor-pointer'
              : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
          }`}
        >
          {isLoadingRecommendation ? (
            <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl">psychology_alt</span>
              <span>{t('seeRecommendations')}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
