import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Truck,
  Package,
  Boxes,
  Users,
  Building2,
  DollarSign,
  ArrowLeftRight,
  Landmark,
  Scale,
  Factory,
  UserCheck,
  FileBarChart,
  Trash2,
  History,
  CheckSquare,
  Settings,
  X,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, setIsOpenMobile }) => {
  const { activeTab, setActiveTab, t, approvals, customers, suppliers, products, autoBackupSettings } = useApp();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, badge: null },
    { id: 'pos', label: t.pos, icon: ShoppingCart, badge: 'FAST', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'sales', label: t.sales, icon: Receipt, badge: null },
    { id: 'purchases', label: t.purchase, icon: Truck, badge: null },
    { id: 'products', label: t.products, icon: Package, badge: products.length },
    { id: 'inventory', label: t.inventory, icon: Boxes, badge: null },
    { id: 'customers', label: t.customers, icon: Users, badge: customers.length },
    { id: 'suppliers', label: t.suppliers, icon: Building2, badge: suppliers.length },
    { id: 'expenses', label: t.expenses, icon: DollarSign, badge: null },
    { id: 'payments', label: t.payments, icon: ArrowLeftRight, badge: null },
    { id: 'cashbank', label: t.cashBank, icon: Landmark, badge: null },
    { id: 'accounting', label: t.accounting, icon: Scale, badge: null },
    { id: 'manufacturing', label: t.manufacturing, icon: Factory, badge: null },
    { id: 'delivery', label: t.delivery, icon: Truck, badge: null },
    { id: 'hr', label: t.hrPayroll, icon: UserCheck, badge: null },
    { id: 'reports', label: t.reports, icon: FileBarChart, badge: null },
    { id: 'recyclebin', label: t.recycleBin, icon: Trash2, badge: null },
    { id: 'auditlogs', label: t.auditLogs, icon: History, badge: null },
    {
      id: 'approvals',
      label: t.approvals,
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
      badgeColor: 'bg-red-500 text-white',
    },
    { id: 'settings', label: 'সেটিংস ও প্রিন্ট কন্ট্রোল', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container: Clean, Bright, Modern (Zero Dark Background) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white text-slate-700 border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } no-print shadow-xs`}
      >
        {/* Mobile Header in Sidebar */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              ৳
            </div>
            <span className="font-bold text-slate-900 text-sm">{t.appName}</span>
          </div>
          <button
            onClick={() => setIsOpenMobile(false)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            মডিউল মেনু (Modules)
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-md ${
                      item.badgeColor || (isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom System Info - Bright & Clean */}
        <div className="p-3 border-t border-slate-200 text-[11px] text-slate-500 bg-slate-50/80">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-bold text-slate-800">BizAccount ERP v2.4</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {autoBackupSettings.intervalMinutes}m Auto-Sync
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Real-time Recalculation Engine</p>
        </div>
      </aside>
    </>
  );
};
