import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, CheckCircle, XCircle } from 'lucide-react';

export const ApprovalQueueView: React.FC = () => {
  const { approvals, approveItem } = useApp();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            <span>অনুমোদন সারি (Approval Queue)</span>
          </h2>
          <p className="text-xs text-slate-500">
            বিশেষ ছাড় (Discount), রিফান্ড, বড় খরচ ও স্টক সমন্বয় অনুমোদনের জন্য অপেক্ষমান তালিকা
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="py-3 px-3">অনুরোধের ধরণ</th>
              <th className="py-3 px-3">বিষয় / বিবরণ</th>
              <th className="py-3 px-3">টাকা বা পরিমাণ</th>
              <th className="py-3 px-3">অনুরোধকারী</th>
              <th className="py-3 px-3">সময়</th>
              <th className="py-3 px-3 text-center">বর্তমান অবস্থা</th>
              <th className="py-3 px-3 text-center">সিদ্ধান্ত (Action)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {approvals.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  অনুমোদনের জন্য কোনো অনুরোধ পেন্ডিং নেই
                </td>
              </tr>
            ) : (
              approvals.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 uppercase font-mono font-bold text-slate-700">{app.type}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{app.title}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">{app.amountOrDetail}</td>
                  <td className="py-3 px-3 text-slate-600">{app.requestedBy}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{app.timestamp}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        app.status === 'approved'
                          ? 'text-emerald-700'
                          : app.status === 'rejected'
                          ? 'text-red-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {app.status === 'approved' ? 'অনুমোদিত' : app.status === 'rejected' ? 'বাতিলকৃত' : 'পেন্ডিং'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {app.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => approveItem(app.id, true)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                        >
                          অনুমোদন দিন
                        </button>
                        <button
                          onClick={() => approveItem(app.id, false)}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[11px] font-bold"
                        >
                          বাতিল করুন
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">সম্পন্ন</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
