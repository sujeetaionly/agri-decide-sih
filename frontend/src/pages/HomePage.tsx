import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HomeTopAppBar } from '../components/home/HomeTopAppBar';
import { HomeBottomNav, NavTab } from '../components/home/HomeBottomNav';
import { triggerHaptic, formatCurrencyINR } from '../lib/utils';
import { speakText, stopSpeaking } from '../lib/speech';

interface RecentAnalysis {
  cropName: string;
  profitPerAcre: number;
  yieldQtl: number;
  date: string;
  landArea: number;
}

interface HomePageProps {
  onStartWizard: () => void;
  onOpenMyCropPlan: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartWizard,
  onOpenMyCropPlan,
  onOpenHistory,
  onOpenSettings,
}) => {
  const { language, t } = useLanguage();
  const [recentAnalysis, setRecentAnalysis] = useState<RecentAnalysis | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('krishi_recent_analysis');
    if (saved) {
      try {
        setRecentAnalysis(JSON.parse(saved));
      } catch {
        setRecentAnalysis({
          cropName: 'सोयाबीन',
          profitPerAcre: 24500,
          yieldQtl: 9.5,
          date: '18 अगस्त 2026',
          landArea: 2.5,
        });
      }
    } else {
      setRecentAnalysis({
        cropName: 'सोयाबीन',
        profitPerAcre: 24500,
        yieldQtl: 9.5,
        date: '18 अगस्त 2026',
        landArea: 2.5,
      });
    }
  }, [language]);

  const handleStartRecommendation = () => {
    triggerHaptic('medium');
    onStartWizard();
  };

  const handleOpenPrevious = () => {
    triggerHaptic('light');
    onOpenMyCropPlan();
  };

  const handleNavChange = (tab: NavTab) => {
    if (tab === 'my-crop') {
      onOpenMyCropPlan();
    } else if (tab === 'history') {
      onOpenHistory();
    } else if (tab === 'settings') {
      onOpenSettings();
    }
  };

  const handleAudioCard = () => {
    triggerHaptic('light');
    const msg = recentAnalysis
      ? `${t('recentAnalysisTitle')}। ${recentAnalysis.cropName} फसल, अनुमानित शुद्ध लाभ ${formatCurrencyINR(recentAnalysis.profitPerAcre)} प्रति एकड़।`
      : `${t('homeHeroTitle')}। ${t('homeHeroSub')}`;

    speakText(
      msg,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col font-body pb-24">
      {/* 1. Single Top App Bar with Audio Button */}
      <HomeTopAppBar />

      {/* 2. Main Dashboard (2 Key Cards Perfectly Balanced) */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-20 pb-28 flex flex-col justify-center space-y-5 animate-fadeIn">
        
        {/* Welcome Greeting */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>खरीफ मौसम २०२६ • पुणे, महाराष्ट्र</span>
          </div>
          <h1 className="text-2xl font-black font-headline tracking-tight text-[#1A1C18] dark:text-[#E2E3DC] pt-1">
            {t('greeting')}
          </h1>
        </div>

        {/* CARD 1: PRIMARY ACTION - AI Crop Recommendation Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1E231B] border-2 border-emerald-600/40 dark:border-emerald-500/40 p-6 shadow-md hover:shadow-lg transition-all space-y-5">
          <div className="absolute right-2 top-2 text-emerald-900/5 dark:text-emerald-100/5 text-8xl select-none font-bold pointer-events-none">
            🌾
          </div>

          <div className="space-y-2 relative z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 rounded-full text-xs font-bold border border-emerald-500/30">
              <span className="material-symbols-outlined text-sm [font-variation-settings:'FILL'_1]">psychology_alt</span>
              <span>एआई फसल सलाहकार</span>
            </span>
            <h2 className="text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug tracking-tight">
              {t('homeHeroTitle')}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-[290px]">
              {t('homeHeroSub')}
            </p>
          </div>

          <button
            onClick={handleStartRecommendation}
            className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-base shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer relative z-10"
          >
            <span className="material-symbols-outlined text-xl [font-variation-settings:'FILL'_1]">eco</span>
            <span>{t('getCropRecButton')}</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>

        {/* CARD 2: RECENT ANALYSIS SUMMARY */}
        <div className="bg-white dark:bg-[#1E231B] border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                <span className="material-symbols-outlined text-lg">history</span>
              </div>
              <h3 className="text-sm font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                {t('recentAnalysisTitle')}
              </h3>
            </div>

            <button
              onClick={handleAudioCard}
              className="text-stone-400 hover:text-primary transition-colors p-1"
              title="आवाज सुनें"
            >
              <span className="material-symbols-outlined text-lg">volume_up</span>
            </button>
          </div>

          {recentAnalysis ? (
            <div className="space-y-3">
              <div className="bg-stone-50 dark:bg-stone-900/60 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">
                    सुझाई गई फसल ({recentAnalysis.landArea} एकड़)
                  </span>
                  <span className="text-xl font-black text-primary font-headline">
                    {recentAnalysis.cropName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block font-medium">
                    {t('estimatedProfit')}
                  </span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyINR(recentAnalysis.profitPerAcre)} / एकड़
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
                <span>पैदावार: {recentAnalysis.yieldQtl} क्विंटल/एकड़</span>
                <span>दिनांक: {recentAnalysis.date}</span>
              </div>

              <button
                onClick={handleOpenPrevious}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs hover:bg-stone-200 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{t('viewFullReport')}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-4 space-y-2">
              <p className="text-xs text-stone-500">
                {t('noPreviousAnalysis')}
              </p>
            </div>
          )}
        </div>

      </main>

      {/* Persistent 4-Tab Bottom Navigation Bar */}
      <HomeBottomNav activeTab="home" onTabChange={handleNavChange} />
    </div>
  );
};
