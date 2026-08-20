import React, { useState, useMemo, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrencyINR, triggerHaptic } from '../../lib/utils';
import { speakText } from '../../lib/speech';
import { apiService } from '../../services/api';

const getLocalizedCropName = (
  crop: {
    crop_name_en: string;
    crop_name_hi: string;
    crop_name_mr?: string;
    crop_name_gu?: string;
    crop_name_raj?: string;
  },
  lang: string
) => {
  if (lang === 'mr' && crop.crop_name_mr) return crop.crop_name_mr;
  if (lang === 'gu' && crop.crop_name_gu) return crop.crop_name_gu;
  if (lang === 'raj' && crop.crop_name_raj) return crop.crop_name_raj;
  if (lang === 'en' && crop.crop_name_en) return crop.crop_name_en;
  return crop.crop_name_hi;
};

interface WhatIfStepProps {
  onOpenMyCropPlan?: () => void;
}

export const WhatIfStep: React.FC<WhatIfStepProps> = ({ onOpenMyCropPlan }) => {
  const { topRecommendation, activeCropPlan, chooseCropForMyCropPlan, farmData } = useWizard();
  const { language, t } = useLanguage();

  const crop = activeCropPlan || topRecommendation;
  const [rainfallOffset, setRainfallOffset] = useState<number>(0);
  const [priceOffset, setPriceOffset] = useState<number>(0);
  const [backendAlert, setBackendAlert] = useState<string | null>(null);

  if (!crop) {
    return (
      <div className="p-8 text-center text-stone-500">
        <p>कृपया पहले फसल का विश्लेषण प्राप्त करें।</p>
      </div>
    );
  }

  const cropName = getLocalizedCropName(crop, language);

  // Real-time What-If calculations with memoization
  const isDroughtResilient = crop.crop_id === 'BAJRA' || crop.crop_id === 'SOYBEAN' || crop.crop_id === 'MOONG';
  
  const { simYield, simPrice, simProfit } = useMemo(() => {
    const yieldPenalty = rainfallOffset < 0
      ? (Math.abs(rainfallOffset) / 100) * (isDroughtResilient ? 0.35 : 0.65)
      : (rainfallOffset / 100) * 0.15;

    const y = Math.max(1.0, parseFloat((crop.expected_yield_qtl_per_acre * (1 - yieldPenalty)).toFixed(1)));
    const p = Math.round(crop.forecasted_mandi_price_inr_per_qtl * (1 + priceOffset / 100));
    const revenue = Math.round(y * p);
    const profit = Math.round(revenue - crop.total_cost_inr_per_acre);

    return { simYield: y, simPrice: p, simProfit: profit };
  }, [crop, rainfallOffset, priceOffset, isDroughtResilient]);

  // Query live AI sensitivity engine from backend on slider adjustment
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const sim = await apiService.simulateWhatIf({
          rainfall_deficit_pct: rainfallOffset,
          mandi_price_shock_pct: priceOffset,
          candidate_crops: [crop.crop_id],
          soil_type: farmData.soilType || 'BLACK',
          water_capacity_level: farmData.waterCapacity || 'MEDIUM',
          lang: language,
        });

        if (active && sim && sim.simulation_results && sim.simulation_results.alert_message) {
          setBackendAlert(sim.simulation_results.alert_message);
        }
      } catch (e) {
        // Handled silently
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [crop.crop_id, rainfallOffset, priceOffset, farmData, language]);

  const handleAudio = () => {
    const speechText = language === 'mr'
      ? `हवामान व जोखीम विश्लेषण. कमी पावसात किंवा भाव कमी झाल्यावर काय परिणाम होईल ते येथे तपासा.`
      : language === 'gu'
      ? `હવામાન અને જોખમ વિશ્લેષણ. ઓછા વરસાદ કે બજાર ભાવ બદલાવ પર આ પાકની સુરક્ષા તપાસો.`
      : language === 'en'
      ? `Weather and Price Risk Simulator. Test how ${crop.crop_name_en} performs under drought or price fluctuations.`
      : `मौसम व जोखिम विश्लेषण। कम बारिश या भाव में उतार-चढ़ाव होने पर ${cropName} फसल की सुरक्षा जांचें।`;

    speakText(speechText, language);
  };

  const handleProceed = () => {
    triggerHaptic('success');
    chooseCropForMyCropPlan(crop);
    if (onOpenMyCropPlan) {
      onOpenMyCropPlan();
    } else {
      window.location.hash = 'my-crop';
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-24">
      
      {/* Clean Title & Description Header */}
      <div className="space-y-2 pb-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug flex-1">
            {t('whatIfCardBtn')}
          </h2>

          <button
            type="button"
            onClick={handleAudio}
            className="flex-shrink-0 h-8 flex items-center gap-1.5 text-xs font-bold text-primary bg-stone-100 dark:bg-stone-800 px-3 rounded-full border border-stone-300 dark:border-stone-700 active:scale-95 hover:bg-stone-200 cursor-pointer shadow-2xs mt-0.5"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          स्लाइडर बदलकर देखें कि कम बारिश या भाव में बदलाव होने पर {cropName} कितनी सुरक्षित रहेगी।
        </p>
      </div>

      {/* Interactive Sliders Card */}
      <div className="bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-5 shadow-2xs space-y-5">
        
        {/* Rainfall Deficit Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#1A1C18] dark:text-[#E2E3DC]">
              <span className="material-symbols-outlined text-lg text-primary">rainy</span>
              <span>मानसूनी बारिश का बदलाव:</span>
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono border ${
              rainfallOffset < 0
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                : 'bg-primary/10 text-primary border-primary/20'
            }`}>
              {rainfallOffset > 0 ? `+${rainfallOffset}%` : `${rainfallOffset}%`}
            </span>
          </div>

          <input
            type="range"
            min="-35"
            max="25"
            step="5"
            value={rainfallOffset}
            onChange={(e) => {
              triggerHaptic('light');
              setRainfallOffset(parseInt(e.target.value));
            }}
            className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <div className="grid grid-cols-3 text-[11px] font-semibold text-stone-500 dark:text-stone-400 pt-0.5">
            <div className="text-left">
              <span className="font-bold text-stone-800 dark:text-stone-200 block">-35%</span>
              <span className="text-[10px] text-stone-400 block leading-tight">कम बारिश</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-primary block">0%</span>
              <span className="text-[10px] text-stone-400 block leading-tight">सामान्य</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-stone-800 dark:text-stone-200 block">+25%</span>
              <span className="text-[10px] text-stone-400 block leading-tight">अधिक बारिश</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-stone-200 dark:bg-stone-800" />

        {/* Mandi Price Shock Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#1A1C18] dark:text-[#E2E3DC]">
              <span className="material-symbols-outlined text-lg text-primary">trending_down</span>
              <span>मंडी भाव में उतार-चढ़ाव:</span>
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono border ${
              priceOffset < 0
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                : 'bg-primary/10 text-primary border-primary/20'
            }`}>
              {priceOffset > 0 ? `+${priceOffset}%` : `${priceOffset}%`}
            </span>
          </div>

          <input
            type="range"
            min="-25"
            max="25"
            step="5"
            value={priceOffset}
            onChange={(e) => {
              triggerHaptic('light');
              setPriceOffset(parseInt(e.target.value));
            }}
            className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <div className="grid grid-cols-3 text-[11px] font-semibold text-stone-500 dark:text-stone-400 pt-0.5">
            <div className="text-left">
              <span className="font-bold text-stone-800 dark:text-stone-200 block">-25%</span>
              <span className="text-[10px] text-stone-400 block leading-tight">भाव गिरावट</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-primary block">0%</span>
              <span className="text-[10px] text-stone-400 block leading-tight">वर्तमान भाव</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-stone-800 dark:text-stone-200 block">+25%</span>
              <span className="text-[10px] text-stone-400 block leading-tight">भाव तेजी</span>
            </div>
          </div>
        </div>
      </div>

      {/* Harmonized Simulation Outcome Hero Card */}
      <div className="rounded-3xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1E231B] shadow-lg overflow-hidden animate-fadeIn">
        {/* Top Card Banner */}
        <div className="bg-primary text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs">
            <span className="material-symbols-outlined text-base text-amber-300">analytics</span>
            <span>सिमुलेशन परिणाम ({cropName})</span>
          </div>
          <span className="text-xs font-black bg-white/20 px-3 py-0.5 rounded-full">
            {isDroughtResilient ? 'सूखा सुरक्षित' : 'सामान्य स्थिति'}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          {/* 2-Column Balanced Neutral Scorecard */}
          <div className="grid grid-cols-2 gap-3">
            {/* Yield Metric */}
            <div className="bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block leading-tight">
                संशोधित पैदावार
              </span>
              <span className="text-2xl font-black text-stone-900 dark:text-stone-100 block my-0.5">
                {simYield}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                {t('quintalPerAcre')}
              </span>
            </div>

            {/* Profit Metric */}
            <div className="bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block leading-tight">
                संशोधित शुद्ध लाभ
              </span>
              <span className="text-2xl font-black text-primary dark:text-primary-fixed block my-0.5">
                {formatCurrencyINR(simProfit)}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                {t('perAcre')}
              </span>
            </div>
          </div>

          {/* AI Guidance Callout */}
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-stone-300 dark:border-stone-700 flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
            <span className="material-symbols-outlined text-base text-primary flex-shrink-0 mt-0.5">psychology_alt</span>
            <span>
              {backendAlert || (rainfallOffset < 0
                ? `${Math.abs(rainfallOffset)}% कम बारिश होने पर भी ${cropName} अन्य फसलों की तुलना में न्यूनतम जोखिम के साथ सबसे सुरक्षित लाभ सुनिश्चित करती है।`
                : `सामान्य बारिश में यह फसल भरपूर पैदावार और अधिकतम लाभ देगी।`)}
            </span>
          </div>
        </div>
      </div>

      {/* Inline Pill Action Buttons */}
      <div className="pt-4 pb-1 max-w-[300px] mx-auto w-full flex justify-center">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-primary/95 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <span>{t('chooseAndPlanBtn')}</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
