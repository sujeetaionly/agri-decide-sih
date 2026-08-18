import React, { createContext, useContext, useState, useEffect } from 'react';
import { triggerHaptic } from '../lib/utils';

export interface FarmQuestionnaireState {
  landAcres: number;
  landUnit: 'ACRE' | 'BIGHA' | 'GUNTHA';
  soilType: string; // 'BLACK', 'LOAM', 'RED', 'SANDY', 'CLAY'
  waterCapacity: string; // 'HIGH', 'MEDIUM', 'LOW'
  waterSource: string; // 'CANAL', 'WELL', 'BOREWELL', 'RAINFED'
  previousCrop: string; // 'WHEAT', 'GRAM', 'PADDY', 'SOYBEAN', 'COTTON', 'OTHER'
  season: string; // 'KHARIF', 'RABI', 'ZAID'
  plannedSowingDate: string;
}

export interface CACPItemizedCost {
  seed_cost: number;
  fertilizer_cost: number;
  pesticide_cost: number;
  machinery_rental_cost: number;
  labour_cost: number;
  irrigation_electricity_cost: number;
  operational_cost_a2_inr_per_acre: number;
  family_labor_cost_per_acre: number;
  total_cost_a2_fl_inr_per_acre: number;
}

export interface RecommendedCrop {
  crop_id: string;
  crop_name_en: string;
  crop_name_hi: string;
  crop_name_mr?: string;
  suitability_pct: number;
  duration_days: number;
  expected_yield_qtl_per_acre: number;
  yield_range_qtl: string;
  total_cost_inr_per_acre: number;
  cost_breakdown?: CACPItemizedCost;
  forecasted_mandi_price_inr_per_qtl: number;
  expected_net_profit_per_acre_inr: number;
  net_profit_per_day_inr: number;
  price_volatility: string;
  why_recommended: string[];
}

export interface ComparisonCropItem {
  crop_id: string;
  crop_name_en: string;
  crop_name_hi: string;
  crop_name_mr?: string;
  suitability_pct: number;
  sowing_window_status: string;
  total_cost_inr_per_acre: number;
  cost_breakdown?: CACPItemizedCost;
  expected_yield_qtl_per_acre: number;
  forecasted_mandi_price_inr_per_qtl: number;
  expected_net_profit_per_acre_inr: number;
  duration_days: number;
  net_profit_per_day_inr: number;
}

interface WizardContextType {
  currentCard: number; // 1 to 5 (Question Cards), 6 (Recommendations), 7 (What-If), 8 (120-Day Plan)
  farmData: FarmQuestionnaireState;
  updateFarmData: (data: Partial<FarmQuestionnaireState>) => void;
  topRecommendation: RecommendedCrop | null;
  comparisonMatrix: ComparisonCropItem[];
  isLoadingRecommendation: boolean;
  fetchRecommendations: () => Promise<void>;
  goToCard: (card: number) => void;
  nextCard: () => void;
  prevCard: () => void;
  selectedCropId: string;
  setSelectedCropId: (id: string) => void;
  resetWizard: () => void;
}

const DEFAULT_FARM_DATA: FarmQuestionnaireState = {
  landAcres: 2.5,
  landUnit: 'ACRE',
  soilType: 'BLACK',
  waterCapacity: 'MEDIUM',
  waterSource: 'WELL',
  previousCrop: 'WHEAT',
  season: 'KHARIF',
  plannedSowingDate: '2026-06-25',
};

const DEFAULT_TOP_RECOMMENDATION: RecommendedCrop = {
  crop_id: 'SOYBEAN',
  crop_name_en: 'Soybean',
  crop_name_hi: 'सोयाबीन',
  crop_name_mr: 'सोयाबीन',
  suitability_pct: 94.0,
  duration_days: 95,
  expected_yield_qtl_per_acre: 9.5,
  yield_range_qtl: '8.5 - 10.5 क्विंटल',
  total_cost_inr_per_acre: 19412.0,
  cost_breakdown: {
    seed_cost: 2250.0,
    fertilizer_cost: 2450.0,
    pesticide_cost: 1350.0,
    machinery_rental_cost: 1950.0,
    labour_cost: 2850.0,
    irrigation_electricity_cost: 394.0,
    operational_cost_a2_inr_per_acre: 19412.0,
    family_labor_cost_per_acre: 1863.0,
    total_cost_a2_fl_inr_per_acre: 21275.0,
  },
  forecasted_mandi_price_inr_per_qtl: 4625.0,
  expected_net_profit_per_acre_inr: 24525.0,
  net_profit_per_day_inr: 258.0,
  price_volatility: 'LOW',
  why_recommended: [
    'काली मिट्टी और मानसूनी मौसम के साथ 94% सबसे उत्तम कृषि अनुकूलता।',
    '95 दिनों की कम अवधि में कुएं से मध्यम पानी में सुरक्षित पैदावार।',
    'अनुमानित लागत (₹19,412/एकड़) के साथ सर्वाधिक शुद्ध मुनाफा।',
    'पिछली गेहूं की फसल के बाद दलहन/तिलहन फसल चक्र से खेत की उर्वरता में वृद्धि।'
  ],
};

const DEFAULT_COMPARISON_MATRIX: ComparisonCropItem[] = [
  {
    crop_id: 'SOYBEAN',
    crop_name_en: 'Soybean',
    crop_name_hi: 'सोयाबीन',
    crop_name_mr: 'सोयाबीन',
    suitability_pct: 94.0,
    sowing_window_status: 'Optimal',
    total_cost_inr_per_acre: 19412.0,
    expected_yield_qtl_per_acre: 9.5,
    forecasted_mandi_price_inr_per_qtl: 4625.0,
    expected_net_profit_per_acre_inr: 24525.0,
    duration_days: 95,
    net_profit_per_day_inr: 258.0,
  },
  {
    crop_id: 'MAIZE',
    crop_name_en: 'Maize',
    crop_name_hi: 'मक्का',
    crop_name_mr: 'मका',
    suitability_pct: 88.0,
    sowing_window_status: 'Optimal',
    total_cost_inr_per_acre: 18211.0,
    expected_yield_qtl_per_acre: 24.0,
    forecasted_mandi_price_inr_per_qtl: 2150.0,
    expected_net_profit_per_acre_inr: 21389.0,
    duration_days: 105,
    net_profit_per_day_inr: 203.0,
  },
  {
    crop_id: 'BAJRA',
    crop_name_en: 'Bajra',
    crop_name_hi: 'बाजरा',
    crop_name_mr: 'बाजरी',
    suitability_pct: 85.0,
    sowing_window_status: 'Optimal',
    total_cost_inr_per_acre: 17264.0,
    expected_yield_qtl_per_acre: 12.0,
    forecasted_mandi_price_inr_per_qtl: 2450.0,
    expected_net_profit_per_acre_inr: 18136.0,
    duration_days: 85,
    net_profit_per_day_inr: 213.0,
  },
  {
    crop_id: 'GROUNDNUT',
    crop_name_en: 'Groundnut',
    crop_name_hi: 'मूंगफली',
    crop_name_mr: 'भुईमूग',
    suitability_pct: 82.0,
    sowing_window_status: 'Optimal',
    total_cost_inr_per_acre: 30351.0,
    expected_yield_qtl_per_acre: 8.5,
    forecasted_mandi_price_inr_per_qtl: 6200.0,
    expected_net_profit_per_acre_inr: 22349.0,
    duration_days: 120,
    net_profit_per_day_inr: 186.0,
  },
];

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCard, setCurrentCard] = useState<number>(1);
  const [farmData, setFarmData] = useState<FarmQuestionnaireState>(() => {
    try {
      const saved = localStorage.getItem('krishi_farm_data');
      return saved ? JSON.parse(saved) : DEFAULT_FARM_DATA;
    } catch {
      return DEFAULT_FARM_DATA;
    }
  });

  const [topRecommendation, setTopRecommendation] = useState<RecommendedCrop | null>(DEFAULT_TOP_RECOMMENDATION);
  const [comparisonMatrix, setComparisonMatrix] = useState<ComparisonCropItem[]>(DEFAULT_COMPARISON_MATRIX);
  const [selectedCropId, setSelectedCropId] = useState<string>('SOYBEAN');
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('krishi_farm_data', JSON.stringify(farmData));
    } catch {}
  }, [farmData]);

  // Android Hardware Back Gesture integration
  useEffect(() => {
    const handlePopState = () => {
      if (currentCard > 1) {
        setCurrentCard((prev) => prev - 1);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentCard]);

  const goToCard = (card: number) => {
    triggerHaptic('light');
    setCurrentCard(card);
    window.history.pushState({ card }, `Card ${card}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextCard = () => {
    goToCard(currentCard + 1);
  };

  const prevCard = () => {
    goToCard(Math.max(1, currentCard - 1));
  };

  const updateFarmData = (data: Partial<FarmQuestionnaireState>) => {
    setFarmData((prev) => ({ ...prev, ...data }));
  };

  const fetchRecommendations = async () => {
    setIsLoadingRecommendation(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/crop/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_land_acres: farmData.landAcres,
          soil_type: farmData.soilType,
          water_source: farmData.waterSource,
          water_capacity_level: farmData.waterCapacity,
          working_capital_inr: 80000.0,
          previous_season_crop: farmData.previousCrop,
          planned_sowing_date: farmData.plannedSowingDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.top_recommendation) {
          setTopRecommendation(data.top_recommendation);
          setSelectedCropId(data.top_recommendation.crop_id);
          // Persist recent analysis for home screen
          localStorage.setItem(
            'krishi_recent_analysis',
            JSON.stringify({
              cropName: data.top_recommendation.crop_name_hi,
              profitPerAcre: data.top_recommendation.expected_net_profit_per_acre_inr,
              yieldQtl: data.top_recommendation.expected_yield_qtl_per_acre,
              date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
              landArea: farmData.landAcres,
            })
          );
        }
        if (data.comparison_matrix) {
          setComparisonMatrix(data.comparison_matrix);
        }
      }
    } catch (e) {
      console.warn('API error, using cached benchmark recommendations:', e);
    } finally {
      setIsLoadingRecommendation(false);
      goToCard(6); // Move to recommendations view
    }
  };

  const resetWizard = () => {
    setCurrentCard(1);
    setFarmData(DEFAULT_FARM_DATA);
  };

  return (
    <WizardContext.Provider
      value={{
        currentCard,
        farmData,
        updateFarmData,
        topRecommendation,
        comparisonMatrix,
        isLoadingRecommendation,
        fetchRecommendations,
        goToCard,
        nextCard,
        prevCard,
        selectedCropId,
        setSelectedCropId,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
