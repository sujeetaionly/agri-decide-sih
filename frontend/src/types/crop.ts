export interface CropMilestone {
  day: number;
  stageName: string;
  stageNameHi: string;
  action: string;
  actionHi: string;
  audioPromptEn: string;
  audioPromptHi: string;
  tag: string;
  completed?: boolean;
  notes?: string;
  notesHi?: string;
}

export interface CropOption {
  id: string;
  name: string;
  nameHi: string;
  botanicalName?: string;
  matchScore: number;
  isTopRecommendation?: boolean;
  confidence: 'High' | 'Medium' | 'Low';
  image: string;
  yieldPerAcre: string;
  yieldPerAcreHi: string;
  profitPerAcre: string;
  profitPerAcreHi: string;
  waterRequirement: string;
  waterRequirementHi: string;
  durationDays: string;
  durationDaysHi: string;
  season: string;
  seasonHi: string;
  rationaleEn: string;
  rationaleHi: string;
  soilSuitability: string[];
  rainfallResilience: string;
  rainfallResilienceHi: string;
  milestones: CropMilestone[];
}
