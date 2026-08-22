import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWizard } from '../context/WizardContext';
import { HomeTopAppBar } from '../components/home/HomeTopAppBar';
import { HomeBottomNav, NavTab } from '../components/home/HomeBottomNav';
import { triggerHaptic, formatCurrencyINR, formatIndicDate } from '../lib/utils';
import { speakText } from '../lib/speech';
import { apiService } from '../services/api';

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
  const { activeCropPlan, topRecommendation } = useWizard();
  const [recentAnalysis, setRecentAnalysis] = useState<RecentAnalysis | null>(null);

  const displayCrop = activeCropPlan || topRecommendation;

  useEffect(() => {
    let isMounted = true;

    async function loadRecentFromApi() {
      if (displayCrop && displayCrop.crop_id !== 'ONION' && (displayCrop.expected_net_profit_per_acre_inr || 0) < 80000) {
        const cName = (language === 'mr' ? displayCrop.crop_name_mr : displayCrop.crop_name_hi) || displayCrop.crop_name_hi;
        if (isMounted) {
          setRecentAnalysis({
            cropName: cName,
            profitPerAcre: displayCrop.expected_net_profit_per_acre_inr,
            yieldQtl: displayCrop.expected_yield_qtl_per_acre,
            date: '18 अगस्त 2026',
            landArea: 2.5,
          });
        }
        return;
      }

      try {
        const liveRecent = await apiService.getRecentAnalysis();
        if (liveRecent && isMounted && liveRecent.top_recommended_crop !== 'ONION' && (liveRecent.expected_profit_per_acre || 0) < 80000) {
          const cName = language === 'mr' ? liveRecent.crop_name_mr : liveRecent.crop_name_hi;
          setRecentAnalysis({
            cropName: cName || 'सोयाबीन',
            profitPerAcre: liveRecent.expected_profit_per_acre || 24525,
            yieldQtl: liveRecent.expected_yield_qtl_per_acre || 9.5,
            date: formatIndicDate(liveRecent.created_at) || '18 अगस्त 2026',
            landArea: liveRecent.total_land_acres || 2.5,
          });
          return;
        }
      } catch (e) {
        // Fallback to local storage
      }

      const saved = localStorage.getItem('krishi_recent_analysis');
      if (saved && isMounted) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.cropName && !parsed.cropName.includes('प्याज') && !parsed.cropName.includes('Onion') && (parsed.profitPerAcre || 0) < 80000) {
            setRecentAnalysis(parsed);
            return;
          }
        } catch {
          // Fallback to default
        }
      }
      
      if (isMounted) {
        setRecentAnalysis({
          cropName: language === 'mr' ? 'सोयाबीन' : (language === 'gu' ? 'સોયાબીન' : 'सोयाबीन'),
          profitPerAcre: 24525,
          yieldQtl: 9.5,
          date: '18 अगस्त 2026',
          landArea: 2.5,
        });
      }
    }

    loadRecentFromApi();

    return () => {
      isMounted = false;
    };
  }, [displayCrop, language]);

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

    speakText(msg, language);
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col font-body">
      {/* 1. Single Top App Bar with Audio Button */}
      <HomeTopAppBar />

      {/* 2. Main Dashboard */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 pb-20 space-y-4 animate-fadeIn">
        
        {/* Cluster 1: Welcome Greeting with Official Material Namaste Vector */}
        <div className="flex items-center gap-3 pt-0.5 pb-1">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-primary"
              aria-hidden="true"
            >
              <path d="M11.43 9.67c.04.11.07.21.07.33v5.22c0 .5-.19.98-.53 1.35l-2.79 3.05l-3.4-3.4L6 15L8.8 2.86a1.114 1.114 0 0 1 2.2.25v4.96a2 2 0 0 0-.5-.07c-1.1 0-2 .9-2 2v3c0 .28.22.5.5.5s.5-.22.5-.5v-3c0-.55.45-1 1-1c.19 0 .35.07.5.16c.12.07.21.16.3.26c.03.04.06.08.08.13c.02.04.04.08.05.12M2 19l4 3l1.17-1.27l-3.45-3.45zm16-4L15.2 2.86a1.114 1.114 0 0 0-2.2.25v4.96c.16-.04.33-.07.5-.07c1.1 0 2 .9 2 2v3c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-3c0-.55-.45-1-1-1c-.19 0-.35.07-.5.16c-.12.07-.21.16-.29.26c-.03.04-.07.08-.09.13c-.02.04-.04.08-.05.12c-.04.11-.07.21-.07.33v5.22c0 .5.19.98.53 1.35l2.79 3.05l3.4-3.4zm2.28 2.28l-3.45 3.45L18 22l4-3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black font-headline tracking-tight text-on-surface-light dark:text-on-surface-dark">
            {t('greeting')}
          </h1>
        </div>

        {/* Cluster 2: Primary AI Recommendation Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D5B1A] via-[#094312] to-[#052C0B] text-white p-5 sm:p-6 shadow-md space-y-4 border-2 border-primary/40">
          {/* Subtle Ambient Background Accents */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-3 top-3 text-white/10 text-8xl select-none font-bold pointer-events-none">
            🌾
          </div>

          <div className="space-y-3 relative z-10">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-black text-white border border-white/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm" />
              <span>AI स्मार्ट फसल विश्लेषण</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-[21px] sm:text-2xl font-black font-headline leading-snug tracking-tight text-white">
              {t('homeHeroTitle')}
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-[13px] text-emerald-100/90 leading-relaxed font-medium">
              {t('homeHeroSub')}
            </p>

            {/* Fast Turnaround Info Pill */}
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-100 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/15 shadow-2xs">
                <span className="material-symbols-outlined text-xs text-amber-300">bolt</span>
                <span>2 मिनट में रिपोर्ट</span>
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex justify-center pt-1">
            <button
              onClick={handleStartRecommendation}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.98] text-stone-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer relative z-10 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg [font-variation-settings:'FILL'_1]">eco</span>
              <span>{t('getCropRecButton')}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Cluster 3: Recent Advisory Analysis Card (High visual hierarchy, clean typography) */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-300/90 dark:border-stone-700 rounded-3xl p-5 shadow-xs space-y-4">
          
          {/* Card Header: Title, Date & Audio */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                <span className="material-symbols-outlined text-lg">history</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-on-surface-light dark:text-on-surface-dark font-headline">
                  {t('recentAnalysisTitle')}
                </h3>
                <span className="text-[11px] text-stone-400 font-medium block">
                  {recentAnalysis?.date || '18 अगस्त 2026'}
                </span>
              </div>
            </div>

            <button
              onClick={handleAudioCard}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-primary hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="आवाज सुनें"
            >
              <span className="material-symbols-outlined text-lg">volume_up</span>
            </button>
          </div>

          {recentAnalysis ? (
            <div className="space-y-4">
              {/* Primary Value Callout: Clean 2-Column Hierarchy (No awkward wrapping) */}
              <div className="flex items-start justify-between pt-1">
                {/* Left Column: Crop Info */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    सुझाई गई फसल
                  </span>
                  <span className="text-2xl font-black text-on-surface-light dark:text-on-surface-dark font-headline block tracking-tight">
                    {recentAnalysis.cropName}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold block pt-0.5">
                    पैदावार: {recentAnalysis.yieldQtl} क्विंटल/एकड़
                  </span>
                </div>

                {/* Right Column: Net Profit */}
                <div className="text-right space-y-1">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    {t('estimatedProfit')}
                  </span>
                  <span className="text-2xl font-black text-primary dark:text-primary-fixed block font-headline tracking-tight">
                    {formatCurrencyINR(recentAnalysis.profitPerAcre)}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block pt-0.5">
                    प्रति एकड़
                  </span>
                </div>
              </div>

              {/* Action Button: Restored Original Premium Green Pill */}
              <button
                onClick={handleOpenPrevious}
                className="w-full py-3.5 px-4 rounded-full bg-primary/10 hover:bg-primary/15 text-primary border-2 border-primary/25 font-black text-sm shadow-2xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('viewFullReport')}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
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
