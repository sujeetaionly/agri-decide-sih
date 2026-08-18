import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface AudioButtonProps {
  id: string;
  textHi: string;
  textEn?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  id,
  textHi,
  textEn,
  className,
  size = 'md',
}) => {
  const { isPlaying, activeAudioId, playAudio, stopAudio } = useAudio();
  const { isHindi } = useLanguage();

  const isCurrentActive = isPlaying && activeAudioId === id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentActive) {
      stopAudio();
    } else {
      playAudio(id, textHi, textEn);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isHindi ? 'आवाज में सुनें' : 'Listen audio'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-bold transition-all select-none btn-tactile',
        size === 'sm' ? 'px-2.5 py-1 text-xs min-h-[36px]' : 'px-3.5 py-1.5 text-sm min-h-[44px]',
        isCurrentActive
          ? 'bg-primary text-on-primary ring-2 ring-primary/40 shadow-sm animate-pulse'
          : 'bg-primary-container/15 text-primary border border-primary/20 hover:bg-primary-container/25',
        className
      )}
    >
      <span
        className={cn(
          'material-symbols-outlined text-[20px]',
          isCurrentActive && 'animate-bounce'
        )}
      >
        {isCurrentActive ? 'volume_up' : 'volume_up'}
      </span>
      <span>{isHindi ? 'सुनें' : 'Listen'}</span>
    </button>
  );
};
