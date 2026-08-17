import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useWizard } from '@/context/WizardContext';
import { mockLocations } from '@/data/mockLocations';
import { Card } from '@/components/ui/card';
import { AudioButton } from '@/components/common/AudioButton';

export const LocationStep: React.FC = () => {
  const { isHindi } = useLanguage();
  const { state, updateLocation } = useWizard();
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const selectedStateData = mockLocations.find((s) => s.state === state.location.state) || mockLocations[0];
  const selectedDistrictData = selectedStateData.districts.find((d) => d.district === state.location.district) || selectedStateData.districts[0];

  const handleGpsDetect = () => {
    setIsDetectingGps(true);
    setTimeout(() => {
      updateLocation({
        state: 'Rajasthan',
        district: 'Nagaur',
        tehsil: 'Merta',
        isAutoDetected: true,
        detectedName: 'Merta (26.65° N, 74.03° E), Nagaur, Rajasthan',
      });
      setIsDetectingGps(false);
    }, 1200);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    const sData = mockLocations.find((s) => s.state === newState) || mockLocations[0];
    const newDistrict = sData.districts[0].district;
    const newTehsil = sData.districts[0].tehsils[0].tehsil;
    updateLocation({
      state: newState,
      district: newDistrict,
      tehsil: newTehsil,
      isAutoDetected: false,
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value;
    const dData = selectedStateData.districts.find((d) => d.district === newDistrict) || selectedStateData.districts[0];
    const newTehsil = dData.tehsils[0].tehsil;
    updateLocation({
      district: newDistrict,
      tehsil: newTehsil,
      isAutoDetected: false,
    });
  };

  const handleTehsilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLocation({
      tehsil: e.target.value,
      isAutoDetected: false,
    });
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header & Audio Helper */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            {isHindi ? 'आपका खेत कहाँ स्थित है?' : 'Where is your farm?'}
          </h2>
          <AudioButton
            id="step1-location-audio"
            textHi="चरण 1: अपने खेत का स्थान बताएं। आप जीपीएस बटन दबाकर स्वतः स्थान चुन सकते हैं या नीचे दिए गए ड्रॉपडाउन से राज्य, जिला और तहसील चुन सकते हैं।"
            textEn="Step 1: Provide your farm location. Tap Use My Location for automatic GPS detection or select your state, district, and tehsil below."
          />
        </div>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          {isHindi
            ? 'सटीक स्थान से स्थानीय मानसूनी बारिश और मिट्टी का सही मिलान होता है।'
            : 'Accurate location ensures localized rainfall prediction and soil matching.'}
        </p>
      </div>

      {/* GPS Auto-Detect Button Card */}
      <Card
        onClick={handleGpsDetect}
        className={`p-5 cursor-pointer border-2 transition-all btn-tactile ${
          state.location.isAutoDetected
            ? 'border-primary bg-primary-container/10 ring-2 ring-primary/20 shadow-level-2'
            : 'border-outline-variant hover:border-primary/60 bg-surface-container-lowest'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
              state.location.isAutoDetected
                ? 'bg-primary text-on-primary'
                : 'bg-primary-container/20 text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[30px] ${
                isDetectingGps ? 'animate-spin' : ''
              }`}
            >
              {isDetectingGps ? 'sync' : 'my_location'}
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base md:text-lg text-on-surface">
                {isHindi ? 'मेरा स्थान स्वतः पता करें (GPS)' : 'Use My Location (GPS)'}
              </h3>
              {state.location.isAutoDetected && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-on-primary">
                  {isHindi ? 'पहचान पूर्ण' : 'Detected'}
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-on-surface-variant">
              {isDetectingGps
                ? isHindi
                  ? 'स्थान खोज रहे हैं...'
                  : 'Detecting GPS coordinates...'
                : state.location.isAutoDetected
                ? state.location.detectedName
                : isHindi
                ? 'जीपीएस द्वारा अपने गांव और जिले की स्वतः पहचान करें।'
                : 'Use GPS to automatically detect village, tehsil, and district.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-outline-variant/60" />
        <span className="text-xs font-bold tracking-wider text-on-surface-variant/80 uppercase">
          {isHindi ? 'या नीचे दिए विकल्पों से चुनें' : 'OR SELECT MANUALLY'}
        </span>
        <div className="flex-1 h-px bg-outline-variant/60" />
      </div>

      {/* Manual Dropdowns */}
      <div className="space-y-4">
        {/* State Select */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-on-surface">
            {isHindi ? 'राज्य (State)' : 'State'}
          </label>
          <div className="relative">
            <select
              value={state.location.state}
              onChange={handleStateChange}
              className="w-full h-14 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 text-base font-semibold text-on-surface appearance-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {mockLocations.map((s) => (
                <option key={s.state} value={s.state}>
                  {isHindi ? `${s.stateHi} (${s.state})` : s.state}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-4 text-on-surface-variant pointer-events-none">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* District Select */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-on-surface">
            {isHindi ? 'जिला (District)' : 'District'}
          </label>
          <div className="relative">
            <select
              value={state.location.district}
              onChange={handleDistrictChange}
              className="w-full h-14 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 text-base font-semibold text-on-surface appearance-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {selectedStateData.districts.map((d) => (
                <option key={d.district} value={d.district}>
                  {isHindi ? `${d.districtHi} (${d.district})` : d.district}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-4 text-on-surface-variant pointer-events-none">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Tehsil Select */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-on-surface">
            {isHindi ? 'तहसील / ब्लॉक (Sub-District / Tehsil)' : 'Sub-District / Tehsil'}
          </label>
          <div className="relative">
            <select
              value={state.location.tehsil}
              onChange={handleTehsilChange}
              className="w-full h-14 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 text-base font-semibold text-on-surface appearance-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {selectedDistrictData.tehsils.map((t) => (
                <option key={t.tehsil} value={t.tehsil}>
                  {isHindi ? `${t.tehsilHi} (${t.tehsil})` : t.tehsil}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-4 text-on-surface-variant pointer-events-none">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      {/* Selected Location Confirmation Pill */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-[24px]">pin_drop</span>
        <div className="text-xs md:text-sm text-on-surface">
          <span className="font-bold">{isHindi ? 'चयनित क्षेत्र: ' : 'Selected Area: '}</span>
          <span>
            {state.location.tehsil}, {state.location.district}, {state.location.state}
          </span>
        </div>
      </div>
    </div>
  );
};
