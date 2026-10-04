import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Supplier, PaymentRecord } from '../types';
import {
  Building2,
  Plus,
  Search,
  Download,
  Printer,
  Edit,
  Trash2,
  FileText,
  Phone,
  MapPin,
} from 'lucide-react';

export const SupplierModule: React.FC = () => {
  const {
    t,
    suppliers,
    purchases,
    payments,
    saveSupplier,
    deleteSupplier,
    savePayment,
    getSupplierBalance,
    setPrintData,
    exportToCSV,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Quick Pay Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false);
  const [paySupplier, setPaySupplier] = useState<Supplier | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'cash' | 'bank' | 'mobile_banking'>('bank');
  const [payNotes, setPayNotes] = useState<string>('');

  // Statement modal
  const [statementSupplier, setStatementSupplier] = useState<Supplier | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [creditLimit, setCreditLimit] = useState<number>(100000);
  const [notes, setNotes] = useState<string>('');

  const filteredSuppliers = suppliers.filter((s) => {
    if (s.deletedAt) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.phone.includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setOpeningBalance(0);
    setCreditLimit(100000);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setName(s.name);
    setPhone(s.phone);
    setEmail(s.email || '');
    setAddress(s.address);
    setOpeningBalance(s.openingBalance);
    setCreditLimit(s.creditLimit);
    setNotes(s.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('সাপ্লায়ারের নাম লিখুন');
      return;
    }

    const payload: Supplier = {
      id: editingSupplier ? editingSupplier.id : `SUPP-${Date.now().toString().slice(-4)}`,
      name,
      phone,
      email,
      address,
      openingBalance: Number(openingBalance),
      creditLimit: Number(creditLimit),
      notes,
      createdAt: editingSupplier ? editingSupplier.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    saveSupplier(payload);
    setIsModalOpen(false);
  };

  const handleOpenPayModal = (s: Supplier) => {
    const bal = getSupplierBalance(s.id);
    setPaySupplier(s);
    setPayAmount(Math.max(0, bal.currentPayable));
    setPayMethod('bank');
    setPayNotes('মহাজন পাওনা পরিশোধ');
    setIsPayModalOpen(true);
  };

  const handleSavePaymentOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paySupplier || payAmount <= 0) {
      showToast('সঠিক টাকার পরিমাণ লিখুন');
      return;
    }

    const paymentPayload: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      paymentNo: `PAY-OUT-${Date.now().toString().slice(-6)}`,
      type: 'out',
      partyType: 'supplier',
      partyId: paySupplier.id,
      partyName: paySupplier.name,
      amount: Number(payAmount),
      paymentMethod: payMethod,
      date: new Date().toISOString().slice(0, 10),
      notes: payNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    savePayment(paymentPayload);
    setIsPayModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Supplier ID', 'Name', 'Phone', 'Address', 'Total Purchase', 'Total Paid', 'Current Due Payable'];
    const rows = filteredSuppliers.map((s) => {
      const bal = getSupplierBalance(s.id);
      return [s.id, s.name, s.phone, s.address, bal.totalPurchases, bal.totalPaid, bal.currentPayable];
    });
    exportToCSV('Suppliers_Ledger_List', headers, rows);
  };

  const supplierLedgerEntries = React.useMemo(() => {
    if (!statementSupplier) return [];

    const entries: {
      date: string;
      description: string;
      refNo: string;
      billAmount: number;
      paidAmount: number;
    }[] = [];

    if (statementSupplier.openingBalance !== 0) {
      entries.push({
        date: statementSupplier.createdAt.slice(0, 10),
        description: 'ওপেনিং ব্যালেন্স (Opening Payable)',
        refNo: 'INIT',
        billAmount: statementSupplier.openingBalance,
        paidAmount: 0,
      });
    }

    purchases
      .filter((p) => !p.deletedAt && p.supplierId === statementSupplier.id && p.type === 'bill')
      .forEach((b) => {
        entries.push({
          date: b.date,
          description: `ক্রয় চালান বিল (${b.paymentMethod})`,
          refNo: b.billNo,
          billAmount: b.grandTotal,
          paidAmount: b.paidAmount,
        });
      });

    purchases
      .filter((p) => !p.deletedAt && p.supplierId === statementSupplier.id && p.type === 'return')
      .forEach((ret) => {
        entries.push({
          date: ret.date,
          description: `ক্রয় ফেরত (Purchase Return)`,
          refNo: ret.billNo,
          billAmount: 0,
          paidAmount: ret.grandTotal,
        });
      });

    payments
      .filter((p) => !p.deletedAt && p.type === 'out' && p.partyType === 'supplier' && p.partyId === statementSupplier.id)
      .forEach((pay) => {
        entries.push({
          date: pay.date,
          description: `সাপ্লায়ার পেমেন্ট পরিশোধ (${pay.paymentMethod}) - ${pay.notes || ''}`,
          refNo: pay.paymentNo,
          billAmount: 0,
          paidAmount: pay.amount,
        });
      });

    return entries.sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [statementSupplier, purchases, payments]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-600" />
            <span>সাপ্লায়ার ও মহাজন খাতা (Suppliers & Payables)</span>
          </h2>
          <p className="text-xs text-slate-500">
            পণ্য সরবরাহকারী, ক্রয় হিসাব, বিল পরিশোধ ও মহাজন লেজার
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
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addSupplier}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="সাপ্লায়ারের নাম বা ফোন খুঁজুন..."
          className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-orange-500"
        />
      </div>

      {/* Suppliers Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">সাপ্লায়ার নাম</th>
                <th className="py-3 px-3">যোগাযোগ</th>
                <th className="py-3 px-3 text-right">মোট ক্রয়</th>
                <th className="py-3 px-3 text-right">মোট পরিশোধ</th>
                <th className="py-3 px-3 text-right">মোট দেনা (Payable)</th>
                <th className="py-3 px-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    কোনো সাপ্লায়ার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supp) => {
                  const bal = getSupplierBalance(supp.id);

                  return (
                    <tr key={supp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{supp.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {supp.id}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{supp.phone}</span>
                        </div>
                        {supp.address && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{supp.address}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-800">
                        ৳{bal.totalPurchases.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-600">
                        ৳{bal.totalPaid.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className={`font-black text-sm ${bal.currentPayable > 0 ? 'text-orange-700' : 'text-slate-800'}`}>
                          ৳{bal.currentPayable.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenPayModal(supp)}
                            className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md font-bold text-[11px]"
                          >
                            পরিশোধ করুন
                          </button>
                          <button
                            onClick={() => setStatementSupplier(supp)}
                            title="View Statement"
                            className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-md"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(supp)}
                            title="Edit"
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-md"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(t.confirmDelete)) {
                                deleteSupplier(supp.id, true);
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingSupplier ? 'সাপ্লায়ার তথ্য সম্পাদনা' : 'নতুন সাপ্লায়ার নিবন্ধন'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">কোম্পানি / সাপ্লায়ারের নাম *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মেঘনা গ্রুপ বা স্কয়ার ডিস্ট্রিবিউশন"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ফোন নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ইমেইল</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="supplier@company.com"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ঠিকানা</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="অফিস বা ডিপো ঠিকানা"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">প্রারম্ভিক দেনা (Opening Due)</label>
                  <input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বাকির সীমা</label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold shadow-xs"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Statement Modal */}
      {statementSupplier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">মহাজন হিসাব বিবরণী (Supplier Ledger Statement)</h3>
                <p className="text-[11px] text-slate-400">{statementSupplier.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPrintData({
                      type: 'statement',
                      data: {
                        party: statementSupplier,
                        type: 'supplier',
                        entries: supplierLedgerEntries,
                        balance: getSupplierBalance(statementSupplier.id),
                      },
                    })
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট</span>
                </button>
                <button onClick={() => setStatementSupplier(null)} className="text-slate-400 hover:text-white font-bold">
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">মোট ক্রয়:</span>
                  <div className="text-base font-bold text-slate-900">
                    ৳{getSupplierBalance(statementSupplier.id).totalPurchases.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">মোট পরিশোধ:</span>
                  <div className="text-base font-bold text-emerald-600">
                    ৳{getSupplierBalance(statementSupplier.id).totalPaid.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">অবশিষ্ট দেনা:</span>
                  <div className="text-base font-black text-orange-700">
                    ৳{getSupplierBalance(statementSupplier.id).currentPayable.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">তারিখ</th>
                      <th className="py-2.5 px-3">রেফারেন্স নং</th>
                      <th className="py-2.5 px-3">বিবরণ</th>
                      <th className="py-2.5 px-3 text-right">বিল মূল্য (+)</th>
                      <th className="py-2.5 px-3 text-right">পরিশোধ (-)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {supplierLedgerEntries.map((e, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500">{e.date}</td>
                        <td className="py-2 px-3 font-mono font-semibold text-slate-700">{e.refNo}</td>
                        <td className="py-2 px-3 text-slate-800">{e.description}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                          {e.billAmount > 0 ? `৳${e.billAmount.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-600">
                          {e.paidAmount > 0 ? `৳${e.paidAmount.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {isPayModalOpen && paySupplier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-blue-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">সাপ্লায়ার বিল পরিশোধ (Payment Out)</h3>
                <p className="text-[11px] text-blue-200">{paySupplier.name}</p>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-blue-200 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePaymentOut} className="p-5 space-y-3 text-xs">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
                <span className="text-slate-600 text-[11px]">বর্তমান দেনা (Payable):</span>
                <div className="text-xl font-black text-orange-700">
                  ৳{getSupplierBalance(paySupplier.id).currentPayable.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">পরিশোধের টাকার পরিমাণ *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-blue-500 rounded-lg text-base font-black text-blue-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মেথড</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                >
                  <option value="bank">ব্যাংক (Bank)</option>
                  <option value="cash">নগদ ক্যাশ (Cash)</option>
                  <option value="mobile_banking">মোবাইল ব্যাংকিং (Mobile Banking)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">মন্তব্য</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  পরিশোধ সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
