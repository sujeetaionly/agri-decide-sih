import React, { createContext, useContext, useState, useEffect } from 'react';
import { triggerHaptic } from '../lib/utils';
import { authService } from '../lib/auth';
import {
  RecommendedCrop,
  ComparisonCropItem,
  IntendedVsRecommendedComparison,
  CACPItemizedCost,
} from '../types/crop';
import { FarmQuestionnaireState } from '../types/wizard';
import { MASTER_CROP_MAP, getDynamicCropDetail } from '../data/cropAgronomics';
import { apiService } from '../services/api';

export type {
  RecommendedCrop,
  ComparisonCropItem,
  IntendedVsRecommendedComparison,
  CACPItemizedCost,
  FarmQuestionnaireState,
};

interface WizardContextType {
  currentCard: number; // 1 to 6 (Question Cards), 7 (Recommendations), 8 (What-If), 9 (120-Day Plan)
  farmData: FarmQuestionnaireState;
  updateFarmData: (data: Partial<FarmQuestionnaireState>) => void;
  topRecommendation: RecommendedCrop | null;
  activeCropPlan: RecommendedCrop | null;
  chooseCropForMyCropPlan: (crop: RecommendedCrop) => void;
  comparisonMatrix: ComparisonCropItem[];
  intendedVsRecommended: IntendedVsRecommendedComparison | null;
  isLoadingRecommendation: boolean;
  fetchRecommendations: () => Promise<void>;
  goToCard: (card: number) => void;
  nextCard: () => void;
  prevCard: () => void;
  selectedCropId: string;
  setSelectedCropId: (id: string) => void;
  resetWizard: () => void;
}

// Strictly null/empty defaults so NO options on any step are preselected
const DEFAULT_FARM_DATA: FarmQuestionnaireState = {
  landAcres: null,
  landUnit: 'ACRE',
  soilType: null,
  waterCapacity: null,
  waterSource: null,
  equipments: [],
  previousCrop: null,
  previousCrops: [],
  intendedCrops: [],
  season: null,
  plannedSowingDate: null,
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
    'पिछली फसल के बाद फसल चक्र से खेत की उर्वरता में वृद्धि।',
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
  const [farmData, setFarmData] = useState<FarmQuestionnaireState>(DEFAULT_FARM_DATA);

  const [topRecommendation, setTopRecommendation] = useState<RecommendedCrop | null>(DEFAULT_TOP_RECOMMENDATION);
  const [activeCropPlan, setActiveCropPlan] = useState<RecommendedCrop | null>(() => {
    try {
      const saved = localStorage.getItem('krishi_active_crop_plan');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.crop_id !== 'ONION' && (parsed.expected_net_profit_per_acre_inr || 0) < 80000) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse krishi_active_crop_plan', e);
    }
    return DEFAULT_TOP_RECOMMENDATION;
  });

  const [comparisonMatrix, setComparisonMatrix] = useState<ComparisonCropItem[]>(DEFAULT_COMPARISON_MATRIX);
  const [intendedVsRecommended, setIntendedVsRecommended] = useState<IntendedVsRecommendedComparison | null>(null);
  const [selectedCropId, setSelectedCropId] = useState<string>('SOYBEAN');
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState<boolean>(false);

  const chooseCropForMyCropPlan = (crop: RecommendedCrop) => {
    triggerHaptic('success');
    setActiveCropPlan(crop);
    localStorage.setItem('krishi_active_crop_plan', JSON.stringify(crop));
    localStorage.setItem(
      'krishi_recent_analysis',
      JSON.stringify({
        cropName: crop.crop_name_hi,
        profitPerAcre: crop.expected_net_profit_per_acre_inr,
        yieldQtl: crop.expected_yield_qtl_per_acre,
        date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        landArea: farmData.landAcres || 2.5,
      })
    );
  };

  // Android Hardware Back Gesture integration
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.card === 'number') {
        setCurrentCard(e.state.card);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    setFarmData((prev) => {
      const updated = { ...prev, ...data };
      if (data.previousCrops) {
        updated.previousCrop = data.previousCrops.join(', ');
      }
      return updated;
    });
  };

  const fetchRecommendations = async () => {
    setIsLoadingRecommendation(true);
    try {
      const eqList = farmData.equipments || [];
      const data = await apiService.recommendCrops({
        total_land_acres: farmData.landAcres || 2.5,
        soil_type: farmData.soilType || 'BLACK',
        water_source: farmData.waterSource || 'WELL',
        water_capacity_level: farmData.waterCapacity || 'MEDIUM',
        working_capital_inr: 80000.0,
        previous_season_crop: farmData.previousCrops && farmData.previousCrops.length > 0
          ? farmData.previousCrops[0]
          : (farmData.previousCrop || 'WHEAT'),
        equipments: eqList,
        owns_tractor: eqList.includes('TRACTOR'),
        owns_sprayer: eqList.includes('SPRAYER'),
        owns_pump: eqList.includes('PUMP'),
        owns_harvester: eqList.includes('HARVESTER'),
        planned_sowing_date: farmData.plannedSowingDate || '2026-06-25',
        intended_crops: farmData.intendedCrops || [],
        lang: 'hi',
      });

      if (data && data.top_recommendation) {
        setTopRecommendation(data.top_recommendation);
        setSelectedCropId(data.top_recommendation.crop_id);
        // If the farmer has not chosen a specific crop yet, seed it once
        if (!localStorage.getItem('krishi_active_crop_plan')) {
          setActiveCropPlan(data.top_recommendation);
        }
      }
      if (data && data.comparison_matrix) {
        setComparisonMatrix(data.comparison_matrix);
      }
      if (data && data.intended_vs_recommended) {
        setIntendedVsRecommended(data.intended_vs_recommended);
      } else {
        setIntendedVsRecommended(null);
      }
    } catch (e) {
      console.warn('API error, using cached benchmark recommendations:', e);
      // Fallback: Compute dynamic recommendation adjusting for soil, water & equipment
      const fallbackTop = getDynamicCropDetail('SOYBEAN', farmData);
      setTopRecommendation(fallbackTop);
      setSelectedCropId('SOYBEAN');
    } finally {
      setIsLoadingRecommendation(false);
      goToCard(8); // Move to recommendations view (Step 8)
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
        activeCropPlan,
        chooseCropForMyCropPlan,
        comparisonMatrix,
        intendedVsRecommended,
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
