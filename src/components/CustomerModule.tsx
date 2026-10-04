import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Customer, Invoice, PaymentRecord, InvoiceItem } from '../types';
import {
  Users,
  Plus,
  Search,
  Download,
  Printer,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Camera,
  ArrowLeft,
  Share2,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  CreditCard,
  MessageCircle,
  Copy,
  Check,
  ChevronRight,
  Package,
  Layers,
  X,
} from 'lucide-react';
import { ImagePickerModal } from './ImagePickerModal';

export const CustomerModule: React.FC = () => {
  const {
    t,
    customers,
    invoices,
    payments,
    products,
    saveCustomer,
    deleteCustomer,
    saveInvoice,
    deleteInvoice,
    savePayment,
    deletePayment,
    getCustomerBalance,
    setPrintData,
    exportToCSV,
    showToast,
    companyProfile,
    setActiveTab,
  } = useApp();

  // Navigation: 'list' or 'profile'
  const [activeView, setActiveView] = useState<'list' | 'profile'>('list');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'due' | 'zero_due'>('all');

  // Customer Add / Edit Modal
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Customer Form State
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [creditLimit, setCreditLimit] = useState<number>(50000);
  const [notes, setNotes] = useState<string>('');
  const [isCustomerPhotoPickerOpen, setIsCustomerPhotoPickerOpen] = useState(false);

  // Quick Collect Payment Modal
  const [isCollectModalOpen, setIsCollectModalOpen] = useState<boolean>(false);
  const [collectCustomer, setCollectCustomer] = useState<Customer | null>(null);
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [collectMethod, setCollectMethod] = useState<'cash' | 'bank' | 'mobile_banking'>('cash');
  const [collectNotes, setCollectNotes] = useState<string>('');

  // Customer Profile Sub-Tabs
  const [profileTab, setProfileTab] = useState<'sales' | 'payments' | 'ledger'>('sales');

  // Edit Invoice Modal State
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editInvoiceDate, setEditInvoiceDate] = useState<string>('');
  const [editInvoicePaid, setEditInvoicePaid] = useState<number>(0);
  const [editInvoiceNotes, setEditInvoiceNotes] = useState<string>('');
  const [editInvoiceItems, setEditInvoiceItems] = useState<InvoiceItem[]>([]);

  // Edit Payment Modal State
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [editPaymentDate, setEditPaymentDate] = useState<string>('');
  const [editPaymentAmount, setEditPaymentAmount] = useState<number>(0);
  const [editPaymentMethod, setEditPaymentMethod] = useState<'cash' | 'bank' | 'mobile_banking'>('cash');
  const [editPaymentNotes, setEditPaymentNotes] = useState<string>('');

  // WhatsApp / Copy Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Selected customer resolution
  const activeCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return customers.find((c) => c.id === selectedCustomerId && !c.deletedAt) || null;
  }, [customers, selectedCustomerId]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (c.deletedAt) return false;
      const bal = getCustomerBalance(c.id);

      if (filterType === 'due' && bal.currentDue <= 0) return false;
      if (filterType === 'zero_due' && bal.currentDue > 0) return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [customers, searchTerm, filterType, getCustomerBalance]);

  // Overall statistics for Customer List
  const listStats = useMemo(() => {
    const active = customers.filter((c) => !c.deletedAt);
    let totalSales = 0;
    let totalPaid = 0;
    let totalDue = 0;

    active.forEach((c) => {
      const bal = getCustomerBalance(c.id);
      totalSales += bal.totalSales;
      totalPaid += bal.totalPaid;
      totalDue += Math.max(0, bal.currentDue);
    });

    return {
      count: active.length,
      totalSales,
      totalPaid,
      totalDue,
    };
  }, [customers, getCustomerBalance]);

  // Customer Sales Invoices
  const customerSales = useMemo(() => {
    if (!activeCustomer) return [];
    return invoices
      .filter((i) => !i.deletedAt && i.customerId === activeCustomer.id && (i.type === 'sale' || i.type === 'pos'))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [invoices, activeCustomer]);

  // Customer Payments
  const customerPayments = useMemo(() => {
    if (!activeCustomer) return [];
    return payments
      .filter(
        (p) =>
          !p.deletedAt &&
          p.type === 'in' &&
          p.partyType === 'customer' &&
          (p.partyId === activeCustomer.id || p.partyName.toLowerCase() === activeCustomer.name.toLowerCase())
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [payments, activeCustomer]);

  // Customer Ledger Statement Entries
  const customerLedgerEntries = useMemo(() => {
    if (!activeCustomer) return [];

    const entries: {
      date: string;
      description: string;
      refNo: string;
      debit: number;
      credit: number;
      runningBalance?: number;
    }[] = [];

    // Opening Balance
    if (activeCustomer.openingBalance !== 0) {
      entries.push({
        date: activeCustomer.createdAt.slice(0, 10),
        description: 'প্রারম্ভিক বকেয়া (Opening Balance)',
        refNo: 'INIT',
        debit: activeCustomer.openingBalance > 0 ? activeCustomer.openingBalance : 0,
        credit: activeCustomer.openingBalance < 0 ? Math.abs(activeCustomer.openingBalance) : 0,
      });
    }

    // Sales Invoices
    customerSales.forEach((inv) => {
      entries.push({
        date: inv.date,
        description: `বিক্রয় ইনভয়েস (${inv.type.toUpperCase()}) - ${inv.items.map((it) => `${it.productName} (${it.qty}${it.unit})`).join(', ')}`,
        refNo: inv.invoiceNo,
        debit: inv.grandTotal,
        credit: inv.paidAmount,
      });
    });

    // Sales Returns
    invoices
      .filter((i) => !i.deletedAt && i.customerId === activeCustomer.id && i.type === 'return')
      .forEach((ret) => {
        entries.push({
          date: ret.date,
          description: `বিক্রয় ফেরত (Sales Return)`,
          refNo: ret.invoiceNo,
          debit: 0,
          credit: ret.grandTotal,
        });
      });

    // Direct Collections In
    customerPayments.forEach((pay) => {
      entries.push({
        date: pay.date,
        description: `পেমেন্ট কালেকশন জমা (${pay.paymentMethod === 'cash' ? 'নগদ ক্যাশ' : pay.paymentMethod === 'bank' ? 'ব্যাংক' : 'মোবাইল ব্যাংকিং'}) ${pay.notes ? `[${pay.notes}]` : ''}`,
        refNo: pay.paymentNo,
        debit: 0,
        credit: pay.amount,
      });
    });

    // Sort chronologically and calculate running balance
    entries.sort((a, b) => (a.date > b.date ? 1 : -1));
    let running = 0;
    return entries.map((e) => {
      running += e.debit - e.credit;
      return {
        ...e,
        runningBalance: running,
      };
    });
  }, [activeCustomer, customerSales, customerPayments, invoices]);

  // Handlers for Add/Edit Customer
  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPhoto(undefined);
    setOpeningBalance(0);
    setCreditLimit(50000);
    setNotes('');
    setIsCustomerModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email || '');
    setAddress(c.address);
    setPhoto(c.photo);
    setOpeningBalance(c.openingBalance);
    setCreditLimit(c.creditLimit);
    setNotes(c.notes || '');
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('কাস্টমারের নাম লিখুন');
      return;
    }

    const payload: Customer = {
      id: editingCustomer ? editingCustomer.id : `CUST-${Date.now().toString().slice(-4)}`,
      name,
      phone,
      email,
      address,
      photo,
      openingBalance: Number(openingBalance),
      creditLimit: Number(creditLimit),
      notes,
      createdAt: editingCustomer ? editingCustomer.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    saveCustomer(payload);
    setIsCustomerModalOpen(false);
  };

  // Open Customer Profile
  const handleViewProfile = (c: Customer) => {
    setSelectedCustomerId(c.id);
    setActiveView('profile');
    setProfileTab('sales');
  };

  // Quick Collect Payment
  const handleOpenCollectPayment = (c: Customer) => {
    const bal = getCustomerBalance(c.id);
    setCollectCustomer(c);
    setCollectAmount(Math.max(0, bal.currentDue));
    setCollectMethod('cash');
    setCollectNotes('বকেয়া আদায়');
    setIsCollectModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectCustomer || collectAmount <= 0) {
      showToast('সঠিক টাকার পরিমাণ লিখুন');
      return;
    }

    const paymentPayload: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      paymentNo: `REC-${Date.now().toString().slice(-6)}`,
      type: 'in',
      partyType: 'customer',
      partyId: collectCustomer.id,
      partyName: collectCustomer.name,
      amount: Number(collectAmount),
      paymentMethod: collectMethod,
      date: new Date().toISOString().slice(0, 10),
      notes: collectNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    savePayment(paymentPayload);
    setIsCollectModalOpen(false);
  };

  // =========================================================================
  // TRANSACTION EDIT & DELETE HANDLERS (Requirement 3)
  // =========================================================================

  // 1. Edit Invoice
  const handleOpenEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setEditInvoiceDate(inv.date);
    setEditInvoicePaid(inv.paidAmount);
    setEditInvoiceNotes(inv.notes || '');
    setEditInvoiceItems(inv.items.map((it) => ({ ...it })));
  };

  const handleUpdateInvoiceItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) return;
    setEditInvoiceItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const discountVal = (item.rate * (item.discount || 0)) / 100;
          const total = (item.rate - discountVal) * newQty;
          return { ...item, qty: newQty, total };
        }
        return item;
      })
    );
  };

  const handleUpdateInvoiceItemRate = (index: number, newRate: number) => {
    if (newRate < 0) return;
    setEditInvoiceItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const discountVal = (newRate * (item.discount || 0)) / 100;
          const total = (newRate - discountVal) * item.qty;
          return { ...item, rate: newRate, total };
        }
        return item;
      })
    );
  };

  const handleRemoveInvoiceItem = (index: number) => {
    if (editInvoiceItems.length <= 1) {
      showToast('ইনভয়েসে কমপক্ষে একটি পণ্য থাকতে হবে');
      return;
    }
    setEditInvoiceItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveInvoiceEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    const subtotal = editInvoiceItems.reduce((sum, item) => sum + item.total, 0);
    const grandTotal = subtotal;
    const paid = Number(editInvoicePaid);
    const due = Math.max(0, grandTotal - paid);

    const updatedInvoice: Invoice = {
      ...editingInvoice,
      date: editInvoiceDate,
      items: editInvoiceItems,
      subtotal,
      grandTotal,
      paidAmount: paid,
      dueAmount: due,
      notes: editInvoiceNotes,
      updatedAt: new Date().toISOString(),
    };

    saveInvoice(updatedInvoice);
    setEditingInvoice(null);
    showToast('ইনভয়েস সফলভাবে আপডেট হয়েছে (কাস্টমার ব্যালেন্স ও স্টক অটো আপডেট)');
  };

  // 2. Delete Invoice
  const handleDeleteInvoice = (inv: Invoice) => {
    if (
      window.confirm(
        `আপনি কি নিশ্চিত যে ইনভয়েস ${inv.invoiceNo} (৳${inv.grandTotal}) মুছে ফেলতে চান?\nমুছে ফেললে কাস্টমার বকেয়া এবং স্টক স্বয়ংক্রিয়ভাবে সমন্বয় হবে।`
      )
    ) {
      deleteInvoice(inv.id, true);
    }
  };

  // 3. Edit Payment
  const handleOpenEditPayment = (pay: PaymentRecord) => {
    setEditingPayment(pay);
    setEditPaymentDate(pay.date);
    setEditPaymentAmount(pay.amount);
    setEditPaymentMethod(pay.paymentMethod);
    setEditPaymentNotes(pay.notes || '');
  };

  const handleSavePaymentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    if (editPaymentAmount <= 0) {
      showToast('টাকার পরিমাণ শূন্যের চেয়ে বেশি হতে হবে');
      return;
    }

    const updatedPayment: PaymentRecord = {
      ...editingPayment,
      date: editPaymentDate,
      amount: Number(editPaymentAmount),
      paymentMethod: editPaymentMethod,
      notes: editPaymentNotes,
      updatedAt: new Date().toISOString(),
    };

    savePayment(updatedPayment);
    setEditingPayment(null);
    showToast('পেমেন্ট সফলভাবে আপডেট হয়েছে (কাস্টমার ব্যালেন্স অটো সমন্বয়)');
  };

  // 4. Delete Payment
  const handleDeletePayment = (pay: PaymentRecord) => {
    if (
      window.confirm(
        `আপনি কি নিশ্চিত যে পেমেন্ট রসিদ ${pay.paymentNo} (৳${pay.amount}) মুছে ফেলতে চান?\nমুছে ফেললে কাস্টমার ব্যালেন্স স্বয়ংক্রিয়ভাবে সমন্বয় হবে।`
      )
    ) {
      deletePayment(pay.id, true);
    }
  };

  // Statement Print & PDF Launch
  const handlePrintStatement = (c: Customer) => {
    const bal = getCustomerBalance(c.id);
    setPrintData({
      type: 'statement',
      data: {
        party: c,
        customerId: c.id,
        customerName: c.name,
        customerPhone: c.phone,
        customerPhoto: c.photo,
        address: c.address,
        date: new Date().toISOString().slice(0, 10),
        entries: customerLedgerEntries,
        balance: bal,
        previousBalance: bal.openingBalance,
        grandTotal: bal.totalSales,
        paidAmount: bal.totalPaid,
        dueAmount: bal.currentDue,
      },
    });
  };

  // Generate WhatsApp Share Message
  const generateShareMessage = (c: Customer) => {
    const bal = getCustomerBalance(c.id);
    const dateStr = new Date().toLocaleDateString('bn-BD');
    return `আসসালামু আলাইকুম, ${c.name}।\n${companyProfile.name}-এর হিসাব বিবরণী (${dateStr}):\n\n📌 প্রারম্ভিক বকেয়া: ৳${bal.openingBalance.toLocaleString()}\n🛒 মোট ক্রয়/বিল: ৳${bal.totalSales.toLocaleString()}\n💵 মোট পরিশোধ/জমা: ৳${bal.totalPaid.toLocaleString()}\n🔴 অবশিষ্ট বর্তমান বকেয়া: ৳${bal.currentDue.toLocaleString()}\n\nবিস্তারিত স্টেটমেন্ট ও সহায়তার জন্য যোগাযোগ: ${companyProfile.phone}। ধন্যবাদ!`;
  };

  const handleCopyShareText = (c: Customer) => {
    const text = generateShareMessage(c);
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    showToast('হিসাব বিবরণী মেসেজ ক্লিপবোর্ডে কপি হয়েছে');
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleOpenWhatsApp = (c: Customer) => {
    const text = encodeURIComponent(generateShareMessage(c));
    let cleanPhone = c.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '88' + cleanPhone;
    }
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleExportCSV = () => {
    const headers = ['Customer ID', 'Name', 'Phone', 'Address', 'Credit Limit', 'Total Sales', 'Total Paid', 'Current Due'];
    const rows = filteredCustomers.map((c) => {
      const bal = getCustomerBalance(c.id);
      return [c.id, c.name, c.phone, c.address, c.creditLimit, bal.totalSales, bal.totalPaid, bal.currentDue];
    });
    exportToCSV('Customer_Ledger_List', headers, rows);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12 font-['Plus_Jakarta_Sans',_'Hind_Siliguri',_sans-serif]">
      {/* =====================================================================
          VIEW 1: CUSTOMER LIST (Requirement 1)
          ===================================================================== */}
      {activeView === 'list' && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                  CRM & Ledger
                </span>
                <span className="text-xs text-slate-400 font-medium">কাস্টমার বাকি খাতা</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <Users className="w-6 h-6 text-emerald-600" />
                <span>কাস্টমার তালিকা ও প্রোফাইল খাতা (Customer List)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                সকল কাস্টমারের ছবি, মোবাইল, ঠিকানা, মোট বিক্রয়, জমা এবং বকেয়ার পূর্ণ হিসাব
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>এক্সেল ডাউনলোড</span>
              </button>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন কাস্টমার যোগ করুন</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">মোট কাস্টমার</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{listStats.count} জন</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">সর্বমোট বিক্রয়</span>
              <div className="text-xl sm:text-2xl font-black text-indigo-700 mt-1">৳{listStats.totalSales.toLocaleString()}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">সর্বমোট জমা / প্রাপ্তি</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">৳{listStats.totalPaid.toLocaleString()}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">সর্বমোট বকেয়া পাওনা</span>
              <div className="text-xl sm:text-2xl font-black text-red-600 mt-1">৳{listStats.totalDue.toLocaleString()}</div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="কাস্টমার নাম, মোবাইল, ঠিকানা বা ID খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl text-xs border border-slate-200">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সকল ({customers.filter((c) => !c.deletedAt).length})
              </button>
              <button
                onClick={() => setFilterType('due')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterType === 'due' ? 'bg-white text-red-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বকেয়া আছে
              </button>
              <button
                onClick={() => setFilterType('zero_due')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterType === 'zero_due' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                পরিশোধিত
              </button>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3.5">কাস্টমার বিবরণ</th>
                    <th className="py-3 px-3">যোগাযোগ ও ঠিকানা</th>
                    <th className="py-3 px-3 text-right">মোট বিক্রয় (Sales)</th>
                    <th className="py-3 px-3 text-right">মোট জমা (Paid)</th>
                    <th className="py-3 px-3 text-right">বর্তমান বকেয়া (Due)</th>
                    <th className="py-3 px-3 text-center">হিসাব ও অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-bold text-xs">কোনো কাস্টমার তথ্য পাওয়া যায়নি</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">নতুন কাস্টমার যোগ করতে উপরের বাটনে চাপুন</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const bal = getCustomerBalance(cust.id);
                      const isOverLimit = cust.creditLimit > 0 && bal.currentDue > cust.creditLimit;

                      return (
                        <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors group">
                          {/* 1. Customer Photo & Name */}
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-3">
                              {/* Photo Avatar */}
                              <div
                                onClick={() => handleViewProfile(cust)}
                                className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center cursor-pointer hover:border-emerald-500 shadow-2xs group"
                                title="প্রোফাইল দেখুন"
                              >
                                {cust.photo ? (
                                  <img src={cust.photo} alt={cust.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                                    {cust.name.slice(0, 1)}
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div
                                  onClick={() => handleViewProfile(cust)}
                                  className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors text-xs truncate"
                                >
                                  {cust.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                                  <span>ID: {cust.id}</span>
                                  {cust.creditLimit > 0 && (
                                    <>
                                      <span>·</span>
                                      <span>লিমিট: ৳{cust.creditLimit.toLocaleString()}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Mobile & Address */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1 text-slate-800 font-mono text-[11px]">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <a href={`tel:${cust.phone}`} className="hover:text-emerald-600 hover:underline">
                                {cust.phone}
                              </a>
                            </div>
                            {cust.address && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 max-w-[200px] truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{cust.address}</span>
                              </div>
                            )}
                          </td>

                          {/* 3. Total Sales */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-indigo-700">
                            ৳{bal.totalSales.toLocaleString()}
                          </td>

                          {/* 4. Total Paid */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                            ৳{bal.totalPaid.toLocaleString()}
                          </td>

                          {/* 5. Current Due */}
                          <td className="py-3 px-3 text-right font-mono">
                            <div className={`font-black text-sm ${bal.currentDue > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                              ৳{bal.currentDue.toLocaleString()}
                            </div>
                            {isOverLimit && (
                              <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.2 rounded block mt-0.5">
                                লিমিট শেষ!
                              </span>
                            )}
                          </td>

                          {/* 6. Actions */}
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Open Profile Button */}
                              <button
                                onClick={() => handleViewProfile(cust)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                                title="সম্পূর্ণ হিসাব প্রোফাইল খুলুন"
                              >
                                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                <span>হিসাব প্রোফাইল</span>
                              </button>

                              {/* Quick Payment Collect */}
                              <button
                                onClick={() => handleOpenCollectPayment(cust)}
                                className="px-2 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs transition-colors cursor-pointer border border-emerald-200"
                                title="টাকা গ্রহণ / জমা করুন"
                              >
                                + জমা
                              </button>

                              {/* Edit Customer */}
                              <button
                                onClick={() => handleOpenEdit(cust)}
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="কাস্টমার তথ্য সম্পাদনা"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Customer */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`${cust.name}-কে রিসাইকেল বিনে মুছে ফেলতে চান?`)) {
                                    deleteCustomer(cust.id, true);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="কাস্টমার মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: CUSTOMER PROFILE (Requirement 2 & 3 & 4)
          ===================================================================== */}
      {activeView === 'profile' && activeCustomer && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('list')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600" />
              <span>← কাস্টমার তালিকায় ফিরে যান</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePrintStatement(activeCustomer)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>স্টেটমেন্ট প্রিন্ট / PDF</span>
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>WhatsApp শেয়ার</span>
              </button>
            </div>
          </div>

          {/* Customer Profile Banner Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                {/* Large Customer Photo with Camera Trigger (Requirement 5) */}
                <div
                  onClick={() => setIsCustomerPhotoPickerOpen(true)}
                  className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 hover:border-emerald-500 shrink-0 flex items-center justify-center cursor-pointer shadow-xs group transition-all"
                  title="ছবি পরিবর্তন বা ক্যামেরা দিয়ে নতুন ছবি তুলুন"
                >
                  {activeCustomer.photo ? (
                    <img src={activeCustomer.photo} alt={activeCustomer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl">
                      {activeCustomer.name.slice(0, 1)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-bold transition-opacity">
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span>ছবি বদল</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {activeCustomer.name}
                    </h2>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 rounded-md">
                      {activeCustomer.id}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                    <div className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <a href={`tel:${activeCustomer.phone}`} className="hover:underline font-bold">
                        {activeCustomer.phone}
                      </a>
                    </div>
                    {activeCustomer.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{activeCustomer.email}</span>
                      </div>
                    )}
                    {activeCustomer.address && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{activeCustomer.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleOpenCollectPayment(activeCustomer)}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  + বকেয়া টাকা গ্রহণ
                </button>
                <button
                  onClick={() => handleOpenEdit(activeCustomer)}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  তথ্য সম্পাদনা
                </button>
              </div>
            </div>
          </div>

          {/* 4 Summary Balance Metric Cards (Requirement 2) */}
          {(() => {
            const bal = getCustomerBalance(activeCustomer.id);
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    প্রারম্ভিক বকেয়া (Opening)
                  </span>
                  <div className="text-xl font-mono font-black text-slate-700 mt-1">
                    ৳{bal.openingBalance.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">হিসাব শুরুর স্থিতি</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    মোট বিক্রয় (Total Sales)
                  </span>
                  <div className="text-xl font-mono font-black text-indigo-700 mt-1">
                    ৳{bal.totalSales.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">{customerSales.length} টি চালান বিল</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    মোট জমা / আদায় (Paid)
                  </span>
                  <div className="text-xl font-mono font-black text-emerald-700 mt-1">
                    ৳{bal.totalPaid.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">{customerPayments.length} টি জমা রসিদ</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    বর্তমান বকেয়া (Total Due)
                  </span>
                  <div className={`text-xl font-mono font-black mt-1 ${bal.currentDue > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                    ৳{bal.currentDue.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">সর্বশেষ নিট পাওনা</span>
                </div>
              </div>
            );
          })()}

          {/* Profile Navigation Tabs */}
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <button
              onClick={() => setProfileTab('sales')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                profileTab === 'sales'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>বিক্রয় ইতিহাস (Sales History - {customerSales.length})</span>
            </button>

            <button
              onClick={() => setProfileTab('payments')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                profileTab === 'payments'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>পেমেন্ট ও জমা ইতিহাস (Payment History - {customerPayments.length})</span>
            </button>

            <button
              onClick={() => setProfileTab('ledger')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                profileTab === 'ledger'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>লেজার স্টেটমেন্ট (Statement Ledger)</span>
            </button>
          </div>

          {/* =================================================================
              SUB-TAB 1: ITEM-BY-ITEM SALES HISTORY (Requirement 2 & 3)
              ================================================================= */}
          {profileTab === 'sales' && (
            <div className="space-y-3">
              {customerSales.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
                  <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-bold">এই কাস্টমারের কাছে এখনো কোনো পণ্য বিক্রি করা হয়নি</p>
                </div>
              ) : (
                customerSales.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3"
                  >
                    {/* Invoice Top Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {inv.type === 'pos' ? 'POS' : 'INV'}
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-900 text-xs flex items-center gap-2">
                            <span>চালান নং: {inv.invoiceNo}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({inv.date} {inv.time})
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            পেমেন্ট মাধ্যম: {inv.paymentMethod === 'cash' ? 'নগদ ক্যাশ' : inv.paymentMethod === 'bank' ? 'ব্যাংক' : 'মোবাইল ব্যাংকিং'}
                          </span>
                        </div>
                      </div>

                      {/* Transaction Action Controls: Edit, Delete, Print (Requirement 3) */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setPrintData({
                              type: 'invoice',
                              data: inv,
                            })
                          }
                          className="px-2.5 py-1 text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          title="চালান প্রিন্ট"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>প্রিন্ট</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditInvoice(inv)}
                          className="px-2.5 py-1 text-slate-700 hover:text-amber-700 bg-slate-50 hover:bg-amber-50 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          title="ইনভয়েস এডিট"
                        >
                          <Edit className="w-3.5 h-3.5 text-amber-600" />
                          <span>এডিট</span>
                        </button>

                        <button
                          onClick={() => handleDeleteInvoice(inv)}
                          className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition-colors cursor-pointer"
                          title="ইনভয়েস মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Itemized Products Sold Table (Requirement 2) */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 text-[10px]">
                          <tr>
                            <th className="py-2 px-3">পণ্য নাম (Product Name)</th>
                            <th className="py-2 px-3 text-center">পরিমাণ (Quantity)</th>
                            <th className="py-2 px-3 text-right">দর (Rate)</th>
                            <th className="py-2 px-3 text-right">ছাড় (Discount)</th>
                            <th className="py-2 px-3 text-right">মোট টাকা (Total)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {inv.items.map((item, idx) => {
                            const matchedProd = products.find((p) => p.id === item.productId);
                            return (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-2 px-3">
                                  <div className="flex items-center gap-2">
                                    {matchedProd?.photo && (
                                      <img
                                        src={matchedProd.photo}
                                        alt={item.productName}
                                        className="w-6 h-6 rounded-md object-cover border border-slate-200"
                                      />
                                    )}
                                    <span className="font-semibold text-slate-800">{item.productName}</span>
                                  </div>
                                </td>
                                <td className="py-2 px-3 text-center font-mono">
                                  {item.qty} {item.unit}
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-slate-700">
                                  ৳{item.rate.toLocaleString()}
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-slate-500">
                                  {item.discount > 0 ? `${item.discount}%` : '-'}
                                </td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                  ৳{item.total.toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Invoice Footer Breakdown */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4 text-slate-600 font-medium">
                        <span>আইটেম সংখ্যা: {inv.items.length} টি</span>
                        {inv.notes && <span>মন্তব্য: {inv.notes}</span>}
                      </div>

                      <div className="flex items-center gap-5 font-mono text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] block">মোট বিল (Grand Total):</span>
                          <span className="font-bold text-slate-900">৳{inv.grandTotal.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">প্রাপ্ত টাকা (Received):</span>
                          <span className="font-bold text-emerald-700">৳{inv.paidAmount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">বকেয়া (Due):</span>
                          <span className={`font-black ${inv.dueAmount > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                            ৳{inv.dueAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* =================================================================
              SUB-TAB 2: PAYMENT HISTORY (Requirement 2 & 3)
              ================================================================= */}
          {profileTab === 'payments' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">বকেয়া আদায় ও জমা পেমেন্ট রেকর্ড</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">কাস্টমার থেকে প্রাপ্ত সকল নগদ ও ব্যাংক পেমেন্ট ভাউচার</p>
                </div>
                <button
                  onClick={() => handleOpenCollectPayment(activeCustomer)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
                >
                  + নতুন পেমেন্ট জমা নিন
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">তারিখ</th>
                      <th className="py-2.5 px-3">রসিদ নং (Receipt)</th>
                      <th className="py-2.5 px-3">পেমেন্ট মেথড</th>
                      <th className="py-2.5 px-3">মন্তব্য / বিবরণ</th>
                      <th className="py-2.5 px-3 text-right">জমা পরিমাণ (Amount)</th>
                      <th className="py-2.5 px-3 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customerPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          কোনো জমা পেমেন্ট রেকর্ড নেই
                        </td>
                      </tr>
                    ) : (
                      customerPayments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-600 font-mono">{pay.date}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{pay.paymentNo}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {pay.paymentMethod === 'cash' ? 'নগদ ক্যাশ' : pay.paymentMethod === 'bank' ? 'ব্যাংক' : 'মোবাইল ব্যাংকিং'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{pay.notes || '-'}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-700 text-sm">
                            ৳{pay.amount.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditPayment(pay)}
                                className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded cursor-pointer"
                                title="পেমেন্ট সম্পাদনা"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePayment(pay)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                                title="পেমেন্ট মুছুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SUB-TAB 3: COMPLETE LEDGER STATEMENT (Requirement 4)
              ================================================================= */}
          {profileTab === 'ledger' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">
                    {activeCustomer.name} · পূর্ণ লেজার খাতা (Ledger Statement)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    চালান ও জমার কালানুক্রমিক রানিং ব্যালেন্স বিবরণী
                  </p>
                </div>

                <button
                  onClick={() => handlePrintStatement(activeCustomer)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>স্টেটমেন্ট প্রিন্ট</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">তারিখ</th>
                      <th className="py-2.5 px-3">রেফারেন্স নং</th>
                      <th className="py-2.5 px-3">বিবরণ (Description)</th>
                      <th className="py-2.5 px-3 text-right">ডেবিট (+) [বিক্রয়]</th>
                      <th className="py-2.5 px-3 text-right">ক্রেডিট (-) [জমা]</th>
                      <th className="py-2.5 px-3 text-right">অবশিষ্ট ব্যালেন্স</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customerLedgerEntries.map((e, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500 font-mono">{e.date}</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">{e.refNo}</td>
                        <td className="py-2 px-3 text-slate-700">{e.description}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {e.debit > 0 ? `৳${e.debit.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                          {e.credit > 0 ? `৳${e.credit.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-slate-900">
                          ৳{(e.runningBalance ?? 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MODAL 1: ADD / EDIT CUSTOMER MODAL (Requirement 1 & 5)
          ===================================================================== */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingCustomer ? 'কাস্টমার তথ্য সম্পাদনা (Edit Customer)' : 'নতুন কাস্টমার নিবন্ধন (Add Customer)'}
              </h3>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Customer Photo Area (Requirement 5) */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200/90 rounded-xl">
                <div
                  onClick={() => setIsCustomerPhotoPickerOpen(true)}
                  className="relative w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-emerald-500 overflow-hidden flex flex-col items-center justify-center cursor-pointer group shadow-2xs transition-all shrink-0"
                  title="কাস্টমারের ছবি যোগ বা পরিবর্তন করুন"
                >
                  {photo ? (
                    <>
                      <img src={photo} alt="Customer" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                        পরিবর্তন
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 text-center px-1">ছবি যোগ</span>
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">কাস্টমার ছবি (Customer Photo)</span>
                    {photo && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                        ✓ ছবি সংরক্ষিত
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    গ্যালারি থেকে ফটো নির্বাচন করুন অথবা সরাসরি মোবাইল/ওয়েবক্যাম ক্যামেরা দিয়ে কাস্টমারের ছবি তুলুন
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsCustomerPhotoPickerOpen(true)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Camera className="w-3 h-3 text-emerald-600" />
                      <span>{photo ? 'ছবি পরিবর্তন / ক্যামেরা' : 'ক্যামেরা / গ্যালারি'}</span>
                    </button>
                    {photo && (
                      <button
                        type="button"
                        onClick={() => setPhoto(undefined)}
                        className="px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        ছবি মুছুন
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">কাস্টমার / প্রতিষ্ঠানের নাম *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: আলমগীর স্টোর বা জনাব মেহরাব হোসেন"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">মোবাইল ফোন নম্বর *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="018xxxxxxxx"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden font-mono focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@domain.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">দোকান বা বাসার সম্পূর্ণ ঠিকানা *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="যেমন: দোকান নং ১২, চকবাজার, ঢাকা"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      প্রারম্ভিক বকেয়া (Opening Due)
                    </label>
                    <input
                      type="number"
                      value={openingBalance}
                      onChange={(e) => setOpeningBalance(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold focus:border-emerald-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      সর্বোচ্চ বাকি সীমা (Credit Limit)
                    </label>
                    <input
                      type="number"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:border-emerald-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মন্তব্য (Notes)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="বিশেষ কোনো নির্দেশনা থাকলে লিখুন"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-2xs cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: QUICK COLLECT PAYMENT MODAL
          ===================================================================== */}
      {isCollectModalOpen && collectCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-emerald-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">কাস্টমার বকেয়া টাকা গ্রহণ (Payment In)</h3>
                <p className="text-[11px] text-emerald-200">{collectCustomer.name}</p>
              </div>
              <button
                onClick={() => setIsCollectModalOpen(false)}
                className="text-emerald-200 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="p-5 space-y-3.5 text-xs">
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-center">
                <span className="text-slate-600 text-[11px]">বর্তমান বকেয়া পাওনা:</span>
                <div className="text-2xl font-black font-mono text-red-600 mt-0.5">
                  ৳{getCustomerBalance(collectCustomer.id).currentDue.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">আদায়কৃত টাকার পরিমাণ *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-emerald-500 rounded-xl text-lg font-black font-mono text-emerald-800 outline-hidden bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মেথড</label>
                <select
                  value={collectMethod}
                  onChange={(e) => setCollectMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden bg-white font-semibold"
                >
                  <option value="cash">নগদ ক্যাশ (Cash)</option>
                  <option value="bank">ব্যাংক ট্রান্সফার / চেক (Bank)</option>
                  <option value="mobile_banking">মোবাইল ব্যাংকিং (bKash/Nagad/Rocket)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">মন্তব্য (Notes)</label>
                <input
                  type="text"
                  value={collectNotes}
                  onChange={(e) => setCollectNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-2xs cursor-pointer"
                >
                  টাকা জমা করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: EDIT INVOICE MODAL (Requirement 3)
          ===================================================================== */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">বিক্রয় ইনভয়েস সম্পাদনা (Edit Invoice)</h3>
                <p className="text-[11px] text-slate-400 font-mono">চালান নং: {editingInvoice.invoiceNo}</p>
              </div>
              <button
                onClick={() => setEditingInvoice(null)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveInvoiceEdit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">চালানের তারিখ</label>
                  <input
                    type="date"
                    required
                    value={editInvoiceDate}
                    onChange={(e) => setEditInvoiceDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পরিশোধিত / প্রাপ্ত টাকা</label>
                  <input
                    type="number"
                    min="0"
                    value={editInvoicePaid}
                    onChange={(e) => setEditInvoicePaid(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl outline-hidden font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2">পণ্যের তালিকা ও দর/পরিমাণ পরিবর্তন:</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[10px]">
                      <tr>
                        <th className="py-2 px-3">পণ্য</th>
                        <th className="py-2 px-3 text-center w-24">পরিমাণ</th>
                        <th className="py-2 px-3 text-right w-28">দর (৳)</th>
                        <th className="py-2 px-3 text-right">মোট টাকা</th>
                        <th className="py-2 px-2 text-center w-10">মুছুন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editInvoiceItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-semibold text-slate-800">{item.productName}</td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => handleUpdateInvoiceItemQty(idx, Number(e.target.value))}
                              className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              min="0"
                              value={item.rate}
                              onChange={(e) => handleUpdateInvoiceItemRate(idx, Number(e.target.value))}
                              className="w-20 px-1.5 py-1 border border-slate-300 rounded text-right font-mono font-bold"
                            />
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-black text-slate-900">
                            ৳{item.total.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveInvoiceItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">মন্তব্য (Notes)</label>
                <input
                  type="text"
                  value={editInvoiceNotes}
                  onChange={(e) => setEditInvoiceNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl outline-hidden"
                />
              </div>

              {/* Total Calculation Preview */}
              {(() => {
                const subtotal = editInvoiceItems.reduce((sum, item) => sum + item.total, 0);
                const due = Math.max(0, subtotal - Number(editInvoicePaid));
                return (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-slate-500">আপডেট মোট বিল:</span>
                      <span className="font-bold text-slate-900 ml-1">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">জমা:</span>
                      <span className="font-bold text-emerald-700 ml-1">৳{Number(editInvoicePaid).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">বকেয়া:</span>
                      <span className="font-black text-red-600 ml-1">৳{due.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-2xs cursor-pointer"
                >
                  ইনভয়েস আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: EDIT PAYMENT MODAL (Requirement 3)
          ===================================================================== */}
      {editingPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">পেমেন্ট রসিদ সম্পাদনা (Edit Payment)</h3>
                <p className="text-[11px] text-slate-400 font-mono">রসিদ নং: {editingPayment.paymentNo}</p>
              </div>
              <button
                onClick={() => setEditingPayment(null)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePaymentEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">পেমেন্টের তারিখ</label>
                <input
                  type="date"
                  required
                  value={editPaymentDate}
                  onChange={(e) => setEditPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">টাকার পরিমাণ (৳) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editPaymentAmount}
                  onChange={(e) => setEditPaymentAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-emerald-500 rounded-xl font-mono text-base font-black text-emerald-800 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মেথড</label>
                <select
                  value={editPaymentMethod}
                  onChange={(e) => setEditPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold outline-hidden"
                >
                  <option value="cash">নগদ ক্যাশ (Cash)</option>
                  <option value="bank">ব্যাংক (Bank)</option>
                  <option value="mobile_banking">মোবাইল ব্যাংকিং (bKash/Nagad)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">মন্তব্য (Notes)</label>
                <input
                  type="text"
                  value={editPaymentNotes}
                  onChange={(e) => setEditPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPayment(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-2xs cursor-pointer"
                >
                  পেমেন্ট আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: WHATSAPP SHARE MODAL (Requirement 4)
          ===================================================================== */}
      {isShareModalOpen && activeCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold">কাস্টমার স্টেটমেন্ট শেয়ার (WhatsApp)</h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-emerald-200 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 text-xs">
                নিচের হিসাব বার্তাটি সরাসরি কাস্টমারের WhatsApp-এ পাঠাতে পারেন অথবা কপি করে যেকোনো মাধ্যমে পাঠাতে পারেন:
              </p>

              {/* Formatted Message Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl whitespace-pre-line font-mono text-slate-800 leading-relaxed text-[11px]">
                {generateShareMessage(activeCustomer)}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleCopyShareText(activeCustomer)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>কপি সম্পন্ন হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>মেসেজ কপি করুন</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenWhatsApp(activeCustomer)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp-এ পাঠান</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CUSTOMER PHOTO PICKER & CAMERA MODAL (Requirement 5)
          ===================================================================== */}
      <ImagePickerModal
        isOpen={isCustomerPhotoPickerOpen}
        onClose={() => setIsCustomerPhotoPickerOpen(false)}
        currentImage={activeCustomer?.photo || photo}
        onImageSelected={(newImg) => {
          setPhoto(newImg);
          if (activeCustomer && activeView === 'profile') {
            saveCustomer({
              ...activeCustomer,
              photo: newImg,
              updatedAt: new Date().toISOString(),
            });
          }
        }}
        title="কাস্টমার ছবি নির্বাচন ও ক্যামেরা"
      />
    </div>
  );
};
