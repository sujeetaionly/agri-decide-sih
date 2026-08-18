export interface LocalizedSoilInfo {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
    raj: string;
  };
  waterRetention: string;
  description: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
    raj: string;
  };
  suitableCrops: string[];
  imageUrl: string;
}

export const soilTypesList: LocalizedSoilInfo[] = [
  {
    id: 'BLACK',
    name: {
      en: 'Black Soil (Regur)',
      hi: 'काली मिट्टी (रेगुर)',
      mr: 'काळी माती (रेगूर)',
      gu: 'કાળી જમીન (રેગુર)',
      raj: 'काली माटी (रेगुर)',
    },
    waterRetention: 'उच्च (High)',
    description: {
      en: 'Deep black fertile soil with high moisture retention capacity. Best suited for Cotton, Soybean, Gram, and Wheat.',
      hi: 'गहरी काली उपजाऊ मिट्टी, नमी बनाए रखने में सर्वोत्तम। कपास, सोयाबीन, चना व गेहूं के लिए सबसे उपयुक्त।',
      mr: 'ओलावा टिकवून ठेवणारी खोल काळी सुपीक माती. कापूस, सोयाबीन, हरभरा व गहू पिकासाठी सर्वोत्तम.',
      gu: 'ભેજ જાળવી રાખવાની ઉત્તમ ક્ષમતા ધરાવતી ફળદ્રુપ કાળી જમીન. કપાસ, સોયાબીન અને ચણા માટે શ્રેષ્ઠ.',
      raj: 'गहरी काली उपजाऊ माटी, नमी राखबा में सबसूं चोखी। कपास, सोयाबीन, चना अर गेहूं सारू उत्तम।',
    },
    suitableCrops: ['सोयाबीन', 'कपास', 'चना', 'गेहूं'],
    imageUrl: '/assets/soils/black_soil.jpg',
  },
  {
    id: 'LOAM',
    name: {
      en: 'Loam Soil (Alluvial)',
      hi: 'दोमट मिट्टी (कछारी)',
      mr: 'गाळाची / दुमट माती',
      gu: 'ગોરાડુ / કાંપવાળી જમીન',
      raj: 'दोमट / कछारी माटी',
    },
    waterRetention: 'मध्यम-उच्च (Optimal)',
    description: {
      en: 'Crumbly, balanced organic soil with excellent aeration and drainage. Ideal for Maize, Wheat, Pulses, and Vegetables.',
      hi: 'भुरभुरी और सबसे उपजाऊ मिट्टी। संतुलित जल निकास, मक्का, गेहूं, दलहन व सब्जियों के लिए उत्तम।',
      mr: 'सेंद्रिय घटकांनी समृद्ध भुसभुशीत सुपीक माती. मका, गहू, कडधान्ये व भाजीपाल्यासाठी उत्तम.',
      gu: 'ઉત્તમ ડ્રેનેજ અને પોષક તત્વો ધરાવતી સૌથી ફળદ્રુપ જમીન. મકાઈ, ઘઉં અને કઠોળ માટે આદર્શ.',
      raj: 'भुरभुरी अर सबसूं उपजाऊ माटी। मक्का, गेहूं, दाल अर सब्जियां सारू उत्तम।',
    },
    suitableCrops: ['मक्का', 'गेहूं', 'मूंग', 'सब्जियां'],
    imageUrl: '/assets/soils/loam_soil.jpg',
  },
  {
    id: 'RED',
    name: {
      en: 'Red & Yellow Soil',
      hi: 'लाल और पीली मिट्टी',
      mr: 'तांबडी / लाल माती',
      gu: 'રાતી / લાલ જમીન',
      raj: 'लाल अर पीली माटी',
    },
    waterRetention: 'मध्यम (Moderate)',
    description: {
      en: 'Iron-rich porous soil with good drainage. Excellent for Groundnut, Bajra, Moong, and Oilseeds.',
      hi: 'लौह तत्व से भरपूर भुरभुरी लाल मिट्टी। मूंगफली, बाजरा, मूंग व तिलहन फसलों के लिए विशेष अनुकूल।',
      mr: 'लोहयुक्त सच्छिद्र तांबडी माती. भुईमूग, बाजरी, मूग आणि तेलबिया पिकांसाठी उपयुक्त.',
      gu: 'આયર્નથી ભરપૂર છિદ્રાળુ જમીન. મગફળી, બાજરી અને મગના પાક માટે અનુકૂળ.',
      raj: 'लोहे सूं भरपूर भुरभुरी लाल माटी। मूंगफली, बाजरा, मूंग अर तिलहन सारू चोखी।',
    },
    suitableCrops: ['मूंगफली', 'बाजरा', 'मूंग', 'तिल'],
    imageUrl: '/assets/soils/red_soil.jpg',
  },
  {
    id: 'SANDY',
    name: {
      en: 'Sandy / Arid Soil',
      hi: 'बलुई / रेतीली मिट्टी',
      mr: 'वाळूमिश्रित / हलकी माती',
      gu: 'રેતાળ જમીન',
      raj: 'रेतीली / बलुई माटी',
    },
    waterRetention: 'कम (Low)',
    description: {
      en: 'Light texture soil with fast water drainage. Ideal for drought-hardy crops like Bajra, Guar, and Moth Bean.',
      hi: 'हल्की और तुरंत जल निकास वाली मिट्टी। कम बारिश में बाजरा, ग्वार व मोठ जैसी सूखा-सहनशील फसलों के लिए उपयुक्त।',
      mr: 'पाण्याचा निचरा जलद होणारी हलकी माती. बाजरी, गवार व कमी पाण्याच्या पिकांसाठी योग्य.',
      gu: 'ઝડપી પાણી નિતાર ધરાવતી હલકી જમીન. બાજરી, ગુવાર અને ઓછા પાણીના પાક માટે શ્રેષ્ઠ.',
      raj: 'हल्की अर झटपट पाणी निकास वाली माटी। कम बारिश में बाजरा, ग्वार अर मोठ सारू सबसूं उत्तम।',
    },
    suitableCrops: ['बाजरा', 'ग्वार', 'मूंग', 'मोठ'],
    imageUrl: '/assets/soils/sandy_soil.jpg',
  },
  {
    id: 'CLAY',
    name: {
      en: 'Clayey Soil',
      hi: 'चिकनी मिट्टी (मटियार)',
      mr: 'चिकण माती',
      gu: 'ચીકણી જમીન',
      raj: 'चिकणी माटी (मटियार)',
    },
    waterRetention: 'अत्यधिक (Very High)',
    description: {
      en: 'Heavy, dense soil with very high water-holding capacity. Best suited for Paddy (Rice), Mustard, and Wheat with good drainage.',
      hi: 'महीन कणों वाली भारी मिट्टी, पानी को लंबे समय तक रोकती है। धान, सरसों और गेहूं के लिए उपयुक्त।',
      mr: 'पाणी जास्त काळ धरून ठेवणारी जड माती. भात (धान), मोहरी व गहू पिकांसाठी अनुकूल.',
      gu: 'ભારે ભેજ સંગ્રહ ક્ષમતા ધરાવતી માટી. ડાંગર, સરસવ અને ઘઉં માટે ઉત્તમ.',
      raj: 'बारीक कणां री भारी माटी, पाणी ने घणे टेम तक राखे। धान, रायड़ो (सरसों) अर गेहूं सारू चोखी।',
    },
    suitableCrops: ['धान', 'सरसों', 'गेहूं', 'चना'],
    imageUrl: '/assets/soils/clay_soil.jpg',
  },
];
