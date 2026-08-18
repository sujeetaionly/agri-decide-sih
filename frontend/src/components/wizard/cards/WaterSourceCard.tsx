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
      subtitle: 'नहर या बारहमासी ट्यूबवेल • सभी फसलों के लिए भरपूर पानी',
      icon: 'water',
      iconBg: 'bg-blue-500/15 text-blue-600',
    },
    {
      id: 'MEDIUM',
      source: 'WELL',
      title: t('waterMedium'),
      subtitle: 'कुआं या सीमित ट्यूबवेल • 2-3 सिंचाई की सुविधा',
      icon: 'water_drop',
      iconBg: 'bg-teal-500/15 text-teal-600',
    },
    {
      id: 'LOW',
      source: 'RAINFED',
      title: t('waterRainfed'),
      subtitle: 'सिंचाई का कोई साधन नहीं • केवल मानसूनी बारिश पर निर्भर',
      icon: 'cloud_queue',
      iconBg: 'bg-amber-500/15 text-amber-600',
    },
  ];

  const handleSelectWater = (levelId: string, sourceId: string) => {
    triggerHaptic('medium');
    updateFarmData({ waterCapacity: levelId, waterSource: sourceId });
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const selectedObj = WATER_LEVELS.find((w) => w.id === farmData.waterCapacity);
    const msg = isSelectedAny
      ? `${t('card3Title')}। वर्तमान चयन ${selectedObj?.title || ''} है।`
      : `${t('card3Title')}। ${t('card3Sub')}`;
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
            {t('stepOf')} ३ / ५
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
          {t('card3Title')}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
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
              className={`w-full text-left p-5 rounded-3xl border-2 transition-all active:scale-[0.98] flex gap-4 items-center ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/30'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${w.iconBg}`}>
                <span className="material-symbols-outlined text-3xl">{w.icon}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                    {w.title}
                  </h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-primary bg-primary text-white' : 'border-stone-400'
                  }`}>
                    {isSelected && <span className="material-symbols-outlined text-xs">check</span>}
                  </div>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  {w.subtitle}
                </p>
              </div>
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
          <span>{t('continue')}</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
