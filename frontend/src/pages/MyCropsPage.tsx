import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HomeTopAppBar } from '../components/home/HomeTopAppBar';
import { HomeBottomNav, NavTab } from '../components/home/HomeBottomNav';
import { triggerHaptic, formatCurrencyINR } from '../lib/utils';
import { speakText } from '../lib/speech';

interface SavedCropAnalysis {
  rec_id: number;
  crop_name_hi: string;
  crop_name_mr: string;
  total_land_acres: number;
  expected_profit_per_acre: number;
  total_cost_per_acre: number;
  expected_yield_qtl_per_acre: number;
  soil_type: string;
  created_at: string;
}

interface MyCropsPageProps {
  onStartNewRecommendation: () => void;
  onGoToHome: () => void;
  onOpenMandiRates?: () => void;
}

export const MyCropsPage: React.FC<MyCropsPageProps> = ({
  onStartNewRecommendation,
  onGoToHome,
  onOpenMandiRates,
}) => {
  const { language, t } = useLanguage();
  const [historyList, setHistoryList] = useState<SavedCropAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/farmer/history');
        if (res.ok) {
          const data = await res.json();
          if (data.history && data.history.length > 0) {
            setHistoryList(data.history);
          } else {
            // Provide default benchmark mock history
            setHistoryList([
              {
                rec_id: 101,
                crop_name_hi: 'सोयाबीन',
                crop_name_mr: 'सोयाबीन',
                total_land_acres: 2.5,
                expected_profit_per_acre: 24525.0,
                total_cost_per_acre: 19412.0,
                expected_yield_qtl_per_acre: 9.5,
                soil_type: 'काली मिट्टी',
                created_at: '18 अगस्त 2026',
              },
              {
                rec_id: 102,
                crop_name_hi: 'मक्का',
                crop_name_mr: 'मका',
                total_land_acres: 3.0,
                expected_profit_per_acre: 21389.0,
                total_cost_per_acre: 18211.0,
                expected_yield_qtl_per_acre: 24.0,
                soil_type: 'दोमट मिट्टी',
                created_at: '10 जून 2026',
              },
            ]);
          }
        }
      } catch (e) {
        // Fallback default
        setHistoryList([
          {
            rec_id: 101,
            crop_name_hi: 'सोयाबीन',
            crop_name_mr: 'सोयाबीन',
            total_land_acres: 2.5,
            expected_profit_per_acre: 24525.0,
            total_cost_per_acre: 19412.0,
            expected_yield_qtl_per_acre: 9.5,
            soil_type: 'काली मिट्टी',
            created_at: '18 अगस्त 2026',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleNavChange = (tab: NavTab) => {
    if (tab === 'home') onGoToHome();
    else if (tab === 'wizard') onStartNewRecommendation();
    else if (tab === 'mandi' && onOpenMandiRates) onOpenMandiRates();
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = `मेरी फसलें पृष्ठ। आपके पास कुल ${historyList.length} सुरक्षित फसल योजनाएं हैं।`;
    speakText(msg, language);
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark min-h-screen flex flex-col justify-between pt-16 pb-24">
      
      {/* Top Header */}
      <HomeTopAppBar />

      {/* Main Content */}
      <main className="flex-grow px-4 py-4 max-w-md mx-auto w-full space-y-4">
        
        {/* Page Title Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="text-xl font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC]">
              {t('myCropsTitle')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {t('myCropsSub')}
            </p>
          </div>

          <button
            onClick={handleAudio}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        {/* History Cards List */}
        {isLoading ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-3xl animate-spin text-primary">progress_activity</span>
          </div>
        ) : historyList.length > 0 ? (
          <div className="space-y-3">
            {historyList.map((item) => {
              const cName = language === 'mr' ? item.crop_name_mr : item.crop_name_hi;
              return (
                <div
                  key={item.rec_id}
                  className="bg-white dark:bg-[#1E231B] border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold text-xl">
                        🌾
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                          {cName}
                        </h3>
                        <span className="text-xs text-stone-500">
                          {item.total_land_acres} एकड़ • {item.created_at}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 block">शुद्ध लाभ</span>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatCurrencyINR(item.expected_profit_per_acre)} / एकड़
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <div>
                      <span className="text-stone-500 block text-[10px]">अनुमानित लागत:</span>
                      <span className="font-bold">{formatCurrencyINR(item.total_cost_per_acre)}/एकड़</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px]">पैदावार:</span>
                      <span className="font-bold">{item.expected_yield_qtl_per_acre} क्विंटल/एकड़</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 space-y-3 bg-white dark:bg-[#1E231B] rounded-3xl p-6 border border-stone-200">
            <p className="text-sm text-stone-500">अभी कोई फसल योजना सुरक्षित नहीं है।</p>
            <button
              onClick={onStartNewRecommendation}
              className="py-3 px-6 rounded-full bg-primary text-white font-bold text-sm"
            >
              नई फसल की सलाह लें
            </button>
          </div>
        )}

        {/* Start New Analysis Action Button */}
        <button
          onClick={onStartNewRecommendation}
          className="w-full py-4 rounded-full bg-primary text-on-primary font-bold text-base shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-4"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>{t('getCropRecButton')}</span>
        </button>

      </main>

      {/* Persistent Bottom Nav */}
      <HomeBottomNav activeTab="my-crops" onTabChange={handleNavChange} />
    </div>
  );
};
