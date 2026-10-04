import React from 'react';
import { useApp } from '../context/AppContext';
import { History, Shield, Download } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs, exportToCSV } = useApp();

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Module', 'Action', 'Record ID', 'Summary'];
    const rows = auditLogs.map((log) => [
      log.timestamp,
      log.user,
      log.role.toUpperCase(),
      log.module,
      log.action,
      log.recordId,
      log.summary,
    ]);
    exportToCSV('Audit_Trail_Log', headers, rows);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <span>সিস্টেম অডিট লগ ও কার্যকলাপ ইতিহাস (Audit Trail)</span>
          </h2>
          <p className="text-xs text-slate-500">
            কে, কখন, কোন মডিউলে লেনদেন বা তথ্য এন্ট্রি, এডিট, ডিলিট বা অনুমোদন করেছে তার স্বচ্ছ রেকর্ড
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>অডিট লগ এক্সেল ডাউনলোড</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="py-3 px-3">সময় ও তারিখ</th>
              <th className="py-3 px-3">ইউজার ও রোল</th>
              <th className="py-3 px-3">মডিউল</th>
              <th className="py-3 px-3">অ্যাকশন</th>
              <th className="py-3 px-3">রেকর্ড আইডি</th>
              <th className="py-3 px-3">সারসংক্ষেপ বিবরণ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 text-slate-500 font-mono whitespace-nowrap">{log.timestamp}</td>
                <td className="py-2.5 px-3">
                  <div className="font-bold text-slate-800">{log.user}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{log.role}</div>
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-800">{log.module}</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`text-[10px] font-bold ${
                      log.action === 'CREATE'
                        ? 'text-emerald-700'
                        : log.action === 'UPDATE'
                        ? 'text-blue-700'
                        : log.action === 'RESTORE'
                        ? 'text-indigo-700'
                        : log.action === 'DELETE'
                        ? 'text-red-700'
                        : 'text-slate-700'
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-600">{log.recordId}</td>
                <td className="py-2.5 px-3 text-slate-700 font-medium">{log.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
