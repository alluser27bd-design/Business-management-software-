import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Purchase, PurchaseItem, PurchaseType, PaymentMethod } from '../types';
import {
  Truck,
  Plus,
  Search,
  Download,
  Printer,
  Copy,
  Edit,
  Trash2,
  ArrowDownLeft,
  Barcode,
} from 'lucide-react';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { QuickAddProductModal } from './QuickAddProductModal';

export const PurchaseModule: React.FC = () => {
  const {
    t,
    purchases,
    savePurchase,
    deletePurchase,
    suppliers,
    products,
    getProductStock,
    getSupplierBalance,
    setPrintData,
    exportToCSV,
    showToast,
  } = useApp();

  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  // Form states
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('bill');
  const [supplierId, setSupplierId] = useState<string>('');
  const [billDate, setBillDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [billTime, setBillTime] = useState<string>(new Date().toTimeString().slice(0, 8));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [additionalCharge, setAdditionalCharge] = useState<number>(0);
  const [overallDiscount, setOverallDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [warehouse, setWarehouse] = useState<string>('Main Warehouse');

  // Barcode quick add input & scanner states
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState<boolean>(false);
  const [quickAddBarcode, setQuickAddBarcode] = useState<string>('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);

  const selectedSupplierBalance = supplierId ? getSupplierBalance(supplierId) : null;
  const previousPayable = selectedSupplierBalance ? selectedSupplierBalance.currentPayable : 0;

  const filteredPurchases = purchases.filter((pur) => {
    if (pur.deletedAt) return false;
    if (activeTypeFilter !== 'all' && pur.type !== activeTypeFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchNo = pur.billNo.toLowerCase().includes(q);
      const matchName = pur.supplierName.toLowerCase().includes(q);
      if (!matchNo && !matchName) return false;
    }
    return true;
  });

  const handleOpenNew = (type: PurchaseType = 'bill') => {
    setEditingPurchase(null);
    setPurchaseType(type);
    setSupplierId(suppliers[0]?.id || '');
    setBillDate(new Date().toISOString().slice(0, 10));
    setBillTime(new Date().toTimeString().slice(0, 8));
    setPaymentMethod('bank');
    setItems([]);
    setAdditionalCharge(0);
    setOverallDiscount(0);
    setPaidAmount(0);
    setNotes('');
    setWarehouse('Main Warehouse');
    setIsModalOpen(true);
  };

  const handleEdit = (pur: Purchase) => {
    setEditingPurchase(pur);
    setPurchaseType(pur.type);
    setSupplierId(pur.supplierId);
    setBillDate(pur.date);
    setBillTime(pur.time || '10:00:00');
    setPaymentMethod(pur.paymentMethod);
    setItems(pur.items);
    setAdditionalCharge(pur.additionalCharge || 0);
    setOverallDiscount(pur.discountAmount || 0);
    setPaidAmount(pur.paidAmount || 0);
    setNotes(pur.notes || '');
    setWarehouse(pur.warehouse || 'Main Warehouse');
    setIsModalOpen(true);
  };

  const handleDuplicate = (pur: Purchase) => {
    setEditingPurchase(null);
    setPurchaseType(pur.type);
    setSupplierId(pur.supplierId);
    setBillDate(new Date().toISOString().slice(0, 10));
    setBillTime(new Date().toTimeString().slice(0, 8));
    setPaymentMethod(pur.paymentMethod);
    setItems(pur.items.map((i) => ({ ...i })));
    setAdditionalCharge(pur.additionalCharge || 0);
    setOverallDiscount(pur.discountAmount || 0);
    setPaidAmount(0);
    setNotes(`Copied from ${pur.billNo}`);
    setWarehouse(pur.warehouse || 'Main Warehouse');
    setIsModalOpen(true);
    showToast('ক্রয় বিল কপি করা হয়েছে');
  };

  const handleAddItem = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const existingIndex = items.findIndex((it) => it.productId === productId);
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].qty += 1;
      updated[existingIndex].total = updated[existingIndex].qty * updated[existingIndex].rate;
      setItems(updated);
    } else {
      const newItem: PurchaseItem = {
        productId: prod.id,
        productName: prod.name,
        unit: prod.unit,
        qty: 1,
        rate: prod.purchasePrice,
        discount: 0,
        taxPercent: 0,
        total: prod.purchasePrice,
        batchNo: `B-${new Date().toISOString().slice(0, 7).replace('-', '')}`,
      };
      setItems([...items, newItem]);
    }
  };

  const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = barcodeInput.trim();
      if (!query) return;

      const prod = products.find(
        (p) =>
          !p.deletedAt &&
          (p.barcode === query ||
            p.sku.toLowerCase() === query.toLowerCase() ||
            p.id === query ||
            (p.barcode && p.barcode.includes(query)))
      );
      if (prod) {
        handleAddItem(prod.id);
        setBarcodeInput('');
        showToast(`${prod.name} ক্রয় চালানে যোগ করা হয়েছে`);
      } else {
        setQuickAddBarcode(query);
        setIsQuickAddOpen(true);
        setBarcodeInput('');
      }
    }
  };

  const handleUpdateItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    const subtotal = item.qty * item.rate;
    const discountAmount = (subtotal * (item.discount || 0)) / 100;
    const taxAmount = ((subtotal - discountAmount) * (item.taxPercent || 0)) / 100;
    item.total = Math.max(0, subtotal - discountAmount + taxAmount);
    updated[index] = item;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, it) => sum + it.qty * it.rate, 0);
  const grandTotal = Math.max(0, subtotal - overallDiscount + Number(additionalCharge));
  const newDue = Math.max(0, grandTotal - paidAmount);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('অনুগ্রহ করে অন্তত একটি পণ্য যোগ করুন');
      return;
    }

    const selectedSupp = suppliers.find((s) => s.id === supplierId);

    const purchasePayload: Purchase = {
      id: editingPurchase ? editingPurchase.id : `PUR-${Date.now()}`,
      billNo: editingPurchase
        ? editingPurchase.billNo
        : `BILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: purchaseType,
      supplierId,
      supplierName: selectedSupp ? selectedSupp.name : 'Unknown Supplier',
      date: billDate,
      time: billTime,
      items,
      subtotal,
      discountAmount: Number(overallDiscount),
      taxAmount: 0,
      additionalCharge: Number(additionalCharge),
      grandTotal,
      paidAmount: Number(paidAmount),
      dueAmount: newDue,
      paymentMethod,
      warehouse,
      notes,
      status: purchaseType === 'order' ? 'ordered' : purchaseType === 'return' ? 'returned' : 'received',
      createdAt: editingPurchase ? editingPurchase.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    savePurchase(purchasePayload);
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Bill No', 'Type', 'Supplier', 'Date', 'Grand Total', 'Paid', 'Due', 'Payment Method'];
    const rows = filteredPurchases.map((p) => [
      p.billNo,
      p.type.toUpperCase(),
      p.supplierName,
      p.date,
      p.grandTotal,
      p.paidAmount,
      p.dueAmount,
      p.paymentMethod,
    ]);
    exportToCSV('Purchase_Bills', headers, rows);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <span>ক্রয় ও বিল ব্যবস্থাপনা (Purchase & Bills)</span>
          </h2>
          <p className="text-xs text-slate-500">
            মহাজনদের কাছ থেকে পণ্য ক্রয়, বিল অনুমোদন, ক্রয় ফেরত ও স্টক ইন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.excel}</span>
          </button>
          <button
            onClick={() => handleOpenNew('return')}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-bold"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>ক্রয় ফেরত (Purchase Return)</span>
          </button>
          <button
            onClick={() => handleOpenNew('bill')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newPurchase}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs font-medium">
          {[
            { id: 'all', label: 'সবগুলো (All)' },
            { id: 'bill', label: 'ক্রয় বিল (Received)' },
            { id: 'order', label: 'পারচেজ অর্ডার (Order)' },
            { id: 'return', label: 'ক্রয় ফেরত (Return)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTypeFilter === tab.id
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
            placeholder="বিল নং বা সাপ্লায়ার খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-blue-500"
          />
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">বিল নং</th>
                <th className="py-3 px-3">তারিখ ও সময়</th>
                <th className="py-3 px-3">সাপ্লায়ার / মহাজন</th>
                <th className="py-3 px-3">ধরণ</th>
                <th className="py-3 px-3 text-right">মোট টাকা</th>
                <th className="py-3 px-3 text-right">পরিশোধ (Paid)</th>
                <th className="py-3 px-3 text-right">বাকি (Due)</th>
                <th className="py-3 px-3">পেমেন্ট মেথড</th>
                <th className="py-3 px-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    কোনো বিল পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((pur) => (
                  <tr key={pur.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800 font-mono">{pur.billNo}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {pur.date} <span className="text-[10px] text-slate-400">· {pur.time}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{pur.supplierName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-slate-600 uppercase">
                        {pur.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">
                      ৳{pur.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-emerald-600">
                      ৳{pur.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-orange-700">
                      {pur.dueAmount > 0 ? `৳${pur.dueAmount.toLocaleString()}` : 'পরিশোধিত'}
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-600">
                      {pur.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPrintData({ type: 'invoice', data: pur })}
                          title="Print / View Bill"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(pur)}
                          title="Copy / Duplicate"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(pur)}
                          title="Edit"
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-md"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(t.confirmDelete)) {
                              deletePurchase(pur.id, true);
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

      {/* Purchase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">
                  {editingPurchase ? `ক্রয় বিল সম্পাদনা (${editingPurchase.billNo})` : 'নতুন ক্রয় বিল এন্ট্রি (Purchase Bill)'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  বিল সেভ করার সাথে সাথে স্টক বৃদ্ধি ও সাপ্লায়ার লেজার অটোমেটিক আপডেট হবে
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-base font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বিলের ধরণ</label>
                  <select
                    value={purchaseType}
                    onChange={(e) => setPurchaseType(e.target.value as PurchaseType)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  >
                    <option value="bill">ক্রয় চালান (Received Bill)</option>
                    <option value="order">পারচেজ অর্ডার (Purchase Order)</option>
                    <option value="return">ক্রয় ফেরত (Purchase Return)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">সাপ্লায়ার / মহাজন</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  >
                    {suppliers
                      .filter((s) => !s.deletedAt)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.phone})
                        </option>
                      ))}
                  </select>
                  {supplierId && (
                    <div className="text-[10px] text-orange-700 font-semibold mt-0.5">
                      পূর্বের দেনা: ৳{previousPayable.toLocaleString()}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ওয়ারহাউস / গোডাউন</label>
                  <select
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  >
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Shop Floor">Shop Floor</option>
                    <option value="Godown 1">Godown 1</option>
                  </select>
                </div>
              </div>

              {/* Product Selector with Barcode Quick Scan */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex gap-1.5">
                  <div className="relative flex-1">
                    <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      onKeyDown={handleBarcodeScan}
                      placeholder="বারকোড স্ক্যান বা SKU লিখে এন্টার দিন..."
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-hidden focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBarcodeModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
                    title="ক্যামেরা দিয়ে বারকোড স্ক্যান করুন"
                  >
                    <Barcode className="w-4 h-4" />
                    <span className="hidden sm:inline">বারকোড স্ক্যান</span>
                  </button>
                </div>

                <div className="w-full sm:w-64">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddItem(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-hidden"
                  >
                    <option value="" disabled>
                      + তালিকা থেকে পণ্য নির্বাচন
                    </option>
                    {products
                      .filter((p) => !p.deletedAt)
                      .map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} (ক্রয়: ৳{prod.purchasePrice})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">পণ্য বিবরণ</th>
                      <th className="py-2 px-2 w-24">ব্যাচ নং</th>
                      <th className="py-2 px-2 w-20">পরিমাণ</th>
                      <th className="py-2 px-2 w-16">একক</th>
                      <th className="py-2 px-2 w-24">ক্রয় দর</th>
                      <th className="py-2 px-2 w-20">ছাড় %</th>
                      <th className="py-2 px-3 text-right w-28">মোট টাকা</th>
                      <th className="py-2 px-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-400">
                          কোনো পণ্য যোগ করা হয়নি
                        </td>
                      </tr>
                    ) : (
                      items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-800">{it.productName}</td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={it.batchNo || ''}
                              onChange={(e) => handleUpdateItem(idx, 'batchNo', e.target.value)}
                              className="w-full px-1.5 py-1 border border-slate-300 rounded-md text-xs font-mono"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              min="0.1"
                              step="any"
                              value={it.qty}
                              onChange={(e) => handleUpdateItem(idx, 'qty', Number(e.target.value))}
                              className="w-full px-1.5 py-1 border border-slate-300 rounded-md text-xs font-bold text-center"
                            />
                          </td>
                          <td className="py-2 px-2 text-slate-500 uppercase text-[11px]">{it.unit}</td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              min="0"
                              value={it.rate}
                              onChange={(e) => handleUpdateItem(idx, 'rate', Number(e.target.value))}
                              className="w-full px-1.5 py-1 border border-slate-300 rounded-md text-xs text-right font-semibold"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={it.discount}
                              onChange={(e) => handleUpdateItem(idx, 'discount', Number(e.target.value))}
                              className="w-full px-1.5 py-1 border border-slate-300 rounded-md text-xs text-center"
                            />
                          </td>
                          <td className="py-2 px-3 text-right font-black text-slate-800">
                            ৳{Math.round(it.total).toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মেথড</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden"
                    >
                      <option value="bank">ব্যাংক (Bank)</option>
                      <option value="cash">নগদ (Cash)</option>
                      <option value="mobile_banking">মোবাইল ব্যাংকিং (Mobile Banking)</option>
                      <option value="credit">সম্পূর্ণ বাকিতে (Credit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">মন্তব্য (Notes)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="মহাজন চালান রেফারেন্স বা অতিরিক্ত তথ্য..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">সাবটোটাল (Subtotal):</span>
                    <span className="font-bold text-slate-800">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">সাপ্লায়ার মোট ছাড় (Discount):</span>
                    <input
                      type="number"
                      min="0"
                      value={overallDiscount}
                      onChange={(e) => setOverallDiscount(Number(e.target.value))}
                      className="w-24 px-2 py-0.5 border border-slate-300 rounded-md text-right font-bold text-red-600 bg-white"
                    />
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">পরিবহন বা অতিরিক্ত চার্জ:</span>
                    <input
                      type="number"
                      min="0"
                      value={additionalCharge}
                      onChange={(e) => setAdditionalCharge(Number(e.target.value))}
                      className="w-24 px-2 py-0.5 border border-slate-300 rounded-md text-right font-semibold bg-white"
                    />
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-300 text-sm font-black text-slate-900">
                    <span>সর্বমোট বিল (Grand Total):</span>
                    <span className="text-blue-700">৳{grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-bold">পরিশোধ (Paid Amount):</span>
                    <input
                      type="number"
                      min="0"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      className="w-28 px-2 py-1 border border-blue-500 rounded-md text-right font-black text-blue-700 bg-white"
                    />
                  </div>
                  <div className="flex justify-between py-1 text-orange-800 font-bold">
                    <span>বর্তমান বকেয়া (Current Due):</span>
                    <span>৳{newDue.toLocaleString()}</span>
                  </div>
                  {supplierId && (
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-500 font-semibold text-[11px]">
                      <span>পূর্বের দেনাসহ মোট দেনা:</span>
                      <span className="text-orange-700 font-black">
                        ৳{(previousPayable + newDue).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/20"
                >
                  {t.save} ও স্টক যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal for Purchase */}
      <BarcodeScannerModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onProductScanned={(product) => {
          if (!isModalOpen) {
            setIsModalOpen(true);
          }
          handleAddItem(product.id);
        }}
        title="পারচেজ / ক্রয় বারকোড স্ক্যানার"
        subtitle="স্ক্যান করা পণ্যটি স্বয়ংক্রিয় শনাক্ত হয়ে ক্রয় চালানে যুক্ত হবে"
      />

      {/* Quick Add Product Modal when Barcode is New */}
      <QuickAddProductModal
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setQuickAddBarcode('');
        }}
        scannedBarcode={quickAddBarcode}
        onProductCreatedAndAdded={(newProd) => {
          if (!isModalOpen) {
            setIsModalOpen(true);
          }
          handleAddItem(newProd.id);
          setIsQuickAddOpen(false);
          setQuickAddBarcode('');
        }}
      />
    </div>
  );
};
