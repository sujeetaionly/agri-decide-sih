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
  crop_name_gu?: string;
  crop_name_raj?: string;
  category?: string;
  suitability_pct: number;
  duration_days: number;
  expected_yield_qtl_per_acre: number;
  yield_range_qtl: string;
  total_cost_inr_per_acre: number;
  cost_breakdown?: CACPItemizedCost;
  forecasted_mandi_price_inr_per_qtl: number;
  expected_net_profit_per_acre_inr: number;
  net_profit_per_day_inr: number;
  price_volatility: 'LOW' | 'MEDIUM' | 'HIGH';
  why_recommended: string[];
  pros?: string[];
  cons?: string[];
}

export interface ComparisonCropItem {
  crop_id: string;
  crop_name_en: string;
  crop_name_hi: string;
  crop_name_mr?: string;
  crop_name_gu?: string;
  crop_name_raj?: string;
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

export interface IntendedCropComparisonDetail {
  crop_id: string;
  crop_name?: string;
  crop_name_en: string;
  crop_name_hi: string;
  crop_name_mr?: string;
  crop_name_gu?: string;
  crop_name_raj?: string;
  suitability_pct: number;
  total_cost_inr_per_acre: number;
  expected_yield_qtl_per_acre: number;
  expected_net_profit_per_acre_inr: number;
  duration_days: number;
}

export interface IntendedVsRecommendedComparison {
  has_intended_crops: boolean;
  is_intended_already_best: boolean;
  profit_difference_per_acre_inr: number;
  profit_gain_pct: number;
  intended_crop?: IntendedCropComparisonDetail;
  recommended_crop?: IntendedCropComparisonDetail;
  recommendation_insight: string;
  recommendation_insight_en: string;
}

export interface CropMilestoneItem {
  day: number;
  stageName: string;
  stageNameHi: string;
  stageNameMr?: string;
  stageNameGu?: string;
  stageNameRaj?: string;
  action: string;
  actionHi: string;
  actionMr?: string;
  actionGu?: string;
  actionRaj?: string;
  tag: string;
  tagHi?: string;
  completed?: boolean;
}

export interface CropMilestoneSchedule {
  cropId: string;
  cropName: string;
  durationDays: number;
  milestones: CropMilestoneItem[];
}
