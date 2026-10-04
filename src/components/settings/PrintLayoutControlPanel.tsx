import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EnhancedPrintSettings, PaperSize, PrintLayoutTheme } from '../../types';
import {
  Printer,
  FileText,
  Eye,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Building,
  User,
  QrCode,
  Image,
} from 'lucide-react';

export const PrintLayoutControlPanel: React.FC = () => {
  const { enhancedPrintSettings, updateEnhancedPrintSettings, companyProfile, showToast } = useApp();

  const [settings, setSettings] = useState<EnhancedPrintSettings>({ ...enhancedPrintSettings });

  const handleToggle = (key: keyof EnhancedPrintSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    updateEnhancedPrintSettings(updated);
  };

  const handleUpdate = (partial: Partial<EnhancedPrintSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    updateEnhancedPrintSettings(updated);
  };

  const handleReset = () => {
    setSettings({ ...enhancedPrintSettings });
    showToast('পরিবর্তন বাতিল করা হয়েছে');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-600" />
            <span>প্রিন্ট, PDF ও চালান লেআউট ফুল কন্ট্রোল (Print & PDF Layout Studio)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            চালান, POS রসিদ ও স্টেটমেন্টের প্রতিটি অংশ Show/Hide করুন এবং পেজ মার্জিন ও লাইভ প্রিভিউ দেখুন
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Controls & Toggles (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Paper Size & Theme */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
              ১. পেজ সাইজ ও প্রিন্ট ফরম্যাট (Paper Size & Format)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'a4', label: 'A4 Standard', desc: 'অফিস চালান' },
                { id: 'a5', label: 'A5 Compact', desc: 'হাফ সাইজ' },
                { id: 'pos80', label: 'POS 80mm', desc: 'থার্মাল রসিদ' },
                { id: 'pos58', label: 'POS 58mm', desc: 'মিনি প্রিন্টার' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleUpdate({ paperSize: p.id as PaperSize })}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    settings.paperSize === p.id
                      ? 'bg-emerald-600 text-white font-bold shadow-2xs border-emerald-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs">{p.label}</div>
                  <div className={`text-[10px] ${settings.paperSize === p.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Margins & Sizing */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">টপ মার্জিন (mm)</label>
                <input
                  type="number"
                  value={settings.marginTopMm}
                  onChange={(e) => handleUpdate({ marginTopMm: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">বটম মার্জিন (mm)</label>
                <input
                  type="number"
                  value={settings.marginBottomMm}
                  onChange={(e) => handleUpdate({ marginBottomMm: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">লেফট মার্জিন (mm)</label>
                <input
                  type="number"
                  value={settings.marginLeftMm}
                  onChange={(e) => handleUpdate({ marginLeftMm: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">রাইট মার্জিন (mm)</label>
                <input
                  type="number"
                  value={settings.marginRightMm}
                  onChange={(e) => handleUpdate({ marginRightMm: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* 2. Section Show / Hide Toggles */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
              ২. প্রিন্ট পেজ ও ইনভয়েস ফিল্ড ভিজিবিলিটি (Show / Hide Toggles)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: 'showLogo', label: 'কোম্পানি লোগো (Company Logo)' },
                { key: 'showCompanyName', label: 'প্রতিষ্ঠানের নাম (Company Name)' },
                { key: 'showAddress', label: 'কোম্পানি ঠিকানা ও ফোন নম্বর' },
                { key: 'showCustomerInfo', label: 'কাস্টমার তথ্য ও ঠিকানা' },
                { key: 'showCustomerPhoto', label: 'কাস্টমার ছবি (Photo)' },
                { key: 'showItemPhoto', label: 'পণ্যের ছবি (Item Thumbnail)' },
                { key: 'showItemSku', label: 'SKU কোড কলাম' },
                { key: 'showItemBarcode', label: 'বারকোড কলাম' },
                { key: 'showItemQrCode', label: 'ইনভয়েস ভেরিফিকেশন QR কোড' },
                { key: 'showItemDiscount', label: 'ছাড় / ডিসকাউন্ট কলাম' },
                { key: 'showItemTax', label: 'ট্যাক্স / ভ্যাট কলাম' },
                { key: 'showVatBin', label: 'কোম্পানি ভ্যাট / BIN নম্বর' },
                { key: 'showPreviousBalance', label: 'পূর্বের বকেয়া (Previous Balance)' },
                { key: 'showReceived', label: 'পরিশোধিত টাকা (Paid/Received)' },
                { key: 'showTotalBalance', label: 'সর্বমোট ব্যালেন্স (Total Balance)' },
                { key: 'showTotalDue', label: 'মোট বকেয়া (Total Due)' },
                { key: 'showPaymentMethod', label: 'পেমেন্ট মাধ্যম (Payment Method)' },
                { key: 'showSignatureLines', label: 'অফিস ও গ্রাহক স্বাক্ষর রেখা' },
                { key: 'showTermsConditions', label: 'শর্তাবলী (Terms & Conditions)' },
                { key: 'showNotes', label: 'রসিদের নিচের ধন্যবাদ বার্তা' },
              ].map((item) => {
                const isChecked = !!(settings as any)[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => handleToggle(item.key as any)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
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
                      {isChecked ? 'SHOW' : 'HIDE'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Footer & Terms Text Control */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">রসিদের নিচের ধন্যবাদ বার্তা (Footer Note)</label>
              <input
                type="text"
                value={settings.receiptFooterNote}
                onChange={(e) => handleUpdate({ receiptFooterNote: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শর্তাবলী টেক্সট (Terms & Conditions)</label>
              <textarea
                rows={3}
                value={settings.termsConditionsText}
                onChange={(e) => handleUpdate({ termsConditionsText: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Side: LIVE PRINT PREVIEW CANVAS (5 cols) */}
        <div className="lg:col-span-5 sticky top-4">
          <div className="bg-slate-900 text-white p-3.5 rounded-t-3xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider">Live Print Preview</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              {settings.paperSize.toUpperCase()} · REAL-TIME
            </span>
          </div>

          {/* Paper Canvas */}
          <div className="bg-slate-100 p-3 sm:p-4 rounded-b-3xl border-x border-b border-slate-300 shadow-inner overflow-hidden">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-slate-200 text-slate-900 font-['Hind_Siliguri',_sans-serif] text-[11px] space-y-3 min-h-[440px]">
              {/* Invoice Header */}
              <div className="border-b border-slate-200 pb-3 flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  {settings.showLogo && companyProfile.logo && (
                    <img src={companyProfile.logo} alt="Logo" className="h-8 object-contain mb-1 rounded" />
                  )}
                  {settings.showCompanyName && (
                    <h5 className="font-black text-xs text-slate-900 leading-tight">{companyProfile.name}</h5>
                  )}
                  {settings.showAddress && (
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {companyProfile.address} · {companyProfile.phone}
                    </p>
                  )}
                  {settings.showVatBin && companyProfile.vatNumber && (
                    <p className="text-[9px] text-slate-400 font-mono">BIN: {companyProfile.vatNumber}</p>
                  )}
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[9px] font-black uppercase">
                    INVOICE
                  </span>
                  <div className="text-[10px] font-mono font-bold text-slate-700 mt-1">#INV-2026-001</div>
                  <div className="text-[9px] text-slate-400">তারিখ: {new Date().toISOString().slice(0, 10)}</div>
                </div>
              </div>

              {/* Customer Info */}
              {settings.showCustomerInfo && (
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between text-[10px]">
                  <div>
                    <span className="font-bold text-slate-800">গ্রাহক: আলমগীর স্টোর (চকবাজার)</span>
                    <div className="text-slate-500">মোবাইল: 01819-876543</div>
                  </div>
                  {settings.showCustomerPhoto && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[9px]">
                      AS
                    </div>
                  )}
                </div>
              )}

              {/* Items Table Mock */}
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600 font-bold">
                    <th className="py-1">পণ্য</th>
                    {settings.showItemSku && <th className="py-1">SKU</th>}
                    <th className="py-1 text-center">পরিমাণ</th>
                    <th className="py-1 text-right">মূল্য</th>
                    <th className="py-1 text-right">মোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-1 font-medium">সয়াবিন তেল ৫ লিটার</td>
                    {settings.showItemSku && <td className="py-1 font-mono text-[9px]">OIL-5L</td>}
                    <td className="py-1 text-center font-mono">10 ltr</td>
                    <td className="py-1 text-right font-mono">৳920</td>
                    <td className="py-1 text-right font-mono font-bold">৳9,200</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">বাসমতি চাল ২৫ কেজি</td>
                    {settings.showItemSku && <td className="py-1 font-mono text-[9px]">RICE-25K</td>}
                    <td className="py-1 text-center font-mono">2 bag</td>
                    <td className="py-1 text-right font-mono">৳2,650</td>
                    <td className="py-1 text-right font-mono font-bold">৳5,300</td>
                  </tr>
                </tbody>
              </table>

              {/* Financial Balance Summary Box */}
              <div className="border-t border-slate-200 pt-2 space-y-1 text-[10px]">
                <div className="flex justify-between text-slate-600">
                  <span>সাবটোটাল:</span>
                  <span className="font-mono">৳14,500</span>
                </div>
                {settings.showItemDiscount && (
                  <div className="flex justify-between text-emerald-700">
                    <span>ছাড় (Discount):</span>
                    <span className="font-mono">-৳300</span>
                  </div>
                )}
                {settings.showPreviousBalance && (
                  <div className="flex justify-between text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                    <span>পূর্বের বকেয়া:</span>
                    <span className="font-mono font-bold">৳5,000</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-slate-900 text-xs border-t border-slate-200 pt-1">
                  <span>সর্বমোট বিল:</span>
                  <span className="font-mono">৳19,200</span>
                </div>
                {settings.showReceived && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>জমা টাকা (Paid):</span>
                    <span className="font-mono">৳10,000</span>
                  </div>
                )}
                {settings.showTotalDue && (
                  <div className="flex justify-between text-rose-700 font-black bg-rose-50 px-1.5 py-0.5 rounded">
                    <span>মোট বাকি (Due):</span>
                    <span className="font-mono">৳9,200</span>
                  </div>
                )}
              </div>

              {/* Terms & Footer */}
              {settings.showTermsConditions && (
                <div className="text-[9px] text-slate-400 pt-2 border-t border-dashed border-slate-200 leading-tight">
                  <span className="font-bold text-slate-500">শর্তাবলী: </span>
                  {settings.termsConditionsText.slice(0, 70)}...
                </div>
              )}

              {settings.showSignatureLines && (
                <div className="pt-4 flex justify-between text-[9px] text-slate-400">
                  <span className="border-t border-slate-300 pt-1">ক্রেতার স্বাক্ষর</span>
                  <span className="border-t border-slate-300 pt-1">অনুমোদিত স্বাক্ষর</span>
                </div>
              )}

              {settings.showNotes && (
                <div className="text-center text-[9px] text-slate-400 font-medium pt-1">
                  {settings.receiptFooterNote}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
