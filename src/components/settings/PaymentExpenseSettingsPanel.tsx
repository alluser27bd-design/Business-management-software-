import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethodItem, ExpenseCategoryItem, TaxDiscountSettings } from '../../types';
import { CreditCard, DollarSign, Percent, Plus, Trash2, Edit2, Check, RotateCcw, Wallet } from 'lucide-react';

export const PaymentExpenseSettingsPanel: React.FC = () => {
  const {
    paymentMethodsList,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    expenseCategoriesList,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    taxDiscountSettings,
    updateTaxDiscountSettings,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'payments' | 'expenses' | 'taxDiscount'>('payments');

  // Form states for adding payment method
  const [newPayName, setNewPayName] = useState('');
  const [newPayType, setNewPayType] = useState<PaymentMethodItem['type']>('bank');
  const [newPayAcc, setNewPayAcc] = useState('');
  const [newPayBank, setNewPayBank] = useState('');
  const [showAddPayModal, setShowAddPayModal] = useState(false);

  // Form states for adding expense category
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState<number>(5000);
  const [showAddCatModal, setShowAddCatModal] = useState(false);

  const handleCreatePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayName.trim()) return;
    addPaymentMethod({
      name: newPayName.trim(),
      type: newPayType,
      accountNumber: newPayAcc.trim() || undefined,
      bankName: newPayBank.trim() || undefined,
      enabled: true,
      isDefault: false,
      order: paymentMethodsList.length + 1,
    });
    setNewPayName('');
    setNewPayAcc('');
    setNewPayBank('');
    setShowAddPayModal(false);
  };

  const handleCreateExpenseCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addExpenseCategory({
      name: newCatName.trim(),
      budgetMonthly: Number(newCatBudget) || 0,
      enabled: true,
    });
    setNewCatName('');
    setNewCatBudget(5000);
    setShowAddCatModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>পেমেন্ট মাধ্যম, খরচ খাত ও ভ্যাট/ট্যাক্স সেটিংস (Payments & Financials)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ব্যাংক অ্যাকাউন্ট, মোবাইল ব্যাংকিং, খরচের ক্যাটাগরি এবং ভ্যাট ও ডিসকাউন্ট পলিসি পরিচালনা করুন
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1">
        {[
          { id: 'payments', label: `পেমেন্ট মেথডস (${paymentMethodsList.length})`, icon: Wallet },
          { id: 'expenses', label: `খরচের খাতসমূহ (${expenseCategoriesList.length})`, icon: DollarSign },
          { id: 'taxDiscount', label: 'ভ্যাট, ট্যাক্স ও ডিসকাউন্ট পলিসি', icon: Percent },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Payment Methods Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              বিক্রয় ও ক্রয়ে যেসব পেমেন্ট চ্যানেল সক্রিয় থাকবে সেগুলো নিচে তালিকাভুক্ত রয়েছে।
            </p>
            <button
              type="button"
              onClick={() => setShowAddPayModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন পেমেন্ট মাধ্যম যুক্ত করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethodsList.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  m.enabled ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 truncate">{m.name}</span>
                    {m.isDefault && (
                      <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  {m.accountNumber && (
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      হিসাব নং: {m.accountNumber}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 capitalize font-medium mt-0.5">
                    টাইপ: {m.type.replace('_', ' ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => updatePaymentMethod(m.id, { enabled: !m.enabled })}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      m.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {m.enabled ? 'ON' : 'OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={() => deletePaymentMethod(m.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Payment Modal */}
          {showAddPayModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
                <h4 className="text-sm font-black text-slate-900">নতুন পেমেন্ট মেথড তৈরি করুন</h4>
                <form onSubmit={handleCreatePaymentMethod} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">পদ্ধতির নাম (Name)</label>
                    <input
                      type="text"
                      required
                      value={newPayName}
                      onChange={(e) => setNewPayName(e.target.value)}
                      placeholder="যেমন: ডাচ-বাংলা ব্যাংক লিঃ"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">টাইপ (Type)</label>
                    <select
                      value={newPayType}
                      onChange={(e) => setNewPayType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      <option value="cash">নগদ ক্যাশ (Cash)</option>
                      <option value="bank">ব্যাংক একাউন্ট (Bank Account)</option>
                      <option value="mobile_banking">মোবাইল ব্যাংকিং (bKash/Nagad/Rocket)</option>
                      <option value="card">POS কার্ড (Card)</option>
                      <option value="other">অন্যান্য (Other)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">হিসাব নম্বর / ওয়ালেট নং</label>
                    <input
                      type="text"
                      value={newPayAcc}
                      onChange={(e) => setNewPayAcc(e.target.value)}
                      placeholder="যেমন: 01711-234567 বা AC-123456"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPayModal(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      যুক্ত করুন
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Expense Categories Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              দৈনিক ও মাসিক খরচ লিপিবদ্ধ করার জন্য ক্যাটাগরি এবং মাসিক বাজেট নির্ধারণ করুন।
            </p>
            <button
              type="button"
              onClick={() => setShowAddCatModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন খরচের খাত যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {expenseCategoriesList.map((cat) => (
              <div
                key={cat.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  cat.enabled ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{cat.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    মাসিক বাজেট: ৳{(cat.budgetMonthly || 0).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateExpenseCategory(cat.id, { enabled: !cat.enabled })}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      cat.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.enabled ? 'ON' : 'OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteExpenseCategory(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Category Modal */}
          {showAddCatModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
                <h4 className="text-sm font-black text-slate-900">নতুন খরচের খাত তৈরি করুন</h4>
                <form onSubmit={handleCreateExpenseCategory} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">খাতের নাম (Category Name)</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="যেমন: ইন্টারনেটের মাসিক বিল"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">মাসিক আনুমানিক বাজেট (৳)</label>
                    <input
                      type="number"
                      value={newCatBudget}
                      onChange={(e) => setNewCatBudget(Number(e.target.value))}
                      placeholder="5000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCatModal(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      যোগ করুন
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Tax & Discount Tab */}
      {activeTab === 'taxDiscount' && (
        <div className="space-y-4 bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
          <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-600" />
            <span>ভ্যাট / ট্যাক্স ও ডিসকাউন্ট পলিসি কনফিগারেশন (Tax & Discount Policy)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">ভ্যাট / ট্যাক্স কার্যকর (Enable Tax)</div>
                  <div className="text-[10px] text-slate-400">বিক্রয় ও চালানে স্বয়ংক্রিয় ভ্যাট হিসাব চালু রাখুন</div>
                </div>
                <input
                  type="checkbox"
                  checked={taxDiscountSettings.taxEnabled}
                  onChange={(e) => updateTaxDiscountSettings({ taxEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">ট্যাক্সের শিরোনাম (Tax Label)</label>
                <input
                  type="text"
                  value={taxDiscountSettings.taxName}
                  onChange={(e) => updateTaxDiscountSettings({ taxName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  placeholder="ভ্যাট (VAT / BIN)"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">ডিফল্ট ভ্যাট হার % (Default Rate)</label>
                <input
                  type="number"
                  value={taxDiscountSettings.defaultTaxRate}
                  onChange={(e) => updateTaxDiscountSettings({ defaultTaxRate: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  placeholder="5"
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">ডিসকাউন্ট সিস্টেম সক্রিয় (Discount)</div>
                  <div className="text-[10px] text-slate-400">বিক্রয় ও POS-এ আইটেম বা ইনভয়েস ডিসকাউন্ট অনুমোদন</div>
                </div>
                <input
                  type="checkbox"
                  checked={taxDiscountSettings.discountEnabled}
                  onChange={(e) => updateTaxDiscountSettings({ discountEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">ডিফল্ট ডিসকাউন্ট টাইপ</label>
                <select
                  value={taxDiscountSettings.defaultDiscountType}
                  onChange={(e) => updateTaxDiscountSettings({ defaultDiscountType: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  <option value="fixed">ফিক্সড টাকা (Fixed Amount ৳)</option>
                  <option value="percentage">শতকরা হার (Percentage %)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">সর্বোচ্চ অনুমোদিত ডিসকাউন্ট %</label>
                <input
                  type="number"
                  value={taxDiscountSettings.maxDiscountPercent}
                  onChange={(e) => updateTaxDiscountSettings({ maxDiscountPercent: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  placeholder="25"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
