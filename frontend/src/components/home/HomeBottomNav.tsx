import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export type HomeTab = 'home' | 'crops' | 'plans' | 'settings';

interface HomeBottomNavProps {
  activeTab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
}

export const HomeBottomNav: React.FC<HomeBottomNavProps> = ({ activeTab, onTabChange }) => {
  const { isHindi } = useLanguage();

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-margin-mobile h-[72px] bg-surface border-t-2 border-outline-variant shadow-[0px_-4px_12px_rgba(0,0,0,0.08)]">
      {/* Active: Home */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-all duration-200 ${
          activeTab === 'home'
            ? 'bg-secondary-container text-on-secondary-container translate-y-0.5 shadow-sm'
            : 'text-on-surface-variant hover:bg-surface-container'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px] mb-1"
          style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
        >
          home
        </span>
        <span className="font-semibold text-[12px] leading-tight">
          {isHindi ? 'होम' : 'Home'}
        </span>
      </button>

      {/* Tab: My Crops */}
      <button
        onClick={() => onTabChange('crops')}
        className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-all duration-200 ${
          activeTab === 'crops'
            ? 'bg-secondary-container text-on-secondary-container translate-y-0.5 shadow-sm'
            : 'text-on-surface-variant hover:bg-surface-container'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px] mb-1"
          style={{ fontVariationSettings: activeTab === 'crops' ? "'FILL' 1" : "'FILL' 0" }}
        >
          grass
        </span>
        <span className="font-semibold text-[12px] leading-tight">
          {isHindi ? 'मेरी फसलें' : 'My Crops'}
        </span>
      </button>

      {/* Tab: Plans */}
      <button
        onClick={() => onTabChange('plans')}
        className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-all duration-200 ${
          activeTab === 'plans'
            ? 'bg-secondary-container text-on-secondary-container translate-y-0.5 shadow-sm'
            : 'text-on-surface-variant hover:bg-surface-container'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px] mb-1"
          style={{ fontVariationSettings: activeTab === 'plans' ? "'FILL' 1" : "'FILL' 0" }}
        >
          calendar_today
        </span>
        <span className="font-semibold text-[12px] leading-tight">
          {isHindi ? 'योजनाएं' : 'Plans'}
        </span>
      </button>

      {/* Tab: Settings */}
      <button
        onClick={() => onTabChange('settings')}
        className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-all duration-200 ${
          activeTab === 'settings'
            ? 'bg-secondary-container text-on-secondary-container translate-y-0.5 shadow-sm'
            : 'text-on-surface-variant hover:bg-surface-container'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px] mb-1"
          style={{ fontVariationSettings: activeTab === 'settings' ? "'FILL' 1" : "'FILL' 0" }}
        >
          settings
        </span>
        <span className="font-semibold text-[12px] leading-tight">
          {isHindi ? 'सेटिंग्स' : 'Settings'}
        </span>
      </button>
    </nav>
  );
};
