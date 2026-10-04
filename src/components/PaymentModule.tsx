import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentRecord, PaymentMethod } from '../types';
import {
  ArrowLeftRight,
  Plus,
  Search,
  Download,
  Printer,
  Trash2,
  Edit,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';

export const PaymentModule: React.FC = () => {
  const {
    t,
    payments,
    savePayment,
    deletePayment,
    customers,
    suppliers,
    setPrintData,
    exportToCSV,
    showToast,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);

  // Form State
  const [type, setType] = useState<'in' | 'out'>('in');
  const [partyType, setPartyType] = useState<'customer' | 'supplier' | 'owner' | 'other'>('customer');
  const [partyId, setPartyId] = useState<string>('');
  const [partyName, setPartyName] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'mobile_banking'>('cash');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState<string>('');

  const filteredPayments = payments.filter((p) => {
    if (p.deletedAt) return false;
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.paymentNo.toLowerCase().includes(q) ||
        p.partyName.toLowerCase().includes(q) ||
        (p.referenceNo && p.referenceNo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenAdd = (newType: 'in' | 'out' = 'in') => {
    setEditingPayment(null);
    setType(newType);
    setPartyType(newType === 'in' ? 'customer' : 'supplier');
    const defaultCust = customers[0];
    const defaultSupp = suppliers[0];
    setPartyId(newType === 'in' ? defaultCust?.id || '' : defaultSupp?.id || '');
    setPartyName(newType === 'in' ? defaultCust?.name || '' : defaultSupp?.name || '');
    setAmount(0);
    setPaymentMethod('cash');
    setReferenceNo(`REF-${Math.floor(1000 + Math.random() * 9000)}`);
    setDate(new Date().toISOString().slice(0, 10));
    setNotes('');
    setIsModalOpen(true);
  };

  const handleEdit = (p: PaymentRecord) => {
    setEditingPayment(p);
    setType(p.type);
    setPartyType(p.partyType);
    setPartyId(p.partyId || '');
    setPartyName(p.partyName);
    setAmount(p.amount);
    setPaymentMethod(p.paymentMethod);
    setReferenceNo(p.referenceNo || '');
    setDate(p.date);
    setNotes(p.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      showToast('টাকার পরিমাণ লিখুন');
      return;
    }

    let finalPartyName = partyName;
    if (partyType === 'customer') {
      const c = customers.find((x) => x.id === partyId);
      if (c) finalPartyName = c.name;
    } else if (partyType === 'supplier') {
      const s = suppliers.find((x) => x.id === partyId);
      if (s) finalPartyName = s.name;
    }

    const payload: PaymentRecord = {
      id: editingPayment ? editingPayment.id : `PAY-${Date.now()}`,
      paymentNo: editingPayment
        ? editingPayment.paymentNo
        : `${type === 'in' ? 'REC' : 'VOU'}-${Date.now().toString().slice(-6)}`,
      type,
      partyType,
      partyId,
      partyName: finalPartyName,
      amount: Number(amount),
      paymentMethod,
      referenceNo,
      date,
      notes,
      createdAt: editingPayment ? editingPayment.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    savePayment(payload);
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Voucher No', 'Type', 'Party Type', 'Party Name', 'Amount', 'Method', 'Date', 'Reference'];
    const rows = filteredPayments.map((p) => [
      p.paymentNo,
      p.type.toUpperCase(),
      p.partyType,
      p.partyName,
      p.amount,
      p.paymentMethod,
      p.date,
      p.referenceNo || '',
    ]);
    exportToCSV('Payment_Transactions', headers, rows);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
            <span>পেমেন্ট লেনদেন খাতা (Payments In / Out)</span>
          </h2>
          <p className="text-xs text-slate-500">
            কাস্টমার কালেকশন রসিদ, সাপ্লায়ার বিল পরিশোধ ভাউচার ও মানি রিসিট
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
            onClick={() => handleOpenAdd('out')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>টাকা পরিশোধ (Payment Out)</span>
          </button>
          <button
            onClick={() => handleOpenAdd('in')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>টাকা গ্রহণ (Payment In)</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs font-medium">
          {[
            { id: 'all', label: 'সকল লেনদেন' },
            { id: 'in', label: 'টাকা গ্রহণ (Payment In)' },
            { id: 'out', label: 'টাকা পরিশোধ (Payment Out)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                filterType === tab.id ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="রসিদ নং বা পার্টির নাম খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">ভাউচার / রসিদ নং</th>
                <th className="py-3 px-3">তারিখ</th>
                <th className="py-3 px-3">ধরণ</th>
                <th className="py-3 px-3">পার্টি নাম</th>
                <th className="py-3 px-3">পেমেন্ট মেথড</th>
                <th className="py-3 px-3 text-right">টাকার পরিমাণ</th>
                <th className="py-3 px-3">রেফারেন্স / নোট</th>
                <th className="py-3 px-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    কোনো পেমেন্ট রেকর্ড নেই
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{p.paymentNo}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{p.date}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          p.type === 'in'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {p.type === 'in' ? 'কালেকশন (IN)' : 'পরিশোধ (OUT)'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{p.partyName}</td>
                    <td className="py-3 px-3 capitalize text-slate-600">
                      {p.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-sm">
                      <span className={p.type === 'in' ? 'text-emerald-700' : 'text-amber-700'}>
                        {p.type === 'in' ? '+' : '-'}৳{p.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                      {p.notes || p.referenceNo || '-'}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPrintData({ type: 'pos', data: p })}
                          title="Print Receipt"
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(p)}
                          title="Edit"
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-md"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(t.confirmDelete)) {
                              deletePayment(p.id, true);
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingPayment
                  ? 'পেমেন্ট ভাউচার সম্পাদনা'
                  : type === 'in'
                  ? 'টাকা গ্রহণ রসিদ তৈরি (Payment In)'
                  : 'টাকা পরিশোধ ভাউচার তৈরি (Payment Out)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">লেনদেনের ধরণ</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden font-bold"
                  >
                    <option value="in">টাকা গ্রহণ (Payment In)</option>
                    <option value="out">টাকা পরিশোধ (Payment Out)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {type === 'in' ? 'কাস্টমার নির্বাচন' : 'সাপ্লায়ার / পার্টি নির্বাচন'} *
                </label>
                {type === 'in' ? (
                  <select
                    value={partyId}
                    onChange={(e) => {
                      setPartyId(e.target.value);
                      const c = customers.find((x) => x.id === e.target.value);
                      if (c) setPartyName(c.name);
                    }}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  >
                    {customers
                      .filter((c) => !c.deletedAt)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone})
                        </option>
                      ))}
                  </select>
                ) : (
                  <select
                    value={partyId}
                    onChange={(e) => {
                      setPartyId(e.target.value);
                      const s = suppliers.find((x) => x.id === e.target.value);
                      if (s) setPartyName(s.name);
                    }}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  >
                    {suppliers
                      .filter((s) => !s.deletedAt)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.phone})
                        </option>
                      ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">টাকার পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-emerald-500 rounded-lg outline-hidden font-black text-emerald-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মেথড</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  >
                    <option value="cash">নগদ ক্যাশ (Cash)</option>
                    <option value="bank">ব্যাংক (Bank)</option>
                    <option value="mobile_banking">মোবাইল ব্যাংকিং (bKash/Nagad)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">নোট বা রেফারেন্স</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="চেক নম্বর বা লেনদেন বিবরণ"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs"
                >
                  ভাউচার নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
