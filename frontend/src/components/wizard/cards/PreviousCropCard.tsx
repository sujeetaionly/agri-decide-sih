import React, { useState } from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { speakText, startVoiceRecognition, VoiceRecognitionSession } from '../../../lib/speech';

export const PreviousCropCard: React.FC = () => {
  const { farmData, updateFarmData, nextCard, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const [isListening, setIsListening] = useState(false);
  const [voiceSession, setVoiceSession] = useState<VoiceRecognitionSession | null>(null);
  const [transcriptFeedback, setTranscriptFeedback] = useState<string>('');

  const selectedList = farmData.previousCrops || [];
  const isSelectedAny = selectedList.length > 0;

  const CROPS = [
    {
      id: 'WHEAT',
      title: 'गेहूं',
      titleMr: 'गहू',
      titleGu: 'ઘઉં',
      category: 'अनाज वर्ग',
      icon: 'grain',
      iconBg: 'bg-amber-500/15 text-amber-600',
      keywords: ['गेहूं', 'wheat', 'गहू', 'ઘઉં', 'गेहू'],
    },
    {
      id: 'GRAM',
      title: 'चना',
      titleMr: 'हरभरा (चना)',
      titleGu: 'ચણા',
      category: 'दलहन फसल',
      icon: 'spa',
      iconBg: 'bg-emerald-500/15 text-emerald-600',
      keywords: ['चना', 'gram', 'हरभरा', 'chana', 'चणा', 'छोला'],
    },
    {
      id: 'PADDY',
      title: 'धान (चावल)',
      titleMr: 'भात (धान)',
      titleGu: 'ડાંગર (ચોખા)',
      category: 'मुख्य खाद्यान्न',
      icon: 'grass',
      iconBg: 'bg-green-500/15 text-green-600',
      keywords: ['धान', 'चावल', 'rice', 'paddy', 'भात', 'ડાંગર', 'ચોખા'],
    },
    {
      id: 'SOYBEAN',
      title: 'सोयाबीन',
      titleMr: 'सोयाबीन',
      titleGu: 'સોયાબીન',
      category: 'तिलहन फसल',
      icon: 'eco',
      iconBg: 'bg-lime-500/15 text-lime-600',
      keywords: ['सोयाबीन', 'soybean', 'सोयाबिन', 'soyabean'],
    },
    {
      id: 'COTTON',
      title: 'कपास',
      titleMr: 'कापूस',
      titleGu: 'કપાસ',
      category: 'नकदी फसल',
      icon: 'cloud',
      iconBg: 'bg-sky-500/15 text-sky-600',
      keywords: ['कपास', 'cotton', 'कापूस', 'रूई'],
    },
    {
      id: 'MAIZE',
      title: 'मक्का',
      titleMr: 'मका',
      titleGu: 'મકાઈ',
      category: 'मोटा अनाज',
      icon: 'yard',
      iconBg: 'bg-yellow-500/15 text-yellow-600',
      keywords: ['मक्का', 'maize', 'corn', 'मका', 'મકાઈ', 'भुट्टा'],
    },
    {
      id: 'BAJRA',
      title: 'बाजरा',
      titleMr: 'बाजरी',
      titleGu: 'બાજરી',
      category: 'शुष्क अनाज',
      icon: 'filter_vintage',
      iconBg: 'bg-orange-500/15 text-orange-600',
      keywords: ['बाजरा', 'bajra', 'बाजरी', 'બાજરી', 'millet'],
    },
    {
      id: 'OTHER',
      title: 'अन्य / खाली खेत',
      titleMr: 'इतर / पडीक शेत',
      titleGu: 'અન્ય / ખાલી ખેતર',
      category: 'खाली खेत',
      icon: 'landscape',
      iconBg: 'bg-stone-500/15 text-stone-600',
      keywords: ['अन्य', 'खाली', 'पडीक', 'none', 'empty', 'कुछ नहीं'],
    },
  ];

  const handleToggleCrop = (cropId: string) => {
    triggerHaptic('medium');
    let updated: string[];

    if (cropId === 'OTHER') {
      // Toggle "OTHER" exclusively or clear
      updated = selectedList.includes('OTHER') ? [] : ['OTHER'];
    } else {
      const filtered = selectedList.filter((id) => id !== 'OTHER');
      if (filtered.includes(cropId)) {
        updated = filtered.filter((id) => id !== cropId);
      } else {
        updated = [...filtered, cropId];
      }
    }

    updateFarmData({ previousCrops: updated });
  };

  // Voice Input Speech Detection Handler
  const handleToggleVoice = () => {
    triggerHaptic('medium');
    if (isListening) {
      if (voiceSession) voiceSession.stop();
      setIsListening(false);
      return;
    }

    setTranscriptFeedback('सुन रहे हैं... बोलिए (जैसे: "गेहूं और चना")');
    setIsListening(true);

    const session = startVoiceRecognition(
      language,
      (text: string, isFinal: boolean) => {
        setTranscriptFeedback(text);
        
        // Multi-crop auto detection parser
        const lower = text.toLowerCase();
        const detectedIds: string[] = [];

        CROPS.forEach((crop) => {
          const matched = crop.keywords.some((kw) => lower.includes(kw.toLowerCase()));
          if (matched) {
            detectedIds.push(crop.id);
          }
        });

        if (detectedIds.length > 0) {
          triggerHaptic('success');
          // Merge newly detected with existing selections
          const combined = Array.from(new Set([...selectedList.filter(id => id !== 'OTHER'), ...detectedIds]));
          updateFarmData({ previousCrops: combined });
        }

        if (isFinal) {
          setIsListening(false);
        }
      },
      (err) => {
        console.warn('Speech recognition error:', err);
        setTranscriptFeedback('आवाज पहचानने में समस्या। कृपया बटन दबाकर फसल चुनें।');
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    setVoiceSession(session);
  };

  const selectedCropObjs = CROPS.filter((c) => selectedList.includes(c.id));
  const selectedTitles = selectedCropObjs.map((c) =>
    language === 'mr' ? c.titleMr : language === 'gu' ? c.titleGu : c.title
  );

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = isSelectedAny
      ? `${t('card4Title')}। वर्तमान चयन ${selectedTitles.join(', ')} है।`
      : `${t('card4Title')}। फसल चक्र अपनाने से जमीन की उपजाऊ शक्ति और पोषण संतुलित रहता है।`;
    speakText(msg, language);
  };

  const handleContinue = () => {
    if (!isSelectedAny) return;
    triggerHaptic('success');
    nextCard();
  };

  const handleBack = () => {
    triggerHaptic('light');
    prevCard();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      
      {/* Question Title & Reassurance Subtitle with Audio */}
      <div className="space-y-2 pb-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug flex-1">
            {t('card4Title')}
          </h2>
          <button
            type="button"
            onClick={handleAudio}
            className="flex-shrink-0 h-8 flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-stone-100 dark:bg-stone-800 px-3 rounded-full border border-stone-300 dark:border-stone-700 active:scale-95 hover:bg-stone-200 cursor-pointer shadow-2xs mt-0.5"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          फसल चक्र (Crop Rotation) से जमीन की उपजाऊ शक्ति और पोषण संतुलित रहता है।
        </p>
      </div>

      {/* Clean Voice Recognition Bar */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`w-full py-3 px-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
            isListening
              ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300 shadow-md animate-pulse'
              : 'bg-white dark:bg-[#1E231B] border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-600'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isListening ? 'bg-red-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isListening ? 'mic' : 'mic_none'}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold font-headline">
                {isListening ? 'सुन रहे हैं... फसल बोलें' : 'बोलकर फसल चुनें'}
              </h3>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500">
            {isListening ? '● सक्रिय' : 'माइक दबाएं'}
          </span>
        </button>

        {transcriptFeedback && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-500/30 animate-fadeIn">
            <span className="material-symbols-outlined text-base text-emerald-600">record_voice_over</span>
            <span className="truncate">पहचाना गया: "{transcriptFeedback}"</span>
          </div>
        )}
      </div>

      {/* Clean 2-Column Crop Selection Tiles (No Meaningless Icons) */}
      <div className="grid grid-cols-2 gap-3">
        {CROPS.map((c) => {
          const isSelected = selectedList.includes(c.id);
          const cropTitle = language === 'mr' ? c.titleMr : (language === 'gu' ? c.titleGu : c.title);

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleToggleCrop(c.id)}
              className={`h-14 px-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-left active:scale-[0.98] shadow-2xs ${
                isSelected
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-700 dark:border-emerald-500 shadow-md ring-2 ring-emerald-700/20'
                  : 'bg-white dark:bg-[#1E231B] border-stone-300 dark:border-stone-700 hover:border-emerald-600/50'
              }`}
            >
              <span className="text-sm font-extrabold text-[#1A1C18] dark:text-[#E2E3DC] font-headline">
                {cropTitle}
              </span>

              <div
                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'border-stone-400 dark:border-stone-500 bg-transparent'
                }`}
              >
                {isSelected && <span className="material-symbols-outlined text-xs font-black">check</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* True Progressive Blur Layer with Gradient Mask */}
      <div
        className="fixed bottom-16 inset-x-0 z-30 pointer-events-none max-w-md mx-auto h-28"
        style={{
          background: 'linear-gradient(to top, rgba(249,249,246,0.95) 20%, rgba(249,249,246,0.7) 60%, transparent 100%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Action Buttons Floating on top of Progressive Blur */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto pb-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="py-3.5 px-5 rounded-full bg-white/95 dark:bg-[#1E231B]/95 backdrop-blur-sm border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>{t('back')}</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!isSelectedAny}
            className={`flex-1 py-3.5 px-6 rounded-full font-extrabold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
              isSelectedAny
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-[0.98] cursor-pointer'
                : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{t('continue')}</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
