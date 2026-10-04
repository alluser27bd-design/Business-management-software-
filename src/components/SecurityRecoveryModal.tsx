import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Key,
  Mail,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  X,
  FileKey2,
} from 'lucide-react';

interface SecurityRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SecurityRecoveryModal: React.FC<SecurityRecoveryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    securitySettings,
    sendRecoveryOtp,
    verifyRecoveryOtp,
    resetAdminPinWithRecovery,
    verifyBackupCode,
    activeRecoveryOtp,
    showToast,
  } = useApp();

  const [step, setStep] = useState<'method' | 'otp' | 'backup_code' | 'new_pin' | 'done'>('method');
  const [method, setMethod] = useState<'gmail' | 'backup_code'>('gmail');
  
  // OTP States
  const [otpInput, setOtpInput] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [latestGeneratedOtp, setLatestGeneratedOtp] = useState<string | null>(null);

  // Backup Code States
  const [backupCodeInput, setBackupCodeInput] = useState('');

  // New PIN States
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinText, setShowPinText] = useState(false);

  // Countdown timer for OTP expiry
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  // Resend cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleStartOtpFlow = () => {
    const res = sendRecoveryOtp();
    if (res.success) {
      setMaskedEmail(res.maskedEmail);
      setLatestGeneratedOtp(res.otpCode);
      setTimerSeconds(180);
      setResendCooldown(30);
      setStep('otp');
    }
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    const res = sendRecoveryOtp();
    if (res.success) {
      setLatestGeneratedOtp(res.otpCode);
      setTimerSeconds(180);
      setResendCooldown(30);
      showToast('নতুন OTP কোড সফলভাবে পাঠানো হয়েছে');
    }
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim() || otpInput.length < 6) {
      showToast('৬ ডিজিটের OTP কোডটি লিখুন');
      return;
    }
    const isValid = verifyRecoveryOtp(otpInput);
    if (isValid) {
      setStep('new_pin');
    }
  };

  const handleVerifyBackupCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupCodeInput.trim()) {
      showToast('৮-সংখ্যার ব্যাকআপ রিকভারি কোড লিখুন');
      return;
    }
    const isValid = verifyBackupCode(backupCodeInput);
    if (isValid) {
      setStep('new_pin');
    }
  };

  const handleResetPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      showToast('নতুন পিন কমপক্ষে ৪ ডিজিটের হতে হবে');
      return;
    }
    if (newPin !== confirmPin) {
      showToast('নতুন পিন ও নিশ্চিতকরণ পিন মেলেনি!');
      return;
    }
    const success = resetAdminPinWithRecovery(newPin);
    if (success) {
      setStep('done');
    }
  };

  const handleFinish = () => {
    setStep('method');
    setOtpInput('');
    setBackupCodeInput('');
    setNewPin('');
    setConfirmPin('');
    onClose();
    if (onSuccess) onSuccess();
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-emerald-100 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>অ্যাকাউন্ট ও পিন রিকভারি</span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-white/20 rounded-md tracking-wider">
                  Secure OTP
                </span>
              </h3>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                নিরাপদ জিমেইল ভেরিফিকেশনের মাধ্যমে নতুন পিন সেট করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Data Safety Assurance Banner */}
        <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 flex items-center gap-2 text-emerald-900 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="font-semibold">
            <strong>নিরাপত্তা নিশ্চয়তা:</strong> রিকভারির সময় কোনো কাস্টমার, পণ্য বা বিক্রয়ের ডাটা রিসেট বা ডিলিট হবে না।
          </p>
        </div>

        {/* Wizard Steps */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: CHOOSE METHOD */}
          {step === 'method' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-base font-black text-slate-900">রিকভারি মাধ্যম নির্বাচন করুন</h4>
                <p className="text-xs text-slate-500">
                  আপনার একাউন্টে পূর্বেই যাচাইকৃত জিমেইল বা ব্যাকআপ কোড ব্যবহার করুন
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div
                  onClick={() => setMethod('gmail')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    method === 'gmail'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${method === 'gmail' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">ভেরিফাইড জিমেইল OTP কোড</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        সুপারিশকৃত
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      রেজিস্টার্ড ইমেইলে ({securitySettings.recoveryEmail || 'alluser27bd@gmail.com'}) ৬-সংখ্যার ওটিপি কোড যাবে
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setMethod('backup_code')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    method === 'backup_code'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${method === 'backup_code' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <FileKey2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">৮-সংখ্যার ব্যাকআপ রিকভারি কোড</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        জরুরি ব্যাকআপ
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      পূর্ব সংরক্ষিত ৮-সংখ্যার যেকোনো একটি অব্যবহৃত রিকভারি কোড ব্যবহার করুন
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (method === 'gmail') {
                      handleStartOtpFlow();
                    } else {
                      setStep('backup_code');
                    }
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>সামনে এগিয়ে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2A: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900">৬-ডিজিটের জিমেইল OTP কোড দিন</h4>
                <p className="text-xs text-slate-500">
                  কোড পাঠানো হয়েছে: <span className="font-bold text-slate-800">{maskedEmail || 'alluser27bd@gmail.com'}</span>
                </p>
              </div>

              {/* Simulated Gmail Notification Badge for smooth local testing */}
              {latestGeneratedOtp && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-amber-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="text-[11px] font-black">Gmail ইনবক্স নোটিফিকেশন (সিমুলেটেড):</div>
                      <div className="text-xs font-mono font-bold tracking-widest text-emerald-800">
                        OTP কোড: <span className="bg-white px-2 py-0.5 rounded-md border border-amber-300">{latestGeneratedOtp}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpInput(latestGeneratedOtp);
                      showToast('OTP কোড ইনপুট বক্সে বসানো হয়েছে');
                    }}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shrink-0 cursor-pointer shadow-2xs"
                  >
                    স্বয়ংক্রিয় পূরণ
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                  ভেরিফিকেশন ওটিপি কোড (৬ ডিজিট)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.6em] font-mono text-2xl font-black py-3 px-4 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-900"
                />
              </div>

              {/* Timer and Resend options */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>মেয়াদ শেষ হতে বাকি:</span>
                  <span className={`font-mono font-bold ${timerSeconds < 30 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {formatTimer(timerSeconds)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleResendOtp}
                  className={`font-bold transition-all ${
                    resendCooldown > 0
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer'
                  }`}
                >
                  {resendCooldown > 0 ? `পুনরায় পাঠান (${resendCooldown}s)` : 'পুনরায় কোড পাঠান (Resend)'}
                </button>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  পিছনে
                </button>
                <button
                  type="submit"
                  disabled={otpInput.length < 6 || timerSeconds === 0}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>কোড যাচাই ও সামনে যান</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2B: BACKUP CODE VERIFICATION */}
          {step === 'backup_code' && (
            <form onSubmit={handleVerifyBackupCodeSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-2">
                  <FileKey2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900">ব্যাকআপ রিকভারি কোড দিন</h4>
                <p className="text-xs text-slate-500">
                  পূর্বে সেভ করা ৮-সংখ্যার ব্যাকআপ কোড লিখুন (যেমন: BIZ-8924-1182)
                </p>
              </div>

              {/* Sample hint for developer preview */}
              {securitySettings.backupCodes && securitySettings.backupCodes.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">নমুনা ব্যাকআপ কোড: </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {securitySettings.backupCodes.find((c) => !securitySettings.usedBackupCodes?.includes(c)) || securitySettings.backupCodes[0]}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                  ব্যাকআপ কোড (Backup Code)
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={backupCodeInput}
                  onChange={(e) => setBackupCodeInput(e.target.value.toUpperCase())}
                  placeholder="BIZ-XXXX-XXXX"
                  className="w-full text-center font-mono text-lg font-bold py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:border-emerald-600 text-slate-900 uppercase"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  পিছনে
                </button>
                <button
                  type="submit"
                  disabled={!backupCodeInput.trim()}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>কোড যাচাই করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SET NEW PIN */}
          {step === 'new_pin' && (
            <form onSubmit={handleResetPinSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <Key className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900">নতুন অ্যাডমিন পিন কোড সেট করুন</h4>
                <p className="text-xs text-slate-500">
                  ভবিষ্যতে সেটিংস ও সুরক্ষার জন্য নতুন ৪ থেকে ৬ সংখ্যার পিন দিন
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পিন কোড (New PIN)</label>
                  <div className="relative">
                    <input
                      type={showPinText ? 'text' : 'password'}
                      required
                      maxLength={6}
                      autoFocus
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="নতুন ৪-৬ ডিজিট পিন"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold font-mono text-slate-900 tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPinText(!showPinText)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পিন নিশ্চিত করুন (Confirm PIN)</label>
                  <input
                    type={showPinText ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="পুনরায় একই পিন লিখুন"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold font-mono text-slate-900 tracking-wider"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={newPin.length < 4 || newPin !== confirmPin}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>নতুন পিন সেভ ও সক্রিয় করুন</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'done' && (
            <div className="text-center space-y-4 py-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">পিন রিকভারি সফলভাবে সম্পন্ন হয়েছে!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  আপনার অ্যাডমিন সিকিউরিটি পিন সফলভাবে পরিবর্তন করা হয়েছে। আপনার প্রতিষ্ঠানের কোনো ডাটা ক্ষতিগ্রস্ত বা ডিলিট হয়নি।
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 text-left space-y-1.5 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>নতুন পিন কোড: <strong>{newPin}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>লকআউট স্ট্যাটাস: <strong>আনলকড (সক্রিয়)</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>হিসাব ও পণ্য ডাটা: <strong>১০০% অক্ষত ও সুরক্ষিত</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                সফটওয়্যারে প্রবেশ করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
