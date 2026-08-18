export interface LocalizedSoilInfo {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
  };
  waterRetention: string;
  description: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
  };
  suitableCrops: string[];
  imageUrl: string;
}

// Ultra-reliable, rich photographic SVG textures that render instant realistic soil patterns
const createSoilSvgUrl = (bgColor: string, accentColor: string, label: string, crackColor?: string) => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340">
  <defs>
    <radialGradient id="soilGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${bgColor}" />
      <stop offset="100%" stop-color="${accentColor}" />
    </radialGradient>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.45 0"/>
      <feBlend mode="multiply" in="SourceGraphic" />
    </filter>
  </defs>
  <rect width="600" height="340" fill="url(#soilGrad)" />
  <rect width="600" height="340" filter="url(#noise)" opacity="0.65" />
  ${crackColor ? `
  <path d="M 50 120 Q 150 180 280 140 T 450 220 T 580 170" stroke="${crackColor}" stroke-width="3" fill="none" opacity="0.5"/>
  <path d="M 120 40 Q 200 130 180 260 T 320 310" stroke="${crackColor}" stroke-width="2.5" fill="none" opacity="0.4"/>
  <path d="M 380 30 Q 360 160 480 280" stroke="${crackColor}" stroke-width="2.5" fill="none" opacity="0.4"/>
  ` : ''}
  <!-- Overlay Vignette & Badge -->
  <rect width="600" height="340" fill="black" opacity="0.15" />
  <g transform="translate(24, 280)">
    <rect width="180" height="36" rx="18" fill="rgba(0,0,0,0.55)" backdrop-filter="blur(8px)"/>
    <text x="90" y="23" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">
      ${label}
    </text>
  </g>
</svg>
`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const soilTypesList: LocalizedSoilInfo[] = [
  {
    id: 'BLACK',
    name: {
      en: 'Black Soil (Regur)',
      hi: 'काली मिट्टी (रेगुर)',
      mr: 'काळी माती (रेगूर)',
      gu: 'કાળી જમીન (રેગુર)',
    },
    waterRetention: 'उच्च (High)',
    description: {
      en: 'Deep black fertile soil with high moisture retention capacity. Best suited for Cotton, Soybean, Gram, and Wheat.',
      hi: 'गहरी काली उपजाऊ मिट्टी, नमी बनाए रखने में सर्वोत्तम। कपास, सोयाबीन, चना व गेहूं के लिए सबसे उपयुक्त।',
      mr: 'ओलावा टिकवून ठेवणारी खोल काळी सुपीक माती. कापूस, सोयाबीन, हरभरा व गहू पिकासाठी सर्वोत्तम.',
      gu: 'ભેજ જાળવી રાખવાની ઉત્તમ ક્ષમતા ધરાવતી ફળદ્રુપ કાળી જમીન. કપાસ, સોયાબીન અને ચણા માટે શ્રેષ્ઠ.',
    },
    suitableCrops: ['सोयाबीन', 'कपास', 'चना', 'गेहूं'],
    imageUrl: createSoilSvgUrl('#1c1c1c', '#0d0d0d', 'काली मिट्टी (Black Soil)', '#383838'),
  },
  {
    id: 'LOAM',
    name: {
      en: 'Loam Soil (Alluvial)',
      hi: 'दोमट मिट्टी (कछारी)',
      mr: 'गाळाची / दुमट माती',
      gu: 'ગોરાડુ / કાંપવાળી જમીન',
    },
    waterRetention: 'मध्यम-उच्च (Optimal)',
    description: {
      en: 'Crumbly, balanced organic soil with excellent aeration and drainage. Ideal for Maize, Wheat, Pulses, and Vegetables.',
      hi: 'भुरभुरी और सबसे उपजाऊ मिट्टी। संतुलित जल निकास, मक्का, गेहूं, दलहन व सब्जियों के लिए उत्तम।',
      mr: 'सेंद्रिय घटकांनी समृद्ध भुसभुशीत सुपीक माती. मका, गहू, कडधान्ये व भाजीपाल्यासाठी उत्तम.',
      gu: 'ઉત્તમ ડ્રેનેજ અને પોષક તત્વો ધરાવતી સૌથી ફળદ્રુપ જમીન. મકાઈ, ઘઉં અને કઠોળ માટે આદર્શ.',
    },
    suitableCrops: ['मक्का', 'गेहूं', 'मूंग', 'सब्जियां'],
    imageUrl: createSoilSvgUrl('#5c3e21', '#382210', 'दोमट मिट्टी (Loam Soil)', '#78502c'),
  },
  {
    id: 'RED',
    name: {
      en: 'Red & Yellow Soil',
      hi: 'लाल और पीली मिट्टी',
      mr: 'तांबडी / लाल माती',
      gu: 'રાતી / લાલ જમીન',
    },
    waterRetention: 'मध्यम (Moderate)',
    description: {
      en: 'Iron-rich porous soil with good drainage. Excellent for Groundnut, Bajra, Moong, and Oilseeds.',
      hi: 'लौह तत्व से भरपूर भुरभुरी लाल मिट्टी। मूंगफली, बाजरा, मूंग व तिलहन फसलों के लिए विशेष अनुकूल।',
      mr: 'लोहयुक्त सच्छिद्र तांबडी माती. भुईमूग, बाजरी, मूग आणि तेलबिया पिकांसाठी उपयुक्त.',
      gu: 'આયર્નથી ભરપૂર છિદ્રાળુ જમીન. મગફળી, બાજરી અને મગના પાક માટે અનુકૂળ.',
    },
    suitableCrops: ['मूंगफली', 'बाजरा', 'मूंग', 'तिल'],
    imageUrl: createSoilSvgUrl('#9e2a2b', '#540b0e', 'लाल मिट्टी (Red Soil)', '#bf4342'),
  },
  {
    id: 'SANDY',
    name: {
      en: 'Sandy / Arid Soil',
      hi: 'बलुई / रेतीली मिट्टी',
      mr: 'वाळूमिश्रित / हलकी माती',
      gu: 'રેતાળ જમીન',
    },
    waterRetention: 'कम (Low)',
    description: {
      en: 'Light texture soil with fast water drainage. Ideal for drought-hardy crops like Bajra, Guar, and Moth Bean.',
      hi: 'हल्की और तुरंत जल निकास वाली मिट्टी। कम बारिश में बाजरा, ग्वार व मोठ जैसी सूखा-सहनशील फसलों के लिए उपयुक्त।',
      mr: 'पाण्याचा निचरा जलद होणारी हलकी माती. बाजरी, गवार व कमी पाण्याच्या पिकांसाठी योग्य.',
      gu: 'ઝડપી પાણી નિતાર ધરાવતી હલકી જમીન. બાજરી, ગુવાર અને ઓછા પાણીના પાક માટે શ્રેષ્ઠ.',
    },
    suitableCrops: ['बाजरा', 'ग्वार', 'मूंग', 'मोठ'],
    imageUrl: createSoilSvgUrl('#c29b62', '#8c683b', 'बलुई मिट्टी (Sandy Soil)', '#dfb87c'),
  },
  {
    id: 'CLAY',
    name: {
      en: 'Clayey Soil',
      hi: 'चिकनी मिट्टी (मटियार)',
      mr: 'चिकण माती',
      gu: 'ચીકણી જમીન',
    },
    waterRetention: 'अत्यधिक (Very High)',
    description: {
      en: 'Heavy, dense soil with very high water-holding capacity. Best suited for Paddy (Rice), Mustard, and Wheat with good drainage.',
      hi: 'महीन कणों वाली भारी मिट्टी, पानी को लंबे समय तक रोकती है। धान, सरसों और गेहूं के लिए उपयुक्त।',
      mr: 'पाणी जास्त काळ धरून ठेवणारी जड माती. भात (धान), मोहरी व गहू पिकांसाठी अनुकूल.',
      gu: 'ભારે ભેજ સંગ્રહ ક્ષમતા ધરાવતી માટી. ડાંગર, સરસવ અને ઘઉં માટે ઉત્તમ.',
    },
    suitableCrops: ['धान', 'सरसों', 'गेहूं', 'चना'],
    imageUrl: createSoilSvgUrl('#4a3728', '#2b1e15', 'चिकनी मिट्टी (Clay Soil)', '#694f3a'),
  },
];
