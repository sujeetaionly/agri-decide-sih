import React from 'react';
import { createPortal } from 'react-dom';
import { useWizard } from '../../context/WizardContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrencyINR } from '../../lib/utils';
import { getCropSchedule } from '../../data/cropMilestones';

import { getDynamicCropDetail } from '../../data/cropAgronomics';

interface PrintableAdvisorySlipProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableAdvisorySlip: React.FC<PrintableAdvisorySlipProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeCropPlan, topRecommendation, farmData } = useWizard();
  const { language } = useLanguage();

  if (!isOpen) return null;

  const crop = activeCropPlan || topRecommendation || getDynamicCropDetail('SOYBEAN', farmData);

  const langKey = language || 'hi';

  const L = {
    appName: { hi: 'फसल-दिशा', mr: 'पीक-दिशा', gu: 'પાક-દિશા', raj: 'फसल-दिशा', en: 'Fasal Disha' }[langKey] || 'फसल-दिशा',
    slipTitle: { hi: 'डिजिटल फसल योजना रिपोर्ट', mr: 'डिजिटल पीक नियोजन अहवाल', gu: 'ડિજિટલ પાક આયોજન રિપોર્ટ', raj: 'डिजिटल फसल योजना रिपोर्ट', en: 'Digital Crop Action Plan Report' }[langKey] || 'डिजिटल फसल योजना रिपोर्ट',
    dateLabel: { hi: 'दिनांक', mr: 'दिनांक', gu: 'તારીખ', raj: 'दिनांक', en: 'Date' }[langKey] || 'दिनांक',
    selectedCrop: { hi: 'चयनित फसल', mr: 'निवडलेले पीक', gu: 'પસંદ કરેલ પાક', raj: 'चुणीज्यौड़ी फसल', en: 'Selected Crop' }[langKey] || 'चयनित फसल',
    fieldSize: { hi: 'खेत का आकार', mr: 'शेताचा आकार', gu: 'ખેતરનું કદ', raj: 'खेत रो नाप', en: 'Field Size' }[langKey] || 'खेत का आकार',
    soilType: { hi: 'मिट्टी का प्रकार', mr: 'मातीचा प्रकार', gu: 'જમીનનો પ્રકાર', raj: 'माटी रो प्रकार', en: 'Soil Type' }[langKey] || 'मिट्टी का प्रकार',
    waterSource: { hi: 'सिंचाई साधन', mr: 'पाण्याचे साधन', gu: 'સિંચાઈ સાધન', raj: 'सिंचाई रो साधन', en: 'Irrigation Source' }[langKey] || 'सिंचाई साधन',
    acre: { hi: 'एकड़', mr: 'एकर', gu: 'એકર', raj: 'एकड़', en: 'acre' }[langKey] || 'एकड़',
    duration: { hi: 'कालावधि', mr: 'कालावधी', gu: 'કાલાવધિ', raj: 'कालावधि', en: 'Duration' }[langKey] || 'कालावधि',
    days: { hi: 'दिन', mr: 'दिवस', gu: 'દિવસ', raj: 'दिन', en: 'Days' }[langKey] || 'दिन',
    expectedYield: { hi: 'अनुमानित पैदावार', mr: 'अपेक्षित उत्पादन', gu: 'અંદાજિત ઉત્પાદન', raj: 'अनुमानित पैदावार', en: 'Expected Yield' }[langKey] || 'अनुमानित पैदावार',
    mandiPrice: { hi: 'मंडी भाव अनुमान', mr: 'मंडी भाव अंदाज', gu: 'બજાર ભાવ અંદાજ', raj: 'मंडी भाव अनुमान', en: 'Estimated Mandi Price' }[langKey] || 'मंडी भाव अनुमान',
    totalCost: { hi: 'कुल लागत', mr: 'एकूण खर्च', gu: 'કુલ ખર્ચ', raj: 'कुल लागत', en: 'Total Cost' }[langKey] || 'कुल लागत',
    netProfit: { hi: 'अनुमानित शुद्ध लाभ', mr: 'अपेक्षित निव्वळ नफा', gu: 'અંદાજિત ચોખ્ખો નફો', raj: 'अनुमानित शुद्ध लाभ', en: 'Estimated Net Profit' }[langKey] || 'अनुमानित शुद्ध लाभ',
    quintal: { hi: 'क्विंटल', mr: 'क्विंटल', gu: 'ક્વિન્ટલ', raj: 'क्विंटल', en: 'qtl' }[langKey] || 'क्विंटल',
    costBreakdownTitle: { hi: 'मदवार लागत विवरण', mr: 'बाबनिहाय खर्च तपशील', gu: 'વિગતવાર ખર્ચ વિવરણ', raj: 'मदवार लागत विवरण', en: 'Itemized Cost Breakdown' }[langKey] || 'मदवार लागत विवरण',
    seedCost: { hi: 'बीज', mr: 'बियाणे', gu: 'બીજ', raj: 'बीज', en: 'Seed' }[langKey] || 'बीज',
    fertilizerCost: { hi: 'उर्वरक/खाद', mr: 'खते/पोषण', gu: 'ખાતર', raj: 'खाद', en: 'Fertilizer' }[langKey] || 'उर्वरक/खाद',
    pesticideCost: { hi: 'कीटनाशक', mr: 'कीटकनाशक', gu: 'જંતુનાશક', raj: 'दवा', en: 'Pesticide' }[langKey] || 'कीटनाशक',
    machineryCost: { hi: 'जुताई/मशीन', mr: 'मशागत/यंत्रे', gu: 'ખેડ/મશીનરી', raj: 'जुताई/मशीन', en: 'Machinery' }[langKey] || 'जुताई/मशीन',
    labourCost: { hi: 'मजदूरी', mr: 'मजुरी', gu: 'મજૂરી', raj: 'मजदूरी', en: 'Labour' }[langKey] || 'मजदूरी',
    irrigationCost: { hi: 'सिंचाई/बिजली', mr: 'पाणी/वीज', gu: 'સિંચાઈ', raj: 'सिंचाई', en: 'Irrigation' }[langKey] || 'सिंचाई/बिजली',
    planTitle: { hi: 'फसल कार्य-योजना कैलेंडर', mr: 'पीक कार्य-योजना वेळापत्रક', gu: 'પાક કાર્ય-યોજના કેલેન્ડર', raj: 'फसल कार्य-योजना पंचांग', en: 'Crop Action Plan Calendar' }[langKey] || 'फसल कार्य-योजना कैलेंडर',
    dayAndStage: { hi: 'दिन व चरण', mr: 'दिवस व टप्पा', gu: 'દિવસ અને તબક્કો', raj: 'दिन व चरण', en: 'Day & Stage' }[langKey] || 'दिन व चरण',
    actionAndInstructions: { hi: 'कृषि कार्य एवं निर्देश', mr: 'कृषी कार्य व मार्गदर्शन', gu: 'કૃષિ કાર્ય અને સૂચનાઓ', raj: 'कृषि कार्य व निर्देश', en: 'Agricultural Actions & Management' }[langKey] || 'कृषि कार्य एवं निर्देश',
    helplineText: { hi: 'किसान हेल्पलाइन: 1800-180-1551 (टोल-फ्री २४x७)', mr: 'शेतकरी हेल्पलाइन: 1800-180-1551 (टोल-फ्री २४x७)', gu: 'કિસાન હેલ્પલાઇન: 1800-180-1551 (ટોલ-ફ્રી २४x७)', raj: 'किसान हेल्पलाइन: 1800-180-1551 (टोल-फ्री २४x७)', en: 'Farmer Helpline: 1800-180-1551 (Toll-Free 24x7)' }[langKey] || 'किसान हेल्पलाइन: 1800-180-1551 (टोल-फ्री २४x७)',
  };

  const soilNames: Record<string, Record<string, string>> = {
    BLACK: { hi: 'काली मिट्टी', mr: 'काळी माती', gu: 'કાળી જમીન', raj: 'काली माटी', en: 'Black Soil' },
    RED: { hi: 'लाल मिट्टी', mr: 'तांबडी माती', gu: 'લાલ જમીન', raj: 'राता माटी', en: 'Red Soil' },
    SANDY: { hi: 'बलुई मिट्टी', mr: 'रेतीयुक्त माती', gu: 'રેતાળ જમીન', raj: 'बलुई माटी', en: 'Sandy Soil' },
    CLAY: { hi: 'चिकनी मिट्टी', mr: 'चिकण माती', gu: 'ચીકણી જમીન', raj: 'चिकनी माटी', en: 'Clay Soil' },
    LOAM: { hi: 'दोमट मिट्टी', mr: 'गाळाची माती', gu: 'ગોરાડુ જમીન', raj: 'दोमट माटी', en: 'Loam Soil' },
  };

  const waterNames: Record<string, Record<string, string>> = {
    CANAL: { hi: 'नहर', mr: 'कालवा', gu: 'નહેર', raj: 'नहर', en: 'Canal' },
    BOREWELL: { hi: 'ट्यूबवेल', mr: 'बोअरवेल', gu: 'બોરવેલ', raj: 'बोरवेल', en: 'Borewell' },
    WELL: { hi: 'कुआं', mr: 'विहीर', gu: 'કૂવો', raj: 'कूवो', en: 'Open Well' },
    RAINFED: { hi: 'वर्षा आधारित', mr: 'पावसावर आधारित', gu: 'વરસાદ આધારિત', raj: 'बरसात पै', en: 'Rainfed' },
  };

  const soilKey = farmData.soilType || 'LOAM';
  const waterKey = farmData.waterSource || 'WELL';
  const soilName = soilNames[soilKey]?.[langKey] || soilNames['LOAM'][langKey];
  const waterName = waterNames[waterKey]?.[langKey] || waterNames['WELL'][langKey];

  const cropName = (language === 'mr' ? crop.crop_name_mr : crop.crop_name_hi) || crop.crop_name_hi;
  const todayFormatted = new Date().toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const scheduleData = getCropSchedule(crop.crop_id || 'SOYBEAN');

  const milestones = scheduleData.milestones.map((m) => ({
    day: m.day,
    badge: m.badge[langKey] || m.badge.hi,
    title: m.title[langKey] || m.title.hi,
    desc: m.desc[langKey] || m.desc.hi,
  }));

  const handleWhatsAppShareFromSlip = () => {
    const text = `🌾 *फसल-दिशा (Fasal Disha)* 🌾\n_हर खेत को मिले सही दिशा | डिजिटल फसल रिपोर्ट_\n━━━━━━━━━━━━━━━━━━━\n\n🌱 *अनुशंसित फसल*: *${cropName}*\n💰 *अनुमानित शुद्ध लाभ*: *${formatCurrencyINR(crop.expected_net_profit_per_acre_inr)} / एकड़*\n💵 *कुल उत्पादन लागत*: *${formatCurrencyINR(crop.total_cost_inr_per_acre)} / एकड़*\n⚖️ *अनुमानित पैदावार*: *${crop.expected_yield_qtl_per_acre} क्विंटल / एकड़*\n\n━━━━━━━━━━━━━━━━━━━\n📞 *किसान हेल्पलाइन*: 1800-180-1551 (टोल-फ्री २४x७)\n🌐 *फसल-दिशा डिजिटल कृषि सलाहकार*`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const modalContent = (
    <div
      id="printable-slip-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-start p-3 sm:p-4 overflow-y-auto print:static print:bg-white print:p-0"
    >
      {/* Screen-only Modal Control Bar */}
      <div className="w-full max-w-lg mb-2 flex items-center justify-between bg-white dark:bg-stone-900 px-4 py-2.5 rounded-2xl shadow-lg print:hidden">
        <span className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5 font-headline">
          <span className="material-symbols-outlined text-primary text-lg">description</span>
          <span>{L.slipTitle}</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleWhatsAppShareFromSlip}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #111827 !important;
            box-sizing: border-box !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
          }
          #root {
            display: none !important;
          }
          #printable-slip-modal-backdrop {
            position: static !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            display: block !important;
            overflow: visible !important;
            width: 100% !important;
            height: auto !important;
          }
          #printable-slip-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 16px 20px !important;
            box-shadow: none !important;
            border: 2px solid #0F381E !important;
            border-radius: 12px !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Official Advisory Document Sheet */}
      <div
        id="printable-slip-container"
        className="w-full bg-white text-[#111827] border-2 border-[#0F381E] rounded-xl p-5 space-y-3"
      >
        
        {/* 1. Header (Icon + App Title + Date Box) */}
        <div className="border-b-2 border-[#0F381E] pb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Authentic Brand App Icon */}
            <div className="w-10 h-10 rounded-xl bg-[#0F381E] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-4m2 -3h9l4 7" />
                <path d="M9 17l1 -6h4l2 6" />
                <path d="M14 8h-6v3h6z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#0F381E] leading-none">
                {L.appName}
              </h1>
              <p className="text-xs font-bold text-stone-500 mt-0.5">
                {L.slipTitle}
              </p>
            </div>
          </div>

          <div className="text-right text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-1 space-y-0.5">
            <span className="font-extrabold text-stone-800 block">{L.dateLabel}: {todayFormatted}</span>
            <span className="text-[11px] text-stone-500 font-semibold block">{L.duration}: {scheduleData.durationDays} {L.days}</span>
          </div>
        </div>

        {/* 2. Farmer & Land Profile (Group 1: Clean 4-Column Balanced Grid) */}
        <div className="bg-[#F9FAFB] rounded-xl border border-stone-300 p-2.5 grid grid-cols-4 gap-2 text-center">
          <div className="border-r border-stone-200 pr-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{L.selectedCrop}</span>
            <span className="text-base font-black text-[#0F381E] block mt-0.5">{cropName}</span>
          </div>
          <div className="border-r border-stone-200 pr-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{L.fieldSize}</span>
            <span className="text-sm font-extrabold text-stone-900 block mt-0.5">{farmData.landAcres || 2.5} {L.acre}</span>
          </div>
          <div className="border-r border-stone-200 pr-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{L.soilType}</span>
            <span className="text-sm font-extrabold text-stone-900 block mt-0.5">{soilName}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{L.waterSource}</span>
            <span className="text-sm font-extrabold text-stone-900 block mt-0.5">{waterName}</span>
          </div>
        </div>

        {/* 3. Crop Economics & Forecast (Group 2: Direct, Concise Scorecards) */}
        <div className="border border-stone-300 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-[#0F381E] text-white px-3.5 py-1.5 flex items-center justify-between font-bold text-xs">
            <span className="text-sm font-black">{cropName}</span>
            <span className="text-xs bg-white/15 px-2.5 py-0.5 rounded-full">{scheduleData.durationDays} {L.days}</span>
          </div>

          <div className="grid grid-cols-4 divide-x divide-stone-200 text-center py-2.5 bg-white">
            <div className="px-2">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{L.expectedYield}</span>
              <span className="text-base font-black text-stone-900 block mt-1">
                {crop.expected_yield_qtl_per_acre} {L.quintal}/{L.acre}
              </span>
            </div>

            <div className="px-2">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{L.mandiPrice}</span>
              <span className="text-base font-black text-stone-900 block mt-1">
                {formatCurrencyINR(crop.forecasted_mandi_price_inr_per_qtl)}/{L.quintal}
              </span>
            </div>

            <div className="px-2">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{L.totalCost}</span>
              <span className="text-base font-black text-stone-900 block mt-1">
                {formatCurrencyINR(crop.total_cost_inr_per_acre)}/{L.acre}
              </span>
            </div>

            <div className="px-2 bg-[#0F381E]/5">
              <span className="text-[10px] font-black text-[#0F381E] uppercase tracking-wider block">{L.netProfit}</span>
              <span className="text-lg font-black text-[#0F381E] block mt-0.5">
                {formatCurrencyINR(crop.expected_net_profit_per_acre_inr)}/{L.acre}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Itemized Cost Breakdown (Group 3: Symmetrical 6-Column Card) */}
        {crop.cost_breakdown && (
          <div className="border border-stone-300 rounded-xl overflow-hidden text-xs">
            <div className="bg-stone-100 px-3 py-1 font-bold text-stone-800 border-b border-stone-300 text-[11px]">
              {L.costBreakdownTitle} ({L.acre})
            </div>
            <div className="grid grid-cols-6 divide-x divide-stone-200 text-center py-2 bg-white text-[11px]">
              <div className="px-1">
                <span className="text-[10px] font-bold text-stone-500 block">{L.seedCost}</span>
                <span className="font-extrabold text-stone-900 block mt-0.5">{formatCurrencyINR(crop.cost_breakdown.seed_cost)}</span>
              </div>
              <div className="px-1">
                <span className="text-[10px] font-bold text-stone-500 block">{L.fertilizerCost}</span>
                <span className="font-extrabold text-stone-900 block mt-0.5">{formatCurrencyINR(crop.cost_breakdown.fertilizer_cost)}</span>
              </div>
              <div className="px-1">
                <span className="text-[10px] font-bold text-stone-500 block">{L.pesticideCost}</span>
                <span className="font-extrabold text-stone-900 block mt-0.5">{formatCurrencyINR(crop.cost_breakdown.pesticide_cost)}</span>
              </div>
              <div className="px-1">
                <span className="text-[10px] font-bold text-stone-500 block">{L.machineryCost}</span>
                <span className="font-extrabold text-stone-900 block mt-0.5">{formatCurrencyINR(crop.cost_breakdown.machinery_rental_cost)}</span>
              </div>
              <div className="px-1">
                <span className="text-[10px] font-bold text-stone-500 block">{L.labourCost}</span>
                <span className="font-extrabold text-stone-900 block mt-0.5">{formatCurrencyINR(crop.cost_breakdown.labour_cost)}</span>
              </div>
              <div className="px-1">
                <span className="text-[10px] font-bold text-stone-500 block">{L.irrigationCost}</span>
                <span className="font-extrabold text-stone-900 block mt-0.5">{formatCurrencyINR(crop.cost_breakdown.irrigation_electricity_cost)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. Step-by-Step Crop Action Plan (Group 4: Structured Milestone Calendar) */}
        <div className="border border-stone-300 rounded-xl overflow-hidden text-xs">
          <div className="bg-[#0F381E] text-white px-3 py-1.5 font-bold flex items-center justify-between text-[11px]">
            <span className="text-xs font-black">{L.planTitle}</span>
            <span className="text-stone-200 font-semibold">{scheduleData.durationDays} {L.days}</span>
          </div>

          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-300 text-[10px] font-bold text-stone-600 uppercase">
                <th className="py-1 px-3 w-[26%] text-left">{L.dayAndStage}</th>
                <th className="py-1 px-3 w-[74%] text-left">{L.actionAndInstructions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white text-[11px]">
              {milestones.map((m) => (
                <tr key={m.day} className="hover:bg-stone-50/60">
                  <td className="py-1.5 px-3 align-top font-bold text-stone-900">
                    <span className="inline-block bg-[#0F381E]/10 text-[#0F381E] px-2 py-0.5 rounded text-[10px] font-black border border-[#0F381E]/20 mb-0.5">
                      {L.days} {m.day}
                    </span>
                    <span className="block text-xs font-bold text-stone-800 leading-tight">{m.badge}</span>
                  </td>
                  <td className="py-1.5 px-3 align-top">
                    <span className="font-extrabold text-stone-900 text-xs block leading-snug">{m.title}</span>
                    <p className="text-[10.5px] text-stone-600 mt-0.5 leading-relaxed">{m.desc}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 6. Footer (Group 5: Helpline) */}
        <div className="pt-2 border-t border-stone-300 text-center text-[10.5px] font-bold text-[#0F381E]">
          {L.helplineText}
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
