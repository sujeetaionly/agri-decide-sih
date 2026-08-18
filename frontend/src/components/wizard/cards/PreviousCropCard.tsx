import React from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

export const PreviousCropCard: React.FC = () => {
  const { farmData, updateFarmData, nextCard, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const isSelectedAny = farmData.previousCrop !== null;

  const CROPS = [
    { id: 'WHEAT', title: t('cropWheat'), category: 'अनाज (Cereal)', icon: 'grain', iconBg: 'bg-amber-500/15 text-amber-600' },
    { id: 'GRAM', title: t('cropGram'), category: 'दलहन (Pulse)', icon: 'spa', iconBg: 'bg-emerald-500/15 text-emerald-600' },
    { id: 'PADDY', title: t('cropPaddy'), category: 'धान (Rice)', icon: 'grass', iconBg: 'bg-green-500/15 text-green-600' },
    { id: 'SOYBEAN', title: t('cropSoybean'), category: 'तिलहन (Oilseed)', icon: 'eco', iconBg: 'bg-lime-500/15 text-lime-600' },
    { id: 'COTTON', title: t('cropCotton'), category: 'नकदी (Cash)', icon: 'cloud', iconBg: 'bg-sky-500/15 text-sky-600' },
    { id: 'OTHER', title: t('cropOther'), category: 'अन्य / खाली', icon: 'landscape', iconBg: 'bg-stone-500/15 text-stone-600' },
  ];

  const handleSelectCrop = (cropId: string) => {
    triggerHaptic('medium');
    updateFarmData({ previousCrop: cropId });
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const selectedObj = CROPS.find((c) => c.id === farmData.previousCrop);
    const msg = isSelectedAny
      ? `${t('card4Title')}। वर्तमान चयन ${selectedObj?.title || ''} है।`
      : `${t('card4Title')}। ${t('card4Sub')}`;
    speakText(msg, language);
  };

  const handleContinue = () => {
    if (!isSelectedAny) return;
    triggerHaptic('success');
    nextCard();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-44">
      
      {/* Card Header & Audio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {t('stepOf')} ४ / ५
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
          {t('card4Title')}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t('card4Sub')}
        </p>
      </div>

      {/* 2-Column Crop Tiles Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {CROPS.map((c) => {
          const isSelected = farmData.previousCrop === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectCrop(c.id)}
              className={`p-4 rounded-3xl border-2 transition-all active:scale-[0.98] flex flex-col items-center text-center relative ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/30'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs">check</span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 ${c.iconBg}`}>
                <span className="material-symbols-outlined text-2xl">{c.icon}</span>
              </div>

              <h3 className="text-base font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                {c.title}
              </h3>
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                {c.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sticky Bottom Action Bar with Back & Continue (Disabled until selected) */}
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
          onClick={handleContinue}
          disabled={!isSelectedAny}
          className={`w-2/3 py-4 px-6 rounded-full font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
            isSelectedAny
              ? 'bg-primary text-on-primary active:scale-[0.98] cursor-pointer'
              : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{t('continue')} (बुवाई का मौसम)</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
