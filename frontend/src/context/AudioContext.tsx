import React, { createContext, useContext, useState, useEffect } from 'react';
import { speakText, stopSpeaking } from '@/lib/speech';
import { useLanguage } from './LanguageContext';

interface AudioContextType {
  isPlaying: boolean;
  activeAudioId: string | null;
  playAudio: (id: string, textHi: string, textEn?: string) => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  const stopAudio = () => {
    stopSpeaking();
    setIsPlaying(false);
    setActiveAudioId(null);
  };

  const playAudio = (id: string, textHi: string, textEn?: string) => {
    if (activeAudioId === id && isPlaying) {
      stopAudio();
      return;
    }

    stopAudio();
    setActiveAudioId(id);
    setIsPlaying(true);

    const textToSpeak = language === 'en' && textEn ? textEn : textHi;
    const langCode = language === 'en' ? 'en' : 'hi';

    speakText(textToSpeak, langCode, () => {
      setIsPlaying(false);
      setActiveAudioId(null);
    });
  };

  // Stop playback if language changes or component unmounts
  useEffect(() => {
    stopAudio();
  }, [language]);

  return (
    <AudioContext.Provider value={{ isPlaying, activeAudioId, playAudio, stopAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
