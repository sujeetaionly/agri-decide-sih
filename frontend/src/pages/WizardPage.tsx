import React from 'react';
import { useWizard } from '../context/WizardContext';
import { useLanguage } from '../context/LanguageContext';
import { FarmSizeCard } from '../components/wizard/cards/FarmSizeCard';
import { SoilTypeCard } from '../components/wizard/cards/SoilTypeCard';
import { WaterSourceCard } from '../components/wizard/cards/WaterSourceCard';
import { PreviousCropCard } from '../components/wizard/cards/PreviousCropCard';
import { SowingSeasonCard } from '../components/wizard/cards/SowingSeasonCard';
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
}

export const WizardPage: React.FC<WizardPageProps> = ({
  onReturnHome,
  onOpenMyCropPlan,
  onOpenHistory,
  onOpenSettings,
}) => {
  const { currentCard, prevCard } = useWizard();
  const { t } = useLanguage();

  const handleNavChange = (tab: NavTab) => {
    if (tab === 'home') onReturnHome();
    else if (tab === 'my-crop') onOpenMyCropPlan();
    else if (tab === 'history') onOpenHistory();
    else if (tab === 'settings') onOpenSettings();
  };

  const handleHeaderBack = () => {
    triggerHaptic('light');
    if (currentCard <= 1) {
      onReturnHome();
    } else {
      prevCard();
    }
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between pb-20 font-body">
      
      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
          <button
            onClick={handleHeaderBack}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 active:scale-95 cursor-pointer"
            title={t('back')}
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>

          <span className="font-bold text-base text-emerald-900 dark:text-emerald-100 font-headline">
            {t('appName')}
          </span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] font-semibold text-stone-600 dark:text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ऑनलाइन</span>
          </div>
        </div>

        {/* Segmented 5-Step Progress Bar Indicator & Step Header */}
        {currentCard <= 5 && (
          <div className="px-4 pb-2.5 pt-1 space-y-1.5 border-t border-stone-100 dark:border-stone-800/80">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>प्रश्न {currentCard} / ५</span>
              </span>
              <span className="text-stone-700 dark:text-stone-300 font-bold">
                {currentCard === 1 && t('wizardStep1Name')}
                {currentCard === 2 && t('wizardStep2Name')}
                {currentCard === 3 && t('wizardStep3Name')}
                {currentCard === 4 && t('wizardStep4Name')}
                {currentCard === 5 && t('wizardStep5Name')}
              </span>
            </div>

            {/* 5 Segmented Progress Pills */}
            <div className="flex gap-1.5 w-full">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                    step <= currentCard
                      ? 'bg-emerald-700 dark:bg-emerald-500 shadow-2xs'
                      : 'bg-stone-200 dark:bg-stone-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Questionnaire / Recommendations / Action Plan Step */}
      <main className={`flex-1 max-w-md mx-auto w-full px-4 ${currentCard <= 5 ? 'pt-[90px]' : 'pt-[64px]'}`}>
        {currentCard === 1 && <FarmSizeCard />}
        {currentCard === 2 && <SoilTypeCard />}
        {currentCard === 3 && <WaterSourceCard />}
        {currentCard === 4 && <PreviousCropCard />}
        {currentCard === 5 && <SowingSeasonCard />}
        {currentCard === 6 && <RecommendationsStep />}
        {currentCard === 7 && <WhatIfStep />}
        {currentCard === 8 && <MilestoneCalendarStep onReturnHome={onReturnHome} />}
      </main>

      {/* Persistent Bottom Navigation Bar on Every Page */}
      <HomeBottomNav onTabChange={handleNavChange} />
    </div>
  );
};
