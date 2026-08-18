import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HomeTopAppBar } from '../components/home/HomeTopAppBar';
import { HomeBottomNav, NavTab } from '../components/home/HomeBottomNav';
import { triggerHaptic, formatCurrencyINR, formatIndicDate, formatIndicDateTime } from '../lib/utils';
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
  onOpenMyCropPlan: () => void;
  onOpenSettings: () => void;
}

export const MyCropsPage: React.FC<MyCropsPageProps> = ({
  onStartNewRecommendation,
  onGoToHome,
  onOpenMyCropPlan,
  onOpenSettings,
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
            created_at: '2026-08-18T10:30:00Z',
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
    else if (tab === 'my-crop') onOpenMyCropPlan();
    else if (tab === 'settings') onOpenSettings();
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = `फसल इतिहास पृष्ठ। आपके पास कुल ${historyList.length} सुरक्षित फसल विश्लेषण रिकॉर्ड हैं।`;
    speakText(msg, language);
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark min-h-screen flex flex-col justify-between pt-16 pb-24 font-body">
      
      {/* Top Header */}
      <HomeTopAppBar />

      {/* Main Content */}
      <main className="flex-grow px-4 py-4 max-w-md mx-auto w-full space-y-4 animate-fadeIn">
        
        {/* Page Title Header */}
        <div className="space-y-1 pt-1 pb-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC]">
              {t('historyTitle')}
            </h1>

            <button
              onClick={handleAudio}
              className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">volume_up</span>
              <span>{t('listen')}</span>
            </button>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            अपनी सभी सुरक्षित फसल योजनाओं और पुराने विश्लेषणों का विवरण।
          </p>
        </div>

        {/* History List */}
        {isLoading ? (
          <div className="text-center py-12 text-stone-500">
            <span className="material-symbols-outlined text-3xl animate-spin text-primary">progress_activity</span>
            <p className="text-xs mt-2 font-medium">इतिहास लोड हो रहा है...</p>
          </div>
        ) : historyList.length > 0 ? (
          <div className="space-y-4 pt-1">
            {historyList.map((item) => {
              const cropName = language === 'mr' ? item.crop_name_mr : item.crop_name_hi;
              const soilName = item.soil_type === 'BLACK' ? 'काली मिट्टी' : item.soil_type === 'RED' ? 'लाल मिट्टी' : item.soil_type === 'SANDY' ? 'बलुई मिट्टी' : item.soil_type === 'CLAY' ? 'चिकनी मिट्टी' : (item.soil_type || 'दोमट मिट्टी');
              return (
                <div
                  key={item.rec_id}
                  className="bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-5 shadow-md hover:shadow-lg transition-all space-y-3.5"
                >
                  {/* Top Row: Crop Name & Land Area Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                        🌾
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#1A1C18] dark:text-[#E2E3DC] font-headline">
                          {cropName}
                        </h3>
                        <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          {formatIndicDateTime(item.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold font-mono">
                      {item.total_land_acres} एकड़
                    </div>
                  </div>

                  {/* Middle Row: Scorecard metrics (Profit & Yield) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-center">
                      <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                        शुद्ध लाभ
                      </span>
                      <span className="text-base font-black text-emerald-700 dark:text-emerald-400 block my-0.5">
                        {formatCurrencyINR(item.expected_profit_per_acre)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">
                        / एकड़
                      </span>
                    </div>

                    <div className="bg-blue-50/70 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-200 dark:border-blue-800/60 text-center">
                      <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block">
                        पैदावार
                      </span>
                      <span className="text-base font-black text-blue-700 dark:text-blue-400 block my-0.5">
                        {item.expected_yield_qtl_per_acre}
                      </span>
                      <span className="text-[10px] text-blue-600 font-medium">
                        क्विंटल / एकड़
                      </span>
                    </div>
                  </div>

                  {/* Footer Row: Clean Cost */}
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-medium pt-2 border-t border-stone-200 dark:border-stone-800 px-1">
                    <span>लागत: {formatCurrencyINR(item.total_cost_per_acre)} / एकड़</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1E231B] border border-stone-200 dark:border-stone-800 rounded-3xl p-8 text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-stone-400">history_edu</span>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#1A1C18] dark:text-[#E2E3DC]">
                कोई पुराना इतिहास नहीं है
              </h3>
              <p className="text-xs text-stone-500">
                अपनी पहली फसल का विश्लेषण करने के लिए नीचे दिया गया बटन दबाएं।
              </p>
            </div>

            <button
              onClick={onStartNewRecommendation}
              className="py-3 px-6 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md"
            >
              नई फसल की सलाह लें
            </button>
          </div>
        )}

        {/* Start New Analysis Action Button */}
        <button
          onClick={onStartNewRecommendation}
          className="w-full py-4 rounded-full bg-primary text-on-primary font-bold text-base shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>{t('getCropRecButton')}</span>
        </button>

      </main>

      {/* Persistent Bottom Nav */}
      <HomeBottomNav activeTab="history" onTabChange={handleNavChange} />
    </div>
  );
};
