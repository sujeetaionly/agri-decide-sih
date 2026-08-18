import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface WizardStepperProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_TITLES = [
  { en: 'Location', hi: 'खेत का स्थान' },
  { en: 'Farm & Soil', hi: 'खेत व मिट्टी' },
  { en: 'Crops & Sowing', hi: 'फसल व बुवाई' },
  { en: 'AI Recommendations', hi: 'एआई सलाह' },
  { en: 'What-If Simulation', hi: 'मौसम सिमुलेशन' },
  { en: 'Milestone Calendar', hi: 'फसल कैलेंडर' },
];

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  totalSteps = 6,
}) => {
  const { isHindi } = useLanguage();
  const currentTitle = STEP_TITLES[currentStep - 1] || STEP_TITLES[0];

  return (
    <div className="w-full px-4 md:px-6 pt-3 pb-2 space-y-2 bg-surface-container-low/40 border-b border-outline-variant/40">
      <div className="flex items-center justify-between text-xs md:text-sm font-bold text-on-surface">
        <span className="text-primary flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          {isHindi ? `चरण ${currentStep} / ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
        </span>
        <span className="text-on-surface-variant font-medium">
          {isHindi ? currentTitle.hi : currentTitle.en}
        </span>
      </div>

      {/* 6-segment horizontal progress bar */}
      <div className="grid grid-cols-6 gap-1.5 w-full">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'bg-primary shadow-sm'
                  : isCompleted
                  ? 'bg-primary/60'
                  : 'bg-surface-container-high'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
