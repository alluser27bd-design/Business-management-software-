import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Download,
  Printer,
  FileText,
  Share2,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Check,
  Building2,
  Phone,
  Mail,
  TrendingUp,
  ShoppingCart,
  Users,
  Truck,
  Package,
  Layers,
  Clock,
  ShieldCheck,
  DollarSign,
  Wallet,
  Scale,
  PieChart,
  BookOpen,
  Landmark,
  Boxes,
  FileCheck2,
  Undo2,
  UserCheck,
  Receipt,
  Factory,
  HandCoins,
  ShieldAlert,
  ArrowRight,
  Eye,
  ArrowLeft,
  RefreshCw,
  Trash2,
  Edit,
  ExternalLink,
  X,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  REPORT_CATEGORIES,
  ALL_REPORTS,
  calculateReport,
  ReportFilterParams,
  ReportResult,
} from '../utils/reportEngine';

// Category to Icon mapping
const CATEGORY_ICONS: Record<string, any> = {
  sales: TrendingUp,
  purchase: ShoppingCart,
  customer: Users,
  supplier: Truck,
  product: Package,
  inventory: Layers,
  batch_expiry: Clock,
  serial_warranty: ShieldCheck,
  expense: DollarSign,
  payment: Wallet,
  due_balance: Scale,
  profit_loss: PieChart,
  accounting: BookOpen,
  cash_bank: Landmark,
  orders: Boxes,
  delivery: FileCheck2,
  returns: Undo2,
  employee: UserCheck,
  tax_vat: Receipt,
  manufacturing: Factory,
  loans: HandCoins,
  advanced: ShieldAlert,
};

export const ReportCenter: React.FC = () => {
  const {
    companyProfile,
    invoices,
    purchases,
    customers,
    suppliers,
    products,
    expenses,
    payments,
    stockAdjustments,
    employees,
    attendances,
    payrolls,
    manufacturingOrders,
    deliveries,
    auditLogs,
    approvals,
    dashboardMetrics,
    getCustomerBalance,
    getSupplierBalance,
    getProductStock,
    exportToCSV,
    showToast,
    printSettings,
    setPrintData,
    deleteInvoice,
    deletePurchase,
    deleteExpense,
    deletePayment,
    setActiveTab,
  } = useApp();

  // Navigation / View State
  // 'catalog' = browse all 22 categories, 'report' = active focused report page
  const [viewMode, setViewMode] = useState<'catalog' | 'report'>('report');
  const [selectedCategory, setSelectedCategory] = useState<string>('sales');
  const [selectedReportId, setSelectedReportId] = useState<string>('sales_all');

  // Search filter inside Report selector
  const [reportSearchQuery, setReportSearchQuery] = useState('');

  // Common Date Filter State
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [datePreset, setDatePreset] = useState<'today' | 'yesterday' | 'this_week' | 'this_month' | 'last_month' | 'this_year' | 'custom'>('this_month');
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [toDate, setToDate] = useState<string>(todayStr);

  // Advanced Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [tableSearch, setTableSearch] = useState('');

  // Transaction Drill-Down Modal State
  const [selectedRowDetail, setSelectedRowDetail] = useState<any | null>(null);

  // Refresh Trigger State (for manual REFRESH button)
  const [refreshCount, setRefreshCount] = useState(0);

  // Apply Date Presets
  const applyDatePreset = (preset: typeof datePreset) => {
    setDatePreset(preset);
    const now = new Date();

    if (preset === 'today') {
      const today = now.toISOString().slice(0, 10);
      setFromDate(today);
      setToDate(today);
    } else if (preset === 'yesterday') {
      const yest = new Date(now);
      yest.setDate(now.getDate() - 1);
      const str = yest.toISOString().slice(0, 10);
      setFromDate(str);
      setToDate(str);
    } else if (preset === 'this_week') {
      const day = now.getDay();
      const diff = now.getDate() - (day + 1) % 7;
      const startOfWeek = new Date(now.setDate(diff));
      setFromDate(startOfWeek.toISOString().slice(0, 10));
      setToDate(todayStr);
    } else if (preset === 'this_month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      setFromDate(start);
      setToDate(todayStr);
    } else if (preset === 'last_month') {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
      const end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10);
      setFromDate(start);
      setToDate(end);
    } else if (preset === 'this_year') {
      const start = new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10);
      setFromDate(start);
      setToDate(todayStr);
    }
  };

  // Sub-reports under active category
  const availableReports = useMemo(() => {
    let list = ALL_REPORTS.filter((r) => r.categoryId === selectedCategory);
    if (reportSearchQuery.trim()) {
      const q = reportSearchQuery.toLowerCase();
      list = ALL_REPORTS.filter(
        (r) =>
          r.nameBn.toLowerCase().includes(q) ||
          r.nameEn.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, reportSearchQuery]);

  // Context Bundle for calculation
  const reportContextBundle = useMemo(
    () => ({
      invoices,
      purchases,
      customers,
      suppliers,
      products,
      expenses,
      payments,
      stockAdjustments,
      employees,
      attendances,
      payrolls,
      manufacturingOrders,
      deliveries,
      auditLogs,
      approvals,
      dashboardMetrics,
      getCustomerBalance,
      getSupplierBalance,
      getProductStock,
    }),
    [
      invoices,
      purchases,
      customers,
      suppliers,
      products,
      expenses,
      payments,
      stockAdjustments,
      employees,
      attendances,
      payrolls,
      manufacturingOrders,
      deliveries,
      auditLogs,
      approvals,
      dashboardMetrics,
      getCustomerBalance,
      getSupplierBalance,
      getProductStock,
      refreshCount,
    ]
  );

  // Generate Report Results
  const reportResult: ReportResult = useMemo(() => {
    const filters: ReportFilterParams = {
      fromDate,
      toDate,
      customerId: filterCustomer || undefined,
      supplierId: filterSupplier || undefined,
      productId: filterProduct || undefined,
      category: filterCategory || undefined,
      paymentMethod: filterPaymentMethod || undefined,
      status: filterStatus || undefined,
      searchQuery: tableSearch || undefined,
    };
    return calculateReport(selectedReportId, filters, reportContextBundle);
  }, [
    selectedReportId,
    fromDate,
    toDate,
    filterCustomer,
    filterSupplier,
    filterProduct,
    filterCategory,
    filterPaymentMethod,
    filterStatus,
    tableSearch,
    reportContextBundle,
  ]);

  // 1. VIEW REPORT (Scroll to & focus)
  const handleViewReport = () => {
    setViewMode('report');
    const el = document.getElementById('report-document-body');
    el?.scrollIntoView({ behavior: 'smooth' });
    showToast(`${reportResult.title} সফলভাবে তৈরি করা হয়েছে`);
  };

  // 2. PRINT & PDF TRIGGER
  const handlePrint = () => {
    window.print();
  };

  // 3. EXCEL / CSV DOWNLOAD
  const handleExportCSV = (type: 'csv' | 'excel' = 'csv') => {
    const filename = `${reportResult.reportId}_${fromDate}_to_${toDate}`;
    const headers = reportResult.columns.map((c) => c.label);
    const rows = reportResult.rows.map((row) =>
      reportResult.columns.map((col) => row[col.id] ?? '')
    );
    exportToCSV(filename, headers, rows);
    showToast(type === 'excel' ? 'এক্সেল ফাইল এক্সপোর্ট সম্পন্ন হয়েছে' : 'সিএসভি ফাইল ডাউনলোড হয়েছে');
  };

  // 4. SHARE REPORT
  const handleShare = async () => {
    const textSummary = `*${reportResult.title}*\n${companyProfile.name}\nতারিখ: ${reportResult.dateRangeText}\n` +
      reportResult.kpis.map((k) => `• ${k.label}: ${k.value}`).join('\n') +
      `\n\nজেনারেট সময়: ${new Date().toLocaleString('bn-BD')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: reportResult.title,
          text: textSummary,
        });
        showToast('রিপোর্ট শেয়ার সম্পন্ন হয়েছে');
        return;
      } catch (err) {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(textSummary);
      showToast('রিপোর্টের মূল সারসংক্ষেপ ক্লিপবোর্ডে কপি করা হয়েছে');
    } catch {
      showToast('কপি করতে ব্যর্থ হয়েছে');
    }
  };

  // 5. REFRESH HANDLER
  const handleRefresh = () => {
    setRefreshCount((c) => c + 1);
    showToast('রিপোর্টের সমস্ত হিসাব রিয়েল-টাইমে রিফ্রেশ করা হয়েছে');
  };

  // 6. RESET FILTERS HANDLER
  const handleResetFilters = () => {
    setFilterCustomer('');
    setFilterSupplier('');
    setFilterProduct('');
    setFilterCategory('');
    setFilterPaymentMethod('');
    setFilterStatus('');
    setTableSearch('');
    applyDatePreset('this_month');
    showToast('ফিল্টার ডিফল্ট অবস্থায় রিসেট করা হয়েছে');
  };

  // Handle Clicking on a Sub-Report (Immediately opens Report Page!)
  const handleSelectReport = (repId: string, catId?: string) => {
    setSelectedReportId(repId);
    if (catId) setSelectedCategory(catId);
    setViewMode('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`রিপোর্ট খোলা হয়েছে: ${ALL_REPORTS.find((r) => r.id === repId)?.nameBn || repId}`);
  };

  // Delete Transaction from Details Modal
  const handleDeleteTransaction = () => {
    if (!selectedRowDetail) return;
    const { rawType, rawId } = selectedRowDetail;
    if (!rawId) return;

    if (confirm('আপনি কি নিশ্চিতভাবে এই লেনদেনটি মুছে ফেলতে চান? এটি মুছে ফেললে সকল রিপোর্ট ও হিসাব সাথে সাথে সমন্বয় হবে।')) {
      if (rawType === 'invoice') deleteInvoice(rawId);
      else if (rawType === 'purchase') deletePurchase(rawId);
      else if (rawType === 'expense') deleteExpense(rawId);
      else if (rawType === 'payment') deletePayment(rawId);

      setSelectedRowDetail(null);
      showToast('লেনদেন সফলভাবে মুছে ফেলা হয়েছে এবং রিপোর্ট স্বয়ংক্রিয়ভাবে আপডেট হয়েছে');
    }
  };

  // Print Invoice from Details Modal
  const handlePrintTransaction = () => {
    if (!selectedRowDetail || !selectedRowDetail.rawData) return;
    const { rawType, rawData } = selectedRowDetail;
    if (rawType === 'invoice') {
      setPrintData({ type: 'invoice', data: rawData });
    } else if (rawType === 'purchase') {
      setPrintData({ type: 'invoice', data: rawData });
    } else if (rawType === 'payment') {
      setPrintData({ type: 'statement', data: rawData });
    } else {
      window.print();
    }
    setSelectedRowDetail(null);
  };

  const activeCategoryObj = REPORT_CATEGORIES.find((c) => c.id === selectedCategory) || REPORT_CATEGORIES[0];
  const activeReportObj = ALL_REPORTS.find((r) => r.id === selectedReportId) || ALL_REPORTS[0];
  const ActiveCatIcon = CATEGORY_ICONS[selectedCategory] || TrendingUp;

  return (
    <div className="space-y-5 pb-16 max-w-7xl mx-auto font-['Plus_Jakarta_Sans',_'Hind_Siliguri',_sans-serif]">
      {/* =========================================================================
          1. TOP NAVIGATION / BREADCRUMBS & VIEW MODE TOGGLE
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs no-print">
        <div className="flex items-center gap-2.5">
          {viewMode === 'report' ? (
            <button
              onClick={() => setViewMode('catalog')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সব রিপোর্ট তালিকা (All Reports)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                রিপোর্ট ক্যাটালগ (Report Catalog)
              </span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>/</span>
            <span className="text-slate-600">{activeCategoryObj.nameBn}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">{activeReportObj.nameBn}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'report' ? (
            <button
              onClick={() => setViewMode('catalog')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              ক্যাটাগরি পরিবর্তন করুন
            </button>
          ) : (
            <button
              onClick={() => setViewMode('report')}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              সরাসরি রিপোর্ট ভিউ
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. COMMON DATE FILTER & FULL FUNCTIONAL ACTION TOOLBAR
          ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs no-print space-y-4">
        {/* Title & 9 Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <ActiveCatIcon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {activeCategoryObj.nameBn}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">ID: {selectedReportId}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  {activeReportObj.nameBn}
                </h1>
                <p className="text-xs text-slate-500 font-medium">{activeReportObj.description}</p>
              </div>
            </div>
          </div>

          {/* ALL 9 REQUIRED ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* 1. VIEW REPORT */}
            <button
              onClick={handleViewReport}
              className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="নির্বাচিত রেঞ্জে রিপোর্ট দেখুন"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>VIEW REPORT</span>
            </button>

            {/* 2. PDF */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="পিডিএফ এক্সপোর্ট ও প্রিভিউ"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            {/* 3. PRINT */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="সরাসরি প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>

            {/* 4. EXCEL */}
            <button
              onClick={() => handleExportCSV('excel')}
              className="inline-flex items-center gap-1 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="এক্সেল ফাইল ডাউনলোড"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>EXCEL</span>
            </button>

            {/* 5. CSV */}
            <button
              onClick={() => handleExportCSV('csv')}
              className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="সিএসভি ফাইল ডাউনলোড"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            {/* 6. SHARE */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="রিপোর্ট শেয়ার করুন"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE</span>
            </button>

            {/* 7. REFRESH */}
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-1 px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="ডাটা রিফ্রেশ করুন"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>REFRESH</span>
            </button>

            {/* 8. FILTER */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                showAdvancedFilters
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="ফিল্টার অপশন খুলুন"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>FILTER</span>
            </button>

            {/* 9. RESET FILTER */}
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="সকল ফিল্টার রিসেট করুন"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Date Filter Strip with From/To & Quick Presets */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">তারিখ নির্বাচন:</span>
            {[
              { id: 'today', label: 'Today (আজ)' },
              { id: 'yesterday', label: 'Yesterday (গতকাল)' },
              { id: 'this_week', label: 'This Week (চলতি সপ্তাহ)' },
              { id: 'this_month', label: 'This Month (চলতি মাস)' },
              { id: 'last_month', label: 'Last Month (গত মাস)' },
              { id: 'this_year', label: 'This Year (চলতি বছর)' },
              { id: 'custom', label: 'Custom Date' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyDatePreset(p.id as any)}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  datePreset === p.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* From Date & To Date Inputs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase">FROM DATE:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setDatePreset('custom');
                }}
                className="bg-transparent font-mono text-xs font-bold text-slate-800 outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase">TO DATE:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setDatePreset('custom');
                }}
                className="bg-transparent font-mono text-xs font-bold text-slate-800 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters Bar */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {/* Customer Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">কাস্টমার:</label>
              <select
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-medium"
              >
                <option value="">সকল কাস্টমার</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">সাপ্লায়ার:</label>
              <select
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-medium"
              >
                <option value="">সকল সাপ্লায়ার</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">ক্যাটাগরি:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-medium"
              >
                <option value="">সকল ক্যাটাগরি</option>
                {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">পেমেন্ট মেথড:</label>
              <select
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-medium"
              >
                <option value="">সকল মেথড</option>
                <option value="cash">নগদ ক্যাশ</option>
                <option value="bank">ব্যাংক</option>
                <option value="mobile_banking">মোবাইল ব্যাংকিং</option>
                <option value="credit">বাকি / ক্রেডিট</option>
                <option value="own_money">মালিকের অর্থ</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">স্ট্যাটাস:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-medium"
              >
                <option value="">সকল স্ট্যাটাস</option>
                <option value="completed">সম্পন্ন (Completed)</option>
                <option value="pending">পেন্ডিং (Pending)</option>
                <option value="cancelled">বাতিল (Cancelled)</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট ফিল্টার</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          3. REPORT CATALOG VIEW (When viewMode === 'catalog')
          ========================================================================= */}
      {viewMode === 'catalog' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">
                সকল রিপোর্ট ক্যাটালগ (Select Any Report To Open)
              </h2>
              <p className="text-xs text-slate-500">
                যেকোনো রিপোর্টে ক্লিক করলে সংশ্লিষ্ট রিপোর্টের বিস্তারিত পেজ সাথে সাথে খুলবে
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="রিপোর্ট খুঁজুন..."
                value={reportSearchQuery}
                onChange={(e) => setReportSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 22 Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {REPORT_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || TrendingUp;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{cat.nameBn}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-Reports Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-2">
            {availableReports.map((report) => (
              <button
                key={report.id}
                onClick={() => handleSelectReport(report.id, report.categoryId)}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {report.nameBn}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{report.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{report.nameEn}</span>
                  <span className="text-emerald-700 font-bold group-hover:underline">রিপোর্ট খুলুন →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          4. SUB-REPORTS SHORTCUTS BAR (Quick Switcher within current category)
          ========================================================================= */}
      {viewMode === 'report' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs no-print space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                {activeCategoryObj.nameBn} এর অন্যান্য রিপোর্টসমূহ:
              </span>
            </div>
            <button
              onClick={() => setViewMode('catalog')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              সব ক্যাটাগরি ব্রাউজ করুন ({REPORT_CATEGORIES.length}) →
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {ALL_REPORTS.filter((r) => r.categoryId === selectedCategory).map((report) => {
              const isCurrent = selectedReportId === report.id;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {report.nameBn}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          5. ACTUAL REPORT DOCUMENT (Print Ready, Interactive Table & Drill-Down)
          ========================================================================= */}
      <div
        id="report-document-body"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6 print:p-0 print:border-none print:shadow-none print:m-0"
      >
        {/* Formal Report Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {companyProfile.name}
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{companyProfile.tagline}</p>
              <p className="text-xs text-slate-500 mt-0.5">{companyProfile.address}</p>
              <p className="text-xs text-slate-500">
                ফোন: {companyProfile.phone} · ইমেইল: {companyProfile.email}
              </p>
              {companyProfile.vatNumber && (
                <p className="text-xs font-mono font-bold text-slate-600 mt-0.5">
                  ভ্যাট BIN: {companyProfile.vatNumber}
                </p>
              )}
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider print:bg-black">
                {reportResult.categoryTitle}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1.5">{reportResult.title}</h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                নির্বাচিত সময়সীমা: <span className="font-mono text-emerald-800">{reportResult.dateRangeText}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                রিপোর্ট প্রস্তুত সময়: {new Date().toLocaleString('bn-BD')}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Metric KPI Blocks */}
        {reportResult.kpis.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {reportResult.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 print:border-slate-300"
              >
                <span className="text-[11px] font-bold text-slate-500 block truncate">{kpi.label}</span>
                <span className={`text-lg sm:text-xl font-black font-mono tracking-tight block mt-1 ${kpi.color || 'text-slate-900'}`}>
                  {kpi.value}
                </span>
                {kpi.subtext && <span className="text-[10px] text-slate-400 block mt-0.5">{kpi.subtext}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Report Data Table Controls & Drill-Down Tip Banner */}
        <div className="space-y-2 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="এই রিপোর্টের ভেতরে লাইভ সার্চ..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-slate-400"
              />
            </div>

            <div className="text-xs font-bold text-slate-500">
              মোট রেকর্ড: <span className="font-mono text-slate-900 font-black">{reportResult.rows.length}</span> টি
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50/70 border border-emerald-200/80 px-3 py-1.5 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              💡 যেকোনো লেনদেন বা রো-এর ওপর ক্লিক করে বিস্তারিত চালান দেখুন, এডিট বা ডিলিট করুন এবং সরাসরি প্রিন্ট করুন।
            </span>
          </div>
        </div>

        {/* Printable & Interactive Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/90 print:border-black">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 uppercase font-black text-[11px] tracking-wider print:bg-slate-200 print:border-black">
                {reportResult.columns.map((col) => (
                  <th
                    key={col.id}
                    className={`py-3 px-3.5 ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 print:divide-slate-300">
              {reportResult.rows.length === 0 ? (
                <tr>
                  <td colSpan={reportResult.columns.length} className="py-12 text-center text-slate-400 font-medium">
                    নির্বাচিত তারিখ বা ফিল্টারের মধ্যে কোনো লেনদেন বা রেকর্ড নেই
                  </td>
                </tr>
              ) : (
                reportResult.rows.map((row, rowIdx) => (
                  <tr
                    key={row.id || rowIdx}
                    onClick={() => {
                      if (row.rawData || row.rawType) {
                        setSelectedRowDetail(row);
                      }
                    }}
                    className="hover:bg-emerald-50/50 transition-colors cursor-pointer print:hover:bg-transparent"
                    title="ক্লিক করে বিস্তারিত দেখুন"
                  >
                    {reportResult.columns.map((col) => (
                      <td
                        key={col.id}
                        className={`py-2.5 px-3.5 font-medium ${
                          col.isMono ? 'font-mono' : ''
                        } ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        }`}
                      >
                        {row[col.id] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
            {/* Summary Row */}
            {reportResult.summary && (
              <tfoot>
                <tr className="bg-slate-100/90 font-black border-t-2 border-slate-300 text-slate-900 print:bg-slate-200 print:border-black">
                  {reportResult.columns.map((col) => (
                    <td
                      key={col.id}
                      className={`py-3 px-3.5 font-mono ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {reportResult.summary![col.id] ?? ''}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Formal Signature Blocks for Print & Official Audit */}
        <div className="pt-16 pb-4 hidden print:grid grid-cols-3 gap-6 text-center text-xs font-bold text-slate-800">
          <div>
            <div className="border-t border-slate-400 pt-2">প্রস্তুতকারী (Prepared By)</div>
            <p className="text-[10px] text-slate-500 font-normal">হিসাব সহকারী</p>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-2">যাচাইকারী (Checked By)</div>
            <p className="text-[10px] text-slate-500 font-normal">অ্যাকাউন্টেট / ম্যানেজার</p>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-2">অনুমোদনকারী স্বাক্ষর (Authorized)</div>
            <p className="text-[10px] text-slate-500 font-normal">ম্যানেজিং ডিরেক্টর / স্বত্বাধিকারী</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <span>{printSettings.receiptFooterNote || 'সফটওয়্যার দ্বারা স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত ব্যবসায়িক রিপোর্ট।'}</span>
          <span className="font-mono">Software: BizAccount ERP & POS Suite</span>
        </div>
      </div>

      {/* =========================================================================
          6. TRANSACTION DRILL-DOWN MODAL (View, Edit, Delete, Print)
          ========================================================================= */}
      {selectedRowDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {selectedRowDetail.rawType === 'invoice'
                    ? 'বিক্রয় ইনভয়েস বিবরণ'
                    : selectedRowDetail.rawType === 'purchase'
                    ? 'ক্রয় চালান বিবরণ'
                    : selectedRowDetail.rawType === 'payment'
                    ? 'পেমেন্ট রসিদ বিবরণ'
                    : selectedRowDetail.rawType === 'expense'
                    ? 'খরচ ভাউচার বিবরণ'
                    : 'লেনদেন বিবরণ'}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {selectedRowDetail.invoiceNo ||
                    selectedRowDetail.billNo ||
                    selectedRowDetail.paymentNo ||
                    selectedRowDetail.expenseNo ||
                    selectedRowDetail.ref ||
                    selectedRowDetail.name ||
                    'রেকর্ড বিবরণ'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRowDetail(null)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-base transition-colors border border-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">তারিখ</span>
                  <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                    {selectedRowDetail.date || selectedRowDetail.timestamp || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">পার্টি / নাম</span>
                  <span className="font-bold text-slate-800 truncate mt-0.5 block">
                    {selectedRowDetail.customerName ||
                      selectedRowDetail.supplierName ||
                      selectedRowDetail.partyName ||
                      selectedRowDetail.name ||
                      'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">পেমেন্ট মাধ্যম</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">
                    {selectedRowDetail.method || selectedRowDetail.paymentMethod || 'ক্যাশ'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">স্ট্যাটাস</span>
                  <span className="font-bold text-emerald-700 mt-0.5 block">
                    {selectedRowDetail.status || 'সম্পন্ন'}
                  </span>
                </div>
              </div>

              {/* Items List (if invoice or purchase) */}
              {selectedRowDetail.rawData?.items && selectedRowDetail.rawData.items.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 block">পণ্যের বিবরণ (Itemized List):</span>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold">
                        <tr>
                          <th className="p-2">পণ্য</th>
                          <th className="p-2 text-right">পরিমাণ</th>
                          <th className="p-2 text-right">দর (৳)</th>
                          <th className="p-2 text-right">মোট (৳)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedRowDetail.rawData.items.map((it: any, i: number) => (
                          <tr key={i}>
                            <td className="p-2 font-medium">{it.productName}</td>
                            <td className="p-2 text-right font-mono">{it.qty}</td>
                            <td className="p-2 text-right font-mono">৳{Number(it.rate).toLocaleString()}</td>
                            <td className="p-2 text-right font-mono font-bold">৳{Number(it.total).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Financial Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                {selectedRowDetail.grandTotal && (
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>মোট বিল (Grand Total):</span>
                    <span className="font-mono text-sm">{selectedRowDetail.grandTotal}</span>
                  </div>
                )}
                {selectedRowDetail.paid && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>পরিশোধিত টাকা (Paid Amount):</span>
                    <span className="font-mono">{selectedRowDetail.paid}</span>
                  </div>
                )}
                {selectedRowDetail.due && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>অবশিষ্ট বকেয়া (Due Amount):</span>
                    <span className="font-mono">{selectedRowDetail.due}</span>
                  </div>
                )}
                {selectedRowDetail.amount && (
                  <div className="flex justify-between font-black text-slate-900 text-sm">
                    <span>মোট টাকা:</span>
                    <span className="font-mono">{selectedRowDetail.amount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Print Invoice */}
                <button
                  onClick={handlePrintTransaction}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট চালান</span>
                </button>

                {/* Edit Transaction */}
                <button
                  onClick={() => {
                    const type = selectedRowDetail.rawType;
                    setSelectedRowDetail(null);
                    if (type === 'invoice') setActiveTab('sales');
                    else if (type === 'purchase') setActiveTab('purchases');
                    else if (type === 'expense') setActiveTab('expenses');
                    else if (type === 'payment') setActiveTab('payments');
                    else if (type === 'customer') setActiveTab('customers');
                    else if (type === 'supplier') setActiveTab('suppliers');
                    else if (type === 'product') setActiveTab('products');
                    showToast('সংশ্লিষ্ট মডিউল খোলা হয়েছে');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>মডিউলে এডিট</span>
                </button>

                {/* Delete Transaction */}
                <button
                  onClick={handleDeleteTransaction}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছে ফেলুন (Delete)</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedRowDetail(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
