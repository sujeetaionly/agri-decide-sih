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

  const selectedSoilObj = soilTypesList.find((s) => s.id === farmData.soilType);
  const selectedSoilName = selectedSoilObj ? (selectedSoilObj.name[language] || selectedSoilObj.name.hi) : '';

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = isSelectedAny
      ? `${t('card2Title')}। वर्तमान चयन ${selectedSoilName} है।`
      : `${t('card2Title')}। सही मिट्टी की पहचान से अधिक पैदावार देने वाली उपयुक्त फसल तय होती है।`;
    speakText(msg, language);
  };

  const handleContinue = () => {
    if (!isSelectedAny) return;
    triggerHaptic('success');
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
            {t('card2Category')}
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
          {t('card2Title')}
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          {t('card2Sub')}
        </p>
      </div>

      {/* Well-Proportioned Soil Cards List */}
      <div className="space-y-4">
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
                  ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-md ring-2 ring-primary/20'
                  : 'bg-white dark:bg-[#1E231B] border-stone-300 dark:border-stone-700 hover:border-primary/40'
              }`}
            >
              {/* UPPER PART: Unobstructed Realistic Soil Photo Banner */}
              <div className="relative w-full h-36 overflow-hidden bg-stone-900">
                <img
                  src={soil.imageUrl}
                  alt={soilName}
                  className="w-full h-full object-cover"
                />

                {/* Selection Indicator Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl">
                      <span className="material-symbols-outlined text-2xl">check</span>
                    </div>
                  </div>
                )}
              </div>

              {/* LOWER PART: Soil Information with Clean Moisture Tag */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#1A1C18] dark:text-[#E2E3DC] font-headline">
                    {soilName}
                  </h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-primary bg-primary text-white' : 'border-stone-400'
                  }`}>
                    {isSelected && <span className="material-symbols-outlined text-xs font-bold">check</span>}
                  </div>
                </div>

                {/* Moisture Retention Indicator Tag */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 text-[11px] font-bold">
                    <span className="material-symbols-outlined text-xs text-sky-600 dark:text-sky-400">water_drop</span>
                    <span>नमी धारण: {soil.waterRetention.split(' ')[0]}</span>
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                  {soilDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* True Progressive Blur Layer with Gradient Mask */}
      <div
        className="fixed bottom-16 inset-x-0 z-30 pointer-events-none max-w-md mx-auto h-20"
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
            className="py-3.5 px-5 rounded-full bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>{t('back')}</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!isSelectedAny}
            className={`flex-1 py-3.5 px-6 rounded-full font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
              isSelectedAny
                ? 'bg-primary hover:bg-primary/95 text-white active:scale-[0.98] cursor-pointer shadow-none'
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
