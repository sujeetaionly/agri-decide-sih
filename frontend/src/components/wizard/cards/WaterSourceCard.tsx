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
      icon: 'waves',
      iconBg: 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-500/30 shadow-xs',
    },
    {
      id: 'MEDIUM',
      source: 'WELL',
      title: t('waterMedium'),
      subtitle: 'कुआं या सीमित ट्यूबवेल • २-३ सिंचाई की सुविधा',
      icon: 'water_drop',
      iconBg: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-xs',
    },
    {
      id: 'LOW',
      source: 'RAINFED',
      title: t('waterRainfed'),
      subtitle: 'सिंचाई का कोई साधन नहीं • केवल मानसूनी बारिश पर निर्भर',
      icon: 'cloudy_snowing',
      iconBg: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs',
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
      ? `${t('card3Title')}। वर्तमान चयन ${selectedObj?.title || ''} है।`
      : `${t('card3Title')}। सिंचाई की उपलब्धता के आधार पर फसल की पानी की जरूरत का मिलान होता है।`;
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
    <div className="space-y-6 animate-fadeIn pb-24">
      
      {/* Question Title & Reassurance Subtitle with Audio */}
      <div className="space-y-2 pb-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug flex-1">
            {t('card3Title')}
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
          सिंचाई की उपलब्धता के आधार पर फसल की पानी की जरूरत का मिलान होता है।
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
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/30 border-emerald-700 dark:border-emerald-500 shadow-md ring-2 ring-emerald-700/20'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-emerald-600/40'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${w.iconBg}`}>
                <span className="material-symbols-outlined text-3xl [font-variation-settings:'FILL'_1]">{w.icon}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                    {w.title}
                  </h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-400'
                  }`}>
                    {isSelected && <span className="material-symbols-outlined text-xs font-bold">check</span>}
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
