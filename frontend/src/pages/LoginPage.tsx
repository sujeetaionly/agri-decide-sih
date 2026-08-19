import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { triggerHaptic } from '../lib/utils';
import { speakText, stopSpeaking } from '../lib/speech';

interface LoginPageProps {
  onLoginSuccess: (phone?: string) => void;
  onSkip?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
}) => {
  const { language, t } = useLanguage();
  const { sendOtp, verifyOtp, isLoading } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [demoCodeHint, setDemoCodeHint] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePlayVoice = () => {
    triggerHaptic('light');
    const msg = isOtpSent
      ? 'आपके मोबाइल नंबर पर भेजा गया ६ अंकों का ओटीपी कोड दर्ज करें।'
      : `${t('loginTitle')}। अपना १० अंकों का मोबाइल नंबर दर्ज करें।`;

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
      setErrorMessage(res.error || 'गलत ओटीपी कोड। पुनः प्रयास करें।');
      return;
    }

    triggerHaptic('success');
    onLoginSuccess(phone);
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark flex flex-col justify-between p-6 max-w-md mx-auto">
      
      {/* Top Branding Bar with Clear Hierarchy */}
      <div className="pt-2 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <span className="material-symbols-outlined text-3xl">agriculture</span>
          </div>
          <div>
            <span className="font-black text-lg font-headline text-on-surface-light dark:text-on-surface-dark tracking-tight block">
              {t('appName')}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">
              {t('appTagline')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePlayVoice}
          aria-label="Listen"
          className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border transition-all cursor-pointer ${
            isSpeaking
              ? 'bg-primary text-white border-primary animate-pulse shadow-md'
              : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
          }`}
        >
          <span className="material-symbols-outlined text-xl">volume_up</span>
          <span>{t('listen')}</span>
        </button>
      </div>

      {/* Main Login Elevated Card - Distinct Visual Groups */}
      <div className="my-auto w-full max-w-sm mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-7 sm:p-8 shadow-sm space-y-6">
        
        {/* Visual Group 1: Header (Emblem + Title + Subtitle) */}
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto shadow-2xs">
            <span className="material-symbols-outlined text-3xl">
              {isOtpSent ? 'mark_email_read' : 'lock_open'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-black font-headline text-on-surface-light dark:text-on-surface-dark tracking-tight">
              {isOtpSent ? t('enterOtp') : t('loginTitle')}
            </h1>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
              {isOtpSent ? `+91 ${phone}` : t('loginSubtitle')}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-300 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-xl flex-shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Mobile Number Flow */}
        {!isOtpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            {/* Visual Group 2: Input Field + Demo Helper */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {t('mobileNumberLabel')}
                </label>
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                  डेमो: <strong className="font-bold text-stone-800 dark:text-stone-200">9876543210</strong>
                </span>
              </div>

              {/* Integrated Prefix Input with Native Numpad Trigger */}
              <div className="flex items-center w-full h-14 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/60 focus-within:border-primary focus-within:bg-white dark:focus-within:bg-stone-900 focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden shadow-xs">
                <div className="flex-shrink-0 h-full px-4 text-sm font-extrabold text-stone-600 dark:text-stone-400 select-none border-r border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center gap-1.5">
                  <span className="text-xs text-stone-400 font-bold tracking-wide">IN</span>
                  <span className="text-stone-700 dark:text-stone-200 font-bold">+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="tel-national"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="min-w-0 flex-1 h-full px-4 bg-transparent text-on-surface-light dark:text-on-surface-dark font-extrabold text-lg tracking-wider focus:outline-none placeholder:text-stone-300 dark:placeholder:text-stone-600"
                  autoFocus
                />
              </div>
            </div>

            {/* Visual Group 3: Action Button */}
            <button
              type="submit"
              disabled={isLoading || phone.length < 10}
              className={`w-full h-14 rounded-full font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
                phone.length === 10
                  ? 'bg-primary hover:bg-primary/90 text-on-primary shadow-xl active:scale-[0.98] cursor-pointer'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed shadow-none'
              }`}
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
              ) : (
                <>
                  <span>{t('sendOtp')}</span>
                  <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: 6-Digit OTP Flow */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* Visual Group 2: Input Field + Demo Helper */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {t('enterOtp')}
                </label>
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                  डेमो: <strong className="font-bold text-stone-800 dark:text-stone-200">{demoCodeHint || '123456'}</strong>
                </span>
              </div>

              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full h-14 text-center rounded-2xl bg-stone-50/70 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 text-on-surface-light dark:text-on-surface-dark font-extrabold text-2xl tracking-[0.35em] focus:border-primary focus:outline-none shadow-xs"
                autoFocus
              />
            </div>

            {/* Visual Group 3: Action & Secondary Option */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className={`w-full h-14 rounded-full font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
                  otp.length >= 6
                    ? 'bg-primary hover:bg-primary/90 text-on-primary shadow-xl active:scale-[0.98] cursor-pointer'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed shadow-none'
                }`}
              >
                {isLoading ? (
                  <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span>{t('verifyOtp')}</span>
                    <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtp('');
                  }}
                  className="text-xs font-bold text-stone-500 hover:text-primary transition-colors cursor-pointer py-1"
                >
                  ← नंबर बदलें
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Reassurance Footer */}
      <footer className="pt-3 pb-4 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-stone-400 dark:text-stone-500 font-medium">
          <span className="material-symbols-outlined text-lg">verified_user</span>
          <span>सुरक्षित एवं गोपनीयता संरक्षित</span>
        </div>
      </footer>
    </div>
  );
};
