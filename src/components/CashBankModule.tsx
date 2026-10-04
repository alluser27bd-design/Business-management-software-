import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Landmark,
  Wallet,
  Smartphone,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export const CashBankModule: React.FC = () => {
  const {
    t,
    dashboardMetrics,
    invoices,
    purchases,
    expenses,
    payments,
    cashierShift,
    savePayment,
    exportToCSV,
    showToast,
  } = useApp();

  const [activeBook, setActiveBook] = useState<'cash' | 'bank' | 'mobile_banking'>('cash');
  const [isAdjModalOpen, setIsAdjModalOpen] = useState<boolean>(false);
  const [adjAmount, setAdjAmount] = useState<number>(0);
  const [adjType, setAdjType] = useState<'in' | 'out'>('in');
  const [adjNotes, setAdjNotes] = useState<string>('ব্যালেন্স অ্যাডজাস্টমেন্ট ও রিকনসিলিয়েশন');

  // Ledger calculation for active book
  const transactions = React.useMemo(() => {
    const list: {
      date: string;
      title: string;
      party: string;
      inAmount: number;
      outAmount: number;
      type: string;
    }[] = [];

    const methodFilter = activeBook;

    // Sales
    invoices
      .filter((i) => !i.deletedAt && i.paymentMethod === methodFilter && i.paidAmount > 0)
      .forEach((inv) => {
        list.push({
          date: inv.date,
          title: `বিক্রয় ইনভয়েস (${inv.invoiceNo})`,
          party: inv.customerName,
          inAmount: inv.paidAmount,
          outAmount: 0,
          type: 'Sale',
        });
      });

    // Purchases
    purchases
      .filter((p) => !p.deletedAt && p.paymentMethod === methodFilter && p.paidAmount > 0)
      .forEach((pur) => {
        list.push({
          date: pur.date,
          title: `ক্রয় চালান বিল (${pur.billNo})`,
          party: pur.supplierName,
          inAmount: 0,
          outAmount: pur.paidAmount,
          type: 'Purchase',
        });
      });

    // Expenses (only if not paid by own money)
    expenses
      .filter((e) => !e.deletedAt && !e.isOwnMoneyPaid && e.paymentMethod === methodFilter)
      .forEach((exp) => {
        list.push({
          date: exp.date,
          title: `খরচ ভাউচার (${exp.expenseNo}) - ${exp.category}`,
          party: exp.paidBy,
          inAmount: 0,
          outAmount: exp.amount,
          type: 'Expense',
        });
      });

    // Payments In/Out
    payments
      .filter((p) => !p.deletedAt && p.paymentMethod === methodFilter)
      .forEach((pay) => {
        list.push({
          date: pay.date,
          title: `পেমেন্ট লেনদেন (${pay.paymentNo}) - ${pay.notes || ''}`,
          party: pay.partyName,
          inAmount: pay.type === 'in' ? pay.amount : 0,
          outAmount: pay.type === 'out' ? pay.amount : 0,
          type: pay.type === 'in' ? 'Payment In' : 'Payment Out',
        });
      });

    return list.sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [invoices, purchases, expenses, payments, activeBook]);

  const currentBalance =
    activeBook === 'cash'
      ? dashboardMetrics.companyCashBalance
      : activeBook === 'bank'
      ? dashboardMetrics.bankBalance
      : dashboardMetrics.mobileBankingBalance;

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjAmount <= 0) return;

    savePayment({
      id: `ADJ-${Date.now()}`,
      paymentNo: `ADJ-${Date.now().toString().slice(-5)}`,
      type: adjType,
      partyType: 'other',
      partyName: `${activeBook.toUpperCase()} Adjustment / Reconciliation`,
      amount: Number(adjAmount),
      paymentMethod: activeBook,
      date: new Date().toISOString().slice(0, 10),
      notes: adjNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    });

    setIsAdjModalOpen(false);
    showToast('অ্যাকাউন্ট ব্যালেন্স সমন্বয় সফল হয়েছে');
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Transaction Title', 'Party', 'In Flow (+)', 'Out Flow (-)', 'Type'];
    const rows = transactions.map((t) => [t.date, t.title, t.party, t.inAmount, t.outAmount, t.type]);
    exportToCSV(`${activeBook.toUpperCase()}_Book_Ledger`, headers, rows);
  };

  return (
    <div className="space-y-4">
      {/* Three Book Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Cash Book Card */}
        <div
          onClick={() => setActiveBook('cash')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeBook === 'cash'
              ? 'bg-emerald-900 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400'
              : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">ক্যাশ বুক (Cash Book)</span>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black">৳{dashboardMetrics.companyCashBalance.toLocaleString()}</div>
          <p className="text-[11px] opacity-80 mt-1">কাউন্টার ও ড্রয়ারের নগদ তহবিল</p>
        </div>

        {/* Bank Book Card */}
        <div
          onClick={() => setActiveBook('bank')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeBook === 'bank'
              ? 'bg-blue-900 text-white border-blue-800 shadow-md ring-2 ring-blue-400'
              : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">ব্যাংক হিসাব (Bank Book)</span>
            <Landmark className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-black">৳{dashboardMetrics.bankBalance.toLocaleString()}</div>
          <p className="text-[11px] opacity-80 mt-1">চেক ও অনলাইন ব্যাংক ব্যালেন্স</p>
        </div>

        {/* Mobile Banking Card */}
        <div
          onClick={() => setActiveBook('mobile_banking')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeBook === 'mobile_banking'
              ? 'bg-purple-900 text-white border-purple-800 shadow-md ring-2 ring-purple-400'
              : 'bg-white border-slate-200 hover:border-purple-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">মোবাইল ব্যাংকিং (MFS)</span>
            <Smartphone className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-black">৳{dashboardMetrics.mobileBankingBalance.toLocaleString()}</div>
          <p className="text-[11px] opacity-80 mt-1">bKash, নগদ, রকেট মার্চেন্ট অ্যাকাউন্ট</p>
        </div>
      </div>

      {/* Book Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900 capitalize">
            {activeBook.replace('_', ' ')} লেনদেন লেজার ও ক্যাশ ফ্লো
          </h3>
          <p className="text-xs text-slate-500">
            রিয়েল-টাইম হিসাবের খতিয়ান এবং দৈনিক জমা-খরচের পূর্ণ ইতিহাস
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
          <button
            onClick={() => setIsAdjModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>ব্যালেন্স সমন্বয় / রিকনসিলিয়েশন</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">তারিখ</th>
                <th className="py-3 px-3">লেনদেন বিবরণ</th>
                <th className="py-3 px-3">পার্টি / প্রেরক / প্রাপক</th>
                <th className="py-3 px-3 text-right text-emerald-700">জমা (In Flow +)</th>
                <th className="py-3 px-3 text-right text-red-700">খরচ / পরিশোধ (Out Flow -)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    কোনো লেনদেন পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{tx.title}</td>
                    <td className="py-3 px-3 text-slate-600">{tx.party}</td>
                    <td className="py-3 px-3 text-right font-black text-emerald-700">
                      {tx.inAmount > 0 ? `+৳${tx.inAmount.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-red-600">
                      {tx.outAmount > 0 ? `-৳${tx.outAmount.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Adjustment Modal */}
      {isAdjModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">অ্যাকাউন্ট ব্যালেন্স সমন্বয় (Adjustment)</h3>
              <button onClick={() => setIsAdjModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">অ্যাকাউন্টের ধরণ</label>
                <div className="font-bold text-slate-900 uppercase">{activeBook.replace('_', ' ')}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">সমন্বয়ের দিক</label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden font-bold"
                >
                  <option value="in">টাকা যোগ করুন (+ Balance IN)</option>
                  <option value="out">টাকা কর্তন করুন (- Balance OUT)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">সমন্বয় টাকার পরিমাণ *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-black text-slate-900 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">কারণ বা ভাউচার রেফারেন্স *</label>
                <input
                  type="text"
                  required
                  value={adjNotes}
                  onChange={(e) => setAdjNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdjModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-lg font-bold shadow-xs"
                >
                  সমন্বয় সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
