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
    <div className="space-y-5 animate-fadeIn pb-36">
      
      {/* Clean Title & Description Header with Proper Hierarchy */}
      <div className="space-y-2 pb-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug flex-1">
            मौसम व बाजार जोखिम सिमुलेशन
          </h2>

          <button
            type="button"
            onClick={handleAudio}
            className="flex-shrink-0 h-8 flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-stone-100 dark:bg-stone-800 px-3 rounded-full border border-stone-300 dark:border-stone-700 active:scale-95 hover:bg-stone-200 cursor-pointer shadow-2xs mt-0.5"
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
              <span className="material-symbols-outlined text-lg text-emerald-700 dark:text-emerald-400">rainy</span>
              <span>मानसूनी बारिश का बदलाव:</span>
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono border ${
              rainfallOffset < 0
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
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
            className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />

          <div className="flex justify-between text-[11px] text-stone-500 font-semibold">
            <span>-35% (कम बारिश)</span>
            <span>0% (सामान्य)</span>
            <span>+25% (अधिक बारिश)</span>
          </div>
        </div>

        <div className="h-px bg-stone-200 dark:bg-stone-800" />

        {/* Mandi Price Shock Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#1A1C18] dark:text-[#E2E3DC]">
              <span className="material-symbols-outlined text-lg text-emerald-700 dark:text-emerald-400">trending_down</span>
              <span>मंडी भाव में उतार-चढ़ाव:</span>
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono border ${
              priceOffset < 0
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
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
            className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />

          <div className="flex justify-between text-[11px] text-stone-500 font-semibold">
            <span>-25% (भाव में गिरावट)</span>
            <span>0% (वर्तमान भाव)</span>
            <span>+25% (भाव में तेजी)</span>
          </div>
        </div>
      </div>

      {/* Harmonized Simulation Outcome Hero Card */}
      <div className="rounded-3xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1E231B] shadow-lg overflow-hidden animate-fadeIn">
        {/* Top Card Banner */}
        <div className="bg-emerald-700 text-white px-5 py-3 flex items-center justify-between">
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
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 block my-0.5">
                {formatCurrencyINR(simProfit)}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                {t('perAcre')}
              </span>
            </div>
          </div>

          {/* AI Guidance Callout */}
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
            <span className="material-symbols-outlined text-base text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5">psychology_alt</span>
            <span>
              {rainfallOffset < 0
                ? `${Math.abs(rainfallOffset)}% कम बारिश होने पर भी ${cropName} अन्य फसलों की तुलना में न्यूनतम जोखिम के साथ सबसे सुरक्षित लाभ सुनिश्चित करती है।`
                : `सामान्य बारिश में यह फसल भरपूर पैदावार और अधिकतम लाभ देगी।`}
            </span>
          </div>
        </div>
      </div>

      {/* True Progressive Blur Layer with Gradient Mask */}
      <div
        className="fixed bottom-16 inset-x-0 z-30 pointer-events-none max-w-md mx-auto h-28"
        style={{
          background: 'linear-gradient(to top, rgba(249,249,246,0.95) 20%, rgba(249,249,246,0.7) 60%, transparent 100%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Floating Action Bar with Proceed CTA */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto pb-3 pt-2">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{t('chooseAndPlanBtn')}</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
