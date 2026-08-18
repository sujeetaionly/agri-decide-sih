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
      en: 'Deep black fertile soil with high moisture and nutrient retention capacity.',
      hi: 'गहरी काली उपजाऊ मिट्टी, जिसमें नमी और पोषण लंबे समय तक बने रहते हैं।',
      mr: 'ओलावा आणि पोषण दीर्घकाळ टिकवून ठेवणारी खोल काळी सुपीक माती.',
      gu: 'ભેજ અને પોષક તત્વો લાંબા સમય સુધી જાળવી રાખવાની ઉચ્ચ ક્ષમતા ધરાવતી ફળદ્રુપ કાળી જમીન.',
      raj: 'गहरी काली उपजाऊ माटी, जिणमें नमी अर पोषण घणा दिनां तांई टिक्यो रहवै।',
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
      en: 'Crumbly, rich organic soil with balanced aeration, moisture, and excellent drainage.',
      hi: 'भुरभुरी, जीवांश से भरपूर मिट्टी। उत्तम जल निकास और हवा का संतुलित संचार।',
      mr: 'सेंद्रिय घटकांनी समृद्ध, भुसभुशीत माती. उत्तम निचरा आणि हवेचे योग्य संतुलन.',
      gu: 'સૌથી ફળદ્રુપ અને ભુરભુરી જમીન. સંતુલિત હવા અને ઉત્તમ પાણી નિકાલ વ્યવસ્થા.',
      raj: 'भुरभुरी अर जीवांश सूं भरपूर माटी। चोखो पाणी निकास अर हवा रो संतुलन।',
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
      en: 'Iron-rich porous red and yellow soil with quick water percolation.',
      hi: 'लौह तत्व से युक्त लाल-पीली मिट्टी। छिद्रयुक्त संरचना और त्वरित जल निकास।',
      mr: 'लोहयुक्त सच्छिद्र तांबडी माती. पाण्याचा जलद निचरा होणारी रचना.',
      gu: 'આયર્નથી ભરપૂર છિદ્રાળુ લાલ જમીન. પાણીનો ઝડપી નિકાલ.',
      raj: 'लोहे सूं भरपूर लाल-पीली माटी। छिद्रयुक्त अर झटपट पाणी निकास वाली।',
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
