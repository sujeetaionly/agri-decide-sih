import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useWizard } from '@/context/WizardContext';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/common/AudioButton';
import { calculateWhatIf } from '@/lib/simulation';

export const WhatIfStep: React.FC = () => {
  const { isHindi } = useLanguage();
  const { state, updateWhatIf, setSelectedCropId } = useWizard();

  const { rainfallOffset, priceFluctuation } = state.whatIf;

  const outcome = calculateWhatIf(state.selectedCropId, rainfallOffset, priceFluctuation);

  const handleRainfallChange = (val: number[]) => {
    updateWhatIf({ rainfallOffset: val[0] });
  };

  const handlePriceChange = (val: number[]) => {
    updateWhatIf({ priceFluctuation: val[0] });
  };

  const handleReset = () => {
    updateWhatIf({ rainfallOffset: 0, priceFluctuation: 0 });
  };

  const handleApplySwitch = () => {
    if (outcome.recommendedCropId !== state.selectedCropId) {
      setSelectedCropId(outcome.recommendedCropId);
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            {isHindi ? 'अगर मौसम या बाजार बदले तो क्या होगा?' : 'What If? Simulation'}
          </h2>
          <AudioButton
            id="step5-whatif-audio"
            textHi="चरण 5: मौसम और बाजार सिमुलेशन। नीचे दिए गए स्लाइडर को खिसकाकर देखें कि यदि 30% कम बारिश या बाजार भाव में उतार-चढ़ाव हो, तो क्या आपकी चुनी हुई फसल सुरक्षित रहेगी।"
            textEn="Step 5: What-If simulation. Slide the controls to see how unexpected drought or price drops impact your crop yield and profits."
          />
        </div>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          {isHindi
            ? 'मौसम और बाजार के जोखिमों से पहले ही निपटने के लिए परिस्थितियों को बदलकर देखें।'
            : 'Simulate climate and market fluctuations to make a risk-resilient crop decision.'}
        </p>
      </div>

      {/* 1. Simulation Sliders Card */}
      <Card className="p-5 md:p-6 space-y-6 border-outline-variant/60 shadow-level-1">
        {/* Rainfall Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm md:text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-600 text-[22px]">rainy</span>
              <span>{isHindi ? 'मानसूनी वर्षा में बदलाव (Rainfall Deviation)' : 'Monsoon Rainfall Deviation'}</span>
            </label>
            <span
              className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold ${
                rainfallOffset < 0
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : rainfallOffset > 0
                  ? 'bg-sky-100 text-sky-950 border border-sky-300'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              {rainfallOffset > 0 ? `+${rainfallOffset}%` : `${rainfallOffset}%`}
              {rainfallOffset === 0
                ? isHindi
                  ? ' (सामान्य)'
                  : ' (Normal)'
                : rainfallOffset < -25
                ? isHindi
                  ? ' (सूखा)'
                  : ' (Drought)'
                : rainfallOffset > 25
                ? isHindi
                  ? ' (अतिवृष्टि)'
                  : ' (Excess)'
                : ''}
            </span>
          </div>

          <Slider
            min={-50}
            max={50}
            step={5}
            value={[rainfallOffset]}
            onValueChange={handleRainfallChange}
          />

          <div className="flex justify-between text-[11px] font-semibold text-on-surface-variant/80">
            <span>-50% (गंभीर सूखा)</span>
            <span>0% (सामान्य)</span>
            <span>+50% (अत्यधिक बारिश)</span>
          </div>
        </div>

        {/* Market Price Slider */}
        <div className="space-y-3 pt-2 border-t border-outline-variant/40">
          <div className="flex items-center justify-between">
            <label className="text-sm md:text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700 text-[22px]">trending_up</span>
              <span>{isHindi ? 'मंडी भाव में उतार-चढ़ाव (Mandi Price)' : 'Market Price Fluctuation'}</span>
            </label>
            <span
              className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold ${
                priceFluctuation < 0
                  ? 'bg-rose-100 text-rose-950 border border-rose-300'
                  : priceFluctuation > 0
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              {priceFluctuation > 0 ? `+${priceFluctuation}%` : `${priceFluctuation}%`}
            </span>
          </div>

          <Slider
            min={-30}
            max={30}
            step={5}
            value={[priceFluctuation]}
            onValueChange={handlePriceChange}
          />

          <div className="flex justify-between text-[11px] font-semibold text-on-surface-variant/80">
            <span>-30% (मंडी मंदी)</span>
            <span>0% (वर्तमान भाव)</span>
            <span>+30% (मंडी तेजी)</span>
          </div>
        </div>

        {/* Reset Slider Button */}
        {(rainfallOffset !== 0 || priceFluctuation !== 0) && (
          <div className="pt-1 flex justify-end">
            <button
              onClick={handleReset}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>{isHindi ? 'सामान्य स्थिति पर रीसेट करें' : 'Reset to Normal'}</span>
            </button>
          </div>
        )}
      </Card>

      {/* 2. Dynamic AI Simulation Outcome Card */}
      <Card className="p-5 md:p-6 border-2 border-primary bg-primary-container/5 space-y-4 shadow-level-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[26px]">psychology</span>
            <h3 className="text-lg md:text-xl font-bold text-on-surface">
              {isHindi ? 'एआई सिमुलेशन परिणाम' : 'AI Simulation Verdict'}
            </h3>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold ${
              outcome.resilienceRating === 'Optimal' || outcome.resilienceRating === 'Exceptional'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-950 border border-amber-300'
            }`}
          >
            {isHindi ? outcome.resilienceRatingHi : outcome.resilienceRating}
          </span>
        </div>

        {/* Live recalculation metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 space-y-1">
            <div className="text-xs font-semibold text-on-surface-variant">
              {isHindi ? 'संशोधित पैदावार' : 'Adjusted Yield'}
            </div>
            <div className="text-base md:text-lg font-bold text-on-surface">
              {isHindi ? outcome.adjustedYieldHi : outcome.adjustedYield}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 space-y-1">
            <div className="text-xs font-semibold text-on-surface-variant">
              {isHindi ? 'संशोधित शुद्ध लाभ' : 'Adjusted Profit'}
            </div>
            <div className="text-base md:text-lg font-bold text-emerald-800">
              {isHindi ? outcome.adjustedProfitHi : outcome.adjustedProfit}
              <span className={`text-xs ml-1 ${outcome.profitChangePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ({outcome.profitChangePercent >= 0 ? `+${outcome.profitChangePercent}%` : `${outcome.profitChangePercent}%`})
              </span>
            </div>
          </div>
        </div>

        {/* Verdict Explanation */}
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 space-y-2">
          <p className="text-xs md:text-sm font-medium text-on-surface leading-relaxed">
            {isHindi ? outcome.verdictHi : outcome.verdictEn}
          </p>

          {outcome.recommendedCropId !== state.selectedCropId && (
            <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-amber-800">
                {isHindi
                  ? `सुझाव: ${outcome.recommendedCropNameHi} पर स्विच करें`
                  : `Recommendation: Switch to ${outcome.recommendedCropName}`}
              </span>
              <Button variant="secondary" size="sm" onClick={handleApplySwitch}>
                {isHindi ? 'लागू करें' : 'Switch Crop'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
