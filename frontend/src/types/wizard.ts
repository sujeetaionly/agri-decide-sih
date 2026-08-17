export interface LocationData {
  state: string;
  district: string;
  tehsil: string;
  isAutoDetected?: boolean;
  latitude?: number;
  longitude?: number;
  detectedName?: string;
}

export type AreaUnit = 'Acres' | 'Hectares';

export type WaterAvailabilityLevel = 'Low' | 'Moderate' | 'High';

export interface FarmSoilData {
  area: number;
  unit: AreaUnit;
  soilType: string;
  soilNameHi: string;
  waterAvailability: WaterAvailabilityLevel;
  waterSource: string[];
}

export interface CropPreferencesData {
  sowingDate: string;
  preferredCrops: string[];
  voiceTranscript?: string;
}

export interface WhatIfSimulationData {
  rainfallOffset: number; // -50% to +50%
  priceFluctuation: number; // -30% to +30%
}

export interface WizardState {
  currentStep: number;
  location: LocationData;
  farmSoil: FarmSoilData;
  cropPreferences: CropPreferencesData;
  selectedCropId: string;
  whatIf: WhatIfSimulationData;
  isOfflineSaved: boolean;
}
