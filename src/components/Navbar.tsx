import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, TopIconMenuItem } from '../types';
import { getIconComponent, COLOR_PALETTE } from '../utils/iconMap';
import {
  Search,
  PlusCircle,
  Globe,
  ShieldCheck,
  Bell,
  Clock,
  Printer,
  Database,
  Trash2,
  ShoppingCart,
  Receipt,
  Users,
  Package,
  HardDrive,
  Mail,
  UserCheck,
  RefreshCw,
  Cloud,
  Type,
  SlidersHorizontal,
  Calculator,
  Maximize,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { GmailAuthModal } from './GmailAuthModal';
import { AutoBackupModal } from './AutoBackupModal';
import { TopIconMenuCustomizerModal } from './TopIconMenuCustomizerModal';
import { QuickCalculatorModal } from './QuickCalculatorModal';

interface NavbarProps {
  onOpenInstallModal?: () => void;
  canInstall?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInstallModal, canInstall }) => {
  const {
    language,
    setLanguage,
    t,
    currentUserRole,
    setCurrentUserRole,
    setActiveTab,
    globalSearch,
    setGlobalSearch,
    invoices,
    products,
    customers,
    suppliers,
    approvals,
    cashierShift,
    setCashierShift,
    companyProfile,
    currentGmailUser,
    autoBackupSettings,
    showToast,
    syncStatus,
    lastSyncTime,
    serverVersion,
    triggerManualServerSync,
    textSize,
    setTextSize,
    topIconMenuConfig,
    isTopIconCustomizerOpen,
    openTopIconCustomizer,
    closeTopIconCustomizer,
    setPrintData,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [shiftClosingCash, setShiftClosingCash] = useState<number>(0);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  // Global Search Filter Results
  const searchResults = React.useMemo(() => {
    if (!globalSearch.trim() || globalSearch.length < 2) return null;
    const q = globalSearch.toLowerCase();

    const matchedInvoices = invoices
      .filter((i) => !i.deletedAt && (i.invoiceNo.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q)))
      .slice(0, 4);

    const matchedProducts = products
      .filter(
        (p) =>
          !p.deletedAt &&
          (p.name.toLowerCase().includes(q) ||
            p.barcode.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q))
      )
      .slice(0, 4);

    const matchedCustomers = customers
      .filter(
        (c) =>
          !c.deletedAt &&
          (c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email && c.email.toLowerCase().includes(q)))
      )
      .slice(0, 4);

    const matchedSuppliers = suppliers
      .filter((s) => !s.deletedAt && (s.name.toLowerCase().includes(q) || s.phone.includes(q)))
      .slice(0, 4);

    return {
      invoices: matchedInvoices,
      products: matchedProducts,
      customers: matchedCustomers,
      suppliers: matchedSuppliers,
    };
  }, [globalSearch, invoices, products, customers, suppliers]);

  const handleCloseShift = () => {
    setCashierShift((prev) => ({
      ...prev,
      status: 'closed',
      closingCash: Number(shiftClosingCash),
      cashDifference: Number(shiftClosingCash) - (prev.openingCash + prev.totalSales),
      endTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    }));
    setShowShiftModal(false);
    showToast('ক্যাশিয়ার শিফট সমাপ্ত ও ক্যাশ ক্লোজিং সম্পন্ন হয়েছে');
  };

  const handleOpenShift = () => {
    setCashierShift({
      id: `SHIFT-${Date.now()}`,
      cashierName: `${currentUserRole.toUpperCase()} Cashier`,
      startTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      openingCash: Number(shiftClosingCash) || 2000,
      totalSales: 0,
      status: 'open',
    });
    setShowShiftModal(false);
    showToast('নতুন ক্যাশিয়ার শিফট চালু হয়েছে');
  };

  // Custom action dispatcher
  const handleTopItemClick = (item: TopIconMenuItem) => {
    if (item.actionType === 'tab') {
      setActiveTab(item.target);
    } else if (item.actionType === 'modal') {
      if (item.target === 'shiftModal') setShowShiftModal(true);
      else if (item.target === 'gmailModal') setShowGmailModal(true);
      else if (item.target === 'backupModal') setShowBackupModal(true);
      else if (item.target === 'quickAction') setShowQuickMenu((prev) => !prev);
      else if (item.target === 'role') setShowRoleMenu((prev) => !prev);
      else if (item.target === 'textSize') setShowTextSizeMenu((prev) => !prev);
      else if (item.target === 'sync') {
        triggerManualServerSync();
        showToast('সেন্ট্রাল ডাটাবেস সিঙ্ক চেক করা হচ্ছে...');
      }
    } else if (item.actionType === 'custom_action') {
      if (item.target === 'calculator') {
        setShowCalculatorModal(true);
      } else if (item.target === 'fullscreen') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          showToast('ফুলস্ক্রিন মোড সক্রিয়');
        } else {
          document.exitFullscreen().catch(() => {});
          showToast('ফুলস্ক্রিন মোড বন্ধ');
        }
      } else if (item.target === 'printTest') {
        setPrintData({
          type: 'invoice',
          data: {
            invoiceNo: 'INV-DEMO-TEST',
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toLocaleTimeString(),
            customerName: 'মেহরাব হোসেন (নমুনা কাস্টমার)',
            items: [{ productName: 'সুগন্ধি বাসমতি চাল (২৫ কেজি)', qty: 1, rate: 2600, total: 2600, unit: 'bag' }],
            subtotal: 2600,
            grandTotal: 2600,
            paidAmount: 2600,
            dueAmount: 0,
          },
        });
      } else if (item.target === 'reload') {
        window.location.reload();
      }
    } else if (item.actionType === 'external_link' && item.target) {
      window.open(item.target, '_blank');
    }
  };

  // Sort visible items
  const visibleItems = (topIconMenuConfig.items || [])
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order);

  // Render individual item based on its ID or custom type
  const renderNavbarItem = (item: TopIconMenuItem) => {
    const Icon = getIconComponent(item.iconName);
    const palette = COLOR_PALETTE.find((c) => c.id === item.color) || COLOR_PALETTE[0];

    // Built-in System Button: Sync Status
    if (item.id === 'btn-sync') {
      return (
        <button
          key={item.id}
          onClick={() => {
            triggerManualServerSync();
            showToast('সেন্ট্রাল ডাটাবেস সিঙ্ক চেক করা হচ্ছে...');
          }}
          className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            syncStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/90 hover:bg-emerald-100 shadow-2xs'
              : syncStatus === 'syncing'
              ? 'bg-sky-50 text-sky-800 border-sky-200/90 hover:bg-sky-100'
              : 'bg-amber-50 text-amber-800 border-amber-200/90 hover:bg-amber-100'
          }`}
          title={`সেন্ট্রাল ব্যাকএন্ড ডাটাবেস লাইভ সিঙ্ক (Version ${serverVersion}) · ক্লিক করে রিফ্রেশ করুন`}
        >
          {syncStatus === 'syncing' ? (
            <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
          ) : syncStatus === 'connected' ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
          {item.showLabelOnDesktop && (
            <span className="text-[11px] font-extrabold">
              {syncStatus === 'connected'
                ? 'সেন্ট্রাল সিঙ্ক লাইভ'
                : syncStatus === 'syncing'
                ? 'সিঙ্ক হচ্ছে...'
                : 'অফলাইন মিরর'}
            </span>
          )}
        </button>
      );
    }

    // Built-in System Button: Quick Action Dropdown
    if (item.id === 'btn-quick') {
      return (
        <div key={item.id} className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            title={item.tooltip || t.quickAction}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {item.showLabelOnDesktop && <span className="hidden md:inline">{item.label || t.quickAction}</span>}
          </button>

          {showQuickMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in"
              onClick={() => setShowQuickMenu(false)}
            >
              <button
                onClick={() => setActiveTab('pos')}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-emerald-50 rounded-xl font-medium text-slate-800 text-left transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                <span>{t.pos}</span>
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-xl font-medium text-slate-800 text-left transition-colors cursor-pointer"
              >
                <Receipt className="w-4 h-4 text-blue-600" />
                <span>{t.newSale}</span>
              </button>
              <button
                onClick={() => setActiveTab('purchases')}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-amber-50 rounded-xl font-medium text-slate-800 text-left transition-colors cursor-pointer"
              >
                <Package className="w-4 h-4 text-amber-600" />
                <span>{t.newPurchase}</span>
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-50 rounded-xl font-medium text-slate-800 text-left transition-colors cursor-pointer"
              >
                <span className="w-4 h-4 flex items-center justify-center font-bold text-red-500">৳</span>
                <span>{t.addExpense}</span>
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-purple-50 rounded-xl font-medium text-slate-800 text-left transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-purple-600" />
                <span>{t.addCustomer}</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    // Built-in System Button: Cashier Shift
    if (item.id === 'btn-shift') {
      return (
        <button
          key={item.id}
          onClick={() => setShowShiftModal(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
            cashierShift.status === 'open'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100'
          }`}
          title="Cashier Shift & Drawer Balance"
        >
          <Clock className="w-3.5 h-3.5" />
          {item.showLabelOnDesktop && (
            <span className="hidden lg:inline">
              {cashierShift.status === 'open' ? 'শিফট চালু' : 'শিফট বন্ধ'}
            </span>
          )}
        </button>
      );
    }

    // Built-in System Button: Approval Queue Notification
    if (item.id === 'btn-approvals') {
      return (
        <button
          key={item.id}
          onClick={() => setActiveTab('approvals')}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          title="Approvals Queue"
        >
          <Bell className="w-4 h-4" />
          {pendingApprovalsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-ping"></span>
          )}
          {pendingApprovalsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>
      );
    }

    // Built-in System Button: Auto Backup Status
    if (item.id === 'btn-backup') {
      return (
        <button
          key={item.id}
          onClick={() => setShowBackupModal(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          title="Auto Backup Cloud Sync"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
          {item.showLabelOnDesktop && (
            <span className="hidden xl:inline text-[11px]">সিঙ্ক: {autoBackupSettings.intervalMinutes}m</span>
          )}
        </button>
      );
    }

    // Built-in System Button: Connected Gmail User Pill
    if (item.id === 'btn-gmail') {
      return (
        <button
          key={item.id}
          onClick={() => setShowGmailModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          title="Gmail Account Management & Cloud Backup"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
            {currentGmailUser?.name ? currentGmailUser.name.slice(0, 1) : 'G'}
          </div>
          {item.showLabelOnDesktop && (
            <span className="max-w-[120px] truncate hidden md:inline text-[11px] font-mono">
              {currentGmailUser?.email || 'Gmail লগইন'}
            </span>
          )}
        </button>
      );
    }

    // Built-in System Button: User Role Switcher
    if (item.id === 'btn-role') {
      return (
        <div key={item.id} className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="ইউজার রোল পরিবর্তন"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span className="capitalize">{currentUserRole}</span>
          </button>

          {showRoleMenu && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-2xl shadow-xl p-1 z-50 text-xs animate-in fade-in"
              onClick={() => setShowRoleMenu(false)}
            >
              {(['admin', 'manager', 'accountant', 'sales', 'cashier', 'viewer'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentUserRole(r);
                    showToast(`সক্রিয় রোল পরিবর্তন: ${r.toUpperCase()}`);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl capitalize font-medium transition-colors cursor-pointer ${
                    currentUserRole === r ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {r} {r === 'admin' ? '(পূর্ণ অধিকার)' : ''}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Built-in System Button: Quick Text Size Switcher
    if (item.id === 'btn-text') {
      return (
        <div key={item.id} className="relative">
          <button
            onClick={() => setShowTextSizeMenu(!showTextSizeMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer bg-white"
            title="টেক্সট সাইজ বড় বা ছোট করুন (Change Font Size)"
          >
            <Type className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline font-mono uppercase text-[11px] font-bold">
              {textSize === 'small' ? 'A (ছোট)' : textSize === 'large' ? 'A+ (বড়)' : textSize === 'xl' ? 'A++ (অতিরিক্ত)' : 'A (মাঝারি)'}
            </span>
            <span className="sm:hidden font-mono font-bold text-[11px]">A±</span>
          </button>

          {showTextSizeMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in"
              onClick={() => setShowTextSizeMenu(false)}
            >
              <div className="px-2.5 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                টেক্সট সাইজ স্কেল
              </div>
              {[
                { id: 'small', label: 'Small (ছোট - 13.5px)', desc: 'কমপ্যাক্ট ডাটা ভিউ' },
                { id: 'medium', label: 'Medium (মাঝারি - 16px)', desc: 'স্ট্যান্ডার্ড ব্যালেন্সড' },
                { id: 'large', label: 'Large (বড় - 18px)', desc: 'চোখের আরামদায়ক' },
                { id: 'xl', label: 'Extra Large (অতিরিক্ত - 20.5px)', desc: 'সর্বোচ্চ স্পষ্টতা' },
              ].map((itemSize) => (
                <button
                  key={itemSize.id}
                  onClick={() => setTextSize(itemSize.id as any)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer flex flex-col ${
                    textSize === itemSize.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{itemSize.label}</span>
                    {textSize === itemSize.id && <span className="text-emerald-600 font-bold">✓</span>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">{itemSize.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Generic / Custom Top Icon Menu Item (POS, Sales, Expenses, Reports, Calculator, Fullscreen, Custom link)
    return (
      <button
        key={item.id}
        onClick={() => handleTopItemClick(item)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer select-none relative group ${
          palette.bg
        } ${!item.showOnMobile ? 'hidden md:inline-flex' : ''}`}
        title={item.tooltip || item.label}
      >
        <Icon className="w-3.5 h-3.5" />
        {item.showLabelOnDesktop && (
          <span className="text-[11px] font-extrabold hidden md:inline truncate max-w-[120px]">
            {item.label}
          </span>
        )}
        {item.badgeType === 'dot' && (
          <span className={`w-1.5 h-1.5 rounded-full ${palette.dot} animate-pulse`}></span>
        )}
        {item.badgeType === 'count' && (
          <span className="px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[9px] font-bold">
            1
          </span>
        )}
      </button>
    );
  };

  const isCenterPlacement = topIconMenuConfig.placement === 'top_navbar_center';

  return (
    <>
      {/* Top Icon Menu Customizer Modal */}
      <TopIconMenuCustomizerModal
        isOpen={isTopIconCustomizerOpen}
        onClose={closeTopIconCustomizer}
      />

      {/* Quick Calculator Modal */}
      <QuickCalculatorModal
        isOpen={showCalculatorModal}
        onClose={() => setShowCalculatorModal(false)}
      />

      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
        <div className="flex items-center justify-between px-3 md:px-6 py-2.5 gap-2">
          {/* Left: Branding & Tagline */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-sm group-hover:bg-emerald-700 transition-colors shrink-0">
                ৳
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-base font-bold text-slate-900 leading-tight tracking-tight truncate max-w-[120px] sm:max-w-none">
                  {companyProfile.name.split('(')[0] || t.appName}
                </h1>
                <p className="hidden sm:block text-[11px] text-slate-500 font-medium truncate max-w-xs">
                  {companyProfile.tagline || t.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Global Real-time Search + Center Placed Icon Menu (if enabled) */}
          <div className="relative flex-1 max-w-md mx-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100 border border-transparent rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-hidden text-slate-800 placeholder-slate-400"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Center Placement Tool Items if configured */}
            {isCenterPlacement && (
              <div className="hidden lg:flex items-center gap-1.5">
                {visibleItems.map(renderNavbarItem)}
              </div>
            )}

            {/* Search Dropdown Results */}
            {searchResults && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-xs max-h-96 overflow-y-auto">
                {searchResults.invoices.length === 0 &&
                searchResults.products.length === 0 &&
                searchResults.customers.length === 0 &&
                searchResults.suppliers.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">কোনো তথ্য পাওয়া যায়নি (No matches found)</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {searchResults.invoices.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">
                          Invoices ({searchResults.invoices.length})
                        </div>
                        {searchResults.invoices.map((inv) => (
                          <div
                            key={inv.id}
                            onClick={() => {
                              setActiveTab('sales');
                              setGlobalSearch('');
                            }}
                            className="flex items-center justify-between p-2 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-semibold text-slate-800">{inv.invoiceNo}</span>
                              <span className="text-slate-500">· {inv.customerName}</span>
                            </div>
                            <span className="font-bold text-emerald-700">৳{inv.grandTotal.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.products.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">
                          Products ({searchResults.products.length})
                        </div>
                        {searchResults.products.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => {
                              setActiveTab('products');
                              setGlobalSearch('');
                            }}
                            className="flex items-center justify-between p-2 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Package className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-medium text-slate-800">{prod.name}</span>
                              <span className="text-slate-400 text-[10px]">[{prod.barcode}]</span>
                            </div>
                            <span className="font-semibold text-slate-700">৳{prod.salePrice}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.customers.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">
                          Customers ({searchResults.customers.length})
                        </div>
                        {searchResults.customers.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setActiveTab('customers');
                              setGlobalSearch('');
                            }}
                            className="flex items-center justify-between p-2 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-indigo-600" />
                              <span className="font-semibold text-slate-800">{c.name}</span>
                              <span className="text-slate-400 text-[10px]">({c.phone})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Tools (Rendered from topIconMenuConfig if right placement) */}
          <div
            className={`flex items-center flex-wrap ${
              topIconMenuConfig.spacing === 'compact'
                ? 'gap-1'
                : topIconMenuConfig.spacing === 'spacious'
                ? 'gap-2.5 sm:gap-3.5'
                : 'gap-1.5 sm:gap-2'
            }`}
          >
            {/* If placement is top_navbar_right, render dynamic customized items */}
            {!isCenterPlacement && visibleItems.map(renderNavbarItem)}

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer bg-white"
              title="Toggle English / বাংলা"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'bn' ? 'ENG' : 'বাংলা'}</span>
            </button>

            {/* Quick Top Icon Customizer Button */}
            <button
              onClick={openTopIconCustomizer}
              className="p-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs group"
              title="টপ আইকন মেনু সম্পূর্ণ ম্যানুয়ালি সাজান (Customize Top Icon Menu)"
            >
              <SlidersHorizontal className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>

        {/* Cashier Shift Modal */}
        {showShiftModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900 mb-1">ক্যাশিয়ার শিফট নিয়ন্ত্রণ (Shift Management)</h3>
              <p className="text-xs text-slate-500 mb-4">
                বর্তমান শিফট: {cashierShift.cashierName} · শুরু: {cashierShift.startTime}
              </p>

              <div className="space-y-3 mb-5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">ওপেনিং ক্যাশ ড্রয়ার:</span>
                  <span className="font-bold text-slate-800">৳{cashierShift.openingCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">চলতি শিফটে মোট বিক্রয়:</span>
                  <span className="font-bold text-emerald-600">৳{cashierShift.totalSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">মোট ক্যাশ ড্রয়ার ব্যালেন্স:</span>
                  <span className="font-bold text-slate-900">
                    ৳{(cashierShift.openingCash + cashierShift.totalSales).toLocaleString()}
                  </span>
                </div>
                <div className="pt-2">
                  <label className="block text-slate-700 font-bold mb-1">ক্লোজিং ক্যাশ গণনা (৳):</label>
                  <input
                    type="number"
                    value={shiftClosingCash}
                    onChange={(e) => setShiftClosingCash(Number(e.target.value))}
                    placeholder="ড্রয়ারের মোট ক্যাশ লিখুন"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowShiftModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  বন্ধ করুন
                </button>
                {cashierShift.status === 'open' ? (
                  <button
                    onClick={handleCloseShift}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    শিফট ক্লোজ ও ক্যাশ আউট
                  </button>
                ) : (
                  <button
                    onClick={handleOpenShift}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    নতুন শিফট শুরু করুন
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Gmail Cloud Auth Modal */}
        <GmailAuthModal isOpen={showGmailModal} onClose={() => setShowGmailModal(false)} />

        {/* Auto Backup Status & Snapshots Modal */}
        <AutoBackupModal isOpen={showBackupModal} onClose={() => setShowBackupModal(false)} />
      </header>
    </>
  );
};
