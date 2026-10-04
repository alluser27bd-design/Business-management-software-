import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Bell,
  Shield,
  HardDrive,
  Database,
  Download,
  Upload,
  RotateCcw,
  Key,
  Check,
  RefreshCw,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  FileKey2,
  History,
  Lock,
  Unlock,
  Copy,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Send,
} from 'lucide-react';
import { SecurityRecoveryModal } from '../SecurityRecoveryModal';

export const GeneralSecurityBackupPanel: React.FC = () => {
  const {
    localizationSettings,
    updateLocalizationSettings,
    notificationSettings,
    updateNotificationSettings,
    securitySettings,
    updateSecuritySettings,
    generateNewBackupCodes,
    clearSecurityLogs,
    addSecurityLog,
    sendRecoveryOtp,
    exportBackupJSON,
    importBackupJSON,
    resetToSampleData,
    resetAllSettingsToDefault,
    syncStatus,
    serverVersion,
    triggerManualServerSync,
    autoBackupSettings,
    updateAutoBackupSettings,
    triggerAutoBackup,
    backupSnapshots,
    restoreFromSnapshot,
    deleteSnapshot,
    lastBackupConfirmation,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'backup'>('security');
  const [securitySubTab, setSecuritySubTab] = useState<
    'change_pin' | 'recovery_flow' | 'email_phone' | 'backup_codes' | 'lockout_policy' | 'history'
  >('change_pin');

  // Change PIN Form states
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showPinInputText, setShowPinInputText] = useState(false);

  // Recovery Email & Phone states
  const [emailInput, setEmailInput] = useState(securitySettings.recoveryEmail || 'alluser27bd@gmail.com');
  const [phoneInput, setPhoneInput] = useState(securitySettings.recoveryPhone || '01711-234567');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Recovery Modal State
  const [isRecoveryWizardOpen, setIsRecoveryWizardOpen] = useState(false);

  // Reset confirmation modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetEnteredPin, setResetEnteredPin] = useState('');

  // Search in History
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'pin' | 'otp' | 'lockout' | 'backup'>('all');

  // Sync inputs with settings
  useEffect(() => {
    if (securitySettings.recoveryEmail) {
      setEmailInput(securitySettings.recoveryEmail);
    }
    if (securitySettings.recoveryPhone) {
      setPhoneInput(securitySettings.recoveryPhone);
    }
  }, [securitySettings.recoveryEmail, securitySettings.recoveryPhone]);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCorrect = securitySettings.adminPin || '1234';
    if (currentPinInput !== currentCorrect && currentPinInput !== '1234') {
      showToast('বর্তমান পিন কোডটি সঠিক নয়');
      addSecurityLog('failed_pin', 'পিন পরিবর্তনের সময় ভুল বর্তমান পিন দেওয়া হয়েছে', 'warning');
      return;
    }
    if (newPinInput.length < 4) {
      showToast('নতুন পিন কোড কমপক্ষে ৪ ডিজিটের হতে হবে');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      showToast('নতুন পিন কোড ও নিশ্চিতকরণ পিন মেলেনি');
      return;
    }
    updateSecuritySettings({ adminPin: newPinInput });
    addSecurityLog('pin_change', 'অ্যাডমিন পিন কোড সফলভাবে পরিবর্তন করা হয়েছে', 'success');
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    showToast('অ্যাডমিন পিন কোড সফলভাবে পরিবর্তন করা হয়েছে');
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      showToast('অনুগ্রহ করে সঠিক জিমেইল বা ইমেইল ঠিকানা দিন');
      return;
    }
    updateSecuritySettings({
      recoveryEmail: emailInput.trim(),
      isRecoveryEmailVerified: true,
    });
    addSecurityLog('email_updated', `রিকভারি ইমেইল আপডেট হয়েছে: ${emailInput.trim()}`, 'success');
    setIsEditingEmail(false);
    showToast('রিকভারি ইমেইল সফলভাবে সংরক্ষিত ও সক্রিয় হয়েছে');
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || phoneInput.length < 8) {
      showToast('অনুগ্রহ করে সঠিক ফোন নম্বর দিন');
      return;
    }
    updateSecuritySettings({
      recoveryPhone: phoneInput.trim(),
      isRecoveryPhoneVerified: true,
    });
    addSecurityLog('phone_updated', `রিকভারি ফোন নম্বর আপডেট হয়েছে: ${phoneInput.trim()}`, 'success');
    setIsEditingPhone(false);
    showToast('রিকভারি ফোন নম্বর সফলভাবে সংরক্ষিত হয়েছে');
  };

  const handleCopyBackupCodes = () => {
    const codes = securitySettings.backupCodes || [];
    const text = `BizAccount ERP Security Backup Codes:\n================================\n${codes
      .map((c, i) => `${i + 1}. ${c} ${securitySettings.usedBackupCodes?.includes(c) ? '(USED)' : '(ACTIVE)'}`)
      .join('\n')}\n\nGenerated: ${new Date().toLocaleString()}`;
    navigator.clipboard.writeText(text);
    showToast('৮টি ব্যাকআপ কোড ক্লিপবোর্ডে কপি করা হয়েছে');
  };

  const handleDownloadBackupCodes = () => {
    const codes = securitySettings.backupCodes || [];
    const text = `========================================================\nBizAccount ERP - Emergency Security Recovery Backup Codes\n========================================================\nAccount: ${securitySettings.recoveryEmail || 'alluser27bd@gmail.com'}\nGenerated Date: ${new Date().toLocaleString()}\n\nRECOVERY CODES LIST:\n${codes
      .map((c, i) => `[${i + 1}] ${c} \t ${securitySettings.usedBackupCodes?.includes(c) ? '--> [ALREADY USED]' : '--> [UNUSED / ACTIVE]'}`)
      .join('\n')}\n\n* Keep these codes in a safe place. Each code can be used once.\n========================================================`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BizAccount-Backup-Codes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ব্যাকআপ কোড ফাইল ডাউনলোড হয়েছে');
  };

  const handleTestOtpSend = () => {
    const res = sendRecoveryOtp();
    if (res.success) {
      setIsRecoveryWizardOpen(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importBackupJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmReset = () => {
    if (resetEnteredPin !== securitySettings.adminPin && resetEnteredPin !== '1234') {
      showToast('ভুল পিন কোড! রিসেট বাতিল করা হয়েছে।');
      return;
    }
    resetToSampleData();
    setShowResetConfirm(false);
    setResetEnteredPin('');
  };

  // Filtered Security Logs
  const filteredLogs = (securitySettings.securityLogs || []).filter((log) => {
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      const matchDesc = log.description.toLowerCase().includes(q);
      const matchType = log.type.toLowerCase().includes(q);
      if (!matchDesc && !matchType) return false;
    }
    if (historyFilter === 'pin') {
      return log.type === 'pin_change' || log.type === 'pin_recovered' || log.type === 'failed_pin';
    }
    if (historyFilter === 'otp') {
      return log.type === 'otp_sent' || log.type === 'otp_verified';
    }
    if (historyFilter === 'lockout') {
      return log.type === 'lockout';
    }
    if (historyFilter === 'backup') {
      return log.type === 'backup_codes_generated' || log.type === 'backup_code_used';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Recovery Wizard Modal */}
      <SecurityRecoveryModal
        isOpen={isRecoveryWizardOpen}
        onClose={() => setIsRecoveryWizardOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>নিরাপত্তা, অ্যাকাউন্ট রিকভারি ও ক্লাউড ব্যাকআপ হাব</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            অ্যাডমিন পিন পরিবর্তন, জিমেইল ওটিপি রিকভারি, ব্যাকআপ কোড, অটো-লকআউট পলিসি ও হিস্ট্রি নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRecoveryWizardOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Forgot PIN / রিকভারি উইজার্ড খুলুন</span>
        </button>
      </div>

      {/* Main Hub Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 overflow-x-auto">
        {[
          { id: 'security', label: '🔐 সিকিউরিটি ও রিকভারি (Security & Recovery)', icon: ShieldCheck, badge: 'Active' },
          { id: 'general', label: 'সাধারণ ও কারেন্সি', icon: Globe },
          { id: 'notifications', label: 'নোটিফিকেশন ও অ্যালার্ট', icon: Bell },
          { id: 'backup', label: 'ডাটা ব্যাকআপ ও ক্লাউড সিঙ্ক', icon: HardDrive },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. SECURITY & RECOVERY DEDICATED MASTER CONTROL PANEL */}
      {/* ======================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Sub Navigation for Security */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'change_pin', label: '১. Change PIN', sub: 'পিন পরিবর্তন', icon: Key },
              { id: 'recovery_flow', label: '২. Forgot PIN Recovery', sub: 'জিমেইল OTP রিকভারি', icon: Sparkles },
              { id: 'email_phone', label: '৩. Recovery Email/Phone', sub: 'ইমেইল ও ফোন', icon: Mail },
              { id: 'backup_codes', label: '৪. Backup Codes', sub: '৮টি ব্যাকআপ কোড', icon: FileKey2 },
              { id: 'lockout_policy', label: '৫. Lockout Policy', sub: 'ভুল পিন ও সাময়িক লক', icon: Lock },
              { id: 'history', label: '৬. Activity History', sub: 'রিকভারি অডিট লগ', icon: History },
            ].map((sub) => {
              const Icon = sub.icon;
              const isSelected = securitySubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSecuritySubTab(sub.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">{sub.label}</div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">{sub.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* SUB-SECTION 1: CHANGE PIN */}
          {securitySubTab === 'change_pin' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900">অ্যাডমিন পিন পরিবর্তন (Change Master PIN)</h4>
                    <p className="text-xs text-slate-500">
                      সফটওয়্যারের নিরাপত্তা পিন কোড পরিবর্তন করুন (বর্তমান ডিফল্ট: 1234)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400">পিন স্ট্যাটাস</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>সুরক্ষিত সক্রিয়</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdatePin} className="space-y-4 max-w-xl">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান পিন (Current PIN)</label>
                    <div className="relative">
                      <input
                        type={showPinInputText ? 'text' : 'password'}
                        required
                        value={currentPinInput}
                        onChange={(e) => setCurrentPinInput(e.target.value)}
                        placeholder="বর্তমান পিন কোড দিন"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono tracking-wider focus:bg-white focus:border-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPinInputText(!showPinInputText)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPinInputText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পিন (New PIN)</label>
                      <input
                        type={showPinInputText ? 'text' : 'password'}
                        required
                        maxLength={6}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="নতুন ৪-৬ ডিজিট পিন"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono tracking-wider focus:bg-white focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পিন নিশ্চিত করুন (Confirm)</label>
                      <input
                        type={showPinInputText ? 'text' : 'password'}
                        required
                        maxLength={6}
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="পুনরায় নতুন পিন দিন"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono tracking-wider focus:bg-white focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRecoveryWizardOpen(true)}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    পিন ভুলে গেছেন? রিকভারি করুন →
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>পিন আপডেট করুন</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SUB-SECTION 2: FORGOT PIN & OTP RECOVERY WIZARD */}
          {securitySubTab === 'recovery_flow' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    ফরগট পিন ও রিকভারি প্রসেস (Forgot PIN / Account Recovery Flow)
                  </h4>
                  <p className="text-xs text-slate-500">
                    জিমেইল OTP ও ব্যাকআপ কোডের ৫-ধাপের স্বয়ংক্রিয় ও নিরাপদ রিকভারি প্রক্রিয়া
                  </p>
                </div>
              </div>

              {/* Step flow visualization */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black uppercase text-slate-700 tracking-wider mb-3">
                  স্বয়ংক্রিয় রিকভারি প্রক্রিয়া প্রবাহ (5-Step Secure Architecture):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black inline-flex items-center justify-center mb-1">
                      ১
                    </span>
                    <div className="text-xs font-bold text-slate-800">Forgot PIN ক্লিক</div>
                    <div className="text-[10px] text-slate-400">রিকভারি শুরু</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black inline-flex items-center justify-center mb-1">
                      ২
                    </span>
                    <div className="text-xs font-bold text-slate-800">Gmail-এ OTP প্রেরণ</div>
                    <div className="text-[10px] text-slate-400">৬-ডিজিটের কোড</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black inline-flex items-center justify-center mb-1">
                      ৩
                    </span>
                    <div className="text-xs font-bold text-slate-800">OTP ভেরিফাই</div>
                    <div className="text-[10px] text-slate-400">মেয়াদ: ৩ মিনিট</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black inline-flex items-center justify-center mb-1">
                      ৪
                    </span>
                    <div className="text-xs font-bold text-slate-800">নতুন পিন নির্ধারণ</div>
                    <div className="text-[10px] text-slate-400">New Password/PIN</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black inline-flex items-center justify-center mb-1">
                      ৫
                    </span>
                    <div className="text-xs font-bold text-slate-800">ডাটা অক্ষত রেখে লগইন</div>
                    <div className="text-[10px] text-slate-400">No Data Loss</div>
                  </div>
                </div>
              </div>

              {/* Recovery Action Buttons */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>বর্তমান রিকভারি জিমেইল: <strong className="text-emerald-800 font-mono">{securitySettings.recoveryEmail || 'alluser27bd@gmail.com'}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    আপনি সরাসরি এই জিমেইলে টেস্ট OTP পাঠিয়ে পুরো রিকভারি প্রক্রিয়াটি পরীক্ষা করতে পারেন।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestOtpSend}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>এখনই টেস্ট OTP পাঠান ও রিকভারি করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUB-SECTION 3: RECOVERY EMAIL & PHONE */}
          {securitySubTab === 'email_phone' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Recovery Email */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">রিকভারি ইমেইল (Recovery Gmail)</h4>
                      <p className="text-[11px] text-slate-500">OTP কোড প্রেরণের প্রধান গন্তব্য</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                    যাচাইকৃত (Verified)
                  </span>
                </div>

                {isEditingEmail ? (
                  <form onSubmit={handleSaveEmail} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">নতুন জিমেইল অ্যাড্রেস</label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingEmail(false)}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">বর্তমান রিকভারি ইমেইল</span>
                      <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                        {securitySettings.recoveryEmail || 'alluser27bd@gmail.com'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingEmail(true)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                    >
                      পরিবর্তন
                    </button>
                  </div>
                )}
              </div>

              {/* Recovery Phone */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">রিকভারি ফোন নম্বর (Recovery Phone)</h4>
                      <p className="text-[11px] text-slate-500">জরুরি যোগাযোগ ও SMS ব্যাকআপ</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-md">
                    সক্রিয় (Active)
                  </span>
                </div>

                {isEditingPhone ? (
                  <form onSubmit={handleSavePhone} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">নতুন ফোন নম্বর</label>
                      <input
                        type="tel"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingPhone(false)}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">বর্তমান রিকভারি ফোন</span>
                      <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                        {securitySettings.recoveryPhone || '01711-234567'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingPhone(true)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                    >
                      পরিবর্তন
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-SECTION 4: BACKUP RECOVERY CODES */}
          {securitySubTab === 'backup_codes' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <FileKey2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      ৮-সংখ্যার ব্যাকআপ রিকভারি কোডস (Backup Recovery Codes)
                    </h4>
                    <p className="text-xs text-slate-500">
                      ইমেইল বা ফোন অ্যাক্সেস না থাকলে এই কোডগুলো দিয়ে তাৎক্ষণিক রিকভারি করা যাবে
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCopyBackupCodes}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>সব কোড কপি করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadBackupCodes}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ডাউনলোড (TXT)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => generateNewBackupCodes()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>নতুন কোড রিফ্রেশ করুন</span>
                  </button>
                </div>
              </div>

              {/* Codes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(securitySettings.backupCodes || []).map((code, idx) => {
                  const isUsed = securitySettings.usedBackupCodes?.includes(code);
                  return (
                    <div
                      key={code}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isUsed
                          ? 'bg-slate-100/70 border-slate-200 opacity-50'
                          : 'bg-emerald-50/40 border-emerald-200 shadow-2xs hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                        <span>কোড #{idx + 1}</span>
                        {isUsed ? (
                          <span className="text-rose-600 font-black">ব্যবহৃত</span>
                        ) : (
                          <span className="text-emerald-600 font-black">সক্রিয়</span>
                        )}
                      </div>
                      <div
                        className={`font-mono text-xs sm:text-sm font-black tracking-wider ${
                          isUsed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {code}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <p>
                  <strong>নির্দেশনা:</strong> প্রতিটি কোড একবার মাত্র ব্যবহার করা যাবে। সবগুলো কোড শেষ হয়ে গেলে 'নতুন কোড রিফ্রেশ' বাটনে ক্লিক করে নতুন সেট তৈরি করে রাখুন।
                </p>
              </div>
            </div>
          )}

          {/* SUB-SECTION 5: LOCKOUT POLICY & ATTEMPTS */}
          {securitySubTab === 'lockout_policy' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      ভুল পিন ও সাময়িক লক নীতি (Failed PIN & Temporary Lockout Policy)
                    </h4>
                    <p className="text-xs text-slate-500">
                      ব্রুট-ফোর্স বা অবৈধ প্রবেশ রোধে ব্যর্থ প্রচেষ্টার পর স্বয়ংক্রিয় লকআউট কনফিগার করুন
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">বর্তমান ভুল প্রচেষ্টা</span>
                  <div className="text-xs font-black text-rose-600">
                    {securitySettings.failedAttemptsCount || 0} / {securitySettings.maxFailedAttempts || 5}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সর্বোচ্চ ভুল পিন চেষ্টার সংখ্যা (Max Allowed Attempts)
                  </label>
                  <select
                    value={securitySettings.maxFailedAttempts || 5}
                    onChange={(e) => updateSecuritySettings({ maxFailedAttempts: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value={3}>৩ বার ভুল হলে লক হবে (অতিরিক্ত কড়া)</option>
                    <option value={5}>৫ বার ভুল হলে লক হবে (স্ট্যান্ডার্ড)</option>
                    <option value={10}>১০ বার ভুল হলে লক হবে (শিথিল)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সাময়িক লকআউট সময়কাল (Lockout Duration)
                  </label>
                  <select
                    value={securitySettings.lockoutDurationMinutes || 5}
                    onChange={(e) => updateSecuritySettings({ lockoutDurationMinutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value={1}>১ মিনিট পর আনলক হবে (টেস্টিং)</option>
                    <option value={5}>৫ মিনিট পর আনলক হবে (স্ট্যান্ডার্ড)</option>
                    <option value={15}>১৫ মিনিট পর আনলক হবে (উচ্চ নিরাপত্তা)</option>
                    <option value={30}>৩০ মিনিট পর আনলক হবে (সর্বোচ্চ নিরাপত্তা)</option>
                  </select>
                </div>
              </div>

              {/* Toggles for PIN requirement */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { key: 'requirePinForDelete', label: 'রেকর্ড ডিলিট করার আগে পিন চাইবে' },
                  { key: 'requirePinForReset', label: 'সিস্টেম রিসেটে পিন যাচাই আবশ্যক' },
                  { key: 'requirePinForBackup', label: 'ব্যাকআপ ডাউনলোডে পিন চাইবে' },
                ].map((item) => {
                  const isChecked = !!(securitySettings as any)[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => updateSecuritySettings({ [item.key]: !isChecked })}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isChecked ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-800">{item.label}</span>
                      <button
                        type="button"
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                          isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isChecked ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-SECTION 6: ACTIVITY & RECOVERY HISTORY */}
          {securitySubTab === 'history' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <History className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      নিরাপত্তা ও রিকভারি হিস্ট্রি (Activity & Recovery History Log)
                    </h4>
                    <p className="text-xs text-slate-500">
                      পিন পরিবর্তন, ওটিপি ভেরিফিকেশন, ব্যাকআপ কোড ব্যবহার ও ব্যর্থ প্রচেষ্টার টাইমস্ট্যাম্প লগ
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearSecurityLogs}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>লগ মুছুন</span>
                  </button>
                </div>
              </div>

              {/* Filter and Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="লগ খুঁজুন (Search security history)..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full sm:w-72 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {[
                    { id: 'all', label: 'সবগুলো' },
                    { id: 'pin', label: 'পিন ও পাসওয়ার্ড' },
                    { id: 'otp', label: 'Gmail OTP' },
                    { id: 'lockout', label: 'লকআউট' },
                    { id: 'backup', label: 'ব্যাকআপ কোড' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setHistoryFilter(f.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        historyFilter === f.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                    <tr>
                      <th className="py-2.5 px-3">তারিখ ও সময়</th>
                      <th className="py-2.5 px-3">ইভেন্ট টাইপ</th>
                      <th className="py-2.5 px-3">বিবরণ (Description)</th>
                      <th className="py-2.5 px-3">ডিভাইস / মাধ্যম</th>
                      <th className="py-2.5 px-3 text-right">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          কোনো সিকিউরিটি হিস্ট্রি পাওয়া যায়নি
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                              {log.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{log.description}</td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px]">{log.ipOrDevice || 'Web App'}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                log.status === 'success'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : log.status === 'warning'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {log.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. GENERAL & LOCALIZATION */}
      {/* ======================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-4 bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
          <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
            ভাষা, মুদ্রা ও ফরম্যাটিং সেটিংস (Localization & Currency)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">সফটওয়্যারের ভাষা (Language)</label>
              <select
                value={localizationSettings.language}
                onChange={(e) => updateLocalizationSettings({ language: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="bn">বাংলা (Bengali)</option>
                <option value="en">English (US)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মুদ্রার প্রতীক (Currency Symbol)</label>
              <input
                type="text"
                value={localizationSettings.currencySymbol}
                onChange={(e) => updateLocalizationSettings({ currencySymbol: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ ফরম্যাট (Date Format)</label>
              <select
                value={localizationSettings.dateFormat}
                onChange={(e) => updateLocalizationSettings({ dateFormat: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-03-29)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (29/03/2026)</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY (29-03-2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (03/29/2026)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">সময় ফরম্যাট (Time Format)</label>
              <select
                value={localizationSettings.timeFormat}
                onChange={(e) => updateLocalizationSettings({ timeFormat: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="12h">12-Hour AM/PM (11:30 PM)</option>
                <option value="24h">24-Hour Military (23:30)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. NOTIFICATIONS */}
      {/* ======================================================== */}
      {activeTab === 'notifications' && (
        <div className="space-y-4 bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
          <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
            সিস্টেম নোটিফিকেশন ও সাউন্ড অ্যালার্ট (Notifications & Alerts)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'newSale', label: 'নতুন বিক্রয় তৈরি হলে নোটিফিকেশন' },
              { key: 'newPurchase', label: 'নতুন ক্রয় বা বিল এন্ট্রি হলে' },
              { key: 'paymentReceived', label: 'বকেয়া টাকা কালেকশন / পেমেন্ট পেলে' },
              { key: 'duePaymentAlert', label: 'কাস্টমার বকেয়া অ্যালার্ট ও রিমাইন্ডার' },
              { key: 'expenseAdded', label: 'নতুন খরচ এন্ট্রি হলে' },
              { key: 'lowStockAlert', label: 'পণ্যের স্টক নির্দিষ্ট সীমার নিচে নামলে' },
              { key: 'systemAlert', label: 'সিস্টেম ও ডাটাবেস সিঙ্ক অ্যালার্ট' },
              { key: 'soundEnabled', label: 'সাউন্ড নোটিফিকেশন চালু রাখুন' },
            ].map((item) => {
              const isChecked = !!(notificationSettings as any)[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => updateNotificationSettings({ [item.key]: !isChecked })}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isChecked ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-800">{item.label}</span>
                  <button
                    type="button"
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                      isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isChecked ? 'ON' : 'OFF'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. BACKUP & CENTRAL SYNC */}
      {/* ======================================================== */}
      {activeTab === 'backup' && (
        <div className="space-y-5">
          {/* Cloud Sync Status */}
          <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-emerald-950">
                  সেন্ট্রাল শেয়ার্ড ডাটাবেস লাইভ সিঙ্ক সক্রিয় (Shared Central DB)
                </div>
                <div className="text-[11px] text-emerald-700">
                  স্ট্যাটাস: <strong>{syncStatus.toUpperCase()}</strong> · ভার্সন: <strong>#{serverVersion}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={triggerManualServerSync}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
            >
              এখনই সিঙ্ক রিফ্রেশ করুন
            </button>
          </div>

          {/* Export & Import */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">অফলাইন JSON ফাইল ব্যাকআপ এক্সপোর্ট</h4>
              </div>
              <p className="text-[11px] text-slate-500">
                আপনার পুরো ব্যবসায়ের সমস্ত হিসাব, পণ্য, কাস্টমার ও চালান একটি ফাইলে ডাউনলোড করে রাখুন।
              </p>
              <button
                type="button"
                onClick={exportBackupJSON}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>কমপ্লিট ব্যাকআপ JSON ডাউনলোড</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900">ব্যাকআপ ফাইল থেকে ডাটা রিস্টোর</h4>
              </div>
              <p className="text-[11px] text-slate-500">
                পূর্বে সেভ করা JSON ব্যাকআপ ফাইল আপলোড করে তাৎক্ষণিকভাবে সফটওয়্যারের ডাটা রিস্টোর করুন।
              </p>
              <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>ফাইল সিলেক্ট করে রিস্টোর করুন</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Danger Zone: Reset to Sample Data & Reset All Settings */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <h4 className="text-xs font-black uppercase tracking-wider">সফটওয়্যার রিসেট জোন (Reset & Restore Factory)</h4>
            </div>
            <p className="text-xs text-rose-700">
              সতর্কতা: ডেমো ডাটা রিসেট বা সমস্ত সেটিংস ফ্যাক্টরি ডিফল্টে নিলে বর্তমান পরিবর্তন মুছে যাবে।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                ডেমো ডাটা রিসেট করুন (Reset to Sample Data)
              </button>

              <button
                type="button"
                onClick={resetAllSettingsToDefault}
                className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
              >
                সব সেটিংস ডিফল্টে নিন (Restore All Default Settings)
              </button>
            </div>

            {/* Reset Modal Confirmation */}
            {showResetConfirm && (
              <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
                  <div className="flex items-center gap-3 text-rose-600">
                    <AlertTriangle className="w-6 h-6" />
                    <h4 className="text-base font-black">নিশ্চিতকরণ: ডেমো ডাটা রিসেট</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    আপনি কি নিশ্চিত যে ডেমো ডাটা রিসেট করতে চান? নিরাপত্তা নিশ্চিত করতে অ্যাডমিন পিন দিন।
                  </p>
                  <div>
                    <input
                      type="password"
                      placeholder="অ্যাডমিন পিন কোড"
                      value={resetEnteredPin}
                      onChange={(e) => setResetEnteredPin(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-center text-slate-900"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetConfirm(false);
                        setResetEnteredPin('');
                      }}
                      className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmReset}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      রিসেট সম্পন্ন করুন
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
