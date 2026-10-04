import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, UserRoleDefinition, RoleModulePermission } from '../../types';
import { Users, ShieldCheck, Mail, Plus, Trash2, Key, Check, CheckSquare, Square } from 'lucide-react';

export const UsersPermissionsPanel: React.FC = () => {
  const {
    gmailAccounts,
    currentGmailUser,
    addManualGmailAccount,
    removeGmailAccount,
    switchGmailAccount,
    setBackupTargetGmail,
    rolePermissions,
    updateRolePermission,
    showToast,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('accountant');
  const [newAsBackup, setNewAsBackup] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const activeRoleDef = rolePermissions.find((r) => r.id === selectedRole) || rolePermissions[0];

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    addManualGmailAccount(newEmail.trim(), newName.trim(), newRole, newAsBackup);
    setNewEmail('');
    setNewName('');
    setShowAddUserModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>ইউজার অ্যাকাউন্টস ও রোল-বেসড পারমিশন (Users & RBAC Control)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            অ্যাডমিন, ম্যানেজার, অ্যাকাউন্ট্যান্ট ও ক্যাশিয়ার রোলের প্রতি মডিউলে View, Add, Edit, Delete ও Print অধিকার নিয়ন্ত্রণ করুন
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddUserModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন ইউজার অ্যাকাউন্ট</span>
        </button>
      </div>

      {/* 1. User Accounts List */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-600" />
          <span>সংযুক্ত ইউজার ও অ্যাকাউন্টস তালিকা ({gmailAccounts.length})</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {gmailAccounts.map((acc) => {
            const isCurrent = currentGmailUser?.id === acc.id;
            return (
              <div
                key={acc.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isCurrent ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-2xs' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-xs text-slate-900 truncate">{acc.name}</span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-slate-100 text-slate-700 font-mono">
                      {acc.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{acc.email}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {acc.isBackupTarget ? '🟢 অটো ব্যাকআপ টার্গেট' : 'স্ট্যান্ডার্ড ইউজার'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  {isCurrent ? (
                    <span className="text-[11px] font-extrabold text-emerald-700">✓ বর্তমান সক্রিয় ইউজার</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => switchGmailAccount(acc.id)}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                    >
                      লগইন হিসেবে স্যুইচ করুন →
                    </button>
                  )}

                  {!acc.isPrimary && (
                    <button
                      type="button"
                      onClick={() => removeGmailAccount(acc.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Role Permissions Matrix */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>মডিউল এক্সেস ও পারমিশন ম্যাট্রিক্স (Role Permissions Matrix)</span>
            </h4>
            <p className="text-xs text-slate-500">নির্বাচিত রোলের জন্য নির্দিষ্ট মডিউলে কার্য সম্পাদনের অনুমতি নির্ধারণ করুন</p>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {rolePermissions.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                  selectedRole === r.id ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.id}
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3">মডিউলের নাম</th>
                <th className="p-3 text-center">দেখা (View)</th>
                <th className="p-3 text-center">তৈরি (Create)</th>
                <th className="p-3 text-center">সম্পাদনা (Edit)</th>
                <th className="p-3 text-center">মুছে ফেলা (Delete)</th>
                <th className="p-3 text-center">প্রিন্ট (Print)</th>
                <th className="p-3 text-center">এক্সপোর্ট (Export)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeRoleDef.permissions.map((perm) => (
                <tr key={perm.module} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-slate-800">{perm.label}</td>
                  {(['canView', 'canCreate', 'canEdit', 'canDelete', 'canPrint', 'canExport'] as const).map((action) => {
                    const isChecked = perm[action];
                    return (
                      <td key={action} className="p-3 text-center">
                        <button
                          type="button"
                          disabled={selectedRole === 'admin' && action === 'canView'}
                          onClick={() => updateRolePermission(selectedRole, perm.module, action, !isChecked)}
                          className={`p-1 rounded cursor-pointer transition-colors ${
                            isChecked ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-400'
                          }`}
                        >
                          {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h4 className="text-sm font-black text-slate-900">নতুন ইউজার যুক্ত করুন</h4>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">ইউজারের পুরো নাম (Name)</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: জনাব মেহরাব হোসেন"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Gmail / ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">রোল ও এক্সেস স্তর (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium capitalize"
                >
                  <option value="admin">Admin (পূর্ণ নিয়ন্ত্রণ)</option>
                  <option value="manager">Manager (ম্যানেজার)</option>
                  <option value="accountant">Accountant (হিসাবরক্ষক)</option>
                  <option value="sales">Sales (বিক্রয়কর্মী)</option>
                  <option value="cashier">Cashier (ক্যাশিয়ার)</option>
                  <option value="viewer">Viewer (শুধু দেখার অধিকার)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
