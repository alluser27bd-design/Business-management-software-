import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Settings,
  Sparkles,
} from 'lucide-react';
import { getIconComponent } from '../utils/dashboardIcons';

export const Dashboard: React.FC = () => {
  const {
    setActiveTab,
    companyProfile,
    dashboardMetrics,
    invoices,
    purchases,
    payments,
    dashboardCustomSettings,
    toggleDashboardQuickItem,
    toggleDashboardMetric,
  } = useApp();

  // Current Date formatted in Bengali
  const todayDateStr = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('bn-BD', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date());
    } catch {
      return new Date().toLocaleDateString('bn-BD');
    }
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Today's Received = collected at sale time today + direct payment collection today
  const todayReceived = useMemo(() => {
    const todayInvoiceReceived = invoices
      .filter((i) => !i.deletedAt && i.status !== 'cancelled' && i.date === todayStr)
      .reduce((sum, i) => sum + (i.paidAmount || 0), 0);

    const todayPaymentsIn = payments
      .filter((p) => !p.deletedAt && p.type === 'in' && p.date === todayStr)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return todayInvoiceReceived + todayPaymentsIn;
  }, [invoices, payments, todayStr]);

  // Today's Due = new credit created today from invoices
  const todayDue = useMemo(() => {
    return invoices
      .filter((i) => !i.deletedAt && i.status !== 'cancelled' && i.date === todayStr)
      .reduce((sum, i) => sum + (i.dueAmount || 0), 0);
  }, [invoices, todayStr]);

  // Dynamic Value Resolver for all Metrics
  const getMetricValue = (metricId: string): number => {
    switch (metricId) {
      case 'totalDue':
        return dashboardMetrics.customerReceivable;
      case 'cashInHand':
        return dashboardMetrics.companyCashBalance;
      case 'totalSales':
        return dashboardMetrics.totalSales;
      case 'totalPurchases':
        return dashboardMetrics.totalPurchase;
      case 'todaySales':
        return dashboardMetrics.todaySales;
      case 'todayPurchase':
        return dashboardMetrics.todayPurchase;
      case 'todayReceived':
        return todayReceived;
      case 'todayDue':
        return todayDue;
      case 'bankBalance':
        return dashboardMetrics.bankBalance;
      case 'mobileBanking':
        return dashboardMetrics.mobileBankingBalance;
      case 'netProfit':
        return dashboardMetrics.netProfit;
      case 'totalExpense':
        return dashboardMetrics.totalExpense;
      case 'stockValue':
        return dashboardMetrics.stockValue;
      case 'supplierPayable':
        return dashboardMetrics.supplierPayable;
      case 'todayExpense':
        return dashboardMetrics.todayExpense;
      default:
        return 0;
    }
  };

  // Filtered & Ordered Active Items
  const activeQuickItems = useMemo(() => {
    return [...dashboardCustomSettings.quickItems]
      .filter((item) => item.enabled)
      .sort((a, b) => a.order - b.order);
  }, [dashboardCustomSettings.quickItems]);

  const activeMetrics = useMemo(() => {
    return [...dashboardCustomSettings.metrics]
      .filter((item) => item.enabled)
      .sort((a, b) => a.order - b.order);
  }, [dashboardCustomSettings.metrics]);

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto font-['Plus_Jakarta_Sans',_'Hind_Siliguri',_sans-serif]">
      {/* =========================================================================
          1. CLEAN MINIMAL HEADER
          ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {companyProfile.name.split('(')[0] || 'বিজনেস ড্যাশবোর্ড'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              ব্যবসায়িক প্রধান হিসাব ও এক-ক্লিকে প্রয়োজনীয় কার্যক্রমে প্রবেশ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-2xl shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{todayDateStr}</span>
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
              title="সেটিংস থেকে ড্যাশবোর্ড সাজান"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>ড্যাশবোর্ড সেটিংস</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. QUICK ACCESS MENU
          ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
              কুইক অ্যাক্সেস মেনু (Quick Access Menu)
            </h2>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {activeQuickItems.length} টি সক্রিয়
            </span>
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <span>সেটিংস থেকে সাজান →</span>
          </button>
        </div>

        {activeQuickItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-xs font-bold text-slate-600">কোনো শর্টকাট সক্রিয় নেই</p>
            <p className="text-[11px] text-slate-400 mt-1">
              সেটিংসের "ড্যাশবোর্ড কাস্টমাইজেশন" অপশন থেকে প্রয়োজনীয় শর্টকাট অন করুন
            </p>
            <button
              onClick={() => setActiveTab('settings')}
              className="mt-3 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
            >
              সেটিংস এ যান
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
            {activeQuickItems.map((item) => {
              const Icon = getIconComponent(item.iconName);
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setActiveTab(item.tab as any)}
                    className="w-full flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer select-none bg-slate-50/70 hover:bg-white border border-slate-200/90 hover:border-emerald-300"
                  >
                    {/* Vibrant Rounded Squircle Container */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-md ${item.color} text-white shadow-emerald-600/10 ring-4 ring-slate-100`}
                    >
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                    </div>

                    {/* Shortcut Label */}
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors mt-3 text-center">
                      {item.label}
                    </span>
                  </button>

                  {/* Quick Remove Button on Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDashboardQuickItem(item.id, false);
                    }}
                    className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 shadow-2xs cursor-pointer"
                    title="ড্যাশবোর্ড থেকে লুকান"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          3. BUSINESS SUMMARY / হিসাবের অংশ
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
              বিজনেস সামারি ও আর্থিক হিসাব (Business Summary)
            </h2>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              {activeMetrics.length} টি হিসাব কার্ড
            </span>
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
          >
            <span>সেটিংস থেকে সাজান →</span>
          </button>
        </div>

        {activeMetrics.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-xs font-bold text-slate-600">কোনো হিসাব কার্ড সক্রিয় নেই</p>
            <p className="text-[11px] text-slate-400 mt-1">
              সেটিংসের "ড্যাশবোর্ড কাস্টমাইজেশন" অপশন থেকে প্রয়োজনীয় হিসাব কার্ড অন করুন
            </p>
            <button
              onClick={() => setActiveTab('settings')}
              className="mt-3 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
            >
              সেটিংস এ যান
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {activeMetrics.map((item) => {
              const Icon = getIconComponent(item.iconName);
              const val = getMetricValue(item.id);

              return (
                <div
                  key={item.id}
                  className="relative group bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4 text-slate-800" />
                    </div>
                  </div>

                  <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${item.color}`}>
                    ৳{val.toLocaleString()}
                  </div>

                  {/* Quick Remove Button on Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDashboardMetric(item.id, false);
                    }}
                    className="absolute top-2 right-2 p-1 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 shadow-2xs cursor-pointer"
                    title="হিসাব কার্ডটি লুকান"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
