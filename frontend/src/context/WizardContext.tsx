import React, { createContext, useContext, useState, useEffect } from 'react';
import { WizardState, LocationData, FarmSoilData, CropPreferencesData, WhatIfSimulationData } from '@/types/wizard';
import { mockCrops } from '@/data/mockCrops';
import { CropOption } from '@/types/crop';

interface WizardContextType {
  state: WizardState;
  currentStep: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateLocation: (loc: Partial<LocationData>) => void;
  updateFarmSoil: (data: Partial<FarmSoilData>) => void;
  updateCropPreferences: (data: Partial<CropPreferencesData>) => void;
  setSelectedCropId: (cropId: string) => void;
  selectedCrop: CropOption;
  updateWhatIf: (data: Partial<WhatIfSimulationData>) => void;
  toggleOfflineSave: () => void;
  resetWizard: () => void;
}

const DEFAULT_STATE: WizardState = {
  currentStep: 1,
  location: {
    state: 'Rajasthan',
    district: 'Nagaur',
    tehsil: 'Merta',
    isAutoDetected: false,
    detectedName: 'Merta City, Nagaur, Rajasthan',
  },
  farmSoil: {
    area: 2.5,
    unit: 'Acres',
    soilType: 'sandy-loam',
    soilNameHi: 'बलुई दोमट मिट्टी',
    waterAvailability: 'Moderate',
    waterSource: ['Borewell', 'Rainfed'],
  },
  cropPreferences: {
    sowingDate: '2026-07-05',
    preferredCrops: ['Bajra', 'Moong'],
    voiceTranscript: '',
  },
  selectedCropId: 'bajra',
  whatIf: {
    rainfallOffset: 0,
    priceFluctuation: 0,
  },
  isOfflineSaved: true,
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WizardState>(() => {
    try {
      const saved = localStorage.getItem('krishi_wizard_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved wizard state:', e);
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem('krishi_wizard_state', JSON.stringify(state));
    } catch (e) {
      console.error('Error saving wizard state:', e);
    }
  }, [state]);

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 6) {
      setState((prev) => ({ ...prev, currentStep: step }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextStep = () => {
    goToStep(state.currentStep + 1);
  };

  const prevStep = () => {
    goToStep(state.currentStep - 1);
  };

  const updateLocation = (loc: Partial<LocationData>) => {
    setState((prev) => ({
      ...prev,
      location: { ...prev.location, ...loc },
    }));
  };

  const updateFarmSoil = (data: Partial<FarmSoilData>) => {
    setState((prev) => ({
      ...prev,
      farmSoil: { ...prev.farmSoil, ...data },
    }));
  };

  const updateCropPreferences = (data: Partial<CropPreferencesData>) => {
    setState((prev) => ({
      ...prev,
      cropPreferences: { ...prev.cropPreferences, ...data },
    }));
  };

  const setSelectedCropId = (cropId: string) => {
    setState((prev) => ({
      ...prev,
      selectedCropId: cropId,
    }));
  };

  const updateWhatIf = (data: Partial<WhatIfSimulationData>) => {
    setState((prev) => ({
      ...prev,
      whatIf: { ...prev.whatIf, ...data },
    }));
  };

  const toggleOfflineSave = () => {
    setState((prev) => ({
      ...prev,
      isOfflineSaved: !prev.isOfflineSaved,
    }));
  };

  const resetWizard = () => {
    setState(DEFAULT_STATE);
  };

  const selectedCrop = mockCrops.find((c) => c.id === state.selectedCropId) || mockCrops[0];

  return (
    <WizardContext.Provider
      value={{
        state,
        currentStep: state.currentStep,
        goToStep,
        nextStep,
        prevStep,
        updateLocation,
        updateFarmSoil,
        updateCropPreferences,
        setSelectedCropId,
        selectedCrop,
        updateWhatIf,
        toggleOfflineSave,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
