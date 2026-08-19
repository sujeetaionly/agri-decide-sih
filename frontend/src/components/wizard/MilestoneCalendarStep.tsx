import React, { useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { useLanguage } from '../../context/LanguageContext';
import { PrintableAdvisorySlip } from './PrintableAdvisorySlip';
import { triggerHaptic, formatCurrencyINR } from '../../lib/utils';
import { speakText, stopSpeaking } from '../../lib/speech';

interface MilestoneCalendarStepProps {
  onReturnHome: () => void;
}

export const MilestoneCalendarStep: React.FC<MilestoneCalendarStepProps> = ({
  onReturnHome,
}) => {
  const { topRecommendation, farmData } = useWizard();
  const { language, t } = useLanguage();

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([0]);
  const [activeSpeakingIdx, setActiveSpeakingIdx] = useState<number | null>(null);

  const crop = topRecommendation || {
    crop_id: 'SOYBEAN',
    crop_name_en: 'Soybean',
    crop_name_hi: 'सोयाबीन',
    crop_name_mr: 'सोयाबीन',
    duration_days: 95,
    expected_yield_qtl_per_acre: 9.5,
    total_cost_inr_per_acre: 19412.0,
    expected_net_profit_per_acre_inr: 24525.0,
  };

  const cropName = (language === 'mr' ? crop.crop_name_mr : crop.crop_name_hi) || crop.crop_name_hi;


  const MILESTONES = [
    {
      day: 0,
      badge: 'बुवाई व बीज उपचार',
      title: 'राइजोबियम व ट्राइकोडर्मा से बीज उपचार एवं बुवाई',
      desc: 'बीज को ट्राइकोडर्मा (4 ग्राम/किग्रा) से उपचारित कर 3-4 सेमी गहराई और 45 सेमी कतार दूरी पर बुवाई करें।',
      date: '25 जून 2026',
    },
    {
      day: 21,
      badge: 'निराई व खरपतवार',
      title: 'पहली निराई-गुड़ाई एवं खरपतवार नियंत्रण',
      desc: 'खुरपी से पहली निराई करें या उपयुक्त खरपतवार नाशक का छिड़काव करें। पौधों की उचित छंटाई करें।',
      date: '16 जुलाई 2026',
    },
    {
      day: 45,
      badge: 'फूल व फलियां',
      title: 'फूल आने की अवस्था एवं कीट निगरानी',
      desc: 'खेत में नमी बनाए रखें। तना छेदक या सुंडी की निगरानी हेतु फेरोमोन ट्रैप लगाएं और आवश्यकता पड़ने पर नीम तेल का छिड़काव करें।',
      date: '09 अगस्त 2026',
    },
    {
      day: 75,
      badge: 'दाना भराव',
      title: 'दाना भराव अवस्था एवं पोषण प्रबंधन',
      desc: 'दानों के अच्छे भराव के लिए 00:52:34 घुलनशील उर्वरक (10 ग्राम/लीटर) का छिड़काव करें। पक्षियों से बचाव करें।',
      date: '08 सितंबर 2026',
    },
    {
      day: 95,
      badge: 'कटाई व भंडारण',
      title: 'फसल कटाई एवं सुरक्षित भंडारण',
      desc: 'फलियां सुनहरी भूरी होने पर कटाई करें। दानों को 3 दिन धूप में सुखाकर 12% से कम नमी पर सुरक्षित बोरियों में भरें।',
      date: '28 सितंबर 2026',
    },
  ];

  const handleToggleComplete = (day: number) => {
    triggerHaptic('medium');
    setCompletedSteps((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSpeakMilestone = (idx: number, item: typeof MILESTONES[0]) => {
    triggerHaptic('light');
    setActiveSpeakingIdx(idx);
    const msg = `दिन ${item.day}: ${item.badge}। ${item.title}। ${item.desc}`;
    speakText(
      msg,
      language,
      () => setActiveSpeakingIdx(idx),
      () => setActiveSpeakingIdx(null),
      () => setActiveSpeakingIdx(null)
    );
  };

  const handleWhatsAppShare = () => {
    triggerHaptic('light');
    const text = `🌾 *फसल-दिशा (Fasal Disha) — डिजिटल फसल सलाह पर्ची* 🌾\n_हर खेत को मिले सही दिशा_\n\n📌 *सुझाई गई फसल*: ${cropName}\n🌱 *खेत का आकार*: ${farmData.landAcres} एकड़\n💰 *अनुमानित शुद्ध लाभ*: ${formatCurrencyINR(crop.expected_net_profit_per_acre_inr)} / एकड़\n💵 *अनुमानित लागत*: ${formatCurrencyINR(crop.total_cost_inr_per_acre)} / एकड़\n⚖️ *अनुमानित पैदावार*: ${crop.expected_yield_qtl_per_acre} क्विंटल / एकड़\n📅 *बुवाई मौसम*: खरीफ 2026-27\n\n_कृषि एवं किसान कल्याण विभाग द्वारा प्रमाणित बेंचमार्क पर आधारित_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      
      {/* Clean Title & Description Header with Proper Hierarchy */}
      <div className="space-y-2 pb-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug flex-1">
            {t('planTitle')}
          </h2>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              speakText(`${t('planTitle')}। ${t('planSubtitle')}`, language);
            }}
            className="flex-shrink-0 h-8 flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-stone-100 dark:bg-stone-800 px-3 rounded-full border border-stone-300 dark:border-stone-700 active:scale-95 hover:bg-stone-200 cursor-pointer shadow-2xs mt-0.5"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          {t('planSubtitle')}
        </p>
      </div>

      {/* Selected Crop Summary Hero */}
      <div className="bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 flex items-center justify-center font-bold text-2xl shadow-sm">
              🌱
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A1C18] dark:text-[#E2E3DC] font-headline">
                {cropName}
              </h3>
              <span className="text-xs text-stone-500 font-medium">
                {farmData.landAcres || 2.5} एकड़ • खरीफ मौसम 2026
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-stone-500 block font-medium">शुद्ध लाभ</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyINR(crop.expected_net_profit_per_acre_inr)} / एकड़
            </span>
          </div>
        </div>
      </div>

      {/* Vertical Milestone Timeline */}
      <div className="space-y-6 relative pl-6 ml-3 border-l-2 border-emerald-500/40">
        {MILESTONES.map((m, idx) => {
          const isDone = completedSteps.includes(m.day);
          const isSpeakingThis = activeSpeakingIdx === idx;

          return (
            <div key={m.day} className="relative">
              {/* Timeline Indicator Dot centered exactly on the vertical line (x = -13px) */}
              <button
                type="button"
                onClick={() => handleToggleComplete(m.day)}
                className={`absolute -left-[37px] top-4 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer z-10 ${
                  isDone
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20 shadow-sm'
                    : 'bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600 text-transparent hover:border-emerald-500 shadow-sm'
                }`}
                title={isDone ? 'पूर्ण' : 'अपूर्ण'}
              >
                <span className="material-symbols-outlined text-xs">check</span>
              </button>

              {/* Milestone Card */}
              <div className="bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-5 shadow-md hover:shadow-lg transition-all space-y-3">
                
                {/* Header: Day Number + Prominent Calendar Date + Voice button */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-black px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                      दिन {m.day}
                    </span>
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-stone-400">event</span>
                      <span>{m.date}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleSpeakMilestone(idx, m)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                      isSpeakingThis
                        ? 'bg-primary text-white animate-pulse'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 hover:text-primary'
                    }`}
                    title={t('listen')}
                  >
                    <span className="material-symbols-outlined text-sm">volume_up</span>
                  </button>
                </div>

                {/* Stage Category Badge & Action Title */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                    • {m.badge}
                  </span>
                  <h4 className="font-bold text-base text-[#1A1C18] dark:text-[#E2E3DC] leading-snug">
                    {m.title}
                  </h4>
                </div>

                {/* Action Instructions */}
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed bg-stone-50 dark:bg-stone-900/50 p-3 rounded-2xl border border-stone-200/70 dark:border-stone-800">
                  {m.desc}
                </p>

                {/* Footer: Mark Complete Action */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(m.day)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isDone ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{isDone ? '✓ कार्य पूर्ण हो गया' : 'कार्य पूरा चिह्नित करें'}</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* INLINE ACTION BUTTONS (Full-Width Glorious Pills) */}
      <div className="space-y-3 pt-3 pb-2">
        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsPrintModalOpen(true);
          }}
          className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">download</span>
          <span>{t('printPdfBtn')}</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="w-full py-3.5 px-6 rounded-full bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm hover:bg-stone-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg text-emerald-600">share</span>
          <span>{t('shareWhatsappBtn')}</span>
        </button>
      </div>

      {/* Printable Slip Modal */}
      <PrintableAdvisorySlip
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};
