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
    <div className="space-y-5 animate-fadeIn pb-36">
      
      {/* Question Title & Reassurance Subtitle with Audio */}
      <div className="space-y-2 pb-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug flex-1">
            {t('card2Title')}
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
          सही मिट्टी की पहचान से अधिक पैदावार देने वाली उपयुक्त फसल तय होती है।
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
                  ? 'bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-700 dark:border-emerald-500 shadow-md ring-2 ring-emerald-700/20'
                  : 'bg-white dark:bg-[#1E231B] border-stone-300 dark:border-stone-700 hover:border-emerald-600/50'
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
                  <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xl">
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
                    isSelected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-400'
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
            onClick={handleContinue}
            disabled={!isSelectedAny}
            className={`flex-1 py-3.5 px-6 rounded-full font-extrabold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
              isSelectedAny
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-[0.98] cursor-pointer'
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
