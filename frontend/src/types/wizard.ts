export type LandUnit = 'ACRE' | 'BIGHA' | 'GUNTHA';
export type SoilType = 'BLACK' | 'LOAM' | 'RED' | 'SANDY' | 'CLAY';
export type WaterCapacity = 'HIGH' | 'MEDIUM' | 'LOW';
export type WaterSource = 'CANAL' | 'WELL' | 'BOREWELL' | 'RAINFED';
export type CropSeason = 'KHARIF' | 'RABI' | 'ZAID';

export interface FarmQuestionnaireState {
  landAcres: number | null;
  landUnit: LandUnit;
  soilType: SoilType | string | null;
  waterCapacity: WaterCapacity | string | null;
  waterSource: WaterSource | string | null;
  previousCrop: string | null;
  previousCrops: string[];
  intendedCrops: string[];
  season: CropSeason | string | null;
  plannedSowingDate: string | null;
}

export interface WhatIfSimulationState {
  rainfallOffset: number; // -50% to +50%
  priceOffset: number; // -30% to +30%
}

