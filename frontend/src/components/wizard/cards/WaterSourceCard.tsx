import React from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

export const WaterSourceCard: React.FC = () => {
  const { farmData, updateFarmData, nextCard, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const isSelectedAny = farmData.waterCapacity !== null;

  const WATER_LEVELS = [
    {
      id: 'HIGH',
      source: 'CANAL',
      title: t('waterHigh'),
      subtitle: t('waterHighDesc'),
      icon: 'waves',
    },
    {
      id: 'MEDIUM',
      source: 'WELL',
      title: t('waterMedium'),
      subtitle: t('waterMediumDesc'),
      icon: 'water_drop',
    },
    {
      id: 'LOW',
      source: 'RAINFED',
      title: t('waterRainfed'),
      subtitle: t('waterRainfedDesc'),
      icon: 'rainy',
    },
  ];

  const handleSelectWater = (levelId: string, sourceId: string) => {
    triggerHaptic('medium');
    updateFarmData({ waterCapacity: levelId, waterSource: sourceId });
  };

  const selectedObj = WATER_LEVELS.find((w) => w.id === farmData.waterCapacity);

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = isSelectedAny
      ? `${t('card3Title')}। ${t('appName')}: ${selectedObj?.title || ''}`
      : `${t('card3Title')}। ${t('card3Sub')}`;
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
            {t('card3Category')}
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
          {t('card3Title')}
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          {t('card3Sub')}
        </p>
      </div>

      {/* Water Options List */}
      <div className="space-y-3.5">
        {WATER_LEVELS.map((w) => {
          const isSelected = farmData.waterCapacity === w.id;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => handleSelectWater(w.id, w.source)}
              className={`w-full text-left p-5 rounded-3xl border-2 transition-all active:scale-[0.98] flex gap-4 items-center cursor-pointer ${
                isSelected
                  ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-md ring-2 ring-primary/20'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
              }`}
            >
              {/* Full Uncut Material Symbol Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-primary/10 text-primary dark:text-primary-fixed border border-primary/20'
                }`}
              >
                <span className="material-symbols-outlined text-3xl [font-variation-settings:'FILL'_1]">
                  {w.icon}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-black font-headline text-stone-950 dark:text-stone-50 leading-snug tracking-tight">
                    {w.title}
                  </h3>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-stone-300 dark:border-stone-600 bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-sm font-black leading-none">
                        check
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium mt-1.5 leading-relaxed">
                  {w.subtitle}
                </p>
              </div>
            </button>
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
            className="py-3.5 px-5 rounded-full bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
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
