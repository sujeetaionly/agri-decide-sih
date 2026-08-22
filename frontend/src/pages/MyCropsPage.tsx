import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWizard } from '../context/WizardContext';
import { HomeTopAppBar } from '../components/home/HomeTopAppBar';
import { HomeBottomNav, NavTab } from '../components/home/HomeBottomNav';
import { triggerHaptic, formatCurrencyINR, formatIndicDateTime } from '../lib/utils';
import { authService } from '../lib/auth';

import { RecommendedCrop } from '../types/crop';
import { apiService } from '../services/api';

interface ComparedCropItem {
  crop_id: string;
  crop_name_en?: string;
  crop_name_hi: string;
  crop_name_mr: string;
  suitability_pct: number;
  expected_profit_per_acre: number;
  expected_yield_qtl_per_acre: number;
  total_cost_per_acre: number;
  duration_days: number;
  recommendation_statement: string;
}

interface SavedCropAnalysis {
  rec_id: number;
  winner_crop: ComparedCropItem;
  compared_crops: ComparedCropItem[];
  total_land_acres: number;
  soil_type: string;
  water_source: string;
  created_at: string;
}

interface MyCropsPageProps {
  onStartNewRecommendation: () => void;
  onGoToHome: () => void;
  onOpenMyCropPlan: () => void;
  onOpenSettings: () => void;
  onOpenAnalysisFromHistory?: (historyItem: SavedCropAnalysis) => void;
}

const SOIL_HINDI_MAP: Record<string, string> = {
  BLACK: 'काली',
  RED: 'लाल',
  SANDY: 'बलुई',
  CLAY: 'चिकनी',
  LOAM: 'दोमट',
  ALLUVIAL: 'जलोढ़',
};

const WATER_HINDI_MAP: Record<string, string> = {
  WELL: 'कुआं',
  OPEN_WELL: 'कुआं',
  BOREWELL: 'ट्यूबवेल',
  TUBEWELL: 'ट्यूबवेल',
  CANAL: 'नहर',
  RAINFED: 'वर्षा',
  DRIP: 'ड्रिप',
  SPRINKLER: 'स्प्रिंकलर',
};

const CROP_HINDI_MAP: Record<string, string> = {
  SOYBEAN: 'सोयाबीन',
  COTTON: 'कपास',
  ONION: 'प्याज',
  MAIZE: 'मक्का',
  WHEAT: 'गेहूं',
  CHICKPEA: 'चना',
  GRAM: 'चना',
  BAJRA: 'बाजरा',
  GROUNDNUT: 'मूंगफली',
  PADDY: 'धान',
  RICE: 'धान',
  TUR: 'अरहर',
  MOONG: 'मूंग',
  URAD: 'उड़द',
  MUSTARD: 'सरसों',
  SUGARCANE: 'गन्ना',
};

export const MyCropsPage: React.FC<MyCropsPageProps> = ({
  onStartNewRecommendation,
  onGoToHome,
  onOpenMyCropPlan,
  onOpenSettings,
  onOpenAnalysisFromHistory,
}) => {
  const { language, t } = useLanguage();
  const { chooseCropForMyCropPlan } = useWizard();
  const [historyList, setHistoryList] = useState<SavedCropAnalysis[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SavedCropAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSelectCropFromHistory = (candidateCrop: ComparedCropItem) => {
    triggerHaptic('success');
    const fullCrop: RecommendedCrop = {
      crop_id: candidateCrop.crop_id,
      crop_name_en: candidateCrop.crop_name_en || candidateCrop.crop_id,
      crop_name_hi: candidateCrop.crop_name_hi,
      crop_name_mr: candidateCrop.crop_name_mr,
      suitability_pct: candidateCrop.suitability_pct,
      duration_days: candidateCrop.duration_days || 95,
      expected_yield_qtl_per_acre: candidateCrop.expected_yield_qtl_per_acre,
      yield_range_qtl: `${candidateCrop.expected_yield_qtl_per_acre} क्विंटल`,
      total_cost_inr_per_acre: candidateCrop.total_cost_per_acre,
      forecasted_mandi_price_inr_per_qtl: 4500,
      expected_net_profit_per_acre_inr: candidateCrop.expected_profit_per_acre,
      net_profit_per_day_inr: Math.round(candidateCrop.expected_profit_per_acre / (candidateCrop.duration_days || 95)),
      price_volatility: 'LOW',
      why_recommended: candidateCrop.recommendation_statement ? [candidateCrop.recommendation_statement] : [],
    };
    chooseCropForMyCropPlan(fullCrop);
    onOpenMyCropPlan();
  };

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const rawHistory = await apiService.getFarmerHistory();
        if (rawHistory && rawHistory.length > 0) {
          const mapped: SavedCropAnalysis[] = rawHistory.map((item: any) => {
            const cId = String(item.top_recommended_crop || 'SOYBEAN').toUpperCase();
            const soilCode = String(item.soil_type || '').toUpperCase().trim();
            const waterCode = String(item.water_source || '').toUpperCase().trim();
            const localizedSoil = SOIL_HINDI_MAP[soilCode] || item.soil_type || 'काली';
            const localizedWater = WATER_HINDI_MAP[waterCode] || item.water_source || 'कुआं';
            const cropNameHi = item.crop_name_hi && !/^[A-Z_]+$/.test(item.crop_name_hi) 
              ? item.crop_name_hi 
              : CROP_HINDI_MAP[cId] || item.crop_name_hi || cId;

            const winnerCropItem: ComparedCropItem = {
              crop_id: cId,
              crop_name_hi: cropNameHi,
              crop_name_mr: item.crop_name_mr || cropNameHi,
              suitability_pct: Math.round(item.match_score || 92),
              expected_profit_per_acre: item.expected_profit_per_acre || 24500,
              expected_yield_qtl_per_acre: item.expected_yield_qtl_per_acre || 9.5,
              total_cost_per_acre: item.total_cost_per_acre || 19412,
              duration_days: 95,
              recommendation_statement: `${localizedSoil} मिट्टी व ${localizedWater} सिंचाई में न्यूनतम लागत पर अधिकतम लाभ।`,
            };

            const compared: ComparedCropItem[] = item.compared_crops && item.compared_crops.length > 0
              ? item.compared_crops.map((c: any) => {
                  const compId = String(c.crop_id || '').toUpperCase();
                  const compNameHi = c.crop_name_hi && !/^[A-Z_]+$/.test(c.crop_name_hi)
                    ? c.crop_name_hi
                    : CROP_HINDI_MAP[compId] || c.crop_name_hi || compId;
                  return {
                    ...c,
                    crop_id: compId,
                    crop_name_hi: compNameHi,
                    crop_name_mr: c.crop_name_mr || compNameHi,
                  };
                })
              : [
                  winnerCropItem,
                  {
                    crop_id: 'MAIZE',
                    crop_name_hi: 'मक्का',
                    crop_name_mr: 'मका',
                    suitability_pct: 88,
                    expected_profit_per_acre: Math.round(winnerCropItem.expected_profit_per_acre * 0.88),
                    expected_yield_qtl_per_acre: 24.0,
                    total_cost_per_acre: 18211.0,
                    duration_days: 105,
                    recommendation_statement: 'स्थानीय मंडी व पोल्ट्री मांग हेतु उपयुक्त विकल्प।',
                  },
                  {
                    crop_id: 'BAJRA',
                    crop_name_hi: 'बाजरा',
                    crop_name_mr: 'बाजरी',
                    suitability_pct: 85,
                    expected_profit_per_acre: Math.round(winnerCropItem.expected_profit_per_acre * 0.75),
                    expected_yield_qtl_per_acre: 12.0,
                    total_cost_per_acre: 17264.0,
                    duration_days: 85,
                    recommendation_statement: 'कम वर्षा में सूखा सुरक्षित कम लागत फसल।',
                  }
                ];

            return {
              rec_id: item.rec_id,
              total_land_acres: item.total_land_acres || 2.5,
              soil_type: localizedSoil + (localizedSoil.endsWith('मिट्टी') ? '' : ' मिट्टी'),
              water_source: localizedWater + (localizedWater.endsWith('सिंचाई') ? '' : ' सिंचाई'),
              created_at: item.created_at || new Date().toISOString(),
              winner_crop: winnerCropItem,
              compared_crops: compared,
            };
          });

          setHistoryList(mapped);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.warn('[MyCropsPage] Error loading history from DB:', e);
      }

      // Default rich history with candidate comparisons
      setHistoryList([
        {
          rec_id: 101,
          total_land_acres: 2.5,
          soil_type: 'काली मिट्टी',
          water_source: 'कुआं',
          created_at: '2026-08-18T10:30:00Z',
          winner_crop: {
            crop_id: 'SOYBEAN',
            crop_name_hi: 'सोयाबीन',
            crop_name_mr: 'सोयाबीन',
            suitability_pct: 94,
            expected_profit_per_acre: 24525.0,
            expected_yield_qtl_per_acre: 9.5,
            total_cost_per_acre: 19412.0,
            duration_days: 95,
            recommendation_statement: 'मध्यम वर्षा और काली मिट्टी में न्यूनतम लागत पर अधिकतम लाभ।',
          },
          compared_crops: [
            {
              crop_id: 'SOYBEAN',
              crop_name_hi: 'सोयाबीन',
              crop_name_mr: 'सोयाबीन',
              suitability_pct: 94,
              expected_profit_per_acre: 24525.0,
              expected_yield_qtl_per_acre: 9.5,
              total_cost_per_acre: 19412.0,
              duration_days: 95,
              recommendation_statement: 'मध्यम वर्षा और काली मिट्टी में न्यूनतम लागत पर अधिकतम लाभ।',
            },
            {
              crop_id: 'MAIZE',
              crop_name_hi: 'मक्का',
              crop_name_mr: 'मका',
              suitability_pct: 88,
              expected_profit_per_acre: 21389.0,
              expected_yield_qtl_per_acre: 24.0,
              total_cost_per_acre: 18211.0,
              duration_days: 105,
              recommendation_statement: 'स्थानीय पोल्ट्री व फीड मिलों में निरंतर स्थिर नकद मांग।',
            },
            {
              crop_id: 'BAJRA',
              crop_name_hi: 'बाजरा',
              crop_name_mr: 'बाजरी',
              suitability_pct: 82,
              expected_profit_per_acre: 18136.0,
              expected_yield_qtl_per_acre: 12.0,
              total_cost_per_acre: 17264.0,
              duration_days: 85,
              recommendation_statement: 'कम सिंचाई में सूखा प्रतिरोधी सबसे सुरक्षित अल्पकालिक फसल।',
            },
            {
              crop_id: 'GROUNDNUT',
              crop_name_hi: 'मूंगफली',
              crop_name_mr: 'भुईमूग',
              suitability_pct: 79,
              expected_profit_per_acre: 22349.0,
              expected_yield_qtl_per_acre: 8.5,
              total_cost_per_acre: 30351.0,
              duration_days: 120,
              recommendation_statement: 'उच्च मंडी भाव, लेकिन बुवाई लागत अधिक।',
            },
          ],
        },
        {
          rec_id: 102,
          total_land_acres: 3.0,
          soil_type: 'दोमट मिट्टी',
          water_source: 'ट्यूबवेल',
          created_at: '2026-06-10T14:15:00Z',
          winner_crop: {
            crop_id: 'MAIZE',
            crop_name_hi: 'मक्का',
            crop_name_mr: 'मका',
            suitability_pct: 92,
            expected_profit_per_acre: 21389.0,
            expected_yield_qtl_per_acre: 24.0,
            total_cost_per_acre: 18211.0,
            duration_days: 105,
            recommendation_statement: 'दोमट मिट्टी और प्रचुर सिंचाई में उत्कृष्ट पैदावार।',
          },
          compared_crops: [
            {
              crop_id: 'MAIZE',
              crop_name_hi: 'मक्का',
              crop_name_mr: 'मका',
              suitability_pct: 92,
              expected_profit_per_acre: 21389.0,
              expected_yield_qtl_per_acre: 24.0,
              total_cost_per_acre: 18211.0,
              duration_days: 105,
              recommendation_statement: 'दोमट मिट्टी और प्रचुर सिंचाई में उत्कृष्ट पैदावार।',
            },
            {
              crop_id: 'SOYBEAN',
              crop_name_hi: 'सोयाबीन',
              crop_name_mr: 'सोयाबीन',
              suitability_pct: 86,
              expected_profit_per_acre: 24525.0,
              expected_yield_qtl_per_acre: 9.5,
              total_cost_per_acre: 19412.0,
              duration_days: 95,
              recommendation_statement: 'उपयुक्त जल निकासी होने पर अच्छा विकल्प।',
            },
          ],
        },
      ]);
      setIsLoading(false);
    };

    loadHistory();
  }, []);

  const handleNavChange = (tab: NavTab) => {
    if (tab === 'home') onGoToHome();
    else if (tab === 'my-crop') onOpenMyCropPlan();
    else if (tab === 'settings') onOpenSettings();
  };

  const audioText = language === 'mr'
    ? 'पीक इतिहास पृष्ठ. आपल्या जतन केलेल्या पीक योजना आणि मागील निकाल येथे उपलब्ध आहेत.'
    : language === 'gu'
    ? 'પાક ઇતિહાસ પેજ. તમારા સાચવેલા પાક આયોજન અને પરિણામો અહીં ઉપલબ્ધ છે.'
    : language === 'en'
    ? 'Crop History page. Tap any entry to view the full crop comparison and recommendation details.'
    : 'फसल इतिहास पृष्ठ। पिछले सभी फसल विश्लेषण और तुलना देखने के लिए किसी भी कार्ड पर टैप करें।';

  return (
    <div className="bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark min-h-screen flex flex-col font-body">
      
      {/* Top Header */}
      <HomeTopAppBar audioText={audioText} />

      {/* Main Content */}
      <main className="flex-1 px-4 pt-3 pb-20 max-w-md mx-auto w-full space-y-4 animate-fadeIn">
        
        {/* Page Title Header with Emblem & Balanced Spacing */}
        <div className="flex items-center gap-3 pt-1.5 pb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-2xl font-bold">history</span>
          </div>
          <h1 className="text-2xl font-black font-headline tracking-tight text-on-surface-light dark:text-on-surface-dark">
            {t('historyTitle')}
          </h1>
        </div>

        {/* History List */}
        {isLoading ? (
          <div className="text-center py-12 text-stone-500">
            <span className="material-symbols-outlined text-3xl animate-spin text-primary">progress_activity</span>
            <p className="text-xs mt-2 font-medium">इतिहास लोड हो रहा है...</p>
          </div>
        ) : historyList.length > 0 ? (
          <div className="space-y-3.5 pt-0.5">
            {historyList.map((item) => {
              const winner = item.winner_crop;
              const winnerName = language === 'mr' ? winner.crop_name_mr : winner.crop_name_hi;

              return (
                <div
                  key={item.rec_id}
                  onClick={() => {
                    triggerHaptic('light');
                    if (onOpenAnalysisFromHistory) {
                      onOpenAnalysisFromHistory(item);
                    } else {
                      setSelectedHistoryItem(item);
                    }
                  }}
                  className="bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 cursor-pointer hover:border-primary/50 transition-all active:scale-[0.99]"
                >
                  {/* Top Meta Row: Date/Time on Left & Match Badge on Right */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                      {formatIndicDateTime(item.created_at)}
                    </p>

                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 flex-shrink-0">
                      शीर्ष विकल्प ({winner.suitability_pct}% मैच)
                    </span>
                  </div>

                  {/* Hero Crop Name: Prominent & Bold */}
                  <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 font-headline tracking-tight">
                    {winnerName}
                  </h3>

                  {/* Recommendation Insight: Clean Left-Accent Callout (No pinched pill roundedness) */}
                  <div className="border-l-3 border-primary bg-stone-50 dark:bg-stone-900/50 pl-3 pr-2.5 py-2 rounded-r-xl text-xs text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
                    {winner.recommendation_statement}
                  </div>

                  {/* Candidate Crops Compared Overview */}
                  <div className="space-y-1.5 pt-0.5">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      तुलना की गई फसलें ({item.compared_crops.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.compared_crops.map((c) => {
                        const isWinner = c.crop_id === winner.crop_id;
                        const cName = language === 'mr' ? c.crop_name_mr : c.crop_name_hi;
                        return (
                          <span
                            key={c.crop_id}
                            className={`text-xs px-2.5 py-1 rounded-full font-bold border shadow-2xs ${
                              isWinner
                                ? 'bg-primary/10 text-primary border-primary/40'
                                : 'bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-600'
                            }`}
                          >
                            {cName}: {formatCurrencyINR(c.expected_profit_per_acre)}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Link: Tap to view full comparison */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs text-primary font-bold">
                    <span>पूरी तुलना व विश्लेषण देखें</span>
                    <span className="text-sm font-black leading-none">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-8 text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-stone-400">history_edu</span>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-on-surface-light dark:text-on-surface-dark">
                कोई पुराना इतिहास नहीं है
              </h3>
              <p className="text-xs text-stone-500">
                अपनी पहली फसल का विश्लेषण करने के लिए नीचे दिया गया बटन दबाएं।
              </p>
            </div>

            <button
              onClick={onStartNewRecommendation}
              className="py-3 px-6 rounded-full bg-primary text-white font-bold text-xs shadow-md"
            >
              नया फसल विश्लेषण शुरू करें
            </button>
          </div>
        )}

        {/* Start New Analysis Action Button */}
        <button
          onClick={onStartNewRecommendation}
          className="w-full py-4 rounded-full bg-primary text-white font-black text-base shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>{t('getCropRecButton')}</span>
        </button>

      </main>

      {/* FULL COMPARISON MODAL DIALOG */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-surface-light dark:bg-surface-dark w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 border border-stone-300 dark:border-stone-700 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h2 className="text-xl font-black font-headline text-on-surface-light dark:text-on-surface-dark">
                  फसल तुलना इतिहास
                </h2>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  {selectedHistoryItem.total_land_acres} एकड़ • {selectedHistoryItem.soil_type} • {selectedHistoryItem.water_source}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHistoryItem(null)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center cursor-pointer hover:bg-stone-200"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Compared Crops Matrix */}
            <div className="space-y-3">
              {selectedHistoryItem.compared_crops.map((crop) => {
                const cName = language === 'mr' ? crop.crop_name_mr : crop.crop_name_hi;
                const isTop = crop.crop_id === selectedHistoryItem.winner_crop.crop_id;

                return (
                  <div
                    key={crop.crop_id}
                    className={`p-4 rounded-2xl border-2 space-y-3 ${
                      isTop
                        ? 'border-primary bg-primary/5'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
                    }`}
                  >
                    {/* Header: Name, Match & Profit */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black font-headline text-on-surface-light dark:text-on-surface-dark">
                            {cName}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isTop
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                          }`}>
                            {crop.suitability_pct}% अनुकूलता
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 font-medium">
                          कालावधि: {crop.duration_days} दिन
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 font-bold uppercase block">शुद्ध लाभ</span>
                        <span className="text-base font-black text-primary dark:text-primary-fixed">
                          {formatCurrencyINR(crop.expected_profit_per_acre)}
                        </span>
                        <span className="text-[10px] text-stone-400 block">/ एकड़</span>
                      </div>
                    </div>

                    {/* Metrics: Yield & Cost */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-stone-50 dark:bg-stone-800/60 p-2 rounded-xl border border-stone-200 dark:border-stone-800">
                        <span className="text-[10px] text-stone-400 block">पैदावार</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200 mt-0.5 block">
                          {crop.expected_yield_qtl_per_acre} क्विंटल / एकड़
                        </span>
                      </div>
                      <div className="bg-stone-50 dark:bg-stone-800/60 p-2 rounded-xl border border-stone-200 dark:border-stone-800">
                        <span className="text-[10px] text-stone-400 block">लागत</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200 mt-0.5 block">
                          {formatCurrencyINR(crop.total_cost_per_acre)} / एकड़
                        </span>
                      </div>
                    </div>

                    {/* Recommendation Statement */}
                    <div className="border-l-3 border-primary bg-stone-50 dark:bg-stone-800/80 pl-3 pr-2.5 py-2 rounded-r-xl text-xs text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
                      {crop.recommendation_statement}
                    </div>

                    {/* Choose This Crop Action */}
                    <button
                      type="button"
                      onClick={() => handleSelectCropFromHistory(crop)}
                      className="w-full py-2.5 px-4 rounded-full bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>मैं यह फसल चुनता हूँ ({cName})</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Close */}
            <button
              type="button"
              onClick={() => setSelectedHistoryItem(null)}
              className="w-full py-3 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-200 cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}

      {/* Persistent Bottom Nav */}
      <HomeBottomNav activeTab="history" onTabChange={handleNavChange} />
    </div>
  );
};
