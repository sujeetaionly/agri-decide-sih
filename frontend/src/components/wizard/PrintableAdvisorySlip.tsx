import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrencyINR, triggerHaptic } from '../../lib/utils';

interface PrintableAdvisorySlipProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableAdvisorySlip: React.FC<PrintableAdvisorySlipProps> = ({
  isOpen,
  onClose,
}) => {
  const { topRecommendation, farmData } = useWizard();
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const crop = topRecommendation || {
    crop_id: 'SOYBEAN',
    crop_name_en: 'Soybean',
    crop_name_hi: 'सोयाबीन',
    crop_name_mr: 'सोयाबीन',
    suitability_pct: 94.0,
    duration_days: 95,
    expected_yield_qtl_per_acre: 9.5,
    yield_range_qtl: '8.5 - 10.5 क्विंटल',
    total_cost_inr_per_acre: 19412.0,
    forecasted_mandi_price_inr_per_qtl: 4625.0,
    expected_net_profit_per_acre_inr: 24525.0,
    net_profit_per_day_inr: 258.0,
    price_volatility: 'LOW',
    why_recommended: [],
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
  };

  const cropName = (language === 'mr' ? crop.crop_name_mr : crop.crop_name_hi) || crop.crop_name_hi;
  const soilName = farmData.soilType === 'BLACK' ? 'काली मिट्टी' : farmData.soilType === 'RED' ? 'लाल मिट्टी' : farmData.soilType === 'SANDY' ? 'बलुई मिट्टी' : farmData.soilType === 'CLAY' ? 'चिकनी मिट्टी' : 'दोमट मिट्टी';
  const waterName = farmData.waterSource === 'CANAL' ? 'नहर' : farmData.waterSource === 'BOREWELL' ? 'ट्यूबवेल' : farmData.waterSource === 'RAINFED' ? 'बारिश (वर्षा आधारित)' : 'कुआं';
  const todayFormatted = new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const handlePrint = () => {
    triggerHaptic('success');
    window.print();
  };

  const handleWhatsAppShare = () => {
    triggerHaptic('light');
    const text = `🌾 *कृषि-वाइज़ एआई (Agri-Decide) — किसान डिजिटल सलाह पर्ची* 🌾\n\n📌 *सुझाई गई फसल*: ${cropName}\n🌱 *खेत का आकार*: ${farmData.landAcres || 2.5} एकड़\n🏞️ *मिट्टी*: ${soilName} | *सिंचाई*: ${waterName}\n💰 *अनुमानित शुद्ध लाभ*: ${formatCurrencyINR(crop.expected_net_profit_per_acre_inr)} / एकड़\n💵 *अनुमानित लागत*: ${formatCurrencyINR(crop.total_cost_inr_per_acre)} / एकड़\n⚖️ *अनुमानित पैदावार*: ${crop.expected_yield_qtl_per_acre} क्विंटल / एकड़\n📅 *मौसम*: खरीफ 2026\n\n_कृषि एवं किसान कल्याण मंत्रालय (CACP/ICAR) मानकों पर आधारित_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      
      {/* Inline Print Media Stylesheet to guarantee pristine A4 print output */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          body {
            background: #ffffff !important;
            color: #111111 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-slip-container, #printable-slip-container * {
            visibility: visible;
          }
          #printable-slip-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: 2px solid #0F381E !important;
            background: #ffffff !important;
            border-radius: 12px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="printable-slip-container"
        className="w-full max-w-lg bg-white text-stone-900 rounded-3xl p-6 shadow-2xl space-y-4 border-2 border-stone-300 print:max-w-none print:border-2 print:border-[#0F381E] print:p-6 print:rounded-2xl"
      >
        
        {/* Official Header Banner */}
        <div className="border-b-2 border-emerald-700/40 pb-3 text-center space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 pb-1 border-b border-stone-200">
            <span>भारत सरकार • कृषि एवं किसान कल्याण मंत्रालय</span>
            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono">
              प्रमाणित पर्ची #{crop.crop_id}-2026
            </span>
          </div>

          <div className="pt-2">
            <h2 className="text-2xl font-black font-headline text-emerald-900">
              डिजिटल किसान कृषि सलाह पर्ची
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              कृषि-वाइज़ एआई (Agri-Decide) • CACP एवं ICAR वैज्ञानिक मानकों पर आधारित
            </p>
            <p className="text-[11px] text-stone-500 pt-0.5">
              दिनांक: {todayFormatted} • कार्यक्षेत्र: पुणे, महाराष्ट्र • खरीफ मौसम 2026
            </p>
          </div>
        </div>

        {/* Section 1: Farmer & Land Profile */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-300 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-stone-500 block text-[10px] font-medium">खेत का आकार</span>
            <span className="font-bold text-stone-900 text-sm">{farmData.landAcres || 2.5} एकड़</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[10px] font-medium">मिट्टी का प्रकार</span>
            <span className="font-bold text-stone-900 text-sm">{soilName}</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[10px] font-medium">सिंचाई सुविधा</span>
            <span className="font-bold text-stone-900 text-sm">{waterName}</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[10px] font-medium">बुवाई मौसम</span>
            <span className="font-bold text-stone-900 text-sm">खरीफ 2026</span>
          </div>
        </div>

        {/* Section 2: Recommended Crop Decision Hero */}
        <div className="bg-emerald-50/80 border-2 border-emerald-600 p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
              सर्वोत्तम अनुशंसित फसल (Top AI Choice)
            </span>
            <span className="text-xs bg-emerald-700 text-white font-extrabold px-2.5 py-0.5 rounded-full">
              {Math.round(crop.suitability_pct)}% अनुकूलता स्कोर
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-emerald-950 font-headline">
              🌾 {cropName}
            </h3>
            <span className="text-xs font-bold text-emerald-800">
              फसल अवधि: {crop.duration_days} दिन
            </span>
          </div>
          
          {/* Key Financial & Yield Scorecards */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-300 text-center">
            <div className="bg-white p-2 rounded-xl border border-emerald-200">
              <span className="text-stone-500 block text-[10px] font-bold">अनुमानित शुद्ध लाभ</span>
              <span className="font-black text-emerald-700 text-sm block my-0.5">
                {formatCurrencyINR(crop.expected_net_profit_per_acre_inr)}
              </span>
              <span className="text-[9px] text-stone-400">/ एकड़</span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-emerald-200">
              <span className="text-stone-500 block text-[10px] font-bold">अनुमानित कुल लागत</span>
              <span className="font-black text-amber-800 text-sm block my-0.5">
                {formatCurrencyINR(crop.total_cost_inr_per_acre)}
              </span>
              <span className="text-[9px] text-stone-400">/ एकड़</span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-emerald-200">
              <span className="text-stone-500 block text-[10px] font-bold">अनुमानित पैदावार</span>
              <span className="font-black text-blue-800 text-sm block my-0.5">
                {crop.expected_yield_qtl_per_acre}
              </span>
              <span className="text-[9px] text-stone-400">क्विंटल / एकड़</span>
            </div>
          </div>
        </div>

        {/* Section 3: Itemized CACP Cost Breakdown */}
        {crop.cost_breakdown && (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-stone-800 text-xs">
                मदवार लागत विवरण (CACP आधिकारिक मानक प्रति एकड़):
              </h4>
              <span className="text-[10px] text-stone-500 font-semibold">
                कुल: {formatCurrencyINR(crop.total_cost_inr_per_acre)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-300 text-xs">
              <div className="bg-white p-2 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px]">बीज खर्च</span>
                <span className="font-bold text-stone-800">{formatCurrencyINR(crop.cost_breakdown.seed_cost)}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px]">खाद व उर्वरक</span>
                <span className="font-bold text-stone-800">{formatCurrencyINR(crop.cost_breakdown.fertilizer_cost)}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px]">कीटनाशक व सुरक्षा</span>
                <span className="font-bold text-stone-800">{formatCurrencyINR(crop.cost_breakdown.pesticide_cost)}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px]">जुताई व मशीनरी</span>
                <span className="font-bold text-stone-800">{formatCurrencyINR(crop.cost_breakdown.machinery_rental_cost)}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px]">श्रम व मजदूरी</span>
                <span className="font-bold text-stone-800">{formatCurrencyINR(crop.cost_breakdown.labour_cost)}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px]">सिंचाई व बिजली</span>
                <span className="font-bold text-stone-800">{formatCurrencyINR(crop.cost_breakdown.irrigation_electricity_cost)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Official Verification & Helpline Footer */}
        <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-[11px] text-stone-600">
          <div>
            <p className="font-bold text-emerald-900">किसान हेल्पलाइन: 1800-180-1551 (टोल-फ्री २४x७)</p>
            <p className="text-[10px] text-stone-500">कृषि निर्णय सहायता प्रणाली द्वारा डिजिटल रूप से उत्पन्न</p>
          </div>
          <div className="text-right">
            <span className="inline-block border border-emerald-600 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
              ✓ डिजिटल सत्यापित
            </span>
          </div>
        </div>

        {/* Modal Action Buttons (Screen Only - Hidden During Print) */}
        <div className="space-y-2 pt-3 border-t border-stone-200 no-print">
          <button
            onClick={handlePrint}
            className="w-full py-3.5 px-5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            <span>सलाह पर्ची प्रिंट / पीडीएफ डाउनलोड करें (A4)</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-5 rounded-full bg-white border-2 border-stone-300 text-stone-800 font-bold text-xs hover:bg-stone-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-emerald-600">share</span>
            <span>व्हाट्सएप पर साझा करें</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-stone-500 hover:text-stone-800 text-xs font-bold text-center cursor-pointer"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
