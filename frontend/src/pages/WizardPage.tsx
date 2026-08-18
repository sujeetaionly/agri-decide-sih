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
  onOpenMyCrops: () => void;
  onOpenSettings: () => void;
}

export const WizardPage: React.FC<WizardPageProps> = ({
  onReturnHome,
  onOpenMyCrops,
  onOpenSettings,
}) => {
  const { currentCard, prevCard } = useWizard();
  const { t } = useLanguage();

  const handleNavChange = (tab: NavTab) => {
    if (tab === 'home') onReturnHome();
    else if (tab === 'my-crops') onOpenMyCrops();
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
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between pt-14 pb-20">
      
      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
          <button
            onClick={handleHeaderBack}
            className="flex items-center gap-1 text-xs font-bold text-stone-700 dark:text-stone-300 active:scale-95 py-1 px-2 rounded-lg"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>{t('back')}</span>
          </button>

          <span className="font-bold text-base text-primary font-headline">
            {t('appName')}
          </span>

          <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{t('networkConnected')}</span>
          </div>
        </div>

        {/* Progress Bar (Only during 5-question questionnaire) */}
        {currentCard <= 5 && (
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1">
            <div
              className="bg-primary h-1 transition-all duration-300"
              style={{ width: `${(currentCard / 5) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Single-Question Card Canvas */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4">
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
