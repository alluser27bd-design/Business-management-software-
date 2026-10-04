import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';

export const RecycleBin: React.FC = () => {
  const {
    invoices,
    purchases,
    expenses,
    customers,
    suppliers,
    products,
    restoreInvoice,
    restorePurchase,
    restoreExpense,
    restoreCustomer,
    restoreSupplier,
    restoreProduct,
    deleteInvoice,
    deletePurchase,
    deleteExpense,
    deleteCustomer,
    deleteSupplier,
    deleteProduct,
    showToast,
  } = useApp();

  const [activeModule, setActiveModule] = useState<'all' | 'invoices' | 'purchases' | 'expenses' | 'customers' | 'suppliers' | 'products'>('all');

  const deletedItems: {
    id: string;
    title: string;
    module: string;
    moduleType: string;
    date: string;
    details: string;
    original: any;
  }[] = [];

  invoices
    .filter((i) => i.deletedAt)
    .forEach((i) => {
      deletedItems.push({
        id: i.id,
        title: `${i.invoiceNo} (${i.customerName})`,
        module: 'ইনভয়েস (Invoice)',
        moduleType: 'invoices',
        date: i.deletedAt || '',
        details: `মোট টাকা: ৳${i.grandTotal.toLocaleString()}`,
        original: i,
      });
    });

  purchases
    .filter((p) => p.deletedAt)
    .forEach((p) => {
      deletedItems.push({
        id: p.id,
        title: `${p.billNo} (${p.supplierName})`,
        module: 'ক্রয় বিল (Purchase)',
        moduleType: 'purchases',
        date: p.deletedAt || '',
        details: `মোট টাকা: ৳${p.grandTotal.toLocaleString()}`,
        original: p,
      });
    });

  expenses
    .filter((e) => e.deletedAt)
    .forEach((e) => {
      deletedItems.push({
        id: e.id,
        title: `${e.expenseNo} - ${e.category}`,
        module: 'খরচ (Expense)',
        moduleType: 'expenses',
        date: e.deletedAt || '',
        details: `টাকা: ৳${e.amount.toLocaleString()} (${e.paidBy})`,
        original: e,
      });
    });

  customers
    .filter((c) => c.deletedAt)
    .forEach((c) => {
      deletedItems.push({
        id: c.id,
        title: c.name,
        module: 'কাস্টমার (Customer)',
        moduleType: 'customers',
        date: c.deletedAt || '',
        details: `ফোন: ${c.phone}`,
        original: c,
      });
    });

  suppliers
    .filter((s) => s.deletedAt)
    .forEach((s) => {
      deletedItems.push({
        id: s.id,
        title: s.name,
        module: 'সাপ্লায়ার (Supplier)',
        moduleType: 'suppliers',
        date: s.deletedAt || '',
        details: `ফোন: ${s.phone}`,
        original: s,
      });
    });

  products
    .filter((p) => p.deletedAt)
    .forEach((p) => {
      deletedItems.push({
        id: p.id,
        title: p.name,
        module: 'পণ্য (Product)',
        moduleType: 'products',
        date: p.deletedAt || '',
        details: `SKU: ${p.sku}`,
        original: p,
      });
    });

  const filteredItems = deletedItems.filter((item) => {
    if (activeModule !== 'all' && item.moduleType !== activeModule) return false;
    return true;
  });

  const handleRestore = (item: (typeof deletedItems)[0]) => {
    if (item.moduleType === 'invoices') restoreInvoice(item.id);
    else if (item.moduleType === 'purchases') restorePurchase(item.id);
    else if (item.moduleType === 'expenses') restoreExpense(item.id);
    else if (item.moduleType === 'customers') restoreCustomer(item.id);
    else if (item.moduleType === 'suppliers') restoreSupplier(item.id);
    else if (item.moduleType === 'products') restoreProduct(item.id);
  };

  const handlePermanentDelete = (item: (typeof deletedItems)[0]) => {
    if (!window.confirm('আপনি কি এই রেকর্ডটি স্থায়ীভাবে ডাটাবেজ থেকে মুছে ফেলতে চান? এটি আর ফেরানো যাবে না!')) {
      return;
    }
    if (item.moduleType === 'invoices') deleteInvoice(item.id, false);
    else if (item.moduleType === 'purchases') deletePurchase(item.id, false);
    else if (item.moduleType === 'expenses') deleteExpense(item.id, false);
    else if (item.moduleType === 'customers') deleteCustomer(item.id, false);
    else if (item.moduleType === 'suppliers') deleteSupplier(item.id, false);
    else if (item.moduleType === 'products') deleteProduct(item.id, false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-600" />
            <span>রিসাইকেল বিন ও মুছে ফেলা রেকর্ড (Recycle Bin & Restore)</span>
          </h2>
          <p className="text-xs text-slate-500">
            এখানে মুছে ফেলা যেকোনো লেনদেন বা তথ্য দেখতে পারবেন এবং ১-ক্লিকে পুনরুদ্ধার করতে পারবেন। রিস্টোর করলে সকল হিসাব অটো রি-ক্যালকুলেট হবে।
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600">
          রিসাইকেল বিনে মোট: <span className="font-bold text-red-600">{deletedItems.length}টি রেকর্ড</span>
        </div>
      </div>

      {/* Module Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs font-semibold">
        {[
          { id: 'all', label: 'সকল রেকর্ড' },
          { id: 'invoices', label: 'ইনভয়েস' },
          { id: 'purchases', label: 'ক্রয় বিল' },
          { id: 'expenses', label: 'খরচ' },
          { id: 'customers', label: 'কাস্টমার' },
          { id: 'suppliers', label: 'সাপ্লায়ার' },
          { id: 'products', label: 'পণ্য' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveModule(m.id as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeModule === m.id ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">রেকর্ড শিরোনাম</th>
                <th className="py-3 px-3">মডিউল</th>
                <th className="py-3 px-3">মুছে ফেলার তারিখ ও সময়</th>
                <th className="py-3 px-3">বিবরণ / আর্থিক প্রভাব</th>
                <th className="py-3 px-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    রিসাইকেল বিন খালি! কোনো মুছে ফেলা তথ্য নেই।
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.title}</td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-slate-600">
                        {item.module}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono">
                      {item.date ? item.date.replace('T', ' ').slice(0, 19) : '-'}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{item.details}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleRestore(item)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md font-bold text-xs transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>পুনরুদ্ধার (Restore)</span>
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(item)}
                          className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-md font-bold text-xs transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>স্থায়ী ডিলিট</span>
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
    </div>
  );
};
