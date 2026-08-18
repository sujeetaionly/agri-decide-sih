import React, { useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic, formatCurrencyINR } from '../../lib/utils';
import { speakText } from '../../lib/speech';

export const WhatIfStep: React.FC = () => {
  const { topRecommendation, goToCard, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const [rainfallOffset, setRainfallOffset] = useState<number>(0);
  const [priceOffset, setPriceOffset] = useState<number>(0);

  const baseProfit = topRecommendation?.expected_net_profit_per_acre_inr || 24525.0;
  const baseYield = topRecommendation?.expected_yield_qtl_per_acre || 9.5;
  const cropName = topRecommendation?.crop_name_hi || 'सोयाबीन';

  // Dynamic simulated metrics
  const rainPenalty = rainfallOffset < 0 ? Math.abs(rainfallOffset) * 0.007 : rainfallOffset * 0.003;
  const simYield = Math.max(1.0, Number((baseYield * (1 + (rainfallOffset > 0 ? rainfallOffset * 0.004 : -rainPenalty))).toFixed(1)));
  const simProfit = Math.round(baseProfit * (1 + priceOffset * 0.01) * (simYield / baseYield));

  const isDroughtResilient = rainfallOffset < -15;

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = `मौसम और बाजार जोखिम सिमुलेशन। यदि ${Math.abs(rainfallOffset)}% कम बारिश और ${priceOffset}% भाव का उतार-चढ़ाव हो, तो आपकी अनुमानित पैदावार ${simYield} क्विंटल और शुद्ध लाभ ${formatCurrencyINR(simProfit)} रहेगा।`;
    speakText(msg, language);
  };

  const handleProceed = () => {
    triggerHaptic('success');
    goToCard(8); // Move to 120-day plan
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-36">
      
      {/* Header & Audio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            जोखिम सिमुलेटर (What-If Risk Engine)
          </span>
          <button
            onClick={handleAudio}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        <h2 className="text-2xl font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug">
          मौसम या बाजार भाव बदलने पर क्या होगा?
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          नीचे दिए गए स्लाइडर्स को बदलकर देखें कि कम बारिश में फसल कितनी सुरक्षित रहेगी।
        </p>
      </div>

      {/* Interactive Sliders Card */}
      <div className="bg-white dark:bg-[#1E231B] border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-5">
        
        {/* Rainfall Deficit Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
              <span className="material-symbols-outlined text-base text-blue-600">rainy</span>
              <span>मानसूनी बारिश का बदलाव:</span>
            </span>
            <span className={`px-2 py-0.5 rounded-md font-extrabold ${rainfallOffset < 0 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
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
            className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex justify-between text-[10px] text-stone-400 font-medium">
            <span>-35% (सूखा / कम बारिश)</span>
            <span>0% (सामान्य)</span>
            <span>+25% (अधिक बारिश)</span>
          </div>
        </div>

        <div className="h-px bg-stone-100 dark:bg-stone-800" />

        {/* Mandi Price Shock Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
              <span className="material-symbols-outlined text-base text-amber-600">trending_down</span>
              <span>मंडी भाव में उतार-चढ़ाव:</span>
            </span>
            <span className={`px-2 py-0.5 rounded-md font-extrabold ${priceOffset < 0 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
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
            className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />

          <div className="flex justify-between text-[10px] text-stone-400 font-medium">
            <span>-25% (भाव में गिरावट)</span>
            <span>0% (वर्तमान भाव)</span>
            <span>+25% (भाव में उछाल)</span>
          </div>
        </div>
      </div>

      {/* Simulated Outcomes Card */}
      <div className="bg-emerald-900 text-white rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
            सिमुलेशन परिणाम ({cropName})
          </span>
          <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {isDroughtResilient ? 'सूखा सुरक्षित' : 'सामान्य स्थिति'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 p-3 rounded-2xl">
            <span className="text-[11px] text-emerald-200 block">संशोधित पैदावार</span>
            <span className="text-xl font-bold">{simYield} क्विंटल/एकड़</span>
          </div>

          <div className="bg-white/10 p-3 rounded-2xl">
            <span className="text-[11px] text-emerald-200 block">संशोधित शुद्ध लाभ</span>
            <span className="text-xl font-extrabold text-amber-300">{formatCurrencyINR(simProfit)} / एकड़</span>
          </div>
        </div>

        <p className="text-xs text-emerald-100/90 leading-relaxed border-t border-emerald-700/50 pt-2.5">
          {rainfallOffset < 0
            ? `${Math.abs(rainfallOffset)}% कम बारिश होने पर भी ${cropName} अन्य फसलों की तुलना में न्यूनतम जोखिम के साथ सबसे सुरक्षित लाभ सुनिश्चित करती है।`
            : `सामान्य बारिश में यह फसल भरपूर पैदावार और अधिकतम लाभ देगी।`}
        </p>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto flex gap-3">
        <button
          onClick={() => {
            triggerHaptic('light');
            prevCard();
          }}
          className="w-1/3 py-4 px-4 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>{t('back')}</span>
        </button>

        <button
          onClick={handleProceed}
          className="w-2/3 py-4 px-6 rounded-full bg-primary text-on-primary font-bold text-base shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span>{t('chooseAndPlanBtn')}</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
