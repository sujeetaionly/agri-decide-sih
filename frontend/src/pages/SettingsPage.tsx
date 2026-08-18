import React, { useState } from 'react';
import { HomeTopAppBar } from '../components/home/HomeTopAppBar';
import { HomeBottomNav } from '../components/home/HomeBottomNav';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../lib/utils';
import { speakText } from '../lib/speech';

interface SettingsPageProps {
  onGoToHome: () => void;
  onStartNewRecommendation: () => void;
  onOpenMyCrops: () => void;
  onChangeLanguage: () => void;
  onSignOut: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onGoToHome,
  onStartNewRecommendation,
  onOpenMyCrops,
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
    const msg = `किसान खाता व सेटिंग्स। आपका पंजीकृत नंबर ${phone} है।`;
    speakText(msg, language);
  };

  const handleConfirmSignOut = () => {
    triggerHaptic('warning');
    localStorage.removeItem('krishi_user_phone');
    localStorage.removeItem('krishi_auth_token');
    localStorage.removeItem('krishi_has_onboarded');
    onSignOut();
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col font-body pt-16 pb-24">
      {/* 1. Top Status Bar with Audio Narration */}
      <HomeTopAppBar
        onOpenLanguagePage={onChangeLanguage}
      />

      {/* 2. Main Settings Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 space-y-5 animate-fadeIn">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black font-headline tracking-tight text-[#1A1C18] dark:text-[#E2E3DC]">
              {t('settingsTitle')}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              खाता प्रबंधन व ऐप प्राथमिकताएं
            </p>
          </div>

          <button
            onClick={handleAudio}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        {/* Farmer Account Profile Card */}
        <div className="bg-white dark:bg-[#1E231B] border-2 border-primary/30 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-4xl">account_circle</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>{t('verifiedFarmer')}</span>
                </span>
              </div>
              <h2 className="text-lg font-black text-[#1A1C18] dark:text-[#E2E3DC] font-headline mt-1 truncate">
                {phone}
              </h2>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {t('phoneNumber')}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-2xl">
              <span className="text-stone-400 block text-[10px]">क्षेत्रीय स्थान</span>
              <span className="font-bold text-stone-700 dark:text-stone-300">पुणे, महाराष्ट्र</span>
            </div>
            <div className="bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-2xl">
              <span className="text-stone-400 block text-[10px]">डेटा सुरक्षा</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">सुरक्षित व सिंक</span>
            </div>
          </div>
        </div>

        {/* App Preferences & Language Switcher */}
        <div className="bg-white dark:bg-[#1E231B] border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            ऐप प्राथमिकताएं
          </h3>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">translate</span>
              </div>
              <div>
                <span className="text-xs text-stone-400 block">{t('currentLanguageLabel')}</span>
                <span className="text-sm font-bold text-[#1A1C18] dark:text-[#E2E3DC]">
                  {LANGUAGE_NAMES[language] || 'हिन्दी'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic('light');
                onChangeLanguage();
              }}
              className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30 active:scale-95"
            >
              {t('changeLanguageBtn')}
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-stone-100 dark:border-stone-800 pt-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">wifi</span>
              </div>
              <div>
                <span className="text-xs text-stone-400 block">कनेक्शन स्थिति</span>
                <span className="text-sm font-bold text-emerald-600">ऑनलाइन जुड़े हैं</span>
              </div>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          </div>
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
              className="w-full py-4 px-5 rounded-3xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-900/50 font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
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
                  className="flex-1 py-2.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSignOut}
                  className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-md active:scale-95"
                >
                  हाँ, साइन आउट करें
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Persistent 3-Button Bottom Navigation */}
      <HomeBottomNav
        activeTab="settings"
        onTabChange={(tab) => {
          if (tab === 'home') onGoToHome();
          if (tab === 'my-crops') onOpenMyCrops();
        }}
      />
    </div>
  );
};
