import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic } from '../../lib/utils';

export type NavTab = 'home' | 'my-crop' | 'history' | 'settings';

interface HomeBottomNavProps {
  activeTab?: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const HomeBottomNav: React.FC<HomeBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useLanguage();

  const handleSelectTab = (tab: NavTab) => {
    triggerHaptic('light');
    onTabChange(tab);
  };

  // 4 Balanced Tabs: मुख्य पृष्ठ (Home), मेरी फसल (My Crop Action Plan), इतिहास (History), सेटिंग्स (Settings)
  const navItems: { id: NavTab; labelKey: string; icon: string }[] = [
    { id: 'home', labelKey: 'navHome', icon: 'home' },
    { id: 'my-crop', labelKey: 'navMyCrop', icon: 'calendar_month' },
    { id: 'history', labelKey: 'navHistory', icon: 'history' },
    { id: 'settings', labelKey: 'navSettings', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-[#1A1E17]/95 backdrop-blur-md border-t border-stone-300/90 dark:border-stone-700/90 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-14 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all active:scale-95 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 font-medium'
              }`}
            >
              <div
                className={`w-12 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-primary/15 text-primary scale-105'
                    : 'bg-transparent'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight line-clamp-1">
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
