import React, { useState, useEffect, useMemo } from 'react';
import { useWizard } from '../../context/WizardContext';
import { useLanguage } from '../../context/LanguageContext';
import { PrintableAdvisorySlip } from './PrintableAdvisorySlip';
import { triggerHaptic, formatCurrencyINR } from '../../lib/utils';
import { speakText, stopSpeaking } from '../../lib/speech';
import { getCropSchedule } from '../../data/cropMilestones';
import { getDynamicCropDetail } from '../../data/cropAgronomics';

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
    const text = `🌾 *फसल-दिशा (Fasal Disha) — डिजिटल फसल कार्ययोजना रिपोर्ट* 🌾\n_हर खेत को मिले सही दिशा_\n\n📌 *सुझाई गई फसल*: ${cropName}\n💰 *अनुमानित शुद्ध लाभ*: ${formatCurrencyINR(crop.expected_net_profit_per_acre_inr)} / एकड़\n💵 *अनुमानित लागत*: ${formatCurrencyINR(crop.total_cost_inr_per_acre)} / एकड़\n⚖️ *अनुमानित पैदावार*: ${crop.expected_yield_qtl_per_acre} क्विंटल / एकड़\n📅 *${durationLabel}*\n\n_कृषि एवं किसान कल्याण विभाग द्वारा प्रमाणित बेंचमार्क पर आधारित_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-1">
      
      {/* Clean Title Header with Emblem */}
      <div className="flex items-center gap-3 pt-1.5 pb-1">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span className="material-symbols-outlined text-2xl font-bold">calendar_month</span>
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
            <span className="text-[10px] text-stone-400 font-medium block">प्रति एकड़</span>
          </div>
        </div>
      </div>

      {/* Vertical Milestone Timeline */}
      <div className="space-y-6 relative pl-6 ml-3 border-l-2 border-primary/40">
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
                    ? 'bg-primary text-white ring-4 ring-primary/20 shadow-sm'
                    : 'bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600 text-transparent hover:border-primary shadow-sm'
                }`}
                title={isDone ? 'पूर्ण' : 'अपूर्ण'}
              >
                <span className="material-symbols-outlined text-xs">check</span>
              </button>

              {/* Milestone Card */}
              <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all space-y-3">
                
                {/* Header: Day Number Badge + Category Badge + Voice button */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-primary/10 text-primary text-xs font-black px-2.5 py-0.5 rounded-lg border border-primary/20">
                      दिन {m.day}
                    </span>
                    <span className="text-xs font-bold text-primary dark:text-primary-fixed">
                      • {m.badge}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSpeakMilestone(idx, m)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSpeakingThis
                        ? 'bg-primary text-white animate-pulse'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 hover:text-primary'
                    }`}
                    title={t('listen')}
                  >
                    <span className="material-symbols-outlined text-sm">volume_up</span>
                  </button>
                </div>

                {/* Action Title */}
                <h4 className="font-bold text-base text-on-surface-light dark:text-on-surface-dark leading-snug">
                  {m.title}
                </h4>

                {/* Action Instructions */}
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-200/70 dark:border-stone-700">
                  {m.desc}
                </p>

                {/* Footer: Mark Complete Action */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(m.day)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDone
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
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

      {/* INLINE ACTION BUTTONS (Full-Width Standardized Pills) */}
      <div className="space-y-3 pt-3 pb-2">
        <button
          onClick={() => {
            triggerHaptic('medium');
            window.print();
          }}
          className="w-full py-4 px-6 rounded-full bg-primary hover:bg-primary/95 active:scale-[0.98] text-white font-extrabold text-base shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">download</span>
          <span>{t('printPdfBtn')}</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="w-full py-3.5 px-6 rounded-full bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm hover:bg-stone-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg text-primary">share</span>
          <span>{t('shareWhatsappBtn')}</span>
        </button>
      </div>

      {/* Printable Slip for Direct Download/Print */}
      <PrintableAdvisorySlip
        isOpen={true}
        onClose={() => {}}
      />
    </div>
  );
};
