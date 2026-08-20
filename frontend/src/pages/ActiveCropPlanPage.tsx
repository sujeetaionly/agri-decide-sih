import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const { topRecommendation } = useWizard();
  const { language, t } = useLanguage();

  const audioText = language === 'mr'
    ? 'माझे पीक पृष्ठ. आपल्या निवडलेल्या पिकाचे १२० दिवसांचे कृषी वेळापत्रक येथे दिले आहे.'
    : language === 'gu'
    ? 'મારો પાક પેજ. તમારા પસંદ કરેલા પાકનું ૧૨૦ દિવસનું કૃષિ આયોજન અહીં આપેલ છે.'
    : language === 'en'
    ? 'My Crop page. Your selected crop 120-day agricultural action plan is shown below.'
    : 'मेरी फसल पृष्ठ। आपकी चयनित फसल की १२०-दिवसीय संपूर्ण कृषि कार्य-योजना और आवश्यक कार्य यहां दिए गए हैं।';

  const handleNavChange = (tab: NavTab) => {
    if (tab === 'home') onGoToHome();
    else if (tab === 'history') onOpenHistory();
    else if (tab === 'settings') onOpenSettings();
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col font-body">
      {/* 1. Top Status Bar */}
      <HomeTopAppBar audioText={audioText} />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 pb-28 animate-fadeIn">
        {/* 120-Day Action Plan Component */}
        <MilestoneCalendarStep onReturnHome={onGoToHome} />
      </main>

      {/* 3. Persistent 4-Tab Bottom Navigation */}
      <HomeBottomNav activeTab="my-crop" onTabChange={handleNavChange} />
    </div>
  );
};
