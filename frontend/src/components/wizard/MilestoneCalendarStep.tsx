import React, { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic, formatCurrencyINR } from '../../lib/utils';
import { speakText, stopSpeaking } from '../../lib/speech';
import { getCropSchedule } from '../../data/cropMilestones';
import { getDynamicCropDetail } from '../../data/cropAgronomics';
import { generateAndDownloadCropPdf } from '../../lib/pdfGenerator';

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

interface MilestoneCalendarStepProps {
  onReturnHome: () => void;
}

export const MilestoneCalendarStep: React.FC<MilestoneCalendarStepProps> = ({
  onReturnHome,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      stopSpeaking();
    };
  }, []);

  const { activeCropPlan, topRecommendation, farmData } = useWizard();
  const { language, t } = useLanguage();

  const [completedSteps, setCompletedSteps] = useState<number[]>([0]);
  const [activeSpeakingIdx, setActiveSpeakingIdx] = useState<number | null>(null);

  const crop = activeCropPlan || topRecommendation || getDynamicCropDetail('SOYBEAN', farmData);

  const cropName = getLocalizedCropName(crop, language);

  const scheduleData = getCropSchedule(crop.crop_id || 'SOYBEAN');
  const durationLabel = {
    hi: `कालावधि: ${scheduleData.durationDays} दिन`,
    mr: `कालावधी: ${scheduleData.durationDays} दिवस`,
    gu: `કાલાવધિ: ${scheduleData.durationDays} દિવસ`,
    raj: `कालावधि: ${scheduleData.durationDays} दिन`,
    en: `Duration: ${scheduleData.durationDays} Days`,
  }[language] || `कालावधि: ${scheduleData.durationDays} दिन`;

  const MILESTONES = scheduleData.milestones.map((m) => ({
    day: m.day,
    badge: m.badge[language] || m.badge.hi,
    title: m.title[language] || m.title.hi,
    desc: m.desc[language] || m.desc.hi,
  }));

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
    const milestonesSummary = MILESTONES.slice(0, 5).map(m => `• *दिन ${m.day}* (${m.badge}): ${m.title}`).join('\n');
    
    const text = `🌾 *फसल-दिशा (Fasal Disha)* 🌾\n_हर खेत को मिले सही दिशा | डिजिटल फसल रिपोर्ट_\n━━━━━━━━━━━━━━━━━━━\n\n🌱 *अनुशंसित फसल*: *${cropName}*\n⏳ *कालावधि*: ${durationLabel}\n\n💰 *अनुमानित शुद्ध लाभ*: *${formatCurrencyINR(crop.expected_net_profit_per_acre_inr)} / एकड़*\n💵 *कुल उत्पादन लागत*: *${formatCurrencyINR(crop.total_cost_inr_per_acre)} / एकड़*\n⚖️ *अनुमानित पैदावार*: *${crop.expected_yield_qtl_per_acre} क्विंटल / एकड़*\n\n━━━━━━━━━━━━━━━━━━━\n📅 *120-दिवसीय मुख्य कृषि कार्य*:\n${milestonesSummary}\n\n━━━━━━━━━━━━━━━━━━━\n📞 *किसान हेल्पलाइन*: 1800-180-1551 (टोल-फ्री २४x७)\n🌐 *फसल-दिशा डिजिटल कृषि सलाहकार*`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadReport = () => {
    triggerHaptic('success');
    generateAndDownloadCropPdf({
      crop,
      cropName,
      language,
      farmData,
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-2">
      
      {/* Clean Title Header with Emblem */}
      <div className="flex items-center gap-3 pt-1.5 pb-0.5">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span className="material-symbols-outlined text-2xl font-bold">eco</span>
        </div>
        <h2 className="text-2xl font-black font-headline text-on-surface-light dark:text-on-surface-dark leading-snug">
          {t('planTitle')}
        </h2>
      </div>

      {/* Selected Crop Summary Hero */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              चयनित फसल
            </span>
            <h3 className="text-2xl font-black text-on-surface-light dark:text-on-surface-dark font-headline mt-0.5">
              {cropName}
            </h3>
            <span className="text-xs text-stone-500 font-medium block mt-1">
              {durationLabel}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">अनुमानित शुद्ध लाभ</span>
            <span className="text-lg font-black text-primary dark:text-primary-fixed block">
              {formatCurrencyINR(crop.expected_net_profit_per_acre_inr)}
            </span>
            <span className="text-[11px] text-stone-500 block">प्रति एकड़</span>
          </div>
        </div>
      </div>

      {/* 120-Day Action Plan Vertical Timeline with Connected Track */}
      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-primary/25 dark:before:bg-primary/35">
        {MILESTONES.map((item, idx) => {
          const isDone = completedSteps.includes(item.day);
          const isSpeakingThis = activeSpeakingIdx === idx;

          return (
            <div key={item.day} className="relative">
              {/* Connected Timeline Node Dot */}
              <div className={`absolute -left-6 top-5 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center z-10 ${
                isDone
                  ? 'bg-primary border-primary text-white shadow-2xs'
                  : 'bg-white dark:bg-stone-900 border-primary/40'
              }`}>
                {isDone ? (
                  <span className="material-symbols-outlined text-[10px] font-black">check</span>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                )}
              </div>

              {/* Elevated Milestone Card */}
              <div className={`rounded-3xl border-2 transition-all p-5 ${
                isDone
                  ? 'bg-primary/[0.03] border-primary/30 dark:bg-primary/10 dark:border-primary/40'
                  : 'bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800 shadow-xs'
              }`}>
                
                {/* Header Pill & Audio Button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-primary-fixed text-xs font-black">
                    <span>दिन {item.day}</span>
                    <span>•</span>
                    <span>{item.badge}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSpeakMilestone(idx, item)}
                    aria-label="Listen to milestone"
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer aspect-square ${
                      isSpeakingThis
                        ? 'bg-primary text-white animate-pulse shadow-xs'
                        : 'text-stone-400 hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">volume_up</span>
                  </button>
                </div>

                {/* Milestone Title */}
                <h4 className={`text-base font-black font-headline mt-3 ${
                  isDone
                    ? 'line-through text-stone-400 dark:text-stone-500'
                    : 'text-stone-900 dark:text-stone-100'
                }`}>
                  {item.title}
                </h4>

                {/* Inner Nested Grey Container for Details */}
                <div className="mt-3 p-3.5 rounded-2xl bg-stone-50/80 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                  <p className={`text-xs leading-relaxed ${
                    isDone
                      ? 'text-stone-400 dark:text-stone-500'
                      : 'text-stone-700 dark:text-stone-300 font-medium'
                  }`}>
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Right Checkbox / Toggle */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(item.day)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer py-1 px-3 rounded-full ${
                      isDone
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-stone-600 dark:text-stone-400 hover:text-primary hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isDone ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{isDone ? 'पूर्ण' : 'पूरा करें'}</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* INLINE ACTION BUTTONS */}
      <div className="space-y-3 pt-3 pb-2 max-w-[300px] mx-auto w-full">
        <button
          type="button"
          onClick={handleDownloadReport}
          className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-primary/95 active:scale-95 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>{t('printPdfBtn')}</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="w-full py-3 px-6 rounded-full bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs hover:bg-stone-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-base text-primary">share</span>
          <span>{t('shareWhatsappBtn')}</span>
        </button>
      </div>
    </div>
  );
};
