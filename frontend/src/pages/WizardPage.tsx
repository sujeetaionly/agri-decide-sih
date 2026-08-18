import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { useLanguage } from '@/context/LanguageContext';
import { Header } from '@/components/common/Header';
import { WizardStepper } from '@/components/common/WizardStepper';
import { StickyActionBar } from '@/components/common/StickyActionBar';
import { LocationStep } from '@/components/wizard/LocationStep';
import { FarmSoilStep } from '@/components/wizard/FarmSoilStep';
import { CropsVoiceStep } from '@/components/wizard/CropsVoiceStep';
import { RecommendationsStep } from '@/components/wizard/RecommendationsStep';
import { WhatIfStep } from '@/components/wizard/WhatIfStep';
import { MilestoneCalendarStep } from '@/components/wizard/MilestoneCalendarStep';

interface WizardPageProps {
  onReturnHome: () => void;
}

export const WizardPage: React.FC<WizardPageProps> = ({ onReturnHome }) => {
  const { currentStep, nextStep, prevStep, goToStep } = useWizard();
  const { isHindi } = useLanguage();

  const handleBack = () => {
    if (currentStep === 1) {
      onReturnHome();
    } else {
      prevStep();
    }
  };

  const getContinueText = () => {
    switch (currentStep) {
      case 1:
        return { en: 'Continue to Soil Info', hi: 'मिट्टी की जानकारी भरें' };
      case 2:
        return { en: 'Continue to Crops', hi: 'फसल विकल्प चुनें' };
      case 3:
        return { en: 'Generate AI Recommendations', hi: 'एआई सलाह देखें' };
      case 4:
        return { en: 'Test What-If Scenarios', hi: 'मौसम सिमुलेशन टेस्ट करें' };
      case 5:
        return { en: 'View 120-Day Action Plan', hi: '120 दिन की योजना देखें' };
      default:
        return { en: 'Continue', hi: 'आगे बढ़ें' };
    }
  };

  const cText = getContinueText();

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      {/* Sticky Header with Back Button */}
      <Header
        showBack
        onBack={handleBack}
        title="Agri-Decide"
        titleHi="कृषि-वाइज़ एआई (Agri-Decide)"
      />

      {/* 6-Segment Step Stepper */}
      <WizardStepper currentStep={currentStep} totalSteps={6} />

      {/* Main Step Canvas */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 md:px-5 py-5">
        {currentStep === 1 && <LocationStep />}
        {currentStep === 2 && <FarmSoilStep />}
        {currentStep === 3 && <CropsVoiceStep />}
        {currentStep === 4 && <RecommendationsStep />}
        {currentStep === 5 && <WhatIfStep />}
        {currentStep === 6 && <MilestoneCalendarStep onReturnHome={onReturnHome} />}
      </main>

      {/* Sticky Bottom Action Bar for Steps 1 through 5 */}
      {currentStep < 6 && (
        <StickyActionBar
          onBack={handleBack}
          onContinue={nextStep}
          continueText={cText.en}
          continueTextHi={cText.hi}
        />
      )}
    </div>
  );
};
