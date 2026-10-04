import {
  Customer,
  Supplier,
  Product,
  Invoice,
  Purchase,
  Expense,
  PaymentRecord,
  StockAdjustment,
  Employee,
  Attendance,
  Payroll,
  ManufacturingOrder,
  DeliveryChallan,
  AuditLogItem,
  ApprovalItem,
} from '../types';

export interface ReportCategory {
  id: string;
  nameBn: string;
  nameEn: string;
  count: number;
}

export interface ReportItemDef {
  id: string;
  categoryId: string;
  nameBn: string;
  nameEn: string;
  description: string;
}

export interface ReportKPI {
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

export interface ReportColumn {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  isMono?: boolean;
}

export interface ReportResult {
  reportId: string;
  title: string;
  categoryTitle: string;
  dateRangeText: string;
  kpis: ReportKPI[];
  columns: ReportColumn[];
  rows: Record<string, any>[];
  summary?: Record<string, any>;
}

export interface ReportFilterParams {
  fromDate: string;
  toDate: string;
  customerId?: string;
  supplierId?: string;
  productId?: string;
  category?: string;
  brand?: string;
  employeeName?: string;
  paymentMethod?: string;
  status?: string;
  searchQuery?: string;
}

// 22 COMPREHENSIVE CATEGORIES (Section 1 through 22)
export const REPORT_CATEGORIES: ReportCategory[] = [
  { id: 'sales', nameBn: '১. বিক্রয় রিপোর্ট', nameEn: 'Sales Reports', count: 27 },
  { id: 'purchase', nameBn: '২. ক্রয় রিপোর্ট', nameEn: 'Purchase Reports', count: 20 },
  { id: 'customer', nameBn: '৩. কাস্টমার / পার্টি রিপোর্ট', nameEn: 'Customer Reports', count: 13 },
  { id: 'supplier', nameBn: '৪. সাপ্লায়ার রিপোর্ট', nameEn: 'Supplier Reports', count: 10 },
  { id: 'product', nameBn: '৫. পণ্য / আইটেম রিপোর্ট', nameEn: 'Product Reports', count: 9 },
  { id: 'inventory', nameBn: '৬. ইনভেন্টরি ও স্টক রিপোর্ট', nameEn: 'Inventory Reports', count: 10 },
  { id: 'batch_expiry', nameBn: '৭. ব্যাচ ও মেয়াদোত্তীর্ণ রিপোর্ট', nameEn: 'Batch & Expiry Reports', count: 4 },
  { id: 'serial_warranty', nameBn: '৮. সিরিয়াল ও ওয়ারেন্টি রিপোর্ট', nameEn: 'Serial & Warranty', count: 4 },
  { id: 'expense', nameBn: '৯. খরচ রিপোর্ট', nameEn: 'Expense Reports', count: 8 },
  { id: 'payment', nameBn: '১০. পেমেন্ট রিপোর্ট', nameEn: 'Payment Reports', count: 7 },
  { id: 'due_balance', nameBn: '১১. বকেয়া ও ব্যালেন্স রিপোর্ট', nameEn: 'Due & Balance Reports', count: 6 },
  { id: 'profit_loss', nameBn: '১২. লাভ-ক্ষতি রিপোর্ট', nameEn: 'Profit & Loss', count: 7 },
  { id: 'accounting', nameBn: '১৩. হিসাববিজ্ঞান রিপোর্ট', nameEn: 'Accounting Reports', count: 8 },
  { id: 'cash_bank', nameBn: '১৪. ক্যাশ ও ব্যাংক রিপোর্ট', nameEn: 'Cash & Bank Reports', count: 5 },
  { id: 'orders', nameBn: '১৫. অর্ডার রিপোর্ট', nameEn: 'Order Reports', count: 3 },
  { id: 'delivery', nameBn: '১৬. ডেলিভারি ও চালান রিপোর্ট', nameEn: 'Delivery Reports', count: 3 },
  { id: 'returns', nameBn: '১৭. ফেরত রিপোর্ট', nameEn: 'Return Reports', count: 3 },
  { id: 'employee', nameBn: '১৮. কর্মী ও স্টাফ রিপোর্ট', nameEn: 'Employee Reports', count: 4 },
  { id: 'tax_vat', nameBn: '১৯. ভ্যাট ও ট্যাক্স রিপোর্ট', nameEn: 'Tax & VAT Reports', count: 3 },
  { id: 'manufacturing', nameBn: '২০. উৎপাদন ও কারখানা রিপোর্ট', nameEn: 'Manufacturing', count: 3 },
  { id: 'loans', nameBn: '২১. ঋণ ও হাওলাত রিপোর্ট', nameEn: 'Loan Reports', count: 2 },
  { id: 'advanced', nameBn: '২২. অডিট ও নিরাপত্তা রিপোর্ট', nameEn: 'Advanced Reports', count: 4 },
];

// ALL SUB-REPORTS REGISTERED
export const ALL_REPORTS: ReportItemDef[] = [
  // 1. Sales
  { id: 'sales_all', categoryId: 'sales', nameBn: 'সার্বিক বিক্রয় রিপোর্ট', nameEn: 'Sales Report', description: 'নির্দিষ্ট সময়ের সকল বিক্রয় ইনভয়েস ও বিস্তারিত' },
  { id: 'sales_daily', categoryId: 'sales', nameBn: 'দৈনিক বিক্রয় রিপোর্ট', nameEn: 'Daily Sales Report', description: 'প্রতিদিনের বিক্রয় ও আদায় বিশ্লেষণ' },
  { id: 'sales_weekly', categoryId: 'sales', nameBn: 'সাপ্তাহিক বিক্রয় রিপোর্ট', nameEn: 'Weekly Sales Report', description: 'সপ্তাহভিত্তিক বিক্রয় তুলনা' },
  { id: 'sales_monthly', categoryId: 'sales', nameBn: 'মাসিক বিক্রয় রিপোর্ট', nameEn: 'Monthly Sales Report', description: 'মাসভিত্তিক বিক্রয় ও আদায়ের ধারা' },
  { id: 'sales_yearly', categoryId: 'sales', nameBn: 'বাৎসরিক বিক্রয় রিপোর্ট', nameEn: 'Yearly Sales Report', description: 'বছরের মাসভিত্তিক বিক্রয় পর্যালোচনা' },
  { id: 'sales_custom_date', categoryId: 'sales', nameBn: 'কাস্টম তারিখ বিক্রয় রিপোর্ট', nameEn: 'Custom Date Sales Report', description: 'নির্দিষ্ট দুই তারিখের মধ্যবর্তী সার্বিক বিক্রয়' },
  { id: 'sales_transactions', categoryId: 'sales', nameBn: 'বিক্রয় ট্রানজেকশন রিপোর্ট', nameEn: 'Sales Transaction Report', description: 'প্রতিটি বিক্রয় ট্রানজেকশনের সম্পূর্ণ বিবরণ' },
  { id: 'sales_invoices', categoryId: 'sales', nameBn: 'বিক্রয় ইনভয়েস তালিকা', nameEn: 'Sales Invoice Report', description: 'সকল ইনভয়েসের ক্রমিক ও স্ট্যাটাস তালিকা' },
  { id: 'sales_items', categoryId: 'sales', nameBn: 'আইটেমভিত্তিক বিক্রয় রিপোর্ট', nameEn: 'Sales Item Report', description: 'প্রতিটি আইটেমের বিক্রীত পরিমাণ ও মোট মূল্য' },
  { id: 'sales_by_customer', categoryId: 'sales', nameBn: 'কাস্টমারভিত্তিক বিক্রয়', nameEn: 'Sales by Customer', description: 'কোন কাস্টমার কত টাকার পণ্য ক্রয় করেছেন' },
  { id: 'sales_by_product', categoryId: 'sales', nameBn: 'পণ্যভিত্তিক বিক্রয়', nameEn: 'Sales by Product', description: 'পণ্যভিত্তিক বিক্রয় পরিমাণ ও রাজস্ব' },
  { id: 'sales_by_category', categoryId: 'sales', nameBn: 'ক্যাটাগরিভিত্তিক বিক্রয়', nameEn: 'Sales by Category', description: 'ক্যাটাগরি অনুসারে মোট বিক্রয় বিশ্লেষণ' },
  { id: 'sales_by_brand', categoryId: 'sales', nameBn: 'ব্র্যান্ডভিত্তিক বিক্রয়', nameEn: 'Sales by Brand', description: 'ব্র্যান্ড অনুসারে বিক্রয় ও রাজস্ব' },
  { id: 'sales_by_employee', categoryId: 'sales', nameBn: 'বিক্রয়কর্মীভিত্তিক বিক্রয়', nameEn: 'Sales by Employee', description: 'বিক্রয়কর্মীর পারফরম্যান্স ও বিক্রয়' },
  { id: 'sales_by_payment_method', categoryId: 'sales', nameBn: 'পেমেন্ট পদ্ধতিভিত্তিক বিক্রয়', nameEn: 'Sales by Payment Method', description: 'ক্যাশ, ব্যাংক, বিকাশ ইত্যাদিতে বিক্রয়' },
  { id: 'sales_cash', categoryId: 'sales', nameBn: 'নগদ বিক্রয় রিপোর্ট', nameEn: 'Cash Sales Report', description: 'সম্পূর্ণ নগদ টাকায় পরিশোধিত বিক্রয়' },
  { id: 'sales_credit', categoryId: 'sales', nameBn: 'বাকিতে বিক্রয় রিপোর্ট', nameEn: 'Credit Sales Report', description: 'বকেয়া বা ক্রেডিট বিক্রয় তালিকা' },
  { id: 'sales_due', categoryId: 'sales', nameBn: 'বিক্রয় বকেয়া রিপোর্ট', nameEn: 'Sales Due Report', description: 'বিক্রয় থেকে তৈরি হওয়া নতুন বকেয়া' },
  { id: 'sales_received', categoryId: 'sales', nameBn: 'বিক্রয় আদায় রিপোর্ট', nameEn: 'Sales Received Report', description: 'বিক্রয়ের সময় সরাসরি প্রাপ্ত টাকা' },
  { id: 'sales_discount', categoryId: 'sales', nameBn: 'বিক্রয় ডিসকাউন্ট রিপোর্ট', nameEn: 'Sales Discount Report', description: 'বিক্রয়ে প্রদত্ত মোট ছাড় ও বিবরণ' },
  { id: 'sales_tax', categoryId: 'sales', nameBn: 'বিক্রয় ভ্যাট/ট্যাক্স রিপোর্ট', nameEn: 'Sales Tax/VAT Report', description: 'বিক্রয় থেকে সংগৃহীত ভ্যাট হিসাব' },
  { id: 'sales_returns', categoryId: 'sales', nameBn: 'বিক্রয় ফেরত রিপোর্ট', nameEn: 'Sales Return Report', description: 'গ্রাহক কর্তৃক ফেরতকৃত বিক্রয়' },
  { id: 'sales_cancelled', categoryId: 'sales', nameBn: 'বাতিল/পেন্ডিং বিক্রয় রিপোর্ট', nameEn: 'Cancelled Sales Report', description: 'বাতিলকৃত বা ড্রাফট ইনভয়েস' },
  { id: 'sales_bill_profit', categoryId: 'sales', nameBn: 'বিলভিত্তিক লাভ রিপোর্ট', nameEn: 'Bill-wise Profit Report', description: 'প্রতিটি ইনভয়েসে লাভ বা মার্জিন' },
  { id: 'sales_top_products', categoryId: 'sales', nameBn: 'সর্বোচ্চ বিক্রীত পণ্য (Top Selling)', nameEn: 'Top Selling Products', description: 'পরিমাণ ও মূল্যে শীর্ষ পণ্যসমূহ' },
  { id: 'sales_lowest_products', categoryId: 'sales', nameBn: 'সর্বনিম্ন বিক্রীত পণ্য (Lowest)', nameEn: 'Lowest Selling Products', description: 'সবচেয়ে কম বিক্রীত পণ্যের তালিকা' },
  { id: 'sales_summary', categoryId: 'sales', nameBn: 'দৈনিক ও মাসিক বিক্রয় সারসংক্ষেপ', nameEn: 'Daily & Monthly Sales Summary', description: 'তারিখভিত্তিক বিক্রয় সারসংক্ষেপ' },

  // 2. Purchases
  { id: 'purchase_all', categoryId: 'purchase', nameBn: 'সার্বিক ক্রয় রিপোর্ট', nameEn: 'Purchase Report', description: 'নির্দিষ্ট সময়ের সকল ক্রয় বিল' },
  { id: 'purchase_daily', categoryId: 'purchase', nameBn: 'দৈনিক ক্রয় রিপোর্ট', nameEn: 'Daily Purchase Report', description: 'প্রতিদিনের ক্রয় হিসাব' },
  { id: 'purchase_weekly', categoryId: 'purchase', nameBn: 'সাপ্তাহিক ক্রয় রিপোর্ট', nameEn: 'Weekly Purchase Report', description: 'সপ্তাহভিত্তিক ক্রয় চিত্র' },
  { id: 'purchase_monthly', categoryId: 'purchase', nameBn: 'মাসিক ক্রয় রিপোর্ট', nameEn: 'Monthly Purchase Report', description: 'মাসভিত্তিক ক্রয় খরচ' },
  { id: 'purchase_yearly', categoryId: 'purchase', nameBn: 'বাৎসরিক ক্রয় রিপোর্ট', nameEn: 'Yearly Purchase Report', description: 'বছরের মাসভিত্তিক সামগ্রিক ক্রয়' },
  { id: 'purchase_custom', categoryId: 'purchase', nameBn: 'কাস্টম তারিখ ক্রয় রিপোর্ট', nameEn: 'Custom Date Purchase Report', description: 'নির্দিষ্ট সময়সীমায় মোট ক্রয়' },
  { id: 'purchase_bills', categoryId: 'purchase', nameBn: 'ক্রয় বিল রিপোর্ট', nameEn: 'Purchase Bill Report', description: 'সাপ্লায়ার বিল ও ইনভয়েস নম্বর তালিকা' },
  { id: 'purchase_items', categoryId: 'purchase', nameBn: 'আইটেমভিত্তিক ক্রয় রিপোর্ট', nameEn: 'Purchase Item Report', description: 'আইটেম অনুযায়ী ক্রয়ের পরিমাণ ও দর' },
  { id: 'purchase_by_supplier', categoryId: 'purchase', nameBn: 'সাপ্লায়ারভিত্তিক ক্রয় রিপোর্ট', nameEn: 'Purchase by Supplier', description: 'কোন সাপ্লায়ার থেকে কত টাকার পণ্য আনা হয়েছে' },
  { id: 'purchase_by_product', categoryId: 'purchase', nameBn: 'পণ্যভিত্তিক ক্রয় রিপোর্ট', nameEn: 'Purchase by Product', description: 'পণ্যভিত্তিক মোট ক্রয়ের সারসংক্ষেপ' },
  { id: 'purchase_by_category', categoryId: 'purchase', nameBn: 'ক্যাটাগরিভিত্তিক ক্রয়', nameEn: 'Purchase by Category', description: 'ক্যাটাগরিভিত্তিক ক্রয়ের পরিমাণ' },
  { id: 'purchase_cash', categoryId: 'purchase', nameBn: 'নগদ ক্রয় রিপোর্ট', nameEn: 'Cash Purchase Report', description: 'সম্পূর্ণ ক্যাশ টাকায় পরিশোধিত ক্রয়' },
  { id: 'purchase_credit', categoryId: 'purchase', nameBn: 'বাকিতে ক্রয় রিপোর্ট', nameEn: 'Credit Purchase Report', description: 'সাপ্লায়ার বকেয়া রেখে ক্রয়' },
  { id: 'purchase_due', categoryId: 'purchase', nameBn: 'ক্রয় বকেয়া রিপোর্ট', nameEn: 'Purchase Due Report', description: 'সাপ্লায়ারদের পাওনা বকেয়া' },
  { id: 'purchase_paid', categoryId: 'purchase', nameBn: 'ক্রয় পরিশোধ রিপোর্ট', nameEn: 'Purchase Paid Report', description: 'ক্রয়ের বিপরীতে সরাসরি পরিশোধিত টাকা' },
  { id: 'purchase_discount', categoryId: 'purchase', nameBn: 'ক্রয় ডিসকাউন্ট রিপোর্ট', nameEn: 'Purchase Discount Report', description: 'সাপ্লায়ার থেকে প্রাপ্ত ছাড়' },
  { id: 'purchase_tax', categoryId: 'purchase', nameBn: 'ক্রয় ভ্যাট/ট্যাক্স রিপোর্ট', nameEn: 'Purchase Tax/VAT Report', description: 'ক্রয়ের ওপর পরিশোধিত ভ্যাট' },
  { id: 'purchase_returns', categoryId: 'purchase', nameBn: 'ক্রয় ফেরত রিপোর্ট', nameEn: 'Purchase Return Report', description: 'সাপ্লায়ারকে ফেরত দেওয়া মালের হিসাব' },
  { id: 'purchase_cancelled', categoryId: 'purchase', nameBn: 'বাতিল ক্রয় রিপোর্ট', nameEn: 'Cancelled Purchase Report', description: 'বাতিলকৃত ক্রয় চালান' },
  { id: 'purchase_summary', categoryId: 'purchase', nameBn: 'ক্রয় সারসংক্ষেপ রিপোর্ট', nameEn: 'Purchase Summary', description: 'মোট ক্রয়, পেইড ও ডিউ সারসংক্ষেপ' },

  // 3. Customer
  { id: 'customer_list', categoryId: 'customer', nameBn: 'কাস্টমার তালিকা রিপোর্ট', nameEn: 'Customer List Report', description: 'সকল কাস্টমারের নাম, ফোন, ব্যালেন্স ও ক্রেডিট লিমিট' },
  { id: 'customer_statement', categoryId: 'customer', nameBn: 'কাস্টমার স্টেটমেন্ট (খতিয়ান)', nameEn: 'Customer Statement', description: 'নির্দিষ্ট কাস্টমারের সম্পূর্ণ ডেবিট-ক্রেডিট লেনদেন' },
  { id: 'customer_ledger', categoryId: 'customer', nameBn: 'কাস্টমার লেজার রিপোর্ট', nameEn: 'Customer Ledger', description: 'রানিং ব্যালেন্স সহ পূর্ণাঙ্গ লেজার' },
  { id: 'customer_transactions', categoryId: 'customer', nameBn: 'কাস্টমার ট্রানজেকশন রিপোর্ট', nameEn: 'Customer Transaction Report', description: 'সকল গ্রাহকের বিক্রয় ও পেমেন্ট হিস্ট্রি' },
  { id: 'customer_sales', categoryId: 'customer', nameBn: 'কাস্টমারভিত্তিক বিক্রয় তালিকা', nameEn: 'Customer-wise Sales', description: 'প্রতি গ্রাহকের সর্বমোট ক্রয়ের ইতিহাস' },
  { id: 'customer_payments', categoryId: 'customer', nameBn: 'কাস্টমার পেমেন্ট / কালেকশন রিপোর্ট', nameEn: 'Customer Payment Report', description: 'গ্রাহক থেকে প্রাপ্ত আদায়ের ভাউচার' },
  { id: 'customer_due', categoryId: 'customer', nameBn: 'কাস্টমার বকেয়া রিপোর্ট', nameEn: 'Customer Due Report', description: 'সকল গ্রাহকের বর্তমান বাকি টাকার তালিকা' },
  { id: 'customer_due_statement', categoryId: 'customer', nameBn: 'বকেয়া গ্রাহক বিবরণী', nameEn: 'Customer Due Statement', description: 'বকেয়ার কারণ ও শেষ লেনদেন তারিখ' },
  { id: 'customer_aging', categoryId: 'customer', nameBn: 'কাস্টমার এইজিং রিপোর্ট (Aging)', nameEn: 'Customer Aging Report', description: '৩০ দিন, ৬০ দিন ও ৯০+ দিন পুরাতন বকেয়া' },
  { id: 'customer_credit_limit', categoryId: 'customer', nameBn: 'ক্রেডিট লিমিট অতিক্রম রিপোর্ট', nameEn: 'Customer Credit Limit Report', description: 'লিমিট শেষ বা কাছাকাছি গ্রাহকের তালিকা' },
  { id: 'customer_balance', categoryId: 'customer', nameBn: 'কাস্টমার ব্যালেন্স শিট', nameEn: 'Customer Balance Report', description: 'ওপেনিং, মোট সেল, আদায় ও ক্লোজিং ব্যালেন্স' },
  { id: 'customer_top', categoryId: 'customer', nameBn: 'শীর্ষ কাস্টমার রিপোর্ট (Top Customers)', nameEn: 'Top Customer Report', description: 'সর্বোচ্চ কেনাকাটা করা কাস্টমারদের তালিকা' },
  { id: 'customer_all', categoryId: 'customer', nameBn: 'সার্বিক কাস্টমার মাস্টার রিপোর্ট', nameEn: 'All Customers Report', description: 'গ্রাহকদের সম্পূর্ণ আর্থিক সংক্ষিপ্ত বিবরণ' },

  // 4. Supplier
  { id: 'supplier_list', categoryId: 'supplier', nameBn: 'সাপ্লায়ার তালিকা রিপোর্ট', nameEn: 'Supplier List Report', description: 'সকল সরবরাহকারীর ফোন, ঠিকানা ও ব্যালেন্স' },
  { id: 'supplier_statement', categoryId: 'supplier', nameBn: 'সাপ্লায়ার স্টেটমেন্ট / লেজার', nameEn: 'Supplier Statement', description: 'সাপ্লায়ারের সাথে মোট বিল ও পেমেন্ট হিস্ট্রি' },
  { id: 'supplier_ledger', categoryId: 'supplier', nameBn: 'সাপ্লায়ার খতিয়ান রিপোর্ট', nameEn: 'Supplier Ledger', description: 'তারিখভিত্তিক চালান ও জমা ভাউচার' },
  { id: 'supplier_purchases', categoryId: 'supplier', nameBn: 'সাপ্লায়ারভিত্তিক ক্রয় রিপোর্ট', nameEn: 'Supplier-wise Purchase', description: 'প্রতিটি কোম্পানির মোট সরবরাহকৃত বিল' },
  { id: 'supplier_payments', categoryId: 'supplier', nameBn: 'সাপ্লায়ার পরিশোধ রিপোর্ট', nameEn: 'Supplier Payment Report', description: 'সাপ্লায়ারকে প্রদানকৃত ব্যাংক/নগদ টাকা' },
  { id: 'supplier_due', categoryId: 'supplier', nameBn: 'সাপ্লায়ার পাওনা / বকেয়া রিপোর্ট', nameEn: 'Supplier Due Report', description: 'কোম্পানি কর্তৃক প্রদেয় বাকি টাকা' },
  { id: 'supplier_aging', categoryId: 'supplier', nameBn: 'সাপ্লায়ার এইজিং রিপোর্ট (Aging)', nameEn: 'Supplier Aging Report', description: 'বকেয়া বিলের সময়কাল বিশ্লেষণ' },
  { id: 'supplier_outstanding', categoryId: 'supplier', nameBn: 'সাপ্লায়ার আউটস্ট্যান্ডিং রিপোর্ট', nameEn: 'Supplier Outstanding Report', description: 'জরুরি পরিশোধযোগ্য পাওনার তালিকা' },
  { id: 'supplier_top', categoryId: 'supplier', nameBn: 'শীর্ষ সাপ্লায়ার রিপোর্ট (Top Suppliers)', nameEn: 'Top Supplier Report', description: 'সর্বোচ্চ ক্রয় সম্পন্ন হওয়া কোম্পানি' },
  { id: 'supplier_all', categoryId: 'supplier', nameBn: 'সার্বিক সাপ্লায়ার রিপোর্ট', nameEn: 'All Suppliers Report', description: 'সকল সরবরাহকারীর ব্যালেন্স শিট' },

  // 5. Product
  { id: 'product_list', categoryId: 'product', nameBn: 'পণ্য তালিকা ও ক্যাটালগ রিপোর্ট', nameEn: 'Product List Report', description: 'সকল পণ্যের ক্যাটাগরি, মূল্য ও বর্তমান স্টক' },
  { id: 'product_sales', categoryId: 'product', nameBn: 'পণ্যভিত্তিক বিক্রয় ও রাজস্ব', nameEn: 'Product-wise Sales Report', description: 'কোন পণ্য থেকে কত টাকা বিক্রয় হয়েছে' },
  { id: 'product_purchases', categoryId: 'product', nameBn: 'পণ্যভিত্তিক ক্রয় হিস্ট্রি', nameEn: 'Product-wise Purchase Report', description: 'কোন পণ্য কত মূল্যে ক্রয় করা হয়েছে' },
  { id: 'product_profit', categoryId: 'product', nameBn: 'পণ্যভিত্তিক মুনাফা রিপোর্ট', nameEn: 'Product-wise Profit Report', description: 'প্রতিটি পণ্যের লাভ বা মোট মার্জিন' },
  { id: 'product_stock', categoryId: 'product', nameBn: 'পণ্য স্টক ও অবস্থান রিপোর্ট', nameEn: 'Product-wise Stock Report', description: 'গুদাম ও শো-রুম ভিত্তিক পণ্যের মজুদ' },
  { id: 'product_price_list', categoryId: 'product', nameBn: 'খুচরা ও কাস্টমার মূল্য তালিকা', nameEn: 'Retail Price List', description: 'বিক্রয়মূল্য ও এমআরপি রেট কার্ড' },
  { id: 'product_wholesale_price', categoryId: 'product', nameBn: 'পাইকারি ও ডিলার মূল্য তালিকা', nameEn: 'Wholesale Price List', description: 'হোলসেল দর ও সর্বনিম্ন ক্রয়ের তালিকা' },
  { id: 'product_sku_barcode', categoryId: 'product', nameBn: 'বারকোড ও এসকেইউ রিপোর্ট', nameEn: 'SKU & Barcode Report', description: 'বারকোড ভিত্তিক পণ্য ম্যাপিং' },
  { id: 'product_category_brand', categoryId: 'product', nameBn: 'ক্যাটাগরি ও ব্র্যান্ড তালিকা', nameEn: 'Category & Brand Report', description: 'বিভাগভিত্তিক পণ্যের বিন্যাস' },

  // 6. Inventory
  { id: 'stock_current', categoryId: 'inventory', nameBn: 'বর্তমান স্টক রিপোর্ট', nameEn: 'Current Stock Report', description: 'দোকান ও গুদামে বিদ্যমান মজুদ মাল' },
  { id: 'stock_valuation', categoryId: 'inventory', nameBn: 'স্টক মূল্যায়ন রিপোর্ট (Valuation)', nameEn: 'Stock Valuation Report', description: 'ক্রয়মূল্য ও বিক্রয়মূল্যে মোট স্টকের মূল্য' },
  { id: 'stock_in', categoryId: 'inventory', nameBn: 'স্টক ইন রিপোর্ট (Stock In)', nameEn: 'Stock In Report', description: 'ক্রয় ও সমন্বয় থেকে আসা নতুন স্টক' },
  { id: 'stock_out', categoryId: 'inventory', nameBn: 'স্টক আউট রিপোর্ট (Stock Out)', nameEn: 'Stock Out Report', description: 'বিক্রয় ও ফেরতকৃত পণ্যের স্টক নির্গমন' },
  { id: 'stock_movement', categoryId: 'inventory', nameBn: 'স্টক মুভমেন্ট লেজার', nameEn: 'Stock Movement Ledger', description: 'পণ্য ওঠানামার পূর্ণাঙ্গ ইতিহাস' },
  { id: 'stock_low', categoryId: 'inventory', nameBn: 'স্বল্প স্টক সতর্কতা রিপোর্ট (Low Stock)', nameEn: 'Low Stock Report', description: 'মিনিমাম স্টকের নিচে থাকা পণ্যের জরুরি তালিকা' },
  { id: 'stock_out_of_stock', categoryId: 'inventory', nameBn: 'স্টক শেষ হওয়া পণ্য (Out of Stock)', nameEn: 'Out of Stock Report', description: 'শূন্য স্টকের পণ্যসমূহ' },
  { id: 'stock_fast_slow', categoryId: 'inventory', nameBn: 'দ্রুত ও ধীরগতির স্টক রিপোর্ট', nameEn: 'Fast & Slow Moving Stock', description: 'চলতি পণ্যের গতিবিধি বিশ্লেষণ' },
  { id: 'stock_adjustments', categoryId: 'inventory', nameBn: 'স্টক সমন্বয় ও নষ্ট পণ্য রিপোর্ট', nameEn: 'Stock Adjustment Report', description: 'ম্যানুয়াল সমন্বয়, ঘাটতি ও ড্যামেজ পণ্যের হিসাব' },
  { id: 'stock_warehouse', categoryId: 'inventory', nameBn: 'গুদামভিত্তিক স্টক রিপোর্ট', nameEn: 'Warehouse-wise Stock', description: 'নির্দিষ্ট গোডাউনের মালামাল' },

  // 7. Batch & Expiry
  { id: 'batch_list', categoryId: 'batch_expiry', nameBn: 'ব্যাচ রিপোর্ট ও স্টক', nameEn: 'Batch Report', description: 'ব্যাচ নম্বর অনুযায়ী পণ্যের মজুদ' },
  { id: 'batch_expiry', categoryId: 'batch_expiry', nameBn: 'মেয়াদোত্তীর্ণ পণ্য রিপোর্ট (Expired)', nameEn: 'Expired Product Report', description: 'মেয়াদ শেষ হয়ে যাওয়া মালের ক্ষতি বিশ্লেষণ' },
  { id: 'batch_near_expiry', categoryId: 'batch_expiry', nameBn: 'আসন্ন মেয়াদোত্তীর্ণ রিপোর্ট (Near Expiry)', nameEn: 'Near Expiry Report', description: 'আগামী ৩০ থেকে ৬০ দিনের মধ্যে মেয়াদ শেষ হবে এমন পণ্য' },
  { id: 'batch_mfg_date', categoryId: 'batch_expiry', nameBn: 'উৎপাদন ও মেয়াদ তারিখ রিপোর্ট', nameEn: 'Manufacturing Date Report', description: 'এমএফজি ও এক্সপায়ারি তারিখ তালিকা' },

  // 8. Serial & Warranty
  { id: 'serial_list', categoryId: 'serial_warranty', nameBn: 'সিরিয়াল নম্বর ও IMEI রিপোর্ট', nameEn: 'Serial Number Report', description: 'বৈদ্যুতিক যন্ত্র ও মোবাইলের আইএমইআই তালিকা' },
  { id: 'serial_sales', categoryId: 'serial_warranty', nameBn: 'সিরিয়াল লেনদেন ও বিক্রয় হিস্ট্রি', nameEn: 'Serial-wise Sales', description: 'কোন সিরিয়াল কোন কাস্টমারের কাছে বিক্রয় হয়েছে' },
  { id: 'warranty_active', categoryId: 'serial_warranty', nameBn: 'চলমান ওয়ারেন্টি রিপোর্ট', nameEn: 'Active Warranty Report', description: 'গ্রাহকের সক্রিয় ওয়ারেন্টি ও অবশিষ্ট মেয়াদ' },
  { id: 'warranty_expired', categoryId: 'serial_warranty', nameBn: 'মেয়াদোত্তীর্ণ ওয়ারেন্টি রিপোর্ট', nameEn: 'Expired Warranty Report', description: 'ওয়ারেন্টি শেষ হওয়া পণ্যের ইতিহাস' },

  // 9. Expense
  { id: 'expense_transactions', categoryId: 'expense', nameBn: 'খরচ লেনদেন রিপোর্ট', nameEn: 'Expense Transaction Report', description: 'প্রতিটি ব্যয়ের ভাউচার ও বিস্তারিত বিবরণ' },
  { id: 'expense_daily', categoryId: 'expense', nameBn: 'দৈনিক খরচ রিপোর্ট', nameEn: 'Daily Expense Report', description: 'প্রতিদিনের অফিস ও দোকান খরচ' },
  { id: 'expense_monthly', categoryId: 'expense', nameBn: 'মাসিক খরচ রিপোর্ট', nameEn: 'Monthly Expense Report', description: 'মাসভিত্তিক খরচের সার্বিক পর্যালোচনা' },
  { id: 'expense_category', categoryId: 'expense', nameBn: 'খাতভিত্তিক খরচ রিপোর্ট', nameEn: 'Expense Category Report', description: 'ভাড়া, বিদ্যুৎ, স্টাফ নাস্তা, পরিবহন ইত্যাদির খরচ' },
  { id: 'expense_payment_method', categoryId: 'expense', nameBn: 'পেমেন্ট মাধ্যমভিত্তিক খরচ', nameEn: 'Payment Method Expense', description: 'ক্যাশ, ব্যাংক ও বিকাশ মারফত খরচের হিসাব' },
  { id: 'expense_cash_bank', categoryId: 'expense', nameBn: 'ক্যাশ বনাম ব্যাংক খরচ রিপোর্ট', nameEn: 'Cash vs Bank Expense', description: 'নগদ ক্যাশ ও ব্যাংক ব্যালেন্স থেকে খরচের অনুপাত' },
  { id: 'expense_own_money', categoryId: 'expense', nameBn: 'মালিকের নিজস্ব অর্থ ও বাকি খরচ', nameEn: 'Own Money Paid Report', description: 'মালিকের পকেট থেকে দেওয়া টাকা যা কোম্পানির দায়' },
  { id: 'expense_highest', categoryId: 'expense', nameBn: 'সর্বোচ্চ খরচের খাত রিপোর্ট', nameEn: 'Highest Expense Report', description: 'কোম্পানির প্রধান ব্যয়ের বিশ্লেষণ' },

  // 10. Payment
  { id: 'payment_all', categoryId: 'payment', nameBn: 'সকল পেমেন্ট লেনদেন রিপোর্ট', nameEn: 'Payment Transaction Report', description: 'আদায় ও পরিশোধের সার্বিক ভাউচার তালিকা' },
  { id: 'payment_customer', categoryId: 'payment', nameBn: 'কাস্টমার পেমেন্ট / জমা রিপোর্ট', nameEn: 'Customer Collection Report', description: 'কাস্টমার থেকে সংগৃহীত বকেয়া ও অগ্রিম' },
  { id: 'payment_supplier', categoryId: 'payment', nameBn: 'সাপ্লায়ার পেমেন্ট / পরিশোধ রিপোর্ট', nameEn: 'Supplier Payment Report', description: 'সরবরাহকারীকে প্রদানকৃত অর্থ' },
  { id: 'payment_cash', categoryId: 'payment', nameBn: 'নগদ ক্যাশ পেমেন্ট রিপোর্ট', nameEn: 'Cash Payment Report', description: 'নগদে সম্পন্ন সকল আদান-প্রদান' },
  { id: 'payment_bank', categoryId: 'payment', nameBn: 'ব্যাংক পেমেন্ট রিপোর্ট', nameEn: 'Bank Payment Report', description: 'চেক ও অনলাইন ব্যাংক ট্রান্সফার' },
  { id: 'payment_mfs', categoryId: 'payment', nameBn: 'মোবাইল ব্যাংকিং পেমেন্ট রিপোর্ট', nameEn: 'Mobile Banking Report', description: 'বিকাশ, নগদ, রকেট লেনদেন তালিকা' },
  { id: 'payment_daily_monthly', categoryId: 'payment', nameBn: 'দৈনিক ও মাসিক পেমেন্ট সারসংক্ষেপ', nameEn: 'Payment Summary', description: 'প্রতিদিনের মোট ইন ও আউট ব্যালেন্স' },

  // 11. Due & Balance
  { id: 'due_customer', categoryId: 'due_balance', nameBn: 'গ্রাহক বকেয়া রিপোর্ট (Customer Due)', nameEn: 'Customer Due Report', description: 'বাজার থেকে প্রাপ্য মোট বাকি টাকা' },
  { id: 'due_supplier', categoryId: 'due_balance', nameBn: 'সাপ্লায়ার বকেয়া রিপোর্ট (Supplier Due)', nameEn: 'Supplier Payable Report', description: 'সরবরাহকারীদের পরিশোধযোগ্য মোট বাকি' },
  { id: 'due_total', categoryId: 'due_balance', nameBn: 'মোট বকেয়া ও দেনা-পাওনা বিবরণী', nameEn: 'Total Due & Receivable', description: 'নিট পাওনা বনাম দেনার সারসংক্ষেপ' },
  { id: 'due_aging', categoryId: 'due_balance', nameBn: 'বকেয়া সময়কাল বিশ্লেষণ (Aging Report)', nameEn: 'Due Aging Report', description: 'অতিপুরাতন ও ঝুঁকিপূর্ণ বকেয়া চিহ্নিতকরণ' },
  { id: 'due_received_vs_due', categoryId: 'due_balance', nameBn: 'আদায় বনাম বকেয়া অনুপাত', nameEn: 'Received vs Due Report', description: 'বিক্রয়ের কত শতাংশ নগদ ও কত শতাংশ বাকি' },
  { id: 'due_cash_balance', categoryId: 'due_balance', nameBn: 'কোম্পানি নগদ ক্যাশ ও ব্যালেন্স রিপোর্ট', nameEn: 'Company Cash Balance Report', description: 'হাতে থাকা নগদ অর্থ ও রিমেইনিং ব্যালেন্স' },

  // 12. Profit & Loss
  { id: 'profit_statement', categoryId: 'profit_loss', nameBn: 'লাভ ও ক্ষতি বিবরণী (Profit & Loss)', nameEn: 'Profit & Loss Statement', description: 'মোট বিক্রয়, পণ্যের ক্রয় খরচ ও সার্বিক নিট লাভ' },
  { id: 'profit_daily', categoryId: 'profit_loss', nameBn: 'দৈনিক লাভ রিপোর্ট', nameEn: 'Daily Profit Report', description: 'আজকের বিক্রয় থেকে উপার্জিত মোট মুনাফা' },
  { id: 'profit_monthly', categoryId: 'profit_loss', nameBn: 'মাসিক লাভ রিপোর্ট', nameEn: 'Monthly Profit Report', description: 'মাসিক আয় ও ব্যয়ের হিসাবের পর নিট লাভ' },
  { id: 'profit_yearly', categoryId: 'profit_loss', nameBn: 'বাৎসরিক লাভ রিপোর্ট', nameEn: 'Yearly Profit Report', description: 'পুরো আর্থিক বছরের প্রফিট মার্জিন' },
  { id: 'profit_billwise', categoryId: 'profit_loss', nameBn: 'বিলভিত্তিক লাভ রিপোর্ট (Bill-wise Profit)', nameEn: 'Bill-wise Profit', description: 'প্রতিটি সেলস মেমোতে কত টাকা লাভ হলো' },
  { id: 'profit_productwise', categoryId: 'profit_loss', nameBn: 'পণ্যভিত্তিক লাভ রিপোর্ট', nameEn: 'Product-wise Profit', description: 'সর্বোচ্চ লাভজনক ও লোকসানি পণ্যের তালিকা' },
  { id: 'profit_gross_net', categoryId: 'profit_loss', nameBn: 'গ্রস ও নিট প্রফিট মার্জিন', nameEn: 'Gross vs Net Margin', description: 'মোট মুনাফা ও খরচ পরবর্তী নিট মুনাফার হার' },

  // 13. Accounting
  { id: 'acc_daybook', categoryId: 'accounting', nameBn: 'ডে বুক (Day Book / দৈনিক জাবেদা)', nameEn: 'Day Book', description: 'প্রতিদিনের সকল বিক্রয়, ক্রয়, খরচ ও পেমেন্টের জাবেদা' },
  { id: 'acc_general_ledger', categoryId: 'accounting', nameBn: 'জেনারেল লেজার (সাধারণ খতিয়ান)', nameEn: 'General Ledger', description: 'সকল হিসাব খাতের কেন্দ্রীয় লেজার' },
  { id: 'acc_cashbook', categoryId: 'accounting', nameBn: 'ক্যাশ বুক (নগদান বহি)', nameEn: 'Cash Book', description: 'নগদ তহবিলের আগমন ও নির্গমন লেজার' },
  { id: 'acc_bankbook', categoryId: 'accounting', nameBn: 'ব্যাংক বুক (ব্যাংক বহি)', nameEn: 'Bank Book', description: 'ব্যাংক একাউন্ট সমূহের ডেবিট ও ক্রেডিট বিবরণী' },
  { id: 'acc_trial_balance', categoryId: 'accounting', nameBn: 'রেওয়ামিল (Trial Balance)', nameEn: 'Trial Balance', description: 'সকল খতিয়ানের ডেবিট ও ক্রেডিট উদ্বৃত্তের সমতা' },
  { id: 'acc_balance_sheet', categoryId: 'accounting', nameBn: 'উদ্বৃত্তপত্র / ব্যালেন্স শিট', nameEn: 'Balance Sheet', description: 'সম্পত্তি (Assets) বনাম দায় (Liabilities) ও মালিকানা' },
  { id: 'acc_cash_flow', categoryId: 'accounting', nameBn: 'নগদ প্রবাহ বিবরণী (Cash Flow)', nameEn: 'Cash Flow Statement', description: 'অপারেশনাল, ইনভেস্টিং ও ফিন্যান্সিয়াল ক্যাশ ফ্লো' },
  { id: 'acc_income_expense', categoryId: 'accounting', nameBn: 'আয় বনাম ব্যয় সারসংক্ষেপ', nameEn: 'Income vs Expense', description: 'ব্যবসায়ের সর্বমোট রাজস্ব ও ব্যয়ের অনুপাত' },

  // 14. Cash & Bank
  { id: 'cb_cash_balance', categoryId: 'cash_bank', nameBn: 'নগদ ক্যাশ ব্যালেন্স রিপোর্ট', nameEn: 'Cash Balance Report', description: 'দোকানের ক্যাশ ড্রয়ার ও সিন্দুকের নগদ স্থিতি' },
  { id: 'cb_cash_in_out', categoryId: 'cash_bank', nameBn: 'ক্যাশ ইন ও ক্যাশ আউট রিপোর্ট', nameEn: 'Daily Cash In & Out', description: 'দৈনিক ক্যাশ ট্রানজেকশনের সম্পূর্ণ তালিকা' },
  { id: 'cb_bank_accounts', categoryId: 'cash_bank', nameBn: 'ব্যাংক হিসাব বিবরণী ও স্থিতি', nameEn: 'Bank Accounts Balance', description: 'সকল ব্যাংকের ব্যালেন্স ও সাম্প্রতিক চেক' },
  { id: 'cb_mfs', categoryId: 'cash_bank', nameBn: 'মোবাইল ব্যাংকিং হিসাব (bKash/Nagad)', nameEn: 'Mobile Banking Balance', description: 'ডিজিটাল ওয়ালেটের ব্যালেন্স ও স্টেটমেন্ট' },
  { id: 'cb_flow_summary', categoryId: 'cash_bank', nameBn: 'তহবিল প্রবাহ ও ব্যালেন্স সামারি', nameEn: 'Fund Flow Summary', description: 'ক্যাশ, ব্যাংক ও এমএফএস ব্যালেন্সের সামগ্রিক যোগফল' },

  // 15. Orders
  { id: 'orders_sales', categoryId: 'orders', nameBn: 'বিক্রয় অর্ডার রিপোর্ট (Sales Orders)', nameEn: 'Sales Order Report', description: 'গ্রাহকদের অগ্রিম অর্ডার ও বর্তমান অবস্থা' },
  { id: 'orders_purchase', categoryId: 'orders', nameBn: 'ক্রয় অর্ডার রিপোর্ট (Purchase Orders)', nameEn: 'Purchase Order Report', description: 'সাপ্লায়ারদের দেওয়া ক্রয় অর্ডার' },
  { id: 'orders_pending_completed', categoryId: 'orders', nameBn: 'পেন্ডিং বনাম সম্পন্ন অর্ডার', nameEn: 'Order Status Report', description: 'অসম্পূর্ণ ডেলিভারি ও চালানের হিসাব' },

  // 16. Delivery
  { id: 'delivery_challans', categoryId: 'delivery', nameBn: 'ডেলিভারি চালান তালিকা রিপোর্ট', nameEn: 'Delivery Challan Report', description: 'মালের চালান নম্বর, রুট ও প্রাপ্তি স্বীকার' },
  { id: 'delivery_pending', categoryId: 'delivery', nameBn: 'পেন্ডিং ও সম্পন্ন ডেলিভারি রিপোর্ট', nameEn: 'Pending Delivery List', description: 'পথিমধ্যে থাকা মালামালের বর্তমান অবস্থান' },
  { id: 'delivery_by_person', categoryId: 'delivery', nameBn: 'ডেলিভারিম্যান ও রুট রিপোর্ট', nameEn: 'Delivery Person & Route', description: 'কর্মচারী অনুযায়ী ডেলিভারি ও কালেকশন' },

  // 17. Returns
  { id: 'returns_sales', categoryId: 'returns', nameBn: 'বিক্রয় ফেরত রিপোর্ট (Sales Return)', nameEn: 'Sales Return Report', description: 'গ্রাহকের ফেরত দেওয়া পণ্য ও ক্রেডিট নোট' },
  { id: 'returns_purchase', categoryId: 'returns', nameBn: 'ক্রয় ফেরত রিপোর্ট (Purchase Return)', nameEn: 'Purchase Return Report', description: 'সাপ্লায়ারকে ফেরত দেওয়া মাল ও ডেবিট নোট' },
  { id: 'returns_summary', categoryId: 'returns', nameBn: 'ফেরত সারসংক্ষেপ রিপোর্ট', nameEn: 'Return Summary', description: 'পরিমাণ ও টাকার অংকে মোট ফেরতের ক্ষতি' },

  // 18. Employee
  { id: 'emp_list', categoryId: 'employee', nameBn: 'কর্মী তালিকা ও প্রোফাইল রিপোর্ট', nameEn: 'Employee List', description: 'সকল স্টাফের পদবি, বেতন, মোবাইল ও শাখা' },
  { id: 'emp_performance', categoryId: 'employee', nameBn: 'কর্মী বিক্রয় ও কালেকশন পারফরম্যান্স', nameEn: 'Employee Performance', description: 'কে কত টাকার বিক্রয় বা বকেয়া আদায় করেছে' },
  { id: 'emp_attendance', categoryId: 'employee', nameBn: 'উপস্থিতি ও ওভারটাইম রিপোর্ট', nameEn: 'Attendance Report', description: 'হাজিরা, অনুপস্থিতি ও অতিরিক্ত ডিউটি' },
  { id: 'emp_salary', categoryId: 'employee', nameBn: 'বেতন প্রদান ও বকেয়া রিপোর্ট', nameEn: 'Salary Paid & Due', description: 'মাসের বেতন শিট, পরিশোধিত টাকা ও বকেয়া' },

  // 19. Tax / VAT
  { id: 'tax_summary', categoryId: 'tax_vat', nameBn: 'ভ্যাট ও ট্যাক্স সারসংক্ষেপ (VAT Summary)', nameEn: 'VAT Summary', description: 'সংগৃহীত ভ্যাট, প্রদত্ত ভ্যাট ও সরকারের প্রদেয়' },
  { id: 'tax_sales', categoryId: 'tax_vat', nameBn: 'বিক্রয় ভ্যাট রিপোর্ট (Output VAT)', nameEn: 'Sales Tax Report', description: 'বিক্রয় থেকে আদায়কৃত মূসক চালান' },
  { id: 'tax_purchase', categoryId: 'tax_vat', nameBn: 'ক্রয় ভ্যাট রিপোর্ট (Input VAT)', nameEn: 'Purchase Tax Report', description: 'ক্রয়ের সময় পরিশোধিত রিবেটযোগ্য মূসক' },

  // 20. Manufacturing
  { id: 'mfg_orders', categoryId: 'manufacturing', nameBn: 'উৎপাদন ব্যাচ ও অর্ডার রিপোর্ট', nameEn: 'Manufacturing Orders', description: 'তৈরিকৃত ফিনিশড গুডস ও তারিখ' },
  { id: 'mfg_consumption', categoryId: 'manufacturing', nameBn: 'কাঁচামাল ব্যবহার রিপোর্ট (Consumption)', nameEn: 'Raw Material Consumption', description: 'উৎপাদনে ব্যবহৃত উপাদানের হিসাব' },
  { id: 'mfg_costs', categoryId: 'manufacturing', nameBn: 'উৎপাদন ব্যয় ও লাভ রিপোর্ট', nameEn: 'Production Cost Report', description: 'ম্যাটেরিয়াল ও অতিরিক্ত প্রসেসিং খরচ' },

  // 21. Loans
  { id: 'loan_statement', categoryId: 'loans', nameBn: 'ঋণ ও হাওলাত স্টেটমেন্ট', nameEn: 'Loan Statement', description: 'ব্যাংক ও ব্যক্তির নিকট হতে গৃহীত বা প্রদত্ত ঋণ' },
  { id: 'loan_received_paid', categoryId: 'loans', nameBn: 'ঋণ গ্রহণ, পরিশোধ ও বর্তমান ব্যালেন্স', nameEn: 'Loan Received & Paid', description: 'আসল, কিস্তি পরিশোধ ও অবশিষ্ট স্থিতি' },

  // 22. Advanced
  { id: 'adv_all_transactions', categoryId: 'advanced', nameBn: 'মাস্টার ট্রানজেকশন অডিট রিপোর্ট', nameEn: 'All Transactions Report', description: 'সফটওয়্যারের সকল মডিউলের কেন্দ্রীয় ট্রানজেকশন তালিকা' },
  { id: 'adv_audit_log', categoryId: 'advanced', nameBn: 'ইউজার অ্যাক্টিভিটি ও অডিট ট্রেইল', nameEn: 'Audit Log Report', description: 'কে কখন এন্ট্রি বা পরিবর্তন করেছে' },
  { id: 'adv_approvals', categoryId: 'advanced', nameBn: 'অনুমোদন ও ডিসকাউন্ট হিস্ট্রি', nameEn: 'Approval Queue History', description: 'অ্যাডমিন কর্তৃক অনুমোদিত বিশেষ রিকোয়েস্ট' },
  { id: 'adv_stock_adjustments', categoryId: 'advanced', nameBn: 'স্টক সমন্বয় ও ক্ষতির অডিট হিস্ট্রি', nameEn: 'Stock Adjustment History', description: 'স্টকে পরিবর্তন ও তার যুক্তিযুক্ত কারণ' },
];

export interface AppReportContextData {
  invoices: Invoice[];
  purchases: Purchase[];
  customers: Customer[];
  suppliers: Supplier[];
  products: Product[];
  expenses: Expense[];
  payments: PaymentRecord[];
  stockAdjustments: StockAdjustment[];
  employees: Employee[];
  attendances: Attendance[];
  payrolls: Payroll[];
  manufacturingOrders: ManufacturingOrder[];
  deliveries: DeliveryChallan[];
  auditLogs: AuditLogItem[];
  approvals: ApprovalItem[];
  dashboardMetrics: any;
  getCustomerBalance: (id: string) => { totalSales: number; totalPaid: number; currentDue: number };
  getSupplierBalance: (id: string) => { totalPurchases: number; totalPaid: number; currentPayable: number };
  getProductStock: (id: string) => { currentStock: number };
}

// MAIN AUTOMATIC CALCULATION ENGINE
export function calculateReport(
  reportId: string,
  filters: ReportFilterParams,
  data: AppReportContextData
): ReportResult {
  const { fromDate, toDate, searchQuery } = filters;
  const isDateInRange = (dateStr: string) => {
    if (!dateStr) return false;
    const d = dateStr.slice(0, 10);
    if (fromDate && d < fromDate) return false;
    if (toDate && d > toDate) return false;
    return true;
  };

  const reportDef = ALL_REPORTS.find((r) => r.id === reportId) || ALL_REPORTS[0];
  const categoryDef = REPORT_CATEGORIES.find((c) => c.id === reportDef.categoryId) || REPORT_CATEGORIES[0];
  const dateRangeText = fromDate && toDate ? `${fromDate} থেকে ${toDate}` : fromDate ? `${fromDate} হতে শুরু` : 'সকল সময়কাল';

  // 1. SALES REPORTS ENGINE
  if (reportDef.categoryId === 'sales') {
    let list = data.invoices.filter((i) => !i.deletedAt && isDateInRange(i.date));

    if (filters.customerId) list = list.filter((i) => i.customerId === filters.customerId);
    if (filters.paymentMethod) list = list.filter((i) => i.paymentMethod === filters.paymentMethod);
    if (filters.status) list = list.filter((i) => i.status === filters.status);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.invoiceNo.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q) ||
          (i.customerPhone && i.customerPhone.includes(q))
      );
    }

    if (reportId === 'sales_cash') list = list.filter((i) => i.paymentMethod === 'cash' || i.dueAmount === 0);
    if (reportId === 'sales_credit') list = list.filter((i) => i.dueAmount > 0);
    if (reportId === 'sales_cancelled') list = list.filter((i) => i.status === 'cancelled' || i.status === 'draft');
    if (reportId === 'sales_returns') list = list.filter((i) => i.type === 'return');

    const totalSales = list.reduce((s, i) => s + (i.grandTotal || 0), 0);
    const totalPaid = list.reduce((s, i) => s + (i.paidAmount || 0), 0);
    const totalDue = list.reduce((s, i) => s + (i.dueAmount || 0), 0);
    const totalDiscount = list.reduce((s, i) => s + (i.discountAmount || 0), 0);
    const totalTax = list.reduce((s, i) => s + (i.taxAmount || 0), 0);
    const totalCost = list.reduce(
      (s, i) => s + (i.items || []).reduce((sub, it) => sub + (it.purchaseCost || 0) * it.qty, 0),
      0
    );
    const grossProfit = totalSales - totalCost;

    // Bill-wise Profit Report
    if (reportId === 'sales_bill_profit') {
      const rows = list.map((inv, idx) => {
        const cost = (inv.items || []).reduce((sum, it) => sum + (it.purchaseCost || 0) * it.qty, 0);
        const profit = inv.grandTotal - cost;
        const margin = inv.grandTotal > 0 ? ((profit / inv.grandTotal) * 100).toFixed(1) : '0';

        return {
          id: inv.id,
          rawType: 'invoice',
          rawId: inv.id,
          rawData: inv,
          sl: idx + 1,
          invoiceNo: inv.invoiceNo,
          date: inv.date,
          customerName: inv.customerName,
          grandTotal: `৳${inv.grandTotal.toLocaleString()}`,
          cost: `৳${cost.toLocaleString()}`,
          profit: `৳${profit.toLocaleString()}`,
          margin: `${margin}%`,
        };
      });

      return {
        reportId,
        title: reportDef.nameBn,
        categoryTitle: categoryDef.nameBn,
        dateRangeText,
        kpis: [
          { label: 'মোট ইনভয়েস', value: list.length, color: 'text-slate-800' },
          { label: 'মোট বিক্রয় রাজস্ব', value: `৳${totalSales.toLocaleString()}`, color: 'text-blue-600' },
          { label: 'পণ্য ক্রয় ব্যয়', value: `৳${totalCost.toLocaleString()}`, color: 'text-slate-600' },
          { label: 'মোট অর্জিত লাভ', value: `৳${grossProfit.toLocaleString()}`, color: 'text-emerald-600' },
        ],
        columns: [
          { id: 'sl', label: 'নং', align: 'center' },
          { id: 'invoiceNo', label: 'ইনভয়েস নং', isMono: true },
          { id: 'date', label: 'তারিখ' },
          { id: 'customerName', label: 'কাস্টমার' },
          { id: 'grandTotal', label: 'বিক্রয় মূল্য (৳)', align: 'right', isMono: true },
          { id: 'cost', label: 'কেনা খরচ (৳)', align: 'right', isMono: true },
          { id: 'profit', label: 'লাভ (৳)', align: 'right', isMono: true },
          { id: 'margin', label: 'মার্জিন', align: 'center', isMono: true },
        ],
        rows,
        summary: {
          customerName: 'সর্বমোট:',
          grandTotal: `৳${totalSales.toLocaleString()}`,
          cost: `৳${totalCost.toLocaleString()}`,
          profit: `৳${grossProfit.toLocaleString()}`,
        },
      };
    }

    // Item-wise sales view or Top/Lowest selling products
    if (
      reportId === 'sales_items' ||
      reportId === 'sales_by_product' ||
      reportId === 'sales_top_products' ||
      reportId === 'sales_lowest_products'
    ) {
      const itemMap: Record<string, { id: string; name: string; qty: number; total: number; profit: number }> = {};
      list.forEach((inv) => {
        (inv.items || []).forEach((it) => {
          if (!itemMap[it.productId]) {
            itemMap[it.productId] = { id: it.productId, name: it.productName, qty: 0, total: 0, profit: 0 };
          }
          itemMap[it.productId].qty += it.qty;
          itemMap[it.productId].total += it.total;
          itemMap[it.productId].profit += it.total - (it.purchaseCost || 0) * it.qty;
        });
      });

      let itemList = Object.values(itemMap);
      if (reportId === 'sales_top_products') {
        itemList.sort((a, b) => b.qty - a.qty);
      } else if (reportId === 'sales_lowest_products') {
        itemList.sort((a, b) => a.qty - b.qty);
      }

      const rows = itemList.map((it, idx) => {
        const prod = data.products.find((p) => p.id === it.id);
        return {
          id: it.id,
          rawType: 'product',
          rawId: it.id,
          rawData: prod,
          sl: idx + 1,
          productName: it.name,
          qty: it.qty,
          total: `৳${it.total.toLocaleString()}`,
          profit: `৳${it.profit.toLocaleString()}`,
        };
      });

      return {
        reportId,
        title: reportDef.nameBn,
        categoryTitle: categoryDef.nameBn,
        dateRangeText,
        kpis: [
          { label: 'মোট বিক্রিত আইটেম সংখ্যা', value: rows.length, color: 'text-slate-800' },
          { label: 'মোট বিক্রিত কোয়ান্টিটি', value: rows.reduce((s, r) => s + r.qty, 0), color: 'text-blue-600' },
          { label: 'মোট বিক্রয় মূল্য', value: `৳${totalSales.toLocaleString()}`, color: 'text-emerald-600' },
          { label: 'মোট প্রাক্কলিত মুনাফা', value: `৳${grossProfit.toLocaleString()}`, color: 'text-purple-600' },
        ],
        columns: [
          { id: 'sl', label: 'নং', align: 'center' },
          { id: 'productName', label: 'পণ্যের নাম' },
          { id: 'qty', label: 'বিক্রিত পরিমাণ', align: 'right' },
          { id: 'total', label: 'মোট বিক্রয় (৳)', align: 'right', isMono: true },
          { id: 'profit', label: 'লাভ (৳)', align: 'right', isMono: true },
        ],
        rows,
      };
    }

    // Customer-wise sales summary
    if (reportId === 'sales_by_customer') {
      const custMap: Record<string, { id: string; name: string; phone: string; count: number; sales: number; paid: number; due: number }> = {};
      list.forEach((inv) => {
        const cId = inv.customerId || 'walk_in';
        if (!custMap[cId]) {
          custMap[cId] = { id: cId, name: inv.customerName, phone: inv.customerPhone || '', count: 0, sales: 0, paid: 0, due: 0 };
        }
        custMap[cId].count += 1;
        custMap[cId].sales += inv.grandTotal;
        custMap[cId].paid += inv.paidAmount;
        custMap[cId].due += inv.dueAmount;
      });

      const rows = Object.values(custMap).map((c, idx) => {
        const custObj = data.customers.find((cust) => cust.id === c.id);
        return {
          id: c.id,
          rawType: 'customer',
          rawId: c.id,
          rawData: custObj,
          sl: idx + 1,
          customerName: c.name,
          phone: c.phone || 'N/A',
          invoiceCount: c.count,
          totalSales: `৳${c.sales.toLocaleString()}`,
          paid: `৳${c.paid.toLocaleString()}`,
          due: `৳${c.due.toLocaleString()}`,
        };
      });

      return {
        reportId,
        title: reportDef.nameBn,
        categoryTitle: categoryDef.nameBn,
        dateRangeText,
        kpis: [
          { label: 'মোট ক্রেতা সংখ্যা', value: rows.length, color: 'text-slate-800' },
          { label: 'মোট ইনভয়েস', value: list.length, color: 'text-blue-600' },
          { label: 'মোট বিক্রয়', value: `৳${totalSales.toLocaleString()}`, color: 'text-emerald-600' },
          { label: 'মোট বকেয়া', value: `৳${totalDue.toLocaleString()}`, color: 'text-rose-600' },
        ],
        columns: [
          { id: 'sl', label: 'নং', align: 'center' },
          { id: 'customerName', label: 'কাস্টমারের নাম' },
          { id: 'phone', label: 'মোবাইল' },
          { id: 'invoiceCount', label: 'চালান সংখ্যা', align: 'center' },
          { id: 'totalSales', label: 'মোট বিক্রয় (৳)', align: 'right', isMono: true },
          { id: 'paid', label: 'আদায় (৳)', align: 'right', isMono: true },
          { id: 'due', label: 'বকেয়া (৳)', align: 'right', isMono: true },
        ],
        rows,
      };
    }

    // Default Sales Invoices View
    const rows = list.map((inv, idx) => ({
      id: inv.id,
      rawType: 'invoice',
      rawId: inv.id,
      rawData: inv,
      sl: idx + 1,
      invoiceNo: inv.invoiceNo,
      date: inv.date,
      customerName: inv.customerName,
      itemsCount: (inv.items || []).length,
      method: inv.paymentMethod === 'cash' ? 'নগদ ক্যাশ' : inv.paymentMethod === 'bank' ? 'ব্যাংক' : inv.paymentMethod === 'mobile_banking' ? 'মোবাইল ব্যাংকিং' : 'বাকি',
      subtotal: `৳${inv.subtotal.toLocaleString()}`,
      discount: `৳${inv.discountAmount.toLocaleString()}`,
      grandTotal: `৳${inv.grandTotal.toLocaleString()}`,
      paid: `৳${inv.paidAmount.toLocaleString()}`,
      due: `৳${inv.dueAmount.toLocaleString()}`,
      status: inv.status === 'completed' ? 'সম্পন্ন' : inv.status === 'cancelled' ? 'বাতিল' : 'পেন্ডিং',
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট চালান সংখ্যা', value: list.length, color: 'text-slate-800' },
        { label: 'মোট বিক্রয় (Grand Total)', value: `৳${totalSales.toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'নগদ আদায় (Paid)', value: `৳${totalPaid.toLocaleString()}`, color: 'text-blue-600' },
        { label: 'বর্তমান বকেয়া (Due)', value: `৳${totalDue.toLocaleString()}`, color: 'text-rose-600' },
        { label: 'মোট ছাড় (Discount)', value: `৳${totalDiscount.toLocaleString()}`, color: 'text-amber-600' },
        { label: 'ভ্যাট সংগ্রহ (VAT)', value: `৳${totalTax.toLocaleString()}`, color: 'text-teal-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'invoiceNo', label: 'ইনভয়েস নং', isMono: true },
        { id: 'date', label: 'তারিখ' },
        { id: 'customerName', label: 'কাস্টমার' },
        { id: 'method', label: 'পেমেন্ট মেথড' },
        { id: 'grandTotal', label: 'মোট বিল (৳)', align: 'right', isMono: true },
        { id: 'paid', label: 'আদায় (৳)', align: 'right', isMono: true },
        { id: 'due', label: 'বকেয়া (৳)', align: 'right', isMono: true },
        { id: 'status', label: 'স্ট্যাটাস', align: 'center' },
      ],
      rows,
      summary: {
        customerName: 'সর্বমোট:',
        grandTotal: `৳${totalSales.toLocaleString()}`,
        paid: `৳${totalPaid.toLocaleString()}`,
        due: `৳${totalDue.toLocaleString()}`,
      },
    };
  }

  // 2. PURCHASE REPORTS ENGINE
  if (reportDef.categoryId === 'purchase') {
    let list = data.purchases.filter((p) => !p.deletedAt && isDateInRange(p.date));

    if (filters.supplierId) list = list.filter((p) => p.supplierId === filters.supplierId);
    if (filters.paymentMethod) list = list.filter((p) => p.paymentMethod === filters.paymentMethod);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => p.billNo.toLowerCase().includes(q) || p.supplierName.toLowerCase().includes(q)
      );
    }

    if (reportId === 'purchase_cash') list = list.filter((p) => p.paymentMethod === 'cash' || p.dueAmount === 0);
    if (reportId === 'purchase_credit') list = list.filter((p) => p.dueAmount > 0);
    if (reportId === 'purchase_returns') list = list.filter((p) => p.type === 'return');

    const totalPurchases = list.reduce((s, p) => s + (p.grandTotal || 0), 0);
    const totalPaid = list.reduce((s, p) => s + (p.paidAmount || 0), 0);
    const totalDue = list.reduce((s, p) => s + (p.dueAmount || 0), 0);

    const rows = list.map((p, idx) => ({
      id: p.id,
      rawType: 'purchase',
      rawId: p.id,
      rawData: p,
      sl: idx + 1,
      billNo: p.billNo,
      date: p.date,
      supplierName: p.supplierName,
      itemsCount: (p.items || []).length,
      method: p.paymentMethod === 'cash' ? 'নগদ ক্যাশ' : p.paymentMethod === 'bank' ? 'ব্যাংক' : 'বাকি',
      grandTotal: `৳${p.grandTotal.toLocaleString()}`,
      paid: `৳${p.paidAmount.toLocaleString()}`,
      due: `৳${p.dueAmount.toLocaleString()}`,
      status: p.status === 'received' ? 'গ্রহণকৃত' : p.status === 'returned' ? 'ফেরত' : 'পেন্ডিং',
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট ক্রয় চালানের সংখ্যা', value: list.length, color: 'text-slate-800' },
        { label: 'মোট ক্রয় মূল্য', value: `৳${totalPurchases.toLocaleString()}`, color: 'text-blue-600' },
        { label: 'সাপ্লায়ার পরিশোধ (Paid)', value: `৳${totalPaid.toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'পাওনাদার বাকি (Payable Due)', value: `৳${totalDue.toLocaleString()}`, color: 'text-rose-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'billNo', label: 'বিল নম্বর', isMono: true },
        { id: 'date', label: 'তারিখ' },
        { id: 'supplierName', label: 'সাপ্লায়ার' },
        { id: 'method', label: 'পেমেন্ট মাধ্যম' },
        { id: 'grandTotal', label: 'মোট ক্রয় (৳)', align: 'right', isMono: true },
        { id: 'paid', label: 'পরিশোধ (৳)', align: 'right', isMono: true },
        { id: 'due', label: 'বকেয়া (৳)', align: 'right', isMono: true },
        { id: 'status', label: 'অবস্থা', align: 'center' },
      ],
      rows,
      summary: {
        supplierName: 'সর্বমোট:',
        grandTotal: `৳${totalPurchases.toLocaleString()}`,
        paid: `৳${totalPaid.toLocaleString()}`,
        due: `৳${totalDue.toLocaleString()}`,
      },
    };
  }

  // 3. CUSTOMER REPORTS ENGINE
  if (reportDef.categoryId === 'customer') {
    let custs = data.customers.filter((c) => !c.deletedAt);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      custs = custs.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
    }

    const calculated = custs.map((c) => {
      const bal = data.getCustomerBalance(c.id);
      return {
        ...c,
        totalSales: bal.totalSales,
        totalPaid: bal.totalPaid,
        currentDue: bal.currentDue,
      };
    });

    let activeCusts = calculated;
    if (reportId === 'customer_due') {
      activeCusts = calculated.filter((c) => c.currentDue > 0);
    } else if (reportId === 'customer_top') {
      activeCusts = [...calculated].sort((a, b) => b.totalSales - a.totalSales);
    }

    const totalDue = activeCusts.reduce((s, c) => s + (c.currentDue || 0), 0);
    const totalSales = activeCusts.reduce((s, c) => s + (c.totalSales || 0), 0);
    const totalPaid = activeCusts.reduce((s, c) => s + (c.totalPaid || 0), 0);

    const rows = activeCusts.map((c, idx) => ({
      id: c.id,
      rawType: 'customer',
      rawId: c.id,
      rawData: c,
      sl: idx + 1,
      name: c.name,
      phone: c.phone,
      address: c.address,
      creditLimit: `৳${(c.creditLimit || 0).toLocaleString()}`,
      totalSales: `৳${(c.totalSales || 0).toLocaleString()}`,
      totalPaid: `৳${(c.totalPaid || 0).toLocaleString()}`,
      currentDue: `৳${(c.currentDue || 0).toLocaleString()}`,
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট কাস্টমার সংখ্যা', value: activeCusts.length, color: 'text-slate-800' },
        { label: 'মোট কাস্টমার বিক্রয়', value: `৳${totalSales.toLocaleString()}`, color: 'text-blue-600' },
        { label: 'মোট আদায়কৃত টাকা', value: `৳${totalPaid.toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'বর্তমান কাস্টমার মোট বকেয়া', value: `৳${totalDue.toLocaleString()}`, color: 'text-rose-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'name', label: 'কাস্টমারের নাম' },
        { id: 'phone', label: 'মোবাইল' },
        { id: 'address', label: 'ঠিকানা' },
        { id: 'creditLimit', label: 'ক্রেডিট লিমিট', align: 'right', isMono: true },
        { id: 'totalSales', label: 'মোট বিক্রয় (৳)', align: 'right', isMono: true },
        { id: 'totalPaid', label: 'আদায় (৳)', align: 'right', isMono: true },
        { id: 'currentDue', label: 'বর্তমান বাকি (৳)', align: 'right', isMono: true },
      ],
      rows,
      summary: {
        address: 'সর্বমোট:',
        totalSales: `৳${totalSales.toLocaleString()}`,
        totalPaid: `৳${totalPaid.toLocaleString()}`,
        currentDue: `৳${totalDue.toLocaleString()}`,
      },
    };
  }

  // 4. SUPPLIER REPORTS ENGINE
  if (reportDef.categoryId === 'supplier') {
    let supps = data.suppliers.filter((s) => !s.deletedAt);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      supps = supps.filter((s) => s.name.toLowerCase().includes(q) || s.phone.includes(q));
    }

    const calculated = supps.map((s) => {
      const bal = data.getSupplierBalance(s.id);
      return {
        ...s,
        totalPurchases: bal.totalPurchases,
        totalPaid: bal.totalPaid,
        currentPayable: bal.currentPayable,
      };
    });

    let activeSupps = calculated;
    if (reportId === 'supplier_due' || reportId === 'supplier_outstanding') {
      activeSupps = calculated.filter((s) => s.currentPayable > 0);
    }

    const totalPurchases = activeSupps.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);
    const totalPaid = activeSupps.reduce((sum, s) => sum + (s.totalPaid || 0), 0);
    const totalPayable = activeSupps.reduce((sum, s) => sum + (s.currentPayable || 0), 0);

    const rows = activeSupps.map((s, idx) => ({
      id: s.id,
      rawType: 'supplier',
      rawId: s.id,
      rawData: s,
      sl: idx + 1,
      name: s.name,
      phone: s.phone,
      address: s.address,
      totalPurchases: `৳${(s.totalPurchases || 0).toLocaleString()}`,
      totalPaid: `৳${(s.totalPaid || 0).toLocaleString()}`,
      currentPayable: `৳${(s.currentPayable || 0).toLocaleString()}`,
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'সাপ্লায়ার সংখ্যা', value: activeSupps.length, color: 'text-slate-800' },
        { label: 'মোট ক্রয়কৃত চালান', value: `৳${totalPurchases.toLocaleString()}`, color: 'text-blue-600' },
        { label: 'মোট পরিশোধ', value: `৳${totalPaid.toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'পাওনাদার বাকি (Payable)', value: `৳${totalPayable.toLocaleString()}`, color: 'text-rose-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'name', label: 'সাপ্লায়ারের নাম' },
        { id: 'phone', label: 'ফোন' },
        { id: 'address', label: 'ঠিকানা' },
        { id: 'totalPurchases', label: 'মোট ক্রয় (৳)', align: 'right', isMono: true },
        { id: 'totalPaid', label: 'পরিশোধ (৳)', align: 'right', isMono: true },
        { id: 'currentPayable', label: 'পাওনা বাকি (৳)', align: 'right', isMono: true },
      ],
      rows,
      summary: {
        address: 'সর্বমোট:',
        totalPurchases: `৳${totalPurchases.toLocaleString()}`,
        totalPaid: `৳${totalPaid.toLocaleString()}`,
        currentPayable: `৳${totalPayable.toLocaleString()}`,
      },
    };
  }

  // 5. PRODUCT & 6. INVENTORY REPORTS ENGINE
  if (reportDef.categoryId === 'product' || reportDef.categoryId === 'inventory') {
    let prods = data.products.filter((p) => !p.deletedAt);
    if (filters.category) prods = prods.filter((p) => p.category === filters.category);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      prods = prods.filter(
        (p) => p.name.toLowerCase().includes(q) || p.barcode.includes(q) || p.sku.toLowerCase().includes(q)
      );
    }

    const calculated = prods.map((p) => {
      const s = data.getProductStock(p.id);
      const stockValBuy = s.currentStock * (p.purchasePrice || 0);
      const stockValSale = s.currentStock * (p.salePrice || 0);
      return {
        ...p,
        currentStock: s.currentStock,
        stockValBuy,
        stockValSale,
      };
    });

    let activeProds = calculated;
    if (reportId === 'stock_low') {
      activeProds = calculated.filter((p) => p.currentStock <= p.minStock && p.currentStock > 0);
    } else if (reportId === 'stock_out_of_stock') {
      activeProds = calculated.filter((p) => p.currentStock <= 0);
    }

    const totalStockQty = activeProds.reduce((sum, p) => sum + (p.currentStock || 0), 0);
    const totalValBuy = activeProds.reduce((sum, p) => sum + (p.stockValBuy || 0), 0);
    const totalValSale = activeProds.reduce((sum, p) => sum + (p.stockValSale || 0), 0);

    const rows = activeProds.map((p, idx) => ({
      id: p.id,
      rawType: 'product',
      rawId: p.id,
      rawData: p,
      sl: idx + 1,
      name: p.name,
      category: p.category,
      barcode: p.barcode,
      unit: p.unit,
      purchasePrice: `৳${(p.purchasePrice || 0).toLocaleString()}`,
      salePrice: `৳${(p.salePrice || 0).toLocaleString()}`,
      currentStock: p.currentStock,
      stockValBuy: `৳${(p.stockValBuy || 0).toLocaleString()}`,
      stockValSale: `৳${(p.stockValSale || 0).toLocaleString()}`,
      status: p.currentStock <= 0 ? 'স্টক শূন্য' : p.currentStock <= p.minStock ? 'স্বল্প স্টক' : 'পর্যাপ্ত',
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট আইটেম সংখ্যা', value: activeProds.length, color: 'text-slate-800' },
        { label: 'মোট স্টক কোয়ান্টিটি', value: totalStockQty, color: 'text-blue-600' },
        { label: 'স্টক ক্রয়মূল্য (Stock Valuation)', value: `৳${totalValBuy.toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'প্রত্যাশিত বিক্রয়মূল্য', value: `৳${totalValSale.toLocaleString()}`, color: 'text-purple-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'name', label: 'পণ্যের নাম' },
        { id: 'category', label: 'ক্যাটাগরি' },
        { id: 'barcode', label: 'বারকোড', isMono: true },
        { id: 'currentStock', label: 'বর্তমান স্টক', align: 'right' },
        { id: 'purchasePrice', label: 'কেনা দর (৳)', align: 'right', isMono: true },
        { id: 'salePrice', label: 'বিক্রয় দর (৳)', align: 'right', isMono: true },
        { id: 'stockValBuy', label: 'স্টক মূল্য (৳)', align: 'right', isMono: true },
        { id: 'status', label: 'অবস্থা', align: 'center' },
      ],
      rows,
      summary: {
        barcode: 'সর্বমোট:',
        currentStock: totalStockQty,
        stockValBuy: `৳${totalValBuy.toLocaleString()}`,
      },
    };
  }

  // 9. EXPENSE REPORTS ENGINE
  if (reportDef.categoryId === 'expense') {
    let exps = data.expenses.filter((e) => !e.deletedAt && isDateInRange(e.date));
    if (filters.paymentMethod) exps = exps.filter((e) => e.paymentMethod === filters.paymentMethod);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      exps = exps.filter((e) => e.category.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }

    const totalExpense = exps.reduce((s, e) => s + (e.amount || 0), 0);
    const cashExpense = exps.filter((e) => e.paymentMethod === 'cash').reduce((s, e) => s + e.amount, 0);
    const bankExpense = exps.filter((e) => e.paymentMethod === 'bank').reduce((s, e) => s + e.amount, 0);
    const mfsExpense = exps.filter((e) => e.paymentMethod === 'mobile_banking').reduce((s, e) => s + e.amount, 0);
    const ownMoneyExpense = exps.filter((e) => e.isOwnMoneyPaid || e.paymentMethod === 'own_money').reduce((s, e) => s + e.amount, 0);

    const rows = exps.map((e, idx) => ({
      id: e.id,
      rawType: 'expense',
      rawId: e.id,
      rawData: e,
      sl: idx + 1,
      expenseNo: e.expenseNo,
      date: e.date,
      category: e.category,
      description: e.description,
      method: e.paymentMethod === 'cash' ? 'নগদ ক্যাশ' : e.paymentMethod === 'bank' ? 'ব্যাংক' : e.paymentMethod === 'mobile_banking' ? 'মোবাইল ব্যাংকিং' : 'মালিকের অর্থ',
      paidBy: e.paidBy || 'কোম্পানি ক্যাশ',
      amount: `৳${e.amount.toLocaleString()}`,
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট খরচ ভাউচার', value: exps.length, color: 'text-slate-800' },
        { label: 'সর্বমোট খরচ (Total Expense)', value: `৳${totalExpense.toLocaleString()}`, color: 'text-rose-600' },
        { label: 'নগদ খরচ (Cash)', value: `৳${cashExpense.toLocaleString()}`, color: 'text-slate-700' },
        { label: 'ব্যাংক ও এমএফএস', value: `৳${(bankExpense + mfsExpense).toLocaleString()}`, color: 'text-blue-600' },
        { label: 'মালিকের নিজস্ব অর্থ (Due)', value: `৳${ownMoneyExpense.toLocaleString()}`, color: 'text-amber-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'expenseNo', label: 'ভাউচার নং', isMono: true },
        { id: 'date', label: 'তারিখ' },
        { id: 'category', label: 'খরচের খাত' },
        { id: 'description', label: 'বিবরণ' },
        { id: 'method', label: 'মাধ্যম' },
        { id: 'paidBy', label: 'পরিশোধকারী' },
        { id: 'amount', label: 'টাকার পরিমাণ (৳)', align: 'right', isMono: true },
      ],
      rows,
      summary: {
        paidBy: 'সর্বমোট:',
        amount: `৳${totalExpense.toLocaleString()}`,
      },
    };
  }

  // 10. PAYMENT REPORTS ENGINE
  if (reportDef.categoryId === 'payment') {
    let payments = data.payments.filter((p) => !p.deletedAt && isDateInRange(p.date));
    if (filters.paymentMethod) payments = payments.filter((p) => p.paymentMethod === filters.paymentMethod);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      payments = payments.filter((p) => p.partyName.toLowerCase().includes(q) || p.paymentNo.toLowerCase().includes(q));
    }

    if (reportId === 'payment_customer') payments = payments.filter((p) => p.type === 'in');
    if (reportId === 'payment_supplier') payments = payments.filter((p) => p.type === 'out');

    const totalIn = payments.filter((p) => p.type === 'in').reduce((s, p) => s + (p.amount || 0), 0);
    const totalOut = payments.filter((p) => p.type === 'out').reduce((s, p) => s + (p.amount || 0), 0);

    const rows = payments.map((p, idx) => ({
      id: p.id,
      rawType: 'payment',
      rawId: p.id,
      rawData: p,
      sl: idx + 1,
      paymentNo: p.paymentNo,
      date: p.date,
      type: p.type === 'in' ? 'প্রাপ্তি / জমা (In)' : 'পরিশোধ / প্রদান (Out)',
      partyName: p.partyName,
      partyType: p.partyType === 'customer' ? 'কাস্টমার' : p.partyType === 'supplier' ? 'সাপ্লায়ার' : 'অন্যান্য',
      method: p.paymentMethod === 'cash' ? 'নগদ ক্যাশ' : p.paymentMethod === 'bank' ? 'ব্যাংক' : 'মোবাইল ব্যাংকিং',
      amount: `৳${p.amount.toLocaleString()}`,
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট পেমেন্ট ট্রানজেকশন', value: payments.length, color: 'text-slate-800' },
        { label: 'মোট জমা / আদায় (Cash In)', value: `৳${totalIn.toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'মোট পরিশোধ / খরচ (Cash Out)', value: `৳${totalOut.toLocaleString()}`, color: 'text-rose-600' },
        { label: 'নিট তারল্য পার্থক্য', value: `৳${(totalIn - totalOut).toLocaleString()}`, color: 'text-blue-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'paymentNo', label: 'পেমেন্ট নং', isMono: true },
        { id: 'date', label: 'তারিখ' },
        { id: 'type', label: 'লেনদেনের ধরন' },
        { id: 'partyName', label: 'পার্টির নাম' },
        { id: 'partyType', label: 'পার্টির ধরন' },
        { id: 'method', label: 'মাধ্যম' },
        { id: 'amount', label: 'টাকা (৳)', align: 'right', isMono: true },
      ],
      rows,
      summary: {
        method: 'সর্বমোট ইন / আউট:',
        amount: `ইন: ৳${totalIn.toLocaleString()} | আউট: ৳${totalOut.toLocaleString()}`,
      },
    };
  }

  // 11. DUE & BALANCE REPORTS ENGINE
  if (reportDef.categoryId === 'due_balance') {
    // Due Aging analysis
    if (reportId === 'due_aging') {
      const today = new Date();
      const rows = data.customers
        .filter((c) => !c.deletedAt)
        .map((c, idx) => {
          const bal = data.getCustomerBalance(c.id);
          const custInvoices = data.invoices.filter((i) => i.customerId === c.id && !i.deletedAt && i.dueAmount > 0);

          let b30 = 0;
          let b60 = 0;
          let b90 = 0;

          custInvoices.forEach((inv) => {
            const diffDays = Math.floor((today.getTime() - new Date(inv.date).getTime()) / (1000 * 3600 * 24));
            if (diffDays <= 30) b30 += inv.dueAmount;
            else if (diffDays <= 60) b60 += inv.dueAmount;
            else b90 += inv.dueAmount;
          });

          // distribute opening balance to 90+ days
          b90 += Math.max(0, bal.currentDue - (b30 + b60 + b90));

          return {
            id: c.id,
            rawType: 'customer',
            rawId: c.id,
            rawData: c,
            sl: idx + 1,
            name: c.name,
            phone: c.phone,
            totalDue: `৳${bal.currentDue.toLocaleString()}`,
            d30: `৳${b30.toLocaleString()}`,
            d60: `৳${b60.toLocaleString()}`,
            d90: `৳${b90.toLocaleString()}`,
            status: bal.currentDue > (c.creditLimit || 50000) ? 'ঝুঁকিপূর্ণ' : 'নিয়মিত',
          };
        })
        .filter((r) => r.totalDue !== '৳0');

      return {
        reportId,
        title: reportDef.nameBn,
        categoryTitle: categoryDef.nameBn,
        dateRangeText,
        kpis: [
          { label: 'বকেয়াদার কাস্টমার সংখ্যা', value: rows.length, color: 'text-slate-800' },
          { label: 'মোট বাজার বাকি', value: `৳${data.dashboardMetrics.customerReceivable.toLocaleString()}`, color: 'text-rose-600' },
        ],
        columns: [
          { id: 'sl', label: 'নং', align: 'center' },
          { id: 'name', label: 'কাস্টমার' },
          { id: 'phone', label: 'মোবাইল' },
          { id: 'totalDue', label: 'মোট বকেয়া (৳)', align: 'right', isMono: true },
          { id: 'd30', label: '১-৩০ দিন (৳)', align: 'right', isMono: true },
          { id: 'd60', label: '৩১-৬০ দিন (৳)', align: 'right', isMono: true },
          { id: 'd90', label: '৬০+ দিন (৳)', align: 'right', isMono: true },
          { id: 'status', label: 'রিস্ক স্ট্যাটাস', align: 'center' },
        ],
        rows,
      };
    }

    // Default Due & Balance Comparison
    const rows = [
      { id: '1', sl: 1, name: 'কাস্টমার বকেয়া (Customer Receivables)', type: 'প্রাপ্য (+)', amount: `৳${data.dashboardMetrics.customerReceivable.toLocaleString()}`, desc: 'বাজার থেকে গ্রাহকদের নিকট প্রাপ্য টাকা' },
      { id: '2', sl: 2, name: 'সাপ্লায়ার দেনা (Supplier Payables)', type: 'প্রদেয় (-)', amount: `৳${data.dashboardMetrics.supplierPayable.toLocaleString()}`, desc: 'সরবরাহকারীদের পরিশোধযোগ্য বাকি' },
      { id: '3', sl: 3, name: 'কোম্পানি নগদ ক্যাশ স্থিতি (Cash in Hand)', type: 'নগদ তারল্য', amount: `৳${data.dashboardMetrics.companyCashBalance.toLocaleString()}`, desc: 'সিন্দুক ও ড্রয়ারে বিদ্যমান নগদ টাকা' },
      { id: '4', sl: 4, name: 'ব্যাংক হিসাব স্থিতি (Bank Balance)', type: 'ব্যাংক তারল্য', amount: `৳${data.dashboardMetrics.bankBalance.toLocaleString()}`, desc: 'সকল তফসিলি ব্যাংকের মোট জমা' },
      { id: '5', sl: 5, name: 'মোবাইল ব্যাংকিং (bKash/Nagad)', type: 'এমএফএস তারল্য', amount: `৳${data.dashboardMetrics.mobileBankingBalance.toLocaleString()}`, desc: 'ডিজিটাল ওয়ালেটে সংরক্ষিত অর্থ' },
      { id: '6', sl: 6, name: 'মালিকের নিজস্ব অর্থ (Due to Owner)', type: 'দায় (-)', amount: `৳${data.dashboardMetrics.ownMoneyPaid.toLocaleString()}`, desc: 'মালিক কর্তৃক কোম্পানিকে প্রদত্ত হাওলাত' },
    ];

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট কাস্টমার বাকি', value: `৳${data.dashboardMetrics.customerReceivable.toLocaleString()}`, color: 'text-rose-600' },
        { label: 'মোট সাপ্লায়ার দেনা', value: `৳${data.dashboardMetrics.supplierPayable.toLocaleString()}`, color: 'text-amber-600' },
        { label: 'কোম্পানি নগদ ক্যাশ', value: `৳${data.dashboardMetrics.companyCashBalance.toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'সর্বমোট ব্যাংক ও এমএফএস', value: `৳${(data.dashboardMetrics.bankBalance + data.dashboardMetrics.mobileBankingBalance).toLocaleString()}`, color: 'text-blue-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'name', label: 'হিসাব খাতের নাম' },
        { id: 'type', label: 'ব্যালেন্সের ধরন', align: 'center' },
        { id: 'amount', label: 'টাকার পরিমাণ (৳)', align: 'right', isMono: true },
        { id: 'desc', label: 'সংক্ষিপ্ত ব্যাখ্যা' },
      ],
      rows,
    };
  }

  // 12. PROFIT & LOSS ENGINE
  if (reportDef.categoryId === 'profit_loss') {
    const list = data.invoices.filter((i) => !i.deletedAt && i.status !== 'cancelled' && isDateInRange(i.date));
    const exps = data.expenses.filter((e) => !e.deletedAt && isDateInRange(e.date));

    const totalSales = list.reduce((s, i) => s + (i.grandTotal || 0), 0);
    const totalCost = list.reduce(
      (s, i) => s + (i.items || []).reduce((sub, it) => sub + (it.purchaseCost || 0) * it.qty, 0),
      0
    );
    const totalExpense = exps.reduce((s, e) => s + (e.amount || 0), 0);
    const grossProfit = totalSales - totalCost;
    const netProfit = grossProfit - totalExpense;

    const rows = [
      { id: '1', sl: 1, item: 'মোট বিক্রয় আয় (Total Revenue)', type: 'আয় (+)', amount: `৳${totalSales.toLocaleString()}`, note: `${list.length} টি সফল বিক্রয় ইনভয়েস` },
      { id: '2', sl: 2, item: 'বিক্রীত পণ্যের ক্রয় ব্যয় (COGS)', type: 'ব্যয় (-)', amount: `৳${totalCost.toLocaleString()}`, note: 'পণ্যের পাইকারি কেনা খরচ' },
      { id: '3', sl: 3, item: 'মোট লাভ (Gross Profit)', type: 'উদ্বৃত্ত (=)', amount: `৳${grossProfit.toLocaleString()}`, note: 'বিক্রয় আয় বিয়োগ পণ্য ক্রয় খরচ' },
      { id: '4', sl: 4, item: 'দোকান ও পরিচালন ব্যয় (Operating Expenses)', type: 'ব্যয় (-)', amount: `৳${totalExpense.toLocaleString()}`, note: `${exps.length} টি ভাউচারের মোট পরিচালন খরচ` },
      { id: '5', sl: 5, item: 'প্রকৃত নিট মুনাফা (Net Profit)', type: netProfit >= 0 ? 'নিট লাভ (★)' : 'নিট লোকসান (!)', amount: `৳${netProfit.toLocaleString()}`, note: 'কর ও সকল খরচ পরবর্তী চূড়ান্ত মুনাফা' },
    ];

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট বিক্রয় আয়', value: `৳${totalSales.toLocaleString()}`, color: 'text-blue-600' },
        { label: 'পণ্যের ক্রয় ব্যয় (COGS)', value: `৳${totalCost.toLocaleString()}`, color: 'text-slate-600' },
        { label: 'গ্রস প্রফিট (Gross Profit)', value: `৳${grossProfit.toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'পরিচালন খরচ (Expenses)', value: `৳${totalExpense.toLocaleString()}`, color: 'text-rose-600' },
        { label: 'চূড়ান্ত নিট লাভ (Net Profit)', value: `৳${netProfit.toLocaleString()}`, color: netProfit >= 0 ? 'text-emerald-700' : 'text-red-600' },
      ],
      columns: [
        { id: 'sl', label: 'ক্রমিক', align: 'center' },
        { id: 'item', label: 'আর্থিক বিবরণ' },
        { id: 'type', label: 'হিসাব প্রকার', align: 'center' },
        { id: 'amount', label: 'টাকার পরিমাণ (৳)', align: 'right', isMono: true },
        { id: 'note', label: 'মন্তব্য ও বিশ্লেষণ' },
      ],
      rows,
    };
  }

  // 13. ACCOUNTING & 14. CASH & BANK
  if (reportDef.categoryId === 'accounting' || reportDef.categoryId === 'cash_bank') {
    const list = data.invoices.filter((i) => !i.deletedAt && isDateInRange(i.date));
    const purch = data.purchases.filter((p) => !p.deletedAt && isDateInRange(p.date));
    const exps = data.expenses.filter((e) => !e.deletedAt && isDateInRange(e.date));
    const pays = data.payments.filter((p) => !p.deletedAt && isDateInRange(p.date));

    // Combine all ledger transactions
    const txs: Array<{ id: string; rawType: string; rawId: string; rawData: any; date: string; ref: string; desc: string; debit: number; credit: number; balance: number }> = [];

    list.forEach((i) => {
      txs.push({
        id: i.id,
        rawType: 'invoice',
        rawId: i.id,
        rawData: i,
        date: i.date,
        ref: i.invoiceNo,
        desc: `বিক্রয় চালান: ${i.customerName}`,
        debit: i.paidAmount,
        credit: 0,
        balance: 0,
      });
    });

    purch.forEach((p) => {
      txs.push({
        id: p.id,
        rawType: 'purchase',
        rawId: p.id,
        rawData: p,
        date: p.date,
        ref: p.billNo,
        desc: `ক্রয় বিল: ${p.supplierName}`,
        debit: 0,
        credit: p.paidAmount,
        balance: 0,
      });
    });

    exps.forEach((e) => {
      txs.push({
        id: e.id,
        rawType: 'expense',
        rawId: e.id,
        rawData: e,
        date: e.date,
        ref: e.expenseNo,
        desc: `অফিস খরচ: ${e.category} (${e.description})`,
        debit: 0,
        credit: e.amount,
        balance: 0,
      });
    });

    pays.forEach((p) => {
      txs.push({
        id: p.id,
        rawType: 'payment',
        rawId: p.id,
        rawData: p,
        date: p.date,
        ref: p.paymentNo,
        desc: `পেমেন্ট ভাউচার: ${p.partyName}`,
        debit: p.type === 'in' ? p.amount : 0,
        credit: p.type === 'out' ? p.amount : 0,
        balance: 0,
      });
    });

    txs.sort((a, b) => (a.date > b.date ? 1 : -1));

    let runningBal = 0;
    const rows = txs.map((t, idx) => {
      runningBal += t.debit - t.credit;
      return {
        id: t.id,
        rawType: t.rawType,
        rawId: t.rawId,
        rawData: t.rawData,
        sl: idx + 1,
        date: t.date,
        ref: t.ref,
        desc: t.desc,
        debit: t.debit ? `৳${t.debit.toLocaleString()}` : '-',
        credit: t.credit ? `৳${t.credit.toLocaleString()}` : '-',
        balance: `৳${runningBal.toLocaleString()}`,
      };
    });

    const totalDebit = txs.reduce((s, t) => s + t.debit, 0);
    const totalCredit = txs.reduce((s, t) => s + t.credit, 0);

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট এন্ট্রি সংখ্যা', value: txs.length, color: 'text-slate-800' },
        { label: 'মোট ডেবিট (Debit / ইনফ্লো)', value: `৳${totalDebit.toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'মোট ক্রেডিট (Credit / আউটফ্লো)', value: `৳${totalCredit.toLocaleString()}`, color: 'text-rose-600' },
        { label: 'সমাপনী ব্যালেন্স (Closing Balance)', value: `৳${runningBal.toLocaleString()}`, color: 'text-blue-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'date', label: 'তারিখ' },
        { id: 'ref', label: 'রেফারেন্স / ভাউচার', isMono: true },
        { id: 'desc', label: 'লেনদেনের বিবরণ' },
        { id: 'debit', label: 'ডেবিট (টাকা জমা)', align: 'right', isMono: true },
        { id: 'credit', label: 'ক্রেডিট (টাকা খরচ)', align: 'right', isMono: true },
        { id: 'balance', label: 'রানিং ব্যালেন্স (৳)', align: 'right', isMono: true },
      ],
      rows,
      summary: {
        desc: 'সর্বমোট ডেবিট ও ক্রেডিট:',
        debit: `৳${totalDebit.toLocaleString()}`,
        credit: `৳${totalCredit.toLocaleString()}`,
        balance: `৳${runningBal.toLocaleString()}`,
      },
    };
  }

  // 16. DELIVERY REPORTS ENGINE
  if (reportDef.categoryId === 'delivery') {
    const list = data.deliveries.filter((d) => !d.deletedAt && isDateInRange(d.deliveryDate));
    const rows = list.map((d, idx) => ({
      id: d.id,
      rawType: 'delivery',
      rawId: d.id,
      rawData: d,
      sl: idx + 1,
      challanNo: d.challanNo,
      date: d.deliveryDate,
      customerName: d.customerName,
      phone: d.phone,
      person: d.deliveryPerson,
      route: d.route,
      status: d.status === 'delivered' ? 'ডেলিভার্ড' : d.status === 'cancelled' ? 'বাতিল' : 'পেন্ডিং',
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট ডেলিভারি চালান', value: list.length, color: 'text-slate-800' },
        { label: 'সম্পন্ন ডেলিভারি', value: list.filter((d) => d.status === 'delivered').length, color: 'text-emerald-600' },
        { label: 'পেন্ডিং চালান', value: list.filter((d) => d.status === 'pending').length, color: 'text-amber-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'challanNo', label: 'চালান নং', isMono: true },
        { id: 'date', label: 'ডেলিভারি তারিখ' },
        { id: 'customerName', label: 'কাস্টমার' },
        { id: 'phone', label: 'ফোন' },
        { id: 'person', label: 'ডেলিভারিম্যান' },
        { id: 'route', label: 'রুট' },
        { id: 'status', label: 'স্ট্যাটাস', align: 'center' },
      ],
      rows,
    };
  }

  // 17. RETURN REPORTS ENGINE
  if (reportDef.categoryId === 'returns') {
    const salesReturns = data.invoices.filter((i) => i.type === 'return' && !i.deletedAt && isDateInRange(i.date));
    const purchReturns = data.purchases.filter((p) => p.type === 'return' && !p.deletedAt && isDateInRange(p.date));

    const rows: Record<string, any>[] = [];
    salesReturns.forEach((r, idx) => {
      rows.push({
        id: r.id,
        rawType: 'invoice',
        rawId: r.id,
        rawData: r,
        sl: idx + 1,
        type: 'বিক্রয় ফেরত',
        ref: r.invoiceNo,
        date: r.date,
        party: r.customerName,
        amount: `৳${r.grandTotal.toLocaleString()}`,
        status: 'গৃহীত',
      });
    });

    purchReturns.forEach((p, idx) => {
      rows.push({
        id: p.id,
        rawType: 'purchase',
        rawId: p.id,
        rawData: p,
        sl: salesReturns.length + idx + 1,
        type: 'ক্রয় ফেরত',
        ref: p.billNo,
        date: p.date,
        party: p.supplierName,
        amount: `৳${p.grandTotal.toLocaleString()}`,
        status: 'ফেরত সম্পন্ন',
      });
    });

    const totalReturnAmt = salesReturns.reduce((s, r) => s + r.grandTotal, 0) + purchReturns.reduce((s, p) => s + p.grandTotal, 0);

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট ফেরত চালান', value: rows.length, color: 'text-slate-800' },
        { label: 'বিক্রয় ফেরত সংখ্যা', value: salesReturns.length, color: 'text-amber-600' },
        { label: 'ক্রয় ফেরত সংখ্যা', value: purchReturns.length, color: 'text-blue-600' },
        { label: 'মোট ফেরতের অংক', value: `৳${totalReturnAmt.toLocaleString()}`, color: 'text-rose-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'type', label: 'ফেরতের ধরন' },
        { id: 'ref', label: 'চালান নং', isMono: true },
        { id: 'date', label: 'তারিখ' },
        { id: 'party', label: 'পার্টির নাম' },
        { id: 'amount', label: 'মূল্য (৳)', align: 'right', isMono: true },
        { id: 'status', label: 'স্ট্যাটাস', align: 'center' },
      ],
      rows,
    };
  }

  // 18. EMPLOYEE REPORTS ENGINE
  if (reportDef.categoryId === 'employee') {
    const emps = data.employees.filter((e) => !e.deletedAt);
    const rows = emps.map((e, idx) => ({
      id: e.id,
      rawType: 'employee',
      rawId: e.id,
      rawData: e,
      sl: idx + 1,
      empId: e.employeeId,
      name: e.name,
      designation: e.designation,
      department: e.department,
      phone: e.phone,
      salary: `৳${(e.salary || 0).toLocaleString()}`,
      joiningDate: e.joiningDate,
      status: e.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়',
    }));

    const totalSalary = emps.reduce((s, e) => s + (e.salary || 0), 0);

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট কর্মী সংখ্যা', value: emps.length, color: 'text-slate-800' },
        { label: 'মাসিক মূল পে-রোল খরচ', value: `৳${totalSalary.toLocaleString()}`, color: 'text-emerald-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'empId', label: 'আইডি', isMono: true },
        { id: 'name', label: 'কর্মীর নাম' },
        { id: 'designation', label: 'পদবি' },
        { id: 'department', label: 'বিভাগ' },
        { id: 'phone', label: 'ফোন' },
        { id: 'salary', label: 'বেতন (৳)', align: 'right', isMono: true },
        { id: 'status', label: 'অবস্থা', align: 'center' },
      ],
      rows,
      summary: {
        phone: 'মোট বেতন বিল:',
        salary: `৳${totalSalary.toLocaleString()}`,
      },
    };
  }

  // 19. TAX / VAT REPORTS ENGINE
  if (reportDef.categoryId === 'tax_vat') {
    const list = data.invoices.filter((i) => !i.deletedAt && i.status !== 'cancelled' && isDateInRange(i.date));
    const purch = data.purchases.filter((p) => !p.deletedAt && isDateInRange(p.date));

    const salesTax = list.reduce((s, i) => s + (i.taxAmount || 0), 0);
    const purchaseTax = purch.reduce((s, p) => s + (p.taxAmount || 0), 0);
    const netVatPayable = salesTax - purchaseTax;

    const rows = list.map((i, idx) => ({
      id: i.id,
      rawType: 'invoice',
      rawId: i.id,
      rawData: i,
      sl: idx + 1,
      invoiceNo: i.invoiceNo,
      date: i.date,
      customerName: i.customerName,
      subtotal: `৳${i.subtotal.toLocaleString()}`,
      vatAmount: `৳${i.taxAmount.toLocaleString()}`,
      grandTotal: `৳${i.grandTotal.toLocaleString()}`,
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'সংগৃহীত বিক্রয় ভ্যাট (Output VAT)', value: `৳${salesTax.toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'প্রদত্ত ক্রয় ভ্যাট (Input VAT)', value: `৳${purchaseTax.toLocaleString()}`, color: 'text-blue-600' },
        { label: 'সরকারকে প্রদেয় নিট ভ্যাট', value: `৳${netVatPayable.toLocaleString()}`, color: netVatPayable >= 0 ? 'text-purple-600' : 'text-slate-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'invoiceNo', label: 'ইনভয়েস নং', isMono: true },
        { id: 'date', label: 'তারিখ' },
        { id: 'customerName', label: 'কাস্টমার' },
        { id: 'subtotal', label: 'ট্যাক্সবিহীন বিল (৳)', align: 'right', isMono: true },
        { id: 'vatAmount', label: 'ভ্যাট পরিমাণ (৳)', align: 'right', isMono: true },
        { id: 'grandTotal', label: 'সর্বমোট বিল (৳)', align: 'right', isMono: true },
      ],
      rows,
      summary: {
        customerName: 'সর্বমোট ভ্যাট:',
        vatAmount: `৳${salesTax.toLocaleString()}`,
        grandTotal: `৳${list.reduce((s, i) => s + i.grandTotal, 0).toLocaleString()}`,
      },
    };
  }

  // 20. MANUFACTURING REPORTS ENGINE
  if (reportDef.categoryId === 'manufacturing') {
    const list = data.manufacturingOrders.filter((m) => !m.deletedAt && isDateInRange(m.date));
    const totalCost = list.reduce((s, m) => s + (m.totalCost || 0), 0);
    const rows = list.map((m, idx) => ({
      id: m.id,
      rawType: 'manufacturing',
      rawId: m.id,
      rawData: m,
      sl: idx + 1,
      orderNo: m.orderNo,
      date: m.date,
      productName: m.finishedProductName,
      targetQty: m.targetQty,
      bomCount: (m.bom || []).length,
      totalCost: `৳${(m.totalCost || 0).toLocaleString()}`,
      status: m.status === 'completed' ? 'উৎপাদিত' : 'ড্রাফট',
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট উৎপাদন ব্যাচ', value: list.length, color: 'text-slate-800' },
        { label: 'সর্বমোট উৎপাদন খরচ', value: `৳${totalCost.toLocaleString()}`, color: 'text-emerald-600' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'orderNo', label: 'উৎপাদন ব্যাচ নং', isMono: true },
        { id: 'date', label: 'তারিখ' },
        { id: 'productName', label: 'উৎপাদিত পণ্য' },
        { id: 'targetQty', label: 'পরিমাণ', align: 'right' },
        { id: 'bomCount', label: 'কাঁচামাল সংখ্যা', align: 'center' },
        { id: 'totalCost', label: 'মোট খরচ (৳)', align: 'right', isMono: true },
        { id: 'status', label: 'স্ট্যাটাস', align: 'center' },
      ],
      rows,
      summary: {
        productName: 'সর্বমোট খরচ:',
        totalCost: `৳${totalCost.toLocaleString()}`,
      },
    };
  }

  // 22. ADVANCED / AUDIT LOG REPORTS ENGINE
  if (reportDef.categoryId === 'advanced') {
    const logs = data.auditLogs.filter((l) => isDateInRange(l.timestamp));
    const rows = logs.map((l, idx) => ({
      id: l.id,
      rawType: 'audit',
      rawId: l.id,
      rawData: l,
      sl: idx + 1,
      timestamp: l.timestamp.replace('T', ' ').slice(0, 19),
      user: l.user,
      role: l.role,
      module: l.module,
      action: l.action,
      summary: l.summary,
    }));

    return {
      reportId,
      title: reportDef.nameBn,
      categoryTitle: categoryDef.nameBn,
      dateRangeText,
      kpis: [
        { label: 'মোট অডিট ইভেন্ট', value: logs.length, color: 'text-slate-800' },
      ],
      columns: [
        { id: 'sl', label: 'নং', align: 'center' },
        { id: 'timestamp', label: 'সময় ও তারিখ' },
        { id: 'user', label: 'ব্যবহারকারী' },
        { id: 'module', label: 'মডিউল' },
        { id: 'action', label: 'অ্যাকশন' },
        { id: 'summary', label: 'কার্যক্রমের বিবরণ' },
      ],
      rows,
    };
  }

  // FALLBACK GENERIC ENGINE FOR BATCH, SERIAL, LOANS & OTHERS
  const list = data.invoices.filter((i) => !i.deletedAt && isDateInRange(i.date));
  const rows = list.map((i, idx) => ({
    id: i.id,
    rawType: 'invoice',
    rawId: i.id,
    rawData: i,
    sl: idx + 1,
    ref: i.invoiceNo,
    date: i.date,
    party: i.customerName,
    amount: `৳${i.grandTotal.toLocaleString()}`,
    status: i.status === 'completed' ? 'সম্পন্ন' : 'চলমান',
  }));

  return {
    reportId,
    title: reportDef.nameBn,
    categoryTitle: categoryDef.nameBn,
    dateRangeText,
    kpis: [
      { label: 'মোট রেকর্ড সংখ্যা', value: rows.length, color: 'text-slate-800' },
      { label: 'মোট অংক', value: `৳${list.reduce((s, i) => s + i.grandTotal, 0).toLocaleString()}`, color: 'text-emerald-600' },
    ],
    columns: [
      { id: 'sl', label: 'নং', align: 'center' },
      { id: 'ref', label: 'রেফারেন্স নং', isMono: true },
      { id: 'date', label: 'তারিখ' },
      { id: 'party', label: 'নাম / বিবরণ' },
      { id: 'amount', label: 'টাকার পরিমাণ (৳)', align: 'right', isMono: true },
      { id: 'status', label: 'অবস্থা', align: 'center' },
    ],
    rows,
  };
}
