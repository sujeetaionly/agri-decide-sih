import React, { useState, useEffect } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { AudioProvider } from '@/context/AudioContext';
import { AuthProvider } from '@/context/AuthContext';
import { WizardProvider, useWizard } from '@/context/WizardContext';
import { SplashScreen } from '@/components/common/SplashScreen';
import { LanguageSelectionPage } from '@/pages/LanguageSelectionPage';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { WizardPage } from '@/pages/WizardPage';

export type ViewMode = 'language' | 'login' | 'home' | 'wizard';

const AppContent: React.FC = () => {
  // Splash screen shown on initial launch
  const [showSplash, setShowSplash] = useState<boolean>(true);

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const hash = window.location.hash.replace('#', '');
    
    if (hash === 'language' || hash === 'reset') {
      if (hash === 'reset') {
        localStorage.removeItem('krishi_has_selected_language');
      }
      return 'language';
    }
    if (hash === 'login') return 'login';
    if (hash === 'wizard') return 'wizard';
    if (hash === 'home') return 'home';

    // First-time user behavior:
    const hasSelected = localStorage.getItem('krishi_has_selected_language');
    return hasSelected === 'true' ? 'home' : 'language';
  });

  const { goToStep, resetWizard } = useWizard();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'splash') {
        setShowSplash(true);
      } else if (hash === 'home') {
        setShowSplash(false);
        setViewMode('home');
      } else if (hash === 'login') {
        setShowSplash(false);
        setViewMode('login');
      } else if (hash === 'wizard') {
        setShowSplash(false);
        setViewMode('wizard');
      } else if (hash === 'language' || hash === 'reset') {
        setShowSplash(false);
        if (hash === 'reset') {
          localStorage.removeItem('krishi_has_selected_language');
        }
        setViewMode('language');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (mode: ViewMode) => {
    setViewMode(mode);
    window.location.hash = mode;
  };

  const handleLanguageContinue = () => {
    // Save language onboarding status and transition to Login screen
    localStorage.setItem('krishi_has_selected_language', 'true');
    navigateTo('login');
  };

  const handleLoginSuccess = (phone?: string) => {
    if (phone) {
      localStorage.setItem('krishi_user_phone', phone);
    }
    navigateTo('home');
  };

  const handleLoginSkip = () => {
    navigateTo('home');
  };

  const handleStartWizard = () => {
    resetWizard();
    goToStep(1);
    navigateTo('wizard');
  };

  const handleOpenSavedPlan = () => {
    goToStep(6);
    navigateTo('wizard');
  };

  const handleReturnHome = () => {
    navigateTo('home');
  };

  const handleOpenLanguagePage = () => {
    navigateTo('language');
  };

  const handleResetLanguage = () => {
    // Reset language selection flag for development/testing
    localStorage.removeItem('krishi_has_selected_language');
    localStorage.removeItem('krishi_user_phone');
    navigateTo('language');
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen
          durationMs={1800}
          onFinish={() => {
            setShowSplash(false);
            const hash = window.location.hash.replace('#', '');
            if (hash === 'splash') {
              const hasSelected = localStorage.getItem('krishi_has_selected_language');
              navigateTo(hasSelected === 'true' ? 'home' : 'language');
            }
          }}
        />
      ) : (
        <>
          {viewMode === 'language' && (
            <LanguageSelectionPage onContinue={handleLanguageContinue} />
          )}

          {viewMode === 'login' && (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onSkip={handleLoginSkip}
            />
          )}

          {viewMode === 'home' && (
            <HomePage
              onStartWizard={handleStartWizard}
              onOpenSavedPlan={handleOpenSavedPlan}
              onOpenLanguagePage={handleOpenLanguagePage}
              onResetLanguage={handleResetLanguage}
            />
          )}

          {viewMode === 'wizard' && (
            <WizardPage onReturnHome={handleReturnHome} />
          )}
        </>
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
