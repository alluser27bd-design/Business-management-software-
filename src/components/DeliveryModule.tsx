import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryChallan } from '../types';
import { Truck, Plus, CheckCircle2, Clock, XCircle, Search, Printer } from 'lucide-react';

export const DeliveryModule: React.FC = () => {
  const { deliveries, saveDelivery, setPrintData, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [challanNo, setChallanNo] = useState(`CHL-${Date.now().toString().slice(-5)}`);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryPerson, setDeliveryPerson] = useState('সোহেল রানা');
  const [route, setRoute] = useState('ঢাকা সিটি রুট ১');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    saveDelivery({
      id: `DEL-${Date.now()}`,
      challanNo,
      customerName,
      phone,
      address,
      deliveryPerson,
      deliveryDate,
      route,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    });

    setIsModalOpen(false);
    showToast('ডেলিভারি চালান তৈরি সম্পন্ন হয়েছে');
  };

  const updateStatus = (del: DeliveryChallan, status: DeliveryChallan['status']) => {
    saveDelivery({
      ...del,
      status,
      updatedAt: new Date().toISOString(),
    });
    showToast(`চালান স্ট্যাটাস আপডেট: ${status.toUpperCase()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>ডেলিভারি চালান ও লজিস্টিক (Delivery Challan)</span>
          </h2>
          <p className="text-xs text-slate-500">চালান ইস্যু, ডেলিভারিম্যান ট্র্যাকিং ও রুট স্ট্যাটাস</p>
        </div>

        <button
          onClick={() => {
            setChallanNo(`CHL-${Date.now().toString().slice(-5)}`);
            setCustomerName('');
            setPhone('');
            setAddress('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন চালান ইস্যু করুন</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="py-3 px-3">চালান নং</th>
              <th className="py-3 px-3">তারিখ</th>
              <th className="py-3 px-3">কাস্টমার ও ঠিকানা</th>
              <th className="py-3 px-3">ডেলিভারিম্যান ও রুট</th>
              <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
              <th className="py-3 px-3 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  কোনো চালান তৈরি করা হয়নি
                </td>
              </tr>
            ) : (
              deliveries.map((del) => (
                <tr key={del.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{del.challanNo}</td>
                  <td className="py-3 px-3 text-slate-500">{del.deliveryDate}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{del.customerName}</div>
                    <div className="text-[11px] text-slate-400">{del.phone} · {del.address}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{del.deliveryPerson}</div>
                    <div className="text-[10px] text-slate-400">{del.route}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] font-bold ${
                        del.status === 'delivered'
                          ? 'text-emerald-700'
                          : del.status === 'cancelled'
                          ? 'text-red-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {del.status === 'delivered' ? 'ডেলিভার্ড' : del.status === 'cancelled' ? 'বাতিল' : 'চলমান'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {del.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(del, 'delivered')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold"
                        >
                          ডেলিভারি সম্পন্ন
                        </button>
                      )}
                      <button
                        onClick={() => setPrintData({ type: 'invoice', data: del })}
                        className="p-1 text-slate-500 hover:text-slate-900"
                        title="প্রিন্ট চালান"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Challan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">নতুন ডেলিভারি চালান তৈরি</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">কাস্টমার নাম *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ফোন নম্বর</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ডেলিভারি তারিখ</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ডেলিভারি ঠিকানা</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ডেলিভারি পার্সন</label>
                  <input
                    type="text"
                    value={deliveryPerson}
                    onChange={(e) => setDeliveryPerson(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ডেলিভারি রুট</label>
                  <input
                    type="text"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
                >
                  চালান ইস্যু করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
