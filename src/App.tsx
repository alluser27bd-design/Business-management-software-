/**
 * BizAccount ERP & POS Main Application
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { POSModule } from './components/POSModule';
import { SalesModule } from './components/SalesModule';
import { PurchaseModule } from './components/PurchaseModule';
import { ProductModule } from './components/ProductModule';
import { InventoryModule } from './components/InventoryModule';
import { CustomerModule } from './components/CustomerModule';
import { SupplierModule } from './components/SupplierModule';
import { ExpenseModule } from './components/ExpenseModule';
import { PaymentModule } from './components/PaymentModule';
import { CashBankModule } from './components/CashBankModule';
import { AccountingModule } from './components/AccountingModule';
import { HRModule } from './components/HRModule';
import { ManufacturingModule } from './components/ManufacturingModule';
import { DeliveryModule } from './components/DeliveryModule';
import { ReportCenter } from './components/ReportCenter';
import { RecycleBin } from './components/RecycleBin';
import { AuditLogView } from './components/AuditLogView';
import { ApprovalQueueView } from './components/ApprovalQueueView';
import { SettingsBackup } from './components/SettingsBackup';
import { PrintModal } from './components/PrintModal';
import { TopIconSubBar } from './components/TopIconSubBar';
import { BottomNavigationBar } from './components/BottomNavigationBar';
import {
  Menu,
  CheckCircle,
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Users,
  Boxes,
  History,
  Store,
  FileBarChart,
  MoreHorizontal,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, toastMessage } = useApp();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',_'Hind_Siliguri',_sans-serif]">
      {/* Top Navbar */}
      <Navbar />

      {/* Dynamic Sub-Top Bar / Floating Dock when enabled */}
      <TopIconSubBar />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpenMobile={isOpenMobile} setIsOpenMobile={setIsOpenMobile} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-2.5 sm:p-5 lg:p-6 pb-24 lg:pb-8">
          {/* Mobile Quick Action Opener Bar */}
          <div className="lg:hidden flex items-center justify-between mb-3 no-print gap-2">
            <button
              onClick={() => setIsOpenMobile(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Menu className="w-4 h-4 text-emerald-600" />
              <span>মেনু তালিকা (All Modules)</span>
            </button>
            <span className="text-[11px] font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg font-mono">
              {activeTab}
            </span>
          </div>

          {/* Module Switcher */}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'pos' && <POSModule />}
          {activeTab === 'sales' && <SalesModule />}
          {activeTab === 'purchases' && <PurchaseModule />}
          {activeTab === 'products' && <ProductModule />}
          {activeTab === 'inventory' && <InventoryModule />}
          {activeTab === 'customers' && <CustomerModule />}
          {activeTab === 'suppliers' && <SupplierModule />}
          {activeTab === 'expenses' && <ExpenseModule />}
          {activeTab === 'payments' && <PaymentModule />}
          {activeTab === 'cashbank' && <CashBankModule />}
          {activeTab === 'accounting' && <AccountingModule />}
          {activeTab === 'manufacturing' && <ManufacturingModule />}
          {activeTab === 'delivery' && <DeliveryModule />}
          {activeTab === 'hr' && <HRModule />}
          {activeTab === 'reports' && <ReportCenter />}
          {activeTab === 'recyclebin' && <RecycleBin />}
          {activeTab === 'auditlogs' && <AuditLogView />}
          {activeTab === 'approvals' && <ApprovalQueueView />}
          {activeTab === 'settings' && <SettingsBackup />}
        </main>
      </div>

      {/* Dynamic Customizable Bottom Navigation Bar */}
      <BottomNavigationBar isOpenMobile={isOpenMobile} setIsOpenMobile={setIsOpenMobile} />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 bg-white text-slate-900 text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-200/90 flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Print Modal */}
      <PrintModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
