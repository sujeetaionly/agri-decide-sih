import React from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { soilTypesList } from '../../../data/soilTypesData';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

export const SoilTypeCard: React.FC = () => {
  const { farmData, updateFarmData, nextCard, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const isSelectedAny = farmData.soilType !== null;

  const handleSelectSoil = (soilId: string) => {
    triggerHaptic('medium');
    updateFarmData({ soilType: soilId });
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const selectedSoilObj = soilTypesList.find((s) => s.id === farmData.soilType);
    const soilName = selectedSoilObj ? selectedSoilObj.name[language] || selectedSoilObj.name.hi : 'कोई नहीं';
    const msg = isSelectedAny
      ? `${t('card2Title')}। वर्तमान चयन ${soilName} है।`
      : `${t('card2Title')}। ${t('card2Sub')}`;
    speakText(msg, language);
  };

  const handleContinue = () => {
    if (!isSelectedAny) return;
    triggerHaptic('success');
    nextCard();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-48">
      
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
          नीचे दिए गए बड़े फोटो कार्ड देखकर अपने खेत की मिट्टी से मिलती-जुलती मिट्टी चुनें।
        </p>
      </div>

      {/* Big Soil Cards List (Upper: Image, Lower: Info) */}
      <div className="space-y-5">
        {soilTypesList.map((soil) => {
          const isSelected = farmData.soilType === soil.id;
          const soilName = soil.name[language] || soil.name.hi;
          const soilDesc = soil.description[language] || soil.description.hi;

          return (
            <div
              key={soil.id}
              onClick={() => handleSelectSoil(soil.id)}
              className={`w-full rounded-3xl border-2 transition-all cursor-pointer overflow-hidden shadow-sm active:scale-[0.99] ${
                isSelected
                  ? 'bg-primary/5 border-primary shadow-lg ring-4 ring-primary/25'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/50'
              }`}
            >
              {/* UPPER PART: Prominent Large Soil Image Banner */}
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-stone-900">
                <img
                  src={soil.imageUrl}
                  alt={soilName}
                  className="w-full h-full object-cover"
                />

                {/* Moisture Retention Badge */}
                <div className="absolute top-3 right-3 bg-black/65 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 border border-white/20">
                  <span className="material-symbols-outlined text-sm text-blue-400">water_drop</span>
                  <span>नमी: {soil.waterRetention.split(' ')[0]}</span>
                </div>

                {/* Selection Indicator Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl">
                      <span className="material-symbols-outlined text-3xl">check</span>
                    </div>
                  </div>
                )}
              </div>

              {/* LOWER PART: Soil Information & Suitable Crops */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-[#1A1C18] dark:text-[#E2E3DC] font-headline">
                    {soilName}
                  </h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-primary bg-primary text-white' : 'border-stone-400'
                  }`}>
                    {isSelected && <span className="material-symbols-outlined text-xs">check</span>}
                  </div>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {soilDesc}
                </p>
              </div>
            </div>
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
          <span>{t('continue')}</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
