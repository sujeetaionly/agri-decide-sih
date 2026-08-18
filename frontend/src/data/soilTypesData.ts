export interface SoilTypeData {
  id: string; // 'BLACK', 'LOAM', 'RED', 'SANDY', 'CLAY'
  code: string;
  name: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
  };
  description: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
  };
  suitableCrops: string[];
  imageUrl: string;
  badgeColor: string;
  waterRetention: string;
}

export const soilTypesList: SoilTypeData[] = [
  {
    id: 'BLACK',
    code: 'BLACK',
    name: {
      en: 'Black Soil (Regur)',
      hi: 'काली मिट्टी',
      mr: 'काळी माती',
      gu: 'કાળી માટી',
    },
    description: {
      en: 'High moisture retention, ideal for Cotton, Soybean, Wheat & Gram.',
      hi: 'गहरी काली उपजाऊ मिट्टी, नमी बनाए रखने में सर्वोत्तम। कपास, सोयाबीन, चना हेतु उपयुक्त।',
      mr: 'ओलावा टिकवून ठेवणारी सुपीक काळी माती. कापूस, सोयाबीन, हरभरा यासाठी उत्तम.',
      gu: 'ભેજ જાળવી રાખતી કાળી જમીન. કપાસ, સોયાબીન, ચણા માટે શ્રેષ્ઠ.',
    },
    suitableCrops: ['सोयाबीन', 'कपास', 'चना', 'गेहूं'],
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'bg-stone-800 text-stone-100',
    waterRetention: 'उच्च (High)',
  },
  {
    id: 'LOAM',
    code: 'LOAM',
    name: {
      en: 'Loam Soil',
      hi: 'दोमट मिट्टी',
      mr: 'गाळाची / दुमट माती',
      gu: 'ગોરાડુ માટી',
    },
    description: {
      en: 'Balanced texture with excellent drainage and rich organic nutrients.',
      hi: 'भुरभुरी और सबसे उपजाऊ मिट्टी। मक्का, गेहूं, दलहन व सब्जियों के लिए उत्तम।',
      mr: 'सुपीक आणि भुसभुशीत माती. मका, गहू, कडधान्ये आणि भाजीपाल्यासाठी उत्कृष्ट.',
      gu: 'ફળદ્રુપ અને પોચી માટી. મકાઈ, ઘઉં અને શાકભાજી માટે શ્રેષ્ઠ.',
    },
    suitableCrops: ['मक्का', 'गेहूं', 'मूंग', 'टमाटर'],
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a49?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'bg-amber-900 text-amber-100',
    waterRetention: 'मध्यम (Medium)',
  },
  {
    id: 'RED',
    code: 'RED',
    name: {
      en: 'Red Soil',
      hi: 'लाल मिट्टी',
      mr: 'तांबडी माती',
      gu: 'લાલ માટી',
    },
    description: {
      en: 'Iron-rich porous soil, excellent for groundnut, pulses, and millets.',
      hi: 'लोह तत्व से भरपूर भुरभुरी मिट्टी। मूंगफली, बाजरा, मूंग व तिलहन के लिए अनुकूल।',
      mr: 'लोहयुक्त लाल माती. भुईमूग, बाजरी, मूग आणि कडधान्यांसाठी अनुकूल.',
      gu: 'લોહ તત્વ ધરાવતી લાલ માટી. મગફળી, બાજરી અને કઠોળ માટે અનુકૂળ.',
    },
    suitableCrops: ['मूंगफली', 'बाजरा', 'मूंग', 'सूरजमुखी'],
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'bg-red-800 text-red-100',
    waterRetention: 'मध्यम (Medium)',
  },
  {
    id: 'SANDY',
    code: 'SANDY',
    name: {
      en: 'Sandy Soil',
      hi: 'बलुई / रेतीली मिट्टी',
      mr: 'रेताड माती',
      gu: 'રેતાળ માટી',
    },
    description: {
      en: 'Quick-draining light soil, ideal for low water conditions and millets.',
      hi: 'हल्की और तुरंत जल निकास वाली मिट्टी। कम बारिश में बाजरा, ग्वार व मूंग के लिए उपयुक्त।',
      mr: 'हलकी आणि पाण्याचा निचरा होणारी माती. कमी पाण्यात बाजरी, मूग यासाठी योग्य.',
      gu: 'ઓછા વરસાદમાં બાજરી અને કઠોળ માટે ઉત્તમ રેતાળ જમીન.',
    },
    suitableCrops: ['बाजरा', 'मूंग', 'ग्वार', 'मूंगफली'],
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'bg-yellow-700 text-yellow-100',
    waterRetention: 'कम (Low)',
  },
  {
    id: 'CLAY',
    code: 'CLAY',
    name: {
      en: 'Clay Soil',
      hi: 'चिकनी मिट्टी',
      mr: 'चिकनमाती',
      gu: 'ચીકણી માટી',
    },
    description: {
      en: 'Dense, nutrient-dense soil with very high water-holding capacity.',
      hi: 'भारी और अधिक पानी रोकने वाली मिट्टी। धान (चावल), गेहूं व गन्ने के लिए उपयुक्त।',
      mr: 'जास्त पाणी धरून ठेवणारी चिकनमाती. भात, ऊस आणि गहू पिकांसाठी उपयुक्त.',
      gu: 'વધુ પાણી રોકી રાખતી ચીકણી માટી. ડાંગર અને શેરડી માટે અનુકૂળ.',
    },
    suitableCrops: ['धान', 'गन्ना', 'गेहूं'],
    imageUrl: 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'bg-emerald-900 text-emerald-100',
    waterRetention: 'अत्यधिक (Very High)',
  },
];
