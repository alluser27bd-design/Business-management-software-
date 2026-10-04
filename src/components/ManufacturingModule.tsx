import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ManufacturingOrder, BomItem } from '../types';
import {
  Factory,
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Boxes,
} from 'lucide-react';

export const ManufacturingModule: React.FC = () => {
  const {
    t,
    products,
    manufacturingOrders,
    saveManufacturingOrder,
    getProductStock,
    showToast,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [targetQty, setTargetQty] = useState<number>(10);
  const [finishedProductId, setFinishedProductId] = useState<string>('');
  const [bomItems, setBomItems] = useState<BomItem[]>([]);
  const [additionalCost, setAdditionalCost] = useState<number>(500);

  const rawMaterials = products.filter((p) => !p.deletedAt && p.isRawMaterial);
  const finishedProducts = products.filter((p) => !p.deletedAt && !p.isRawMaterial);

  const handleOpenAdd = () => {
    const defaultFin = finishedProducts[0];
    const defaultRaw = rawMaterials[0] || products[0];
    setFinishedProductId(defaultFin?.id || '');
    setTargetQty(10);
    setAdditionalCost(500);
    if (defaultRaw) {
      setBomItems([
        {
          rawProductId: defaultRaw.id,
          rawProductName: defaultRaw.name,
          qtyPerUnit: 1,
          cost: defaultRaw.purchasePrice,
        },
      ]);
    } else {
      setBomItems([]);
    }
    setIsModalOpen(true);
  };

  const handleAddRawItem = (rawId: string) => {
    const raw = products.find((p) => p.id === rawId);
    if (!raw) return;
    setBomItems([
      ...bomItems,
      {
        rawProductId: raw.id,
        rawProductName: raw.name,
        qtyPerUnit: 1,
        cost: raw.purchasePrice,
      },
    ]);
  };

  const totalRawCost = bomItems.reduce((sum, b) => sum + b.qtyPerUnit * b.cost * targetQty, 0);
  const totalOrderCost = totalRawCost + Number(additionalCost);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fin = products.find((p) => p.id === finishedProductId);
    if (!fin) {
      showToast('ফিনিশড পণ্য নির্বাচন করুন');
      return;
    }

    const payload: ManufacturingOrder = {
      id: `MO-${Date.now()}`,
      orderNo: `MFG-${Date.now().toString().slice(-5)}`,
      finishedProductId,
      finishedProductName: fin.name,
      targetQty: Number(targetQty),
      bom: bomItems,
      additionalCost: Number(additionalCost),
      totalCost: totalOrderCost,
      date: new Date().toISOString().slice(0, 10),
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    saveManufacturingOrder(payload);
    setIsModalOpen(false);
    showToast('ম্যানুফ্যাকচারিং সম্পন্ন! কাঁচামাল স্টক থেকে কাটা হয়েছে এবং ফিনিশড পণ্য বৃদ্ধি পেয়েছে।');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Factory className="w-5 h-5 text-indigo-600" />
            <span>ম্যানুফ্যাকচারিং ও উৎপাদন (BOM & Production)</span>
          </h2>
          <p className="text-xs text-slate-500">
            কাঁচামাল খরচ (Bill of Materials) থেকে পূর্ণাঙ্গ ফিনিশড পণ্য উৎপাদন ও স্টক রূপান্তর
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন উৎপাদন অর্ডার (Run Production)</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="py-3 px-3">অর্ডার কোড</th>
              <th className="py-3 px-3">তারিখ</th>
              <th className="py-3 px-3">উৎপাদিত পণ্য</th>
              <th className="py-3 px-3 text-center">উৎপাদন পরিমাণ</th>
              <th className="py-3 px-3 text-right">মোট উৎপাদন ব্যয়</th>
              <th className="py-3 px-3 text-center">অবস্থা</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {manufacturingOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  কোনো ম্যানুফ্যাকচারিং অর্ডার রেকর্ড নেই
                </td>
              </tr>
            ) : (
              manufacturingOrders.map((mo) => (
                <tr key={mo.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{mo.orderNo}</td>
                  <td className="py-3 px-3 text-slate-500">{mo.date}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{mo.finishedProductName}</td>
                  <td className="py-3 px-3 text-center font-bold text-indigo-700">{mo.targetQty} Unit</td>
                  <td className="py-3 px-3 text-right font-black text-slate-900">৳{mo.totalCost.toLocaleString()}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-bold text-emerald-700">সম্পন্ন (Stock IN)</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Production Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">উৎপাদন ব্যাচ রান করুন (Bill of Materials)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">উৎপাদিত পণ্য (Finished Good) *</label>
                  <select
                    value={finishedProductId}
                    onChange={(e) => setFinishedProductId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-bold"
                  >
                    {finishedProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">উৎপাদন লক্ষ্যমাত্রা (Qty) *</label>
                  <input
                    type="number"
                    min="1"
                    value={targetQty}
                    onChange={(e) => setTargetQty(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-bold text-center"
                  />
                </div>
              </div>

              {/* Raw Materials Selection */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">কাঁচামাল ব্যবহার (BOM Recipe):</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddRawItem(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="px-2 py-1 bg-white border border-slate-300 rounded-md text-[11px]"
                  >
                    <option value="" disabled>
                      + কাঁচামাল যোগ করুন
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (খরচ: ৳{p.purchasePrice})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  {bomItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800">{item.rawProductName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">প্রতি পিসে:</span>
                        <input
                          type="number"
                          min="0.1"
                          step="any"
                          value={item.qtyPerUnit}
                          onChange={(e) => {
                            const updated = [...bomItems];
                            updated[idx].qtyPerUnit = Number(e.target.value);
                            setBomItems(updated);
                          }}
                          className="w-14 px-1.5 py-0.5 border border-slate-300 rounded-md text-center font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setBomItems(bomItems.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">লেবার বা অন্যান্য কারখানা চার্জ</label>
                  <input
                    type="number"
                    value={additionalCost}
                    onChange={(e) => setAdditionalCost(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মোট ব্যাচ প্রোডাকশন খরচ</label>
                  <div className="px-3 py-1.5 bg-slate-100 rounded-lg font-black text-slate-900 text-sm">
                    ৳{totalOrderCost.toLocaleString()}
                  </div>
                </div>
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
                  প্রোডাকশন সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
