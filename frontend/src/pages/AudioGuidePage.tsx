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
      <div className="pt-4 space-y-2 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
          <span className="material-symbols-outlined text-3xl">record_voice_over</span>
        </div>
        <h1 className="text-2xl font-bold font-headline">
          {getTranslation('audioGuideTitle', language)}
        </h1>
      </div>

      {/* Center Tutorial Box (1-2 lines tutorial as requested) */}
      <div className="my-auto space-y-6">
        <div className="bg-white dark:bg-[#1E231B] border-2 border-primary/20 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-3xl animate-pulse">volume_up</span>
            </div>
            <p className="text-base font-semibold leading-relaxed text-[#1A1C18] dark:text-[#E2E3DC]">
              {getTranslation('audioGuideLine1', language)}
            </p>
          </div>

          <div className="h-px bg-stone-200 dark:bg-stone-800" />

          <p className="text-sm text-stone-600 dark:text-stone-300">
            {getTranslation('audioGuideLine2', language)}
          </p>
        </div>

        {/* Interactive Speaker Test Button */}
        <button
          onClick={handleTestAudio}
          className={`w-full py-5 px-6 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
            isSpeaking
              ? 'bg-primary text-white border-primary shadow-xl ring-4 ring-primary/30 animate-pulse'
              : 'bg-primary/10 border-primary text-primary hover:bg-primary/20 shadow-md'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">
            {isSpeaking ? 'graphic_eq' : 'volume_up'}
          </span>
          <span>
            {isSpeaking
              ? getTranslation('speaking', language)
              : getTranslation('audioGuideTestBtn', language)}
          </span>
        </button>

        {hasTestedAudio && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-semibold animate-fadeIn">
            <span className="material-symbols-outlined text-base">verified</span>
            <span>{getTranslation('audioGuideSuccess', language)}</span>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="pb-6">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-bold text-base shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span>{getTranslation('audioGuideProceed', language)}</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
