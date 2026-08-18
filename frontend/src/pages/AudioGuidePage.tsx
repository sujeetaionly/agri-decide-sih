import React, { useState } from 'react';
import { SupportedLanguage, getTranslation } from '../data/translations';
import { triggerHaptic } from '../lib/utils';
import { speakText, stopSpeaking } from '../lib/speech';

interface AudioGuidePageProps {
  language: SupportedLanguage;
  onProceed: () => void;
}

export const AudioGuidePage: React.FC<AudioGuidePageProps> = ({
  language,
  onProceed,
}) => {
  const [hasTestedAudio, setHasTestedAudio] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTestAudio = () => {
    triggerHaptic('medium');
    const msg = `${getTranslation('audioGuideLine1', language)} ${getTranslation('audioGuideSuccess', language)}`;
    
    speakText(
      msg,
      language,
      () => {
        setIsSpeaking(true);
        setHasTestedAudio(true);
      },
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleContinue = () => {
    stopSpeaking();
    triggerHaptic('success');
    onProceed();
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between p-6 max-w-md mx-auto">
      
      {/* Top Title */}
      <header className="pt-6 space-y-2 text-center">
        <div className="w-14 h-14 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <span className="material-symbols-outlined text-3xl [font-variation-settings:'FILL'_1]">volume_up</span>
        </div>
        <h1 className="text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] tracking-tight">
          {getTranslation('audioGuideTitle', language)}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium max-w-xs mx-auto leading-relaxed">
          {getTranslation('audioGuideLine1', language)}
        </p>
      </header>

      {/* Center Interactive Circular Speaker Button */}
      <div className="my-auto text-center space-y-6">
        <button
          type="button"
          onClick={handleTestAudio}
          aria-label="Test Speaker Audio"
          className={`relative w-28 h-28 rounded-full border-4 flex items-center justify-center mx-auto transition-all cursor-pointer shadow-lg active:scale-95 ${
            isSpeaking
              ? 'bg-emerald-700 text-white border-emerald-500 shadow-2xl ring-8 ring-emerald-500/25 scale-105 animate-pulse'
              : 'bg-white dark:bg-[#1E231B] border-emerald-600/40 text-emerald-700 dark:text-emerald-300 hover:border-emerald-600 hover:scale-105 shadow-md'
          }`}
        >
          <span className="material-symbols-outlined text-5xl [font-variation-settings:'FILL'_1]">
            {isSpeaking ? 'graphic_eq' : 'volume_up'}
          </span>
        </button>

        <div className="space-y-1.5">
          <p className="text-base font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC]">
            {isSpeaking ? '🔊 आवाज बज रही है...' : 'दबाकर आवाज की जांच करें'}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed font-medium">
            यह बटन ऐप के हर पृष्ठ पर सबसे ऊपर उपलब्ध रहेगा।
          </p>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="pb-6">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{getTranslation('audioGuideProceed', language)}</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
