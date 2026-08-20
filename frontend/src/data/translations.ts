export type SupportedLanguage = 'hi' | 'mr' | 'gu' | 'raj' | 'en';

export interface LanguageMeta {
  code: SupportedLanguage | string;
  nativeName: string;
  englishName: string;
  glyph: string;
  audioLabel: string;
  sampleAudio: string;
  continueAudioPrompt: string;
  states: string[];
  aliases?: string[];
}

export const LANGUAGE_REGISTRY: Record<string, LanguageMeta> = {
  hi: {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    glyph: 'अ',
    audioLabel: 'सुनें',
    sampleAudio: 'हिंदी में जारी रखने के लिए यह विकल्प चुनें।',
    continueAudioPrompt: 'हिंदी में जारी रखने के लिए यह विकल्प चुनें।',
    states: ['Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Haryana', 'Bihar', 'Delhi'],
    aliases: ['hindi', 'हिन्दी', 'हिंदी', 'hindustani', 'उत्तर प्रदेश', 'राजस्थान', 'मध्य प्रदेश', 'बिहार', 'हरियाणा'],
  },
  en: {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    glyph: 'A',
    audioLabel: 'Listen',
    sampleAudio: 'Choose this option to continue in English.',
    continueAudioPrompt: 'Choose this option to continue in English.',
    states: ['All'],
    aliases: ['english', 'inglis', 'अंग्रेजी', 'इंग्लिश', 'angreji'],
  },
  raj: {
    code: 'raj',
    nativeName: 'राजस्थानी',
    englishName: 'Rajasthani',
    glyph: 'रा',
    audioLabel: 'सुणो',
    sampleAudio: 'राजस्थानी में आगे बढ़बा सारू यो विकल्प चुणो।',
    continueAudioPrompt: 'राजस्थानी में आगे बढ़बा सारू यो विकल्प चुणो।',
    states: ['Rajasthan'],
    aliases: ['rajasthani', 'rajastani', 'राजस्थानी', 'मारवाड़ी', 'marwari', 'mewari', 'ढूंढाड़ी', 'राजस्थान'],
  },
  mr: {
    code: 'mr',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    glyph: 'म',
    audioLabel: 'ऐका',
    sampleAudio: 'मराठीत पुढे जाण्यासाठी हा पर्याय निवडा.',
    continueAudioPrompt: 'मराठीत पुढे जाण्यासाठी हा पर्याय निवडा.',
    states: ['Maharashtra'],
    aliases: ['marathi', 'marati', 'मराठी', 'महाराष्ट्र', 'maharashtra'],
  },
  gu: {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    englishName: 'Gujarati',
    glyph: 'ગ',
    audioLabel: 'સાંભળો',
    sampleAudio: 'ગુજરાતીમાં આગળ વધવા માટે આ વિકલ્પ પસંદ કરો.',
    continueAudioPrompt: 'ગુજરાતીમાં આગળ વધવા માટે આ विकल्प પસંદ કરો.',
    states: ['Gujarat'],
    aliases: ['gujarati', 'gujrati', 'ગુજરાતી', 'गुजराती', 'गुजरात', 'gujarat'],
  },
  pa: {
    code: 'pa',
    nativeName: 'ਪੰਜਾਬੀ',
    englishName: 'Punjabi',
    glyph: 'ਪੰ',
    audioLabel: 'ਸੁਣੋ',
    sampleAudio: 'ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਰੀ ਰੱਖਣ ਲਈ ਇਹ ਵਿਕਲਪ ਚੁਣੋ।',
    continueAudioPrompt: 'ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਰੀ ਰੱਖਣ ਲਈ ਇਹ ਵਿਕਲਪ ਚੁਣੋ।',
    states: ['Punjab', 'Haryana'],
    aliases: ['punjabi', 'panjabi', 'ਪੰਜਾਬੀ', 'पंजाबी', 'पंजाब', 'punjab'],
  },
  bn: {
    code: 'bn',
    nativeName: 'বাংলা',
    englishName: 'Bengali',
    glyph: 'বাं',
    audioLabel: 'শুনুন',
    sampleAudio: 'বাংলায় চালিয়ে যেতে এই বিকল্পটি বেছে নিন।',
    continueAudioPrompt: 'বাংলায় চালিয়ে যেতে এই विकल्पটি বেছে নিন।',
    states: ['West Bengal', 'Tripura'],
    aliases: ['bengali', 'bangla', 'বাংলা', 'बंगाली', 'बंगाल', 'west bengal'],
  },
  te: {
    code: 'te',
    nativeName: 'తెలుగు',
    englishName: 'Telugu',
    glyph: 'తె',
    audioLabel: 'వినండి',
    sampleAudio: 'తెలుగులో కొనసాగడానికి ఈ ఎంపికను ఎంచుకోండి.',
    continueAudioPrompt: 'తెలుగులో కొనసాగడానికి ఈ ఎంపికను ఎంచుకోండి.',
    states: ['Andhra Pradesh', 'Telangana'],
    aliases: ['telugu', 'తెలుగు', 'तेलुगु', 'andhra', 'telangana'],
  },
  ta: {
    code: 'ta',
    nativeName: 'தமிழ்',
    englishName: 'Tamil',
    glyph: 'த',
    audioLabel: 'கேளுங்கள்',
    sampleAudio: 'தமிழில் தொடர இந்த விருப்பத்தை தேர்வு செய்யவும்.',
    continueAudioPrompt: 'தமிழில் தொடர இந்த விருப்பத்தை தேர்வு செய்யவும்.',
    states: ['Tamil Nadu'],
    aliases: ['tamil', 'தமிழ்', 'तमिल', 'tamil nadu'],
  },
  kn: {
    code: 'kn',
    nativeName: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    glyph: 'ಕ',
    audioLabel: 'ಕೇಳಿ',
    sampleAudio: 'ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಲು ಈ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ.',
    continueAudioPrompt: 'ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಲು ಈ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ.',
    states: ['Karnataka'],
    aliases: ['kannada', 'ಕನ್ನಡ', 'कन्नड़', 'karnataka'],
  },
};

export const matchLanguage = (query: string, lang: LanguageMeta): boolean => {
  if (!query || !query.trim()) return true;
  // Strip punctuation like ?, ., !, quotes, etc.
  const cleanQ = query.replace(/[?.,!/\\()_#@$%^&*~`'"+=\-[\]{}|:;<>]/g, ' ').toLowerCase().trim();
  if (!cleanQ) return true;

  const tokens = cleanQ.split(/\s+/).filter(Boolean);
  const targets = [
    String(lang.code).toLowerCase(),
    lang.nativeName.toLowerCase(),
    lang.englishName.toLowerCase(),
    ...(lang.aliases || []).map((a) => a.toLowerCase()),
    ...lang.states.map((s) => s.toLowerCase()),
  ];

  return (
    tokens.some((token) =>
      targets.some((target) => target.includes(token) || token.includes(target))
    ) || targets.some((target) => cleanQ.includes(target) || target.includes(cleanQ))
  );
};

export const getLanguagesForState = (stateName: string = 'Rajasthan'): { primary: LanguageMeta[]; additional: LanguageMeta[] } => {
  const all = Object.values(LANGUAGE_REGISTRY);
  const normalizedState = stateName.toLowerCase();
  
  // Hindi and English are universal primaries
  const primaryCodes = new Set<string>(['hi', 'en']);
  
  all.forEach((lang) => {
    if (lang.states.some((s) => s.toLowerCase() === normalizedState)) {
      primaryCodes.add(String(lang.code));
    }
  });

  const primary = all.filter((l) => primaryCodes.has(String(l.code)));
  const additional = all.filter((l) => !primaryCodes.has(String(l.code)));

  return { primary, additional };
};

export interface TranslationStrings {
  en: string;
  hi: string;
  mr: string;
  gu: string;
  raj: string;
}

export const translations: Record<string, TranslationStrings> = {
  // Global & App Branding
  appName: {
    en: 'Fasal Disha',
    hi: 'फसल-दिशा',
    mr: 'फसल-दिशा',
    gu: 'ફસલ-દિશા',
    raj: 'फसल-दिशा',
  },
  appTagline: {
    en: 'Guiding Every Farm in the Right Direction',
    hi: 'हर खेत को मिले सही दिशा',
    mr: 'प्रत्येक शेताला मिळावी योग्य दिशा',
    gu: 'દરેક ખેતરને મળે સાચી દિશા',
    raj: 'हर खेत ने मिले सही दिशा',
  },
  continue: {
    en: 'Next',
    hi: 'आगे बढ़ें',
    mr: 'पुढे जा',
    gu: 'આગળ વધો',
    raj: 'आगे बढ़ो',
  },
  back: {
    en: 'Back',
    hi: 'पीछे जाएं',
    mr: 'मागे जा',
    gu: 'પાછા જાઓ',
    raj: 'पाछा जाओ',
  },
  stepOf: {
    en: 'Question',
    hi: 'प्रश्न',
    mr: 'प्रश्न',
    gu: 'પ્રશ્ન',
    raj: 'सवाल',
  },
  listen: {
    en: 'Listen',
    hi: 'सुनें',
    mr: 'ऐका',
    gu: 'સાંભળો',
    raj: 'सुणो',
  },
  loadingStatus: {
    en: 'Weather & Soil Analysis',
    hi: 'मौसम एवं मृदा विश्लेषण',
    mr: 'हवामान व माती विश्लेषण',
    gu: 'હવામાન અને જમીન વિશ્લેષણ',
    raj: 'मौसम व माटी विश्लेषण',
  },
  dedicatedToFarmers: {
    en: 'Dedicated to Indian Farmers',
    hi: 'भारत के किसानों के लिए समर्पित',
    mr: 'भारतातील शेतकऱ्यांसाठी समर्पित',
    gu: 'ભારતના ખેડૂતો માટે સમર્પિત',
    raj: 'भारत रा किसानां सारू समर्पित',
  },
  onlineStatus: {
    en: 'Connected Online',
    hi: 'ऑनलाइन जुड़े हैं',
    mr: 'ऑनलाइन जोडलेले आहात',
    gu: 'ઓનલાઇન જોડાયેલા છો',
    raj: 'ऑनलाइन जुड़्या हो',
  },

  // 4 Bottom Navigation Tabs
  navHome: {
    en: 'Home',
    hi: 'होम',
    mr: 'होम',
    gu: 'હોમ',
    raj: 'होम',
  },
  navMyCrop: {
    en: 'My Crop',
    hi: 'मेरी फसल',
    mr: 'माझे पीक',
    gu: 'મારો પાક',
    raj: 'म्हारी फसल',
  },
  navHistory: {
    en: 'History',
    hi: 'इतिहास',
    mr: 'इतिहास',
    gu: 'ઇતિહાસ',
    raj: 'इतिहास',
  },
  navSettings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    mr: 'सेटिंग्ज',
    gu: 'સેટિંગ્સ',
    raj: 'सेटिंग्स',
  },

  // GPS Permission Modal Keys
  gpsPermissionTitle: {
    en: 'Allow Fasal Disha to access your farm location?',
    hi: 'क्या आप फसल-दिशा को अपने खेत की लोकेशन जानने की अनुमति देते हैं?',
    mr: 'फसल-दिशाला (Fasal Disha) तुमच्या शेताचे स्थान जाणून घेण्याची परवानगी द्यायची का?',
    gu: 'શું તમે પાક-દિશાને (Fasal Disha) તમારા ખેતરનું સ્થાન જાણવાની મંજૂરી આપો છો?',
    raj: 'कांई थे फसल-दिशा ने आपरे खेत री लोकेशन जाणबा री अनुमति दो हो?',
  },
  gpsPermissionDesc: {
    en: 'Precise location is used to detect local soil types, rainfall forecasts and mandi rates.',
    hi: 'सटीक लोकेशन से आपकी स्थानीय मिट्टी, मानसूनी बारिश और पास की मंडी के भाव अपने-आप मिल जाते हैं।',
    mr: 'अचूक स्थानामुळे स्थानिक माती, पावसाचा अंदाज आणि जवळच्या बाजारभावाची अचूक माहिती मिळते.',
    gu: 'ચોક્કસ સ્થાન દ્વારા તમારી સ્થાનિક જમીન, વરસાદ અને નજીકના બજાર ભાવ આપમેળે મળી જાય છે.',
    raj: 'सटीक लोकेशन सूं आपरे खेत री माटी, बारिश अर पास री मंडी रा भाव आपोआप मिल जावेला।',
  },
  gpsAllowWhileUsing: {
    en: 'While using the app',
    hi: 'ऐप का उपयोग करते समय अनुमति दें',
    mr: 'ॲप वापरताना परवानगी द्या',
    gu: 'ઍપનો ઉપયોગ કરતી વખતે મંજૂરી આપો',
    raj: 'ऐप रो उपयोग करते समै अनुमति द्यो',
  },
  gpsAllowOnlyThisTime: {
    en: 'Only this time',
    hi: 'केवल इस बार अनुमति दें',
    mr: 'फक्त यावेळीच परवानगी द्या',
    gu: 'માત્ર આ વખતે જ મંજૂરી આપો',
    raj: 'सिर्फ इणी बार अनुमति द्यो',
  },
  gpsDontAllow: {
    en: "Don't allow",
    hi: 'अनुमति न दें',
    mr: 'परवानगी देऊ नका',
    gu: 'મંજૂરી ન આપો',
    raj: 'अनुमति मत द्यो',
  },

  // Language Page Title Aliases
  chooseLanguageTitle: {
    en: 'Choose Your Language',
    hi: 'अपनी भाषा चुनें',
    mr: 'आपली भाषा निवडा',
    gu: 'તમારી ભાષા પસંદ કરો',
    raj: 'आपणी भाषा चुणो',
  },
  chooseLanguageSub: {
    en: 'Select your preferred language',
    hi: 'अपनी पसंदीदा भाषा का चयन करें',
    mr: 'आपली पसंतीची भाषा निवडा',
    gu: 'તમારી પસંદગીની ભાષા પસંદ કરો',
    raj: 'आपरी मनपसंद भाषा चुणो',
  },
  // Onboarding Screen 1: Language Select
  langTitle: {
    en: 'Choose Your Language',
    hi: 'अपनी भाषा चुनें',
    mr: 'आपली भाषा निवडा',
    gu: 'તમારી ભાષા પસંદ કરો',
    raj: 'आपणी भाषा चुणो',
  },
  langSubtitle: {
    en: 'Select the language you are most comfortable with for all voice and text instructions.',
    hi: 'सभी जानकारी और आवाज अपनी पसंदीदा भाषा में प्राप्त करने के लिए नीचे दिए गए विकल्पों में से एक चुनें।',
    mr: 'सर्व माहिती आणि आवाज आपल्या पसंतीच्या भाषेत मिळवण्यासाठी खालील पर्यायांमधून एक निवडा.',
    gu: 'તમામ માહિતી અને અવાજ તમારી પસંદગીની ભાષામાં મેળવવા માટે નીચેના વિકલ્પોમાંથી એક પસંદ કરો.',
    raj: 'सगळी जानकारी अर आवाज आपणी राजस्थानी भाषा में सुणबा खातर नीचे दियोड़ा विकल्पां सूं चुणो।',
  },
  getStarted: {
    en: 'Get Started',
    hi: 'शुरू करें',
    mr: 'सुरू करा',
    gu: 'શરૂ કરો',
    raj: 'सरू करो',
  },

  // Onboarding Screen 2: Language Confirm
  langConfirmPrompt: {
    en: 'Have you selected your preferred language for the app?',
    hi: 'क्या आप ऐप की जानकारी हिन्दी में देखना और सुनना चाहते हैं?',
    mr: 'तुम्हाला ॲपमधील माहिती मराठीत पाहायची आणि ऐकायची आहे का?',
    gu: 'શું તમે ઍપની માહિતી ગુજરાતીમાં જોવા અને સાંભળવા માંગો છો?',
    raj: 'कांई थे ऐप री सगळी जानकारी राजस्थानी में देखणी अर सुणणी चाहो?',
  },
  yesContinue: {
    en: 'Yes, Continue',
    hi: 'हाँ, आगे बढ़ें',
    mr: 'होय, पुढे जा',
    gu: 'હા, આગળ વધો',
    raj: 'हाँ, आगे बढ़ो',
  },
  changeLanguage: {
    en: 'Change Language',
    hi: 'दूसरी भाषा चुनें',
    mr: 'दुसरी भाषा निवडा',
    gu: 'બીજી ભાષા પસંદ કરો',
    raj: 'दूजी भाषा चुणो',
  },

  // Onboarding Screen 3: Audio Guide Tutorial
  audioGuideTitle: {
    en: 'Audio Information Feature',
    hi: 'आवाज में जानकारी सुनने की सुविधा',
    mr: 'आवाजात माहिती ऐकण्याची सुविधा',
    gu: 'અવાજમાં માહિતી સાંભળવાની સુવિધા',
    raj: 'आवाज में जानकारी सुणबा री सुविधा',
  },
  audioGuideLine1: {
    en: 'A speaker button is available on every page to listen to information.',
    hi: 'ऐप के हर पृष्ठ पर आवाज में सुनने के लिए स्पीकर बटन उपलब्ध रहेगा।',
    mr: 'आवाजात माहिती ऐकण्यासाठी प्रत्येक पृष्ठावर स्पीकर बटण उपलब्ध असेल.',
    gu: 'અવાજમાં માહિતી સાંભળવા માટે દરેક પૃષ્ઠ પર સ્પીકર બટન ઉપલબ્ધ રહેશે.',
    raj: 'आवाज में सुणबा सारू हर पन्ने पर स्पीकर बटन मिलेलो।',
  },
  audioGuideIntroSpeech: {
    en: 'You will find this speaker button on every page of the app. Tap the button below once to make sure.',
    hi: 'ऐप के हर पृष्ठ पर आपको यह स्पीकर बटन मिलेगा। एक बार नीचे दिए गए बटन को दबाकर सुनिश्चित कर लें।',
    mr: 'ॲपच्या प्रत्येक पृष्ठावर आपल्याला हे स्पीकर बटण मिळेल. एकदा खालील बटण दाबून खात्री करून घ्या.',
    gu: 'ઍપના દરેક પૃષ્ઠ પર તમને આ સ્પીકર બટન મળશે. એક વાર નીચે આપેલ બટન દબાવીને ખાતરી કરી લો.',
    raj: 'ऐप रे हर पन्ने पर आपणे यो स्पीकर बटन मिलसी। एक बार नीचे दियोड़ो बटन दबाकर पक्को कर ल्यो।',
  },
  goToApp: {
    en: 'Enter App',
    hi: 'ऐप में प्रवेश करें',
    mr: 'ॲपमध्ये प्रवेश करा',
    gu: 'ઍપમાં પ્રવેશ કરો',
    raj: 'ऐप में चालो',
  },

  // Onboarding Screen 4: Login & Guest
  loginTitle: {
    en: 'Login',
    hi: 'लॉगिन',
    mr: 'लॉगिन',
    gu: 'લૉગિન',
    raj: 'लॉगिन',
  },
  loginSubtitle: {
    en: 'Enter your mobile number',
    hi: 'अपना मोबाइल नंबर दर्ज करें',
    mr: 'आपला मोबाईल नंबर टाका',
    gu: 'તમારો મોબાઇલ નંબર દાખલ કરો',
    raj: 'आपरो मोबाइल नंबर लगाओ',
  },
  sendOtp: {
    en: 'Send OTP',
    hi: 'ओटीपी भेजें',
    mr: 'ओटीपी पाठवा',
    gu: 'ઓટીપી મોકલો',
    raj: 'ओटीपी भेजो',
  },
  verifyOtp: {
    en: 'Verify',
    hi: 'सत्यापित करें',
    mr: 'सत्यापित करा',
    gu: 'ચકાસો',
    raj: 'सत्यापित करो',
  },
  continueWithoutLogin: {
    en: 'Continue without Login',
    hi: 'लॉगिन के बिना जारी रखें',
    mr: 'लॉगिनशिवाय पुढे चालू ठेवा',
    gu: 'લૉગિન વિના ચાલુ રાખો',
    raj: 'लॉगिन बिना चालो',
  },

  // Home Screen
  greeting: {
    en: 'Welcome, Farmer Friend!',
    hi: 'नमस्ते, किसान भाई!',
    mr: 'नमस्कार, शेतकरी बांधवांनो!',
    gu: 'નમસ્તે, ખેડૂત મિત્ર!',
    raj: 'खम्मा घणी, किसान भाई!',
  },
  homeHeroTitle: {
    en: 'Which crop will give you maximum profit in your farm?',
    hi: 'आपके खेत में कौन सी फसल देगी सबसे अधिक मुनाफा?',
    mr: 'तुमच्या शेतात कोणते पीक देईल सर्वाधिक नफा?',
    gu: 'તમારા ખેતરમાં કયો પાક આપશે સૌથી વધુ નફો?',
    raj: 'आपरे खेत में कौनसी फसल देगी सबसूं ज्यादा नफो?',
  },
  homeHeroSub: {
    en: 'Know the best crop choice based on your soil, water and live mandi rates.',
    hi: 'अपनी मिट्टी, पानी और मंडी भाव के आधार पर सर्वोत्तम फसल जानें।',
    mr: 'आपली माती, पाणी आणि बाजारभावानुसार सर्वोत्तम पीक निवडा.',
    gu: 'તમારી જમીન, પાણી અને બજાર ભાવના આધારે શ્રેષ્ઠ પાક જાણો.',
    raj: 'आपणी माटी, पाणी अर मंडी भाव रे आधार पर सबसूं उत्तम फसल जानो।',
  },
  getCropRecButton: {
    en: 'Start Analysis',
    hi: 'नया विश्लेषण शुरू करें',
    mr: 'नवीन विश्लेषण सुरू करा',
    gu: 'નવું વિશ્લેષણ શરૂ કરો',
    raj: 'नयो विश्लेषण शुरू करो',
  },
  recentAnalysisTitle: {
    en: 'Your Previous Crop Analysis',
    hi: 'आपका पिछला फसल विश्लेषण',
    mr: 'आपले मागील पीक विश्लेषण',
    gu: 'તમારું પાછલું પાક વિશ્લેષણ',
    raj: 'आपरो पिछलो फसल विश्लेषण',
  },
  viewFullReport: {
    en: 'View Full Action Plan',
    hi: 'पूरी योजना देखें',
    mr: 'संपूर्ण योजना पहा',
    gu: 'સંપૂર્ણ યોજના જુઓ',
    raj: 'पूरी योजना देखो',
  },
  offlineReadyBadge: {
    en: '100% Offline Ready',
    hi: '100% ऑफ़लाइन उपलब्ध',
    mr: '100% ऑफलाइन उपलब्ध',
    gu: '100% ઑફલાઇન ઉપલબ્ધ',
    raj: '100% ऑफ़लाइन उपलब्ध',
  },
  howItWorksTitle: {
    en: 'How Fasal Disha Works',
    hi: 'फसल-दिशा कैसे काम करता है',
    mr: 'फसल-दिशा कसे कार्य करते',
    gu: 'ફસલ-દિશા કેવી રીતે કાર્ય કરે છે',
    raj: 'फसल-दिशा कियां काम करे है',
  },
  howItWorksStep1: {
    en: 'Enter farm details: Soil, water & previous crop',
    hi: 'खेत की स्थिति दर्ज करें: मिट्टी, पानी और पिछली फसल',
    mr: 'शेताची माहिती भरा: माती, पाणी आणि मागील पीक',
    gu: 'ખેતરની માહિતી દાખલ કરો: જમીન, પાણી અને અગાઉનો પાક',
    raj: 'खेत री स्थिति लगाओ: माटी, पाणी अर पहली री फसल',
  },
  howItWorksStep2: {
    en: 'Get AI recommendations with profit & cost breakdown',
    hi: 'AI से सही फसल जानें: सटीक पैदावार, लागत व शुद्ध मुनाफा',
    mr: 'AI कडून योग्य पीक जाणून घ्या: अचूक उत्पादन, खर्च व नफा',
    gu: 'AI પાસેથી યોગ્ય પાક જાણો: સચોટ ઉપજ, ખર્ચ અને નફો',
    raj: 'AI सूं सही फसल जानो: पैदावार, लागत अर शुद्ध नफो',
  },
  howItWorksStep3: {
    en: 'Download 1-page printable action plan slip for field use',
    hi: '1-पेज कार्ययोजना पर्ची लें: प्रिंट करें या व्हाट्सएप पर साझा करें',
    mr: '1-पानाचा कार्ययोजना पत्रक घ्या: प्रिंट करा किंवा व्हॉट्सॲपवर शेअर करा',
    gu: '1-પેજ કાર્યયોજના સ્લિપ મેળવો: પ્રિન્ટ કરો અથવા વ્હોટ્સએપ પર શેર કરો',
    raj: '1-पेज कार्ययोजना पर्ची ल्यो: प्रिंट करो या व्हाट्सएप पर भेजो',
  },
  noPreviousAnalysis: {
    en: 'No previous analysis saved yet.',
    hi: 'अभी तक कोई पिछला विश्लेषण सुरक्षित नहीं है।',
    mr: 'अजून कोणतेही मागील विश्लेषण जतन केलेले नाही.',
    gu: 'હજુ સુધી કોઈ પાછલું વિશ્લેષણ સાચવેલ નથી.',
    raj: 'हजी तक कोई पिछलो विश्लेषण सुरक्षित कोनी।',
  },

  // Wizard Steps Names
  wizardStep1Name: {
    en: 'Farm Size',
    hi: 'खेत का आकार',
    mr: 'शेताचा आकार',
    gu: 'ખેતરનું કદ',
    raj: 'खेत रो आकार',
  },
  wizardStep2Name: {
    en: 'Soil Type',
    hi: 'मिट्टी का प्रकार',
    mr: 'मातीचा प्रकार',
    gu: 'જમીનનો પ્રકાર',
    raj: 'माटी रो प्रकार',
  },
  wizardStep3Name: {
    en: 'Water Source',
    hi: 'सिंचाई का साधन',
    mr: 'पाण्याचा स्रोत',
    gu: 'પાણીનો સ્ત્રોત',
    raj: 'पाणी रो साधन',
  },
  wizardStep4Name: {
    en: 'Previous Crop',
    hi: 'पिछली फसल',
    mr: 'मागील पीक',
    gu: 'અગાઉનો પાક',
    raj: 'पहली री फसल',
  },
  wizardStep5Name: {
    en: 'Sowing Timing',
    hi: 'बुवाई का समय',
    mr: 'पेरणीची वेळ',
    gu: 'વાવણીનો સમય',
    raj: 'बुवाई रो टेम',
  },

  // Wizard Card 1: Land Area
  card1Title: {
    en: 'How much land do you have for farming?',
    hi: 'आपके पास खेती के लिए कितनी जमीन है?',
    mr: 'आपल्याकडे शेतीसाठी किती जमीन आहे?',
    gu: 'તમારી પાસે ખેતી માટે કેટલી જમીન છે?',
    raj: 'आपरे कने खेती सारू कितरी जमीन है?',
  },
  card1Category: {
    en: 'Farm Details',
    hi: 'खेत की जानकारी',
    mr: 'शेताची माहिती',
    gu: 'ખેતરની વિગત',
    raj: 'खेत री जानकारी',
  },
  card1Sub: {
    en: 'Accurate farm size ensures precise calculation of seeds, fertilizers, and net profit.',
    hi: 'सटीक रकबे से खाद, बीज और शुद्ध मुनाफे की सही गणना होती है।',
    mr: 'अचूक क्षेत्रामुळे खत, बियाणे आणि निव्वळ नफ्याची योग्य गणना होते.',
    gu: 'સચોટ વિસ્તારથી ખાતર, બિયારણ અને નફાની સાચી ગણતરી થાય છે.',
    raj: 'सटीक रकबे सूं खाद, बीज अर शुद्ध मुनाफे री सही गणना होवे है।',
  },
  landArea: {
    en: 'Total Land Area',
    hi: 'जमीन का कुल रकबा',
    mr: 'जमिनीचे एकूण क्षेत्र',
    gu: 'જમીનનું કુલ ક્ષેત્રફળ',
    raj: 'जमीन रो कुल रकबो',
  },
  unitAcres: {
    en: 'Acres',
    hi: 'एकड़',
    mr: 'एकर',
    gu: 'એકર',
    raj: 'एकड़',
  },
  decimalValid: {
    en: 'Decimals valid (e.g. 1, 2.5, 5 acres)',
    hi: 'दशमलव मान्य (उदा. १, २.५, ५ एकड़)',
    mr: 'दशांश ग्राह्य (उदा. १, २.५, ५ एकर)',
    gu: 'દશાંશ માન્ય (દા.ત. ૧, ૨.૫, ૫ એકર)',
    raj: 'दशमलव मान्य (उदा. १, २.५, ५ एकड़)',
  },
  invalidArea: {
    en: 'Please enter a valid number greater than 0.1',
    hi: 'कृपया ०.१ से अधिक मान्य संख्या दर्ज करें।',
    mr: 'कृपया ०.१ पेक्षा जास्त वैध संख्या टाका.',
    gu: 'કૃપા કરીને ૦.૧ થી વધુ માન્ય સંખ્યા દાખલ કરો.',
    raj: 'कृपया ०.१ सूं ज्यादा मान्य संख्या दर्ज करो।',
  },

  // Wizard Card 2: Soil Types
  card2Title: {
    en: 'What type of soil is in your farm?',
    hi: 'आपके खेत की मिट्टी कैसी है?',
    mr: 'तुमच्या शेतातील माती कोणत्या प्रकारची आहे?',
    gu: 'તમારા ખેતરની જમીન કેવી છે?',
    raj: 'आपरे खेत री माटी कैसी है?',
  },
  card2Category: {
    en: 'Soil Identification',
    hi: 'मृदा की पहचान',
    mr: 'मातीची ओळख',
    gu: 'માટીની ઓળખ',
    raj: 'माटी री पहचान',
  },
  card2Sub: {
    en: 'Identifying correct soil helps recommend crops with highest yield and suitability.',
    hi: 'सही मिट्टी की पहचान से अधिक पैदावार देने वाली उपयुक्त फसल तय होती है।',
    mr: 'योग्य माती ओळखल्याने अधिक उत्पादन देणारे योग्य पीक निवडणे सोपे होते.',
    gu: 'સાચી જમીન ઓળખવાથી વધુ ઉત્પાદન આપતો યોગ્ય પાક પસંદ થાય છે.',
    raj: 'सही माटी री पहचान सूं ज्यादा पैदावार देवण वाली उपयुक्त फसल तय होवे है।',
  },

  // Wizard Card 3: Water
  card3Title: {
    en: 'How much water is available for irrigation?',
    hi: 'सिंचाई के लिए पानी की क्या व्यवस्था है?',
    mr: 'सिंचनासाठी पाण्याची काय सोय आहे?',
    gu: 'સિંચાઈ માટે પાણીની શું વ્યવસ્થા છે?',
    raj: 'सिंचाई सारू पाणी री कांई व्यवस्था है?',
  },
  card3Category: {
    en: 'Irrigation Facility',
    hi: 'सिंचाई की सुविधा',
    mr: 'सिंचनाची सोय',
    gu: 'સિંચાઈની સુવિધા',
    raj: 'सिंचाई री सुविधा',
  },
  card3Sub: {
    en: 'Crop water requirements are matched based on your available irrigation capacity.',
    hi: 'सिंचाई की उपलब्धता के आधार पर फसल की पानी की जरूरत का मिलान होता है।',
    mr: 'उपलब्ध पाण्याच्या आधारावर पिकाच्या पाण्याची गरज जुळवली जाते.',
    gu: 'પાણીની ઉપલબ્ધતાના આધારે પાકની જરૂરિયાત નક્કી થાય છે.',
    raj: 'सिंचाई री उपलब्धता अनुसार फसल री पाणी री जरूरत रो मिलान होवे है।',
  },
  waterHigh: {
    en: 'Abundant Irrigation (Canal / Tubewell)',
    hi: 'भरपूर सिंचाई (नहर या ट्यूबवेल)',
    mr: 'भरपूर पाणी (कालवा किंवा विहीर)',
    gu: 'ભરપૂર સિંચાઈ (નહેર અથવા બોરવેલ)',
    raj: 'घणो पाणी (नहर या ट्यूबवेल)',
  },
  waterHighDesc: {
    en: 'Adequate round-the-year water for regular irrigation.',
    hi: 'साल भर लगातार सिंचाई के लिए भरपूर पानी उपलब्ध है।',
    mr: 'वर्षभर अखंड सिंचनासाठी मुबलक पाणी उपलब्ध आहे.',
    gu: 'આખું વર્ષ પિયત માટે પૂરતું પાણી ઉપલબ્ધ છે.',
    raj: 'साल भर लगातार सिंचाई सारू घणो पाणी उपलब्ध है।',
  },
  waterMedium: {
    en: 'Moderate Irrigation (Well / Borewell)',
    hi: 'मध्यम सिंचाई (कुआं या बोरवेल)',
    mr: 'मध्यम पाणी (मर्यादित विहीर/बोअर)',
    gu: 'મધ્યમ સિંચાઈ (કૂવો અથવા બોર)',
    raj: 'मध्यम पाणी (कुओ या सीमित साधन)',
  },
  waterMediumDesc: {
    en: 'Limited water source, irrigation possible only a limited number of times.',
    hi: 'सीमित जल स्रोत, पूरे सीजन में सीमित बार ही सिंचाई संभव।',
    mr: 'मर्यादित पाण्याचे साधन, हंगामात मर्यादित वेळाच सिंचन शक्य.',
    gu: 'મર્યાદિત પાણીનો સ્ત્રોત, આખી સીઝનમાં મર્યાદિત વાર જ પિયત શક્ય.',
    raj: 'सीमित पाणी रो साधन, पूरे सीजन में सीमित बार ही सिंचाई संभव।',
  },
  waterRainfed: {
    en: 'Rainfed (Monsoon Dependent)',
    hi: 'वर्षा आधारित (बारानी खेती)',
    mr: 'कोरडवाहू (केवळ पाऊस)',
    gu: 'વરસાદ આધારિત (માત્ર વરસાદ)',
    raj: 'बारानी (केवल बारिश पर निर्भर)',
  },
  waterRainfedDesc: {
    en: 'No artificial irrigation facility, entirely dependent on rainfall.',
    hi: 'सिंचाई का कोई साधन नहीं, फसल पूरी तरह प्राकृतिक बारिश पर निर्भर।',
    mr: 'सिंचनाची कोणतीही सोय नाही, पीक पूर्णपणे पावसावर अवलंबून.',
    gu: 'પિયતની કોઈ સુવિધા નથી, પાક સંપૂર્ણપણે વરસાદ પર નિર્ભર.',
    raj: 'सिंचाई रो कोई साधन कोनी, खेती पूरी तरह बारिश माथे निर्भर।',
  },

  // Wizard Card 4: Previous Crop
  card4Title: {
    en: 'Which crop was planted previously in your field?',
    hi: 'पिछली बार खेत में कौन सी फसल लगाई थी?',
    mr: 'मागील हंगामात शेतात कोणते पीक घेतले होते?',
    gu: 'પાછલી વખતે ખેતરમાં કયો પાક લીધો હતો?',
    raj: 'पिछली बार खेत में कौनसी फसल लगाई ही?',
  },
  card4Category: {
    en: 'Previous Crop & Rotation',
    hi: 'पिछली फसल व फसल चक्र',
    mr: 'मागील पीक व पीक फेरपालट',
    gu: 'પાછલો પાક અને પાક ફેરબદલી',
    raj: 'पिछली फसल अर फसल चक्र',
  },
  card4Sub: {
    en: 'Crop rotation maintains soil fertility and balances nutrient uptake.',
    hi: 'फसल चक्र से जमीन की उपजाऊ शक्ति और पोषण संतुलित रहता है।',
    mr: 'पीक फेरपालट केल्याने जमिनीची सुपीकता आणि पोषण संतुलित राहते.',
    gu: 'પાક ફેરબદલીથી જમીનની ફળદ્રુપતા અને પોષણ સંતુલિત રહે છે.',
    raj: 'फसल चक्र सूं जमीन री उपजाऊ ताकत अर पोषण संतुलित रहवे है।',
  },

  // Wizard Card 5: Sowing Timing
  card5Title: {
    en: 'When will you sow in your field?',
    hi: 'आप खेत में बुवाई कब करेंगे?',
    mr: 'तुम्ही शेतात पेरणी कधी करणार आहात?',
    gu: 'તમે ખેતરમાં વાવણી ક્યારે કરશો?',
    raj: 'थे खेत में बुवाई कदे करोला?',
  },
  card5Category: {
    en: 'Sowing Timing',
    hi: 'बुवाई का समय',
    mr: 'पेरणीची वेळ',
    gu: 'વાવણીનો સમય',
    raj: 'बुवाई रो टेम',
  },
  card5Sub: {
    en: 'Timely sowing maximizes monsoon benefits and minimizes pest and disease risks.',
    hi: 'सही बुवाई समय से मानसूनी बारिश का अधिकतम लाभ और कीट-रोग का जोखिम कम होता है।',
    mr: 'योग्य पेरणी वेळेमुळे पावसाचा पुरेपूर फायदा मिळतो आणि कीड-रोगाचा धोका कमी होतो.',
    gu: 'યોગ્ય વાવણી સમયથી વરસાદનો પૂરો લાભ મળે છે અને રોગ-જીવાતનું જોખમ ઘટે છે.',
    raj: 'सही बुवाई टेम सूं मानसूनी बारिश रो फायदो मिले अर रोग रो जोखिम कम होवे है।',
  },

  // Wizard Card 6: Intended Crop (Farmer's Choice)
  card6Title: {
    en: 'What crop are you thinking of planting?',
    hi: 'आप कौन सी फसल बोने की सोच रहे हैं?',
    mr: 'तुम्ही कोणते पीक घेण्याचा विचार करत आहात?',
    gu: 'તમે કયો પાક લેવાનું વિચારી રહ્યા છો?',
    raj: 'थे कौनसी फसल बोबा री सोच रिया हो?',
  },
  card6Category: {
    en: "Farmer's Choice",
    hi: 'किसान की पसंद',
    mr: 'शेतकऱ्याची पसंती',
    gu: 'ખેડૂતની પસંદગી',
    raj: 'किसान री पसंद',
  },
  card6Sub: {
    en: 'We will compare your considered crop with our top AI recommendation to show the exact profit difference.',
    hi: 'हम आपकी सोची हुई फसल और AI सर्वोत्तम फसल का सीधा मिलान करके शुद्ध मुनाफे का अंतर दिखाएंगे।',
    mr: 'आम्ही तुमच्या विचारातील पीक आणि AI सर्वोत्तम पिकाची थेट तुलना करून नफ्यातील फरक दाखवू.',
    gu: 'અમે તમારા ધ્યાનમાં રાખેલ પાક અને AI શ્રેષ્ઠ પાકની સીધી સરખામણી કરી નફાનો તફાવત બતાવીશું.',
    raj: 'म्हे थारी सोची फसल अर AI रो बेस्ट सुझाव रो सीधा मिलान कर नफा रो अंतर बतावांला।',
  },
  notDecided: {
    en: 'Not Decided / Suggest Best',
    hi: 'निश्चित नहीं / सर्वोत्तम सुझाव दें',
    mr: 'निश्चित नाही / सर्वोत्तम सुचवा',
    gu: 'નક્કી નથી / શ્રેષ્ઠ સૂચવો',
    raj: 'तय कोनी / बेस्ट सुझाव दो',
  },
  headToHeadTitle: {
    en: 'Your Choice vs AI Recommendation',
    hi: 'आपकी पसंद vs AI सर्वोत्तम सुझाव',
    mr: 'तुमची निवड vs AI सर्वोत्तम शिफारस',
    gu: 'તમારી પસંદગી vs AI શ્રેષ્ઠ ભલામણ',
    raj: 'थारी पसंद vs AI रो बेस्ट सुझाव',
  },
  yourChoice: {
    en: 'Your Choice',
    hi: 'आपकी पसंद',
    mr: 'तुमची निवड',
    gu: 'તમારી પસંદ',
    raj: 'थारी पसंद',
  },
  aiRecommendation: {
    en: 'AI Recommendation',
    hi: 'AI सर्वोत्तम सुझाव',
    mr: 'AI सर्वोत्तम शिफारस',
    gu: 'AI શ્રેષ્ઠ ભલામણ',
    raj: 'AI बेस्ट सुझाव',
  },
  profitGain: {
    en: 'Extra Net Profit',
    hi: 'अतिरिक्त शुद्ध मुनाफा',
    mr: 'अतिरिक्त निव्वळ नफा',
    gu: 'વધારાનો ચોખ્ખો નફો',
    raj: 'ज्यादा शुद्ध मुनाफो',
  },
  alreadyBestBadge: {
    en: 'Already Optimal Choice',
    hi: 'सर्वोत्तम व सही चयन',
    mr: 'सर्वोत्तम व योग्य निवड',
    gu: 'શ્રેષ્ઠ અને યોગ્ય પસંદગી',
    raj: 'बेस्ट अर सही पसंद',
  },
  fallowLand: {
    en: 'Empty / Fallow Field',
    hi: 'खाली खेत (पड़त)',
    mr: 'पडीक शेत (रिकामे)',
    gu: 'પડતર / ખાલી ખેતર',
    raj: 'खाली खेत (पड़त)',
  },
  fallowLandSub: {
    en: 'No crop was planted',
    hi: 'कोई फसल नहीं लगाई थी',
    mr: 'कोणतेही पीक नव्हते',
    gu: 'કોઈ પાક નહોતો લીધો',
    raj: 'कोई फसल कोनी लगाई ही',
  },
  otherCrop: {
    en: 'Other Crop...',
    hi: 'अन्य फसल...',
    mr: 'इतर पीक...',
    gu: 'અન્ય પાક...',
    raj: 'अन्य फसल...',
  },
  otherCropSub: {
    en: 'Search, speak or choose',
    hi: 'खोजें, बोलें या चुनें',
    mr: 'शोधा, बोला किंवा निवडा',
    gu: 'શોધો, બોલો અથવા પસંદ કરો',
    raj: 'खोजो, बोलो या चुणो',
  },
  chooseOtherCropTitle: {
    en: 'Choose or Search Crop',
    hi: 'अन्य फसल चुनें या खोजें',
    mr: 'इतर पीक निवडा किंवा शोधा',
    gu: 'અન્ય પાક પસંદ કરો અથવા શોધો',
    raj: 'अन्य फसल चुणो या खोजो',
  },
  searchCropPlaceholder: {
    en: 'Search crop (Mustard, Moong, Sugarcane...)',
    hi: 'फसल खोजें (उदा. सरसों, मूंग, गन्ना, प्याज...)',
    mr: 'पीक शोधा (उदा. मोहरी, मूग, ऊस, कांदा...)',
    gu: 'પાક શોધો (દા.ત. રાઈ, મગ, શેરડી, ડુંગળી...)',
    raj: 'फसल खोजो (उदा. सरसों, मूंग, गन्नो, कांदो...)',
  },
  speakCropName: {
    en: 'Speak Crop Name',
    hi: 'बोल के बताएं',
    mr: 'बोलून सांगा',
    gu: 'બોલીને જણાવો',
    raj: 'बोल र बताओ',
  },
  sowingTimingWeek: {
    en: 'This Week (Next 7 Days)',
    hi: 'इसी हफ्ते (अगले ७ दिनों में)',
    mr: 'याच आठवड्यात (पुढील ७ दिवसांत)',
    gu: 'આ જ અઠવાડિયે (આગામી ૭ દિવસમાં)',
    raj: 'इणी हफ्ते (अगला ७ दिनां में)',
  },
  sowingTimingMonth: {
    en: 'Within the Next Month',
    hi: 'अगले एक महीने में',
    mr: 'पुढील एका महिन्यात',
    gu: 'આગામી એક મહિનામાં',
    raj: 'अगला एक महीना में',
  },
  sowingTimingCustomDate: {
    en: 'Pick a Specific Date',
    hi: 'निश्चित तारीख चुनें',
    mr: 'विशिष्ट तारीख निवडा',
    gu: 'ચોક્કસ તારીખ પસંદ કરો',
    raj: 'निश्चित तारीख चुणो',
  },
  seeRecommendations: {
    en: 'Show AI Recommendations',
    hi: 'सर्वोत्तम फसल विकल्प देखें',
    mr: 'सर्वोत्तम पीक पर्याय पहा',
    gu: 'શ્રેષ્ઠ પાક વિકલ્પો જુઓ',
    raj: 'सबसूं चोखी फसल विकल्प देखो',
  },

  // Recommendations Screen Titles & Metrics
  resultsTitle: {
    en: 'Best Crops for Your Farm',
    hi: 'आपके खेत के लिए सर्वोत्तम फसल',
    mr: 'तुमच्या शेतासाठी सर्वोत्तम पीक',
    gu: 'તમારા ખેતર માટે શ્રેષ્ઠ પાક',
    raj: 'आपरे खेत सारू सबसूं उत्तम फसल',
  },
  resultsSub: {
    en: 'AI generated recommendations based on your soil, water and market rates.',
    hi: 'आपकी मिट्टी, सिंचाई और मंडी भाव के आधार पर एआई द्वारा चयनित परिणाम।',
    mr: 'माती, पाणी आणि बाजारभावानुसार एआय द्वारे निवडलेले निकाल.',
    gu: 'જમીન, પાણી અને બજાર ભાવના આધારે એઆઈ પરિણામો.',
    raj: 'माटी, सिंचाई अर मंडी भाव रे आधार पर चुण्योड़ा परिणाम।',
  },
  topChoiceBadge: {
    en: 'TOP RECOMMENDATION',
    hi: 'सर्वोत्तम फसल विकल्प',
    mr: 'सर्वोत्कृष्ट पीक पर्याय',
    gu: 'શ્રેષ્ઠ પાક વિકલ્પ',
    raj: 'सबसूं उत्तम फसल विकल्प',
  },
  estimatedProfit: {
    en: 'Estimated Profit',
    hi: 'अनुमानित शुद्ध लाभ',
    mr: 'अंदाजे निव्वळ नफा',
    gu: 'અંદાજિત ચોખ્ખો નફો',
    raj: 'अनुमानित शुद्ध नफो',
  },
  expectedYield: {
    en: 'Expected Yield',
    hi: 'अनुमानित पैदावार',
    mr: 'अपेक्षित उत्पन्न',
    gu: 'અંદાજિત ઉપજ',
    raj: 'अनुमानित पैदावार',
  },
  estimatedCost: {
    en: 'Estimated Cost',
    hi: 'अनुमानित लागत',
    mr: 'अंदाजे उत्पादन खर्च',
    gu: 'અંદાજિત ખર્ચ',
    raj: 'अनुमानित लागत',
  },
  perAcre: {
    en: '/ acre',
    hi: '/ एकड़',
    mr: '/ एकर',
    gu: '/ એકર',
    raj: '/ एकड़',
  },
  quintalPerAcre: {
    en: 'quintal / acre',
    hi: 'क्विंटल / एकड़',
    mr: 'क्विंटल / एकर',
    gu: 'ક્વિન્ટલ / એકર',
    raj: 'क्विंटल / एकड़',
  },
  alternativeOptionsTitle: {
    en: 'Alternative Crop Options',
    hi: 'अन्य मजबूत फसल विकल्प',
    mr: 'इतर पर्यायी पीक पर्याय',
    gu: 'અન્ય વૈકલ્પિક પાક વિકલ્પો',
    raj: 'दूजा मजबूत फसल विकल्प',
  },
  whyRecommendedTitle: {
    en: 'Why This Crop is Recommended',
    hi: 'एआई द्वारा चयन का कारण',
    mr: 'हे पीक निवडण्याचे कारण',
    gu: 'આ પાક પસંદ કરવાનું કારણ',
    raj: 'एआई द्वारा चुणबा रो कारण',
  },
  costBreakdownTitle: {
    en: 'Detailed Cost Breakdown (Seed, Fertilizer, Labor)',
    hi: 'विस्तृत लागत विवरण (बीज, खाद, मजदूरी)',
    mr: 'तपशीलवार खर्च (बियाणे, खत, मजुरी)',
    gu: 'વિગતવાર ખર્ચ (બિયારણ, ખાતર, મજૂરી)',
    raj: 'विस्तृत लागत विवरण (बीज, खाद, मजूरी)',
  },
  seedCost: {
    en: 'Seed Cost',
    hi: 'बीज व बीज उपचार लागत',
    mr: 'बियाणे व बीज प्रक्रिया खर्च',
    gu: 'બિયારણ ખર્ચ',
    raj: 'बीज व बीज उपचार लागत',
  },
  fertilizerCost: {
    en: 'Fertilizers & Nutrients',
    hi: 'उर्वरक व खाद',
    mr: 'खते व पोषण',
    gu: 'ખાતર ખર્ચ',
    raj: 'खाद अर उर्वरक',
  },
  pesticideCost: {
    en: 'Pesticides & Plant Protection',
    hi: 'कीटनाशक व फसल सुरक्षा',
    mr: 'कीटकनाशके व पीक संरक्षण',
    gu: 'જંતુનાશક દવાઓ',
    raj: 'कीटनाशक व फसल सुरक्षा',
  },
  machineryCost: {
    en: 'Machinery & Tractor Rental',
    hi: 'मशीनरी व ट्रैक्टर जुताई',
    mr: 'यंत्रसामग्री व ट्रॅक्टर मशागत',
    gu: 'ટ્રેક્ટર અને યંત્ર ખર્ચ',
    raj: 'ट्रैक्टर जुताई व मशीन',
  },
  labourCost: {
    en: 'Hired Farm Labor',
    hi: 'मजदूरी (निराई, बुवाई, कटाई)',
    mr: 'मजुरी खर्च',
    gu: 'મજૂરી ખર્ચ',
    raj: 'मजूरी खर्च',
  },
  irrigationCost: {
    en: 'Irrigation & Electricity',
    hi: 'सिंचाई व बिजली/डीजल',
    mr: 'सिंचन व वीज/डिझेल',
    gu: 'સિંચાઈ અને વીજળી ખર્ચ',
    raj: 'सिंचाई व बिजली/डीजल',
  },
  chooseAndPlanBtn: {
    en: 'I Choose This Crop — View Action Plan',
    hi: 'मैं यह फसल चुनता हूँ — कार्य-योजना देखें',
    mr: 'मी हे पीक निवडतो — कार्य-योजना पहा',
    gu: 'હું આ પાક પસંદ કરું છું — કાર્ય-યોજના જુઓ',
    raj: 'म्हे या फसल चुणां हां — कार्य-योजना देखो',
  },
  chooseThisCropBtn: {
    en: 'I Choose This Crop',
    hi: 'मैं यह फसल चुनता हूँ',
    mr: 'मी हे पीक निवडतो',
    gu: 'હું આ પાક પસંદ કરું છું',
    raj: 'म्हे या फसल चुणां हां',
  },
  whatIfCardBtn: {
    en: 'Check Weather & Price Risks',
    hi: 'मौसम व जोखिम जांचें',
    mr: 'हवामान आणि जोखीम तपासा',
    gu: 'હવામાન અને જોખમ તપાસો',
    raj: 'मौसम व जोखिम जांचो',
  },

  // Settings & Account Page
  settingsTitle: {
    en: 'Farmer Account & Settings',
    hi: 'किसान खाता व सेटिंग्स',
    mr: 'शेतकरी खाते आणि सेटिंग्ज',
    gu: 'ખેડૂત ખાતું અને સેટિંગ્સ',
    raj: 'किसान खातो व सेटिंग्स',
  },
  phoneNumber: {
    en: 'Registered Mobile Number',
    hi: 'पंजीकृत मोबाइल नंबर',
    mr: 'नोंदणीकृत मोबाईल नंबर',
    gu: 'નોંધાયેલ મોબાઇલ નંબર',
    raj: 'पंजीकृत मोबाइल नंबर',
  },
  currentLanguageLabel: {
    en: 'App Language',
    hi: 'ऐप की भाषा',
    mr: 'ॲपची भाषा',
    gu: 'ઍપની ભાષા',
    raj: 'ऐप री भाषा',
  },
  changeLanguageBtn: {
    en: 'Change Language',
    hi: 'भाषा बदलें',
    mr: 'भाषा बदला',
    gu: 'ભાષા બદલો',
    raj: 'भाषा बदलो',
  },
  signOut: {
    en: 'Sign Out',
    hi: 'साइन आउट करें',
    mr: 'साइन आउट करा',
    gu: 'સાઇન આઉટ કરો',
    raj: 'साइन आउट करो',
  },

  // Action Plan Milestone Screen Keys
  planTitle: {
    en: 'My Crop Action Plan',
    hi: 'मेरी फसल कार्य-योजना',
    mr: 'माझे पीक कार्य-योजना',
    gu: 'મારી પાક કાર્ય-યોજના',
    raj: 'म्हारी फसल कार्य-योजना',
  },
  planSubtitle: {
    en: 'Step-by-step guidance from sowing to harvest.',
    hi: 'बुवाई से लेकर कटाई तक का चरणबद्ध कृषि मार्गदर्शन।',
    mr: 'पेरणीपासून काढणीपर्यंतचे टप्प्याटप्प्याने मार्गदर्शन.',
    gu: 'વાવણીથી લઈને લણણી સુધીનું તબક્કાવાર માર્ગદર્શન.',
    raj: 'बुवाई सूं ले’र कटाई तक रो चरणबद्ध मार्गदर्शन।',
  },
  printPdfBtn: {
    en: 'Download Action Plan (PDF)',
    hi: 'कृषि कार्ययोजना रिपोर्ट (PDF)',
    mr: 'कृषी कार्ययोजना अहवाल (PDF)',
    gu: 'કૃષિ કાર્યયોજના રિપોર્ટ (PDF)',
    raj: 'कृषि कार्ययोजना रिपोर्ट (PDF)',
  },
  shareWhatsappBtn: {
    en: 'Share on WhatsApp',
    hi: 'व्हाट्सएप पर भेजें',
    mr: 'व्हॉट्सॲपवर पाठवा',
    gu: 'વોટ્સએપ પર મોકલો',
    raj: 'व्हाट्सएप पर भेजो',
  },
  backToHomeBtn: {
    en: 'Back to Home',
    hi: 'मुख्य पृष्ठ पर जाएं',
    mr: 'मुख्य पृष्ठावर जा',
    gu: 'મુખ્ય પૃષ્ઠ પર જાઓ',
    raj: 'मुख्य पृष्ठ पर चालो',
  },
  networkConnected: {
    en: 'Connected Online',
    hi: 'ऑनलाइन जुड़े हैं',
    mr: 'ऑनलाइन जोडलेले आहात',
    gu: 'ઓનલાઇન જોડાયેલા છો',
    raj: 'ऑनलाइन जुड़्या हो',
  },
  speaking: {
    en: 'Speaking...',
    hi: 'बोल रहा है...',
    mr: 'बोलत आहे...',
    gu: 'બોલી રહ્યું છે...',
    raj: 'बोल रियो है...',
  },
  enterOtp: {
    en: 'Enter OTP',
    hi: 'ओटीपी दर्ज करें',
    mr: 'ओटीपी टाका',
    gu: 'ઓટીપી દાખલ કરો',
    raj: 'ओटीपी लगाओ',
  },
  guestBypass: {
    en: 'Continue without Login',
    hi: 'लॉगिन के बिना जारी रखें',
    mr: 'लॉगिनशिवाय पुढे चालू ठेवा',
    gu: 'લૉગિન વિના ચાલુ રાખો',
    raj: 'लॉगिन बिना चालो',
  },
  mobileNumberLabel: {
    en: 'Mobile Number',
    hi: 'मोबाइल नंबर',
    mr: 'मोबाईल नंबर',
    gu: 'મોબાઇલ નંબર',
    raj: 'मोबाइल नंबर',
  },
  confirmLangTitle: {
    en: 'Confirm Language',
    hi: 'भाषा की पुष्टि करें',
    mr: 'भाषेची खात्री करा',
    gu: 'ભાષાની ખાતરી કરો',
    raj: 'भाषा री पुष्टि करो',
  },
  confirmLangMessage: {
    en: 'Do you want to continue with this language?',
    hi: 'क्या आप इसी भाषा में आगे बढ़ना चाहते हैं?',
    mr: 'तुम्हाला याच भाषेत पुढे जायचे आहे का?',
    gu: 'શું તમે આ જ ભાષામાં આગળ વધવા માંગો છો?',
    raj: 'कांई थे इणी भाषा में आगे बढ़ना चाहो?',
  },
  confirmLangYes: {
    en: 'Yes, Continue',
    hi: 'हाँ, आगे बढ़ें',
    mr: 'होय, पुढे जा',
    gu: 'હા, આગળ વધો',
    raj: 'हाँ, आगे बढ़ो',
  },
  confirmLangChange: {
    en: 'Change Language',
    hi: 'दूसरी भाषा चुनें',
    mr: 'दुसरी भाषा निवडा',
    gu: 'બીજી ભાષા પસંદ કરો',
    raj: 'दूजी भाषा चुणो',
  },
  audioGuideTestBtn: {
    en: 'Test Voice Audio',
    hi: 'स्पीकर की आवाज सुनें',
    mr: 'स्पीकरचा आवाज ऐका',
    gu: 'સ્પીકરનો અવાજ સાંભળો',
    raj: 'स्पीकर री आवाज सुणो',
  },
  audioGuideProceed: {
    en: 'Enter App',
    hi: 'ऐप में प्रवेश करें',
    mr: 'ॲपमध्ये प्रवेश करा',
    gu: 'ઍપમાં પ્રવેશ કરો',
    raj: 'ऐप में चालो',
  },
  audioGuideSuccess: {
    en: 'Congratulations, you have tested the sound properly. Now proceed ahead.',
    hi: 'बधाई हो, आपने आवाज की सही जांच कर ली है। अब आगे बढ़ें।',
    mr: 'अभिनंदन, आपण आवाजाची योग्य चाचणी घेतली आहे. आता पुढे जा.',
    gu: 'અભિનંદન, તમે અવાજની યોગ્ય ચકાસણી કરી લીધી છે. હવે આગળ વધો.',
    raj: 'बधाई हो, आप आवाज री सही जांच कर ली है। अब आगे बढ़ो।',
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    mr: 'रद्द करा',
    gu: 'રદ કરો',
    raj: 'रद्द करो',
  },
  // Dedicated Pages
  myCropPlanTitle: {
    en: 'My Crop Plan',
    hi: 'मेरी फसल',
    mr: 'माझे पीक',
    gu: 'મારો પાક',
    raj: 'म्हारी फसल',
  },
  historyTitle: {
    en: 'Crop History',
    hi: 'फसल इतिहास',
    mr: 'पीक इतिहास',
    gu: 'પાક ઇતિહાસ',
    raj: 'फसल इतिहास',
  },
};

export function getTranslation(key: string, lang: SupportedLanguage): string {
  const item = translations[key];
  if (!item) return key;
  return item[lang] || item['hi'] || item['en'] || key;
}
