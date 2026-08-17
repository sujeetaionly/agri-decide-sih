import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { AudioButton } from '@/components/common/AudioButton';

interface LoginPageProps {
  onLoginSuccess: (phone?: string) => void;
  onSkip: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onSkip,
}) => {
  const { isHindi } = useLanguage();
  const { sendOtp, verifyOtp, loginAsGuest, isLoading } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [demoCodeHint, setDemoCodeHint] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = await sendOtp(phone);
    if (!res.success) {
      setErrorMessage(
        isHindi
          ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।'
          : res.error || 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    setIsOtpSent(true);
    if (res.demoOtp) {
      setDemoCodeHint(res.demoOtp);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = await verifyOtp(phone, otp);
    if (!res.success) {
      setErrorMessage(
        isHindi
          ? 'अमान्य ओटीपी कोड। परीक्षण हेतु कोड 1234 दर्ज करें।'
          : res.error || 'Invalid OTP code. For demo, use 1234.'
      );
      return;
    }

    onLoginSuccess(phone);
  };

  const handleGuestLogin = async () => {
    await loginAsGuest();
    onSkip();
  };

  return (
    <div className="pattern-bg text-on-background min-h-screen flex flex-col justify-between font-body-lg">
      {/* Top Header */}
      <header className="bg-surface shadow-sm flex justify-between items-center px-margin-mobile w-full h-[56px] sticky top-0 z-40 border-b border-outline-variant/50">
        <div className="flex items-center gap-2 max-w-md mx-auto w-full">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">agriculture</span>
          </div>
          <h1 className="font-bold text-lg text-primary tracking-tight">
            Agri-Decide • {isHindi ? 'कृषि-वाइज़' : 'KrishiWise'}
          </h1>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-6 my-auto">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-6 md:p-8 flex flex-col gap-6 border border-outline-variant/60 animate-in fade-in zoom-in-95 duration-200">
          {/* Header & Title */}
          <div className="text-center space-y-1.5 relative">
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-headline-lg text-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
                {isHindi ? 'लॉगिन / Login' : 'Login / Sign In'}
              </h2>
              <AudioButton
                id="login-page-audio"
                textHi="लॉगिन करें: अपना 10 अंकों का मोबाइल नंबर दर्ज करें और ओटीपी भेजें बटन दबाएं, या बिना लॉगिन के अतिथि के रूप में जारी रखें।"
                textEn="Login to your account. Enter your 10-digit mobile number and tap Send OTP, or continue as guest without login."
                size="sm"
              />
            </div>
            <p className="font-body-md text-sm text-on-surface-variant">
              {isHindi
                ? 'अपनी पहचान प्रमाणित करें / Verify your identity'
                : 'Verify your farmer identity for personalized advice'}
            </p>
          </div>

          {/* Validation Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-error-container/60 border border-error/30 text-error text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {!isOtpSent ? (
            /* Phase 1: Phone Number Input Form */
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-semibold text-xs text-on-surface uppercase tracking-wider"
                  htmlFor="phone"
                >
                  {isHindi ? 'मोबाइल नंबर / Phone Number' : 'Mobile Number'}
                </label>
                <div className="relative flex items-center h-[56px]">
                  <div className="absolute left-3 flex items-center gap-1 text-on-surface-variant font-bold text-sm border-r border-outline-variant pr-2">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="98765 43210"
                    required
                    className="w-full h-full pl-20 pr-4 border-2 border-outline-variant rounded-xl bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 font-bold text-base text-on-surface outline-none transition-all placeholder:font-normal placeholder:text-outline"
                  />
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  {isHindi
                    ? 'हम आपको 4 अंकों का सत्यापन कोड (OTP) भेजेंगे।'
                    : 'We will send you a 4-digit verification OTP.'}
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[56px] bg-primary text-on-primary rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:bg-primary-container transition-all active:translate-y-[2px] active:shadow-none duration-150 btn-tactile cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{isHindi ? 'OTP भेजें / Send OTP' : 'Send OTP'}</span>
                    <span className="material-symbols-outlined text-[20px]">send</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Phase 2: OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5 animate-in fade-in">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="font-semibold text-xs text-on-surface uppercase tracking-wider"
                    htmlFor="otp"
                  >
                    {isHindi ? 'ओटीपी दर्ज करें / Enter OTP' : 'Enter OTP Code'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    {isHindi ? 'नंबर बदलें' : 'Change Number'}
                  </button>
                </div>

                <div className="relative flex items-center h-[56px]">
                  <span className="absolute left-4 material-symbols-outlined text-on-surface-variant text-[20px]">
                    pin
                  </span>
                  <input
                    id="otp"
                    name="otp"
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="1234"
                    autoFocus
                    required
                    className="w-full h-full pl-12 pr-4 border-2 border-outline-variant rounded-xl bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 font-bold text-lg tracking-widest text-on-surface outline-none transition-all"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
                  <span>+91 {phone}</span>
                  <span className="font-semibold text-primary">
                    {isHindi ? 'परीक्षण कोड:' : 'Demo Code:'} {demoCodeHint || '1234'}
                  </span>
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[56px] bg-primary text-on-primary rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:bg-primary-container transition-all active:translate-y-[2px] active:shadow-none duration-150 btn-tactile cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{isHindi ? 'सत्यापित करें / Verify & Login' : 'Verify & Login'}</span>
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="flex-shrink-0 mx-4 font-semibold text-xs text-on-surface-variant uppercase">
              {isHindi ? 'या / OR' : 'OR'}
            </span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          {/* Secondary Action: Skip / Continue as Guest */}
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full h-[56px] bg-surface-container-high text-on-surface rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-sm hover:bg-surface-container-highest transition-colors active:translate-y-[2px] duration-150 border-2 border-outline-variant btn-tactile cursor-pointer disabled:opacity-60"
          >
            <span>
              {isHindi
                ? 'लॉगिन के बिना जारी रखें / Continue as Guest'
                : 'Continue as Guest (No Login)'}
            </span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="p-4 text-center text-xs text-on-surface-variant">
        <span>{isHindi ? 'सुरक्षित एवं गोपनीयता संरक्षित' : 'Secure & Privacy-Preserved'}</span>
      </footer>
    </div>
  );
};
