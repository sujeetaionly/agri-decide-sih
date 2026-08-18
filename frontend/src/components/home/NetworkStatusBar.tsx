import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const NetworkStatusBar: React.FC = () => {
  const { isHindi } = useLanguage();

  return (
    <div className="fixed top-0 left-0 w-full z-[60] bg-surface-container-lowest border-b border-outline-variant px-margin-mobile py-1 flex justify-center items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#3e6a00] animate-pulse"></span>
      <span className="font-medium text-[13px] text-on-surface-variant">
        {isHindi ? 'नेटवर्क स्थिति: कनेक्टेड' : 'Network Status: Connected'}
      </span>
    </div>
  );
};
