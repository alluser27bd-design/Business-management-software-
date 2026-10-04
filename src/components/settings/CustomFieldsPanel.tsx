import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomFieldDefinition } from '../../types';
import { Layers, Plus, Trash2, Edit2, Check, Sparkles, AlertCircle } from 'lucide-react';

export const CustomFieldsPanel: React.FC = () => {
  const { customFields, addCustomField, updateCustomField, deleteCustomField, showToast } = useApp();

  const [label, setLabel] = useState('');
  const [key, setKey] = useState('');
  const [module, setModule] = useState<CustomFieldDefinition['module']>('product');
  const [type, setType] = useState<CustomFieldDefinition['type']>('text');
  const [optionsStr, setOptionsStr] = useState('');
  const [required, setRequired] = useState(false);
  const [showInPrint, setShowInPrint] = useState(true);
  const [showInTable, setShowInTable] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const generatedKey = key.trim() || label.toLowerCase().replace(/\s+/g, '_');
    const options = type === 'select' ? optionsStr.split(',').map((s) => s.trim()).filter(Boolean) : undefined;

    addCustomField({
      module,
      label: label.trim(),
      key: generatedKey,
      type,
      options,
      required,
      showInPrint,
      showInTable,
      order: customFields.length + 1,
    });

    setLabel('');
    setKey('');
    setOptionsStr('');
    setRequired(false);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>কাস্টম ফিল্ড বিল্ডার সিস্টেম (Custom Field Engine)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            সফটওয়্যারের যেকোনো মডিউলে নিজের ব্যবসায়িক প্রয়োজন অনুযায়ী অতিরিক্ত তথ্য সংরক্ষণের জন্য নতুন ফিল্ড তৈরি করুন
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন কাস্টম ফিল্ড তৈরি করুন</span>
        </button>
      </div>

      {customFields.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-2">
          <Layers className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-xs font-bold text-slate-700">কোনো কাস্টম ফিল্ড তৈরি করা হয়নি</h4>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            প্রয়োজনে পণ্য, কাস্টমার, সাপ্লায়ার বা ইনভয়েসে অতিরিক্ত তথ্য (যেমন: ওয়ারেন্টি কার্ড নং, ড্রাইভার নাম, স্পেশাল আইডি) যুক্ত করতে পারেন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {customFields.map((f) => (
            <div key={f.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {f.module.toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => deleteCustomField(f.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  title="মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="text-xs font-extrabold text-slate-900">{f.label}</div>
                <div className="text-[10px] font-mono text-slate-400">
                  Key: <code>{f.key}</code> · Type: {f.type}
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-500">
                <span className={f.required ? 'text-rose-600' : 'text-slate-400'}>
                  {f.required ? '★ Required' : 'Optional'}
                </span>
                <span>·</span>
                <span className={f.showInPrint ? 'text-emerald-700' : 'text-slate-400'}>
                  {f.showInPrint ? 'প্রিন্টে দৃশ্যমান' : 'প্রিন্টে লুকানো'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h4 className="text-sm font-black text-slate-900">নতুন কাস্টম ফিল্ড যোগ করুন</h4>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">মডিউল নির্বাচন (Module)</label>
                <select
                  value={module}
                  onChange={(e) => setModule(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="product">পণ্য (Product)</option>
                  <option value="customer">কাস্টমার (Customer)</option>
                  <option value="supplier">সাপ্লায়ার (Supplier)</option>
                  <option value="invoice">ইনভয়েস ও বিক্রয় (Invoice)</option>
                  <option value="expense">দৈনিক খরচ (Expense)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">ফিল্ডের শিরোনাম (Field Label)</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="যেমন: ওয়ারেন্টি কার্ড সিরিয়াল নং"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">ডাটা টাইপ (Data Type)</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="text">টেক্সট (Text String)</option>
                  <option value="number">সংখ্যা (Number / Amount)</option>
                  <option value="date">তারিখ (Date Picker)</option>
                  <option value="select">ড্রপডাউন অপশন (Select List)</option>
                  <option value="checkbox">চেকবক্স টিক (Yes/No)</option>
                </select>
              </div>

              {type === 'select' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ড্রপডাউন অপশনগুলো (কমা দিয়ে আলাদা করুন)</label>
                  <input
                    type="text"
                    value={optionsStr}
                    onChange={(e) => setOptionsStr(e.target.value)}
                    placeholder="Option 1, Option 2, Option 3"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              )}

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={required}
                    onChange={(e) => setRequired(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span>Required (বাধ্যতামূলক)</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInPrint}
                    onChange={(e) => setShowInPrint(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span>প্রিন্ট চালানে দেখাবে</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
