import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useWizard } from '@/context/WizardContext';
import { mockSoilTypes } from '@/data/mockSoilTypes';
import { UnitToggle } from '@/components/common/UnitToggle';
import { Card } from '@/components/ui/card';
import { AudioButton } from '@/components/common/AudioButton';
import { WaterAvailabilityLevel } from '@/types/wizard';

export const FarmSoilStep: React.FC = () => {
  const { isHindi } = useLanguage();
  const { state, updateFarmSoil } = useWizard();

  const handleSoilSelect = (soilId: string, soilNameHi: string) => {
    updateFarmSoil({
      soilType: soilId,
      soilNameHi,
    });
  };

  const handleWaterAvailability = (level: WaterAvailabilityLevel) => {
    updateFarmSoil({ waterAvailability: level });
  };

  const handleWaterSourceToggle = (source: string) => {
    const current = state.farmSoil.waterSource;
    const exists = current.includes(source);
    const updated = exists
      ? current.filter((s) => s !== source)
      : [...current, source];
    updateFarmSoil({ waterSource: updated });
  };

  const waterSources = [
    { id: 'Canal', nameEn: 'Canal (नहर)', icon: 'waves' },
    { id: 'Borewell', nameEn: 'Borewell / Tube-well (नलकूप)', icon: 'opacity' },
    { id: 'Rainfed', nameEn: 'Rainfed / Monsoon (बारानी)', icon: 'rainy' },
    { id: 'Pond', nameEn: 'Farm Pond / Well (तालाब/कुआं)', icon: 'water' },
  ];

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            {isHindi ? 'अपने खेत और मिट्टी की जानकारी दें' : 'Tell us about your farm'}
          </h2>
          <AudioButton
            id="step2-farm-audio"
            textHi="चरण 2: अपनी जमीन का कुल क्षेत्रफल एकड़ या हेक्टेयर में दर्ज करें, अपने खेत की मिट्टी का प्रकार चुनें और सिंचाई का मुख्य साधन बताएं।"
            textEn="Step 2: Enter your land size in Acres or Hectares, select your soil type from the cards, and choose your primary water source."
          />
        </div>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          {isHindi
            ? 'मिट्टी की बनावट और पानी की सुविधा पर ही फसल की उत्पादकता निर्भर करती है।'
            : 'Soil texture and water availability dictate crop productivity and drought risk.'}
        </p>
      </div>

      {/* 1. Land Area Input & Unit Toggle */}
      <Card className="p-5 space-y-4 border-outline-variant/60 shadow-level-1">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">straighten</span>
            <span>{isHindi ? 'जमीन का क्षेत्रफल (Land Area)' : 'Land Area'}</span>
          </label>

          <UnitToggle
            value={state.farmSoil.unit}
            onChange={(unit) => updateFarmSoil({ unit })}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0.25"
            step="0.25"
            max="100"
            value={state.farmSoil.area || ''}
            onChange={(e) => updateFarmSoil({ area: parseFloat(e.target.value) || 0 })}
            className="flex-1 h-14 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 text-xl font-bold text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g. 2.5"
          />
          <div className="px-4 py-3 rounded-xl bg-surface-container-low font-bold text-on-surface text-base">
            {isHindi ? (state.farmSoil.unit === 'Acres' ? 'एकड़' : 'हेक्टेयर') : state.farmSoil.unit}
          </div>
        </div>
      </Card>

      {/* 2. Soil Type Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base md:text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">terrain</span>
            <span>{isHindi ? 'मिट्टी का प्रकार चुनें (Soil Type)' : 'Select Soil Type'}</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mockSoilTypes.map((soil) => {
            const isSelected = state.farmSoil.soilType === soil.id;
            return (
              <Card
                key={soil.id}
                onClick={() => handleSoilSelect(soil.id, soil.nameHi)}
                className={`p-4 cursor-pointer border-2 transition-all btn-tactile space-y-2.5 ${
                  isSelected
                    ? 'border-primary bg-primary-container/10 ring-2 ring-primary/20 shadow-level-2'
                    : 'border-outline-variant/60 bg-surface-container-lowest hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">{soil.iconName}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-on-surface">
                        {isHindi ? soil.nameHi : soil.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant/80">
                        {isHindi ? `नमी सोखने की क्षमता: ${soil.waterRetentionHi}` : `Retention: ${soil.waterRetention}`}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      isSelected ? 'text-primary fill' : 'text-outline'
                    }`}
                  >
                    {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {isHindi ? soil.descriptionHi : soil.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 3. Water Availability */}
      <Card className="p-5 space-y-4 border-outline-variant/60 shadow-level-1">
        <label className="block text-base font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">water_drop</span>
          <span>{isHindi ? 'पानी की उपलब्धता (Water Level)' : 'Water Availability'}</span>
        </label>

        <div className="grid grid-cols-3 gap-2.5">
          {(['Low', 'Moderate', 'High'] as WaterAvailabilityLevel[]).map((lvl) => {
            const isSelected = state.farmSoil.waterAvailability === lvl;
            const labels = {
              Low: { en: 'Low (Rainfed)', hi: 'कम (बारानी)' },
              Moderate: { en: 'Moderate', hi: 'मध्यम' },
              High: { en: 'High (Irrigated)', hi: 'प्रचुर (सिंचित)' },
            };

            return (
              <button
                key={lvl}
                type="button"
                onClick={() => handleWaterAvailability(lvl)}
                className={`p-3 rounded-xl border-2 text-center text-xs md:text-sm font-bold transition-all btn-tactile ${
                  isSelected
                    ? 'border-primary bg-primary text-on-primary shadow-sm'
                    : 'border-outline-variant/60 bg-surface-container-low text-on-surface hover:border-primary/50'
                }`}
              >
                {isHindi ? labels[lvl].hi : labels[lvl].en}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 4. Primary Water Sources Multi-Chips */}
      <div className="space-y-3">
        <label className="block text-base font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">cloud_done</span>
          <span>{isHindi ? 'सिंचाई का साधन (Primary Water Source)' : 'Primary Water Source'}</span>
        </label>

        <div className="grid grid-cols-2 gap-2.5">
          {waterSources.map((ws) => {
            const isChecked = state.farmSoil.waterSource.includes(ws.id);
            return (
              <button
                key={ws.id}
                type="button"
                onClick={() => handleWaterSourceToggle(ws.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all btn-tactile text-left ${
                  isChecked
                    ? 'border-primary bg-primary-container/10 text-primary font-bold shadow-sm'
                    : 'border-outline-variant/50 bg-surface-container-lowest text-on-surface hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">{ws.icon}</span>
                  <span className="text-xs md:text-sm">{ws.nameEn}</span>
                </div>
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isChecked ? 'text-primary fill' : 'text-outline'
                  }`}
                >
                  {isChecked ? 'check_box' : 'check_box_outline_blank'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
