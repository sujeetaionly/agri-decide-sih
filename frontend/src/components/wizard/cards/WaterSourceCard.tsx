import React from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';

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

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Question Title & Reassurance Subtitle */}
      <div className="space-y-1.5 pt-1 pb-1">
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
    </div>
  );
};
