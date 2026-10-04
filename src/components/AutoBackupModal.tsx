import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HardDrive,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Trash2,
  RotateCcw,
  X,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface AutoBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutoBackupModal: React.FC<AutoBackupModalProps> = ({ isOpen, onClose }) => {
  const {
    autoBackupSettings,
    updateAutoBackupSettings,
    gmailAccounts,
    backupSnapshots,
    triggerAutoBackup,
    restoreFromSnapshot,
    deleteSnapshot,
    lastBackupConfirmation,
    exportBackupJSON,
    showToast,
  } = useApp();

  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetAccount =
    gmailAccounts.find((g) => g.id === autoBackupSettings.targetGmailId) ||
    gmailAccounts.find((g) => g.isBackupTarget) ||
    gmailAccounts[0];

  const handleTriggerManualBackup = () => {
    triggerAutoBackup(true);
  };

  const handleConfirmRestore = (id: string) => {
    const success = restoreFromSnapshot(id);
    if (success) {
      setConfirmRestoreId(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">অটোমেটিক ব্যাকআপ সিস্টেম</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  সক্রিয় ও সুরক্ষিত
                </span>
              </div>
              <p className="text-xs text-slate-500">
                নির্দিষ্ট সময় পর পর সম্পূর্ণ হিসাব স্বয়ংক্রিয়ভাবে সংরক্ষিত হয় (০% ডাটা লস গ্যারান্টি)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Real-time Confirmation Alert Banner */}
          {lastBackupConfirmation && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-900 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>ব্যাকআপ সফল নিশ্চিতকরণ (Backup Confirmed)</span>
                    <span className="font-mono text-[11px] bg-emerald-200/60 px-1.5 rounded text-emerald-800">
                      {lastBackupConfirmation.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    গন্তব্য: <strong className="font-mono">{lastBackupConfirmation.gmail}</strong> · মোট রেকর্ড:{' '}
                    {lastBackupConfirmation.recordCount} টি · কোনো ডাটা বাদ পড়েনি।
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px] shrink-0">
                ১০০% সুরক্ষিত
              </span>
            </div>
          )}

          {/* Backup Engine Settings Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>স্বয়ংক্রিয় সময়সূচি ও গন্তব্য নির্ধারণ (Schedule Settings)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  স্বয়ংক্রিয় ব্যাকআপ বিরতি (Auto-Backup Interval):
                </label>
                <select
                  value={autoBackupSettings.intervalMinutes}
                  onChange={(e) => updateAutoBackupSettings({ intervalMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-hidden focus:border-emerald-500"
                >
                  <option value={5}>প্রতি ৫ মিনিট পর পর (Real-time Fast)</option>
                  <option value={10}>প্রতি ১০ মিনিট পর পর</option>
                  <option value={15}>প্রতি ১৫ মিনিট পর পর (রেকমেন্ডেড)</option>
                  <option value={30}>প্রতি ৩০ মিনিট পর পর</option>
                  <option value={60}>প্রতি ১ ঘণ্টা পর পর</option>
                  <option value={120}>প্রতি ২ ঘণ্টা পর পর</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ব্যাকআপ প্রাপক Gmail অ্যাকাউন্ট:
                </label>
                <select
                  value={autoBackupSettings.targetGmailId}
                  onChange={(e) => updateAutoBackupSettings({ targetGmailId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-hidden focus:border-emerald-500 font-mono"
                >
                  {gmailAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.email} ({acc.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/80 gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoBackupToggle"
                  checked={autoBackupSettings.enabled}
                  onChange={(e) => updateAutoBackupSettings({ enabled: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="autoBackupToggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                  অটো ব্যাকআপ স্বয়ংক্রিয়ভাবে চালু রাখুন
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerManualBackup}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>এখনই ব্যাকআপ নিন</span>
                </button>
                <button
                  onClick={exportBackupJSON}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-white text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ফাইল ডাউনলোড</span>
                </button>
              </div>
            </div>
          </div>

          {/* Backup History Snapshots List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>সাম্প্রতিক ব্যাকআপ হিস্টোরি ও রিস্টোর পয়েন্ট ({backupSnapshots.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400">সর্বোচ্চ ১০টি স্ন্যাপশট সংরক্ষিত</span>
            </div>

            {backupSnapshots.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400 text-xs">
                কোনো ব্যাকআপ স্ন্যাপশট জমা নেই। উপরের &quot;এখনই ব্যাকআপ নিন&quot; বাটনে চাপুন।
              </div>
            ) : (
              <div className="space-y-2">
                {backupSnapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          snap.type === 'auto'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {snap.type === 'auto' ? 'AUTO' : 'USER'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900">
                            {new Date(snap.timestamp).toLocaleDateString()} {new Date(snap.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="px-1.5 py-0.2 text-[9px] bg-slate-100 text-slate-600 rounded font-mono">
                            {(snap.sizeBytes / 1024).toFixed(1)} KB
                          </span>
                          <span className="px-1.5 py-0.2 text-[9px] bg-emerald-50 text-emerald-700 rounded font-bold">
                            {snap.recordCount} রেকর্ড
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">
                          গন্তব্য: {snap.destinationGmail}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {confirmRestoreId === snap.id ? (
                        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-lg border border-amber-200">
                          <span className="text-[10px] text-amber-800 font-bold px-1">রিস্টোর করবেন?</span>
                          <button
                            onClick={() => handleConfirmRestore(snap.id)}
                            className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                          >
                            হ্যাঁ
                          </button>
                          <button
                            onClick={() => setConfirmRestoreId(null)}
                            className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px]"
                          >
                            না
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmRestoreId(snap.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>রিস্টোর</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteSnapshot(snap.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>কোনো লেনদেন এন্ট্রি বা এডিটের পর ডাটা শতভাগ নিরাপদ ও সংরক্ষিত থাকে।</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
