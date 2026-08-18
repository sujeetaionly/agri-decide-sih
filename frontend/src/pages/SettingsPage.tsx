import React, { useState } from 'react';
import { HomeTopAppBar } from '../components/home/HomeTopAppBar';
import { HomeBottomNav, NavTab } from '../components/home/HomeBottomNav';
import { useLanguage } from '../context/LanguageContext';
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

  const LANGUAGE_NAMES: Record<string, string> = {
    hi: 'हिन्दी (Hindi)',
    mr: 'मराठी (Marathi)',
    gu: 'ગુજરાતી (Gujarati)',
    en: 'English',
  };

  const handleAudio = () => {
    triggerHaptic('light');
    const msg = `सेटिंग्स। आपका पंजीकृत मोबाइल नंबर ${phone} है।`;
    speakText(msg, language);
  };

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
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col font-body pt-16 pb-24">
      {/* 1. Top Status Bar */}
      <HomeTopAppBar
        onOpenLanguagePage={onChangeLanguage}
      />

      {/* 2. Main Settings Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 space-y-4 animate-fadeIn">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black font-headline tracking-tight text-[#1A1C18] dark:text-[#E2E3DC]">
              {t('settingsTitle')}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              खाता व ऐप प्राथमिकताएं
            </p>
          </div>

          <button
            onClick={handleAudio}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        {/* Clean Farmer Mobile Number Card */}
        <div className="bg-white dark:bg-[#1E231B] border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            {t('phoneNumber')}
          </span>
          <h2 className="text-xl font-extrabold text-[#1A1C18] dark:text-[#E2E3DC] tracking-wide">
            {phone}
          </h2>
        </div>

        {/* App Language Switcher */}
        <div className="bg-white dark:bg-[#1E231B] border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            ऐप प्राथमिकताएं
          </h3>

          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-xs text-stone-400 block">{t('currentLanguageLabel')}</span>
              <span className="text-base font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                {LANGUAGE_NAMES[language] || 'हिन्दी'}
              </span>
            </div>

            <button
              onClick={() => {
                triggerHaptic('light');
                onChangeLanguage();
              }}
              className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full border border-primary/30 active:scale-95 cursor-pointer"
            >
              {t('changeLanguageBtn')}
            </button>
          </div>
        </div>

        {/* Kisan Toll-Free Helpline Support Card */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              किसान कॉल सेंटर (टोल-फ्री हेल्पलाइन)
            </span>
            <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
              २४x७
            </span>
          </div>
          <a
            href="tel:18001801551"
            className="text-lg font-black text-emerald-700 dark:text-emerald-400 block hover:underline"
          >
            1800-180-1551
          </a>
          <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
            कृषि विशेषज्ञों से सीधे फोन पर बात करने के लिए ऊपर दिए गए नंबर पर कॉल करें।
          </p>
        </div>

        {/* Sign Out Button */}
        <div className="pt-2">
          {!showSignOutConfirm ? (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setShowSignOutConfirm(true);
              }}
              className="w-full py-4 px-5 rounded-3xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-900/50 font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span>{t('signOut')}</span>
            </button>
          ) : (
            <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-400 rounded-3xl p-4 space-y-3 animate-fadeIn">
              <p className="text-xs font-bold text-red-800 dark:text-red-200 text-center">
                क्या आप सच में साइन आउट करना चाहते हैं?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 py-2.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSignOut}
                  className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-md active:scale-95 cursor-pointer"
                >
                  हाँ, साइन आउट करें
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Persistent Bottom Navigation */}
      <HomeBottomNav
        activeTab="settings"
        onTabChange={handleNavChange}
      />
    </div>
  );
};
