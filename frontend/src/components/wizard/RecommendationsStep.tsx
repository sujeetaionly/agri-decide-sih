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
    prevCard,
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

  const handleSelectAltCrop = (item: ComparisonCropItem) => {
    triggerHaptic('medium');
    setSelectedCropId(item.crop_id);
  };

  const handleProceedToPlan = () => {
    triggerHaptic('success');
    goToCard(8); // Move to 120-Day Action Plan
  };

  const handleTestWhatIf = () => {
    triggerHaptic('light');
    goToCard(7); // Move to What-If simulator
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-40">
      
      {/* Header & Listen Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-base">verified</span>
            <span>उच्च विश्वसनीयता (High Match)</span>
          </div>

          <button
            onClick={handleAudio}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        <h2 className="text-2xl font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug">
          आपके खेत के लिए सर्वोत्तम फसल
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          आपकी मिट्टी, सिंचाई और मंडी भाव के आधार पर एआई द्वारा चयनित परिणाम
        </p>
      </div>

      {/* HERO TOP RECOMMENDATION CARD */}
      <div className="bg-white dark:bg-[#1E231B] border-2 border-primary rounded-3xl overflow-hidden shadow-lg space-y-0">
        
        {/* Banner */}
        <div className="bg-primary text-on-primary px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-300 text-xl fill">star</span>
            <span className="font-extrabold text-xs uppercase tracking-wider">
              {t('topChoiceBadge')}
            </span>
          </div>
          <div className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold">
            {Math.round(top.suitability_pct)}% मैच स्कोर
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Crop Title & Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-2xl shadow-inner">
                🌾
              </div>
              <div>
                <h3 className="text-2xl font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC]">
                  {topCropName}
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  खरीफ मौसम • {top.duration_days} {t('days')} फसल अवधि
                </span>
              </div>
            </div>
          </div>

          {/* 3-Pillar Financial Metrics Grid (Yield + Cost + Profit) */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {/* 1. Net Profit */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block uppercase">
                {t('estimatedProfit')}
              </span>
              <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 block leading-tight">
                {formatCurrencyINR(top.expected_net_profit_per_acre_inr)}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {t('perAcre')}
              </span>
            </div>

            {/* 2. Expected Yield */}
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-500/30 p-3 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 block uppercase">
                {t('estimatedYield')}
              </span>
              <span className="text-base font-extrabold text-blue-700 dark:text-blue-300 block leading-tight">
                {top.expected_yield_qtl_per_acre}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                क्विंटल / एकड़
              </span>
            </div>

            {/* 3. Estimated Cultivation Cost */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 p-3 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block uppercase">
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
        <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">
          अन्य मजबूत फसल विकल्प (Comparison Options)
        </h3>

        <div className="space-y-2.5">
          {comparisonMatrix.slice(1, 4).map((alt) => {
            const altName = (language === 'mr' ? alt.crop_name_mr : alt.crop_name_hi) || alt.crop_name_hi;
            const isSelectedAlt = selectedCropId === alt.crop_id;
            return (
              <button
                key={alt.crop_id}
                type="button"
                onClick={() => handleSelectAltCrop(alt)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between active:scale-[0.98] ${
                  isSelectedAlt
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#1A1C18] dark:text-[#E2E3DC]">
                      {altName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600">
                      {Math.round(alt.suitability_pct)}% मैच
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                    <span>लागत: {formatCurrencyINR(alt.total_cost_inr_per_acre)}</span>
                    <span>•</span>
                    <span>पैदावार: {alt.expected_yield_qtl_per_acre} qtl</span>
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

      {/* STICKY BOTTOM ACTION BAR (1 Main Button + 1 Link to What-If) */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto space-y-2 bg-gradient-to-t from-surface-light via-surface-light to-transparent dark:from-surface-dark dark:via-surface-dark pt-4 pb-2">
        <button
          onClick={handleProceedToPlan}
          className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-extrabold text-base shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span>{t('chooseAndPlanBtn')}</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>

        <div className="flex justify-between items-center px-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              prevCard();
            }}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800"
          >
            ← {t('back')}
          </button>

          <button
            onClick={handleTestWhatIf}
            className="text-xs font-bold text-primary underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>{t('testWhatIfBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
