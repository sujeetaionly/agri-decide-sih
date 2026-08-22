import React, { useState } from 'react';
import { HomeTopAppBar } from '../components/home/HomeTopAppBar';
import { HomeBottomNav, NavTab } from '../components/home/HomeBottomNav';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_REGISTRY } from '../data/translations';
import { triggerHaptic } from '../lib/utils';
import { speakText } from '../lib/speech';

interface SettingsPageProps {
  onGoToHome: () => void;
  onOpenMyCropPlan: () => void;
  onOpenHistory: () => void;
  onChangeLanguage: () => void;
  onSignOut: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onGoToHome,
  onOpenMyCropPlan,
  onOpenHistory,
  onChangeLanguage,
  onSignOut,
}) => {
  const { language, t } = useLanguage();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const phone = localStorage.getItem('krishi_user_phone') || '+91 98765 43210';

  const currentLanguageNative = LANGUAGE_REGISTRY[language]?.nativeName || 'हिन्दी';

  const audioText = language === 'mr'
    ? `सेटिंग्ज पृष्ठ. आपला नोंदणीकृत मोबाइल नंबर ${phone} आहे. स्थान जयपूर, राजस्थान आणि चालू हंगाम खरीप आहे.`
    : language === 'gu'
    ? `સેટિંગ્સ પેજ. તમારો નોંધાયેલ મોબાઇલ નંબર ${phone} છે. સ્થળ જયપુર, રાજસ્થાન અને ચાલુ મોસમ ખરીફ છે.`
    : language === 'raj'
    ? `सेटिंग्स पृष्ठ। थारो रजिस्टर्ड मोबाइल नंबर ${phone} है। जग्या जयपुर, राजस्थान और चालूं मौसम खरीफ है।`
    : language === 'en'
    ? `Settings page. Registered phone number is ${phone}. Location Jaipur, Rajasthan, and current season is Kharif.`
    : `सेटिंग्स पृष्ठ। आपका पंजीकृत मोबाइल नंबर ${phone} है। स्थान जयपुर, राजस्थान और वर्तमान मौसम खरीफ है। किसी भी सहायता के लिए किसान हेल्पलाइन पर संपर्क करें।`;

  const handleConfirmSignOut = () => {
    triggerHaptic('warning');
    localStorage.removeItem('krishi_user_phone');
    localStorage.removeItem('krishi_auth_token');
    localStorage.removeItem('krishi_has_onboarded');
    onSignOut();
  };

  const handleNavChange = (tab: NavTab) => {
    if (tab === 'home') onGoToHome();
    else if (tab === 'my-crop') onOpenMyCropPlan();
    else if (tab === 'history') onOpenHistory();
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col font-body">
      {/* 1. Top Status Bar with Context-Aware Audio */}
      <HomeTopAppBar
        audioText={audioText}
        onOpenLanguagePage={onChangeLanguage}
      />

      {/* 2. Main Settings Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 pb-20 space-y-4 animate-fadeIn">
        
        {/* Page Header with Icon Emblem and Balanced Spacing */}
        <div className="flex items-center gap-3 pt-0.5 pb-1">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-2xl font-bold">manage_accounts</span>
          </div>
          <h1 className="text-2xl font-black font-headline tracking-tight text-on-surface-light dark:text-on-surface-dark">
            {t('settingsTitle')}
          </h1>
        </div>

        {/* Unified Card 1: Farmer Profile, Location & Language Preferences */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
          {/* Section A: Phone Number & Regional Context */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              {t('phoneNumber')}
            </span>

            <h2 className="text-2xl font-black text-on-surface-light dark:text-on-surface-dark tracking-wide font-headline">
              {phone}
            </h2>

            {/* Location & Season Chips Row (with proper line height for Devanagari bottom matras) */}
            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="material-symbols-outlined text-lg text-primary flex-shrink-0">location_on</span>
                <div className="min-w-0">
                  <span className="text-[10px] text-stone-400 font-bold block">स्थान</span>
                  <span className="text-xs font-black text-on-surface-light dark:text-on-surface-dark leading-relaxed pb-0.5 block">
                    जयपुर, राजस्थान
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="material-symbols-outlined text-lg text-amber-600 flex-shrink-0">calendar_month</span>
                <div className="min-w-0">
                  <span className="text-[10px] text-stone-400 font-bold block">मौसम</span>
                  <span className="text-xs font-black text-on-surface-light dark:text-on-surface-dark leading-relaxed pb-0.5 block">
                    खरीफ २०२६
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 dark:border-stone-800" />

          {/* Section B: Language Switcher */}
          <div className="flex items-center justify-between pt-0.5">
            <div>
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">
                {t('currentLanguageLabel')}
              </span>
              <span className="text-base font-bold text-on-surface-light dark:text-on-surface-dark mt-0.5 block">
                {currentLanguageNative}
              </span>
            </div>

            <button
              onClick={() => {
                triggerHaptic('light');
                onChangeLanguage();
              }}
              className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 px-4 py-2 rounded-full border border-primary/20 active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              {t('changeLanguageBtn')}
            </button>
          </div>
        </div>

        {/* Unified Card 2: Kisan Toll-Free Helpline Support */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-xl font-bold">headset_mic</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                किसान सहायता केंद्र
              </span>
              <span className="text-sm font-black text-on-surface-light dark:text-on-surface-dark block">
                टोल-फ्री हेल्पलाइन
              </span>
            </div>
          </div>

          {/* Number + Call Action Sub-Tile */}
          <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">निःशुल्क नंबर</span>
              <a
                href="tel:18001801551"
                className="text-xl font-black text-on-surface-light dark:text-on-surface-dark font-headline block tracking-wide hover:text-primary transition-colors"
              >
                1800-180-1551
              </a>
            </div>
            <a
              href="tel:18001801551"
              className="h-10 px-5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <span className="material-symbols-outlined text-base">call</span>
              <span>कॉल करें</span>
            </a>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            फसल, कीट-रोग, मौसम या सरकारी योजनाओं से संबंधित किसी भी सहायता के लिए कृषि विशेषज्ञों से २४x७ निःशुल्क संपर्क करें।
          </p>
        </div>

        {/* Card 3: Sign Out Action Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowSignOutConfirm(true);
            }}
            className="w-full py-3.5 px-6 rounded-3xl bg-red-50 hover:bg-red-100/80 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 font-bold text-sm border-2 border-red-200/80 dark:border-red-900/40 shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span>{t('signOut')}</span>
          </button>
        </div>
      </main>

      {/* Sign Out Confirmation Modal Dialog Overlay */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-sm w-full border-2 border-stone-200 dark:border-stone-800 shadow-xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-2xs">
              <span className="material-symbols-outlined text-2xl">logout</span>
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-on-surface-light dark:text-on-surface-dark font-headline">
                खाते से साइन आउट करें?
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-medium">
                साइन आउट करने के बाद दोबारा प्रवेश के लिए आपको अपना मोबाइल नंबर सत्यापित करना होगा।
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 py-3 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold active:scale-95 transition-all cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleConfirmSignOut}
                className="flex-1 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-black active:scale-95 transition-all cursor-pointer shadow-md"
              >
                हाँ, साइन आउट करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Persistent Bottom Navigation */}
      <HomeBottomNav
        activeTab="settings"
        onTabChange={handleNavChange}
      />
    </div>
  );
};
