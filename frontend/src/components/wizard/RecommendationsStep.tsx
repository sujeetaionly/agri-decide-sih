import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useWizard } from '@/context/WizardContext';
import { mockCrops } from '@/data/mockCrops';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AudioButton } from '@/components/common/AudioButton';
import { CropOption } from '@/types/crop';

export const RecommendationsStep: React.FC = () => {
  const { isHindi } = useLanguage();
  const { state, setSelectedCropId, nextStep } = useWizard();
  const [expandedCropId, setExpandedCropId] = useState<string | null>(null);

  const topCrop = mockCrops.find((c) => c.isTopRecommendation) || mockCrops[0];
  const alternativeCrops = mockCrops.filter((c) => !c.isTopRecommendation);

  const handleSelectCrop = (crop: CropOption) => {
    setSelectedCropId(crop.id);
    nextStep();
  };

  const toggleExpand = (id: string) => {
    setExpandedCropId(expandedCropId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            {isHindi ? 'आपकी सबसे उपयुक्त फसलें' : 'Your Best Crop Choices'}
          </h2>
          <AudioButton
            id="step4-recommendations-audio"
            textHi={`चरण 4: एआई ने आपकी मिट्टी और मौसम के आधार पर सबसे उपयुक्त फसल ${topCrop.nameHi} को चुना है, जिसका मैच स्कोर 94% है। नीचे दी गई जानकारी देखें और फसल का चयन करें।`}
            textEn={`Step 4: AI has selected ${topCrop.name} as your top recommendation with a 94% match score based on soil and monsoon analysis.`}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>{isHindi ? 'उच्च विश्वसनीयता (High Confidence)' : 'High Confidence'}</span>
          </Badge>
          <span className="text-xs text-on-surface-variant">
            {isHindi ? 'खरीफ 2026 मानसूनी डेटा प्रमाणित' : 'Verified with Kharif 2026 Data'}
          </span>
        </div>
      </div>

      {/* Top Pick Featured Hero Card (Scorecard) */}
      <Card className="overflow-hidden border-2 border-primary shadow-level-2 space-y-0">
        {/* Card Header Banner with Match Score */}
        <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-amber-300 fill">star</span>
            <span className="font-bold text-sm md:text-base tracking-wide uppercase">
              {isHindi ? 'सर्वश्रेष्ठ अनुशंसित फसल (Top Choice)' : 'Top AI Recommendation'}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs md:text-sm font-bold bg-secondary-container text-on-secondary-container">
            {topCrop.matchScore}% {isHindi ? 'उपयुक्तता' : 'Match'}
          </span>
        </div>

        {/* Hero Crop Details */}
        <div className="p-5 md:p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-on-surface">
                {isHindi ? topCrop.nameHi : topCrop.name}
              </h3>
              <p className="text-xs md:text-sm font-medium text-on-surface-variant italic">
                {topCrop.botanicalName}
              </p>
            </div>

            <img
              src={topCrop.image}
              alt={topCrop.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-outline-variant shadow-sm"
            />
          </div>

          {/* 4-Metric Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <div className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">psychology</span>
                <span>{isHindi ? 'अनुमानित पैदावार' : 'Expected Yield'}</span>
              </div>
              <div className="text-base md:text-lg font-bold text-on-surface">
                {isHindi ? topCrop.yieldPerAcreHi : topCrop.yieldPerAcre}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <div className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">payments</span>
                <span>{isHindi ? 'अनुमानित मुनाफा' : 'Estimated Profit'}</span>
              </div>
              <div className="text-base md:text-lg font-bold text-emerald-800">
                {isHindi ? topCrop.profitPerAcreHi : topCrop.profitPerAcre}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <div className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-sky-600">water_drop</span>
                <span>{isHindi ? 'पानी की जरूरत' : 'Water Need'}</span>
              </div>
              <div className="text-sm md:text-base font-bold text-on-surface">
                {isHindi ? topCrop.waterRequirementHi : topCrop.waterRequirement}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <div className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-amber-600">schedule</span>
                <span>{isHindi ? 'फसल अवधि' : 'Duration'}</span>
              </div>
              <div className="text-sm md:text-base font-bold text-on-surface">
                {isHindi ? topCrop.durationDaysHi : topCrop.durationDays}
              </div>
            </div>
          </div>

          {/* AI Rationale */}
          <div className="p-4 rounded-xl bg-primary-container/10 border border-primary/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              <span>{isHindi ? 'एआई चयन का कारण' : 'AI Recommendation Rationale'}</span>
            </div>
            <p className="text-xs md:text-sm text-on-surface leading-relaxed">
              {isHindi ? topCrop.rationaleHi : topCrop.rationaleEn}
            </p>
          </div>

          {/* Action Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => handleSelectCrop(topCrop)}
            className="min-h-[56px] text-base md:text-lg flex items-center justify-center gap-2"
          >
            <span>{isHindi ? 'इस फसल को चुनें और योजना बनाएं' : 'Select This Crop & View Plan'}</span>
            <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
          </Button>
        </div>
      </Card>

      {/* Alternative Options Section */}
      <div className="space-y-3 pt-2">
        <h4 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">format_list_bulleted</span>
          <span>{isHindi ? 'अन्य मजबूत विकल्प (Other Strong Options)' : 'Other Strong Options'}</span>
        </h4>

        <div className="space-y-3">
          {alternativeCrops.map((crop) => {
            const isExpanded = expandedCropId === crop.id;
            return (
              <Card
                key={crop.id}
                className="p-4 border-outline-variant/60 hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-12 h-12 rounded-xl object-cover border border-outline-variant/60"
                    />
                    <div>
                      <h5 className="font-bold text-base md:text-lg text-on-surface">
                        {isHindi ? crop.nameHi : crop.name}
                      </h5>
                      <p className="text-xs text-on-surface-variant">
                        {isHindi ? crop.profitPerAcreHi : crop.profitPerAcre} • {crop.durationDays}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-surface">
                      {crop.matchScore}%
                    </span>

                    <button
                      onClick={() => toggleExpand(crop.id)}
                      aria-label="Expand details"
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Expanded Accordion Body */}
                {isExpanded && (
                  <div className="pt-3 border-t border-outline-variant/40 space-y-3 animate-in fade-in">
                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      {isHindi ? crop.rationaleHi : crop.rationaleEn}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-surface-container-low">
                        <span className="text-on-surface-variant">{isHindi ? 'पैदावार: ' : 'Yield: '}</span>
                        <span className="font-bold text-on-surface">{isHindi ? crop.yieldPerAcreHi : crop.yieldPerAcre}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-surface-container-low">
                        <span className="text-on-surface-variant">{isHindi ? 'पानी: ' : 'Water: '}</span>
                        <span className="font-bold text-on-surface">{isHindi ? crop.waterRequirementHi : crop.waterRequirement}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={() => handleSelectCrop(crop)}
                      className="min-h-[48px] text-sm md:text-base font-bold"
                    >
                      {isHindi ? `यह फसल चुनें (${crop.nameHi})` : `Select ${crop.name}`}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
