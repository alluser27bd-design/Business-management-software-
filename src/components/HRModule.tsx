import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Employee, Attendance, Payroll } from '../types';
import {
  UserCheck,
  Plus,
  Calendar,
  DollarSign,
  Download,
  Trash2,
  Edit,
  CheckCircle2,
} from 'lucide-react';

export const HRModule: React.FC = () => {
  const {
    t,
    employees,
    attendances,
    payrolls,
    saveEmployee,
    deleteEmployee,
    saveAttendance,
    savePayroll,
    exportToCSV,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'payroll'>('employees');
  const [isEmpModalOpen, setIsEmpModalOpen] = useState<boolean>(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  // Attendance quick state
  const [attDate, setAttDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Employee Form
  const [empName, setEmpName] = useState<string>('');
  const [empPhone, setEmpPhone] = useState<string>('');
  const [empDesignation, setEmpDesignation] = useState<string>('সেলস এক্সিকিউটিভ');
  const [empDept, setEmpDept] = useState<string>('Sales');
  const [empSalary, setEmpSalary] = useState<number>(20000);
  const [empAddress, setEmpAddress] = useState<string>('');

  const handleOpenAddEmp = () => {
    setEditingEmp(null);
    setEmpName('');
    setEmpPhone('');
    setEmpDesignation('সেলস এক্সিকিউটিভ');
    setEmpDept('Sales');
    setEmpSalary(20000);
    setEmpAddress('');
    setIsEmpModalOpen(true);
  };

  const handleSaveEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim()) return;

    const payload: Employee = {
      id: editingEmp ? editingEmp.id : `EMP-${Date.now().toString().slice(-4)}`,
      employeeId: editingEmp ? editingEmp.employeeId : `E-${Math.floor(100 + Math.random() * 900)}`,
      name: empName,
      phone: empPhone,
      designation: empDesignation,
      department: empDept,
      salary: Number(empSalary),
      address: empAddress,
      joiningDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    saveEmployee(payload);
    setIsEmpModalOpen(false);
  };

  const handleToggleAttendance = (empId: string, empName: string, status: Attendance['status']) => {
    saveAttendance({
      id: `ATT-${empId}-${attDate}`,
      employeeId: empId,
      employeeName: empName,
      date: attDate,
      status,
      dutyHours: status === 'present' ? 8 : status === 'late' ? 7 : 0,
      overtimeHours: 0,
    });
  };

  const handleExportCSV = () => {
    const headers = ['Employee ID', 'Name', 'Phone', 'Designation', 'Department', 'Basic Salary'];
    const rows = employees.map((e) => [e.employeeId, e.name, e.phone, e.designation, e.department, e.salary]);
    exportToCSV('Employees_Roster', headers, rows);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-600" />
            <span>কর্মচারী ব্যবস্থাপনা ও বেতন (HR & Payroll)</span>
          </h2>
          <p className="text-xs text-slate-500">
            স্টাফ প্রোফাইল, দৈনিক হাজিরা ট্র্যাকিং এবং বেতন-ভাতা শিট
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.excel}</span>
          </button>
          <button
            onClick={handleOpenAddEmp}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন কর্মচারী যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs font-medium">
        {[
          { id: 'employees', label: 'কর্মচারী তালিকা (Staff List)' },
          { id: 'attendance', label: 'দৈনিক হাজিরা (Attendance)' },
          { id: 'payroll', label: 'মাসিক বেতন ও পেরোল (Payroll)' },
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

      {/* Tab 1: Staff List */}
      {activeTab === 'employees' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">আইডি ও নাম</th>
                <th className="py-3 px-3">পদবী ও বিভাগ</th>
                <th className="py-3 px-3">ফোন নম্বর</th>
                <th className="py-3 px-3 text-right">মাসিক মূল বেতন</th>
                <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {emp.name} <span className="font-mono text-slate-400 font-normal">({emp.employeeId})</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {emp.designation} · <span className="text-slate-400">{emp.department}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{emp.phone}</td>
                  <td className="py-3 px-3 text-right font-black text-slate-900">
                    ৳{emp.salary.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-bold text-emerald-700">সক্রিয়</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm('আপনি কি নিশ্চিত?')) deleteEmployee(emp.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">তারিখ নির্বাচন:</span>
            <input
              type="date"
              value={attDate}
              onChange={(e) => setAttDate(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded-lg text-xs outline-hidden font-bold"
            />
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-2.5 px-3">কর্মচারী</th>
                <th className="py-2.5 px-3">পদবী</th>
                <th className="py-2.5 px-3 text-center">উপস্থিতি স্থিতি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => {
                const record = attendances.find((a) => a.employeeId === emp.id && a.date === attDate);
                const currentStatus = record ? record.status : 'present';

                return (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{emp.name}</td>
                    <td className="py-2.5 px-3 text-slate-500">{emp.designation}</td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
                        {(['present', 'late', 'leave', 'absent'] as Attendance['status'][]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleToggleAttendance(emp.id, emp.name, st)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md capitalize transition-colors ${
                              currentStatus === st
                                ? st === 'present'
                                  ? 'bg-emerald-600 text-white'
                                  : st === 'absent'
                                  ? 'bg-red-600 text-white'
                                  : 'bg-amber-600 text-white'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {st === 'present'
                              ? 'উপস্থিত'
                              : st === 'late'
                              ? 'দেরি'
                              : st === 'leave'
                              ? 'ছুটি'
                              : 'অনুপস্থিত'}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Payroll */}
      {activeTab === 'payroll' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800">
              চলতি মাসের বেতন প্রসেসিং ({new Date().toISOString().slice(0, 7)})
            </h4>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-2.5 px-3">কর্মচারী</th>
                <th className="py-2.5 px-3 text-right">মূল বেতন</th>
                <th className="py-2.5 px-3 text-right">ওভারটাইম / বোনাস</th>
                <th className="py-2.5 px-3 text-right">কর্তন</th>
                <th className="py-2.5 px-3 text-right">নিট বেতন</th>
                <th className="py-2.5 px-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{emp.name}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">৳{emp.salary.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-600">+৳0</td>
                  <td className="py-2.5 px-3 text-right text-red-600">-৳0</td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900">৳{emp.salary.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => showToast(`${emp.name}-এর বেতন স্লিপ প্রস্তুত হয়েছে`)}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md font-bold text-[11px]"
                    >
                      বেতন পরিশোধ করুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Modal */}
      {isEmpModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">নতুন কর্মচারী নিবন্ধন</h3>
              <button onClick={() => setIsEmpModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEmp} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">কর্মচারীর পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ফোন নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মাসিক মূল বেতন *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={empSalary}
                    onChange={(e) => setEmpSalary(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পদবী (Designation)</label>
                  <input
                    type="text"
                    value={empDesignation}
                    onChange={(e) => setEmpDesignation(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বিভাগ (Department)</label>
                  <input
                    type="text"
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEmpModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
