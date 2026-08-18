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

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = isSelectedAny
      ? `${t('card4Title')}। वर्तमान चयन ${selectedList.length} फसलें हैं।`
      : `${t('card4Title')}। ${t('card4Sub')}। आप बोलकर या नीचे दिए गए कार्ड छूकर एक से अधिक फसलें चुन सकते हैं।`;
    speakText(msg, language);
  };

  const handleContinue = () => {
    if (!isSelectedAny) return;
    triggerHaptic('success');
    nextCard();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-44">
      
      {/* Card Header & Audio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {t('stepOf')} ४ / ५
          </span>
          <button
            onClick={handleAudio}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        <h2 className="text-2xl font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC] leading-snug">
          {t('card4Title')}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          एक या एक से अधिक फसलें चुन सकते हैं। आप बोलकर भी बता सकते हैं।
        </p>
      </div>

      {/* PROMINENT VOICE RECOGNITION MIC TRIGGER */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`w-full py-4 px-5 rounded-3xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm ${
            isListening
              ? 'bg-red-500 text-white border-red-600 ring-4 ring-red-500/30 animate-pulse'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-100'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">
            {isListening ? 'mic' : 'mic'}
          </span>
          <span>
            {isListening
              ? 'सुन रहे हैं... फसल का नाम बोलें'
              : '🎤 बोलकर फसल बताएं (आवाज से स्वतः चयन)'}
          </span>
        </button>

        {transcriptFeedback && (
          <div className="bg-stone-100 dark:bg-stone-800/70 text-stone-800 dark:text-stone-200 px-4 py-2.5 rounded-2xl text-xs font-medium flex items-center gap-2 border border-stone-200 dark:border-stone-700 animate-fadeIn">
            <span className="material-symbols-outlined text-base text-primary">record_voice_over</span>
            <span className="truncate">पहचाना गया: "{transcriptFeedback}"</span>
          </div>
        )}
      </div>

      {/* 2-Column Crop Tiles Grid with Multi-Select Checkboxes */}
      <div className="grid grid-cols-2 gap-3.5">
        {CROPS.map((c) => {
          const isSelected = selectedList.includes(c.id);
          const cropTitle = language === 'mr' ? c.titleMr : (language === 'gu' ? c.titleGu : c.title);

          return (
            <div
              key={c.id}
              onClick={() => handleToggleCrop(c.id)}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center text-center relative active:scale-[0.98] shadow-sm ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/30'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
              }`}
            >
              {/* Checkbox Indicator */}
              <div className="absolute top-3 right-3">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-primary border-primary text-white'
                      : 'border-stone-300 dark:border-stone-600 bg-transparent'
                  }`}
                >
                  {isSelected && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </div>
              </div>

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 mt-1 ${c.iconBg}`}>
                <span className="material-symbols-outlined text-2xl">{c.icon}</span>
              </div>

              <h3 className="text-base font-bold text-[#1A1C18] dark:text-[#E2E3DC] font-headline">
                {cropTitle}
              </h3>
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
                {c.category}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Action Bar with Back & Continue (Disabled until selected) */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-md mx-auto flex gap-3 bg-gradient-to-t from-surface-light via-surface-light to-transparent dark:from-surface-dark dark:via-surface-dark pt-4 pb-2">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            prevCard();
          }}
          className="w-1/3 py-4 px-4 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!isSelectedAny}
          className={`w-2/3 py-4 px-6 rounded-full font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
            isSelectedAny
              ? 'bg-primary text-on-primary active:scale-[0.98] cursor-pointer'
              : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{t('continue')} (बुवाई का मौसम)</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
