import React from 'react';
import { useWizard } from '../context/WizardContext';
import { useLanguage } from '../context/LanguageContext';
import { FarmSizeCard } from '../components/wizard/cards/FarmSizeCard';
import { SoilTypeCard } from '../components/wizard/cards/SoilTypeCard';
import { WaterSourceCard } from '../components/wizard/cards/WaterSourceCard';
import { PreviousCropCard } from '../components/wizard/cards/PreviousCropCard';
import { SowingSeasonCard } from '../components/wizard/cards/SowingSeasonCard';
import { IntendedCropCard } from '../components/wizard/cards/IntendedCropCard';
import { RecommendationsStep } from '../components/wizard/RecommendationsStep';
import { WhatIfStep } from '../components/wizard/WhatIfStep';
import { MilestoneCalendarStep } from '../components/wizard/MilestoneCalendarStep';
import { HomeBottomNav, NavTab } from '../components/home/HomeBottomNav';
import { triggerHaptic } from '../lib/utils';

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

  const getQuestionProgressText = (current: number, total: number = 6) => {
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
    if (openedFromHistory && currentCard === 7) {
      onOpenHistory();
    } else if (currentCard <= 1) {
      onReturnHome();
    } else {
      prevCard();
    }
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col font-body">
      
      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 pt-[env(safe-area-inset-top)] shadow-2xs">
        <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
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

          <div className="w-9" />
        </div>

        {/* Segmented 6-Step Progress Bar Indicator & Step Header */}
        {currentCard <= 6 && (
          <div className="px-4 pb-2.5 pt-0.5 space-y-1.5 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-primary dark:text-primary-fixed flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>{getQuestionProgressText(currentCard, 6)}</span>
              </span>
            </div>

            {/* 6 Segmented Progress Pills */}
            <div className="flex gap-1.5 w-full">
              {[1, 2, 3, 4, 5, 6].map((step) => (
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
      <main className={`flex-1 max-w-md mx-auto w-full px-4 ${currentCard <= 6 ? 'pt-[104px]' : 'pt-[68px]'} pb-24`}>
        {currentCard === 1 && <FarmSizeCard />}
        {currentCard === 2 && <SoilTypeCard />}
        {currentCard === 3 && <WaterSourceCard />}
        {currentCard === 4 && <PreviousCropCard />}
        {currentCard === 5 && <SowingSeasonCard />}
        {currentCard === 6 && <IntendedCropCard />}
        {currentCard === 7 && <RecommendationsStep onOpenMyCropPlan={onOpenMyCropPlan} />}
        {currentCard === 8 && <WhatIfStep onOpenMyCropPlan={onOpenMyCropPlan} />}
        {currentCard === 9 && <MilestoneCalendarStep onReturnHome={onReturnHome} />}
      </main>

      {/* Persistent Bottom Navigation Bar on Every Page */}
      <HomeBottomNav onTabChange={handleNavChange} />
    </div>
  );
};

