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
    const text = `🌾 *कृषि-वाइज़ एआई (Agri-Decide) फसल सलाह पर्ची* 🌾\n\n📌 *सुझाई गई फसल*: ${cropName}\n🌱 *खेत का आकार*: ${farmData.landAcres} एकड़\n💰 *अनुमानित शुद्ध लाभ*: ${formatCurrencyINR(crop.expected_net_profit_per_acre_inr)} / एकड़\n💵 *अनुमानित लागत*: ${formatCurrencyINR(crop.total_cost_inr_per_acre)} / एकड़\n⚖️ *अनुमानित पैदावार*: ${crop.expected_yield_qtl_per_acre} क्विंटल / एकड़\n📅 *बुवाई मौसम*: खरीफ 2026\n\n_कृषि एवं किसान कल्याण विभाग द्वारा प्रमाणित बेंचमार्क पर आधारित_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-40">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
            १२०-दिवसीय फसल कार्य-योजना
          </span>

          <button
            onClick={() => {
              triggerHaptic('light');
              speakText(`${t('planTitle')}। ${t('planSubtitle')}`, language);
            }}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        <h2 className="text-2xl font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug">
          {t('planTitle')}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t('planSubtitle')}
        </p>
      </div>

      {/* Selected Crop Summary Hero */}
      <div className="bg-white dark:bg-[#1E231B] border-2 border-primary/20 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold text-xl">
              🌱
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                {cropName}
              </h3>
              <span className="text-xs text-stone-500">
                {farmData.landAcres} एकड़ • खरीफ मौसम 2026
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-stone-500 block">शुद्ध लाभ</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyINR(crop.expected_net_profit_per_acre_inr)} / एकड़
            </span>
          </div>
        </div>
      </div>

      {/* Vertical Milestone Timeline */}
      <div className="space-y-4 relative pl-4 border-l-2 border-primary/30 ml-3">
        {MILESTONES.map((m, idx) => {
          const isDone = completedSteps.includes(m.day);
          const isSpeakingThis = activeSpeakingIdx === idx;

          return (
            <div key={m.day} className="relative space-y-2">
              {/* Timeline Indicator Dot */}
              <button
                type="button"
                onClick={() => handleToggleComplete(m.day)}
                className={`absolute -left-[25px] top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-xs">check</span>
              </button>

              {/* Milestone Card */}
              <div className="bg-white dark:bg-[#1E231B] border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-extrabold px-2.5 py-0.5 rounded-md">
                      दिन {m.day}
                    </span>
                    <span className="text-xs font-bold text-primary">
                      {m.badge}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSpeakMilestone(idx, m)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                      isSpeakingThis
                        ? 'bg-primary text-white animate-pulse'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 hover:text-primary'
                    }`}
                    title={t('listen')}
                  >
                    <span className="material-symbols-outlined text-sm">volume_up</span>
                  </button>
                </div>

                <h4 className="font-bold text-sm text-[#1A1C18] dark:text-[#E2E3DC] leading-snug">
                  {m.title}
                </h4>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {m.desc}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500">
                  <span>दिनांक: {m.date}</span>
                  <button
                    onClick={() => handleToggleComplete(m.day)}
                    className={`font-semibold ${isDone ? 'text-primary' : 'text-stone-400'}`}
                  >
                    {isDone ? '✓ कार्य पूर्ण' : 'कार्य पूरा चिह्नित करें'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STICKY BOTTOM ACTIONS */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto space-y-2 bg-gradient-to-t from-surface-light via-surface-light to-transparent dark:from-surface-dark dark:via-surface-dark pt-4 pb-2">
        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsPrintModalOpen(true);
          }}
          className="w-full py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>{t('printPdfBtn')}</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 py-3 px-4 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs hover:bg-stone-200 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base text-emerald-600">share</span>
            <span>{t('shareWhatsappBtn')}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              onReturnHome();
            }}
            className="flex-1 py-3 px-4 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span>{t('backToHomeBtn')}</span>
          </button>
        </div>
      </div>

      {/* Printable Slip Modal */}
      <PrintableAdvisorySlip
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};
