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
  const { sendOtp, verifyOtp, isLoading } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [demoCodeHint, setDemoCodeHint] = useState('');

  const handlePlayVoice = () => {
    triggerHaptic('light');
    const msg = isOtpSent
      ? `${t('enterOtp')}। ६-अंकों का ओटीपी दर्ज करें।`
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

    if (phone.length < 10) {
      setErrorMessage('कृपया १० अंकों का मान्य मोबाइल नंबर दर्ज करें।');
      return;
    }

    const res = await sendOtp(phone);
    if (!res.success) {
      setErrorMessage(res.error || 'ओटीपी भेजने में त्रुटि हुई। पुनः प्रयास करें।');
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
      
      {/* Top Branding Bar with Safe Area Top Inset for Camera Punch-hole & Dynamic Island */}
      <div className="pt-[calc(env(safe-area-inset-top,48px)+1.5rem)] pb-3 flex items-center justify-between">
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

      {/* Main Login Elevated Card */}
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
            {/* Phone Input */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 px-1">
                {t('mobileNumber')}
              </label>

              <div className="flex items-center h-14 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/60 focus-within:border-primary focus-within:bg-white dark:focus-within:bg-stone-900 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-xs overflow-hidden">
                <div className="flex items-center gap-1 px-3.5 border-r border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-extrabold text-sm select-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="min-w-0 flex-1 h-full px-4 bg-transparent text-on-surface-light dark:text-on-surface-dark font-extrabold text-lg tracking-wider focus:outline-none placeholder:text-stone-300 dark:placeholder:text-stone-600"
                  autoFocus
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                className={`max-w-[280px] w-full py-3.5 px-8 rounded-full font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                  phone.length === 10
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-md active:scale-95 cursor-pointer'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed shadow-none'
                }`}
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
            </div>
          </form>
        ) : (
          /* Step 2: 6-Digit OTP Flow with Discrete Digits UI */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {t('enterOtp')}
                </label>
                <span className="text-[11px] text-stone-400 font-medium">६-अंक दर्ज करें</span>
              </div>

              {/* 6 Discrete Digit Boxes */}
              <div className="relative flex justify-center gap-2 py-1">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const digit = otp[index] || '';
                  const isFocused = otp.length === index || (index === 5 && otp.length === 6);
                  return (
                    <div
                      key={index}
                      className={`w-11 h-13 rounded-2xl border-2 flex items-center justify-center font-black text-xl transition-all ${
                        digit
                          ? 'bg-white dark:bg-stone-900 border-primary text-primary shadow-xs'
                          : isFocused
                          ? 'bg-primary/5 border-primary ring-2 ring-primary/20 text-stone-900 dark:text-stone-100'
                          : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-300'
                      }`}
                    >
                      {digit || '•'}
                    </div>
                  );
                })}
                {/* Hidden Input for smooth mobile keyboard typing */}
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  autoFocus
                />
              </div>

              {/* 1-Tap Demo OTP Fill Helper */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setOtp(demoCodeHint || '123456')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primary-fixed bg-primary/10 px-3.5 py-1.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">key</span>
                  <span>डेमो कोड: {demoCodeHint || '123456'} (टैप करें)</span>
                </button>
              </div>
            </div>

            {/* Action & Secondary Option */}
            <div className="space-y-3 flex flex-col items-center">
              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className={`max-w-[280px] w-full py-3.5 px-8 rounded-full font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                  otp.length >= 6
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-md active:scale-95 cursor-pointer'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed shadow-none'
                }`}
              >
                {isLoading ? (
                  <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span>{t('verifyOtp')}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
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

      {/* Reassurance Footer with Safe Area Bottom Inset */}
      <footer className="pt-3 pb-[calc(env(safe-area-inset-bottom,16px)+1.5rem)] text-center">
        <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-stone-400 dark:text-stone-500 font-medium">
          <span className="material-symbols-outlined text-lg">verified_user</span>
          <span>सुरक्षित एवं गोपनीयता संरक्षित</span>
        </div>
      </footer>
    </div>
  );
};
