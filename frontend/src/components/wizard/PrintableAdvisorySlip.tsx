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


  const handlePrint = () => {
    triggerHaptic('success');
    window.print();
  };

  const handleWhatsAppShare = () => {
    triggerHaptic('light');
    const text = `🌾 *कृषि-वाइज़ एआई (Agri-Decide) फसल सलाह पर्ची* 🌾\n\n📌 *सुझाई गई फसल*: ${cropName}\n🌱 *खेत का आकार*: ${farmData.landAcres} एकड़\n💰 *अनुमानित शुद्ध लाभ*: ${formatCurrencyINR(crop.expected_net_profit_per_acre_inr)} / एकड़\n💵 *अनुमानित लागत*: ${formatCurrencyINR(crop.total_cost_inr_per_acre)} / एकड़\n⚖️ *अनुमानित पैदावार*: ${crop.expected_yield_qtl_per_acre} क्विंटल / एकड़\n📅 *बुवाई मौसम*: खरीफ 2026\n\n_कृषि एवं किसान कल्याण विभाग द्वारा प्रमाणित बेंचमार्क पर आधारित_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-md bg-white text-stone-900 rounded-3xl p-6 shadow-2xl space-y-5 border border-stone-300 print:p-0 print:border-none print:shadow-none print:max-w-none">
        
        {/* Printable Slip Header */}
        <div className="border-b-2 border-primary/30 pb-4 text-center space-y-1">
          <div className="inline-block bg-primary/10 text-primary font-bold text-xs px-3 py-0.5 rounded-full mb-1">
            भारत सरकार • स्मार्ट कृषि निर्णय प्रणाली
          </div>
          <h2 className="text-xl font-bold font-headline text-primary">
            डिजिटल कृषि सलाह पर्ची (Krishi Advisory Slip)
          </h2>
          <p className="text-[11px] text-stone-500">
            दिनांक: {new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • जिला: पुणे, महाराष्ट्र
          </p>
        </div>

        {/* Farmer & Plot Summary */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-stone-500 block">खेत का आकार:</span>
            <span className="font-bold text-stone-800">{farmData.landAcres} एकड़</span>
          </div>
          <div>
            <span className="text-stone-500 block">मिट्टी का प्रकार:</span>
            <span className="font-bold text-stone-800">{farmData.soilType === 'BLACK' ? 'काली मिट्टी' : 'दोमट मिट्टी'}</span>
          </div>
          <div>
            <span className="text-stone-500 block">सिंचाई सुविधा:</span>
            <span className="font-bold text-stone-800">मध्यम सिंचाई (कुआं)</span>
          </div>
          <div>
            <span className="text-stone-500 block">मौसम:</span>
            <span className="font-bold text-stone-800">खरीफ 2026</span>
          </div>
        </div>

        {/* Main Crop Recommendation Card */}
        <div className="bg-emerald-50 border-2 border-emerald-600/40 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase">सर्वोत्तम अनुशंसित फसल</span>
            <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md">94% मैच</span>
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-900">{cropName}</h3>
          
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200 text-center text-xs">
            <div>
              <span className="text-stone-500 block text-[10px]">शुद्ध लाभ</span>
              <span className="font-extrabold text-emerald-700">{formatCurrencyINR(crop.expected_net_profit_per_acre_inr)}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px]">अनुमानित लागत</span>
              <span className="font-bold text-amber-800">{formatCurrencyINR(crop.total_cost_inr_per_acre)}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px]">पैदावार</span>
              <span className="font-bold text-blue-800">{crop.expected_yield_qtl_per_acre} qtl</span>
            </div>
          </div>
        </div>

        {/* Itemized CACP Cost Breakdown */}
        {crop.cost_breakdown && (
          <div className="space-y-1.5 text-xs">
            <h4 className="font-bold text-stone-700">लागत विवरण (CACP आधिकारिक मानक):</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px]">
              <div>• बीज: {formatCurrencyINR(crop.cost_breakdown.seed_cost)}</div>
              <div>• खाद/उर्वरक: {formatCurrencyINR(crop.cost_breakdown.fertilizer_cost)}</div>
              <div>• कीटनाशक: {formatCurrencyINR(crop.cost_breakdown.pesticide_cost)}</div>
              <div>• जुताई/मशीनरी: {formatCurrencyINR(crop.cost_breakdown.machinery_rental_cost)}</div>
              <div>• मजदूरी: {formatCurrencyINR(crop.cost_breakdown.labour_cost)}</div>
              <div>• सिंचाई: {formatCurrencyINR(crop.cost_breakdown.irrigation_electricity_cost)}</div>
            </div>
          </div>
        )}

        {/* Advisory Actions (Screen Only - Hidden During Print) */}
        <div className="space-y-2.5 pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full py-3.5 px-4 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            <span>सलाह पर्ची प्रिंट / पीडीएफ डाउनलोड करें</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">share</span>
            <span>व्हाट्सएप पर साझा करें</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
