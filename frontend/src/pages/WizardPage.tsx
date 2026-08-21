import React from 'react';
import { useWizard } from '../context/WizardContext';
import { useLanguage } from '../context/LanguageContext';
import { FarmSizeCard } from '../components/wizard/cards/FarmSizeCard';
import { SoilTypeCard } from '../components/wizard/cards/SoilTypeCard';
import { WaterSourceCard } from '../components/wizard/cards/WaterSourceCard';
import { FarmEquipmentCard } from '../components/wizard/cards/FarmEquipmentCard';
import { PreviousCropCard } from '../components/wizard/cards/PreviousCropCard';
import { SowingSeasonCard } from '../components/wizard/cards/SowingSeasonCard';
import { IntendedCropCard } from '../components/wizard/cards/IntendedCropCard';
import { RecommendationsStep } from '../components/wizard/RecommendationsStep';
import { WhatIfStep } from '../components/wizard/WhatIfStep';
import { MilestoneCalendarStep } from '../components/wizard/MilestoneCalendarStep';
import { HomeBottomNav, NavTab } from '../components/home/HomeBottomNav';
import { triggerHaptic } from '../lib/utils';
import { speakText } from '../lib/speech';

interface WizardPageProps {
  onReturnHome: () => void;
  onOpenMyCropPlan: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  openedFromHistory?: boolean;
}

export const WizardPage: React.FC<WizardPageProps> = ({
  onReturnHome,
  onOpenMyCropPlan,
  onOpenHistory,
  onOpenSettings,
  openedFromHistory = false,
}) => {
  const { currentCard, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const getQuestionProgressText = (current: number, total: number = 7) => {
    const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    const GUJARATI_DIGITS = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];

    if (language === 'en') {
      return `Question ${current} of ${total}`;
    }
    if (language === 'gu') {
      const c = String(current).replace(/\d/g, (d) => GUJARATI_DIGITS[Number(d)]);
      const t = String(total).replace(/\d/g, (d) => GUJARATI_DIGITS[Number(d)]);
      return `પ્રશ્ન ${c} / ${t}`;
    }
    if (language === 'mr') {
      const c = String(current).replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
      const t = String(total).replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
      return `प्रश्न ${c} / ${t}`;
    }
    if (language === 'raj') {
      const c = String(current).replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
      const t = String(total).replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
      return `सवाल ${c} / ${t}`;
    }
    // Default Hindi
    const c = String(current).replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
    const t = String(total).replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
    return `प्रश्न ${c} / ${t}`;
  };

  const handleNavChange = (tab: NavTab) => {
    if (tab === 'home') onReturnHome();
    else if (tab === 'my-crop') onOpenMyCropPlan();
    else if (tab === 'history') onOpenHistory();
    else if (tab === 'settings') onOpenSettings();
  };

  const handleHeaderBack = () => {
    triggerHaptic('light');
    if (openedFromHistory && (currentCard === 8 || currentCard === 7)) {
      onOpenHistory();
    } else if (currentCard <= 1) {
      onReturnHome();
    } else {
      prevCard();
    }
  };

  const [isSpeakingHeader, setIsSpeakingHeader] = React.useState(false);

  const handleHeaderSpeak = () => {
    triggerHaptic('light');
    setIsSpeakingHeader(true);
    let msg = t('appName');
    if (currentCard === 1) msg = `${t('card1Title')}। ${t('card1Sub')}`;
    else if (currentCard === 2) msg = `${t('card2Title')}। ${t('card2Sub')}`;
    else if (currentCard === 3) msg = `${t('card3Title')}। ${t('card3Sub')}`;
    else if (currentCard === 4) msg = `${t('cardEquipmentTitle')}। ${t('cardEquipmentSub')}`;
    else if (currentCard === 5) msg = `${t('card4Title')}। ${t('card4Sub')}`;
    else if (currentCard === 6) msg = `${t('card5Title')}। ${t('card5Sub')}`;
    else if (currentCard === 7) msg = `${t('card6Title')}। ${t('card6Sub')}`;
    else if (currentCard === 8) msg = t('resultsTitle');

    speakText(
      msg,
      language,
      () => setIsSpeakingHeader(true),
      () => setIsSpeakingHeader(false),
      () => setIsSpeakingHeader(false)
    );
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col font-body">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 pt-[calc(env(safe-area-inset-top,32px)+0.5rem)] shadow-2xs">
        <div className="flex items-center justify-between h-12 px-4 max-w-md mx-auto">
          <button
            onClick={handleHeaderBack}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 active:scale-95 cursor-pointer transition-colors"
            title={t('back')}
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>

          <span className="font-black text-base text-on-surface-light dark:text-on-surface-dark font-headline">
            {t('appName')}
          </span>

          <button
            type="button"
            onClick={handleHeaderSpeak}
            aria-label="Listen"
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer aspect-square ${
              isSpeakingHeader
                ? 'bg-primary text-white border-primary animate-pulse shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-primary border-stone-200 dark:border-stone-700 hover:bg-primary/10'
            }`}
          >
            <span className="material-symbols-outlined text-lg">volume_up</span>
          </button>
        </div>

        {/* Segmented 7-Step Progress Bar Indicator & Step Header */}
        {currentCard <= 7 && (
          <div className="px-4 pb-2.5 pt-0.5 space-y-1.5 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-primary dark:text-primary-fixed flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>{getQuestionProgressText(currentCard, 7)}</span>
              </span>
            </div>

            {/* 7 Segmented Progress Pills */}
            <div className="flex gap-1.5 w-full">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                    step <= currentCard
                      ? 'bg-primary'
                      : 'bg-stone-200 dark:bg-stone-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Questionnaire / Recommendations / Action Plan Step */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-3 pb-28 animate-fadeIn">
        {currentCard === 1 && <FarmSizeCard />}
        {currentCard === 2 && <SoilTypeCard />}
        {currentCard === 3 && <WaterSourceCard />}
        {currentCard === 4 && <FarmEquipmentCard />}
        {currentCard === 5 && <PreviousCropCard />}
        {currentCard === 6 && <SowingSeasonCard />}
        {currentCard === 7 && <IntendedCropCard />}
        {currentCard === 8 && <RecommendationsStep onOpenMyCropPlan={onOpenMyCropPlan} />}
        {currentCard === 9 && <WhatIfStep onOpenMyCropPlan={onOpenMyCropPlan} />}
        {currentCard === 10 && <MilestoneCalendarStep onReturnHome={onReturnHome} />}
      </main>

      {/* Persistent Bottom Navigation Bar on Every Page */}
      <HomeBottomNav
        activeTab={currentCard === 10 ? 'my-crop' : undefined}
        onTabChange={handleNavChange}
      />
    </div>
  );
};

