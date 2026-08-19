import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';
import { AuthProvider } from './context/AuthContext';
import { WizardProvider, useWizard } from './context/WizardContext';
import { SplashScreen } from './components/common/SplashScreen';
import { AndroidGpsPermissionModal } from './components/common/AndroidGpsPermissionModal';
import { LanguageSelectionPage } from './pages/LanguageSelectionPage';
import { LanguageConfirmPage } from './pages/LanguageConfirmPage';
import { AudioGuidePage } from './pages/AudioGuidePage';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { WizardPage } from './pages/WizardPage';
import { ActiveCropPlanPage } from './pages/ActiveCropPlanPage';
import { MyCropsPage } from './pages/MyCropsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SupportedLanguage } from './data/translations';

export type AppViewMode =
  | 'language-select'
  | 'language-confirm'
  | 'audio-guide'
  | 'login'
  | 'home'
  | 'wizard'
  | 'my-crop'
  | 'history'
  | 'settings';

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showGpsModal, setShowGpsModal] = useState<boolean>(() => {
    return !localStorage.getItem('krishi_gps_prompted');
  });

  const { language, setLanguage } = useLanguage();
  const { resetWizard, goToCard, updateFarmData, setSelectedCropId } = useWizard();
  const [openedFromHistory, setOpenedFromHistory] = useState<boolean>(false);

  const handleOpenAnalysisFromHistory = (historyItem: any) => {
    setOpenedFromHistory(true);
    updateFarmData({
      landAcres: historyItem.total_land_acres || 2.5,
      soilType: historyItem.soil_type === 'काली मिट्टी' ? 'BLACK' : 'LOAM',
      intendedCrops: (historyItem.compared_crops || []).map((c: any) => c.crop_id),
    });
    setSelectedCropId(historyItem.winner_crop?.crop_id || 'SOYBEAN');
    goToCard(7);
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigateTo('wizard');
  };

  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'reset') {
      localStorage.clear();
      return 'language-select';
    }
    if (hash === 'wizard') return 'wizard';
    if (hash === 'my-crop') return 'my-crop';
    if (hash === 'history') return 'history';
    if (hash === 'settings') return 'settings';
    if (hash === 'home') return 'home';

    const hasOnboarded = localStorage.getItem('krishi_has_onboarded');
    return hasOnboarded === 'true' ? 'home' : 'language-select';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppViewMode;
      if (['language-select', 'language-confirm', 'audio-guide', 'login', 'home', 'wizard', 'my-crop', 'history', 'settings'].includes(hash)) {
        setViewMode(hash);
        setShowSplash(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (mode: AppViewMode) => {
    setViewMode(mode);
    window.location.hash = mode;
  };

  // 1. GPS Modal Handlers
  const handleGpsAllow = (precise: boolean) => {
    localStorage.setItem('krishi_gps_prompted', 'true');
    localStorage.setItem('krishi_gps_granted', precise ? 'precise' : 'approx');
    setShowGpsModal(false);
  };

  const handleGpsDeny = () => {
    localStorage.setItem('krishi_gps_prompted', 'true');
    localStorage.setItem('krishi_gps_granted', 'denied');
    setShowGpsModal(false);
  };

  // 2. Language Selection -> Confirmation
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  const handleProceedToConfirm = () => {
    navigateTo('language-confirm');
  };

  // 3. Language Confirmation -> Settings (if onboarded) or Audio Guide (if first time)
  const handleConfirmLanguage = () => {
    const hasOnboarded = localStorage.getItem('krishi_has_onboarded');
    if (hasOnboarded === 'true') {
      navigateTo('settings');
    } else {
      navigateTo('audio-guide');
    }
  };

  const handleChangeLanguage = () => {
    navigateTo('language-select');
  };

  // 4. Audio Guide -> Login
  const handleAudioGuideProceed = () => {
    navigateTo('login');
  };

  // 5. Login -> Home
  const handleLoginSuccess = (phone?: string) => {
    if (phone) localStorage.setItem('krishi_user_phone', phone);
    localStorage.setItem('krishi_has_onboarded', 'true');
    navigateTo('home');
  };

  const handleLoginSkip = () => {
    localStorage.setItem('krishi_has_onboarded', 'true');
    navigateTo('home');
  };

  // Navigation handlers
  const handleStartWizard = () => {
    setOpenedFromHistory(false);
    resetWizard();
    goToCard(1);
    navigateTo('wizard');
  };

  const handleOpenMyCropPlan = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigateTo('my-crop');
  };

  const handleOpenHistory = () => {
    navigateTo('history');
  };

  const handleOpenSettings = () => {
    navigateTo('settings');
  };

  const handleReturnHome = () => {
    navigateTo('home');
  };

  const handleSignOut = () => {
    navigateTo('login');
  };

  return (
    <>
      {/* Splash Screen on Initial App Load */}
      {showSplash && (
        <SplashScreen
          onFinish={() => {
            setShowSplash(false);
          }}
        />
      )}

      {/* 1. First-Open Android Native GPS Permission Popup */}
      <AndroidGpsPermissionModal
        isOpen={showGpsModal && !showSplash}
        language={language}
        onAllow={handleGpsAllow}
        onDeny={handleGpsDeny}
      />

      {/* Screen 1: Regional Language Selection */}
      {viewMode === 'language-select' && (
        <LanguageSelectionPage
          currentLanguage={language}
          onSelectLanguage={handleSelectLanguage}
          onConfirm={handleProceedToConfirm}
        />
      )}

      {/* Screen 2: Language Confirmation */}
      {viewMode === 'language-confirm' && (
        <LanguageConfirmPage
          language={language}
          onConfirm={handleConfirmLanguage}
          onChangeLanguage={handleChangeLanguage}
        />
      )}

      {/* Screen 3: Audio Guide Tutorial */}
      {viewMode === 'audio-guide' && (
        <AudioGuidePage
          language={language}
          onProceed={handleAudioGuideProceed}
        />
      )}

      {/* Screen 4: Farmer Login with Guest Bypass */}
      {viewMode === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onSkip={handleLoginSkip}
        />
      )}

      {/* Screen 5: Minimalist Home Screen */}
      {viewMode === 'home' && (
        <HomePage
          onStartWizard={handleStartWizard}
          onOpenMyCropPlan={handleOpenMyCropPlan}
          onOpenHistory={handleOpenHistory}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {/* Screen 6: 1-Question Card Wizard */}
      {viewMode === 'wizard' && (
        <WizardPage
          onReturnHome={handleReturnHome}
          onOpenMyCropPlan={handleOpenMyCropPlan}
          onOpenHistory={handleOpenHistory}
          onOpenSettings={handleOpenSettings}
          openedFromHistory={openedFromHistory}
        />
      )}

      {/* Screen 7: "मेरी फसल" (My Crop) Active 120-Day Action Plan */}
      {viewMode === 'my-crop' && (
        <ActiveCropPlanPage
          onGoToHome={handleReturnHome}
          onOpenHistory={handleOpenHistory}
          onOpenSettings={handleOpenSettings}
          onStartNewRecommendation={handleStartWizard}
        />
      )}

      {/* Screen 8: "इतिहास" (History) Crop Archive */}
      {viewMode === 'history' && (
        <MyCropsPage
          onStartNewRecommendation={handleStartWizard}
          onGoToHome={handleReturnHome}
          onOpenMyCropPlan={handleOpenMyCropPlan}
          onOpenSettings={handleOpenSettings}
          onOpenAnalysisFromHistory={handleOpenAnalysisFromHistory}
        />
      )}

      {/* Screen 9: Farmer Account & Settings */}
      {viewMode === 'settings' && (
        <SettingsPage
          onGoToHome={handleReturnHome}
          onOpenMyCropPlan={handleOpenMyCropPlan}
          onOpenHistory={handleOpenHistory}
          onChangeLanguage={handleChangeLanguage}
          onSignOut={handleSignOut}
        />
      )}
    </>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AudioProvider>
        <AuthProvider>
          <WizardProvider>
            <AppContent />
          </WizardProvider>
        </AuthProvider>
      </AudioProvider>
    </LanguageProvider>
  );
}

export default App;
