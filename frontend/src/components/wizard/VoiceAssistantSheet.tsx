import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { startVoiceRecognition, VoiceRecognitionSession } from '@/lib/speech';

interface VoiceAssistantSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCrop: (cropName: string) => void;
}

export const VoiceAssistantSheet: React.FC<VoiceAssistantSheetProps> = ({
  isOpen,
  onClose,
  onSelectCrop,
}) => {
  const { language, isHindi } = useLanguage();
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let session: VoiceRecognitionSession | null = null;

    if (isOpen) {
      setIsListening(true);
      setTranscript('');

      session = startVoiceRecognition(
        language === 'en' ? 'en' : 'hi',
        (text: string, isFinal: boolean) => {
          setTranscript(text);
          if (isFinal) {
            // Auto match common crops
            const lower = text.toLowerCase();
            if (lower.includes('bajra') || lower.includes('बाजरा') || lower.includes('millet')) {
              onSelectCrop('Bajra');
            } else if (lower.includes('moong') || lower.includes('मूंग') || lower.includes('gram')) {
              onSelectCrop('Moong');
            } else if (lower.includes('groundnut') || lower.includes('मूंगफली') || lower.includes('peanut')) {
              onSelectCrop('Groundnut');
            } else if (lower.includes('mustard') || lower.includes('सरसों')) {
              onSelectCrop('Mustard');
            }
          }
        },
        (err: any) => {
          console.warn('Voice recognition:', err);
        },
        () => {
          setIsListening(false);
        }
      );
    }

    return () => {
      if (session) {
        session.stop();
      }
    };
  }, [isOpen, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-t-[32px] shadow-level-3 border-t border-outline-variant p-6 md:p-8 space-y-6 animate-in slide-in-from-bottom duration-300">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto" />

        {/* Title */}
        <div className="text-center space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-on-surface">
            {isHindi ? 'बोलकर फसल का नाम बताएं' : 'Speak Crop Names'}
          </h3>
          <p className="text-xs md:text-sm text-on-surface-variant">
            {isHindi
              ? 'उदा. "बाजरा", "मूंग", "मूंगफली" बोलें'
              : 'Say "Bajra", "Moong", or "Groundnut" clearly'}
          </p>
        </div>

        {/* Animated Microphone Pulse & Sound Waves */}
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary-container/20 flex items-center justify-center animate-ping absolute inset-0" />
            <div className="relative w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-cta-glow">
              <span className="material-symbols-outlined text-[48px]">mic</span>
            </div>
          </div>

          {/* Sound Waves */}
          <div className="flex items-center justify-center gap-1.5 h-12">
            <div className="w-1.5 bg-primary rounded-full animate-soundwave-1" />
            <div className="w-1.5 bg-primary rounded-full animate-soundwave-2" />
            <div className="w-1.5 bg-primary rounded-full animate-soundwave-3" />
            <div className="w-1.5 bg-primary rounded-full animate-soundwave-4" />
            <div className="w-1.5 bg-primary rounded-full animate-soundwave-5" />
          </div>

          <div className="text-sm font-bold text-primary animate-pulse">
            {isListening
              ? isHindi
                ? 'सुन रहे हैं... बोलिए'
                : 'Listening... speak now'
              : isHindi
              ? 'आवाज पहचानी गई'
              : 'Voice captured'}
          </div>
        </div>

        {/* Live Transcript Display Box */}
        <div className="min-h-[64px] p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-center text-center">
          <p className="text-base md:text-lg font-bold text-on-surface">
            {transcript ? (
              `"${transcript}"`
            ) : (
              <span className="text-on-surface-variant/60 font-normal">
                {isHindi ? 'आपकी आवाज यहाँ दिखाई देगी...' : 'Your speech will appear here...'}
              </span>
            )}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onClose}
            className="min-h-[56px] text-base md:text-lg"
          >
            <span className="material-symbols-outlined text-[22px]">check</span>
            <span>{isHindi ? 'हो गया / सुनना बंद करें' : 'Done / Stop Listening'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
