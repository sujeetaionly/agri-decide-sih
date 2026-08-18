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
  onOpenMyCrops: () => void;
  onOpenMandiRates?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartWizard,
  onOpenMyCrops,
  onOpenMandiRates,
}) => {
  const { language, t } = useLanguage();
  const [recentAnalysis, setRecentAnalysis] = useState<RecentAnalysis | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Check localStorage or backend for recent analysis
    const saved = localStorage.getItem('krishi_recent_analysis');
    if (saved) {
      try {
        setRecentAnalysis(JSON.parse(saved));
      } catch {
        // Fallback default sample for demonstration
        setRecentAnalysis({
          cropName: language === 'mr' ? 'सोयाबीन' : 'सोयाबीन',
          profitPerAcre: 24500,
          yieldQtl: 9.5,
          date: '18 अगस्त 2026',
          landArea: 2.5,
        });
      }
    } else {
      // Default sample for first-time visual delight
      setRecentAnalysis({
        cropName: language === 'mr' ? 'सोयाबीन' : 'सोयाबीन',
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
    onOpenMyCrops();
  };

  const handleNavChange = (tab: NavTab) => {
    if (tab === 'wizard') {
      onStartWizard();
    } else if (tab === 'my-crops') {
      onOpenMyCrops();
    } else if (tab === 'mandi' && onOpenMandiRates) {
      onOpenMandiRates();
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
    <div className="bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark min-h-screen flex flex-col justify-between pt-16 pb-24">
      
      {/* Top Single Header */}
      <HomeTopAppBar />

      {/* Main Minimalist Canvas (Only 2 Cards as requested) */}
      <main className="flex-grow px-4 py-4 max-w-md mx-auto w-full space-y-4">
        
        {/* Welcome Greeting */}
        <div className="pt-2 pb-1">
          <h2 className="text-xl font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC]">
            {t('greeting')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            पुणे, महाराष्ट्र • खरीफ मौसम 2026
          </p>
        </div>

        {/* CARD 1: Primary Big Crop Recommendation Action Card */}
        <div className="bg-gradient-to-br from-emerald-800 to-green-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-600/30 space-y-5 relative overflow-hidden">
          {/* Subtle Background Art */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
          <div className="absolute right-4 top-4 text-emerald-400/20">
            <span className="material-symbols-outlined text-6xl">psychology_alt</span>
          </div>

          <div className="space-y-2 relative z-10 pr-12">
            <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              एआई फसल सलाहकार
            </span>
            <h3 className="text-2xl font-bold font-headline leading-snug">
              {t('homeHeroTitle')}
            </h3>
            <p className="text-xs text-emerald-100/85 leading-relaxed">
              {t('homeHeroSub')}
            </p>
          </div>

          <button
            onClick={handleStartRecommendation}
            className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-base shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-3 relative z-10"
          >
            <span className="material-symbols-outlined text-2xl">eco</span>
            <span>{t('getCropRecButton')}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>

        {/* CARD 2: Previous Analysis Summary Card */}
        <div className="bg-white dark:bg-[#1E231B] border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">history</span>
              </div>
              <h4 className="font-bold text-sm text-[#1A1C18] dark:text-[#E2E3DC]">
                {t('recentAnalysisTitle')}
              </h4>
            </div>

            <button
              onClick={handleAudioCard}
              className="text-stone-400 hover:text-primary active:scale-95"
              title={t('listen')}
            >
              <span className="material-symbols-outlined text-xl">volume_up</span>
            </button>
          </div>

          {recentAnalysis ? (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-stone-200/70 dark:border-stone-800">
                <div>
                  <span className="text-xs text-stone-500 dark:text-stone-400 block font-medium">
                    सुझाई गई फसल ({recentAnalysis.landArea} एकड़)
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {recentAnalysis.cropName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-500 dark:text-stone-400 block font-medium">
                    अनुमानित शुद्ध लाभ
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyINR(recentAnalysis.profitPerAcre)} / एकड़
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 px-1 font-medium">
                <span>पैदावार: {recentAnalysis.yieldQtl} क्विंटल/एकड़</span>
                <span>दिनांक: {recentAnalysis.date}</span>
              </div>

              <button
                onClick={handleOpenPrevious}
                className="w-full py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs hover:bg-stone-200 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
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

      {/* Persistent Bottom Navigation Bar */}
      <HomeBottomNav activeTab="home" onTabChange={handleNavChange} />
    </div>
  );
};
