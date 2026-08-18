import React, { useState } from 'react';
import { useWizard, RecommendedCrop, ComparisonCropItem } from '../../context/WizardContext';
import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic, formatCurrencyINR } from '../../lib/utils';
import { speakText } from '../../lib/speech';

interface FullCropDetail extends RecommendedCrop {
  iconEmoji: string;
}

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

  // Full detailed dataset for all candidate crops
  const ALL_CROP_DETAILS: FullCropDetail[] = [
    {
      crop_id: 'SOYBEAN',
      crop_name_en: 'Soybean',
      crop_name_hi: 'सोयाबीन',
      crop_name_mr: 'सोयाबीन',
      iconEmoji: '🌾',
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
        'काली व दोमट मिट्टी और मानसूनी मौसम के साथ 94% सबसे उत्तम कृषि अनुकूलता।',
        '95 दिनों की कम अवधि में मध्यम पानी में सुरक्षित और संतुलित पैदावार।',
        'अनुमानित कार्यशील लागत (₹19,412/एकड़) के साथ सर्वाधिक शुद्ध मुनाफा।',
        'पिछली फसल के बाद फसल चक्र (Crop Rotation) से जमीन की उर्वरा शक्ति में वृद्धि।',
      ],
    },
    {
      crop_id: 'MAIZE',
      crop_name_en: 'Maize',
      crop_name_hi: 'मक्का',
      crop_name_mr: 'मका',
      iconEmoji: '🌽',
      suitability_pct: 88.0,
      duration_days: 105,
      expected_yield_qtl_per_acre: 24.0,
      yield_range_qtl: '22.0 - 26.0 क्विंटल',
      total_cost_inr_per_acre: 18211.0,
      cost_breakdown: {
        seed_cost: 1850.0,
        fertilizer_cost: 2950.0,
        pesticide_cost: 1100.0,
        machinery_rental_cost: 2100.0,
        labour_cost: 2450.0,
        irrigation_electricity_cost: 450.0,
        operational_cost_a2_inr_per_acre: 18211.0,
        family_labor_cost_per_acre: 1750.0,
        total_cost_a2_fl_inr_per_acre: 19961.0,
      },
      forecasted_mandi_price_inr_per_qtl: 2150.0,
      expected_net_profit_per_acre_inr: 21389.0,
      net_profit_per_day_inr: 203.0,
      price_volatility: 'LOW',
      why_recommended: [
        'दोमट मिट्टी में उच्च पोषक तत्वों के साथ 88% की उत्तम कृषि अनुकूलता।',
        'प्रति एकड़ 24 क्विंटल की भारी पैदावार और मंडी में निरंतर स्थिर मांग।',
        'कम लागत (₹18,211/एकड़) के साथ सुरक्षित रिटर्न और कम कीट-प्रकोप।',
        'मक्का फसल के बाद गेहूं की बुवाई के लिए खेत समय पर खाली होने की सुविधा।',
      ],
    },
    {
      crop_id: 'BAJRA',
      crop_name_en: 'Bajra',
      crop_name_hi: 'बाजरा',
      crop_name_mr: 'बाजरी',
      iconEmoji: '🌾',
      suitability_pct: 85.0,
      duration_days: 85,
      expected_yield_qtl_per_acre: 12.0,
      yield_range_qtl: '10.5 - 13.5 क्विंटल',
      total_cost_inr_per_acre: 17264.0,
      cost_breakdown: {
        seed_cost: 950.0,
        fertilizer_cost: 1850.0,
        pesticide_cost: 750.0,
        machinery_rental_cost: 1650.0,
        labour_cost: 2100.0,
        irrigation_electricity_cost: 250.0,
        operational_cost_a2_inr_per_acre: 17264.0,
        family_labor_cost_per_acre: 1450.0,
        total_cost_a2_fl_inr_per_acre: 18714.0,
      },
      forecasted_mandi_price_inr_per_qtl: 2450.0,
      expected_net_profit_per_acre_inr: 18136.0,
      net_profit_per_day_inr: 213.0,
      price_volatility: 'LOW',
      why_recommended: [
        'कम पानी और शुष्क मौसम में सबसे अधिक सूखा सहनशील मजबूत फसल।',
        'मात्र 85 दिनों की सबसे कम अवधि में सबसे तेजी से तैयार होने वाली फसल।',
        'न्यूनतम खाद और कीटनाशक लागत (₹17,264/एकड़) में कम जोखिम वाला विकल्प।',
        'दाना के साथ-साथ पशुओं के लिए पौष्टिक चारे का अतिरिक्त आर्थिक लाभ।',
      ],
    },
    {
      crop_id: 'GROUNDNUT',
      crop_name_en: 'Groundnut',
      crop_name_hi: 'मूंगफली',
      crop_name_mr: 'भुईमूग',
      iconEmoji: '🥜',
      suitability_pct: 82.0,
      duration_days: 120,
      expected_yield_qtl_per_acre: 8.5,
      yield_range_qtl: '7.5 - 9.5 क्विंटल',
      total_cost_inr_per_acre: 30351.0,
      cost_breakdown: {
        seed_cost: 4850.0,
        fertilizer_cost: 3250.0,
        pesticide_cost: 1950.0,
        machinery_rental_cost: 2650.0,
        labour_cost: 4100.0,
        irrigation_electricity_cost: 650.0,
        operational_cost_a2_inr_per_acre: 30351.0,
        family_labor_cost_per_acre: 2450.0,
        total_cost_a2_fl_inr_per_acre: 32801.0,
      },
      forecasted_mandi_price_inr_per_qtl: 6200.0,
      expected_net_profit_per_acre_inr: 22349.0,
      net_profit_per_day_inr: 186.0,
      price_volatility: 'MEDIUM',
      why_recommended: [
        'भुरभुरी व रेतीली-दोमट मिट्टी में उच्च बाजार भाव (₹6,200/क्विंटल) वाली नकदी फसल।',
        'जमीन में नाइट्रोजन स्थिरीकरण कर मिट्टी की प्राकृतिक उपजाऊ शक्ति बढ़ाती है।',
        'तेल मिलों और स्थानीय मंडियों में भारी मांग और तत्काल नकद भुगतान।',
        'मध्यम सिंचाई उपलब्धता में अच्छी गुणवत्ता वाली फलियां विकसित होती हैं।',
      ],
    },
  ];

  // Active crop state - defaults to top recommendation
  const defaultTopId = topRecommendation?.crop_id || 'SOYBEAN';
  const [activeCropId, setActiveCropId] = useState<string>(selectedCropId || defaultTopId);

  // Active crop full object
  const activeCrop = ALL_CROP_DETAILS.find((c) => c.crop_id === activeCropId) || ALL_CROP_DETAILS[0];
  const isTopChoice = activeCrop.crop_id === defaultTopId;
  const activeCropName = (language === 'mr' ? activeCrop.crop_name_mr : activeCrop.crop_name_hi) || activeCrop.crop_name_hi;

  const handleSelectCrop = (cropId: string) => {
    triggerHaptic('medium');
    setActiveCropId(cropId);
    setSelectedCropId(cropId);
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = `वर्तमान में चयनित फसल ${activeCropName} है। अनुमानित शुद्ध लाभ ${formatCurrencyINR(activeCrop.expected_net_profit_per_acre_inr)} प्रति एकड़, अनुमानित लागत ${formatCurrencyINR(activeCrop.total_cost_inr_per_acre)} प्रति एकड़, और अनुमानित पैदावार ${activeCrop.expected_yield_qtl_per_acre} क्विंटल प्रति एकड़ है।`;
    speakText(msg, language);
  };

  const handleProceedToWhatIf = () => {
    triggerHaptic('success');
    setSelectedCropId(activeCropId);
    goToCard(7); // Proceed to What-If Risk Simulation
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-36">
      
      {/* Clean Title & Description Header with Proper Hierarchy */}
      <div className="space-y-2 pb-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug flex-1">
            {t('resultsTitle')}
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
          आपकी मिट्टी, सिंचाई और मंडी भाव के आधार पर एआई द्वारा विश्लेषित परिणाम।
        </p>
      </div>

      {/* ACTIVE SELECTED DETAILED CROP HERO CARD */}
      <div className={`rounded-3xl border-2 overflow-hidden shadow-lg transition-all ${
        isTopChoice
          ? 'border-emerald-700 bg-white dark:bg-[#1E231B]'
          : 'border-stone-400 dark:border-stone-600 bg-white dark:bg-[#1E231B]'
      }`}>
        {/* Top Header Banner */}
        <div className={`px-5 py-3 flex items-center justify-between text-white ${
          isTopChoice ? 'bg-emerald-700' : 'bg-stone-800 dark:bg-stone-900'
        }`}>
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className="material-symbols-outlined text-base text-amber-300">
              {isTopChoice ? 'star' : 'check_circle'}
            </span>
            <span>{isTopChoice ? t('topChoiceBadge') : 'चयनित फसल विवरण'}</span>
          </div>
          <span className="text-xs font-black bg-white/20 px-2.5 py-0.5 rounded-full">
            {activeCrop.suitability_pct}% मैच स्कोर
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Crop Name & Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner border border-stone-200 dark:border-stone-700">
                {activeCrop.iconEmoji}
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#1A1C18] dark:text-[#E2E3DC] font-headline">
                  {activeCropName}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {activeCrop.duration_days} दिन फसल अवधि • मंडी भाव: {formatCurrencyINR(activeCrop.forecasted_mandi_price_inr_per_qtl)}/क्विंटल
                </p>
              </div>
            </div>
          </div>

          {/* 3-Pillar Balanced Metric Scorecard (Clean Neutral Stone Palette) */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {/* 1. Net Profit */}
            <div className="bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block leading-tight">
                {t('estimatedProfit')}
              </span>
              <span className="text-base font-black text-emerald-700 dark:text-emerald-400 block leading-tight mt-1">
                {formatCurrencyINR(activeCrop.expected_net_profit_per_acre_inr)}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium mt-0.5 block">
                {t('perAcre')}
              </span>
            </div>

            {/* 2. Expected Yield */}
            <div className="bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block leading-tight">
                {t('expectedYield')}
              </span>
              <span className="text-base font-black text-stone-900 dark:text-stone-100 block leading-tight mt-1">
                {activeCrop.expected_yield_qtl_per_acre}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium mt-0.5 block">
                {t('quintalPerAcre')}
              </span>
            </div>

            {/* 3. Estimated Working Cost */}
            <div className="bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block leading-tight">
                {t('estimatedCost')}
              </span>
              <span className="text-base font-extrabold text-stone-900 dark:text-stone-100 block leading-tight mt-1">
                {formatCurrencyINR(activeCrop.total_cost_inr_per_acre)}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium mt-0.5 block">
                {t('perAcre')}
              </span>
            </div>
          </div>

          {/* Itemized CACP Cost Breakdown Accordion */}
          {activeCrop.cost_breakdown && (
            <div className="border border-stone-300 dark:border-stone-700 rounded-2xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setShowCostAccordion(!showCostAccordion)}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900/70 flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-emerald-700 dark:text-emerald-400">receipt_long</span>
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
                    <span className="font-bold">{formatCurrencyINR(activeCrop.cost_breakdown.seed_cost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('fertilizerCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(activeCrop.cost_breakdown.fertilizer_cost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('pesticideCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(activeCrop.cost_breakdown.pesticide_cost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('machineryCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(activeCrop.cost_breakdown.machinery_rental_cost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('labourCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(activeCrop.cost_breakdown.labour_cost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600 dark:text-stone-400">{t('irrigationCost')}</span>
                    <span className="font-bold">{formatCurrencyINR(activeCrop.cost_breakdown.irrigation_electricity_cost)}</span>
                  </div>
                  <div className="flex justify-between pt-2 font-extrabold text-emerald-800 dark:text-emerald-300 border-t border-stone-200 dark:border-stone-700">
                    <span>कुल कार्यशील लागत (CACP A2)</span>
                    <span>{formatCurrencyINR(activeCrop.cost_breakdown.operational_cost_a2_inr_per_acre)} / एकड़</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Explainable Why Selected Rationale Bullets */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-emerald-700 dark:text-emerald-400">lightbulb</span>
              <span>एआई द्वारा चयन का कारण:</span>
            </h4>
            <ul className="space-y-1.5 pl-1">
              {activeCrop.why_recommended.map((bullet, idx) => (
                <li key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2 leading-relaxed">
                  <span className="material-symbols-outlined text-sm text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">check</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ALL CANDIDATE CROPS COMPARISON LIST */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          अन्य विकल्प (क्लिक करके पूरा डेटा देखें):
        </h4>

        <div className="space-y-2.5">
          {ALL_CROP_DETAILS.map((crop) => {
            const isCurrentlyActive = crop.crop_id === activeCropId;
            const cName = (language === 'mr' ? crop.crop_name_mr : crop.crop_name_hi) || crop.crop_name_hi;

            return (
              <button
                key={crop.crop_id}
                type="button"
                onClick={() => handleSelectCrop(crop.crop_id)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] shadow-2xs ${
                  isCurrentlyActive
                    ? 'border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-700/20'
                    : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1E231B] hover:border-emerald-600/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{crop.iconEmoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#1A1C18] dark:text-[#E2E3DC] font-headline">
                        {cName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        crop.suitability_pct >= 90
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}>
                        {crop.suitability_pct}% मैच
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mt-0.5">
                      <span>लागत: {formatCurrencyINR(crop.total_cost_inr_per_acre)}</span>
                      <span>•</span>
                      <span>पैदावार: {crop.expected_yield_qtl_per_acre} क्विंटल</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block font-medium">शुद्ध लाभ</span>
                  <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400">
                    {formatCurrencyINR(crop.expected_net_profit_per_acre_inr)}
                  </span>
                </div>
              </button>
            );
          })}
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
          onClick={handleProceedToWhatIf}
          className="w-full py-4 px-6 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{activeCropName} के साथ मौसम व जोखिम जांचें</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
