import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Mail,
  UserPlus,
  LogIn,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  HardDrive,
  RefreshCw,
  Plus,
  X,
  UserCheck,
  Sparkles,
  Key,
  Clock,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { SecurityRecoveryModal } from './SecurityRecoveryModal';

interface GmailAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup' | 'manual' | 'manage';
}

export const GmailAuthModal: React.FC<GmailAuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'manage',
}) => {
  const {
    gmailAccounts,
    currentGmailUser,
    loginWithGmail,
    signUpWithGmail,
    logoutGmail,
    addManualGmailAccount,
    removeGmailAccount,
    switchGmailAccount,
    setBackupTargetGmail,
    autoBackupSettings,
    triggerAutoBackup,
    addSecurityLog,
    updateSecuritySettings,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'manual' | 'manage'>(initialTab);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  
  // Sign up states
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('admin');
  const [signUpStep, setSignUpStep] = useState<'form' | 'otp'>('form');
  const [signUpOtp, setSignUpOtp] = useState('');
  const [generatedSignUpOtp, setGeneratedSignUpOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(120);
  const [otpCooldown, setOtpCooldown] = useState(0);

  // Manual Add states
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualRole, setManualRole] = useState<UserRole>('accountant');
  const [manualAsBackup, setManualAsBackup] = useState(true);

  // Recovery modal state
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (signUpStep === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [signUpStep, otpTimer]);

  // Resend cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpCooldown > 0) {
      interval = setInterval(() => {
        setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpCooldown]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      showToast('অনুগ্রহ করে জিমেইল অ্যাড্রেস লিখুন');
      return;
    }
    const success = loginWithGmail(loginEmail);
    if (success) {
      setLoginEmail('');
      onClose();
    }
  };

  const handleSendSignUpOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      showToast('অনুগ্রহ করে সঠিক জিমেইল অ্যাড্রেস লিখুন');
      return;
    }
    if (!signUpName.trim()) {
      showToast('অনুগ্রহ করে আপনার নাম লিখুন');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedSignUpOtp(code);
    setOtpTimer(120);
    setOtpCooldown(30);
    setSignUpStep('otp');
    addSecurityLog('otp_sent', `নতুন অ্যাকাউন্ট তৈরির জন্য জিমেইলে OTP পাঠানো হয়েছে (${signUpEmail.trim()})`, 'success');
    showToast(`৬-ডিজিটের ভেরিফিকেশন OTP কোড পাঠানো হয়েছে: ${signUpEmail.trim()}`);
  };

  const handleResendSignUpOtp = () => {
    if (otpCooldown > 0) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedSignUpOtp(code);
    setOtpTimer(120);
    setOtpCooldown(30);
    addSecurityLog('otp_sent', `নতুন অ্যাকাউন্ট তৈরির জন্য পুনরায় OTP পাঠানো হয়েছে (${signUpEmail.trim()})`, 'success');
    showToast('নতুন OTP কোড পাঠানো হয়েছে');
  };

  const handleVerifySignUpOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpOtp.trim() || signUpOtp.length < 6) {
      showToast('৬ ডিজিটের OTP কোড লিখুন');
      return;
    }
    if (otpTimer === 0) {
      showToast('OTP কোডের মেয়াদ শেষ! পুনরায় কোড পাঠান।');
      return;
    }
    if (signUpOtp.trim() !== generatedSignUpOtp) {
      showToast('ভুল OTP কোড! সঠিক কোডটি দিন।');
      return;
    }

    // OTP Verified! Proceed with sign up
    const success = signUpWithGmail(signUpEmail, signUpName, signUpRole);
    if (success) {
      updateSecuritySettings({
        recoveryEmail: signUpEmail.trim(),
        isRecoveryEmailVerified: true,
      });
      addSecurityLog('otp_verified', `নতুন অ্যাকাউন্ট জিমেইল OTP ভেরিফিকেশন সফল (${signUpEmail.trim()})`, 'success');
      addSecurityLog('account_created', `নতুন ইউজার সফলভাবে যুক্ত ও ভেরিফাই হয়েছে (${signUpName} - ${signUpRole})`, 'success');
      showToast('জিমেইল ভেরিফিকেশন ও অ্যাকাউন্ট তৈরি সফল হয়েছে!');
      setSignUpEmail('');
      setSignUpName('');
      setSignUpOtp('');
      setSignUpStep('form');
      onClose();
    }
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) {
      showToast('অনুগ্রহ করে জিমেইল অ্যাড্রেস লিখুন');
      return;
    }
    addManualGmailAccount(manualEmail, manualName, manualRole, manualAsBackup);
    setManualEmail('');
    setManualName('');
    setActiveTab('manage');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      <SecurityRecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-5 py-4 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-red-500 font-bold shadow-2xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.55 0 2.94.55 4.04 1.55l3.03-3.03C17.24 1.8 14.8 1 12 1 7.42 1 3.5 3.56 1.62 7.28l3.66 2.84C6.18 7.36 8.84 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.28c0-.79-.07-1.55-.2-2.28H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.57l3.68 2.85c2.15-1.99 3.74-4.91 3.74-8.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.88c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.62 7.48C.59 9.54 0 11.71 0 14c0 2.29.59 4.46 1.62 6.52l3.66-2.64z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.68-2.85c-1.08.73-2.47 1.16-4.27 1.16-3.16 0-5.82-2.36-6.72-5.52L1.62 15.68C3.5 19.4 7.42 23 12 23z"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Gmail অ্যাকাউন্ট ও সিকিউর সাইন-ইন</h3>
                  <span className="px-1.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-bold rounded-md border border-emerald-200">
                    OTP Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  নিরাপদ জিমেইল ওটিপি ভেরিফিকেশন, ব্যাকআপ ও একাধিক অ্যাকাউন্ট কন্ট্রোল
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('manage');
                setSignUpStep('form');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'manage'
                  ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>অ্যাকাউন্ট ও ব্যাকআপ ({gmailAccounts.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setSignUpStep('form');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>নতুন অ্যাকাউন্ট (OTP সাইন আপ)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('login');
                setSignUpStep('form');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('manual');
                setSignUpStep('form');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'manual'
                  ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ম্যানুয়াল Add</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {/* TAB 1: MANAGE ACCOUNTS */}
            {activeTab === 'manage' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    যুক্তকৃত Gmail অ্যাকাউন্টসমূহ ({gmailAccounts.length}):
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('signup');
                      setSignUpStep('form');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন যুক্ত করুন</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {gmailAccounts.map((acc) => {
                    const isCurrent = currentGmailUser?.id === acc.id;
                    const isBackup = autoBackupSettings.targetGmailId === acc.id || acc.isBackupTarget;

                    return (
                      <div
                        key={acc.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-white border-emerald-500 shadow-xs ring-2 ring-emerald-500/10'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                                isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {acc.name.slice(0, 1)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-slate-900 truncate">{acc.name}</span>
                                {isCurrent && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">
                                    বর্তমান সক্রিয়
                                  </span>
                                )}
                                {isBackup && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-blue-100 text-blue-800 rounded flex items-center gap-0.5">
                                    <ShieldCheck className="w-2.5 h-2.5" />
                                    ব্যাকআপ গন্তব্য
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono truncate">{acc.email}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {!isBackup && (
                              <button
                                onClick={() => setBackupTargetGmail(acc.id)}
                                title="এই অ্যাকাউন্টকে ব্যাকআপ গন্তব্য হিসেবে সেট করুন"
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                ব্যাকআপে সেট
                              </button>
                            )}

                            {!isCurrent && (
                              <button
                                onClick={() => switchGmailAccount(acc.id)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                সুইচ
                              </button>
                            )}

                            {gmailAccounts.length > 1 && (
                              <button
                                onClick={() => removeGmailAccount(acc.id)}
                                title="মুছুন"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Automatic Backup Box */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                      <span className="text-xs font-bold text-emerald-800">অটোমেটিক ব্যাকআপ ইঞ্জিন সক্রিয়</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      প্রতি {autoBackupSettings.intervalMinutes} মিনিট পর পর
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mb-3">
                    নির্বাচিত Gmail:{' '}
                    <strong className="text-emerald-950 font-mono">
                      {gmailAccounts.find((g) => g.id === autoBackupSettings.targetGmailId)?.email || 'alluser27bd@gmail.com'}
                    </strong>
                  </p>

                  <button
                    onClick={() => {
                      triggerAutoBackup(true);
                      showToast('ম্যানুয়াল ব্যাকআপ সফল! Google Sync ব্যাকআপ সংরক্ষিত হয়েছে।');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>এখনই ক্লাউড ব্যাকআপ সিঙ্ক করুন</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SIGN UP WITH GMAIL OTP VERIFICATION */}
            {activeTab === 'signup' && (
              <div className="space-y-4">
                {signUpStep === 'form' ? (
                  <form onSubmit={handleSendSignUpOtp} className="space-y-3.5">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <strong>জিমেইল ওটিপি নিরাপত্তা:</strong> নতুন অ্যাকাউন্ট তৈরিতে আপনার জিমেইলে একটি ৬-সংখ্যার ভেরিফিকেশন কোড পাঠানো হবে।
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gmail অ্যাড্রেস *
                      </label>
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:border-emerald-600 outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        আপনার পূর্ণ নাম / প্রতিষ্ঠানের নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="যেমন: জনাব মোর্শেদ আলম"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:border-emerald-600 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ইউজার রোল (User Role)
                      </label>
                      <select
                        value={signUpRole}
                        onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:border-emerald-600 outline-hidden"
                      >
                        <option value="admin">অ্যাডমিন (Admin - সকল অ্যাক্সেস)</option>
                        <option value="manager">ম্যানেজার (Manager)</option>
                        <option value="accountant">অ্যাকাউন্ট্যান্ট (Accountant)</option>
                        <option value="sales">সেলস এক্সিকিউটিভ (Sales)</option>
                        <option value="cashier">ক্যাশিয়ার (POS Cashier)</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Gmail-এ OTP কোড পাঠান →</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifySignUpOtpSubmit} className="space-y-4">
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1 font-bold">
                        <Mail className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black text-slate-900">Gmail OTP ভেরিফিকেশন</h4>
                      <p className="text-xs text-slate-500">
                        <span className="font-bold text-slate-800 font-mono">{signUpEmail}</span> ঠিকানায় ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে
                      </p>
                    </div>

                    {/* Simulated Badge */}
                    {generatedSignUpOtp && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-2 text-amber-900">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                          <div className="text-xs">
                            <span>সিমুলেটেড জিমেইল কোড: </span>
                            <span className="font-mono font-black bg-white px-2 py-0.5 rounded border border-amber-300 text-emerald-800">
                              {generatedSignUpOtp}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSignUpOtp(generatedSignUpOtp);
                            showToast('OTP কোড ইনপুট করা হয়েছে');
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          অটো-ফিল
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                        ৬-ডিজিটের OTP কোড লিখুন
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={signUpOtp}
                        onChange={(e) => setSignUpOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="• • • • • •"
                        className="w-full text-center tracking-[0.6em] font-mono text-xl font-black py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:border-emerald-600 text-slate-900"
                      />
                    </div>

                    {/* Timer & Resend */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>মেয়াদ:</span>
                        <span className={`font-mono font-bold ${otpTimer < 30 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {formatTimer(otpTimer)}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={otpCooldown > 0}
                        onClick={handleResendSignUpOtp}
                        className={`font-bold transition-all ${
                          otpCooldown > 0
                            ? 'text-slate-400 cursor-not-allowed'
                            : 'text-emerald-700 hover:underline cursor-pointer'
                        }`}
                      >
                        {otpCooldown > 0 ? `পুনরায় পাঠান (${otpCooldown}s)` : 'পুনরায় কোড পাঠান (Resend)'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSignUpStep('form')}
                        className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        পিছনে
                      </button>
                      <button
                        type="submit"
                        disabled={signUpOtp.length < 6 || otpTimer === 0}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>OTP যাচাই ও সাইন আপ সম্পন্ন করুন</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: QUICK GMAIL LOGIN */}
            {activeTab === 'login' && (
              <div className="space-y-4">
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gmail অ্যাড্রেস দিয়ে লগইন করুন
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="alluser27bd@gmail.com"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:border-emerald-500 outline-hidden font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setIsRecoveryOpen(true)}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>পিন বা পাসওয়ার্ড ভুলে গেছেন? (Forgot PIN)</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>সাইন ইন করুন</span>
                  </button>
                </form>

                {/* Quick One-Tap Existing Accounts */}
                {gmailAccounts.length > 0 && (
                  <div className="pt-3 border-t border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      সংরক্ষিত অ্যাকাউন্ট থেকে ওয়ান-ক্লিক লগইন:
                    </div>
                    <div className="space-y-1.5">
                      {gmailAccounts.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            loginWithGmail(acc.email, acc.name);
                            onClose();
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                              {acc.name.slice(0, 1)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">{acc.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{acc.email}</div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700">লগইন →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: MANUAL GMAIL ADD */}
            {activeTab === 'manual' && (
              <form onSubmit={handleManualAddSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gmail অ্যাড্রেস *
                  </label>
                  <input
                    type="email"
                    required
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="accountant@gmail.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অ্যাকাউন্টের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="যেমন: প্রধান হিসাব কর্মকর্তা"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ইউজার রোল
                  </label>
                  <select
                    value={manualRole}
                    onChange={(e) => setManualRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:border-emerald-600"
                  >
                    <option value="accountant">অ্যাকাউন্ট্যান্ট (Accountant)</option>
                    <option value="manager">ম্যানেজার (Manager)</option>
                    <option value="sales">সেলস এক্সিকিউটিভ (Sales)</option>
                    <option value="cashier">ক্যাশিয়ার (POS Cashier)</option>
                    <option value="admin">অ্যাডমিন (Admin)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="manualAsBackup"
                    checked={manualAsBackup}
                    onChange={(e) => setManualAsBackup(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="manualAsBackup" className="text-xs font-bold text-slate-700 cursor-pointer">
                    এই জিমেইলকে অটোমেটিক ব্যাকআপ গন্তব্য হিসেবে নির্ধারণ করুন
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>অ্যাকাউন্ট যুক্ত করুন</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
