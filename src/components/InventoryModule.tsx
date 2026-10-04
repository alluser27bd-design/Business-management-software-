import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StockAdjustment, StockMovementType } from '../types';
import {
  Boxes,
  Plus,
  ArrowRightLeft,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Download,
  Filter,
  FileSpreadsheet,
} from 'lucide-react';

export const InventoryModule: React.FC = () => {
  const {
    t,
    products,
    stockAdjustments,
    saveStockAdjustment,
    getProductStock,
    exportToCSV,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'adjustments' | 'batch_expiry' | 'valuation'>('overview');
  const [isAdjModalOpen, setIsAdjModalOpen] = useState<boolean>(false);

  // Adjustment Form State
  const [adjProductId, setAdjProductId] = useState<string>('');
  const [adjType, setAdjType] = useState<StockMovementType>('in');
  const [adjQty, setAdjQty] = useState<number>(1);
  const [fromWarehouse, setFromWarehouse] = useState<string>('Main Warehouse');
  const [toWarehouse, setToWarehouse] = useState<string>('Shop Floor');
  const [adjReason, setAdjReason] = useState<string>('');
  const [adjDate, setAdjDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const handleOpenAdjustment = () => {
    setAdjProductId(products[0]?.id || '');
    setAdjType('in');
    setAdjQty(1);
    setFromWarehouse('Main Warehouse');
    setToWarehouse('Shop Floor');
    setAdjReason('দৈনিক স্টক ব্যালেন্স সংশোধন');
    setAdjDate(new Date().toISOString().slice(0, 10));
    setIsAdjModalOpen(true);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === adjProductId);
    if (!prod || adjQty <= 0) {
      showToast('অনুগ্রহ করে সঠিক পণ্য ও পরিমাণ দিন');
      return;
    }

    const payload: StockAdjustment = {
      id: `ADJ-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      type: adjType,
      qty: Number(adjQty),
      unit: prod.unit,
      fromWarehouse: adjType === 'transfer' ? fromWarehouse : undefined,
      toWarehouse: adjType === 'transfer' ? toWarehouse : undefined,
      reason: adjReason,
      costImpact: Number(adjQty) * prod.purchasePrice,
      date: adjDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    saveStockAdjustment(payload);
    setIsAdjModalOpen(false);
  };

  const handleExportStockCSV = () => {
    const headers = ['SKU', 'Product Name', 'Opening Stock', 'Stock IN', 'Stock OUT', 'Current Stock', 'Unit Cost', 'Stock Valuation'];
    const rows = products
      .filter((p) => !p.deletedAt)
      .map((p) => {
        const s = getProductStock(p.id);
        const val = s.currentStock * p.purchasePrice;
        return [p.sku, p.name, s.openingStock, s.stockIn, s.stockOut, s.currentStock, p.purchasePrice, val];
      });
    exportToCSV('Stock_Valuation_Ledger', headers, rows);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-teal-600" />
            <span>ইনভেন্টরি ও স্টক নিয়ন্ত্রণ (Inventory & Stock Control)</span>
          </h2>
          <p className="text-xs text-slate-500">
            স্টক ইন-আউট ব্যালেন্স, গোডাউন ট্রান্সফার, নষ্ট ও মেয়াদোত্তীর্ণ পণ্য ট্র্যাকিং
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportStockCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.excel}</span>
          </button>
          <button
            onClick={handleOpenAdjustment}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.stockAdjustment}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs font-medium">
        {[
          { id: 'overview', label: 'স্টক লেজার (Current Stock Ledger)' },
          { id: 'adjustments', label: 'সমন্বয় ও ট্রান্সফার হিস্টোরি' },
          { id: 'batch_expiry', label: 'ব্যাচ ও মেয়াদ ট্র্যাকিং (Expiry)' },
          { id: 'valuation', label: 'স্টক ভ্যালুয়েশন রিপোর্ট' },
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

      {/* Tab 1: Current Stock Ledger */}
      {activeTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-3">পণ্য বিবরণ</th>
                  <th className="py-3 px-3 text-center">ওপেনিং স্টক</th>
                  <th className="py-3 px-3 text-center text-blue-600">মোট স্টক IN (+)</th>
                  <th className="py-3 px-3 text-center text-red-600">মোট স্টক OUT (-)</th>
                  <th className="py-3 px-3 text-center">বর্তমান স্টক</th>
                  <th className="py-3 px-3 text-right">ক্রয় দর</th>
                  <th className="py-3 px-3 text-right">স্টক মূল্য (Valuation)</th>
                  <th className="py-3 px-3 text-center">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products
                  .filter((p) => !p.deletedAt)
                  .map((prod) => {
                    const s = getProductStock(prod.id);
                    const val = Math.max(0, s.currentStock) * prod.purchasePrice;
                    const isLow = s.currentStock <= prod.minStock && s.currentStock > 0;
                    const isOut = s.currentStock <= 0;

                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{prod.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {prod.sku} · {prod.warehouse}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-medium text-slate-600">
                          {s.openingStock} {prod.unit}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-blue-700">
                          +{s.stockIn}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-red-700">
                          -{s.stockOut}
                        </td>
                        <td className="py-3 px-3 text-center font-black text-sm">
                          <span className={isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-900'}>
                            {s.currentStock} {prod.unit}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600">
                          ৳{prod.purchasePrice}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-slate-900">
                          ৳{val.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`text-[10px] font-bold ${
                              isOut
                                ? 'text-red-600'
                                : isLow
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            {isOut ? 'স্টক শেষ' : isLow ? 'কম স্টক' : 'পর্যাপ্ত'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Adjustments & Transfers */}
      {activeTab === 'adjustments' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-3">তারিখ</th>
                  <th className="py-3 px-3">পণ্য নাম</th>
                  <th className="py-3 px-3">ধরণ (Adjustment Type)</th>
                  <th className="py-3 px-3 text-center">পরিমাণ</th>
                  <th className="py-3 px-3">কারণ / গোডাউন</th>
                  <th className="py-3 px-3 text-right">আর্থিক প্রভাব (Cost)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockAdjustments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      কোনো স্টক সমন্বয় রেকর্ড নেই
                    </td>
                  </tr>
                ) : (
                  stockAdjustments.map((adj) => (
                    <tr key={adj.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 text-slate-500">{adj.date}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{adj.productName}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold uppercase text-[10px] text-slate-700">
                          {adj.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {adj.qty} {adj.unit}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {adj.reason}
                        {adj.fromWarehouse && ` (${adj.fromWarehouse} → ${adj.toWarehouse})`}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-slate-800">
                        ৳{adj.costImpact.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Batch & Expiry */}
      {activeTab === 'batch_expiry' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-3 border-b border-slate-100 bg-amber-50/50 flex items-center gap-2 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>মেয়াদোত্তীর্ণ পণ্য অটো ট্র্যাক করা হয় এবং সতর্কবার্তা প্রদান করা হয়।</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">পণ্য নাম</th>
                <th className="py-3 px-3 font-mono">ব্যাচ নম্বর</th>
                <th className="py-3 px-3">মেয়াদ উত্তীর্ণের তারিখ</th>
                <th className="py-3 px-3 text-center">বর্তমান মজুদ</th>
                <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products
                .filter((p) => p.batchNo || p.expDate)
                .map((p) => {
                  const s = getProductStock(p.id);
                  const isExpired = p.expDate && new Date(p.expDate) < new Date();

                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-800">{p.name}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{p.batchNo || 'N/A'}</td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{p.expDate || 'N/A'}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {s.currentStock} {p.unit}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold ${
                            isExpired
                              ? 'text-red-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {isExpired ? 'মেয়াদোত্তীর্ণ (Expired)' : 'মেয়াদ ঠিক আছে (Valid)'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Stock Valuation Summary */}
      {activeTab === 'valuation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold">মোট মজুদ পণ্যের মূল্য (Purchase Cost Value):</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ৳
              {products
                .reduce((sum, p) => sum + Math.max(0, getProductStock(p.id).currentStock) * p.purchasePrice, 0)
                .toLocaleString()}
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold">মোট সম্ভাব্য বিক্রয় মূল্য (Retail Market Value):</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              ৳
              {products
                .reduce((sum, p) => sum + Math.max(0, getProductStock(p.id).currentStock) * p.salePrice, 0)
                .toLocaleString()}
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold">স্টকে সম্ভাব্য মোট মোট মুনাফা:</span>
            <div className="text-2xl font-black text-blue-700 mt-1">
              ৳
              {products
                .reduce(
                  (sum, p) =>
                    sum + Math.max(0, getProductStock(p.id).currentStock) * (p.salePrice - p.purchasePrice),
                  0
                )
                .toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Adjustment Modal */}
      {isAdjModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">স্টক সমন্বয় ও গোডাউন স্থানান্তর</h3>
              <button onClick={() => setIsAdjModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">পণ্য নির্বাচন *</label>
                <select
                  value={adjProductId}
                  onChange={(e) => setAdjProductId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                >
                  {products
                    .filter((p) => !p.deletedAt)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (বর্তমান মজুদ: {getProductStock(p.id).currentStock} {p.unit})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">সমন্বয়ের ধরণ *</label>
                  <select
                    value={adjType}
                    onChange={(e) => setAdjType(e.target.value as StockMovementType)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-bold"
                  >
                    <option value="in">স্টক বৃদ্ধি (Stock IN)</option>
                    <option value="out">স্টক হ্রাস (Stock OUT)</option>
                    <option value="damage">নষ্ট বা ড্যামেজ (Damage OUT)</option>
                    <option value="expired">মেয়াদোত্তীর্ণ স্টক (Expired OUT)</option>
                    <option value="transfer">গোডাউন ট্রান্সফার (Transfer)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পরিমাণ *</label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={adjQty}
                    onChange={(e) => setAdjQty(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-bold text-center"
                  />
                </div>
              </div>

              {adjType === 'transfer' && (
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">কোন গোডাউন থেকে:</label>
                    <select
                      value={fromWarehouse}
                      onChange={(e) => setFromWarehouse(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md"
                    >
                      <option value="Main Warehouse">Main Warehouse</option>
                      <option value="Shop Floor">Shop Floor</option>
                      <option value="Godown 1">Godown 1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">কোন গোডাউনে:</label>
                    <select
                      value={toWarehouse}
                      onChange={(e) => setToWarehouse(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md"
                    >
                      <option value="Shop Floor">Shop Floor</option>
                      <option value="Main Warehouse">Main Warehouse</option>
                      <option value="Godown 1">Godown 1</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">কারণ বা মন্তব্য *</label>
                <input
                  type="text"
                  required
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="যেমন: ফিজিক্যাল গণনা সংশোধন বা পরিবহনে ক্ষয়ক্ষতি"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdjModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-xs"
                >
                  স্টক সমন্বয় নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
