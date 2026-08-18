import React from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

export const SowingSeasonCard: React.FC = () => {
  const { farmData, updateFarmData, fetchRecommendations, isLoadingRecommendation, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const isSelectedAny = farmData.season !== null;

  const SEASONS = [
    {
      id: 'KHARIF',
      date: '2026-06-25',
      title: t('seasonKharif'),
      desc: 'सोयाबीन, मक्का, बाजरा, कपास, मूंगफली व तुअर हेतु उपयुक्त',
      icon: 'rainy',
      iconBg: 'bg-emerald-500/15 text-emerald-600',
    },
    {
      id: 'RABI',
      date: '2026-10-20',
      title: t('seasonRabi'),
      desc: 'गेहूं, चना, सरसों, प्याज व सूरजमुखी हेतु उपयुक्त',
      icon: 'ac_unit',
      iconBg: 'bg-blue-500/15 text-blue-600',
    },
    {
      id: 'ZAID',
      date: '2026-02-15',
      title: t('seasonZaid'),
      desc: 'मूंग, उड़द, सब्जियां व चारे की फसलें',
      icon: 'wb_sunny',
      iconBg: 'bg-amber-500/15 text-amber-600',
    },
  ];

  const handleSelectSeason = (seasonId: string, date: string) => {
    triggerHaptic('medium');
    updateFarmData({ season: seasonId, plannedSowingDate: date });
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const selectedObj = SEASONS.find((s) => s.id === farmData.season);
    const msg = isSelectedAny
      ? `${t('card5Title')}। वर्तमान चयन ${selectedObj?.title || ''} है।`
      : `${t('card5Title')}। ${t('card5Sub')}`;
    speakText(msg, language);
  };

  const handleSubmit = () => {
    if (!isSelectedAny) return;
    triggerHaptic('success');
    fetchRecommendations();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-44">
      
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

      {/* Season Selection List */}
      <div className="space-y-3.5">
        {SEASONS.map((s) => {
          const isSelected = farmData.season === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectSeason(s.id, s.date)}
              className={`w-full text-left p-5 rounded-3xl border-2 transition-all active:scale-[0.98] flex gap-4 items-center ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/30'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
                <span className="material-symbols-outlined text-3xl">{s.icon}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                    {s.title}
                  </h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-primary bg-primary text-white' : 'border-stone-400'
                  }`}>
                    {isSelected && <span className="material-symbols-outlined text-xs">check</span>}
                  </div>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sticky Bottom Action Bar with Back & Submit (Disabled until selected) */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto flex gap-3 bg-gradient-to-t from-surface-light via-surface-light to-transparent dark:from-surface-dark dark:via-surface-dark pt-4 pb-2">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            prevCard();
          }}
          className="w-1/3 py-4 px-4 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isSelectedAny || isLoadingRecommendation}
          className={`w-2/3 py-4 px-6 rounded-full font-extrabold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
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
            </>
          )}
        </button>
      </div>
    </div>
  );
};
