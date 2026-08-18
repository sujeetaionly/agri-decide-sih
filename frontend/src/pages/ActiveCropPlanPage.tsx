import React, { useState } from 'react';
import { HomeTopAppBar } from '../components/home/HomeTopAppBar';
import { HomeBottomNav, NavTab } from '../components/home/HomeBottomNav';
import { MilestoneCalendarStep } from '../components/wizard/MilestoneCalendarStep';
import { useWizard } from '../context/WizardContext';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../lib/utils';
import { speakText } from '../lib/speech';

interface ActiveCropPlanPageProps {
  onGoToHome: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onStartNewRecommendation: () => void;
}

export const ActiveCropPlanPage: React.FC<ActiveCropPlanPageProps> = ({
  onGoToHome,
  onOpenHistory,
  onOpenSettings,
  onStartNewRecommendation,
}) => {
  const { topRecommendation } = useWizard();
  const { language, t } = useLanguage();

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = `मेरी फसल पृष्ठ। आपकी चयनित फसल की १२०-दिवसीय कृषि कार्य-योजना यहां दी गई है।`;
    speakText(msg, language);
  };

  const handleNavChange = (tab: NavTab) => {
    if (tab === 'home') onGoToHome();
    else if (tab === 'history') onOpenHistory();
    else if (tab === 'settings') onOpenSettings();
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col pt-16 pb-24 font-body">
      {/* 1. Top Status Bar */}
      <HomeTopAppBar />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-3 space-y-4 animate-fadeIn">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black font-headline tracking-tight text-[#1A1C18] dark:text-[#E2E3DC]">
              {t('myCropPlanTitle')}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              १२०-दिवसीय बुवाई से कटाई तक का चरणबद्ध मार्गदर्शन
            </p>
          </div>

          <button
            onClick={handleAudio}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        {/* 120-Day Action Plan Component */}
        <MilestoneCalendarStep onReturnHome={onGoToHome} />
      </main>

      {/* 3. Persistent 4-Tab Bottom Navigation */}
      <HomeBottomNav activeTab="my-crop" onTabChange={handleNavChange} />
    </div>
  );
};
