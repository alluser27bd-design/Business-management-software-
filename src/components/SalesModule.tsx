import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Invoice, InvoiceItem, InvoiceType, PaymentMethod } from '../types';
import {
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Copy,
  Edit,
  Trash2,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Barcode,
  ArrowDownLeft,
  Edit2,
} from 'lucide-react';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { QuickAddProductModal } from './QuickAddProductModal';

export const SalesModule: React.FC = () => {
  const {
    t,
    invoices,
    saveInvoice,
    deleteInvoice,
    customers,
    products,
    getProductStock,
    getCustomerBalance,
    setPrintData,
    exportToCSV,
    showToast,
  } = useApp();

  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Form State
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('sale');
  const [customerId, setCustomerId] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [invoiceTime, setInvoiceTime] = useState<string>(new Date().toTimeString().slice(0, 8));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [additionalCharge, setAdditionalCharge] = useState<number>(0);
  const [overallDiscount, setOverallDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [warehouse, setWarehouse] = useState<string>('Main Warehouse');

  // Barcode quick add input
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState<boolean>(false);
  const [quickAddBarcode, setQuickAddBarcode] = useState<string>('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);

  // Selected customer previous due
  const customerBalance = customerId ? getCustomerBalance(customerId) : null;
  const previousDue = customerBalance ? customerBalance.currentDue : 0;

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (inv.deletedAt) return false;
    if (activeTypeFilter !== 'all' && inv.type !== activeTypeFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchNo = inv.invoiceNo.toLowerCase().includes(q);
      const matchName = inv.customerName.toLowerCase().includes(q);
      if (!matchNo && !matchName) return false;
    }
    return true;
  });

  const handleOpenNewModal = (type: InvoiceType = 'sale') => {
    setEditingInvoice(null);
    setInvoiceType(type);
    const dateStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toTimeString().slice(0, 8);
    setInvoiceDate(dateStr);
    setInvoiceTime(timeStr);
    setCustomerId(customers[0]?.id || '');
    setPaymentMethod('cash');
    setItems([]);
    setAdditionalCharge(0);
    setOverallDiscount(0);
    setPaidAmount(0);
    setNotes('');
    setWarehouse('Main Warehouse');
    setIsModalOpen(true);
  };

  const handleEdit = (inv: Invoice) => {
    setEditingInvoice(inv);
    setInvoiceType(inv.type);
    setCustomerId(inv.customerId);
    setInvoiceDate(inv.date);
    setInvoiceTime(inv.time || '12:00:00');
    setPaymentMethod(inv.paymentMethod);
    setItems(inv.items);
    setAdditionalCharge(inv.additionalCharge || 0);
    setOverallDiscount(inv.discountAmount || 0);
    setPaidAmount(inv.paidAmount || 0);
    setNotes(inv.notes || '');
    setWarehouse(inv.warehouse || 'Main Warehouse');
    setIsModalOpen(true);
  };

  const handleDuplicate = (inv: Invoice) => {
    setEditingInvoice(null);
    setInvoiceType(inv.type);
    setCustomerId(inv.customerId);
    setInvoiceDate(new Date().toISOString().slice(0, 10));
    setInvoiceTime(new Date().toTimeString().slice(0, 8));
    setPaymentMethod(inv.paymentMethod);
    setItems(inv.items.map((i) => ({ ...i })));
    setAdditionalCharge(inv.additionalCharge || 0);
    setOverallDiscount(inv.discountAmount || 0);
    setPaidAmount(0);
    setNotes(`Copied from ${inv.invoiceNo}`);
    setWarehouse(inv.warehouse || 'Main Warehouse');
    setIsModalOpen(true);
    showToast('ইনভয়েস কপি করা হয়েছে। তথ্য যাচাই করে সংরক্ষণ করুন।');
  };

  // Add Item to Invoice
  const handleAddItem = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const existingIndex = items.findIndex((it) => it.productId === productId);
    if (existingIndex >= 0) {
      const updated = [...items];
      const newQty = updated[existingIndex].qty + 1;
      const subtotal = newQty * updated[existingIndex].rate;
      const discountAmount = (subtotal * (updated[existingIndex].discount || 0)) / 100;
      const taxAmount = ((subtotal - discountAmount) * (updated[existingIndex].taxPercent || 0)) / 100;
      updated[existingIndex].qty = newQty;
      updated[existingIndex].total = Math.max(0, subtotal - discountAmount + taxAmount);
      setItems(updated);
      showToast(`'${prod.name}' পরিমাণ বৃদ্ধি: ${newQty}`);
    } else {
      const newItem: InvoiceItem = {
        productId: prod.id,
        productName: prod.name,
        barcode: prod.barcode,
        unit: prod.unit,
        qty: 1,
        rate: prod.salePrice,
        discount: 0,
        taxPercent: prod.taxPercent || 0,
        total: prod.salePrice,
        purchaseCost: prod.purchasePrice,
      };
      setItems([...items, newItem]);
      showToast(`'${prod.name}' যুক্ত হয়েছে`);
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
      } else {
        setQuickAddBarcode(query);
        setIsQuickAddOpen(true);
        setBarcodeInput('');
      }
    }
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
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

  // Calculations
  const subtotal = items.reduce((sum, it) => sum + it.qty * it.rate, 0);
  const itemTaxTotal = items.reduce((sum, it) => sum + ((it.qty * it.rate * (it.taxPercent || 0)) / 100), 0);
  const grandTotal = Math.max(0, subtotal - overallDiscount + itemTaxTotal + Number(additionalCharge));
  const newDue = Math.max(0, grandTotal - paidAmount);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('অনুগ্রহ করে অন্তত একটি পণ্য যোগ করুন');
      return;
    }

    const selectedCust = customers.find((c) => c.id === customerId);

    const invoicePayload: Invoice = {
      id: editingInvoice ? editingInvoice.id : `INV-${Date.now()}`,
      invoiceNo: editingInvoice ? editingInvoice.invoiceNo : `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: invoiceType,
      customerId: customerId,
      customerName: selectedCust ? selectedCust.name : 'Walking Customer (খুচরা ক্রেতা)',
      customerPhone: selectedCust?.phone,
      date: invoiceDate,
      time: invoiceTime,
      items,
      subtotal,
      discountAmount: Number(overallDiscount),
      taxAmount: itemTaxTotal,
      additionalCharge: Number(additionalCharge),
      grandTotal,
      paidAmount: Number(paidAmount),
      dueAmount: newDue,
      paymentMethod,
      warehouse,
      notes,
      status: 'completed',
      createdAt: editingInvoice ? editingInvoice.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    saveInvoice(invoicePayload);
    setIsModalOpen(false);
  };

  const handleExportExcel = () => {
    const headers = ['Invoice No', 'Type', 'Customer', 'Date', 'Grand Total', 'Paid', 'Due', 'Payment Method'];
    const rows = filteredInvoices.map((i) => [
      i.invoiceNo,
      i.type.toUpperCase(),
      i.customerName,
      i.date,
      i.grandTotal,
      i.paidAmount,
      i.dueAmount,
      i.paymentMethod,
    ]);
    exportToCSV('Sales_Invoices', headers, rows);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>বিক্রয় ও ইনভয়েস তালিকা (Sales & Invoices)</span>
          </h2>
          <p className="text-xs text-slate-500">
            নগদ ও বাকিতে বিক্রয়, সেলস রিটার্ন, কোটেশন, চালান তৈরি ও ব্যবস্থাপনা
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.excel}</span>
          </button>
          <button
            onClick={() => handleOpenNewModal('return')}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-bold transition-colors"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>সেলস রিটার্ন</span>
          </button>
          <button
            onClick={() => handleOpenNewModal('sale')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newSale}</span>
          </button>
        </div>
      </div>

      {/* Type Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Segmented Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs font-medium">
          {[
            { id: 'all', label: 'সবগুলো (All)' },
            { id: 'sale', label: 'নিয়মিত বিক্রয়' },
            { id: 'pos', label: 'POS বিক্রয়' },
            { id: 'quotation', label: 'কোটেশন / এস্টিমেট' },
            { id: 'return', label: 'বিক্রয় ফেরত (Return)' },
            { id: 'challan', label: 'ডেলিভারি চালান' },
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

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ইনভয়েস নং বা কাস্টমার খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">ইনভয়েস নং</th>
                <th className="py-3 px-3">তারিখ ও সময়</th>
                <th className="py-3 px-3">কাস্টমার / পার্টি</th>
                <th className="py-3 px-3">ধরণ</th>
                <th className="py-3 px-3 text-right">মোট টাকা</th>
                <th className="py-3 px-3 text-right">জমা (Paid)</th>
                <th className="py-3 px-3 text-right">বকেয়া (Due)</th>
                <th className="py-3 px-3">পেমেন্ট মেথড</th>
                <th className="py-3 px-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    কোনো ইনভয়েস পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800 font-mono">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {inv.date} <span className="text-[10px] text-slate-400">· {inv.time}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{inv.customerName}</div>
                      {inv.customerPhone && <div className="text-[11px] text-slate-400">{inv.customerPhone}</div>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        {inv.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">
                      ৳{inv.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-emerald-600">
                      ৳{inv.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-amber-700">
                      {inv.dueAmount > 0 ? `৳${inv.dueAmount.toLocaleString()}` : 'পরিশোধিত'}
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-600">
                      {inv.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPrintData({ type: 'invoice', data: inv })}
                          title="Print / View Invoice"
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(inv)}
                          title="Copy / Duplicate"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(inv)}
                          title="Edit"
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(t.confirmDelete)) {
                              deleteInvoice(inv.id, true);
                            }
                          }}
                          title="Delete (Send to Recycle Bin)"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

      {/* Invoice Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">
                  {editingInvoice ? `ইনভয়েস সম্পাদনা (${editingInvoice.invoiceNo})` : 'নতুন বিক্রয় ইনভয়েস তৈরি'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  ইনভয়েস সেভ করার পর স্টক ও কাস্টমার লেজার অটোমেটিক রিক্যালকুলেট হবে
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Top Row: Type, Customer, Date, Time */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ইনভয়েসের ধরণ</label>
                  <select
                    value={invoiceType}
                    onChange={(e) => setInvoiceType(e.target.value as InvoiceType)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  >
                    <option value="sale">নিয়মিত বিক্রয় (Sale)</option>
                    <option value="pos">POS বিক্রয়</option>
                    <option value="quotation">কোটেশন / এস্টিমেট</option>
                    <option value="return">বিক্রয় ফেরত (Return)</option>
                    <option value="challan">ডেলিভারি চালান</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">কাস্টমার নির্বাচন</label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  >
                    <option value="">-- খুচরা ক্রেতা (Walking Customer) --</option>
                    {customers
                      .filter((c) => !c.deletedAt)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone})
                        </option>
                      ))}
                  </select>
                  {customerId && (
                    <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                      পূর্বের বকেয়া: ৳{previousDue.toLocaleString()}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
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

              {/* Barcode Quick Input + QR Scanner + Product Selector */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative flex-1 w-full flex items-center gap-2">
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
                      + তালিকা থেকে পণ্য যোগ করুন
                    </option>
                    {products
                      .filter((p) => !p.deletedAt)
                      .map((prod) => {
                        const stock = getProductStock(prod.id);
                        return (
                          <option key={prod.id} value={prod.id}>
                            {prod.name} (মজুদ: {stock.currentStock} {prod.unit}) - ৳{prod.salePrice}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">পণ্য বিবরণ</th>
                      <th className="py-2 px-2 w-20">পরিমাণ</th>
                      <th className="py-2 px-2 w-16">একক</th>
                      <th className="py-2 px-2 w-24">দর (Rate)</th>
                      <th className="py-2 px-2 w-20">ছাড় %</th>
                      <th className="py-2 px-2 w-16">ভ্যাট %</th>
                      <th className="py-2 px-3 text-right w-28">মোট টাকা</th>
                      <th className="py-2 px-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-400">
                          কোনো পণ্য যোগ করা হয়নি। উপরের বারকোড স্ক্যানার বা ড্রপডাউন ব্যবহার করুন।
                        </td>
                      </tr>
                    ) : (
                      items.map((it, idx) => {
                        const prod = products.find((p) => p.id === it.productId);
                        return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              {prod?.photo && (
                                <img
                                  src={prod.photo}
                                  alt={it.productName}
                                  className="w-7 h-7 rounded-md object-cover border border-slate-200 shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <input
                                  type="text"
                                  value={it.productName}
                                  onChange={(e) => handleUpdateItem(idx, 'productName', e.target.value)}
                                  className="w-full font-semibold text-slate-800 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded px-1 text-xs outline-hidden"
                                />
                                <div className="text-[10px] text-slate-400 font-mono pl-1">{it.barcode}</div>
                              </div>
                            </div>
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
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              min="0"
                              value={it.taxPercent}
                              onChange={(e) => handleUpdateItem(idx, 'taxPercent', Number(e.target.value))}
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
                              className="text-red-500 hover:text-red-700 p-1 rounded-md"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Bottom Calculation Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                {/* Left: Notes & Method */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মেথড</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden"
                    >
                      <option value="cash">নগদ (Cash)</option>
                      <option value="bank">ব্যাংক ট্রান্সফার / চেক (Bank)</option>
                      <option value="mobile_banking">মোবাইল ব্যাংকিং (bKash/Nagad/Rocket)</option>
                      <option value="credit">সম্পূর্ণ বাকিতে (Credit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">মন্তব্য / শর্তাবলী (Notes)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="কোনো বিশেষ ডেলিভারি নোট বা শর্ত..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                {/* Right: Calculations */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">সাবটোটাল (Subtotal):</span>
                    <span className="font-bold text-slate-800">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">বিশেষ মোট ছাড় (Flat Discount):</span>
                    <input
                      type="number"
                      min="0"
                      value={overallDiscount}
                      onChange={(e) => setOverallDiscount(Number(e.target.value))}
                      className="w-24 px-2 py-0.5 border border-slate-300 rounded-md text-right font-bold text-red-600 bg-white"
                    />
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">অতিরিক্ত চার্জ / পরিবহন (Addl Charge):</span>
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
                    <span className="text-emerald-700">৳{grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-bold">জমা প্রদান (Paid Amount):</span>
                    <input
                      type="number"
                      min="0"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      className="w-28 px-2 py-1 border border-emerald-500 rounded-md text-right font-black text-emerald-700 bg-white"
                    />
                  </div>
                  <div className="flex justify-between py-1 text-amber-800 font-bold">
                    <span>বর্তমান বকেয়া (Current Due):</span>
                    <span>৳{newDue.toLocaleString()}</span>
                  </div>
                  {customerId && (
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-500 font-semibold text-[11px]">
                      <span>পূর্বের বকেয়াসহ মোট পাওনা:</span>
                      <span className="text-red-700 font-black">
                        ৳{(previousDue + newDue).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
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
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20"
                >
                  {t.save} ও রিক্যালকুলেট
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Live Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onProductScanned={(product) => {
          if (!isModalOpen) {
            setIsModalOpen(true);
          }
          handleAddItem(product.id);
        }}
        title="সেলস / রিটার্ন বারকোড স্ক্যানার"
        subtitle="স্ক্যান করা পণ্যটি স্বয়ংক্রিয় শনাক্ত হয়ে সরাসরি ইনভয়েস তালিকায় যুক্ত হবে"
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
