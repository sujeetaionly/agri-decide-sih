import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAudio } from '@/context/AudioContext';
import { NetworkStatusBar } from '@/components/home/NetworkStatusBar';
import { HomeTopAppBar } from '@/components/home/HomeTopAppBar';
import { HomeBottomNav, HomeTab } from '@/components/home/HomeBottomNav';
import { HowItWorksModal } from '@/components/home/HowItWorksModal';
import { SettingsModal } from '@/components/home/SettingsModal';

interface HomePageProps {
  onStartWizard: () => void;
  onOpenSavedPlan: () => void;
  onOpenLanguagePage?: () => void;
  onResetLanguage?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartWizard,
  onOpenSavedPlan,
  onOpenLanguagePage,
  onResetLanguage,
}) => {
  const { isHindi } = useLanguage();
  const { isPlaying, activeAudioId, playAudio, stopAudio } = useAudio();
  const [activeTab, setActiveTab] = useState<HomeTab>('home');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleTabChange = (tab: HomeTab) => {
    setActiveTab(tab);
    if (tab === 'crops') {
      onStartWizard();
    } else if (tab === 'plans') {
      onOpenSavedPlan();
    } else if (tab === 'settings') {
      setIsSettingsOpen(true);
    }
  };

  const handleAudio = (id: string, textHi: string, textEn: string) => {
    if (isPlaying && activeAudioId === id) {
      stopAudio();
    } else {
      playAudio(id, textHi, textEn);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-[72px] pb-[72px]">
      {/* Network Status Bar */}
      <NetworkStatusBar />

      {/* Top App Bar */}
      <HomeTopAppBar onOpenLanguagePage={onOpenLanguagePage} />

      {/* Main Canvas */}
      <main className="flex-grow px-margin-mobile py-6 max-w-3xl mx-auto w-full">
        {/* Hero Section */}
        <section className="mb-8">
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-4 flex items-center flex-wrap gap-2">
            <span>{isHindi ? 'अपने खेत के लिए सबसे सही फसल चुनें।' : 'Find the right crop for your farm.'}</span>
            <button
              onClick={() =>
                handleAudio(
                  'hero-heading-audio',
                  'अपने खेत के लिए सबसे सही फसल चुनें। अपनी मिट्टी, पानी और खेत की स्थिति बताएं। हम आपको उपयुक्त फसलों की तुलना करने में मदद करेंगे।',
                  'Find the right crop for your farm. Tell us about your soil, water and farm conditions. We will help you compare suitable crops.'
                )
              }
              className={`inline-flex items-center justify-center rounded-full transition-colors duration-150 p-1 ${
                isPlaying && activeAudioId === 'hero-heading-audio'
                  ? 'text-primary bg-primary/20 animate-pulse'
                  : 'text-primary hover:bg-surface-container-high'
              }`}
              aria-label="Listen to heading"
            >
              <span className="material-symbols-outlined text-[24px]">volume_up</span>
            </button>
          </h2>

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl">
            {isHindi
              ? 'अपनी मिट्टी, पानी और खेत की स्थिति बताएं। हम आपको उपयुक्त फसलों की तुलना करने में मदद करेंगे।'
              : 'Tell us about your soil, water and farm conditions. We’ll help you compare suitable crops.'}
          </p>

          {/* Primary CTA */}
          <button
            onClick={onStartWizard}
            className="w-full sm:w-auto min-h-[56px] flex items-center justify-center gap-3 bg-primary text-on-primary rounded-xl px-6 py-4 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-none hover:translate-y-[2px] transition-all duration-200 group btn-tactile cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              agriculture
            </span>
            <span className="font-button-text text-button-text font-bold text-[18px]">
              {isHindi ? 'नई फसल की सलाह लें' : 'Get Crop Recommendation'}
            </span>
          </button>
        </section>

        {/* Secondary Actions (Bento Grid Style) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Saved Plans Card */}
          <div
            onClick={onOpenSavedPlan}
            className="block bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-card-padding hover:border-primary hover:bg-surface-container-low transition-colors duration-200 h-full flex flex-col justify-between shadow-[0px_4px_12px_rgba(0,0,0,0.04)] cursor-pointer group btn-tactile"
          >
            <div className="mb-4">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center mb-4">
                <span
                  className="material-symbols-outlined text-primary text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  calendar_today
                </span>
              </div>

              <div className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full mb-2">
                <span className="material-symbols-outlined text-[16px]">offline_pin</span>
                <span className="text-[12px] font-label-md font-semibold">
                  {isHindi ? 'ऑफलाइन उपलब्ध' : 'Available Offline'}
                </span>
              </div>

              <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
                <span>{isHindi ? 'मेरी सुरक्षित योजनाएं' : 'My Saved Plans'}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAudio(
                      'saved-plans-audio',
                      'मेरी सुरक्षित योजनाएं: जहाँ आपने छोड़ा था वहीं से शुरू करें और अपनी चुनी हुई फसलों का प्रबंधन करें।',
                      'My Saved Plans: Resume where you left off and manage your selected crops.'
                    );
                  }}
                  className="inline-flex items-center justify-center text-primary hover:bg-surface-container-high rounded-full transition-colors duration-150 p-1"
                  aria-label="Listen to title"
                >
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
                </button>
              </h3>

              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                {isHindi
                  ? 'जहाँ आपने छोड़ा था वहीं से शुरू करें और अपनी चुनी हुई फसलों का प्रबंधन करें।'
                  : 'Resume where you left off and manage your selected crops.'}
              </p>
            </div>

            <div className="flex items-center text-primary font-label-lg text-label-lg font-bold">
              <span>{isHindi ? 'योजनाएं देखें' : 'View Plans'}</span>
              <span className="material-symbols-outlined ml-1 text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* How It Works Card */}
          <div
            onClick={() => setIsHowItWorksOpen(true)}
            className="block bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-card-padding hover:border-primary hover:bg-surface-container-low transition-colors duration-200 h-full flex flex-col justify-between shadow-[0px_4px_12px_rgba(0,0,0,0.04)] cursor-pointer group btn-tactile"
          >
            <div className="mb-4">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center mb-4">
                <span
                  className="material-symbols-outlined text-primary text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  info
                </span>
              </div>

              <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
                <span>{isHindi ? 'यह कैसे काम करता है' : 'How It Works'}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAudio(
                      'how-it-works-audio-card',
                      'यह कैसे काम करता है: जानें कि हमारा एआई फसल इंजन आपको अधिकतम पैदावार और लाभ प्राप्त करने में कैसे मदद करता है।',
                      'How It Works: Learn how our recommendation engine helps you maximize yield and profits.'
                    );
                  }}
                  className="inline-flex items-center justify-center text-primary hover:bg-surface-container-high rounded-full transition-colors duration-150 p-1"
                  aria-label="Listen to title"
                >
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
                </button>
              </h3>

              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                {isHindi
                  ? 'जानें कि हमारा एआई मॉडल आपको अधिकतम पैदावार प्राप्त करने में कैसे मदद करता है।'
                  : 'Learn how our recommendation engine helps you maximize yield.'}
              </p>
            </div>

            <div className="flex items-center text-primary font-label-lg text-label-lg font-bold">
              <span>{isHindi ? 'गाइड पढ़ें' : 'Read Guide'}</span>
              <span className="material-symbols-outlined ml-1 text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        </section>

        {/* Hero Image Section */}
        <section className="rounded-xl overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.08)] mb-8 border border-outline-variant/40">
          <div className="w-full h-64 bg-surface-variant relative">
            <img
              className="object-cover w-full h-full absolute inset-0"
              alt="A bright, sunlit wide-angle shot of a meticulously organized modern farm field with rows of vibrant green crops stretching towards the horizon."
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-5">
              <div className="text-white space-y-0.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white backdrop-blur-md">
                  {isHindi ? 'स्मार्ट सटीक कृषि' : 'Precision Farming'}
                </span>
                <p className="text-sm font-semibold text-white/95">
                  {isHindi ? 'वैज्ञानिक कृषि प्रबंधन से बढ़ाएं अपनी उपज' : 'Maximizing agricultural prosperity through AI'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <HomeBottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* How It Works Modal Dialog */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStart={() => {
          setIsHowItWorksOpen(false);
          onStartWizard();
        }}
      />

      {/* Settings & Testing Reset Modal Dialog */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenLanguagePage={() => {
          setIsSettingsOpen(false);
          onOpenLanguagePage?.();
        }}
        onResetLanguage={() => {
          setIsSettingsOpen(false);
          onResetLanguage?.();
        }}
      />
    </div>
  );
};
