import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FieldVisibilityConfig, SkuBarcodeSettings } from '../../types';
import {
  Package,
  Users,
  Building2,
  Receipt,
  Truck,
  DollarSign,
  Barcode,
  Check,
  RotateCcw,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const ModuleFieldsControlPanel: React.FC = () => {
  const {
    productFields,
    updateProductFields,
    customerFields,
    updateCustomerFields,
    supplierFields,
    updateSupplierFields,
    salesFields,
    updateSalesFields,
    purchaseFields,
    updatePurchaseFields,
    expenseFields,
    updateExpenseFields,
    skuBarcodeSettings,
    updateSkuBarcodeSettings,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'product' | 'customer' | 'supplier' | 'sales' | 'purchase' | 'expense' | 'skuBarcode'>('product');

  // Generic Field Toggle Helper
  const handleToggleField = (
    fields: FieldVisibilityConfig[],
    updateFn: (f: FieldVisibilityConfig[]) => void,
    fieldId: string,
    key: 'show' | 'required'
  ) => {
    const updated = fields.map((f) => (f.id === fieldId ? { ...f, [key]: !f[key] } : f));
    updateFn(updated);
    showToast(`ফিল্ড আপডেট সম্পন্ন: ${key === 'show' ? 'ভিজিবিলিটি' : 'আবশ্যকতা (Required)'}`);
  };

  const renderFieldList = (fields: FieldVisibilityConfig[], updateFn: (f: FieldVisibilityConfig[]) => void, moduleName: string) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {moduleName} মডিউলে কোন কোন ফিল্ড দৃশ্যমান থাকবে এবং কোনগুলো পূরণ করা বাধ্যতামূলক (Required) হবে তা কনফিগার করুন।
          </p>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            {fields.filter((f) => f.show).length} / {fields.length} টি সক্রিয়
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {fields.map((f) => (
            <div
              key={f.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                f.show ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="min-w-0">
                <div className="font-bold text-xs text-slate-900 truncate">{f.label}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  ID: <code className="bg-slate-100 px-1 py-0.5 rounded">{f.id}</code>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Required Toggle */}
                {f.show && (
                  <button
                    type="button"
                    onClick={() => handleToggleField(fields, updateFn, f.id, 'required')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      f.required
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title="বাধ্যতামূলক (Required) চালু বা বন্ধ করুন"
                  >
                    {f.required ? '★ Required' : 'Optional'}
                  </button>
                )}

                {/* Show / Hide Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleField(fields, updateFn, f.id, 'show')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    f.show ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {f.show ? 'SHOW' : 'HIDE'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <span>মডিউল ফিল্ডস ও ফর্ম কন্ট্রোল (Module Fields & Form Control)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            পণ্য, কাস্টমার, সাপ্লায়ার, বিক্রয় ও ক্রয়ের প্রতিটি ফিল্ডের Show/Hide এবং Required/Optional নিয়ন্ত্রণ করুন
          </p>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
        {[
          { id: 'product', label: 'পণ্য ফিল্ডস (Products)', icon: Package },
          { id: 'skuBarcode', label: 'SKU ও বারকোড ইঞ্জিন', icon: Barcode },
          { id: 'customer', label: 'কাস্টমার ফিল্ডস (Customers)', icon: Users },
          { id: 'supplier', label: 'সাপ্লায়ার ফিল্ডস (Suppliers)', icon: Building2 },
          { id: 'sales', label: 'বিক্রয় ও POS ফিল্ডস (Sales)', icon: Receipt },
          { id: 'purchase', label: 'ক্রয় ফিল্ডস (Purchases)', icon: Truck },
          { id: 'expense', label: 'খরচ ফিল্ডস (Expenses)', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      {activeTab === 'product' && renderFieldList(productFields, updateProductFields, 'পণ্য (Product)')}
      {activeTab === 'customer' && renderFieldList(customerFields, updateCustomerFields, 'কাস্টমার (Customer)')}
      {activeTab === 'supplier' && renderFieldList(supplierFields, updateSupplierFields, 'সাপ্লায়ার (Supplier)')}
      {activeTab === 'sales' && renderFieldList(salesFields, updateSalesFields, 'বিক্রয় ও ইনভয়েস (Sales & POS)')}
      {activeTab === 'purchase' && renderFieldList(purchaseFields, updatePurchaseFields, 'ক্রয় ও বিল (Purchases)')}
      {activeTab === 'expense' && renderFieldList(expenseFields, updateExpenseFields, 'খরচ ও ভাউচার (Expenses)')}

      {/* SKU & Barcode Generator Panel */}
      {activeTab === 'skuBarcode' && (
        <div className="space-y-4 bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
          <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
            <Barcode className="w-4 h-4 text-emerald-600" />
            <span>অটো SKU ও বারকোড জেনারেশন সেটিংস (SKU & Barcode Automation)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">অটো SKU জেনারেশন (Auto SKU)</div>
                  <div className="text-[10px] text-slate-400">নতুন পণ্য যুক্ত করার সময় অটোমেটিক SKU কোড তৈরি হবে</div>
                </div>
                <input
                  type="checkbox"
                  checked={skuBarcodeSettings.autoSku}
                  onChange={(e) => updateSkuBarcodeSettings({ autoSku: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">SKU প্রিফিক্স (Prefix)</label>
                <input
                  type="text"
                  value={skuBarcodeSettings.skuPrefix}
                  onChange={(e) => updateSkuBarcodeSettings({ skuPrefix: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  placeholder="PRD-"
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">অটো বারকোড জেনারেশন (Auto Barcode)</div>
                  <div className="text-[10px] text-slate-400">বারকোড খালি থাকলে সিস্টেম অটোমেটিক কোড তৈরি করবে</div>
                </div>
                <input
                  type="checkbox"
                  checked={skuBarcodeSettings.autoBarcode}
                  onChange={(e) => updateSkuBarcodeSettings({ autoBarcode: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">বারকোড ফরম্যাট (Format)</label>
                <select
                  value={skuBarcodeSettings.barcodeType}
                  onChange={(e) => updateSkuBarcodeSettings({ barcodeType: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  <option value="CODE128">CODE128 (স্ট্যান্ডার্ড আলফানিউমেরিক)</option>
                  <option value="EAN13">EAN-13 (১৩ ডিজিট রিটেইল)</option>
                  <option value="QR">QR Code 2D</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
