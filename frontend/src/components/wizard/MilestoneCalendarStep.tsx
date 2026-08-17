import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useWizard } from '@/context/WizardContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AudioButton } from '@/components/common/AudioButton';
import confetti from 'canvas-confetti';

interface MilestoneCalendarStepProps {
  onReturnHome: () => void;
}

export const MilestoneCalendarStep: React.FC<MilestoneCalendarStepProps> = ({
  onReturnHome,
}) => {
  const { isHindi } = useLanguage();
  const { selectedCrop, state, toggleOfflineSave } = useWizard();
  const [completedDays, setCompletedDays] = useState<number[]>([0]);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const toggleDayComplete = (day: number) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleDownloadPdf = () => {
    setIsDownloaded(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            {isHindi ? 'आपकी 120 दिवसीय फसल कार्य-योजना' : 'Your Crop Milestone Plan'}
          </h2>
          <AudioButton
            id="step6-calendar-audio"
            textHi={`बधाई हो! आपकी ${selectedCrop.nameHi} की 120 दिवसीय कार्य-योजना तैयार है। दिन शून्य पर बीज उपचार से लेकर 120वें दिन सुरक्षित कटाई तक के सभी कार्य नीचे दिए गए हैं। आप इसे बिना इंटरनेट के भी देख सकते हैं।`}
            textEn={`Congratulations! Your 120-day customized action plan for ${selectedCrop.name} is ready. Step-by-step guidance from Day 0 seed treatment to Day 120 harvest is provided below.`}
          />
        </div>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          {isHindi
            ? 'प्रत्येक चरण पर क्लिक करके आवाज में विस्तृत निर्देश सुनें और काम पूरा होने पर टिक करें।'
            : 'Listen to voice instructions for each stage and check off tasks as you complete them.'}
        </p>
      </div>

      {/* Selected Crop Summary Card */}
      <Card className="p-5 bg-gradient-to-r from-primary-container/15 to-emerald-100/50 border-2 border-primary/40 space-y-4 shadow-level-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedCrop.image}
              alt={selectedCrop.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-primary shadow-sm"
            />
            <div>
              <h3 className="text-xl font-bold text-on-surface">
                {isHindi ? selectedCrop.nameHi : selectedCrop.name}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {isHindi ? 'खरीफ 2026' : 'Kharif 2026'} • {state.farmSoil.area} {state.farmSoil.unit} • {state.location.tehsil}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleOfflineSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all btn-tactile ${
              state.isOfflineSaved
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-surface-container text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {state.isOfflineSaved ? 'offline_pin' : 'cloud_off'}
            </span>
            <span>{state.isOfflineSaved ? (isHindi ? 'ऑफलाइन सुरक्षित' : 'Saved Offline') : (isHindi ? 'सेव करें' : 'Save Offline')}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-outline-variant/40">
          <div className="p-2 rounded-lg bg-surface-container-lowest">
            <div className="text-on-surface-variant">{isHindi ? 'अनुमानित उपज' : 'Est. Yield'}</div>
            <div className="font-bold text-on-surface text-sm">{isHindi ? selectedCrop.yieldPerAcreHi : selectedCrop.yieldPerAcre}</div>
          </div>
          <div className="p-2 rounded-lg bg-surface-container-lowest">
            <div className="text-on-surface-variant">{isHindi ? 'शुद्ध लाभ' : 'Net Profit'}</div>
            <div className="font-bold text-emerald-800 text-sm">{isHindi ? selectedCrop.profitPerAcreHi : selectedCrop.profitPerAcre}</div>
          </div>
          <div className="p-2 rounded-lg bg-surface-container-lowest">
            <div className="text-on-surface-variant">{isHindi ? 'फसल चक्र' : 'Duration'}</div>
            <div className="font-bold text-on-surface text-sm">{isHindi ? selectedCrop.durationDaysHi : selectedCrop.durationDays}</div>
          </div>
        </div>
      </Card>

      {/* 7-Stage Vertical Milestone Timeline */}
      <div className="space-y-4 pt-2">
        <h4 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[24px]">timeline</span>
          <span>{isHindi ? 'महत्वपूर्ण चरण व तारीखें (Milestone Timeline)' : 'Lifecycle Milestone Timeline'}</span>
        </h4>

        <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-primary/40">
          {selectedCrop.milestones.map((m) => {
            const isCompleted = completedDays.includes(m.day);
            return (
              <div key={m.day} className="relative space-y-2">
                {/* Timeline node icon */}
                <button
                  onClick={() => toggleDayComplete(m.day)}
                  aria-label={`Toggle Day ${m.day} completion`}
                  className={`absolute -left-6 md:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-primary border-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-lowest border-primary text-transparent hover:border-primary/80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </button>

                {/* Milestone Content Card */}
                <Card
                  className={`p-4 md:p-5 border-2 transition-all space-y-3 ${
                    isCompleted
                      ? 'border-outline-variant/60 bg-surface-container-lowest/80'
                      : 'border-primary/60 bg-surface-container-lowest shadow-level-1'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-on-primary">
                          Day {m.day}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {m.tag}
                        </Badge>
                      </div>

                      <h5 className="text-base md:text-lg font-bold text-on-surface mt-1.5">
                        {isHindi ? m.stageNameHi : m.stageName}
                      </h5>
                    </div>

                    <AudioButton
                      id={`milestone-${m.day}-audio`}
                      textHi={m.audioPromptHi}
                      textEn={m.audioPromptEn}
                      size="sm"
                    />
                  </div>

                  <p className="text-xs md:text-sm text-on-surface leading-relaxed">
                    {isHindi ? m.actionHi : m.action}
                  </p>

                  <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleDayComplete(m.day)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isCompleted ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span>
                        {isCompleted
                          ? isHindi
                            ? 'कार्य पूर्ण'
                            : 'Task Completed'
                          : isHindi
                          ? 'कार्य पूर्ण चिह्नित करें'
                          : 'Mark as Done'}
                      </span>
                    </button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Action Buttons Card */}
      <Card className="p-5 space-y-3 bg-surface-container-lowest border-outline-variant/60 shadow-level-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleDownloadPdf}
            className="min-h-[56px] text-base font-bold flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[22px]">download</span>
            <span>{isDownloaded ? (isHindi ? 'डाउनलोड हो गया!' : 'Downloaded!') : (isHindi ? 'योजना डाउनलोड करें (PDF)' : 'Download Plan (PDF)')}</span>
          </Button>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onReturnHome}
            className="min-h-[56px] text-base md:text-lg flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[22px]">home</span>
            <span>{isHindi ? 'मुख्य पृष्ठ पर लौटें' : 'Return to Dashboard'}</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
