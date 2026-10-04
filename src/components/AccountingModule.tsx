import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale,
  Download,
  Printer,
  Lock,
  Unlock,
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';

export const AccountingModule: React.FC = () => {
  const {
    t,
    dashboardMetrics,
    companyProfile,
    updateCompanyProfile,
    invoices,
    purchases,
    expenses,
    exportToCSV,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pnl' | 'balance_sheet' | 'trial_balance' | 'cash_flow'>('pnl');
  const [lockDate, setLockDate] = useState<string>(companyProfile.periodLockedUntil || '');

  // Calculate Trial Balance figures
  const trialBalance = React.useMemo(() => {
    return [
      { account: 'ক্যাশ ইন হ্যান্ড (Cash in Hand)', debit: Math.max(0, dashboardMetrics.companyCashBalance), credit: 0 },
      { account: 'ব্যাংক অ্যাকাউন্ট (Bank Account)', debit: Math.max(0, dashboardMetrics.bankBalance), credit: 0 },
      { account: 'মোবাইল ব্যাংকিং (MFS)', debit: Math.max(0, dashboardMetrics.mobileBankingBalance), credit: 0 },
      { account: 'কাস্টমার দেনাদার (Accounts Receivable)', debit: Math.max(0, dashboardMetrics.customerReceivable), credit: 0 },
      { account: 'মজুদ পণ্য সম্পদ (Merchandise Inventory)', debit: Math.max(0, dashboardMetrics.stockValue), credit: 0 },
      { account: 'মহাজন পাওনাদার (Accounts Payable)', debit: 0, credit: Math.max(0, dashboardMetrics.supplierPayable) },
      { account: 'মালিকের ব্যক্তিগত দেনা (Owner Liability)', debit: 0, credit: Math.max(0, dashboardMetrics.ownMoneyPaid) },
      { account: 'বিক্রয় আয় (Sales Revenue)', debit: 0, credit: Math.max(0, dashboardMetrics.totalSales) },
      { account: 'পণ্য ক্রয় ব্যয় (Cost of Purchases)', debit: Math.max(0, dashboardMetrics.totalPurchase), credit: 0 },
      { account: 'অপারেটিং খরচ (Operating Expenses)', debit: Math.max(0, dashboardMetrics.totalExpense), credit: 0 },
    ];
  }, [dashboardMetrics]);

  const totalDebit = trialBalance.reduce((sum, a) => sum + a.debit, 0);
  const totalCredit = trialBalance.reduce((sum, a) => sum + a.credit, 0);

  const handleSavePeriodLock = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile({
      ...companyProfile,
      periodLockedUntil: lockDate,
    });
    showToast(`হিসাবকাল লক আপডেট হয়েছে: ${lockDate || 'কোনো লক নেই'}`);
  };

  const handleExportCSV = () => {
    const headers = ['Account Head', 'Debit (৳)', 'Credit (৳)'];
    const rows = trialBalance.map((a) => [a.account, a.debit, a.credit]);
    exportToCSV('Financial_Trial_Balance', headers, rows);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <span>অ্যাকাউন্টিং ও আর্থিক প্রতিবেদন (Accounting & Finance)</span>
          </h2>
          <p className="text-xs text-slate-500">
            লাভ-ক্ষতি হিসাব (P&L), ব্যালেন্স শিট, রেওয়ামিল (Trial Balance) ও ক্যাশ ফ্লো
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.excel}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs font-medium">
        {[
          { id: 'pnl', label: 'লাভ ও ক্ষতি বিবরণী (Profit & Loss)' },
          { id: 'balance_sheet', label: 'ব্যালেন্স শিট (Balance Sheet)' },
          { id: 'trial_balance', label: 'রেওয়ামিল (Trial Balance)' },
          { id: 'cash_flow', label: 'ক্যাশ ফ্লো স্টেটমেন্ট (Cash Flow)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: P&L */}
      {activeTab === 'pnl' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 max-w-2xl">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">লাভ ও ক্ষতি হিসাব (Income Statement)</h3>
            <p className="text-xs text-slate-400">সর্বশেষ লেনদেন পর্যন্ত রিয়েল-টাইম হিসাব</p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Revenue */}
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">আয় (Revenue)</div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 pl-3">
              <span className="text-slate-600">মোট বিক্রয় রাজস্ব (Total Sales):</span>
              <span className="font-bold text-slate-900">৳{dashboardMetrics.totalSales.toLocaleString()}</span>
            </div>

            {/* COGS */}
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] pt-2">
              বিক্রিত পণ্যের ব্যয় (Cost of Goods Sold)
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 pl-3">
              <span className="text-slate-600">বিক্রিত পণ্যের ক্রয় খরচ:</span>
              <span className="font-bold text-slate-900">
                -৳{(dashboardMetrics.totalSales - dashboardMetrics.grossProfit).toLocaleString()}
              </span>
            </div>

            {/* Gross Profit */}
            <div className="flex justify-between py-2 bg-emerald-50 px-3 rounded-lg font-bold text-emerald-800">
              <span>মোট লাভ (Gross Profit):</span>
              <span>৳{dashboardMetrics.grossProfit.toLocaleString()}</span>
            </div>

            {/* Operating Expenses */}
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] pt-2">
              অপারেটিং খরচ (Operating Expenses)
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 pl-3">
              <span className="text-slate-600">দোকান ভাড়া, ইউটিলিটি ও আনুষঙ্গিক খরচ:</span>
              <span className="font-bold text-red-600">-৳{dashboardMetrics.totalExpense.toLocaleString()}</span>
            </div>

            {/* Net Profit */}
            <div className="flex justify-between py-3 bg-slate-900 text-white px-4 rounded-xl text-sm font-black">
              <span>প্রকৃত নিট মুনাফা (Net Profit):</span>
              <span className={dashboardMetrics.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                ৳{dashboardMetrics.netProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Balance Sheet */}
      {activeTab === 'balance_sheet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assets */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              মোট সম্পদ (Total Assets)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">কোম্পানি ক্যাশ তহবিল:</span>
                <span className="font-bold text-slate-900">৳{dashboardMetrics.companyCashBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">ব্যাংক ব্যালেন্স:</span>
                <span className="font-bold text-slate-900">৳{dashboardMetrics.bankBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">মোবাইল ব্যাংকিং:</span>
                <span className="font-bold text-slate-900">৳{dashboardMetrics.mobileBankingBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">কাস্টমার বকেয়া পাওনা (Receivables):</span>
                <span className="font-bold text-amber-700">৳{dashboardMetrics.customerReceivable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">স্টক পণ্যের মূল্য (Inventory Value):</span>
                <span className="font-bold text-slate-900">৳{dashboardMetrics.stockValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-black text-emerald-800">
                <span>সর্বমোট সম্পদ:</span>
                <span>
                  ৳
                  {(
                    dashboardMetrics.companyCashBalance +
                    dashboardMetrics.bankBalance +
                    dashboardMetrics.mobileBankingBalance +
                    dashboardMetrics.customerReceivable +
                    dashboardMetrics.stockValue
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Liabilities & Equity */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              দায় ও ইকুইটি (Liabilities & Equity)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">মহাজন পাওনাদার (Accounts Payable):</span>
                <span className="font-bold text-orange-700">৳{dashboardMetrics.supplierPayable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">মালিকের ব্যক্তিগত পাওনা (Owner Liability):</span>
                <span className="font-bold text-indigo-700">৳{dashboardMetrics.ownMoneyPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">সঞ্চিত নিট লাভ (Retained Profit):</span>
                <span className="font-bold text-emerald-700">৳{dashboardMetrics.netProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Trial Balance */}
      {activeTab === 'trial_balance' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">অ্যাকাউন্ট খাতের নাম (Ledger Account)</th>
                <th className="py-3 px-4 text-right">ডেবিট (৳)</th>
                <th className="py-3 px-4 text-right">ক্রেডিট (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trialBalance.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-semibold text-slate-800">{row.account}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                    {row.debit > 0 ? `৳${row.debit.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                    {row.credit > 0 ? `৳${row.credit.toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900 text-white font-black text-xs">
              <tr>
                <td className="py-3 px-4">সর্বমোট রেওয়ামিল (Total):</td>
                <td className="py-3 px-4 text-right text-emerald-400">৳{totalDebit.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-emerald-400">৳{totalCredit.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Tab 4: Cash Flow */}
      {activeTab === 'cash_flow' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs max-w-xl space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            ক্যাশ ফ্লো বিবরণী (Cash Flow Statement)
          </h3>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">বিক্রয় ও কাস্টমার কালেকশন থেকে মোট ক্যাশ ইনফ্লো:</span>
            <span className="font-bold text-emerald-600">
              +৳{(dashboardMetrics.todayCollection + dashboardMetrics.totalSales).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">ক্রয় ও সাপ্লায়ার পেমেন্টে মোট ক্যাশ আউটফ্লো:</span>
            <span className="font-bold text-amber-600">
              -৳{(dashboardMetrics.todayPayment + dashboardMetrics.totalPurchase).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">অপারেটিং ব্যয়ে নগদ প্রদান:</span>
            <span className="font-bold text-red-600">-৳{dashboardMetrics.totalExpense.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 text-sm font-black text-slate-900">
            <span>মোট লিকুইড ক্যাশ ও ব্যাংক স্থিতি:</span>
            <span className="text-teal-700">
              ৳{(dashboardMetrics.companyCashBalance + dashboardMetrics.bankBalance).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Period Lock & Year End Closing */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>অ্যাকাউন্টিং পিরিয়ড লক (Period Lock & Year-End Closing)</span>
          </h4>
          <p className="text-slate-500">
            নির্দিষ্ট তারিখ পর্যন্ত পুরনো হিসাব লক করে রাখতে পারেন যাতে অসাবধানতাবশত কেউ এডিট না করতে পারে।
          </p>
        </div>

        <form onSubmit={handleSavePeriodLock} className="flex items-center gap-2">
          <input
            type="date"
            value={lockDate}
            onChange={(e) => setLockDate(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden text-xs"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg font-bold shadow-xs"
          >
            লক সেট করুন
          </button>
        </form>
      </div>
    </div>
  );
};
