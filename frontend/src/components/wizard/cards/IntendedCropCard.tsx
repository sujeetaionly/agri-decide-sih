import React, { useState, useMemo } from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { startVoiceRecognition, VoiceRecognitionSession } from '../../../lib/speech';

interface CropItem {
  id: string;
  title: string;
  titleMr: string;
  titleGu: string;
  titleRaj: string;
  emoji?: string;
  category: string;
  categoryMr: string;
  categoryGu: string;
  categoryRaj: string;
  keywords: string[];
}

export const IntendedCropCard: React.FC = () => {
  const { farmData, updateFarmData, fetchRecommendations, isLoadingRecommendation, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListeningVoiceSearch, setIsListeningVoiceSearch] = useState(false);
  const [voiceSession, setVoiceSession] = useState<VoiceRecognitionSession | null>(null);

  const selectedList = farmData.intendedCrops || [];
  const isSelectedAny = selectedList.length > 0;

  // Primary 10 Local/Regional Crops
  const PRIMARY_CROPS: CropItem[] = [
    {
      id: 'SOYBEAN',
      title: 'सोयाबीन',
      titleMr: 'सोयाबीन',
      titleGu: 'સોયાબીન',
      titleRaj: 'सोयाबीन',
      emoji: '🌱',
      category: 'तिलहन फसल',
      categoryMr: 'गळीतधान्य',
      categoryGu: 'તેલીબિયાં પાક',
      categoryRaj: 'तेल री फसल',
      keywords: ['सोयाबीन', 'soybean', 'सोयाबिन', 'soyabean'],
    },
    {
      id: 'COTTON',
      title: 'कपास',
      titleMr: 'कापूस',
      titleGu: 'કપાસ',
      titleRaj: 'कपास (रूई)',
      emoji: '☁️',
      category: 'नकदी फसल',
      categoryMr: 'नगदी पीक',
      categoryGu: 'રોકડિયો પાક',
      categoryRaj: 'नकदी फसल',
      keywords: ['कपास', 'cotton', 'कापूस', 'रूई', 'રૂ'],
    },
    {
      id: 'MAIZE',
      title: 'मक्का',
      titleMr: 'मका',
      titleGu: 'મકાઈ',
      titleRaj: 'मक्की',
      emoji: '🌽',
      category: 'मोटा अनाज',
      categoryMr: 'तृणधान्य',
      categoryGu: 'જાડું ધાન્ય',
      categoryRaj: 'मोटा अनाज',
      keywords: ['मक्का', 'maize', 'corn', 'मका', 'મકાઈ', 'भुट्टा', 'मक्की'],
    },
    {
      id: 'GROUNDNUT',
      title: 'मूंगफली',
      titleMr: 'भुईमूग',
      titleGu: 'મગફળી',
      titleRaj: 'मूंगफली',
      emoji: '🥜',
      category: 'तिलहन फसल',
      categoryMr: 'गळीतधान्य',
      categoryGu: 'તેલીબિયાં પાક',
      categoryRaj: 'तेल री फसल',
      keywords: ['मूंगफली', 'groundnut', 'peanut', 'भुईमूग', 'મગફળી'],
    },
    {
      id: 'PADDY',
      title: 'धान (चावल)',
      titleMr: 'भात (धान)',
      titleGu: 'ડાંગર (ચોખા)',
      titleRaj: 'धान (चावल)',
      emoji: '🌾',
      category: 'खरीफ खाद्यान्न',
      categoryMr: 'खरीप धान्य',
      categoryGu: 'ખરીફ અનાજ',
      categoryRaj: 'खरीफ खाद्यान्न',
      keywords: ['धान', 'चावल', 'rice', 'paddy', 'भात', 'ડાંગર', 'ચોખા'],
    },
    {
      id: 'BAJRA',
      title: 'बाजरा',
      titleMr: 'बाजरी',
      titleGu: 'બાજરી',
      titleRaj: 'बाजरी',
      emoji: '🌾',
      category: 'शुष्क अनाज',
      categoryMr: 'कोरडवाहू धान्य',
      categoryGu: 'બાજરી પાક',
      categoryRaj: 'शुष्क अनाज',
      keywords: ['बाजरा', 'bajra', 'बाजरी', 'બાજરી', 'millet'],
    },
    {
      id: 'TUR',
      title: 'अरहर (तुअर)',
      titleMr: 'तूर (अरहर)',
      titleGu: 'તુવેર',
      titleRaj: 'अरहर (तुअर)',
      emoji: '🫘',
      category: 'दलहन फसल',
      categoryMr: 'कडधान्य पीक',
      categoryGu: 'કઠોળ પાક',
      categoryRaj: 'दाल री फसल',
      keywords: ['अरहर', 'तुअर', 'tur', 'arhar', 'तूर', 'તુવેર', 'तूवर'],
    },
    {
      id: 'GRAM',
      title: 'चना',
      titleMr: 'हरभरा (चना)',
      titleGu: 'ચણા',
      titleRaj: 'चणो',
      emoji: '🫘',
      category: 'दलहन फसल',
      categoryMr: 'कडधान्य पीक',
      categoryGu: 'કઠોળ પાક',
      categoryRaj: 'दाल री फसल',
      keywords: ['चना', 'gram', 'हरभरा', 'chana', 'चणा', 'छोला', 'चणो'],
    },
    {
      id: 'WHEAT',
      title: 'गेहूं',
      titleMr: 'गहू',
      titleGu: 'ઘઉં',
      titleRaj: 'गेहूं',
      emoji: '🌾',
      category: 'रबी अनाज',
      categoryMr: 'रब्बी धान्य',
      categoryGu: 'રવી ધાન્ય',
      categoryRaj: 'रबी अनाज',
      keywords: ['गेहूं', 'wheat', 'गहू', 'ઘઉં', 'गेहू'],
    },
    {
      id: 'MUSTARD',
      title: 'सरसों',
      titleMr: 'मोहरी',
      titleGu: 'રાઈ',
      titleRaj: 'रायड़ो',
      emoji: '🌼',
      category: 'तिलहन फसल',
      categoryMr: 'गळीतधान्य',
      categoryGu: 'તેલીબિયાં પાક',
      categoryRaj: 'तेल री फसल',
      keywords: ['सरसों', 'mustard', 'मोहरी', 'રાઈ', 'रायड़ो', 'राई'],
    },
  ];

  // Extended Crops Database for "अन्य फसल" Modal Sheet
  const EXTENDED_CROPS: CropItem[] = [
    {
      id: 'MOONG',
      title: 'मूंग',
      titleMr: 'मूग',
      titleGu: 'મગ',
      titleRaj: 'मूंग',
      category: 'दलहन फसल',
      categoryMr: 'कडधान्य पीक',
      categoryGu: 'કઠોળ પાક',
      categoryRaj: 'दाल री फसल',
      keywords: ['मूंग', 'moong', 'मूग', 'મગ', 'mug'],
    },
    {
      id: 'URAD',
      title: 'उड़द',
      titleMr: 'उडीद',
      titleGu: 'અડદ',
      titleRaj: 'उड़द',
      category: 'दलहन फसल',
      categoryMr: 'कडधान्य पीक',
      categoryGu: 'કઠોળ પાક',
      categoryRaj: 'दाल री फसल',
      keywords: ['उड़द', 'urad', 'उडीद', 'અડદ'],
    },
    {
      id: 'JOWAR',
      title: 'ज्वार',
      titleMr: 'ज्वारी',
      titleGu: 'જુવાર',
      titleRaj: 'ज्वार',
      category: 'मोटा अनाज',
      categoryMr: 'तृणधान्य',
      categoryGu: 'જાડું ધાન્ય',
      categoryRaj: 'मोटा अनाज',
      keywords: ['ज्वार', 'jowar', 'ज्वारी', 'જુવાર', 'sorghum'],
    },
    {
      id: 'SUGARCANE',
      title: 'गन्ना',
      titleMr: 'ऊस',
      titleGu: 'શેરડી',
      titleRaj: 'गन्नो',
      category: 'वार्षिक नकदी फसल',
      categoryMr: 'नगदी पीक',
      categoryGu: 'રોકડિયો પાક',
      categoryRaj: 'नकदी फसल',
      keywords: ['गन्ना', 'sugarcane', 'ऊस', 'શેરડી', 'गन्नो'],
    },
    {
      id: 'SUNFLOWER',
      title: 'सूरजमुखी',
      titleMr: 'सूर्यफूल',
      titleGu: 'સૂર્યમુખી',
      titleRaj: 'सूरजमुखी',
      category: 'तिलहन फसल',
      categoryMr: 'गळीतधान्य',
      categoryGu: 'તેલીબિયાં પાક',
      categoryRaj: 'तेल री फसल',
      keywords: ['सूरजमुखी', 'sunflower', 'सूर्यफूल', 'સૂર્યમુખી'],
    },
    {
      id: 'ONION',
      title: 'प्याज',
      titleMr: 'कांदा',
      titleGu: 'ડુંગળી',
      titleRaj: 'कांदो',
      category: 'बागवानी फसल',
      categoryMr: 'भाजीपाला',
      categoryGu: 'શાકભાજી',
      categoryRaj: 'सब्जी फसल',
      keywords: ['प्याज', 'onion', 'कांदा', 'ડુંગળી', 'कांदो'],
    },
    {
      id: 'TOMATO',
      title: 'टमाटर',
      titleMr: 'टोमॅटो',
      titleGu: 'ટામેટા',
      titleRaj: 'टमाटर',
      category: 'सब्जी फसल',
      categoryMr: 'भाजीपाला',
      categoryGu: 'શાકભાજી',
      categoryRaj: 'सब्जी फसल',
      keywords: ['टमाटर', 'tomato', 'टोमॅटो', 'ટામેટા'],
    },
  ];

  const getCropTitle = (c: CropItem) => {
    if (language === 'mr') return c.titleMr;
    if (language === 'gu') return c.titleGu;
    if (language === 'raj') return c.titleRaj;
    return c.title;
  };

  const getCropCategory = (c: CropItem) => {
    if (language === 'mr') return c.categoryMr;
    if (language === 'gu') return c.categoryGu;
    if (language === 'raj') return c.categoryRaj;
    return c.category;
  };

  const handleToggleCrop = (cropId: string) => {
    triggerHaptic('medium');
    let updated: string[];

    if (cropId === 'NOT_SURE') {
      updated = selectedList.includes('NOT_SURE') ? [] : ['NOT_SURE'];
    } else {
      const filtered = selectedList.filter((id) => id !== 'NOT_SURE');
      if (filtered.includes(cropId)) {
        updated = filtered.filter((id) => id !== cropId);
      } else {
        updated = [...filtered, cropId];
      }
    }

    updateFarmData({ intendedCrops: updated });
  };

  // Filtered extended crops for modal
  const filteredExtendedCrops = useMemo(() => {
    if (!searchQuery.trim()) return EXTENDED_CROPS;
    const q = searchQuery.toLowerCase().trim();
    return EXTENDED_CROPS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.titleMr.toLowerCase().includes(q) ||
        c.titleGu.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Voice Search inside Modal
  const handleVoiceSearchInModal = () => {
    triggerHaptic('medium');
    if (isListeningVoiceSearch) {
      if (voiceSession) voiceSession.stop();
      setIsListeningVoiceSearch(false);
      return;
    }

    setIsListeningVoiceSearch(true);
    const session = startVoiceRecognition(
      language,
      (text: string, isFinal: boolean) => {
        setSearchQuery(text);
        
        // Check if directly matched any extended or primary crop
        const lower = text.toLowerCase();
        const allList = [...PRIMARY_CROPS, ...EXTENDED_CROPS];
        const matched = allList.find((c) => c.keywords.some((kw) => lower.includes(kw.toLowerCase())));

        if (matched) {
          triggerHaptic('success');
          handleToggleCrop(matched.id);
          setIsOtherModalOpen(false);
        }

        if (isFinal) {
          setIsListeningVoiceSearch(false);
        }
      },
      (err) => {
        console.warn('Speech recognition error:', err);
        setIsListeningVoiceSearch(false);
      },
      () => {
        setIsListeningVoiceSearch(false);
      }
    );

    setVoiceSession(session);
  };

  const handleSelectCustomQuery = () => {
    if (!searchQuery.trim()) return;
    triggerHaptic('success');
    const customId = searchQuery.trim().toUpperCase();
    handleToggleCrop(customId);
    setSearchQuery('');
    setIsOtherModalOpen(false);
  };

  const isOtherActive = selectedList.some((id) => !PRIMARY_CROPS.map((p) => p.id).includes(id) && id !== 'NOT_SURE');
  const allKnownCrops = [...PRIMARY_CROPS, ...EXTENDED_CROPS];
  const otherSelectedCropObjs = selectedList
    .filter((id) => !PRIMARY_CROPS.some((p) => p.id === id) && id !== 'NOT_SURE')
    .map((id) => {
      const found = allKnownCrops.find((c) => c.id === id);
      return found ? getCropTitle(found) : id;
    });

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Question Title & Reassurance Subtitle */}
      <div className="space-y-1.5 pt-1 pb-1">
        <h2 className="text-2xl font-black font-headline text-stone-900 dark:text-stone-100 leading-snug">
          {t('card6Title')}
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          {t('card6Sub')}
        </p>
      </div>

      {/* 2-Column Clean, Compact Crop Tiles */}
      <div className="grid grid-cols-2 gap-2.5">
        {PRIMARY_CROPS.map((c) => {
          const isSelected = selectedList.includes(c.id);
          const cropTitle = getCropTitle(c);

          return (
            <div
              key={c.id}
              onClick={() => handleToggleCrop(c.id)}
              className={`py-3.5 px-4 rounded-2xl border-2 transition-all cursor-pointer select-none active:scale-[0.98] flex items-center justify-between gap-2 shadow-2xs ${
                isSelected
                  ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-xs ring-2 ring-primary/15'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
              }`}
            >
              <h3 className="text-sm sm:text-base font-black font-headline text-stone-900 dark:text-stone-100 leading-tight">
                {cropTitle}
              </h3>

              <div
                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-primary border-primary text-white shadow-xs'
                    : 'border-stone-300 dark:border-stone-600 bg-transparent'
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-xs font-black leading-none">
                    check
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Dedicated "अन्य फसल..." Full-Width Trigger Card */}
        <div
          onClick={() => {
            triggerHaptic('medium');
            setIsOtherModalOpen(true);
          }}
          className={`col-span-2 p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none active:scale-[0.98] flex items-center justify-between ${
            isOtherActive
              ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-sm ring-2 ring-primary/20'
              : 'bg-white dark:bg-[#1E231B] border-dashed border-stone-300 dark:border-stone-700 hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-xl">add_circle</span>
            </div>
            <div>
              <h3 className="text-base font-black font-headline text-stone-950 dark:text-stone-50 leading-tight">
                {isOtherActive && otherSelectedCropObjs.length > 0
                  ? `अन्य: ${otherSelectedCropObjs.join(', ')}`
                  : t('otherCrop')}
              </h3>
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block mt-0.5">
                {t('otherCropSub')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-sm">search</span>
            <span>खोजें</span>
          </div>
        </div>

        {/* Dedicated "निश्चित नहीं / सर्वोत्तम सुझाव दें" Full-Width Card */}
        <div
          onClick={() => handleToggleCrop('NOT_SURE')}
          className={`col-span-2 p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none active:scale-[0.98] flex items-center justify-between ${
            selectedList.includes('NOT_SURE')
              ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-sm ring-2 ring-primary/20'
              : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <h3 className="text-base font-black font-headline text-stone-950 dark:text-stone-50 leading-tight">
              {t('notDecided')}
            </h3>
          </div>

          <div
            className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
              selectedList.includes('NOT_SURE')
                ? 'bg-primary border-primary text-white shadow-xs'
                : 'border-stone-300 dark:border-stone-600 bg-transparent'
            }`}
          >
            {selectedList.includes('NOT_SURE') && (
              <span className="material-symbols-outlined text-xs font-black leading-none">
                check
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 🌟 "अन्य फसल चुनें" (Other Crop Modal Sheet Designed like Language Selection) */}
      {isOtherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-[32px] p-6 shadow-2xl border border-stone-200 dark:border-stone-700 space-y-5 animate-scaleUp max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3.5 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">psychology_alt</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black font-headline text-stone-900 dark:text-stone-100 tracking-tight">
                  {t('chooseOtherCropTitle')}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsOtherModalOpen(false);
                }}
                className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Search & Integrated Voice Bar */}
            <div className="space-y-2.5 flex-shrink-0">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-stone-400 text-xl pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchCropPlaceholder')}
                  className="w-full pl-11 pr-10 py-3 bg-stone-100/90 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 w-6 h-6 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">clear</span>
                  </button>
                )}
              </div>

              {/* Bol Ke Bataye Voice Search Button */}
              <button
                type="button"
                onClick={handleVoiceSearchInModal}
                className={`w-full py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold tracking-wide transition-all cursor-pointer border shadow-xs ${
                  isListeningVoiceSearch
                    ? 'bg-red-600 text-white border-red-600 animate-pulse'
                    : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 active:scale-[0.98]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {isListeningVoiceSearch ? 'mic' : 'keyboard_voice'}
                </span>
                <span>{isListeningVoiceSearch ? 'सुन रहे हैं... बोलें' : t('speakCropName')}</span>
              </button>
            </div>

            {/* Extended Crops Scrollable Grid */}
            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {/* Dynamic Add Custom Crop if searched */}
              {searchQuery.trim() && (
                <div
                  onClick={handleSelectCustomQuery}
                  className="p-3.5 rounded-2xl bg-primary/10 border-2 border-primary text-primary font-bold text-sm flex items-center justify-between cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined">add_task</span>
                    <span>"{searchQuery.trim()}" फसल जोड़ें</span>
                  </div>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                {filteredExtendedCrops.map((c) => {
                  const isSelected = selectedList.includes(c.id);
                  const cropTitle = getCropTitle(c);

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        handleToggleCrop(c.id);
                        setIsOtherModalOpen(false);
                      }}
                      className={`py-3 px-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none active:scale-[0.98] flex items-center justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-primary/10 border-primary dark:bg-primary/20 dark:border-primary shadow-xs ring-2 ring-primary/20'
                          : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-primary/40'
                      }`}
                    >
                      <h4 className="text-sm font-black font-headline text-stone-900 dark:text-stone-100 leading-tight">
                        {cropTitle}
                      </h4>

                      <div
                        className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-primary border-primary text-white shadow-xs'
                            : 'border-stone-300 dark:border-stone-600 bg-transparent'
                        }`}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-xs font-black leading-none">
                            check
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsOtherModalOpen(false)}
                className="w-full py-3 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs cursor-pointer hover:bg-stone-200"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
