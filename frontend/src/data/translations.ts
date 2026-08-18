export type SupportedLanguage = 'hi' | 'mr' | 'gu' | 'en';

export interface TranslationDictionary {
  [key: string]: {
    [lang in SupportedLanguage]?: string;
  };
}

export const translations: TranslationDictionary = {
  // App General
  appName: {
    en: 'Krishi-Wise',
    hi: 'कृषि-वाइज़',
    mr: 'कृषी-वाइज',
    gu: 'કૃષિ-વાઇઝ',
  },
  appTagline: {
    en: 'Smart Precision Crop Advisory for Maximum Yield & Profit',
    hi: 'स्मार्ट फसल सलाहकार • अधिकतम पैदावार एवं लाभ',
    mr: 'स्मार्ट पीक सल्लागार • कमाल उत्पन्न आणि नफा',
    gu: 'સ્માર્ટ પાક સલાહકાર • મહત્તમ ઉપજ અને નફો',
  },
  listen: {
    en: 'Listen',
    hi: 'सुनें',
    mr: 'ऐका',
    gu: 'સાંભળો',
  },
  speaking: {
    en: 'Speaking...',
    hi: 'बोल रहे हैं...',
    mr: 'बोलत आहे...',
    gu: 'બોલે છે...',
  },
  back: {
    en: 'Back',
    hi: 'पीछे जाएं',
    mr: 'मागे जा',
    gu: 'પાછા જાઓ',
  },
  continue: {
    en: 'Continue',
    hi: 'आगे बढ़ें',
    mr: 'पुढे जा',
    gu: 'આગળ વધો',
  },
  save: {
    en: 'Save',
    hi: 'सुरक्षित करें',
    mr: 'जतन करा',
    gu: 'સાચવો',
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    mr: 'रद्द करा',
    gu: 'રદ કરો',
  },
  stepOf: {
    en: 'Question',
    hi: 'प्रश्न',
    mr: 'प्रश्न',
    gu: 'પ્રશ્ન',
  },
  of: {
    en: 'of',
    hi: 'में से',
    mr: 'पैकी',
    gu: 'માંથી',
  },
  networkConnected: {
    en: 'Connected',
    hi: 'ऑनलाइन जुड़े हैं',
    mr: 'ऑनलाइन जोडलेले आहे',
    gu: 'ઓનલાઇન જોડાયેલ છે',
  },
  networkOffline: {
    en: 'Offline Mode',
    hi: 'ऑफलाइन मोड',
    mr: 'ऑफलाइन मोड',
    gu: 'ઓફલાઇન મોડ',
  },

  // GPS Permission Modal
  gpsPermissionTitle: {
    en: 'Allow Krishi-Wise to access this device\'s location?',
    hi: 'क्या कृषि-वाइज़ को इस फोन के स्थान (GPS) की अनुमति दें?',
    mr: 'कृषी-वाइजला या फोनच्या स्थानाचा (GPS) वापर करण्याची परवानगी द्यायची का?',
    gu: 'શું કૃષિ-વાઇઝને આ ઉપકરણના સ્થાન (GPS) ની ઍક્સેસ આપવી?',
  },
  gpsPermissionDesc: {
    en: 'Location is required to automatically detect your local soil, weather, and mandi prices.',
    hi: 'आपके क्षेत्र की मिट्टी, बारिश और नजदीकी मंडी के भाव स्वतः जानने के लिए स्थान आवश्यक है।',
    mr: 'आपल्या भागातील माती, पाऊस आणि जवळच्या बाजारभावाची अचूक माहिती मिळवण्यासाठी स्थान आवश्यक आहे.',
    gu: 'તમારા વિસ્તારની જમીન, વરસાદ અને નજીકના બજાર ભાવો જાણવા માટે સ્થાન જરૂરી છે.',
  },
  gpsAllowWhileUsing: {
    en: 'While using the app',
    hi: 'ऐप का उपयोग करते समय',
    mr: 'ॲप वापरताना',
    gu: 'ઍપનો ઉપયોગ કરતી વખતે',
  },
  gpsAllowOnlyThisTime: {
    en: 'Only this time',
    hi: 'केवल इस बार',
    mr: 'फक्त यावेळी',
    gu: 'માત્ર આ વખતે',
  },
  gpsDontAllow: {
    en: 'Don\'t allow',
    hi: 'अनुमति न दें',
    mr: 'परवानगी देऊ नका',
    gu: 'પરવાનગી ન આપો',
  },

  // Language Selection Screen
  chooseLanguageTitle: {
    en: 'Choose your language',
    hi: 'अपनी पसंदीदा भाषा चुनें',
    mr: 'आपली पसंतीची भाषा निवडा',
    gu: 'તમારી પસંદગીની ભાષા પસંદ કરો',
  },
  chooseLanguageSub: {
    en: 'Select the language you are most comfortable with.',
    hi: 'जिस भाषा में आप जानकारी पढ़ना और सुनना चाहते हैं, उसे चुनें।',
    mr: 'ज्या भाषेत तुम्हाला माहिती वाचायची आणि ऐकायची आहे ती निवडा.',
    gu: 'તમે જે ભાષામાં માહિતી વાંચવા અને સાંભળવા માંગો છો તે પસંદ કરો.',
  },
  suggestedForYourRegion: {
    en: 'Suggested for your region',
    hi: 'आपके क्षेत्र के लिए सुझाई गई भाषाएँ',
    mr: 'आपल्या विभागासाठी सुचवलेल्या भाषा',
    gu: 'તમારા વિસ્તાર માટે સૂચવેલ ભાષાઓ',
  },
  getStarted: {
    en: 'Get Started',
    hi: 'शुरू करें',
    mr: 'सुरू करा',
    gu: 'શરૂ કરો',
  },

  // Language Confirmation Screen
  confirmLangTitle: {
    en: 'Confirm Language',
    hi: 'भाषा की पुष्टि करें',
    mr: 'भाषेची खात्री करा',
    gu: 'ભાષાની પુષ્ટિ કરો',
  },
  confirmLangMessage: {
    en: 'You have selected Hindi. The entire app will be displayed and spoken in Hindi.',
    hi: 'आपने हिंदी भाषा चुनी है। पूरा ऐप आपको हिंदी में ही दिखेगा और बोलेगा।',
    mr: 'तुम्ही मराठी भाषा निवडली आहे. संपूर्ण ॲप तुम्हाला मराठीत दिसेल आणि बोलेल.',
    gu: 'તમે ગુજરાતી ભાષા પસંદ કરી છે. સમગ્ર ઍપ તમને ગુજરાતીમાં દેખાશે અને બોલશે.',
  },
  confirmLangYes: {
    en: 'Yes, Continue',
    hi: 'हाँ, आगे बढ़ें',
    mr: 'होय, पुढे चला',
    gu: 'હા, આગળ વધો',
  },
  confirmLangChange: {
    en: 'Change Language',
    hi: 'दूसरी भाषा चुनें',
    mr: 'दुसरी भाषा निवडा',
    gu: 'બીજી ભાષા પસંદ કરો',
  },

  // Audio Guide Screen
  audioGuideTitle: {
    en: 'Voice Assistant Guide',
    hi: 'आवाज में जानकारी सुनने की सुविधा',
    mr: 'आवाजात माहिती ऐकण्याची सुविधा',
    gu: 'અવાજમાં માહિતી સાંભળવાની સુવિધા',
  },
  audioGuideLine1: {
    en: 'Whenever you see the speaker button anywhere in the app, press it to hear the instructions in your language.',
    hi: 'ऐप में किसी भी जानकारी को आवाज में सुनने के लिए ऊपर दिखाए गए स्पीकर बटन को दबाएं।',
    mr: 'ॲपमध्ये कोणतीही माहिती आवाजात ऐकण्यासाठी वर दाखवलेले स्पीकर बटण दाबा.',
    gu: 'ઍપમાં કોઈપણ માહિતી અવાજમાં સાંભળવા માટે ઉપર દર્શાવેલ સ્પીકર બટન દબાવો.',
  },
  audioGuideLine2: {
    en: 'Press the test button below to hear how it works.',
    hi: 'नीचे दिया गया बटन दबाकर आवाज का परीक्षण करें।',
    mr: 'खालील बटण दाबून आवाजाची चाचणी घ्या.',
    gu: 'નીચે આપેલું બટન દબાવીને અવાજની ચકાસણી કરો.',
  },
  audioGuideTestBtn: {
    en: 'Test Audio Speaker',
    hi: 'स्पीकर की आवाज सुनें',
    mr: 'स्पीकरचा आवाज ऐका',
    gu: 'સ્પીકરનો અવાજ સાંભળો',
  },
  audioGuideSuccess: {
    en: 'Audio is working perfectly! Now let\'s continue.',
    hi: 'बहुत बढ़िया! आवाज सही चल रही है। अब आगे बढ़ते हैं।',
    mr: 'खूप छान! आवाज व्यवस्थित येत आहे. चला आता पुढे जाऊया.',
    gu: 'ખૂબ સરસ! અવાજ યોગ્ય રીતે આવી રહ્યો છે. ચાલો હવે આગળ વધીએ.',
  },
  audioGuideProceed: {
    en: 'Go to App',
    hi: 'ऐप में प्रवेश करें',
    mr: 'ॲपमध्ये प्रवेश करा',
    gu: 'ઍપમાં પ્રવેશ કરો',
  },

  // Login Page
  loginTitle: {
    en: 'Farmer Login',
    hi: 'किसान लॉगिन',
    mr: 'शेतकरी लॉगिन',
    gu: 'ખેડૂત લૉગિન',
  },
  loginSubtitle: {
    en: 'Enter your mobile number to get personalized farm advice and save your plans.',
    hi: 'अपनी फसल योजना सुरक्षित रखने के लिए मोबाइल नंबर दर्ज करें।',
    mr: 'आपली पीक योजना जतन ठेवण्यासाठी मोबाईल नंबर प्रविष्ट करा.',
    gu: 'તમારી પાક યોજના સાચવવા માટે મોબાઇલ નંબર દાખલ કરો.',
  },
  mobileNumberLabel: {
    en: 'Mobile Number',
    hi: 'मोबाइल नंबर',
    mr: 'मोबाईल नंबर',
    gu: 'મોબાઇલ નંબર',
  },
  sendOtp: {
    en: 'Send OTP',
    hi: 'ओटीपी प्राप्त करें',
    mr: 'ओटीपी मिळवा',
    gu: 'ઓટીપી મેળવો',
  },
  enterOtp: {
    en: 'Enter 6-Digit OTP',
    hi: '६ अंकों का ओटीपी दर्ज करें',
    mr: '६ अंकी ओटीपी टाका',
    gu: '૬ અંકનો ઓટીપી દાખલ કરો',
  },
  verifyOtp: {
    en: 'Verify & Login',
    hi: 'सत्यापित करें और आगे बढ़ें',
    mr: 'पडતાળણી करा आणि पुढे जा',
    gu: 'ચકાસો અને આગળ વધો',
  },
  guestBypass: {
    en: 'Continue without login',
    hi: 'लॉगिन के बिना जारी रखें',
    mr: 'लॉगिनशिवाय पुढे जा',
    gu: 'લૉગિન વિના આગળ વધો',
  },

  // Home Screen
  greeting: {
    en: 'Namaste, Kisan Bhai!',
    hi: 'नमस्ते, किसान भाई!',
    mr: 'नमस्कार, शेतकरी बांधवांनो!',
    gu: 'નમસ્તે, ખેડૂત મિત્ર!',
  },
  homeHeroTitle: {
    en: 'Which crop will give the highest profit in your field?',
    hi: 'आपके खेत में कौन सी फसल देगी सबसे अधिक मुनाफा?',
    mr: 'तुमच्या शेतात कोणते पीक देईल सर्वाधिक नफा?',
    gu: 'તમારા ખેતરમાં કયો પાક આપશે સૌથી વધુ નફો?',
  },
  homeHeroSub: {
    en: 'Get AI advice based on your soil, water, and mandi prices.',
    hi: 'अपनी मिट्टी, पानी और मंडी भाव के आधार पर सर्वोत्तम फसल जानें।',
    mr: 'आपली माती, पाणी आणि बाजारभावानुसार सर्वोत्तम पीक निवडा.',
    gu: 'તમારી જમીન, પાણી અને બજાર ભાવના આધારે શ્રેષ્ઠ પાક જાણો.',
  },
  getCropRecButton: {
    en: 'Get Crop Recommendation',
    hi: 'नई फसल की सलाह लें',
    mr: 'नवीन पिकाचा सल्ला घ्या',
    gu: 'નવા પાકની સલાહ મેળવો',
  },
  recentAnalysisTitle: {
    en: 'Your Last Crop Analysis',
    hi: 'आपका पिछला फसल विश्लेषण',
    mr: 'तुमचे मागील पीक विश्लेषण',
    gu: 'તમારું છેલ્લું પાક વિશ્લેષણ',
  },
  noPreviousAnalysis: {
    en: 'No previous analysis found. Tap the button above to get your first crop advice.',
    hi: 'अभी कोई पुराना विश्लेषण नहीं है। पहली बार सलाह लेने के लिए ऊपर दिया गया बटन दबाएं।',
    mr: 'अद्याप कोणतेही मागील विश्लेषण नाही. पहिला सल्ला घेण्यासाठी वरील बटण दाबा.',
    gu: 'હજુ સુધી કોઈ પાછલું વિશ્લેષણ નથી. પ્રથમ સલાહ મેળવવા માટે ઉપરનું બટન દબાવો.',
  },
  viewFullReport: {
    en: 'View Full Plan',
    hi: 'पूरी योजना देखें',
    mr: 'संपूर्ण योजना पहा',
    gu: 'સંપૂર્ણ યોજના જુઓ',
  },

  // Bottom Navigation
  navHome: {
    en: 'Home',
    hi: 'मुख्य पृष्ठ',
    mr: 'मुख्य पान',
    gu: 'મુખ્ય પૃષ્ઠ',
  },
  navWizard: {
    en: 'Crop Advice',
    hi: 'फसल सलाह',
    mr: 'पीक सल्ला',
    gu: 'પાક સલાહ',
  },
  navMyCrops: {
    en: 'My Crops',
    hi: 'मेरी फसलें',
    mr: 'माझी पिके',
    gu: 'મારા પાક',
  },

  // 1-Question Card Wizard
  // Card 1: Land Area
  card1Title: {
    en: 'How much land do you have for farming?',
    hi: 'आपके पास खेती के लिए कितनी जमीन है?',
    mr: 'आपल्याकडे शेतीसाठी किती जमीन आहे?',
    gu: 'તમારી પાસે ખેતી માટે કેટલી જમીન છે?',
  },
  card1Sub: {
    en: 'Select your farm size or type custom area.',
    hi: 'अपनी जमीन का आकार चुनें या लिखें।',
    mr: 'आपल्या जमिनीचे क्षेत्र निवडा किंवा लिहा.',
    gu: 'તમારી જમીનનું કદ પસંદ કરો અથવા લખો.',
  },
  acre: {
    en: 'Acre',
    hi: 'एकड़',
    mr: 'एकर',
    gu: 'એકર',
  },
  bigha: {
    en: 'Bigha',
    hi: 'बीघा',
    mr: 'बीघा',
    gu: 'વીઘા',
  },
  guntha: {
    en: 'Guntha',
    hi: 'गुंठा',
    mr: 'गुंठा',
    gu: 'ગુંઠા',
  },

  // Card 2: Soil Type
  card2Title: {
    en: 'What type of soil is in your field?',
    hi: 'आपके खेत की मिट्टी कैसी है?',
    mr: 'आपल्या शेतातील माती कोणत्या प्रकारची आहे?',
    gu: 'તમારા ખેતરની માટી કેવા પ્રકારની છે?',
  },
  card2Sub: {
    en: 'Look at the photos and choose the matching soil.',
    hi: 'फोटो देखकर अपनी मिट्टी से मिलती-जुलती मिट्टी चुनें।',
    mr: 'फोटो पाहून आपल्या मातीशी मिळतीजुळती माती निवडा.',
    gu: 'ફોટો જોઈને તમારી માટી સાથે મેળ ખાતી માટી પસંદ કરો.',
  },
  soilBlack: {
    en: 'Black Soil',
    hi: 'काली मिट्टी',
    mr: 'काळी माती',
    gu: 'કાળી માટી',
  },
  soilLoam: {
    en: 'Loam Soil',
    hi: 'दोमट मिट्टी',
    mr: 'गाळाची / दुमट माती',
    gu: 'ગોરાડુ માટી',
  },
  soilRed: {
    en: 'Red Soil',
    hi: 'लाल मिट्टी',
    mr: 'तांबडी माती',
    gu: 'લાલ માટી',
  },
  soilSandy: {
    en: 'Sandy Soil',
    hi: 'बलुई / रेतीली मिट्टी',
    mr: 'रेताड माती',
    gu: 'રેતાળ માટી',
  },
  soilClay: {
    en: 'Clay Soil',
    hi: 'चिकनी मिट्टी',
    mr: 'चिकनमाती',
    gu: 'ચીકણી માટી',
  },

  // Card 3: Water Availability & Source
  card3Title: {
    en: 'What is the water arrangement in your farm?',
    hi: 'आपके खेत में पानी की क्या व्यवस्था है?',
    mr: 'आपल्या शेतात पाण्याची काय सोय आहे?',
    gu: 'તમારા ખેતરમાં પાણીની શું વ્યવસ્થા છે?',
  },
  card3Sub: {
    en: 'Select your primary water source and capacity.',
    hi: 'सिंचाई का मुख्य साधन और पानी की उपलब्धता चुनें।',
    mr: 'सिंचनाचे मुख्य साधन आणि पाण्याची उपलब्धता निवडा.',
    gu: 'સિંચાઈનું મુખ્ય સાધન અને પાણીની ઉપલબ્ધતા પસંદ કરો.',
  },
  waterHigh: {
    en: 'Abundant Irrigation',
    hi: 'भरपूर पानी (नहर / बारहों महीने पानी)',
    mr: 'भरपूर पाणी (कालवा / बारमाही पाणी)',
    gu: 'વિપુલ પ્રમાણમાં પાણી (નહેર / બારમાસી)',
  },
  waterMedium: {
    en: 'Moderate Water',
    hi: 'मध्यम पानी (कुआं / ट्यूबवेल से सीमित सिंचाई)',
    mr: 'मध्यम पाणी (विहीर / बोअरवेल)',
    gu: 'મધ્યમ પાણી (કૂવો / બોરવેલ)',
  },
  waterRainfed: {
    en: 'Rainfed only',
    hi: 'केवल मानसूनी बारिश पर निर्भर',
    mr: 'केवळ पावसाच्या पाण्यावर अवलंबून',
    gu: 'માત્ર વરસાદી પાણી પર આધારિત',
  },

  // Card 4: Previous Crop
  card4Title: {
    en: 'Which crop did you harvest in the last season?',
    hi: 'पिछली बार खेत में कौन सी फसल लगाई थी?',
    mr: 'मागील हंगामात शेतात कोणते पीक घेतले होते?',
    gu: 'છેલ્લી ઋતુમાં ખેતરમાં કયો પાક લીધો હતો?',
  },
  card4Sub: {
    en: 'Crop rotation helps prevent disease and enhances soil fertility.',
    hi: 'फसल चक्र अपनाने से जमीन की उपजाऊ शक्ति बढ़ती है।',
    mr: 'पीक फेરબदल केल्याने जमिनीची सुपीकता वाढते.',
    gu: 'પાકની ફેરબદલી કરવાથી જમીનની ફળદ્રુપતા વધે છે.',
  },
  cropWheat: {
    en: 'Wheat',
    hi: 'गेहूं',
    mr: 'गहू',
    gu: 'ઘઉં',
  },
  cropGram: {
    en: 'Gram (Chana)',
    hi: 'चना',
    mr: 'हरभरा',
    gu: 'ચણા',
  },
  cropPaddy: {
    en: 'Paddy / Rice',
    hi: 'धान (चावल)',
    mr: 'भात',
    gu: 'ડાંગર',
  },
  cropSoybean: {
    en: 'Soybean',
    hi: 'सोयाबीन',
    mr: 'सोयाबीन',
    gu: 'સોયાબીન',
  },
  cropCotton: {
    en: 'Cotton',
    hi: 'कपास',
    mr: 'कापूस',
    gu: 'કપાસ',
  },
  cropOther: {
    en: 'Other / Fallow Land',
    hi: 'अन्य / खाली खेत',
    mr: 'इतर / पडीक जमीन',
    gu: 'અન્ય / પડતર જમીન',
  },

  // Card 5: When will you sow?
  card5Title: {
    en: 'When will you sow in your field?',
    hi: 'आप खेत में बुवाई कब करेंगे?',
    mr: 'तुम्ही शेतात पेरणी कधी करणार आहात?',
    gu: 'તમે ખેતરમાં વાવણી ક્યારે કરશો?',
  },
  card5Sub: {
    en: 'Select your sowing timeframe or pick a date to match weather forecasts.',
    hi: 'बुवाई का समय चुनें ताकि मानसूनी बारिश और तापमान के अनुसार सटीक सलाह मिल सके।',
    mr: 'पेरणीची वेळ निवडा जेणेकरून पावसाच्या अंदाजानुसार योग्य सल्ला मिळेल.',
    gu: 'વાવણીનો સમય પસંદ કરો જેથી વરસાદના આધારે યોગ્ય સલાહ મળી શકે.',
  },
  sowingTimingWeek: {
    en: 'This Week (Next 7 Days)',
    hi: 'इसी हफ्ते (अगले ७ दिनों में)',
    mr: 'याच आठवड्यात (पुढील ७ दिवसांत)',
    gu: 'આ જ અઠવાડિયે (આગામી ૭ દિવસમાં)',
  },
  sowingTimingMonth: {
    en: 'Within the Next Month',
    hi: 'अगले एक महीने में',
    mr: 'पुढील एका महिन्यात',
    gu: 'આગામી એક મહિનામાં',
  },
  sowingTimingCustomDate: {
    en: 'Pick Date (Around which date will you sow?)',
    hi: 'तारीख चुनें (किस तारीख के आस-पास बुवाई करोगे?)',
    mr: 'तारीख निवडा (कोणत्या तारखेच्या आसपास पेरणी करणार?)',
    gu: 'તારીખ પસંદ કરો (કઈ તારીખની આસપાસ વાવણી કરશો?)',
  },
  seeRecommendations: {
    en: 'Show AI Recommendations',
    hi: 'सर्वोत्तम फसल विकल्प देखें',
    mr: 'सर्वोत्तम पीक पर्याय पहा',
    gu: 'શ્રેષ્ઠ પાક વિકલ્પો જુઓ',
  },

  // Recommendations Screen
  topChoiceBadge: {
    en: 'TOP RECOMMENDATION',
    hi: 'सर्वोत्तम फसल विकल्प',
    mr: 'सर्वोत्कृष्ट पीक पर्याय',
    gu: 'શ્રેષ્ઠ પાક વિકલ્પ',
  },
  estimatedProfit: {
    en: 'Estimated Profit',
    hi: 'अनुमानित शुद्ध लाभ',
    mr: 'अंदाजे निव्वळ नफा',
    gu: 'અંદાજિત ચોખ્ખો નફો',
  },
  estimatedYield: {
    en: 'Expected Yield',
    hi: 'अनुमानित पैदावार',
    mr: 'अपेक्षित उत्पन्न',
    gu: 'અંદાજિત ઉપજ',
  },
  estimatedCost: {
    en: 'Estimated Cost',
    hi: 'अनुमानित लागत',
    mr: 'अंदाजे उत्पादन खर्च',
    gu: 'અંદાજિત ખર્ચ',
  },
  duration: {
    en: 'Crop Duration',
    hi: 'फसल अवधि',
    mr: 'पिकाचा कालावधी',
    gu: 'પાકનો સમયગાળો',
  },
  days: {
    en: 'Days',
    hi: 'दिन',
    mr: 'दिवस',
    gu: 'દિવસ',
  },
  perAcre: {
    en: '/ acre',
    hi: '/ एकड़',
    mr: '/ एकर',
    gu: '/ એકર',
  },
  quintal: {
    en: 'Quintals',
    hi: 'क्विंटल',
    mr: 'क्विंटल',
    gu: 'ક્વિન્ટલ',
  },
  costBreakdownTitle: {
    en: 'Itemized Cost Breakdown',
    hi: 'विस्तृत लागत विवरण (बीज, खाद, मजदूरी)',
    mr: 'तपशीलवार खर्च (बियाणे, खते, मजुरी)',
    gu: 'વિગતવાર ખર્ચ વિગત (બિયારણ, ખાતર, મજૂરી)',
  },
  seedCost: {
    en: 'Seed Cost',
    hi: 'बीज लागत',
    mr: 'बियाणे खर्च',
    gu: 'બિયારણ ખર્ચ',
  },
  fertilizerCost: {
    en: 'Fertilizer & Nutrients',
    hi: 'खाद व उर्वरक',
    mr: 'खते व पोषण',
    gu: 'ખાતર અને પોષણ',
  },
  pesticideCost: {
    en: 'Pesticide & Plant Health',
    hi: 'कीटनाशक व रोग नियंत्रण',
    mr: 'कीटकनाशके व रोग नियंत्रण',
    gu: 'જંતુનાશકો અને રોગ નિયંત્રણ',
  },
  machineryCost: {
    en: 'Tractor & Machinery',
    hi: 'जुताई व मशीनरी',
    mr: 'नांगरणी व यंत्रसामग्री',
    gu: 'ખેડ અને મશીનરી',
  },
  labourCost: {
    en: 'Labour & Weeding',
    hi: 'मजदूरी व निराई',
    mr: 'मजुरी व खुरपणी',
    gu: 'મજૂરી અને નીંદણ',
  },
  irrigationCost: {
    en: 'Irrigation & Power',
    hi: 'सिंचाई व बिजली',
    mr: 'पाणी व वीज',
    gu: 'સિંચાઈ અને વીજળી',
  },
  whyRecommendedTitle: {
    en: 'Why AI Selected This Crop',
    hi: 'एआई द्वारा चयन का कारण',
    mr: 'एआय द्वारे निवडीचे कारण',
    gu: 'એઆઈ દ્વારા પસંદગીનું કારણ',
  },
  testWhatIfBtn: {
    en: 'Test Weather Risk (What-If)',
    hi: 'मौसम जोखिम जांचें (What-If)',
    mr: 'हवामान जोखीम तपासा (What-If)',
    gu: 'હવામાન જોખમ ચકાસો (What-If)',
  },
  chooseAndPlanBtn: {
    en: 'Select Crop & View 120-Day Plan',
    hi: 'यह फसल चुनें और कार्य-योजना देखें',
    mr: 'हे पीक निवडा आणि कार्ययोजना पहा',
    gu: 'આ પાક પસંદ કરો અને યોજના જુઓ',
  },

  // 120-Day Action Plan
  planTitle: {
    en: '120-Day Crop Action Plan',
    hi: 'आपकी 120 दिवसीय फसल कार्य-योजना',
    mr: 'तुमची १२० दिवसांची पीक कृती योजना',
    gu: 'તમારી ૧૨૦ દિવસની પાક કાર્ય યોજના',
  },
  planSubtitle: {
    en: 'Tap on any stage to hear detailed audio instructions.',
    hi: 'प्रत्येक चरण पर क्लिक करके आवाज में विस्तृत निर्देश सुनें।',
    mr: 'प्रत्येक टप्प्यावर क्लिक करून आवाजात सविस्तर सूचना ऐका.',
    gu: 'દરેક તબક્કા પર ક્લિક કરીને અવાજમાં વિગતવાર સૂચનાઓ સાંભળો.',
  },
  printPdfBtn: {
    en: 'Print / Download Advisory Slip (PDF)',
    hi: 'कृषि सलाह पर्ची डाउनलोड / प्रिंट करें (PDF)',
    mr: 'कृषी सल्ला पावती डाउनलोड / प्रिंट करा (PDF)',
    gu: 'કૃષિ સલાહ કાપલી ડાઉનલોડ / પ્રિન્ટ કરો (PDF)',
  },
  shareWhatsappBtn: {
    en: 'Share on WhatsApp',
    hi: 'व्हाट्सएप पर साझा करें',
    mr: 'व्हॉट्सॲपवर शेअर करा',
    gu: 'વોટ્સએપ પર શેર કરો',
  },
  backToHomeBtn: {
    en: 'Back to Home',
    hi: 'मुख्य पृष्ठ पर लौटें',
    mr: 'मुख्य पानावर परत जा',
    gu: 'મુખ્ય પૃષ્ઠ પર પાછા જાઓ',
  },

  // "मेरी फसलें" (My Crops)
  myCropsTitle: {
    en: 'My Crops & Previous Analyses',
    hi: 'मेरी फसलें (पुराने विश्लेषण)',
    mr: 'माझी पिके (मागील विश्लेषण)',
    gu: 'મારા પાક (પાછલા વિશ્લેષણ)',
  },
  myCropsSub: {
    en: 'View and manage your saved crop advisory records.',
    hi: 'अपनी सभी सुरक्षित फसल योजनाओं का विवरण देखें।',
    mr: 'आपल्या सर्व जतन केलेल्या पीक योजनांची माहिती पहा.',
    gu: 'તમારી તમામ સાચવેલ પાક યોજનાઓની વિગત જુઓ.',
  },
};

/**
 * Helper to retrieve localized text by key and language code with automatic fallback.
 */
export function getTranslation(key: string, lang: SupportedLanguage = 'hi'): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry['hi'] || entry['en'] || key;
}