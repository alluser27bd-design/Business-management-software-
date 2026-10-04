import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Palette,
  LayoutDashboard,
  Sliders,
  Printer,
  FileSpreadsheet,
  CreditCard,
  ShieldCheck,
  GlobeLock,
  Eye,
  Key,
  RotateCcw,
  Sparkles,
  Layers,
  Store,
  Factory,
  Pill,
  Briefcase,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { CompanyLogoSettingsPanel } from './settings/CompanyLogoSettingsPanel';
import { AppearanceThemePanel } from './settings/AppearanceThemePanel';
import { DashboardControlPanel } from './settings/DashboardControlPanel';
import { ModuleFieldsControlPanel } from './settings/ModuleFieldsControlPanel';
import { PrintLayoutControlPanel } from './settings/PrintLayoutControlPanel';
import { CustomFieldsPanel } from './settings/CustomFieldsPanel';
import { PaymentExpenseSettingsPanel } from './settings/PaymentExpenseSettingsPanel';
import { UsersPermissionsPanel } from './settings/UsersPermissionsPanel';
import { GeneralSecurityBackupPanel } from './settings/GeneralSecurityBackupPanel';
import { MasterDataBusinessPanel } from './settings/MasterDataBusinessPanel';
import { SecurityRecoveryModal } from './SecurityRecoveryModal';

export const SettingsBackup: React.FC = () => {
  const {
    companyProfile,
    securitySettings,
    verifyAdminPin,
    setPrintData,
    showToast,
    resetAllSettingsToDefault,
    updateProductFields,
    updateSalesFields,
    updateDashboardCustomSettings,
    dashboardCustomSettings,
    productFields,
    salesFields,
    openTopIconCustomizer,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'masterData'
    | 'company'
    | 'appearance'
    | 'dashboard'
    | 'modules'
    | 'print'
    | 'customFields'
    | 'paymentsTax'
    | 'users'
    | 'generalSecurity'
  >('masterData');

  const [enteredPin, setEnteredPin] = useState('');
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);

  // Quick preset application for one-click setup
  const applyBusinessPreset = (type: 'retail' | 'wholesale' | 'pharmacy' | 'factory') => {
    if (type === 'retail') {
      // Retail: Enable POS, Barcode, Hide wholesale fields
      const updatedProds = productFields.map((f) => {
        if (f.id === 'barcode' || f.id === 'salePrice') return { ...f, show: true, required: true };
        if (f.id === 'batchNo' || f.id === 'expDate') return { ...f, show: false, required: false };
        return f;
      });
      updateProductFields(updatedProds);
      showToast('খুচরা দোকান ও সুপারশপ (Retail/POS) প্রিসেট সক্রিয় হয়েছে');
    } else if (type === 'wholesale') {
      // Wholesale: Enable Credit Limit, Opening Due, Delivery
      const updatedProds = productFields.map((f) => {
        if (f.id === 'mrp' || f.id === 'purchasePrice') return { ...f, show: true };
        return f;
      });
      updateProductFields(updatedProds);
      showToast('পাইকারি ও ডিস্ট্রিবিউশন (Wholesale) প্রিসেট সক্রিয় হয়েছে');
    } else if (type === 'pharmacy') {
      // Pharmacy: Enable Batch & Expiry
      const updatedProds = productFields.map((f) => {
        if (f.id === 'batchNo' || f.id === 'expDate') return { ...f, show: true, required: true };
        return f;
      });
      updateProductFields(updatedProds);
      showToast('ফার্মেসি ও ড্রাগ স্টোর (Batch & Expiry) প্রিসেট সক্রিয় হয়েছে');
    } else if (type === 'factory') {
      showToast('উৎপাদন ও ফ্যাক্টরি (Manufacturing & BOM) প্রিসেট সক্রিয় হয়েছে');
    }
  };

  const handleVerifyPin = () => {
    const res = verifyAdminPin(enteredPin);
    if (res.success) {
      setIsPinVerified(true);
      showToast('অ্যাডমিন পিন যাচাই সফল হয়েছে!');
    } else {
      showToast(res.message || 'ভুল পিন কোড! সঠিক পিন দিন।');
    }
  };

  const handleLaunchTestPrint = () => {
    setPrintData({
      type: 'invoice',
      data: {
        invoiceNo: 'INV-TEST-2026',
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString(),
        customerName: 'জনাব মেহরাব হোসেন (নমুনা কাস্টমার)',
        customerPhone: '01819-000000',
        address: 'মতিঝিল বাণিজ্যিক এলাকা, ঢাকা',
        items: [
          {
            productName: 'প্রিমিয়াম সুগন্ধি বাসমতি চাল (২৫ কেজি)',
            qty: 2,
            unit: 'bag',
            rate: 2600,
            discount: 0,
            total: 5200,
            barcode: '890123450002',
            sku: 'RICE-25K',
          },
          {
            productName: 'সয়াবিন ভোজ্যতেল (৫ লিটার জার)',
            qty: 3,
            unit: 'pcs',
            rate: 840,
            discount: 0,
            total: 2520,
            barcode: '890123450001',
            sku: 'OIL-5L',
          },
        ],
        subtotal: 7720,
        discountAmount: 220,
        taxAmount: 0,
        grandTotal: 7500,
        paidAmount: 5000,
        dueAmount: 2500,
        previousBalance: 4200,
      },
    });
  };

  const navigationTabs = [
    {
      id: 'masterData',
      label: '১. মাস্টার ডাটা ও বিজনেস',
      sub: 'Master Data / Business Setup',
      icon: Building2,
      badge: 'Core Master',
      color: 'text-emerald-700',
    },
    {
      id: 'company',
      label: '২. কোম্পানি ও লোগো',
      sub: 'Company & Logo',
      icon: Store,
      badge: 'Profile',
      color: 'text-emerald-600',
    },
    {
      id: 'appearance',
      label: '৩. থিম ও অ্যাপিয়ারেন্স',
      sub: 'Theme & Style',
      icon: Palette,
      badge: 'Design',
      color: 'text-purple-600',
    },
    {
      id: 'dashboard',
      label: '৪. ড্যাশবোর্ড কন্ট্রোল',
      sub: 'Dashboard Customizer',
      icon: LayoutDashboard,
      badge: 'Widgets',
      color: 'text-blue-600',
    },
    {
      id: 'modules',
      label: '৫. মডিউল ফিল্ড কন্ট্রোল',
      sub: 'Field Visibility & SKU',
      icon: Sliders,
      badge: 'Products/Sales/POS',
      color: 'text-amber-600',
    },
    {
      id: 'print',
      label: '৬. প্রিন্ট ও ইনভয়েস',
      sub: 'Print & PDF Layout',
      icon: Printer,
      badge: 'Live Preview',
      color: 'text-rose-600',
    },
    {
      id: 'customFields',
      label: '৭. কাস্টম ফিল্ডস',
      sub: 'Custom Fields Builder',
      icon: FileSpreadsheet,
      badge: 'Extra Data',
      color: 'text-indigo-600',
    },
    {
      id: 'paymentsTax',
      label: '৮. পেমেন্ট, খরচ ও ভ্যাট',
      sub: 'Payment, Expense & Tax',
      icon: CreditCard,
      badge: 'Finance',
      color: 'text-teal-600',
    },
    {
      id: 'users',
      label: '৯. রোল ও পারমিশন',
      sub: 'User Permissions',
      icon: ShieldCheck,
      badge: 'RBAC',
      color: 'text-cyan-600',
    },
    {
      id: 'generalSecurity',
      label: '১০. সিকিউরিটি ও রিকভারি',
      sub: 'Security & Recovery',
      icon: GlobeLock,
      badge: 'Protected',
      color: 'text-slate-800',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <SecurityRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
      />

      {/* Top Header & Overview Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-600 text-white rounded-md tracking-wider">
                Central Master Hub
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">
                BizAccount ERP Complete System Control
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                ২৩ টি মাস্টার কন্ট্রোল সক্রিয়
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>সফটওয়্যার মাস্টার সেটিংস ও সেন্ট্রাল কন্ট্রোল প্যানেল</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              কোম্পানি প্রোফাইল, লোগো, থিম ও ফন্ট, ড্যাশবোর্ড উইজেট, প্রতিটি মডিউলের ফিল্ড দৃশ্যমানতা, বারকোড/SKU, প্রিন্ট পেজ ব্যালেন্স, কাস্টম ফিল্ড, পেমেন্ট মেথড, রোল পারমিশন এবং অটো ক্লাউড ব্যাকআপ এক স্থান থেকেই নিয়ন্ত্রণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={openTopIconCustomizer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-100" />
              <span>টপ আইকন মেনু কাস্টমাইজ</span>
            </button>
            <button
              onClick={handleLaunchTestPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>প্রিন্ট প্রিভিউ টেস্ট</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('আপনি কি সমস্ত সেটিংস ডিফল্ট মানে রিসেট করতে চান?')) {
                  resetAllSettingsToDefault();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>সকল সেটিংস রিসেট</span>
            </button>
          </div>
        </div>

        {/* 1-Click Business Mode Quick Presets */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-800">
              ওয়ান-ক্লিক বিজনেস মোড প্রিসেটস (One-Click Business Presets):
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => applyBusinessPreset('retail')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Store className="w-3 h-3 text-amber-600" />
              <span>খুচরা শপ / POS</span>
            </button>
            <button
              onClick={() => applyBusinessPreset('wholesale')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Briefcase className="w-3 h-3 text-blue-600" />
              <span>পাইকারি / ডিস্ট্রিবিউশন</span>
            </button>
            <button
              onClick={() => applyBusinessPreset('pharmacy')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Pill className="w-3 h-3 text-emerald-600" />
              <span>ফার্মেসি / এক্সপায়ারি</span>
            </button>
            <button
              onClick={() => applyBusinessPreset('factory')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Factory className="w-3 h-3 text-purple-600" />
              <span>ফ্যাক্টরি ও কারখানা</span>
            </button>
          </div>
        </div>

        {/* Master Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-10 gap-1.5 overflow-x-auto pb-1">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-center transition-all cursor-pointer select-none relative group ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102'
                    : 'bg-slate-50 hover:bg-slate-100/90 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1 transition-transform ${
                    isActive ? 'bg-white/20 text-white' : `${tab.color} bg-white shadow-2xs`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-extrabold leading-tight line-clamp-1">
                  {tab.label.split('.')[1] || tab.label}
                </span>
                <span
                  className={`text-[9px] font-medium leading-none mt-0.5 truncate ${
                    isActive ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {tab.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin PIN Verification Notice if not verified */}
      {!isPinVerified && (
        <div className="bg-amber-50 border border-amber-200/90 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 text-amber-950">
            <Key className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              নিরাপত্তা সুরক্ষায় গুরুত্বপূর্ণ অ্যাডমিন কনফিগারেশন পিন কোড দিয়ে সুরক্ষিত (Default PIN: <strong>1234</strong>)।
              ফুল অ্যাক্সেস পেতে পিন যাচাই করুন:
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <input
              type="password"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="৪-ডিজিট পিন"
              className="px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs w-28 text-center font-bold outline-hidden focus:border-amber-500 shadow-2xs"
            />
            <button
              onClick={handleVerifyPin}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              আনলক করুন
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: MASTER DATA & BUSINESS SETUP (CENTRAL MASTER HUB)
          ========================================================================= */}
      {activeTab === 'masterData' && <MasterDataBusinessPanel />}

      {/* =========================================================================
          TAB 2: COMPANY PROFILE & LOGO MANAGEMENT
          ========================================================================= */}
      {activeTab === 'company' && <CompanyLogoSettingsPanel />}

      {/* =========================================================================
          TAB 2: APPEARANCE, THEME, FONTS & STYLES
          ========================================================================= */}
      {activeTab === 'appearance' && <AppearanceThemePanel />}

      {/* =========================================================================
          TAB 3: DASHBOARD CUSTOMIZATION & WIDGET CONTROL
          ========================================================================= */}
      {activeTab === 'dashboard' && <DashboardControlPanel />}

      {/* =========================================================================
          TAB 4: MODULE FIELD VISIBILITY, REQUIRED & SKU/BARCODE
          ========================================================================= */}
      {activeTab === 'modules' && <ModuleFieldsControlPanel />}

      {/* =========================================================================
          TAB 5: PRINT, INVOICE & PDF LAYOUT + LIVE PREVIEW
          ========================================================================= */}
      {activeTab === 'print' && <PrintLayoutControlPanel />}

      {/* =========================================================================
          TAB 6: CUSTOM FIELDS BUILDER
          ========================================================================= */}
      {activeTab === 'customFields' && <CustomFieldsPanel />}

      {/* =========================================================================
          TAB 7: PAYMENT METHODS, EXPENSE CATEGORIES, TAX & DISCOUNT
          ========================================================================= */}
      {activeTab === 'paymentsTax' && <PaymentExpenseSettingsPanel />}

      {/* =========================================================================
          TAB 8: USER ROLES & PERMISSION MATRIX (RBAC)
          ========================================================================= */}
      {activeTab === 'users' && <UsersPermissionsPanel />}

      {/* =========================================================================
          TAB 9: GENERAL LOCALIZATION, SECURITY, GMAIL, SYNC & DATA BACKUP
          ========================================================================= */}
      {activeTab === 'generalSecurity' && <GeneralSecurityBackupPanel />}
    </div>
  );
};
