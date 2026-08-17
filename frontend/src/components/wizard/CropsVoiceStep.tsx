import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useWizard } from '@/context/WizardContext';
import { Card } from '@/components/ui/card';
import { AudioButton } from '@/components/common/AudioButton';
import { VoiceAssistantSheet } from './VoiceAssistantSheet';

export const CropsVoiceStep: React.FC = () => {
  const { isHindi } = useLanguage();
  const { state, updateCropPreferences } = useWizard();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const quickCropChips = [
    { id: 'Bajra', nameEn: 'Pearl Millet (Bajra)', nameHi: 'बाजरा' },
    { id: 'Moong', nameEn: 'Moong (Green Gram)', nameHi: 'मूंग' },
    { id: 'Groundnut', nameEn: 'Groundnut (Peanut)', nameHi: 'मूंगफली' },
    { id: 'Mustard', nameEn: 'Mustard (Sarson)', nameHi: 'सरसों' },
    { id: 'Gram', nameEn: 'Gram / Chickpea (Chana)', nameHi: 'चना' },
    { id: 'Maize', nameEn: 'Maize (Makka)', nameHi: 'मक्का' },
    { id: 'Cotton', nameEn: 'Cotton (Kapas)', nameHi: 'कपास' },
    { id: 'Soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन' },
  ];

  const handleToggleCrop = (cropId: string) => {
    const current = state.cropPreferences.preferredCrops;
    const exists = current.includes(cropId);
    const updated = exists ? current.filter((c) => c !== cropId) : [...current, cropId];
    updateCropPreferences({ preferredCrops: updated });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleToggleCrop(customInput.trim());
      setCustomInput('');
    }
  };

  const handleVoiceSelect = (cropName: string) => {
    if (!state.cropPreferences.preferredCrops.includes(cropName)) {
      updateCropPreferences({
        preferredCrops: [...state.cropPreferences.preferredCrops, cropName],
      });
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            {isHindi ? 'आप कौन सी फसल उगाने की सोच रहे हैं?' : 'What are you planning to grow?'}
          </h2>
          <AudioButton
            id="step3-crops-audio"
            textHi="चरण 3: अपनी बुवाई की अनुमानित तारीख चुनें और जो फसलें आप उगाना चाहते हैं उन्हें चुनें। आप माइक बटन दबाकर बोलकर भी फसल का नाम बता सकते हैं।"
            textEn="Step 3: Select your planned sowing date and choose your preferred crops, or tap the microphone to speak crop names in your voice."
          />
        </div>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          {isHindi
            ? 'सही बुवाई समय और आपकी पसंद के अनुसार एआई सबसे लाभकारी विकल्प चुनेगा।'
            : 'AI will calibrate recommendations to your planned sowing window and preferences.'}
        </p>
      </div>

      {/* 1. Sowing Date Picker Card */}
      <Card className="p-5 space-y-3 border-outline-variant/60 shadow-level-1">
        <label className="block text-base font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[24px]">event</span>
          <span>{isHindi ? 'बुवाई की अनुमानित तारीख (Expected Sowing Date)' : 'Expected Sowing Date'}</span>
        </label>

        <div className="relative">
          <input
            type="date"
            value={state.cropPreferences.sowingDate}
            onChange={(e) => updateCropPreferences({ sowingDate: e.target.value })}
            className="w-full h-14 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 text-base font-bold text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <p className="text-xs text-on-surface-variant">
          {isHindi
            ? 'खरीफ 2026 बुवाई का सबसे अनुकूल समय: 1 जुलाई से 25 जुलाई'
            : 'Optimal Kharif sowing window for this zone: July 1 – July 25'}
        </p>
      </Card>

      {/* 2. Voice Input Floating Hero Card */}
      <div
        onClick={() => setIsVoiceOpen(true)}
        className="p-5 rounded-2xl bg-gradient-to-r from-primary-container/20 via-emerald-100 to-primary-container/10 border-2 border-primary/40 shadow-level-1 flex items-center justify-between cursor-pointer hover:border-primary transition-all btn-tactile"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-on-primary">
            <span className="material-symbols-outlined text-[16px]">mic</span>
            <span>{isHindi ? 'आवाज से चुनें' : 'Voice Assistant'}</span>
          </div>
          <h3 className="font-bold text-base md:text-lg text-on-surface">
            {isHindi ? 'बोलकर फसल का नाम बताएं' : 'Speak Crop Names in Voice'}
          </h3>
          <p className="text-xs text-on-surface-variant">
            {isHindi
              ? 'माइक दबाकर बोलें: "बाजरा, मूंग, मूंगफली"'
              : 'Tap to speak: "Pearl Millet, Moong, Groundnut"'}
          </p>
        </div>

        <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-level-2 animate-bounce">
          <span className="material-symbols-outlined text-[30px]">mic</span>
        </div>
      </div>

      {/* 3. Crop Quick-Add Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">grass</span>
            <span>{isHindi ? 'फसल विकल्प चुनें (Crop Preferences)' : 'Select Preferred Crops'}</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {quickCropChips.map((crop) => {
            const isSelected = state.cropPreferences.preferredCrops.includes(crop.id);
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => handleToggleCrop(crop.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 text-sm font-bold transition-all btn-tactile ${
                  isSelected
                    ? 'border-primary bg-primary text-on-primary shadow-sm'
                    : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface hover:border-primary/60'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSelected ? 'check' : 'add'}
                </span>
                <span>{isHindi ? crop.nameHi : crop.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Crop Input */}
        <form onSubmit={handleAddCustom} className="flex gap-2 pt-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder={isHindi ? 'अन्य फसल का नाम लिखें...' : 'Type another crop name...'}
            className="flex-1 h-12 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 text-sm font-semibold text-on-surface focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 h-12 rounded-xl bg-primary text-on-primary font-bold text-sm btn-tactile shadow-sm flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>{isHindi ? 'जोड़ें' : 'Add'}</span>
          </button>
        </form>
      </div>

      {/* Voice Assistant Sheet Modal */}
      <VoiceAssistantSheet
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSelectCrop={handleVoiceSelect}
      />
    </div>
  );
};
