import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';
import {
  DollarSign,
  Plus,
  Search,
  Download,
  Trash2,
  Edit,
  UserCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Building,
} from 'lucide-react';

export const ExpenseModule: React.FC = () => {
  const {
    t,
    expenses,
    saveExpense,
    deleteExpense,
    dashboardMetrics,
    exportToCSV,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Bulk Multi-row Expense Entry Mode
  const [isBulkMode, setIsBulkMode] = useState<boolean>(false);
  const [bulkDate, setBulkDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [bulkPaidBy, setBulkPaidBy] = useState<string>('Company Cash');
  const [bulkOwnerName, setBulkOwnerName] = useState<string>('জনাব মোর্শেদ আলম (Owner)');
  const [bulkMethod, setBulkMethod] = useState<'cash' | 'bank' | 'mobile_banking' | 'own_money'>('cash');
  const [bulkRows, setBulkRows] = useState<
    { category: string; description: string; amount: number; isOwnMoney: boolean }[]
  >([
    { category: 'দোকান খরচ ও নাস্তা', description: '', amount: 0, isOwnMoney: false },
    { category: 'পরিবহন ও যাতায়াত', description: '', amount: 0, isOwnMoney: false },
  ]);

  // Single Expense Form State
  const [category, setCategory] = useState<string>('দোকান খরচ');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'mobile_banking' | 'own_money'>('cash');
  const [paidBy, setPaidBy] = useState<string>('Company Cash');
  const [ownerPartyName, setOwnerPartyName] = useState<string>('জনাব মোর্শেদ আলম');
  const [isOwnMoneyPaid, setIsOwnMoneyPaid] = useState<boolean>(false);

  const categories = [
    'দোকান ভাড়া (Shop Rent)',
    'বিদ্যুৎ ও ইউটিলিটি (Electricity & Utility)',
    'কর্মচারী বেতন ও বোনাস (Staff Salary)',
    'দোকান খরচ ও নাস্তা (Refreshment & Tea)',
    'পরিবহন ও যাতায়াত (Transport & Conveyance)',
    'জরুরি মেরামত ও ডেকোরেশন (Repairs & Maintenance)',
    'মার্কেটিং ও বিজ্ঞাপন (Marketing)',
    'প্যাকেজিং ও অন্যান্য খরচ (Other Expense)',
  ];

  const filteredExpenses = expenses.filter((e) => {
    if (e.deletedAt) return false;
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        e.expenseNo.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.paidBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setIsBulkMode(false);
    setCategory('দোকান খরচ ও নাস্তা (Refreshment & Tea)');
    setDescription('');
    setAmount(0);
    setDate(new Date().toISOString().slice(0, 10));
    setPaymentMethod('cash');
    setPaidBy('Company Cash');
    setOwnerPartyName('জনাব মোর্শেদ আলম');
    setIsOwnMoneyPaid(false);
    setIsModalOpen(true);
  };

  const handleOpenBulkAdd = () => {
    setEditingExpense(null);
    setIsBulkMode(true);
    setBulkDate(new Date().toISOString().slice(0, 10));
    setBulkPaidBy('Company Cash');
    setBulkOwnerName('জনাব মোর্শেদ আলম');
    setBulkMethod('cash');
    setBulkRows([
      { category: 'দোকান খরচ ও নাস্তা (Refreshment & Tea)', description: 'সকালের নাস্তা ও চা', amount: 150, isOwnMoney: false },
      { category: 'পরিবহন ও যাতায়াত (Transport & Conveyance)', description: 'মালামাল ভ্যান ভাড়া', amount: 300, isOwnMoney: false },
      { category: 'দোকান সামগ্রী', description: 'ঝাড়ু ও পরিষ্কার সামগ্রী', amount: 180, isOwnMoney: false },
    ]);
    setIsModalOpen(true);
  };

  const handleEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setIsBulkMode(false);
    setCategory(exp.category);
    setDescription(exp.description);
    setAmount(exp.amount);
    setDate(exp.date);
    setPaymentMethod(exp.paymentMethod);
    setPaidBy(exp.paidBy);
    setOwnerPartyName(exp.ownerPartyName || 'জনাব মোর্শেদ আলম');
    setIsOwnMoneyPaid(exp.isOwnMoneyPaid || exp.paymentMethod === 'own_money');
    setIsModalOpen(true);
  };

  const handleSaveSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      showToast('অনুগ্রহ করে সঠিক খরচের পরিমাণ লিখুন');
      return;
    }

    const isOwner = isOwnMoneyPaid || paymentMethod === 'own_money' || paidBy !== 'Company Cash';

    const payload: Expense = {
      id: editingExpense ? editingExpense.id : `EXP-${Date.now()}`,
      expenseNo: editingExpense
        ? editingExpense.expenseNo
        : `EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      description,
      amount: Number(amount),
      date,
      paymentMethod: isOwner ? 'own_money' : paymentMethod,
      paidBy: isOwner ? ownerPartyName : 'Company Cash',
      ownerPartyName: isOwner ? ownerPartyName : undefined,
      isOwnMoneyPaid: isOwner,
      status: 'approved',
      createdAt: editingExpense ? editingExpense.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    saveExpense(payload);
    setIsModalOpen(false);
  };

  const handleSaveBulk = (e: React.FormEvent) => {
    e.preventDefault();
    const validRows = bulkRows.filter((r) => r.amount > 0);
    if (validRows.length === 0) {
      showToast('অনুগ্রহ করে অন্তত একটি খরচের পরিমাণ লিখুন');
      return;
    }

    const isOwner = bulkPaidBy !== 'Company Cash' || bulkMethod === 'own_money';

    validRows.forEach((r, idx) => {
      const payload: Expense = {
        id: `EXP-${Date.now()}-${idx}`,
        expenseNo: `EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        category: r.category,
        description: r.description || r.category,
        amount: Number(r.amount),
        date: bulkDate, // Reuses single chosen date across all rows!
        paymentMethod: r.isOwnMoney || isOwner ? 'own_money' : bulkMethod,
        paidBy: r.isOwnMoney || isOwner ? bulkOwnerName : 'Company Cash',
        ownerPartyName: r.isOwnMoney || isOwner ? bulkOwnerName : undefined,
        isOwnMoneyPaid: r.isOwnMoney || isOwner,
        status: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      saveExpense(payload);
    });

    setIsModalOpen(false);
    showToast(`${validRows.length}টি খরচ সফলভাবে এন্ট্রি হয়েছে`);
  };

  const handleExportCSV = () => {
    const headers = ['Expense No', 'Category', 'Description', 'Amount', 'Date', 'Payment Method', 'Paid By', 'Owner Money?'];
    const rows = filteredExpenses.map((e) => [
      e.expenseNo,
      e.category,
      e.description,
      e.amount,
      e.date,
      e.paymentMethod,
      e.paidBy,
      e.isOwnMoneyPaid ? 'YES' : 'NO',
    ]);
    exportToCSV('Expense_Ledger', headers, rows);
  };

  return (
    <div className="space-y-4">
      {/* Header & Balance Intelligence Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              <span>দৈনিক ও মাসিক খরচ হিসাব (Expense & Overhead)</span>
            </h2>
            <p className="text-xs text-slate-500">
              কোম্পানি ক্যাশ থেকে খরচ কর্তন ও মালিকের ব্যক্তিগত টাকা দিয়ে অতিরিক্ত খরচের দায় ট্র্যাকিং
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
              onClick={handleOpenBulkAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold"
              title="একই তারিখে মালিকের নামে একসাথে একাধিক খরচের রো এন্ট্রি"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>একসাথে একাধিক খরচ (Bulk Entry)</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addExpense}</span>
            </button>
          </div>
        </div>

        {/* Custom Balance Logic Information Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>কোম্পানি ক্যাশ ব্যালেন্স (Cash Balance)</span>
            </div>
            <div className="text-lg font-black text-emerald-700">
              ৳{dashboardMetrics.companyCashBalance.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">কোম্পানির ফান্ড থেকে সাধারণ খরচ কাটা হয়</p>
          </div>

          <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-200">
            <div className="flex items-center gap-1.5 text-indigo-800 font-bold mb-1">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>মালিকের ব্যক্তিগত টাকা (Own Money Paid)</span>
            </div>
            <div className="text-lg font-black text-indigo-700">
              ৳{dashboardMetrics.ownMoneyPaid.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">মালিক কোম্পানির দায় পরিশোধে নিজের পকেট থেকে দিয়েছেন</p>
          </div>

          <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-200">
            <div className="flex items-center gap-1.5 text-teal-800 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>অবশিষ্ট প্রকৃত ব্যালেন্স (Remaining Balance)</span>
            </div>
            <div className="text-lg font-black text-teal-800">
              ৳{dashboardMetrics.remainingBalance.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">মোট নগদ তহবিল - মালিকের ব্যক্তিগত পাওনা</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="খরচের বিবরণ, খাত বা পেয়ার খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-red-500"
          />
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">খরচ আইডি</th>
                <th className="py-3 px-3">তারিখ</th>
                <th className="py-3 px-3">খরচের খাত (Category)</th>
                <th className="py-3 px-3">বিবরণ (Description)</th>
                <th className="py-3 px-3">কে প্রদান করেছে (Paid By)</th>
                <th className="py-3 px-3 text-right">টাকার পরিমাণ</th>
                <th className="py-3 px-3 text-center">ব্যালেন্স প্রভাব</th>
                <th className="py-3 px-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    কোনো খরচের রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{exp.expenseNo}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{exp.date}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{exp.category}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{exp.description}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{exp.paidBy}</div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {exp.paymentMethod.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-red-600 text-sm">
                      ৳{exp.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {exp.isOwnMoneyPaid || exp.paymentMethod === 'own_money' ? (
                        <span className="text-[10px] font-bold text-indigo-700">
                          মালিকের দায় (+)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700">
                          ক্যাশ কর্তন (-)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(exp)}
                          title="Edit"
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-md"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(t.confirmDelete)) {
                              deleteExpense(exp.id, true);
                            }
                          }}
                          title="Delete"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Single or Bulk Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">
                  {isBulkMode
                    ? 'একসাথে একাধিক খরচ এন্ট্রি (Bulk Expense Row Entry)'
                    : editingExpense
                    ? 'খরচ সম্পাদনা'
                    : 'নতুন খরচ এন্ট্রি (Add Expense)'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isBulkMode
                    ? 'তারিখ ও মালিকের নাম একবার সিলেক্ট করলেই সব সারিতে প্রযোজ্য হবে'
                    : 'কোম্পানি ক্যাশ অথবা মালিকের ব্যক্তিগত টাকা নির্বাচন করুন'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            {isBulkMode ? (
              /* Bulk Entry Form */
              <form onSubmit={handleSaveBulk} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {/* Master Info: Date, Paid By, Owner Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">তারিখ (সবার জন্য এক)</label>
                    <input
                      type="date"
                      value={bulkDate}
                      onChange={(e) => setBulkDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">কে টাকা পরিশোধ করেছে?</label>
                    <select
                      value={bulkPaidBy}
                      onChange={(e) => setBulkPaidBy(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden font-bold text-slate-800"
                    >
                      <option value="Company Cash">কোম্পানি ক্যাশ (Company Cash)</option>
                      <option value="Owner/Party">মালিক / পার্টনারের পকেট থেকে (Owner Pocket)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">মালিক / পার্টির নাম</label>
                    <input
                      type="text"
                      value={bulkOwnerName}
                      onChange={(e) => setBulkOwnerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                {/* Rows Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">খরচের খাত</th>
                        <th className="py-2 px-3">বিবরণ (Description)</th>
                        <th className="py-2 px-3 text-right w-28">টাকার পরিমাণ</th>
                        <th className="py-2 px-2 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bulkRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <select
                              value={row.category}
                              onChange={(e) => {
                                const updated = [...bulkRows];
                                updated[idx].category = e.target.value;
                                setBulkRows(updated);
                              }}
                              className="w-full px-2 py-1 border border-slate-300 rounded-md"
                            >
                              {categories.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.description}
                              onChange={(e) => {
                                const updated = [...bulkRows];
                                updated[idx].description = e.target.value;
                                setBulkRows(updated);
                              }}
                              placeholder="বিবরণ"
                              className="w-full px-2 py-1 border border-slate-300 rounded-md"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="0"
                              value={row.amount || ''}
                              onChange={(e) => {
                                const updated = [...bulkRows];
                                updated[idx].amount = Number(e.target.value);
                                setBulkRows(updated);
                              }}
                              className="w-full px-2 py-1 border border-slate-300 rounded-md font-bold text-right text-red-600"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            {bulkRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setBulkRows(bulkRows.filter((_, i) => i !== idx))}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                ✕
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setBulkRows([
                      ...bulkRows,
                      { category: 'দোকান খরচ ও নাস্তা (Refreshment & Tea)', description: '', amount: 0, isOwnMoney: false },
                    ])
                  }
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ আরো একটি খরচের লাইন যোগ করুন</span>
                </button>

                <div className="flex justify-between items-center p-3 bg-slate-100 rounded-xl font-bold">
                  <span>সর্বমোট খরচের পরিমাণ:</span>
                  <span className="text-base text-red-600">
                    ৳{bulkRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-slate-900 hover:bg-black text-white rounded-lg font-bold shadow-xs"
                  >
                    সবগুলো খরচ একসাথে সেভ করুন
                  </button>
                </div>
              </form>
            ) : (
              /* Single Entry Form */
              <form onSubmit={handleSaveSingle} className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">খরচের খাত (Category) *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">টাকার পরিমাণ *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-red-500 rounded-lg outline-hidden font-bold text-red-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">তারিখ</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মেথড</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                    >
                      <option value="cash">কোম্পানি ক্যাশ (Cash)</option>
                      <option value="bank">কোম্পানি ব্যাংক (Bank)</option>
                      <option value="mobile_banking">মোবাইল ব্যাংকিং (bKash/Nagad)</option>
                      <option value="own_money">মালিকের ব্যক্তিগত টাকা (Own Money)</option>
                    </select>
                  </div>
                </div>

                {/* Custom Owner Money Checkbox */}
                <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isOwn"
                      checked={isOwnMoneyPaid || paymentMethod === 'own_money'}
                      onChange={(e) => setIsOwnMoneyPaid(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded-sm"
                    />
                    <label htmlFor="isOwn" className="font-bold text-indigo-900 cursor-pointer">
                      এই টাকা কোম্পানির ক্যাশ শেষ হওয়ায় মালিক/পার্টনার ব্যক্তিগত পকেট থেকে পরিশোধ করেছেন
                    </label>
                  </div>
                  {(isOwnMoneyPaid || paymentMethod === 'own_money') && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        মালিক বা সংশ্লিষ্ট পার্টির নাম:
                      </label>
                      <input
                        type="text"
                        value={ownerPartyName}
                        onChange={(e) => setOwnerPartyName(e.target.value)}
                        placeholder="যেমন: জনাব মোর্শেদ আলম (কোম্পানি ওনার)"
                        className="w-full px-3 py-1.5 bg-white border border-indigo-300 rounded-lg outline-hidden font-bold text-indigo-950"
                      />
                      <p className="text-[11px] text-indigo-700 mt-1">
                        এটি কোম্পানির ব্যক্তিগত দায় হিসেবে DUE BALANCE-এ জমা হবে।
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">খরচের বিস্তারিত বিবরণ (Description)</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="খরচের উদ্দেশ্য বা ভাউচার নোট..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-xs"
                  >
                    খরচ সেভ করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
