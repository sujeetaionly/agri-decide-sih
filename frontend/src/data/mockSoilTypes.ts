export interface SoilTypeOption {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  iconName: string;
  recommendedCrops: string[];
  waterRetention: 'Low' | 'Medium' | 'High';
  waterRetentionHi: 'कम' | 'मध्यम' | 'अधिक';
}

export const mockSoilTypes: SoilTypeOption[] = [
  {
    id: 'sandy-loam',
    name: 'Sandy Loam',
    nameHi: 'बलुई दोमट मिट्टी',
    description: 'Light, well-drained soil ideal for arid regions. Responds well to quick-growing millets and pulses.',
    descriptionHi: 'हल्की, भुरभुरी और उत्तम जल निकास वाली मिट्टी। बाजरा, मूंग और मूंगफली के लिए सर्वोत्तम।',
    iconName: 'grain',
    recommendedCrops: ['Pearl Millet (Bajra)', 'Moong', 'Groundnut'],
    waterRetention: 'Low',
    waterRetentionHi: 'कम',
  },
  {
    id: 'alluvial',
    name: 'Alluvial Soil',
    nameHi: 'जलोढ़ (दोमट) मिट्टी',
    description: 'Highly fertile, rich in potash and minerals. Suitable for almost all field crops and vegetables.',
    descriptionHi: 'अत्यधिक उपजाऊ मिट्टी जो पोटाश और खनिजों से भरपूर होती है। सभी फसलों के लिए उपयोगी।',
    iconName: 'landscape',
    recommendedCrops: ['Wheat', 'Maize', 'Mustard', 'Moong'],
    waterRetention: 'Medium',
    waterRetentionHi: 'मध्यम',
  },
  {
    id: 'black-soil',
    name: 'Black Soil (Regur)',
    nameHi: 'काली (रेगुर) मिट्टी',
    description: 'Clay-rich with exceptional moisture retention. Highly suitable for cotton, soybean, and pulses.',
    descriptionHi: 'चिपचिपी और नमी सोखने की तीव्र क्षमता वाली मिट्टी। कपास, सोयाबीन और चना हेतु उत्तम।',
    iconName: 'terrain',
    recommendedCrops: ['Cotton', 'Soybean', 'Gram', 'Wheat'],
    waterRetention: 'High',
    waterRetentionHi: 'अधिक',
  },
  {
    id: 'red-yellow',
    name: 'Red & Yellow Soil',
    nameHi: 'लाल व पीली मिट्टी',
    description: 'Porous with rich iron oxides. Performs excellently with proper organic fertilizer and irrigation.',
    descriptionHi: 'लोहे के ऑक्साइड से युक्त भुरभुरी मिट्टी। जैविक खाद और संतुलित पानी के साथ अच्छी उपज।',
    iconName: 'layers',
    recommendedCrops: ['Groundnut', 'Millets', 'Pulses'],
    waterRetention: 'Medium',
    waterRetentionHi: 'मध्यम',
  },
];
