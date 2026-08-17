import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
  const { isHindi } = useLanguage();

  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      titleEn: 'Enter Farm & Soil Profile',
      titleHi: 'खेत और मिट्टी का विवरण',
      descEn: 'Provide your location (GPS or manual), acreage, and choose from 4 primary soil types.',
      descHi: 'जीपीएस या ड्रॉपडाउन से स्थान चुनें, जमीन का आकार और मिट्टी का प्रकार दर्ज करें।',
      icon: 'terrain',
    },
    {
      num: '2',
      titleEn: 'AI Climate & Monsoon Analysis',
      titleHi: 'एआई मौसम एवं मानसूनी मिलान',
      descEn: 'We cross-reference IMD rainfall predictions and mandi prices to find high-yield crops.',
      descHi: 'एआई मौसम विभाग के बारिश डेटा और मंडी भाव का मिलान कर सबसे सुरक्षित फसल तय करता है।',
      icon: 'psychology',
    },
    {
      num: '3',
      titleEn: '120-Day Voice-Guided Action Plan',
      titleHi: '120 दिन का ऑडियो एक्शन प्लान',
      descEn: 'Get step-by-step guidance from Day 0 sowing to Day 120 harvest with Hindi voice instructions.',
      descHi: 'बुवाई से लेकर कटाई तक के हर चरण पर आवाज में निर्देश पाएं, बिना इंटरनेट भी।',
      icon: 'event_note',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-level-3 border border-outline-variant p-6 md:p-8 space-y-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[22px]">info</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">
              {isHindi ? 'यह कैसे काम करता है?' : 'How It Works'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.num} className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex items-start gap-3.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-on-primary font-bold text-sm shrink-0">
                {s.num}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-on-surface">
                  {isHindi ? s.titleHi : s.titleEn}
                </h4>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  {isHindi ? s.descHi : s.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex gap-3">
          <Button variant="outline" size="md" onClick={onClose} className="w-1/3">
            {isHindi ? 'बंद करें' : 'Close'}
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={() => {
              onClose();
              onStart();
            }}
          >
            <span>{isHindi ? 'शुरू करें' : 'Start Advisory'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
