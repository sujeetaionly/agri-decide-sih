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

  const timingSummaryText =
    selectedTiming === 'THIS_WEEK'
      ? t('sowingTimingWeek')
      : selectedTiming === 'NEXT_MONTH'
      ? t('sowingTimingMonth')
      : selectedTiming === 'CUSTOM_DATE' && customDate
      ? `तारीख: ${new Date(customDate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
      : '';

  const handleAudio = () => {
    triggerHaptic('light');
    let msg = `${t('card5Title')}। सही बुवाई समय से मानसूनी बारिश का अधिकतम लाभ और कीट-रोग का जोखिम कम होता है। `;
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

  const handleBack = () => {
    triggerHaptic('light');
    prevCard();
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
      icon: 'bolt',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs',
    },
    {
      id: 'NEXT_MONTH',
      title: t('sowingTimingMonth'),
      sub: 'मानसूनी बारिश के आगमन अनुसार योजना',
      icon: 'cloud_sync',
      iconBg: 'bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-500/30 shadow-xs',
    },
    {
      id: 'CUSTOM_DATE',
      title: t('sowingTimingCustomDate'),
      sub: 'कैलेंडर से अपनी सुविधानुसार सटीक तारीख चुनें',
      icon: 'edit_calendar',
      iconBg: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      
      {/* Question Title & Reassurance Subtitle with Audio */}
      <div className="space-y-2 pb-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug flex-1">
            {t('card5Title')}
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
          सही बुवाई समय से मानसूनी बारिश का अधिकतम लाभ और कीट-रोग का जोखिम कम होता है।
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
              className={`p-4 sm:p-4.5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 active:scale-[0.99] shadow-2xs ${
                isSelected
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-700 dark:border-emerald-500 shadow-sm ring-2 ring-emerald-700/20'
                  : 'bg-white dark:bg-[#1E231B] border-stone-300 dark:border-stone-700 hover:border-emerald-600/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${opt.iconBg}`}>
                  <span className="material-symbols-outlined text-2xl [font-variation-settings:'FILL'_1]">{opt.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold text-[#1A1C18] dark:text-[#E2E3DC] font-headline">
                      {opt.title}
                    </h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-400'
                    }`}>
                      {isSelected && <span className="material-symbols-outlined text-[10px] font-black">check</span>}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                    {opt.sub}
                  </p>
                </div>
              </div>

              {/* Seamless Integrated Date Picker with Clean Hierarchy */}
              {opt.id === 'CUSTOM_DATE' && isSelected && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="pt-3 border-t border-emerald-700/20 dark:border-emerald-500/20 animate-fadeIn"
                >
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      value={customDate}
                      onChange={handleCustomDateChange}
                      className="w-full h-12 pl-4 pr-10 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold text-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-none transition-all cursor-pointer shadow-2xs"
                    />
                    <span className="material-symbols-outlined absolute right-3 text-stone-400 pointer-events-none text-xl">
                      calendar_month
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
            onClick={handleSubmit}
            disabled={!isSelectedAny || isLoadingRecommendation}
            className={`flex-1 py-3.5 px-6 rounded-full font-extrabold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
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
    </div>
  );
};
