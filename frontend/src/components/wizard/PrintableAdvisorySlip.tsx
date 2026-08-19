import React from 'react';
import { createPortal } from 'react-dom';
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

  const MILESTONES = [
    {
      day: 0,
      stage: 'बुवाई व बीज उपचार',
      date: '25 जून 2026',
      action: 'बीज को ट्राइकोडर्मा (4 ग्राम/किग्रा) से उपचारित कर 3-4 सेमी गहराई और 45 सेमी कतार दूरी पर बुवाई करें।',
    },
    {
      day: 21,
      stage: 'निराई-गुड़ाई',
      date: '16 जुलाई 2026',
      action: 'खुरपी से पहली निराई करें या उपयुक्त खरपतवार नाशक का छिड़काव करें। पौधों की उचित छंटाई करें।',
    },
    {
      day: 45,
      stage: 'फूल व कीट निगरानी',
      date: '09 अगस्त 2026',
      action: 'खेत में नमी बनाए रखें। तना छेदक/सुंडी की निगरानी हेतु फेरोमोन ट्रैप लगाएं व नीम तेल छिड़कें।',
    },
    {
      day: 75,
      stage: 'दाना भराव व पोषण',
      date: '08 सितंबर 2026',
      action: 'दानों के अच्छे भराव हेतु 00:52:34 घुलनशील उर्वरक (10 ग्राम/लीटर) का छिड़काव करें।',
    },
    {
      day: 95,
      stage: 'कटाई व भंडारण',
      date: '28 सितंबर 2026',
      action: 'फलियां सुनहरी भूरी होने पर कटाई करें। दानों को धूप में सुखाकर 12% से कम नमी पर सुरक्षित बोरियों में रखें।',
    },
  ];

  const handlePrint = () => {
    triggerHaptic('success');
    window.print();
  };

  const handleWhatsAppShare = () => {
    triggerHaptic('light');
    const text = `🌾 *फसल-दिशा (Fasal Disha) — डिजिटल कृषि सलाह पर्ची* 🌾\n_हर खेत को मिले सही दिशा_\n\n📌 *सुझाई गई फसल*: ${cropName}\n🌱 *खेत का आकार*: ${farmData.landAcres || 2.5} एकड़\n🏞️ *मिट्टी*: ${soilName} | *सिंचाई*: ${waterName}\n💰 *अनुमानित शुद्ध लाभ*: ${formatCurrencyINR(crop.expected_net_profit_per_acre_inr)} / एकड़\n💵 *अनुमानित लागत*: ${formatCurrencyINR(crop.total_cost_inr_per_acre)} / एकड़\n⚖️ *अनुमानित पैदावार*: ${crop.expected_yield_qtl_per_acre} क्विंटल / एकड़\n📅 *मौसम*: खरीफ 2026-27\n\n_कृषि एवं किसान कल्याण मंत्रालय (CACP/ICAR) मानकों पर आधारित_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible print:block">
      
      {/* Strict Print CSS: Collapses root DOM so EXACTLY 1 A4 Page is generated with ZERO blank pages */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: 0 !important;
            background: #ffffff !important;
            color: #111111 !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 16px !important;
            box-shadow: none !important;
            border: 2px solid #0F381E !important;
            background: #ffffff !important;
            border-radius: 8px !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="printable-slip-container"
        className="w-full max-w-lg bg-white text-stone-900 rounded-3xl p-6 shadow-2xl space-y-4 border-2 border-stone-300 print:max-w-none print:border-2 print:border-[#0F381E] print:p-4 print:rounded-xl"
      >
        
        {/* Clean Header */}
        <div className="border-b-2 border-primary/30 pb-3 text-center space-y-1">
          <div className="inline-block bg-primary/10 text-primary font-bold text-xs px-3 py-0.5 rounded-full mb-1">
            फसल-दिशा (Fasal Disha)
          </div>
          <h2 className="text-2xl font-black font-headline text-[#1A1C18]">
            डिजिटल कृषि सलाह पर्ची
          </h2>
          <p className="text-xs text-stone-500">
            हर खेत को मिले सही दिशा • दिनांक: {todayFormatted} • खरीफ मौसम 2026-27
          </p>
        </div>

        {/* Farmer & Plot Summary */}
        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 grid grid-cols-3 gap-2 text-xs text-center">
          <div>
            <span className="text-stone-400 block text-[10px] font-medium">खेत का आकार</span>
            <span className="font-bold text-stone-800 text-sm">{farmData.landAcres || 2.5} एकड़</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] font-medium">मिट्टी का प्रकार</span>
            <span className="font-bold text-stone-800 text-sm">{soilName}</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] font-medium">सिंचाई सुविधा</span>
            <span className="font-bold text-stone-800 text-sm">{waterName}</span>
          </div>
        </div>

        {/* Recommended Crop Decision Card */}
        <div className="bg-emerald-50/80 border-2 border-emerald-600/40 p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-emerald-950 font-headline">
              🌾 {cropName}
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              फसल अवधि: {crop.duration_days} दिन
            </span>
          </div>
          
          {/* Key Financial & Yield Scorecards */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200 text-center">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
              <span className="text-stone-500 block text-[10px] font-bold">अनुमानित शुद्ध लाभ</span>
              <span className="font-black text-emerald-700 text-sm block my-0.5">
                {formatCurrencyINR(crop.expected_net_profit_per_acre_inr)}
              </span>
              <span className="text-[10px] text-stone-400">/ एकड़</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
              <span className="text-stone-500 block text-[10px] font-bold">अनुमानित कुल लागत</span>
              <span className="font-black text-amber-800 text-sm block my-0.5">
                {formatCurrencyINR(crop.total_cost_inr_per_acre)}
              </span>
              <span className="text-[10px] text-stone-400">/ एकड़</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
              <span className="text-stone-500 block text-[10px] font-bold">अनुमानित पैदावार</span>
              <span className="font-black text-blue-800 text-sm block my-0.5">
                {crop.expected_yield_qtl_per_acre}
              </span>
              <span className="text-[10px] text-stone-400">क्विंटल / एकड़</span>
            </div>
          </div>
        </div>

        {/* 120-Day Action Schedule & Milestones (What to do on the field) */}
        <div className="space-y-2">
          <h4 className="font-black text-stone-800 text-xs flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">calendar_month</span>
            <span>फसल कार्य-योजना (बुवाई से कटाई तक के मुख्य चरण):</span>
          </h4>

          <div className="space-y-2">
            {MILESTONES.map((m) => (
              <div key={m.day} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    दिन {m.day} • {m.stage}
                  </span>
                  <span className="text-stone-600 font-semibold text-[11px]">{m.date}</span>
                </div>
                <p className="text-stone-700 text-[11px] leading-relaxed pl-0.5">
                  {m.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Clean Footer: Helpline */}
        <div className="pt-2 border-t border-stone-200 text-center text-xs text-stone-500 font-medium">
          किसान कॉल सेंटर हेल्पलाइन: <strong className="text-stone-800">1800-180-1551</strong> (टोल-फ्री २४x७)
        </div>

        {/* Modal Action Buttons (Screen Only - Hidden During Print) */}
        <div className="space-y-2.5 pt-2 no-print">
          <button
            onClick={handlePrint}
            className="w-full py-4 px-6 rounded-full bg-primary hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            <span>पर्ची प्रिंट / डाउनलोड करें (PDF)</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-6 rounded-full bg-white border-2 border-stone-300 text-stone-800 font-bold text-xs hover:bg-stone-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-emerald-600">share</span>
            <span>व्हाट्सएप पर भेजें</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-1.5 text-stone-400 hover:text-stone-700 text-xs font-bold text-center cursor-pointer"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
