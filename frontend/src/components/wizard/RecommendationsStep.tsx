import React, { useState } from 'react';
import { useWizard, ComparisonCropItem } from '../../context/WizardContext';
import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic, formatCurrencyINR } from '../../lib/utils';
import { speakText } from '../../lib/speech';

export const RecommendationsStep: React.FC = () => {
  const {
    topRecommendation,
    comparisonMatrix,
    goToCard,
    selectedCropId,
    setSelectedCropId,
  } = useWizard();
  const { language, t } = useLanguage();

  const [showCostAccordion, setShowCostAccordion] = useState(false);

  const top = topRecommendation || {
    crop_id: 'SOYBEAN',
    crop_name_en: 'Soybean',
    crop_name_hi: 'सोयाबीन',
    crop_name_mr: 'सोयाबीन',
    suitability_pct: 94.0,
    duration_days: 95,
    expected_yield_qtl_per_acre: 9.5,
    yield_range_qtl: '8.5 - 10.5 क्विंटल',
    total_cost_inr_per_acre: 19412.0,
    cost_breakdown: {
      seed_cost: 2250.0,
      fertilizer_cost: 2450.0,
      pesticide_cost: 1350.0,
      machinery_rental_cost: 1950.0,
      labour_cost: 2850.0,
      irrigation_electricity_cost: 394.0,
      operational_cost_a2_inr_per_acre: 19412.0,
      family_labor_cost_per_acre: 1863.0,
      total_cost_a2_fl_inr_per_acre: 21275.0,
    },
    forecasted_mandi_price_inr_per_qtl: 4625.0,
    expected_net_profit_per_acre_inr: 24525.0,
    net_profit_per_day_inr: 258.0,
    price_volatility: 'LOW',
    why_recommended: [
      'काली मिट्टी और मानसूनी मौसम के साथ 94% सबसे उत्तम कृषि अनुकूलता।',
      '95 दिनों की कम अवधि में कुएं से मध्यम पानी में सुरक्षित पैदावार।',
      'अनुमानित लागत (₹19,412/एकड़) के साथ सर्वाधिक शुद्ध मुनाफा।',
      'पिछली फसल के बाद फसल चक्र से खेत की उर्वरता में वृद्धि।',
    ],
  };

  const topCropName = (language === 'mr' ? top.crop_name_mr : top.crop_name_hi) || top.crop_name_hi;

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = `एआई की सर्वोत्तम सिफारिश ${topCropName} है। अनुमानित शुद्ध लाभ ${formatCurrencyINR(top.expected_net_profit_per_acre_inr)} प्रति एकड़, अनुमानित लागत ${formatCurrencyINR(top.total_cost_inr_per_acre)} प्रति एकड़, और अनुमानित पैदावार ${top.expected_yield_qtl_per_acre} क्विंटल प्रति एकड़ है।`;
    speakText(msg, language);
  };

  const handleProceedToWhatIf = () => {
    triggerHaptic('success');
    goToCard(7); // Proceed to What-If Risk Simulation
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Header & Confidence Badge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-500/20">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>उच्च विश्वसनीयता</span>
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
          {t('resultsTitle')}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t('resultsSub')}
        </p>
      </div>

      {/* TOP RECOMMENDATION CARD */}
      <div className="rounded-3xl border-2 border-emerald-500 bg-white dark:bg-[#1E231B] overflow-hidden shadow-lg">
        {/* Top Header Banner */}
        <div className="bg-emerald-700 text-white px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className="material-symbols-outlined text-base text-amber-300">star</span>
            <span>{t('topChoiceBadge')}</span>
          </div>
          <span className="text-xs font-black bg-white/20 px-2.5 py-0.5 rounded-full">
            {top.suitability_pct}% मैच स्कोर
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Crop Name & Icon */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
              🌾
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#1A1C18] dark:text-[#E2E3DC] font-headline">
                {topCropName}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {top.duration_days} दिन फसल अवधि
              </p>
            </div>
          </div>

          {/* 3-Pillar Balanced Metric Scorecard */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {/* 1. Net Profit */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-2.5 text-center">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block leading-tight">
                {t('estimatedProfit')}
              </span>
              <span className="text-base font-black text-emerald-700 dark:text-emerald-400 block leading-tight">
                {formatCurrencyINR(top.expected_net_profit_per_acre_inr)}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">
                {t('perAcre')}
              </span>
            </div>

            {/* 2. Expected Yield */}
            <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-2.5 text-center">
              <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block leading-tight">
                {t('expectedYield')}
              </span>
              <span className="text-base font-black text-blue-700 dark:text-blue-400 block leading-tight">
                {top.expected_yield_qtl_per_acre}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-500 font-medium">
                {t('quintalPerAcre')}
              </span>
            </div>

            {/* 3. Estimated Working Cost */}
            <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-2.5 text-center">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block leading-tight">
                {t('estimatedCost')}
              </span>
              <span className="text-base font-extrabold text-amber-700 dark:text-amber-300 block leading-tight">
                {formatCurrencyINR(top.total_cost_inr_per_acre)}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                {t('perAcre')}
              </span>
            </div>
          </div>

          {/* Itemized CACP Cost Breakdown Accordion */}
          {top.cost_breakdown && (
            <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCostAccordion(!showCostAccordion)}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900/60 flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 active:scale-[0.99]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">receipt_long</span>
                  <span>{t('costBreakdownTitle')}</span>
                </div>
                <span className="material-symbols-outlined text-base transition-transform">
                  {showCostAccordion ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {showCostAccordion && (
                <div className="p-3.5 space-y-2 text-xs bg-white dark:bg-[#1E231B] divide-y divide-stone-100 dark:divide-stone-800 animate-fadeIn">
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('seedCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(top.cost_breakdown.seed_cost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('fertilizerCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(top.cost_breakdown.fertilizer_cost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('pesticideCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(top.cost_breakdown.pesticide_cost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('machineryCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(top.cost_breakdown.machinery_rental_cost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('labourCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(top.cost_breakdown.labour_cost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('irrigationCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(top.cost_breakdown.irrigation_electricity_cost)}</span>
                  </div>
                  <div className="flex justify-between pt-2 font-extrabold text-primary border-t border-primary/20">
                    <span>कुल कार्यशील लागत (CACP A2)</span>
                    <span>{formatCurrencyINR(top.cost_breakdown.operational_cost_a2_inr_per_acre)} / एकड़</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Explainable Why Selected Rationale Bullets */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary">lightbulb</span>
              <span>{t('whyRecommendedTitle')}:</span>
            </h4>
            <ul className="space-y-1.5 pl-1">
              {top.why_recommended.map((bullet, idx) => (
                <li key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2 leading-relaxed">
                  <span className="material-symbols-outlined text-sm text-emerald-600 flex-shrink-0 mt-0.5">check</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ALTERNATIVE CROP COMPARISON CARDS */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          {t('alternativeOptionsTitle')}
        </h4>

        <div className="space-y-2.5">
          {comparisonMatrix.map((alt) => {
            const isTop = alt.crop_id === top.crop_id;
            if (isTop) return null;

            const altName = (language === 'mr' ? alt.crop_name_mr : alt.crop_name_hi) || alt.crop_name_hi;

            return (
              <button
                key={alt.crop_id}
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  setSelectedCropId(alt.crop_id);
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedCropId === alt.crop_id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1E231B]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1A1C18] dark:text-[#E2E3DC]">
                      {altName}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {alt.suitability_pct}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                    <span>लागत: {formatCurrencyINR(alt.total_cost_inr_per_acre)}</span>
                    <span>•</span>
                    <span>पैदावार: {alt.expected_yield_qtl_per_acre} क्विंटल</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block">शुद्ध लाभ</span>
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyINR(alt.expected_net_profit_per_acre_inr)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SINGLE CLEAN CTA BUTTON: Proceed to What-If Weather & Risk Analysis */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto bg-gradient-to-t from-surface-light via-surface-light to-transparent dark:from-surface-dark dark:via-surface-dark pt-4 pb-2">
        <button
          onClick={handleProceedToWhatIf}
          className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-extrabold text-base shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>मौसम व जोखिम जांचें</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
