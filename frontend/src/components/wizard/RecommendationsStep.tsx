import React, { useState, useMemo } from 'react';
import { useWizard } from '../../context/WizardContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrencyINR, triggerHaptic } from '../../lib/utils';
import { speakText } from '../../lib/speech';
import {
  FullCropDetail,
  MASTER_CROP_MAP,
  PRIMARY_FIELD_CROPS,
  getDynamicCropDetail,
} from '../../data/cropAgronomics';

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

interface RecommendationsStepProps {
  onOpenMyCropPlan?: () => void;
}

export const RecommendationsStep: React.FC<RecommendationsStepProps> = ({
  onOpenMyCropPlan,
}) => {
  const {
    farmData,
    intendedVsRecommended,
    goToCard,
    selectedCropId,
    setSelectedCropId,
    chooseCropForMyCropPlan,
  } = useWizard();
  const { language, t } = useLanguage();

  const [showCostAccordion, setShowCostAccordion] = useState(false);
  const [sortBy, setSortBy] = useState<'MATCH' | 'PROFIT'>('MATCH');

  // 1. Identify the single best AI crop dynamically from soil/water evaluation among primary field crops
  const primaryEvaluated = useMemo(() => {
    const evaluated = PRIMARY_FIELD_CROPS.map((id) => getDynamicCropDetail(id, farmData));
    evaluated.sort((a, b) => b.suitability_pct - a.suitability_pct);
    return evaluated;
  }, [farmData.soilType, farmData.waterCapacity]);

  const bestAiCrop = primaryEvaluated[0] || getDynamicCropDetail('SOYBEAN', farmData);
  const bestAiCropId = bestAiCrop.crop_id;

  // 2. Filter comparison crops to ONLY contain what the farmer said they wanted to plant + our 1 best crop
  const intendedCropIds = useMemo(() => {
    return (farmData.intendedCrops || []).filter(
      (id) => id !== 'NOT_SURE' && id !== 'OTHER' && MASTER_CROP_MAP[id]
    );
  }, [farmData.intendedCrops]);

  // Build the comparison pool:
  const comparisonCropList = useMemo(() => {
    const list: FullCropDetail[] = [bestAiCrop];
    intendedCropIds.forEach((id) => {
      if (!list.some((c) => c.crop_id === id)) {
        list.push(getDynamicCropDetail(id, farmData));
      }
    });

    list.sort((a, b) => {
      if (sortBy === 'PROFIT') {
        return b.expected_net_profit_per_acre_inr - a.expected_net_profit_per_acre_inr;
      }
      return b.suitability_pct - a.suitability_pct;
    });
    return list;
  }, [bestAiCrop, intendedCropIds, farmData, sortBy]);

  // State for active viewed crop (default to best crop)
  const [activeCropId, setActiveCropId] = useState<string>(
    selectedCropId || bestAiCropId
  );

  const activeCrop: FullCropDetail = useMemo(() => {
    return getDynamicCropDetail(activeCropId, farmData);
  }, [activeCropId, farmData]);

  const activeCropName = getLocalizedCropName(activeCrop, language);

  const isTopChoice = activeCrop.crop_id === bestAiCropId;
  const isFarmerIntendedCrop = intendedCropIds.includes(activeCrop.crop_id);

  const handleSelectCrop = (cropId: string) => {
    triggerHaptic('medium');
    setActiveCropId(cropId);
    setSelectedCropId(cropId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = `वर्तमान में चयनित फसल ${activeCropName} है। अनुमानित शुद्ध लाभ ${formatCurrencyINR(activeCrop.expected_net_profit_per_acre_inr)} प्रति एकड़, अनुमानित लागत ${formatCurrencyINR(activeCrop.total_cost_inr_per_acre)} प्रति एकड़, और अनुमानित पैदावार ${activeCrop.expected_yield_qtl_per_acre} क्विंटल प्रति एकड़ है।`;
    speakText(msg, language);
  };

  const handleProceedToWhatIf = () => {
    triggerHaptic('medium');
    setSelectedCropId(activeCropId);
    goToCard(9); // Proceed to Weather & Risk Simulator
  };

  const handleDirectChooseCrop = () => {
    triggerHaptic('success');
    setSelectedCropId(activeCropId);
    chooseCropForMyCropPlan(activeCrop);
    if (onOpenMyCropPlan) {
      onOpenMyCropPlan();
    } else {
      window.location.hash = 'my-crop';
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-6">
      
      {/* Clean Title & Subtitle Header */}
      <div className="space-y-1 pt-1 pb-1">
        <h2 className="text-2xl font-black font-headline text-stone-900 dark:text-stone-100 leading-snug">
          {t('resultsTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          आपकी मिट्टी, सिंचाई और मंडी भाव के आधार पर एआई द्वारा विश्लेषित परिणाम।
        </p>
      </div>

      {/* 🌟 FARMER'S CHOICE VS AI RECOMMENDATION (HEAD-TO-HEAD COMPARISON CARD) */}
      {intendedVsRecommended && intendedVsRecommended.has_intended_crops && intendedVsRecommended.intended_crop && (
        <div className="bg-white dark:bg-[#1E231B] border-2 border-primary/40 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3.5 animate-fadeIn">
          {/* Full-Width Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-lg">compare_arrows</span>
            </div>
            <h3 className="text-base font-black font-headline text-stone-900 dark:text-stone-100 leading-snug">
              {t('headToHeadTitle')}
            </h3>
          </div>

          {/* Profit Difference Callout Banner */}
          {!intendedVsRecommended.is_intended_already_best && intendedVsRecommended.profit_difference_per_acre_inr > 0 && (
            <div className="bg-amber-500/10 dark:bg-amber-500/20 border border-amber-400/40 dark:border-amber-600/40 rounded-2xl p-2.5 px-3.5 flex items-center justify-between gap-2 shadow-2xs">
              <span className="text-xs font-extrabold text-amber-950 dark:text-amber-200">
                AI विकल्प चुनने पर अतिरिक्त लाभ:
              </span>
              <span className="text-xs font-black bg-amber-600 text-white px-3 py-1 rounded-full whitespace-nowrap shadow-xs">
                +₹{Math.round(intendedVsRecommended.profit_difference_per_acre_inr).toLocaleString('en-IN')} / एकड़
              </span>
            </div>
          )}

          {/* Side-by-Side Comparison Columns */}
          <div className="grid grid-cols-2 gap-3">
            {/* Farmer's Intended Crop Card */}
            <div className="bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block mb-1">
                  {t('yourChoice')}
                </span>

                {/* Hero Crop Name */}
                <h4 className="text-xl font-black font-headline text-stone-950 dark:text-stone-50 tracking-tight leading-tight truncate">
                  {getLocalizedCropName(intendedVsRecommended.intended_crop, language)}
                </h4>

                {/* Clean Match Rate Pill */}
                <div className="mt-1.5 mb-2.5">
                  <span className="inline-block text-[11px] font-black text-stone-700 dark:text-stone-300 bg-stone-200/90 dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-300/70 dark:border-stone-700 whitespace-nowrap">
                    {intendedVsRecommended.intended_crop.suitability_pct}% मैच
                  </span>
                </div>

                {/* Dedicated Profit Box */}
                <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200/80 dark:border-stone-700/80 mb-2.5">
                  <span className="text-[10px] font-bold text-stone-500 block leading-tight">
                    अनुमानित शुद्ध लाभ
                  </span>
                  <span className="text-base font-black text-stone-950 dark:text-stone-50 font-headline block leading-tight mt-1">
                    {formatCurrencyINR(intendedVsRecommended.intended_crop.expected_net_profit_per_acre_inr)}
                  </span>
                </div>
              </div>

              {/* Secondary Cost & Duration Specs */}
              <div className="space-y-1.5 text-[11px] pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-medium">लागत:</span>
                  <span className="font-semibold text-stone-600 dark:text-stone-400">
                    {formatCurrencyINR(intendedVsRecommended.intended_crop.total_cost_inr_per_acre)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-medium">अवधि:</span>
                  <span className="font-semibold text-stone-600 dark:text-stone-400">
                    {intendedVsRecommended.intended_crop.duration_days} दिन
                  </span>
                </div>
              </div>
            </div>

            {/* AI Recommended Crop Card */}
            <div className="bg-primary/5 dark:bg-primary/20 p-3.5 rounded-2xl border-2 border-primary shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary dark:text-primary-fixed block mb-1">
                  AI सिफारिश ⭐
                </span>

                {/* Hero Crop Name */}
                <h4 className="text-xl font-black font-headline text-primary dark:text-primary-fixed tracking-tight leading-tight truncate">
                  {getLocalizedCropName(intendedVsRecommended.recommended_crop || bestAiCrop, language)}
                </h4>

                {/* Clean Match Rate Pill */}
                <div className="mt-1.5 mb-2.5">
                  <span className="inline-block text-[11px] font-black text-primary dark:text-primary-fixed bg-white dark:bg-stone-900 px-2.5 py-0.5 rounded-full border border-primary/30 shadow-2xs whitespace-nowrap">
                    {intendedVsRecommended.recommended_crop?.suitability_pct || bestAiCrop.suitability_pct}% मैच
                  </span>
                </div>

                {/* Dedicated Profit Box */}
                <div className="bg-primary/10 dark:bg-primary/25 p-2.5 rounded-xl border border-primary/25 mb-2.5">
                  <span className="text-[10px] font-bold text-primary/80 block leading-tight">
                    अनुमानित शुद्ध लाभ
                  </span>
                  <span className="text-base font-black text-primary dark:text-primary-fixed font-headline block leading-tight mt-1">
                    {formatCurrencyINR(intendedVsRecommended.recommended_crop?.expected_net_profit_per_acre_inr || bestAiCrop.expected_net_profit_per_acre_inr)}
                  </span>
                </div>
              </div>

              {/* Secondary Cost & Duration Specs */}
              <div className="space-y-1.5 text-[11px] pt-2 border-t border-primary/20">
                <div className="flex justify-between">
                  <span className="text-stone-600 dark:text-stone-400 font-medium">लागत:</span>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">
                    {formatCurrencyINR(intendedVsRecommended.recommended_crop?.total_cost_inr_per_acre || bestAiCrop.total_cost_inr_per_acre)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600 dark:text-stone-400 font-medium">अवधि:</span>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">
                    {intendedVsRecommended.recommended_crop?.duration_days || bestAiCrop.duration_days} दिन
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Takeaway Banner */}
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
            intendedVsRecommended.is_intended_already_best
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
          }`}>
            <span className="material-symbols-outlined text-base flex-shrink-0">
              {intendedVsRecommended.is_intended_already_best ? 'verified' : 'trending_up'}
            </span>
            <span className="leading-snug">
              {intendedVsRecommended.is_intended_already_best
                ? 'शानदार निर्णय! आपकी सोची हुई फसल ही आपकी जमीन के लिए सबसे उत्तम विकल्प है।'
                : `AI अनुशंसित फसल (${getLocalizedCropName(intendedVsRecommended.recommended_crop || bestAiCrop, language)}) लगाने से प्रति एकड़ ₹${Math.round(intendedVsRecommended.profit_difference_per_acre_inr).toLocaleString('en-IN')} अधिक शुद्ध लाभ मिल सकता है।`}
            </span>
          </div>
        </div>
      )}

      {/* 🌟 HERO CARD: CURRENT ACTIVE CROP */}
      <div className="bg-white dark:bg-[#1E231B] border-2 border-primary/80 rounded-3xl p-5 shadow-sm space-y-4">
        
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[11px] font-black tracking-wide px-3 py-1 rounded-full uppercase ${
              isTopChoice 
                ? 'bg-primary text-white shadow-2xs' 
                : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700'
            }`}>
              <span className="material-symbols-outlined text-xs font-bold">
                {isTopChoice ? 'auto_awesome' : (isFarmerIntendedCrop ? 'person' : 'check_circle')}
              </span>
              <span>
                {isTopChoice ? 'सर्वोत्तम AI सिफारिश' : (isFarmerIntendedCrop ? 'आपकी चुनी हुई फसल' : 'चयनित फसल')}
              </span>
            </span>

            <span className="bg-primary/10 text-primary dark:text-primary-fixed border border-primary/30 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
              {activeCrop.suitability_pct}% अनुकूलता
            </span>
          </div>

          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/80 px-2.5 py-1 rounded-full border border-stone-300 dark:border-stone-700">
            ⏱️ {activeCrop.duration_days} दिन अवधि
          </span>
        </div>

        {/* Crop Name */}
        <div>
          <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 font-headline">
            {activeCropName}
          </h3>
        </div>

        {/* Highlighted Net Profit Banner */}
        <div className="bg-primary/10 dark:bg-primary/20 border-2 border-primary/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-primary dark:text-primary-fixed uppercase tracking-wider block">
              {t('estimatedProfit')}
            </span>
            <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
              लागत काटकर किसान की शुद्ध बचत
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-primary dark:text-primary-fixed block font-headline">
              {formatCurrencyINR(activeCrop.expected_net_profit_per_acre_inr)}
            </span>
            <span className="text-[10px] text-stone-500 font-bold block">प्रति एकड़</span>
          </div>
        </div>

        {/* 2 Clean Balanced Metric Tiles (Expected Yield & Mandi Price) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-300 dark:border-stone-700 space-y-0.5">
            <div className="flex items-center gap-1.5 text-stone-500">
              <span className="material-symbols-outlined text-sm text-primary">inventory_2</span>
              <span className="text-xs font-semibold">अनुमानित पैदावार</span>
            </div>
            <span className="text-lg font-black text-stone-900 dark:text-stone-100 block">
              {activeCrop.expected_yield_qtl_per_acre} क्विंटल
            </span>
            <span className="text-[10px] text-stone-400 block font-medium">प्रति एकड़ (औसत)</span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-300 dark:border-stone-700 space-y-0.5">
            <div className="flex items-center gap-1.5 text-stone-500">
              <span className="material-symbols-outlined text-sm text-primary">trending_up</span>
              <span className="text-xs font-semibold">मंडी भाव अनुमान</span>
            </div>
            <span className="text-lg font-black text-stone-900 dark:text-stone-100 block">
              {formatCurrencyINR(activeCrop.forecasted_mandi_price_inr_per_qtl)}
            </span>
            <span className="text-[10px] text-stone-400 block font-medium">प्रति क्विंटल (मंडी दर)</span>
          </div>
        </div>

        {/* Redesigned Itemized Cost Breakdown Card */}
        <div className="border border-stone-300 dark:border-stone-700 rounded-2xl overflow-hidden shadow-2xs bg-white dark:bg-[#1E231B] transition-all">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowCostAccordion((prev) => !prev);
            }}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50/80 dark:hover:bg-stone-900/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 border border-primary/20">
                <span className="material-symbols-outlined text-lg">payments</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block leading-tight">
                  कुल अनुमानित लागत
                </span>
                <span className="text-sm font-black text-stone-900 dark:text-stone-100 font-headline">
                  {formatCurrencyINR(activeCrop.total_cost_inr_per_acre)} <span className="text-xs font-medium text-stone-500">/ एकड़</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <span className="text-[11px]">{showCostAccordion ? 'छुपाएं' : 'विवरण'}</span>
              <span className={`material-symbols-outlined text-base transition-transform duration-200 ${showCostAccordion ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </div>
          </button>

          {showCostAccordion && activeCrop.cost_breakdown && (
            <div className="p-3.5 bg-stone-50/60 dark:bg-stone-900/40 text-xs border-t border-stone-300 dark:border-stone-700 space-y-2 animate-fadeIn">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white dark:bg-[#1E231B] p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 block font-medium">बीज लागत</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block mt-0.5">{formatCurrencyINR(activeCrop.cost_breakdown.seed_cost)}</span>
                </div>
                <div className="bg-white dark:bg-[#1E231B] p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 block font-medium">उर्वरक व पोषण</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block mt-0.5">{formatCurrencyINR(activeCrop.cost_breakdown.fertilizer_cost)}</span>
                </div>
                <div className="bg-white dark:bg-[#1E231B] p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 block font-medium">कीटनाशक सुरक्षा</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block mt-0.5">{formatCurrencyINR(activeCrop.cost_breakdown.pesticide_cost)}</span>
                </div>
                <div className="bg-white dark:bg-[#1E231B] p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 block font-medium">जुताई व मशीनरी</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block mt-0.5">{formatCurrencyINR(activeCrop.cost_breakdown.machinery_rental_cost)}</span>
                </div>
                <div className="bg-white dark:bg-[#1E231B] p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 block font-medium">मजदूरी व्यय</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block mt-0.5">{formatCurrencyINR(activeCrop.cost_breakdown.labour_cost)}</span>
                </div>
                <div className="bg-white dark:bg-[#1E231B] p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 block font-medium">सिंचाई व बिजली</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block mt-0.5">{formatCurrencyINR(activeCrop.cost_breakdown.irrigation_electricity_cost)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 🌟 REDESIGNED PROS AND CONS STRUCTURED CARDS */}
        <div className="space-y-3 pt-1">
          
          {/* Card 1: Pros / Advantages */}
          <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-[#1E231B] overflow-hidden shadow-2xs">
            {/* Integrated Top Header Banner */}
            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 px-3.5 py-2.5 flex items-center justify-between border-b border-emerald-200 dark:border-emerald-900/60">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <span className="material-symbols-outlined text-sm font-bold">thumb_up</span>
                </div>
                <span className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                  फसल के मुख्य फायदे व विशेषताएं
                </span>
              </div>
            </div>

            {/* Bullets List */}
            <div className="p-3.5">
              <ul className="space-y-2.5">
                {activeCrop.why_recommended.map((bullet, idx) => (
                  <li key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2.5 leading-relaxed">
                    <span className="material-symbols-outlined text-base text-emerald-600 flex-shrink-0 mt-0.5">check_circle</span>
                    <span className="font-medium">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 2: Cons / Risk Factors */}
          <div className="rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-white dark:bg-[#1E231B] overflow-hidden shadow-2xs">
            {/* Integrated Top Header Banner */}
            <div className="bg-amber-50/80 dark:bg-amber-950/40 px-3.5 py-2.5 flex items-center justify-between border-b border-amber-200 dark:border-amber-900/60">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-2xs">
                  <span className="material-symbols-outlined text-sm font-bold">shield_with_heart</span>
                </div>
                <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                  सावधानियां व संभावित चुनौतियां
                </span>
              </div>
            </div>

            {/* Bullets List */}
            <div className="p-3.5">
              <ul className="space-y-2.5">
                {activeCrop.cons.map((con, idx) => (
                  <li key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2.5 leading-relaxed">
                    <span className="material-symbols-outlined text-base text-amber-600 flex-shrink-0 mt-0.5">info</span>
                    <span className="font-medium">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* 🌟 ONLY SHOW THE COMPARISON LIST IF THE FARMER HAS SPECIFIED INTENDED CROPS */}
      {comparisonCropList.length > 1 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              विकल्पों की तुलना:
            </h4>

            {/* Sleek Minimalist Sort Chips */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSortBy('MATCH')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  sortBy === 'MATCH'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-white dark:bg-[#1E231B] text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:border-primary/50'
                }`}
              >
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>मैच %</span>
              </button>

              <button
                type="button"
                onClick={() => setSortBy('PROFIT')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  sortBy === 'PROFIT'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-white dark:bg-[#1E231B] text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:border-primary/50'
                }`}
              >
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>मुनाफा</span>
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {comparisonCropList.map((crop) => {
              const isCurrentlyActive = crop.crop_id === activeCropId;
              const isAiPick = crop.crop_id === bestAiCropId;
              const cName = getLocalizedCropName(crop, language);

              return (
                <button
                  key={crop.crop_id}
                  type="button"
                  onClick={() => handleSelectCrop(crop.crop_id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer active:scale-[0.99] shadow-xs space-y-2.5 ${
                    isCurrentlyActive
                      ? 'border-2 border-primary bg-primary/[0.04] ring-1 ring-primary/20'
                      : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1E231B] hover:border-primary/40'
                  }`}
                >
                  {/* Row 1: Crop Name & Selection on Left, Net Profit on Right */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`material-symbols-outlined text-xl flex-shrink-0 ${
                        isCurrentlyActive ? 'text-primary' : 'text-stone-300 dark:text-stone-600'
                      }`}>
                        {isCurrentlyActive ? 'check_circle' : 'radio_button_unchecked'}
                      </span>

                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-black text-stone-900 dark:text-stone-100 font-headline">
                          {cName}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAiPick
                            ? 'bg-primary text-white shadow-2xs'
                            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                        }`}>
                          {isAiPick ? 'सर्वोत्तम AI' : 'आपकी पसंद'}
                        </span>
                      </div>
                    </div>

                    {/* Right: Net Profit */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-black text-primary dark:text-primary-fixed leading-none font-headline">
                        {formatCurrencyINR(crop.expected_net_profit_per_acre_inr)}
                      </div>
                      <span className="text-[10px] font-medium text-stone-400 block mt-0.5">
                        शुद्ध लाभ / एकड़
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Full-Width Metrics Row (No text wrapping!) */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 font-medium">
                    <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">
                      {crop.suitability_pct}% मैच
                    </span>
                    <span>लागत: {formatCurrencyINR(crop.total_cost_inr_per_acre)}</span>
                    <span>पैदावार: {crop.expected_yield_qtl_per_acre} क्विंटल</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Inline Pill Action Buttons */}
      <div className="space-y-2.5 pt-4 pb-1 max-w-[300px] mx-auto w-full">
        <button
          type="button"
          onClick={handleDirectChooseCrop}
          className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-primary/95 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="truncate">{t('chooseThisCropBtn')} ({activeCropName})</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>

        <button
          type="button"
          onClick={handleProceedToWhatIf}
          className="w-full py-3 px-5 rounded-full bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-base text-primary">tune</span>
          <span>{t('whatIfCardBtn')}</span>
        </button>
      </div>
    </div>
  );
};
