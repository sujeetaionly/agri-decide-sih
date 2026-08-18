import React from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { soilTypesList } from '../../../data/soilTypesData';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

export const SoilTypeCard: React.FC = () => {
  const { farmData, updateFarmData, nextCard, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const handleSelectSoil = (soilId: string) => {
    triggerHaptic('medium');
    updateFarmData({ soilType: soilId });
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const selectedSoilObj = soilTypesList.find((s) => s.id === farmData.soilType);
    const soilName = selectedSoilObj ? selectedSoilObj.name[language] || selectedSoilObj.name.hi : 'काली मिट्टी';
    const msg = `${t('card2Title')}। ${t('card2Sub')}। वर्तमान चयन ${soilName} है।`;
    speakText(msg, language);
  };

  const getSoilColorGradient = (soilId: string) => {
    switch (soilId) {
      case 'BLACK':
        return 'from-[#2b2b2b] to-[#121212] text-amber-100';
      case 'LOAM':
        return 'from-[#654321] to-[#3d2817] text-amber-50';
      case 'RED':
        return 'from-[#932727] to-[#591414] text-red-50';
      case 'SANDY':
        return 'from-[#b89770] to-[#785b3c] text-stone-900';
      case 'CLAY':
        return 'from-[#543d2b] to-[#2e2016] text-stone-100';
      default:
        return 'from-stone-600 to-stone-800 text-white';
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-48">
      
      {/* Card Header & Audio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {t('stepOf')} २ / ५
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
          {t('card2Title')}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t('card2Sub')}
        </p>
      </div>

      {/* Soil Cards List with Real Photographs & Texture Backdrops */}
      <div className="space-y-3">
        {soilTypesList.map((soil) => {
          const isSelected = farmData.soilType === soil.id;
          const soilName = soil.name[language] || soil.name.hi;
          const soilDesc = soil.description[language] || soil.description.hi;
          const gradient = getSoilColorGradient(soil.id);

          return (
            <button
              key={soil.id}
              type="button"
              onClick={() => handleSelectSoil(soil.id)}
              className={`w-full text-left p-3.5 rounded-3xl border-2 transition-all active:scale-[0.98] flex gap-3.5 items-center relative overflow-hidden ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/30'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
              }`}
            >
              {/* Real Photographic Image Thumbnail with Color Fallback */}
              <div className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <img
                  src={soil.imageUrl}
                  alt={soilName}
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {/* Fallback Icon Texture */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <span className="material-symbols-outlined text-3xl">landscape</span>
                </div>

                {isSelected && (
                  <div className="absolute inset-0 bg-primary/40 z-20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-2xl drop-shadow">check_circle</span>
                  </div>
                )}
              </div>

              {/* Text Description */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className="text-base font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                    {soilName}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex-shrink-0">
                    नमी: {soil.waterRetention.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {soilDesc}
                </p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {soil.suitableCrops.slice(0, 3).map((crop) => (
                    <span
                      key={crop}
                      className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/20"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sticky Bottom Action Bar with Back & Continue */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto flex gap-3 bg-gradient-to-t from-surface-light via-surface-light to-transparent dark:from-surface-dark dark:via-surface-dark pt-4 pb-2">
        <button
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
          onClick={() => {
            triggerHaptic('success');
            nextCard();
          }}
          className="w-2/3 py-4 px-6 rounded-full bg-primary text-on-primary font-bold text-base shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span>{t('continue')} (पानी की व्यवस्था)</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
