/**
 * Fasal Disha (फसल-दिशा) — Production API Service Layer
 * Connects frontend React components directly to the FastAPI backend and SQLite database.
 * Includes graceful timeout handling and transparent offline fallback mechanisms.
 */

import { authService } from '../lib/auth';
import { MASTER_CROP_MAP, getDynamicCropDetail } from '../data/cropAgronomics';
import { RecommendedCrop, ComparisonCropItem, IntendedVsRecommendedComparison } from '../types/crop';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api/v1';
    }
  }
  return (import.meta as any).env?.VITE_API_URL || 'https://fasal-disha.onrender.com/api/v1';
}

const API_BASE_URL = getApiBaseUrl();
// Extended to 65 seconds to comfortably accommodate Render free-tier cold-start wake-up times (up to 50s)
const REQUEST_TIMEOUT_MS = 65000;

// Proactively send a non-blocking background ping to wake up free-tier backend as soon as app opens
export function pingBackendWakeup(): void {
  try {
    const base = API_BASE_URL.replace('/api/v1', '');
    fetch(`${base}/health`, { method: 'GET', mode: 'cors' }).catch(() => {});
  } catch {
    // Non-blocking
  }
}

// Trigger warmup ping immediately on module load
pingBackendWakeup();

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = REQUEST_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export interface RecommendPayload {
  farmer_id?: string;
  total_land_acres?: number;
  soil_type?: string;
  water_source?: string;
  water_capacity_level?: string;
  working_capital_inr?: number;
  previous_season_crop?: string;
  equipments?: string[];
  owns_tractor?: boolean;
  owns_sprayer?: boolean;
  owns_pump?: boolean;
  owns_harvester?: boolean;
  planned_sowing_date?: string;
  candidate_crops?: string[];
  intended_crops?: string[];
  district?: string;
  state?: string;
  lang?: string;
}

export interface RecommendResponse {
  status: string;
  current_season: string;
  season_display_name: string;
  data_sources?: Record<string, string>;
  sowing_window: {
    status: string;
    badge_text: string;
    badge_color: string;
  };
  top_recommendation: RecommendedCrop;
  comparison_matrix: ComparisonCropItem[];
  intended_vs_recommended?: IntendedVsRecommendedComparison | null;
}

export interface WhatIfPayload {
  farmer_id?: string;
  district?: string;
  state?: string;
  lang?: string;
  sowing_delay_days?: number;
  rainfall_deficit_pct?: number;
  mandi_price_shock_pct?: number;
  soil_type?: string;
  water_capacity_level?: string;
  working_capital_inr?: number;
  candidate_crops?: string[];
}

export interface WhatIfResponse {
  status: string;
  simulation_results: {
    alert_message: string;
    updated_top_crop: string;
    updated_profit_inr_per_acre: number;
    resilience_rating: string;
    simulation_matrix?: ComparisonCropItem[];
  };
}

export interface CropCalendarResponse {
  status: string;
  crop_name: string;
  sowing_date: string;
  milestones: Array<{
    day_offset: number;
    date: string;
    title: string;
    action_hi: string;
    action_mr?: string;
  }>;
}

export interface SavedHistoryItem {
  rec_id: number;
  farmer_id?: string;
  created_at: string;
  planned_sowing_date: string;
  total_land_acres: number;
  soil_type: string;
  water_source: string;
  top_recommended_crop: string;
  crop_name_hi: string;
  crop_name_mr: string;
  expected_yield_qtl_per_acre: number;
  total_cost_per_acre: number;
  expected_profit_per_acre: number;
  match_score: number;
}

export const apiService = {
  /**
   * 1. Run AI Recommendation Matrix & Auto-persist to DB
   */
  async recommendCrops(payload: RecommendPayload): Promise<RecommendResponse> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/crop/recommend`, {
        method: 'POST',
        body: JSON.stringify({
          farmer_id: payload.farmer_id || 'GUEST',
          total_land_acres: payload.total_land_acres || 1.0,
          soil_type: payload.soil_type || 'BLACK',
          water_source: payload.water_source || 'WELL',
          water_capacity_level: payload.water_capacity_level || 'MEDIUM',
          working_capital_inr: payload.working_capital_inr || 80000.0,
          previous_season_crop: payload.previous_season_crop || 'WHEAT',
          planned_sowing_date: payload.planned_sowing_date || '2026-06-25',
          candidate_crops: payload.candidate_crops,
          intended_crops: payload.intended_crops,
          district: payload.district || 'Pune',
          state: payload.state || 'Maharashtra',
          lang: payload.lang || 'hi',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('[API Service] Recommendation API fallback triggered:', e);
    }

    // Graceful Offline / Client-Side Fallback Engine
    const targetCrop = (payload.intended_crops && payload.intended_crops[0]) || 'SOYBEAN';
    const topRec = getDynamicCropDetail(targetCrop, {
      soilType: payload.soil_type || 'BLACK',
      waterCapacity: payload.water_capacity_level || 'MEDIUM',
      landAcres: payload.total_land_acres || 1.0,
    });

    const comparisonList: ComparisonCropItem[] = (payload.candidate_crops || ['SOYBEAN', 'MAIZE', 'BAJRA', 'MOONG', 'TUR']).map((cId) => {
      const c = getDynamicCropDetail(cId, {
        soilType: payload.soil_type || 'BLACK',
        waterCapacity: payload.water_capacity_level || 'MEDIUM',
      });
      return {
        crop_id: c.crop_id,
        crop_name_en: c.crop_name_en,
        crop_name_hi: c.crop_name_hi,
        crop_name_mr: c.crop_name_mr,
        crop_name_gu: c.crop_name_gu,
        crop_name_raj: c.crop_name_raj,
        suitability_pct: c.suitability_pct,
        sowing_window_status: 'Optimal',
        total_cost_inr_per_acre: c.total_cost_inr_per_acre,
        cost_breakdown: c.cost_breakdown,
        expected_yield_qtl_per_acre: c.expected_yield_qtl_per_acre,
        forecasted_mandi_price_inr_per_qtl: c.forecasted_mandi_price_inr_per_qtl,
        expected_net_profit_per_acre_inr: c.expected_net_profit_per_acre_inr,
        duration_days: c.duration_days,
        net_profit_per_day_inr: c.net_profit_per_day_inr,
      };
    });

    return {
      status: 'success',
      current_season: 'KHARIF',
      season_display_name: 'खरीफ मौसम 2026-27',
      sowing_window: {
        status: 'OPTIMAL',
        badge_text: 'अनुकूल बुवाई अवधि (15 जून - 10 जुलाई)',
        badge_color: 'green',
      },
      top_recommendation: topRec,
      comparison_matrix: comparisonList,
    };
  },

  /**
   * 2. Real-time What-If Sensitivity Simulator
   */
  async simulateWhatIf(payload: WhatIfPayload): Promise<WhatIfResponse> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/crop/what-if-simulate`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[API Service] What-If Simulation API fallback triggered:', e);
    }

    // Client fallback
    const topId = payload.candidate_crops && payload.candidate_crops[0] ? payload.candidate_crops[0] : 'SOYBEAN';
    const c = MASTER_CROP_MAP[topId] || MASTER_CROP_MAP['SOYBEAN'];
    const rainPenalty = (payload.rainfall_deficit_pct || 0) < 0 ? (Math.abs(payload.rainfall_deficit_pct || 0) / 100) * 0.4 : 0;
    const simYield = parseFloat((c.expected_yield_qtl_per_acre * (1 - rainPenalty)).toFixed(1));
    const simPrice = Math.round(c.forecasted_mandi_price_inr_per_qtl * (1 + (payload.mandi_price_shock_pct || 0) / 100));
    const simProfit = Math.round(simYield * simPrice - c.total_cost_inr_per_acre);

    return {
      status: 'success',
      simulation_results: {
        alert_message: `${c.crop_name_hi} फसल प्रतिकूल मौसम में भी सुरक्षित लाभ सुनिश्चित करती है।`,
        updated_top_crop: topId,
        updated_profit_inr_per_acre: simProfit,
        resilience_rating: 'उच्च प्रतिरोधक क्षमता',
      },
    };
  },

  /**
   * 3. Fetch 120-Day Crop Action Calendar
   */
  async getCropCalendar(cropId: string, sowingDate: string): Promise<CropCalendarResponse | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/crop/crop-calendar?crop_id=${encodeURIComponent(cropId)}&sowing_date=${encodeURIComponent(sowingDate)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[API Service] Crop Calendar API fallback triggered:', e);
    }
    return null;
  },

  /**
   * 4. Fetch Farmer Analysis History from Database
   */
  async getFarmerHistory(farmerId?: string): Promise<SavedHistoryItem[]> {
    try {
      const url = farmerId
        ? `${API_BASE_URL}/farmer/${encodeURIComponent(farmerId)}/history`
        : `${API_BASE_URL}/farmer/history`;
      const res = await fetchWithTimeout(url);
      if (res.ok) {
        const data = await res.json();
        return data.history || [];
      }
    } catch (e) {
      console.warn('[API Service] History API fallback triggered:', e);
    }
    return [];
  },

  /**
   * 5. Fetch Recent Analysis for Dashboard
   */
  async getRecentAnalysis(farmerId?: string): Promise<SavedHistoryItem | null> {
    try {
      const url = `${API_BASE_URL}/farmer/recent-analysis${farmerId ? `?farmer_id=${encodeURIComponent(farmerId)}` : ''}`;
      const res = await fetchWithTimeout(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[API Service] Recent analysis API fallback triggered:', e);
    }
    return null;
  },

  /**
   * 6. Save Analysis to Database
   */
  async saveAnalysis(payload: {
    farmer_id?: string;
    planned_sowing_date: string;
    total_land_acres: number;
    soil_type: string;
    water_source: string;
    top_recommended_crop: string;
    expected_yield_qtl_per_acre: number;
    total_cost_per_acre: number;
    expected_profit_per_acre: number;
    match_score: number;
  }): Promise<boolean> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/farmer/save-analysis`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (e) {
      console.warn('[API Service] Save analysis API error:', e);
      return false;
    }
  },

  /**
   * 7. Fetch Master Crops with CACP Benchmark Economics
   */
  async getMasterCrops(): Promise<any[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/crop/master-crops`);
      if (res.ok) {
        const data = await res.json();
        return data.crops || [];
      }
    } catch (e) {
      console.warn('[API Service] Master Crops API fallback triggered:', e);
    }
    return Object.values(MASTER_CROP_MAP);
  },
};
