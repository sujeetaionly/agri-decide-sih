import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { triggerHaptic } from '../lib/utils';
import { speakText, stopSpeaking } from '../lib/speech';

interface LoginPageProps {
  onLoginSuccess: (phone?: string) => void;
  onSkip: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onSkip,
}) => {
  const { language, t } = useLanguage();
  const { sendOtp, verifyOtp, loginAsGuest, isLoading } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [demoCodeHint, setDemoCodeHint] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePlayVoice = () => {
    triggerHaptic('light');
    const msg = isOtpSent
      ? `${t('enterOtp')}। परीक्षण हेतु कोड 1234 है।`
      : `${t('loginTitle')}। ${t('loginSubtitle')}`;

    speakText(
      msg,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    setErrorMessage('');

    if (!phone || phone.length < 10) {
      setErrorMessage('कृपया १० अंकों का मान्य मोबाइल नंबर दर्ज करें।');
      return;
    }

    const res = await sendOtp(phone);
    if (!res.success) {
      setErrorMessage(res.error || 'ओटीपी भेजने में असमर्थ, कृपया पुनः प्रयास करें।');
      return;
    }

    setIsOtpSent(true);
    if (res.demoOtp) {
      setDemoCodeHint(res.demoOtp);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    setErrorMessage('');

    const res = await verifyOtp(phone, otp);
    if (!res.success) {
      setErrorMessage('गलत ओटीपी कोड। परीक्षण हेतु 1234 दर्ज करें।');
      return;
    }

    triggerHaptic('success');
    onLoginSuccess(phone);
  };

  const handleGuest = () => {
    stopSpeaking();
    triggerHaptic('light');
    loginAsGuest();
    onSkip();
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between p-6 max-w-md mx-auto">
      
      {/* Top Header */}
      <div className="pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">agriculture</span>
          </div>
          <span className="font-bold text-lg text-primary">{t('appName')}</span>
        </div>

        <button
          onClick={handlePlayVoice}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-primary/30 transition-all ${
            isSpeaking ? 'bg-primary text-white animate-pulse' : 'bg-primary/10 text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-base">volume_up</span>
          <span>{t('listen')}</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="my-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-headline text-[#1A1C18] dark:text-[#E2E3DC]">
            {t('loginTitle')}
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {t('loginSubtitle')}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-300 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {!isOtpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                {t('mobileNumberLabel')}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 font-bold text-stone-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white dark:bg-[#1E231B] border-2 border-stone-200 dark:border-stone-800 text-[#1A1C18] dark:text-[#E2E3DC] font-bold text-lg tracking-wider focus:border-primary focus:outline-none shadow-sm"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length < 10}
              className="w-full py-4 rounded-full bg-primary text-on-primary font-bold text-base shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
              ) : (
                <>
                  <span>{t('sendOtp')}</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  {t('enterOtp')} (+91 {phone})
                </label>
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="text-xs text-primary font-semibold underline"
                >
                  नंबर बदलें
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className="w-full px-4 py-4 text-center rounded-2xl bg-white dark:bg-[#1E231B] border-2 border-stone-200 dark:border-stone-800 text-[#1A1C18] dark:text-[#E2E3DC] font-bold text-2xl tracking-[0.4em] focus:border-primary focus:outline-none shadow-sm"
                autoFocus
              />
            </div>

            {demoCodeHint && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-2.5 rounded-xl text-xs text-center font-medium">
                डेमो परीक्षण कोड: <strong>{demoCodeHint}</strong>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length < 4}
              className="w-full py-4 rounded-full bg-primary text-on-primary font-bold text-base shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
              ) : (
                <>
                  <span>{t('verifyOtp')}</span>
                  <span className="material-symbols-outlined text-lg">check</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Bottom Guest Bypass Button */}
      <div className="pt-4 pb-4 text-center space-y-3">
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-stone-200 dark:border-stone-800" />
          <span className="flex-shrink mx-3 text-xs text-stone-400 font-medium">अथवा</span>
          <div className="flex-grow border-t border-stone-200 dark:border-stone-800" />
        </div>

        <button
          onClick={handleGuest}
          className="w-full py-3.5 px-4 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-semibold text-sm hover:bg-stone-200 active:scale-[0.98] transition-all"
        >
          {t('guestBypass')}
        </button>
      </div>
    </div>
  );
};
