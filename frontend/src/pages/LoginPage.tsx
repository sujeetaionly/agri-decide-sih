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
      
      {/* Top Branding Bar with Constant Standard Sizing */}
      <div className="pt-2 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-2xl">agriculture</span>
          </div>
          <div>
            <span className="font-black text-base text-emerald-900 dark:text-emerald-100 tracking-tight block">
              Agri-Decide
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-bold block -mt-0.5">
              कृषि-वाइज़
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePlayVoice}
          aria-label="Listen"
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
            isSpeaking
              ? 'bg-emerald-700 text-white animate-pulse'
              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-100'
          }`}
        >
          <span className="material-symbols-outlined text-base">volume_up</span>
          <span>{t('listen')}</span>
        </button>
      </div>

      {/* Main Login Elevated Card - Refined Hierarchy & Alignment */}
      <div className="my-auto w-full max-w-sm mx-auto bg-white dark:bg-[#1E231B] border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-7 shadow-md space-y-6">
        
        {/* Title Section with Balanced Center Alignment */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black font-headline text-[#1A1C18] dark:text-[#E2E3DC] tracking-tight">
            {t('loginTitle')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            अपनी पहचान प्रमाणित करें
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-300 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {!isOtpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 pl-1">
                {t('mobileNumberLabel')}
              </label>

              {/* Integrated Prefix Input with Seamless Alignment & No Overflow */}
              <div className="flex items-center w-full h-14 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/60 focus-within:border-emerald-600 focus-within:bg-white dark:focus-within:bg-[#1E231B] focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all overflow-hidden shadow-sm">
                <div className="flex-shrink-0 h-full px-3.5 text-xs font-extrabold text-stone-600 dark:text-stone-400 select-none border-r border-stone-200 dark:border-stone-700 bg-stone-100/70 dark:bg-stone-800/60 flex items-center gap-1.5">
                  <span className="text-[11px] text-stone-400 font-bold tracking-wide">IN</span>
                  <span className="text-stone-700 dark:text-stone-200 font-bold">+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="min-w-0 flex-1 h-full px-3.5 bg-transparent text-[#1A1C18] dark:text-[#E2E3DC] font-extrabold text-lg tracking-wider focus:outline-none placeholder:text-stone-300 dark:placeholder:text-stone-600"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length < 10}
              className={`w-full h-14 rounded-full font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
                phone.length === 10
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl active:scale-[0.98] cursor-pointer'
                  : 'bg-stone-300 dark:bg-stone-800 text-stone-500 dark:text-stone-400 cursor-not-allowed shadow-none'
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
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between pl-1">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  {t('enterOtp')} (+91 {phone})
                </label>
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="text-xs text-emerald-700 font-bold underline cursor-pointer"
                >
                  नंबर बदलें
                </button>
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className="w-full h-14 text-center rounded-2xl bg-stone-50 dark:bg-stone-900/60 border-2 border-stone-200 dark:border-stone-800 text-[#1A1C18] dark:text-[#E2E3DC] font-extrabold text-3xl tracking-[0.35em] focus:border-emerald-600 focus:outline-none shadow-sm"
                autoFocus
              />
            </div>

            {demoCodeHint && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 p-2.5 rounded-xl text-xs text-center font-bold">
                डेमो कोड: <strong>{demoCodeHint}</strong>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length < 4}
              className={`w-full h-14 rounded-full font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
                otp.length >= 4
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl active:scale-[0.98] cursor-pointer'
                  : 'bg-stone-300 dark:bg-stone-800 text-stone-500 dark:text-stone-400 cursor-not-allowed shadow-none'
              }`}
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

        {/* Clean Balanced Divider */}
        <div className="relative flex py-0.5 items-center">
          <div className="flex-grow border-t border-stone-200 dark:border-stone-800" />
          <span className="flex-shrink mx-3 text-xs text-stone-400 font-bold">या</span>
          <div className="flex-grow border-t border-stone-200 dark:border-stone-800" />
        </div>

        {/* Elevated Guest Bypass Button */}
        <button
          type="button"
          onClick={handleGuest}
          className="w-full py-3.5 px-6 rounded-full bg-white dark:bg-[#1E231B] border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-600/40 text-stone-800 dark:text-stone-200 font-bold text-sm shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base text-emerald-700 dark:text-emerald-400">person_outline</span>
          <span>{t('guestBypass')}</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      {/* Properly Placed Reassurance Footer */}
      <footer className="pt-3 pb-4 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-stone-500 dark:text-stone-400 font-medium">
          <span className="material-symbols-outlined text-base text-emerald-700 dark:text-emerald-400">verified_user</span>
          <span>सुरक्षित एवं गोपनीयता संरक्षित</span>
        </div>
      </footer>
    </div>
  );
};
