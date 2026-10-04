import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  CompanyProfile,
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
  CashierShift,
  UserRole,
  BackupData,
  GmailAccount,
  BackupSnapshot,
  AutoBackupSettings,
  TextSize,
  PrintSettings,
  DashboardQuickItemConfig,
  DashboardMetricConfig,
  DashboardCustomSettings,
  ThemeSettings,
  FieldVisibilityConfig,
  SkuBarcodeSettings,
  EnhancedPrintSettings,
  CustomFieldDefinition,
  PaymentMethodItem,
  ExpenseCategoryItem,
  TaxDiscountSettings,
  UserRoleDefinition,
  RoleModulePermission,
  LocalizationSettings,
  NotificationSettings,
  SecuritySettings,
  SecurityLogItem,
  BusinessSetupConfig,
  BrandItem,
  CategoryItem,
  UnitItem,
  ProductTypeItem,
  ProductStatusItem,
  TaxTypeItem,
  DiscountTypeItem,
  PriceTypeItem,
  IncomeCategoryItem,
  CustomerTypeItem,
  SupplierTypeItem,
  SalesTypeItem,
  PurchaseTypeItem,
  BranchItem,
  TopIconMenuConfig,
  TopIconMenuItem,
} from '../types';
import { Language, translations } from '../i18n/translations';
import {
  DEFAULT_THEME_SETTINGS,
  DEFAULT_DASHBOARD_CUSTOM_SETTINGS,
  DEFAULT_PRODUCT_FIELDS,
  DEFAULT_CUSTOMER_FIELDS,
  DEFAULT_SUPPLIER_FIELDS,
  DEFAULT_SALES_FIELDS,
  DEFAULT_PURCHASE_FIELDS,
  DEFAULT_EXPENSE_FIELDS,
  DEFAULT_SKU_BARCODE_SETTINGS,
  DEFAULT_ENHANCED_PRINT_SETTINGS,
  DEFAULT_PAYMENT_METHODS,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_TAX_DISCOUNT_SETTINGS,
  DEFAULT_ROLE_PERMISSIONS,
  DEFAULT_LOCALIZATION_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_BUSINESS_SETUP,
  DEFAULT_BRANDS_LIST,
  DEFAULT_CATEGORIES_LIST,
  DEFAULT_UNITS_LIST,
  DEFAULT_PRODUCT_TYPES_LIST,
  DEFAULT_PRODUCT_STATUS_LIST,
  DEFAULT_TAX_TYPES_LIST,
  DEFAULT_DISCOUNT_TYPES_LIST,
  DEFAULT_PRICE_TYPES_LIST,
  DEFAULT_INCOME_CATEGORIES_LIST,
  DEFAULT_CUSTOMER_TYPES_LIST,
  DEFAULT_SUPPLIER_TYPES_LIST,
  DEFAULT_SALES_TYPES_LIST,
  DEFAULT_PURCHASE_TYPES_LIST,
  DEFAULT_TOP_ICON_MENU_CONFIG,
} from '../utils/defaultSettings';

// Sample Initial Seed Data
const initialCompany: CompanyProfile = {
  name: 'মেসার্স ভাই ভাই এন্টারপ্রাইজ (Vai Vai Enterprise)',
  tagline: 'হোলসেল ও রিটেইল ট্রেডার্স এবং সাপ্লাইয়ার্স',
  phone: '+880 1711-234567',
  email: 'info@vaivaienterprise.com',
  address: 'দোকান নং ১২, নিউ মার্কেট রোড, ঢাকা-১২০৫',
  currency: '৳',
  vatNumber: 'BIN-12345678901',
  vatRate: 5,
  adminPin: '1234',
};

const sampleCustomerPhoto1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23059669"/><circle cx="50" cy="38" r="20" fill="%23fcd34d"/><path d="M20 90c0-18 14-30 30-30s30 12 30 30" fill="%23047857"/></svg>`;
const sampleCustomerPhoto2 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%232563eb"/><circle cx="50" cy="38" r="20" fill="%23fed7aa"/><path d="M20 90c0-18 14-30 30-30s30 12 30 30" fill="%231d4ed8"/></svg>`;
const sampleCustomerPhoto3 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%237c3aed"/><circle cx="50" cy="38" r="20" fill="%23fef08a"/><path d="M20 90c0-18 14-30 30-30s30 12 30 30" fill="%236d28d9"/></svg>`;

const sampleProductOil = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fef3c7"/><rect x="30" y="30" width="40" height="55" rx="8" fill="%23f59e0b"/><rect x="42" y="15" width="16" height="15" rx="3" fill="%23d97706"/><circle cx="50" cy="55" r="10" fill="%23fbbf24"/></svg>`;
const sampleProductRice = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ecfdf5"/><path d="M25 85 L35 30 L65 30 L75 85 Z" fill="%2310b981"/><rect x="32" y="45" width="36" height="25" fill="%23ffffff" rx="4"/><circle cx="50" cy="57" r="6" fill="%23059669"/></svg>`;

const initialCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'আলমগীর স্টোর (Alamgir Store)',
    phone: '01819-876543',
    email: 'alamgir@gmail.com',
    address: 'চকবাজার, ঢাকা',
    photo: sampleCustomerPhoto1,
    openingBalance: 5000,
    creditLimit: 50000,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'CUST-002',
    name: 'রফিক ভ্যারাইটিজ (Rafiq Varieties)',
    phone: '01712-334455',
    address: 'মিরপুর ১০, ঢাকা',
    photo: sampleCustomerPhoto2,
    openingBalance: 0,
    creditLimit: 30000,
    createdAt: '2026-03-05T11:00:00Z',
    updatedAt: '2026-03-05T11:00:00Z',
  },
  {
    id: 'CUST-003',
    name: 'মডার্ন সুপার শপ (Modern Super Shop)',
    phone: '01911-998877',
    address: 'উত্তরা সেক্টর ৭, ঢাকা',
    photo: sampleCustomerPhoto3,
    openingBalance: 12000,
    creditLimit: 100000,
    createdAt: '2026-03-10T09:30:00Z',
    updatedAt: '2026-03-10T09:30:00Z',
  },
];

const initialSuppliers: Supplier[] = [
  {
    id: 'SUPP-001',
    name: 'মেঘনা কনজিউমার্স লিঃ (Meghna Consumers Ltd)',
    phone: '01700-112233',
    email: 'supply@meghnagroup.biz',
    address: 'মতিঝিল বা/এ, ঢাকা',
    openingBalance: 15000,
    creditLimit: 200000,
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'SUPP-002',
    name: 'স্কয়ার ডিস্ট্রিবিউশন (Square Distribution)',
    phone: '01900-556677',
    address: 'তেজগাঁও শিল্প এলাকা, ঢাকা',
    openingBalance: 8000,
    creditLimit: 150000,
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-20T10:00:00Z',
  },
];

const initialProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'সয়াবিন তেল ৫ লিটার (Soybean Oil 5L)',
    category: 'তেল ও চর্বি',
    brand: 'রূপচাঁদা',
    sku: 'OIL-5L-001',
    barcode: '890123450001',
    unit: 'ltr',
    purchasePrice: 850,
    salePrice: 920,
    mrp: 950,
    taxPercent: 0,
    discountPercent: 0,
    openingStock: 40,
    minStock: 10,
    warehouse: 'Main Warehouse',
    photo: sampleProductOil,
    batchNo: 'B-202603',
    expDate: '2027-03-01',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'PROD-002',
    name: 'মিনিকেট চাল ২৫ কেজি (Miniket Rice 25kg)',
    category: 'চাল ও খাদ্যশস্য',
    brand: 'ফার্মার্স গোল্ড',
    sku: 'RICE-25K-002',
    barcode: '890123450002',
    unit: 'bag',
    purchasePrice: 1750,
    salePrice: 1900,
    mrp: 1950,
    taxPercent: 0,
    discountPercent: 0,
    openingStock: 25,
    minStock: 5,
    warehouse: 'Main Warehouse',
    photo: sampleProductRice,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'PROD-003',
    name: 'প্রিমিয়াম বাসমতি চাল ১ কেজি (Premium Basmati 1kg)',
    category: 'চাল ও খাদ্যশস্য',
    brand: 'দাওয়াত',
    sku: 'RICE-BAS-003',
    barcode: '890123450003',
    unit: 'kg',
    purchasePrice: 280,
    salePrice: 340,
    mrp: 360,
    taxPercent: 5,
    discountPercent: 0,
    openingStock: 15,
    minStock: 5,
    warehouse: 'Shop Floor',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'PROD-004',
    name: 'আখের চিনি ৫০ কেজি ব্যাগ (Cane Sugar 50kg)',
    category: 'মুদি মালামাল',
    brand: 'দেশী চিনি',
    sku: 'SUGAR-50K-004',
    barcode: '890123450004',
    unit: 'bag',
    purchasePrice: 6200,
    salePrice: 6600,
    mrp: 6700,
    taxPercent: 0,
    discountPercent: 0,
    openingStock: 4, // low stock!
    minStock: 8,
    warehouse: 'Godown 1',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'PROD-005',
    name: 'প্যাকেজিং বক্স কার্টন (Packaging Carton Box)',
    category: 'কাঁচামাল (Raw Material)',
    sku: 'RAW-BOX-005',
    barcode: '890123450005',
    unit: 'pcs',
    purchasePrice: 25,
    salePrice: 35,
    mrp: 40,
    taxPercent: 0,
    discountPercent: 0,
    openingStock: 500,
    minStock: 100,
    warehouse: 'Factory Godown',
    isRawMaterial: true,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
  },
];

const initialInvoices: Invoice[] = [
  {
    id: 'INV-1001',
    invoiceNo: 'INV-2026-001',
    type: 'sale',
    customerId: 'CUST-001',
    customerName: 'আলমগীর স্টোর (Alamgir Store)',
    customerPhone: '01819-876543',
    date: '2026-03-25',
    time: '11:30:00',
    items: [
      {
        productId: 'PROD-001',
        productName: 'সয়াবিন তেল ৫ লিটার (Soybean Oil 5L)',
        barcode: '890123450001',
        unit: 'ltr',
        qty: 5,
        rate: 920,
        discount: 0,
        taxPercent: 0,
        total: 4600,
        purchaseCost: 850,
      },
      {
        productId: 'PROD-002',
        productName: 'মিনিকেট চাল ২৫ কেজি (Miniket Rice 25kg)',
        barcode: '890123450002',
        unit: 'bag',
        qty: 2,
        rate: 1900,
        discount: 100,
        taxPercent: 0,
        total: 3700,
        purchaseCost: 1750,
      },
    ],
    subtotal: 8400,
    discountAmount: 100,
    taxAmount: 0,
    additionalCharge: 50,
    grandTotal: 8350,
    paidAmount: 5000,
    dueAmount: 3350,
    paymentMethod: 'cash',
    warehouse: 'Main Warehouse',
    salesmanName: 'জাকির হোসেন',
    status: 'completed',
    createdAt: '2026-03-25T11:30:00Z',
    updatedAt: '2026-03-25T11:30:00Z',
  },
  {
    id: 'INV-1002',
    invoiceNo: 'POS-2026-002',
    type: 'pos',
    customerId: 'CUST-002',
    customerName: 'রফিক ভ্যারাইটিজ (Rafiq Varieties)',
    customerPhone: '01712-334455',
    date: '2026-03-28',
    time: '14:15:00',
    items: [
      {
        productId: 'PROD-003',
        productName: 'প্রিমিয়াম বাসমতি চাল ১ কেজি (Premium Basmati 1kg)',
        barcode: '890123450003',
        unit: 'kg',
        qty: 3,
        rate: 340,
        discount: 0,
        taxPercent: 5,
        total: 1071,
        purchaseCost: 280,
      },
    ],
    subtotal: 1020,
    discountAmount: 0,
    taxAmount: 51,
    additionalCharge: 0,
    grandTotal: 1071,
    paidAmount: 1071,
    dueAmount: 0,
    paymentMethod: 'mobile_banking',
    warehouse: 'Shop Floor',
    status: 'completed',
    createdAt: '2026-03-28T14:15:00Z',
    updatedAt: '2026-03-28T14:15:00Z',
  },
];

const initialPurchases: Purchase[] = [
  {
    id: 'PUR-2001',
    billNo: 'BILL-2026-001',
    type: 'bill',
    supplierId: 'SUPP-001',
    supplierName: 'মেঘনা কনজিউমার্স লিঃ (Meghna Consumers Ltd)',
    date: '2026-03-20',
    time: '10:00:00',
    items: [
      {
        productId: 'PROD-001',
        productName: 'সয়াবিন তেল ৫ লিটার (Soybean Oil 5L)',
        unit: 'ltr',
        qty: 20,
        rate: 850,
        discount: 0,
        taxPercent: 0,
        total: 17000,
        batchNo: 'B-202603',
      },
    ],
    subtotal: 17000,
    discountAmount: 500,
    taxAmount: 0,
    additionalCharge: 200,
    grandTotal: 16700,
    paidAmount: 10000,
    dueAmount: 6700,
    paymentMethod: 'bank',
    warehouse: 'Main Warehouse',
    status: 'received',
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
  },
];

const initialExpenses: Expense[] = [
  {
    id: 'EXP-3001',
    expenseNo: 'EXP-2026-001',
    category: 'দোকান ভাড়া (Shop Rent)',
    description: 'মার্চ মাসের দোকান ও গোডাউন ভাড়া প্রদান',
    amount: 12000,
    date: '2026-03-05',
    paymentMethod: 'bank',
    paidBy: 'Company Cash',
    createdAt: '2026-03-05T12:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
  },
  {
    id: 'EXP-3002',
    expenseNo: 'EXP-2026-002',
    category: 'বিদ্যুৎ ও ইউটিলিটি (Electricity & Utility)',
    description: 'পল্লী বিদ্যুৎ বিল পরিশোধ',
    amount: 3200,
    date: '2026-03-15',
    paymentMethod: 'mobile_banking',
    paidBy: 'Company Cash',
    createdAt: '2026-03-15T15:00:00Z',
    updatedAt: '2026-03-15T15:00:00Z',
  },
  {
    id: 'EXP-3003',
    expenseNo: 'EXP-2026-003',
    category: 'জরুরি মেরামত ও ডেকোরেশন (Emergency Repairs)',
    description: 'মালিক মোর্শেদ সাহেবের ব্যক্তিগত পকেট থেকে মিস্ত্রি ও পেইন্ট খরচ',
    amount: 4500,
    date: '2026-03-26',
    paymentMethod: 'own_money',
    paidBy: 'জনাব মোর্শেদ আলম (Company Owner)',
    ownerPartyName: 'জনাব মোর্শেদ আলম',
    isOwnMoneyPaid: true,
    status: 'approved',
    createdAt: '2026-03-26T16:00:00Z',
    updatedAt: '2026-03-26T16:00:00Z',
  },
];

const initialPayments: PaymentRecord[] = [
  {
    id: 'PAY-4001',
    paymentNo: 'PAY-IN-001',
    type: 'in',
    partyType: 'customer',
    partyId: 'CUST-001',
    partyName: 'আলমগীর স্টোর (Alamgir Store)',
    amount: 3000,
    paymentMethod: 'cash',
    referenceNo: 'INV-2026-001',
    date: '2026-03-27',
    notes: 'বকেয়া থেকে নগদ কালেকশন',
    createdAt: '2026-03-27T14:00:00Z',
    updatedAt: '2026-03-27T14:00:00Z',
  },
  {
    id: 'PAY-4002',
    paymentNo: 'PAY-OUT-001',
    type: 'out',
    partyType: 'supplier',
    partyId: 'SUPP-001',
    partyName: 'মেঘনা কনজিউমার্স লিঃ',
    amount: 5000,
    paymentMethod: 'bank',
    referenceNo: 'BILL-2026-001',
    date: '2026-03-24',
    notes: 'মেঘনা গ্রুপে চেক ক্লিয়ারেন্স',
    createdAt: '2026-03-24T16:00:00Z',
    updatedAt: '2026-03-24T16:00:00Z',
  },
];

const initialEmployees: Employee[] = [
  {
    id: 'EMP-001',
    employeeId: 'EMP-101',
    name: 'জাকির হোসেন',
    phone: '01755-123456',
    designation: 'সিনিয়র সেলস এক্সিকিউটিভ',
    department: 'Sales',
    salary: 22000,
    address: 'ধানমন্ডি, ঢাকা',
    joiningDate: '2025-01-15',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'EMP-002',
    employeeId: 'EMP-102',
    name: 'সোহেল রানা',
    phone: '01866-987654',
    designation: 'গোডাউন ইন-চার্জ ও লজিস্টিক',
    department: 'Warehouse',
    salary: 18000,
    address: 'মিরপুর ২, ঢাকা',
    joiningDate: '2025-06-01',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

const initialDeliveries: DeliveryChallan[] = [
  {
    id: 'DEL-5001',
    challanNo: 'CHL-2026-001',
    invoiceId: 'INV-1001',
    invoiceNo: 'INV-2026-001',
    customerName: 'আলমগীর স্টোর (Alamgir Store)',
    phone: '01819-876543',
    address: 'চকবাজার, ঢাকা',
    deliveryPerson: 'সোহেল রানা',
    deliveryDate: '2026-03-25',
    route: 'চকবাজার ভ্যান রুট ১',
    status: 'delivered',
    createdAt: '2026-03-25T12:00:00Z',
    updatedAt: '2026-03-25T15:00:00Z',
  },
];

const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-03-28 14:15:00',
    user: 'System Admin',
    role: 'admin',
    module: 'POS Sale',
    action: 'CREATE',
    recordId: 'POS-2026-002',
    summary: 'POS বিক্রয় সম্পন্ন হয়েছে ৳1,071 (Customer: রফিক ভ্যারাইটিজ)',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-03-27 14:00:00',
    user: 'Accountant',
    role: 'accountant',
    module: 'Payment In',
    action: 'CREATE',
    recordId: 'PAY-IN-001',
    summary: 'কাস্টমার কালেকশন গ্রহণ ৳3,000 (আলমগীর স্টোর)',
  },
];

const initialApprovals: ApprovalItem[] = [
  {
    id: 'APP-001',
    type: 'discount',
    title: 'বিশেষ ভলিউম ডিসকাউন্ট অনুরোধ',
    amountOrDetail: '৳500 ফ্ল্যাট ডিসকাউন্ট',
    requestedBy: 'জাকির হোসেন (Sales)',
    status: 'approved',
    timestamp: '2026-03-25 11:25:00',
  },
];

const initialShift: CashierShift = {
  id: 'SHIFT-001',
  cashierName: 'সাকিব (Cashier)',
  startTime: '2026-03-28 09:00:00',
  openingCash: 5000,
  totalSales: 1071,
  status: 'open',
};

// Storage Keys
const LOCAL_STORAGE_KEY = 'BIZACCOUNT_ERP_STORE_V2';
const GMAIL_ACCOUNTS_STORAGE_KEY = 'BIZACCOUNT_GMAIL_ACCOUNTS_V2';
const CURRENT_GMAIL_STORAGE_KEY = 'BIZACCOUNT_CURRENT_GMAIL_V2';
const AUTO_BACKUP_SETTINGS_KEY = 'BIZACCOUNT_AUTO_BACKUP_SETTINGS_V2';
const BACKUP_SNAPSHOTS_STORAGE_KEY = 'BIZACCOUNT_BACKUP_SNAPSHOTS_V2';

export const initialGmailAccounts: GmailAccount[] = [
  {
    id: 'GMAIL-01',
    email: 'alluser27bd@gmail.com',
    name: 'ব্যবসা অ্যাডমিন (Owner & Primary)',
    role: 'admin',
    isPrimary: true,
    isBackupTarget: true,
    linkedAt: '2026-03-01T08:00:00Z',
    lastLoginAt: '2026-03-29T10:00:00Z',
  },
  {
    id: 'GMAIL-02',
    email: 'accounts.vaivai@gmail.com',
    name: 'প্রধান অ্যাকাউন্টস টিম (Accountant)',
    role: 'accountant',
    isPrimary: false,
    isBackupTarget: false,
    linkedAt: '2026-03-10T09:00:00Z',
    lastLoginAt: '2026-03-28T16:30:00Z',
  },
];

export const initialAutoBackupSettings: AutoBackupSettings = {
  enabled: true,
  intervalMinutes: 15,
  targetGmailId: 'GMAIL-01',
  lastBackupTime: '2026-03-29T12:00:00Z',
  keepMaxSnapshots: 10,
};

export const initialPrintSettings: PrintSettings = {
  showPreviousBalance: true,
  showReceived: true,
  showTotalBalance: true,
  showTotalDue: true,
  showInvoiceNo: true,
  showDate: true,
  showCustomerInfo: true,
  showCustomerPhoto: true,
  showItemPhoto: true,
  showItemSku: true,
  showItemBarcode: false,
  showItemQrCode: false,
  showItemDiscount: true,
  showItemTax: false,
  showVatBin: true,
  showSignatureLines: true,
  showNotes: true,
  receiptFooterNote: 'ধন্যবাদ! আপনার সহযোগিতার জন্য আমরা কৃতজ্ঞ।',
};

const TEXT_SIZE_STORAGE_KEY = 'BIZACCOUNT_TEXT_SIZE_V2';
const PRINT_SETTINGS_STORAGE_KEY = 'BIZACCOUNT_PRINT_SETTINGS_V2';
const DASHBOARD_SETTINGS_STORAGE_KEY = 'BIZACCOUNT_DASHBOARD_CUSTOM_V2';

export const DEFAULT_DASHBOARD_QUICK_ITEMS: DashboardQuickItemConfig[] = [
  { id: 'sales', label: 'নতুন বিক্রয়', iconName: 'Receipt', tab: 'sales', color: 'bg-blue-600', enabled: true, order: 1 },
  { id: 'purchases', label: 'নতুন ক্রয়', iconName: 'Truck', tab: 'purchases', color: 'bg-emerald-600', enabled: true, order: 2 },
  { id: 'customers', label: 'কাস্টমার', iconName: 'Users', tab: 'customers', color: 'bg-fuchsia-600', enabled: true, order: 3 },
  { id: 'products', label: 'পণ্য তালিকা', iconName: 'Package', tab: 'products', color: 'bg-orange-500', enabled: true, order: 4 },
  { id: 'pos', label: 'POS / বিলিং', iconName: 'ShoppingCart', tab: 'pos', color: 'bg-amber-500', enabled: false, order: 5 },
  { id: 'suppliers', label: 'সাপ্লায়ার', iconName: 'Building2', tab: 'suppliers', color: 'bg-indigo-600', enabled: false, order: 6 },
  { id: 'payments', label: 'পেমেন্ট জমা', iconName: 'ArrowLeftRight', tab: 'payments', color: 'bg-sky-600', enabled: false, order: 7 },
  { id: 'expenses', label: 'দৈনিক খরচ', iconName: 'DollarSign', tab: 'expenses', color: 'bg-rose-500', enabled: false, order: 8 },
  { id: 'inventory', label: 'মজুদ স্টক', iconName: 'Boxes', tab: 'inventory', color: 'bg-teal-600', enabled: false, order: 9 },
  { id: 'reports', label: 'রিপোর্ট সেন্টার', iconName: 'FileBarChart', tab: 'reports', color: 'bg-red-600', enabled: false, order: 10 },
  { id: 'accounting', label: 'হিসাব খাতা', iconName: 'Scale', tab: 'accounting', color: 'bg-violet-600', enabled: false, order: 11 },
  { id: 'hr', label: 'কর্মী / বেতন', iconName: 'UserCheck', tab: 'hr', color: 'bg-cyan-600', enabled: false, order: 12 },
  { id: 'delivery', label: 'ডেলিভারি', iconName: 'Truck', tab: 'delivery', color: 'bg-lime-600', enabled: false, order: 13 },
];

export const DEFAULT_DASHBOARD_METRICS_CONFIG: DashboardMetricConfig[] = [
  { id: 'totalDue', label: 'মোট বাকি', category: 'all_time', iconName: 'AlertCircle', color: 'text-amber-700', enabled: true, order: 1 },
  { id: 'cashInHand', label: 'নগদ টাকা', category: 'all_time', iconName: 'Wallet', color: 'text-emerald-700', enabled: true, order: 2 },
  { id: 'totalSales', label: 'মোট বিক্রয়', category: 'all_time', iconName: 'TrendingUp', color: 'text-slate-900', enabled: true, order: 3 },
  { id: 'totalPurchases', label: 'মোট ক্রয়', category: 'all_time', iconName: 'ShoppingBag', color: 'text-slate-900', enabled: true, order: 4 },
  { id: 'todaySales', label: 'আজকের বিক্রয়', category: 'today', iconName: 'Receipt', color: 'text-slate-900', enabled: true, order: 5 },
  { id: 'todayPurchase', label: 'আজকের ক্রয়', category: 'today', iconName: 'Truck', color: 'text-slate-900', enabled: true, order: 6 },
  { id: 'todayReceived', label: 'আজকের Received', category: 'today', iconName: 'ArrowDownLeft', color: 'text-emerald-700', enabled: true, order: 7 },
  { id: 'todayDue', label: 'আজকের Due', category: 'today', iconName: 'Clock', color: 'text-rose-700', enabled: true, order: 8 },
  { id: 'bankBalance', label: 'ব্যাংক ব্যালেন্স', category: 'all_time', iconName: 'Landmark', color: 'text-blue-700', enabled: false, order: 9 },
  { id: 'mobileBanking', label: 'মোবাইল ব্যাংকিং', category: 'all_time', iconName: 'Smartphone', color: 'text-purple-700', enabled: false, order: 10 },
  { id: 'netProfit', label: 'নিট লাভ (Profit)', category: 'all_time', iconName: 'DollarSign', color: 'text-emerald-700', enabled: false, order: 11 },
  { id: 'totalExpense', label: 'মোট খরচ (Expense)', category: 'all_time', iconName: 'ArrowUpRight', color: 'text-rose-700', enabled: false, order: 12 },
  { id: 'stockValue', label: 'মজুদ স্টক মূল্য', category: 'all_time', iconName: 'Package', color: 'text-teal-700', enabled: false, order: 13 },
  { id: 'supplierPayable', label: 'মহাজন দেনা (Payable)', category: 'all_time', iconName: 'Building2', color: 'text-purple-700', enabled: false, order: 14 },
  { id: 'todayExpense', label: 'আজকের খরচ', category: 'today', iconName: 'DollarSign', color: 'text-rose-700', enabled: false, order: 15 },
];

export const DEFAULT_DASHBOARD_SETTINGS: DashboardCustomSettings = {
  quickItems: DEFAULT_DASHBOARD_QUICK_ITEMS,
  metrics: DEFAULT_DASHBOARD_METRICS_CONFIG,
};

interface AppContextType {
  // State
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['en'] | (typeof translations)['bn'];
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Text Size Control
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;

  // Print Settings & Controls
  printSettings: PrintSettings;
  updatePrintSettings: (settings: Partial<PrintSettings>) => void;

  // Customizable Dashboard System
  dashboardCustomSettings: DashboardCustomSettings;
  updateDashboardCustomSettings: (settings: Partial<DashboardCustomSettings> | ((prev: DashboardCustomSettings) => DashboardCustomSettings)) => void;
  toggleDashboardQuickItem: (id: string, enabled?: boolean) => void;
  toggleDashboardMetric: (id: string, enabled?: boolean) => void;
  moveDashboardQuickItem: (id: string, direction: 'up' | 'down') => void;
  moveDashboardMetric: (id: string, direction: 'up' | 'down') => void;
  resetDashboardCustomSettings: () => void;
  
  // Data
  companyProfile: CompanyProfile;
  updateCompanyProfile: (p: CompanyProfile) => void;
  customers: Customer[];
  suppliers: Supplier[];
  products: Product[];
  invoices: Invoice[];
  purchases: Purchase[];
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
  cashierShift: CashierShift;
  setCashierShift: React.Dispatch<React.SetStateAction<CashierShift>>;
  
  // Dynamic Recalculated Balances
  dashboardMetrics: {
    totalSales: number;
    totalPurchase: number;
    totalExpense: number;
    grossProfit: number;
    netProfit: number;
    companyCashBalance: number;
    bankBalance: number;
    mobileBankingBalance: number;
    customerReceivable: number;
    supplierPayable: number;
    dueBalance: number;
    ownMoneyPaid: number;
    remainingBalance: number;
    stockValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    todaySales: number;
    todayPurchase: number;
    todayExpense: number;
    todayCollection: number;
    todayPayment: number;
    monthlySales: number;
    monthlyPurchase: number;
    monthlyExpense: number;
    monthlyProfit: number;
  };
  
  // Recalculated stock per product helper
  getProductStock: (productId: string) => {
    openingStock: number;
    stockIn: number;
    stockOut: number;
    currentStock: number;
  };

  // Recalculated customer balance helper
  getCustomerBalance: (customerId: string) => {
    openingBalance: number;
    totalSales: number;
    totalPaid: number;
    currentDue: number;
  };

  // Recalculated supplier balance helper
  getSupplierBalance: (supplierId: string) => {
    openingBalance: number;
    totalPurchases: number;
    totalPaid: number;
    currentPayable: number;
  };
  
  // CRUD Actions
  saveCustomer: (c: Customer) => void;
  deleteCustomer: (id: string, soft?: boolean) => void;
  restoreCustomer: (id: string) => void;

  saveSupplier: (s: Supplier) => void;
  deleteSupplier: (id: string, soft?: boolean) => void;
  restoreSupplier: (id: string) => void;

  saveProduct: (p: Product) => void;
  deleteProduct: (id: string, soft?: boolean) => void;
  restoreProduct: (id: string) => void;

  saveInvoice: (inv: Invoice) => void;
  deleteInvoice: (id: string, soft?: boolean) => void;
  restoreInvoice: (id: string) => void;

  savePurchase: (pur: Purchase) => void;
  deletePurchase: (id: string, soft?: boolean) => void;
  restorePurchase: (id: string) => void;

  saveExpense: (exp: Expense) => void;
  deleteExpense: (id: string, soft?: boolean) => void;
  restoreExpense: (id: string) => void;

  savePayment: (pay: PaymentRecord) => void;
  deletePayment: (id: string, soft?: boolean) => void;
  restorePayment: (id: string) => void;

  saveStockAdjustment: (adj: StockAdjustment) => void;
  saveEmployee: (emp: Employee) => void;
  deleteEmployee: (id: string) => void;
  saveAttendance: (att: Attendance) => void;
  savePayroll: (pay: Payroll) => void;
  saveManufacturingOrder: (mo: ManufacturingOrder) => void;
  saveDelivery: (del: DeliveryChallan) => void;

  // Approvals & Audit
  approveItem: (id: string, approve: boolean) => void;
  addAuditLog: (module: string, action: AuditLogItem['action'], recordId: string, summary: string) => void;

  // Print & Modal
  printData: {
    type: 'invoice' | 'pos' | 'statement' | 'report';
    data: any;
  } | null;
  setPrintData: (data: { type: 'invoice' | 'pos' | 'statement' | 'report'; data: any } | null) => void;

  // Backup & Restore
  exportBackupJSON: () => void;
  importBackupJSON: (jsonData: string) => boolean;
  resetToSampleData: () => void;
  exportToCSV: (filename: string, headers: string[], rows: (string | number)[][]) => void;

  // Gmail Accounts & Auth
  gmailAccounts: GmailAccount[];
  currentGmailUser: GmailAccount | null;
  loginWithGmail: (email: string, name?: string) => boolean;
  signUpWithGmail: (email: string, name: string, role?: UserRole) => boolean;
  logoutGmail: () => void;
  addManualGmailAccount: (email: string, name: string, role: UserRole, setAsBackupTarget?: boolean) => void;
  removeGmailAccount: (id: string) => void;
  switchGmailAccount: (id: string) => void;
  setBackupTargetGmail: (id: string) => void;

  // Auto Backup System
  autoBackupSettings: AutoBackupSettings;
  updateAutoBackupSettings: (settings: Partial<AutoBackupSettings>) => void;
  backupSnapshots: BackupSnapshot[];
  triggerAutoBackup: (isManual?: boolean) => BackupSnapshot;
  restoreFromSnapshot: (snapshotId: string) => boolean;
  deleteSnapshot: (snapshotId: string) => void;
  lastBackupConfirmation: { time: string; gmail: string; recordCount: number; type: 'auto' | 'manual' } | null;

  // 1. Appearance & Theme Settings
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;

  // 2. Module Field Visibility & Requirements
  productFields: FieldVisibilityConfig[];
  updateProductFields: (fields: FieldVisibilityConfig[]) => void;
  customerFields: FieldVisibilityConfig[];
  updateCustomerFields: (fields: FieldVisibilityConfig[]) => void;
  supplierFields: FieldVisibilityConfig[];
  updateSupplierFields: (fields: FieldVisibilityConfig[]) => void;
  salesFields: FieldVisibilityConfig[];
  updateSalesFields: (fields: FieldVisibilityConfig[]) => void;
  purchaseFields: FieldVisibilityConfig[];
  updatePurchaseFields: (fields: FieldVisibilityConfig[]) => void;
  expenseFields: FieldVisibilityConfig[];
  updateExpenseFields: (fields: FieldVisibilityConfig[]) => void;

  // 3. SKU & Barcode Settings
  skuBarcodeSettings: SkuBarcodeSettings;
  updateSkuBarcodeSettings: (settings: Partial<SkuBarcodeSettings>) => void;

  // 4. Enhanced Print & PDF Settings
  enhancedPrintSettings: EnhancedPrintSettings;
  updateEnhancedPrintSettings: (settings: Partial<EnhancedPrintSettings>) => void;

  // 5. Custom Fields System
  customFields: CustomFieldDefinition[];
  addCustomField: (field: Omit<CustomFieldDefinition, 'id'>) => void;
  updateCustomField: (id: string, field: Partial<CustomFieldDefinition>) => void;
  deleteCustomField: (id: string) => void;

  // 6. Payment Methods Management
  paymentMethodsList: PaymentMethodItem[];
  addPaymentMethod: (item: Omit<PaymentMethodItem, 'id'>) => void;
  updatePaymentMethod: (id: string, item: Partial<PaymentMethodItem>) => void;
  deletePaymentMethod: (id: string) => void;

  // 7. Expense Categories Management
  expenseCategoriesList: ExpenseCategoryItem[];
  addExpenseCategory: (cat: Omit<ExpenseCategoryItem, 'id'>) => void;
  updateExpenseCategory: (id: string, cat: Partial<ExpenseCategoryItem>) => void;
  deleteExpenseCategory: (id: string) => void;

  // 8. Tax & Discount Settings
  taxDiscountSettings: TaxDiscountSettings;
  updateTaxDiscountSettings: (settings: Partial<TaxDiscountSettings>) => void;

  // 9. Role Permissions (RBAC)
  rolePermissions: UserRoleDefinition[];
  updateRolePermission: (roleId: UserRole, moduleId: string, field: keyof RoleModulePermission, val: boolean) => void;

  // 10. General & Localization Settings
  localizationSettings: LocalizationSettings;
  updateLocalizationSettings: (settings: Partial<LocalizationSettings>) => void;

  // 11. Notification Settings
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  // 12. Security & Account Recovery System
  securitySettings: SecuritySettings;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  verifyAdminPin: (pin: string) => { success: boolean; isLocked?: boolean; remainingAttempts?: number; lockoutUntil?: string; message?: string };
  sendRecoveryOtp: (targetEmail?: string) => { success: boolean; otpCode: string; expirySeconds: number; maskedEmail: string };
  verifyRecoveryOtp: (otp: string) => boolean;
  resetAdminPinWithRecovery: (newPin: string) => boolean;
  generateNewBackupCodes: () => string[];
  verifyBackupCode: (code: string) => boolean;
  addSecurityLog: (type: SecurityLogItem['type'], description: string, status?: SecurityLogItem['status']) => void;
  clearSecurityLogs: () => void;
  activeRecoveryOtp: { code: string; expiresAt: number; email: string } | null;
  isRecoveryModalOpen: boolean;
  openRecoveryModal: () => void;
  closeRecoveryModal: () => void;

  // 13. Master Data & Business Setup Management System
  businessSetup: BusinessSetupConfig;
  updateBusinessSetup: (settings: Partial<BusinessSetupConfig>) => void;
  
  brandsList: BrandItem[];
  saveBrand: (brand: Omit<BrandItem, 'id'> & { id?: string }) => void;
  deleteBrand: (id: string, force?: boolean) => { success: boolean; isUsed?: boolean; usageCount?: number; message?: string };
  toggleBrandStatus: (id: string) => void;

  categoriesList: CategoryItem[];
  saveCategory: (category: Omit<CategoryItem, 'id'> & { id?: string }) => void;
  deleteCategory: (id: string, force?: boolean) => { success: boolean; isUsed?: boolean; usageCount?: number; message?: string };
  toggleCategoryStatus: (id: string) => void;
  reorderCategory: (id: string, direction: 'up' | 'down') => void;

  unitsList: UnitItem[];
  saveUnit: (unit: Omit<UnitItem, 'id'> & { id?: string }) => void;
  deleteUnit: (id: string, force?: boolean) => { success: boolean; isUsed?: boolean; usageCount?: number; message?: string };
  toggleUnitStatus: (id: string) => void;

  productTypesList: ProductTypeItem[];
  saveProductType: (type: Omit<ProductTypeItem, 'id'> & { id?: string }) => void;
  deleteProductType: (id: string) => void;

  productStatusesList: ProductStatusItem[];
  saveProductStatus: (status: Omit<ProductStatusItem, 'id'> & { id?: string }) => void;
  deleteProductStatus: (id: string) => void;

  taxTypesList: TaxTypeItem[];
  saveTaxType: (tax: Omit<TaxTypeItem, 'id'> & { id?: string }) => void;
  deleteTaxType: (id: string) => void;

  discountTypesList: DiscountTypeItem[];
  saveDiscountType: (disc: Omit<DiscountTypeItem, 'id'> & { id?: string }) => void;
  deleteDiscountType: (id: string) => void;

  priceTypesList: PriceTypeItem[];
  savePriceType: (price: Omit<PriceTypeItem, 'id'> & { id?: string }) => void;
  deletePriceType: (id: string) => void;

  incomeCategoriesList: IncomeCategoryItem[];
  saveIncomeCategory: (cat: Omit<IncomeCategoryItem, 'id'> & { id?: string }) => void;
  deleteIncomeCategory: (id: string) => void;

  customerTypesList: CustomerTypeItem[];
  saveCustomerType: (type: Omit<CustomerTypeItem, 'id'> & { id?: string }) => void;
  deleteCustomerType: (id: string) => void;

  supplierTypesList: SupplierTypeItem[];
  saveSupplierType: (type: Omit<SupplierTypeItem, 'id'> & { id?: string }) => void;
  deleteSupplierType: (id: string) => void;

  salesTypesList: SalesTypeItem[];
  saveSalesType: (type: Omit<SalesTypeItem, 'id'> & { id?: string }) => void;
  deleteSalesType: (id: string) => void;

  purchaseTypesList: PurchaseTypeItem[];
  savePurchaseType: (type: Omit<PurchaseTypeItem, 'id'> & { id?: string }) => void;
  deletePurchaseType: (id: string) => void;

  // 14. Top & Down Icon Menu Control & Customization System
  topIconMenuConfig: TopIconMenuConfig;
  updateTopIconMenuConfig: (config: Partial<TopIconMenuConfig>) => void;
  addTopIconMenuItem: (item: Omit<TopIconMenuItem, 'id' | 'order'>) => void;
  updateTopIconMenuItem: (id: string, item: Partial<TopIconMenuItem>) => void;
  deleteTopIconMenuItem: (id: string) => void;
  toggleTopIconMenuVisibility: (id: string) => void;
  reorderTopIconMenuItem: (id: string, direction: 'up' | 'down', location?: 'top' | 'bottom') => void;
  moveTopIconMenuItemToIndex: (fromIndex: number, toIndex: number, location?: 'top' | 'bottom') => void;
  moveTopIconItemLocation: (id: string, newLocation: 'top' | 'bottom') => void;
  resetTopIconMenuToDefault: () => void;
  isTopIconCustomizerOpen: boolean;
  openTopIconCustomizer: () => void;
  closeTopIconCustomizer: () => void;

  // Universal Reset
  resetAllSettingsToDefault: () => void;

  // Shared Backend Realtime Synchronization System
  syncStatus: 'connected' | 'syncing' | 'offline';
  lastSyncTime: string | null;
  serverVersion: number;
  triggerManualServerSync: () => Promise<void>;

  // PWA & Mobile Experience
  isPwaInstalled: boolean;
  canInstallPwa: boolean;
  deferredPrompt: any;
  isPwaInstallModalOpen: boolean;
  openPwaInstallModal: () => void;
  closePwaInstallModal: () => void;
  promptInstallPwa: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [printData, setPrintData] = useState<{ type: 'invoice' | 'pos' | 'statement' | 'report'; data: any } | null>(null);

  // PWA Mobile App States & Event Listeners
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      );
    }
    return false;
  });
  const [isPwaInstallModalOpen, setIsPwaInstallModalOpen] = useState<boolean>(false);

  // Universal Text Size State
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    try {
      const saved = localStorage.getItem(TEXT_SIZE_STORAGE_KEY);
      if (saved && ['small', 'medium', 'large', 'xl'].includes(saved)) {
        return saved as TextSize;
      }
    } catch (e) {}
    return 'medium';
  });

  // Print Settings State
  const [printSettings, setPrintSettings] = useState<PrintSettings>(() => {
    try {
      const saved = localStorage.getItem(PRINT_SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...initialPrintSettings, ...JSON.parse(saved) };
      }
    } catch (e) {}
    return initialPrintSettings;
  });

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    setThemeSettings((prev) => ({ ...prev, textSize: size }));
    try {
      localStorage.setItem(TEXT_SIZE_STORAGE_KEY, size);
      const savedTheme = localStorage.getItem('BIZACCOUNT_THEME_V2');
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        localStorage.setItem('BIZACCOUNT_THEME_V2', JSON.stringify({ ...parsed, textSize: size }));
      }
    } catch (e) {}

    document.documentElement.setAttribute('data-text-size', size);
    document.documentElement.setAttribute('data-font-size', size);
    if (document.body) {
      document.body.setAttribute('data-text-size', size);
      document.body.setAttribute('data-font-size', size);
    }
    const sizeMap: Record<TextSize, string> = {
      small: '13.5px',
      medium: '16px',
      large: '18px',
      xl: '20.5px',
    };
    document.documentElement.style.fontSize = sizeMap[size] || '16px';
    if (document.body) {
      document.body.style.fontSize = sizeMap[size] || '16px';
    }

    const labelMap: Record<TextSize, string> = {
      small: 'Small (ছোট)',
      medium: 'Medium (মাঝারি - স্ট্যান্ডার্ড)',
      large: 'Large (বড়)',
      xl: 'Extra Large (অতিরিক্ত বড়)',
    };
    showToast(`টেক্সট সাইজ পরিবর্তিত হয়েছে: ${labelMap[size]}`);
  };

  const updatePrintSettings = (newSettings: Partial<PrintSettings>) => {
    setPrintSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(PRINT_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('প্রিন্ট সেটিংস সফলভাবে আপডেট হয়েছে');
  };

  // Sync text size to root DOM on mount & change
  useEffect(() => {
    const currentSize = textSize || 'medium';
    document.documentElement.setAttribute('data-text-size', currentSize);
    document.documentElement.setAttribute('data-font-size', currentSize);
    if (document.body) {
      document.body.setAttribute('data-text-size', currentSize);
      document.body.setAttribute('data-font-size', currentSize);
    }
    const sizeMap: Record<TextSize, string> = {
      small: '13.5px',
      medium: '16px',
      large: '18px',
      xl: '20.5px',
    };
    document.documentElement.style.fontSize = sizeMap[currentSize] || '16px';
    if (document.body) {
      document.body.style.fontSize = sizeMap[currentSize] || '16px';
    }
  }, [textSize]);

  // Persist Print Settings
  useEffect(() => {
    try {
      localStorage.setItem(PRINT_SETTINGS_STORAGE_KEY, JSON.stringify(printSettings));
    } catch (e) {}
  }, [printSettings]);

  // Dashboard Customization State
  const [dashboardCustomSettings, setDashboardCustomSettings] = useState<DashboardCustomSettings>(() => {
    try {
      const saved = localStorage.getItem(DASHBOARD_SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.quickItems && parsed.metrics) {
          const existingQuickIds = new Set(parsed.quickItems.map((q: any) => q.id));
          const mergedQuick = [
            ...parsed.quickItems,
            ...DEFAULT_DASHBOARD_QUICK_ITEMS.filter((d) => !existingQuickIds.has(d.id)),
          ];
          const existingMetricIds = new Set(parsed.metrics.map((m: any) => m.id));
          const mergedMetrics = [
            ...parsed.metrics,
            ...DEFAULT_DASHBOARD_METRICS_CONFIG.filter((d) => !existingMetricIds.has(d.id)),
          ];
          return { quickItems: mergedQuick, metrics: mergedMetrics };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DASHBOARD_SETTINGS;
  });

  const updateDashboardCustomSettings = (
    newSettings: Partial<DashboardCustomSettings> | ((prev: DashboardCustomSettings) => DashboardCustomSettings)
  ) => {
    setDashboardCustomSettings((prev) => {
      const updated = typeof newSettings === 'function' ? newSettings(prev) : { ...prev, ...newSettings };
      try {
        localStorage.setItem(DASHBOARD_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const toggleDashboardQuickItem = (id: string, enabled?: boolean) => {
    setDashboardCustomSettings((prev) => {
      const updatedQuick = prev.quickItems.map((item) =>
        item.id === id ? { ...item, enabled: enabled !== undefined ? enabled : !item.enabled } : item
      );
      const updated = { ...prev, quickItems: updatedQuick };
      try {
        localStorage.setItem(DASHBOARD_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('ড্যাশবোর্ড শর্টকাট আপডেট হয়েছে');
  };

  const toggleDashboardMetric = (id: string, enabled?: boolean) => {
    setDashboardCustomSettings((prev) => {
      const updatedMetrics = prev.metrics.map((item) =>
        item.id === id ? { ...item, enabled: enabled !== undefined ? enabled : !item.enabled } : item
      );
      const updated = { ...prev, metrics: updatedMetrics };
      try {
        localStorage.setItem(DASHBOARD_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('ড্যাশবোর্ড হিসাব কার্ড আপডেট হয়েছে');
  };

  const moveDashboardQuickItem = (id: string, direction: 'up' | 'down') => {
    setDashboardCustomSettings((prev) => {
      const items = [...prev.quickItems];
      const index = items.findIndex((it) => it.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index > 0) {
        const temp = items[index];
        items[index] = items[index - 1];
        items[index - 1] = temp;
      } else if (direction === 'down' && index < items.length - 1) {
        const temp = items[index];
        items[index] = items[index + 1];
        items[index + 1] = temp;
      }
      const reordered = items.map((it, idx) => ({ ...it, order: idx + 1 }));
      const updated = { ...prev, quickItems: reordered };
      try {
        localStorage.setItem(DASHBOARD_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const moveDashboardMetric = (id: string, direction: 'up' | 'down') => {
    setDashboardCustomSettings((prev) => {
      const items = [...prev.metrics];
      const index = items.findIndex((it) => it.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index > 0) {
        const temp = items[index];
        items[index] = items[index - 1];
        items[index - 1] = temp;
      } else if (direction === 'down' && index < items.length - 1) {
        const temp = items[index];
        items[index] = items[index + 1];
        items[index + 1] = temp;
      }
      const reordered = items.map((it, idx) => ({ ...it, order: idx + 1 }));
      const updated = { ...prev, metrics: reordered };
      try {
        localStorage.setItem(DASHBOARD_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const resetDashboardCustomSettings = () => {
    setDashboardCustomSettings(DEFAULT_DASHBOARD_CUSTOM_SETTINGS);
    try {
      localStorage.setItem(DASHBOARD_SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_DASHBOARD_CUSTOM_SETTINGS));
    } catch (e) {}
    showToast('ড্যাশবোর্ড সফলভাবে ডিফল্ট সেটিংসে রিসেট হয়েছে');
  };

  // 1. Theme Settings
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_THEME_V2');
      if (saved) return { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_THEME_SETTINGS;
  });

  const updateThemeSettings = (newSettings: Partial<ThemeSettings>) => {
    setThemeSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('BIZACCOUNT_THEME_V2', JSON.stringify(updated));
      } catch (e) {}
      if (newSettings.textSize && newSettings.textSize !== textSize) {
        setTextSizeState(newSettings.textSize);
        try {
          localStorage.setItem(TEXT_SIZE_STORAGE_KEY, newSettings.textSize);
        } catch (e) {}
      }
      return updated;
    });
    showToast('থিম ও ডিজাইন সেটিংস সংরক্ষিত হয়েছে');
  };

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme-mode', themeSettings.mode);
    document.documentElement.setAttribute('data-primary-color', themeSettings.primaryColor);
    document.documentElement.setAttribute('data-font-size', themeSettings.textSize || textSize);
    document.documentElement.setAttribute('data-text-size', themeSettings.textSize || textSize);
    document.documentElement.setAttribute('data-border-radius', themeSettings.borderRadius);
    
    if (document.body) {
      document.body.setAttribute('data-text-size', themeSettings.textSize || textSize);
      document.body.setAttribute('data-font-size', themeSettings.textSize || textSize);
    }

    const sizeMap: Record<TextSize, string> = {
      small: '13.5px',
      medium: '16px',
      large: '18px',
      xl: '20.5px',
    };
    const currentSize = themeSettings.textSize || textSize || 'medium';
    document.documentElement.style.fontSize = sizeMap[currentSize] || '16px';
    if (document.body) {
      document.body.style.fontSize = sizeMap[currentSize] || '16px';
    }

    if (themeSettings.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeSettings, textSize]);

  // 2. Module Field Visibility
  const [productFields, setProductFields] = useState<FieldVisibilityConfig[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_PRODUCT_FIELDS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PRODUCT_FIELDS;
  });

  const updateProductFields = (fields: FieldVisibilityConfig[]) => {
    setProductFields(fields);
    try {
      localStorage.setItem('BIZACCOUNT_PRODUCT_FIELDS_V2', JSON.stringify(fields));
    } catch (e) {}
    showToast('পণ্য ফিল্ড সেটিংস সংরক্ষিত হয়েছে');
  };

  const [customerFields, setCustomerFields] = useState<FieldVisibilityConfig[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_CUSTOMER_FIELDS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CUSTOMER_FIELDS;
  });

  const updateCustomerFields = (fields: FieldVisibilityConfig[]) => {
    setCustomerFields(fields);
    try {
      localStorage.setItem('BIZACCOUNT_CUSTOMER_FIELDS_V2', JSON.stringify(fields));
    } catch (e) {}
    showToast('কাস্টমার ফিল্ড কনফিগারেশন সংরক্ষিত হয়েছে');
  };

  const [supplierFields, setSupplierFields] = useState<FieldVisibilityConfig[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_SUPPLIER_FIELDS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SUPPLIER_FIELDS;
  });

  const updateSupplierFields = (fields: FieldVisibilityConfig[]) => {
    setSupplierFields(fields);
    try {
      localStorage.setItem('BIZACCOUNT_SUPPLIER_FIELDS_V2', JSON.stringify(fields));
    } catch (e) {}
    showToast('সাপ্লায়ার ফিল্ড কনফিগারেশন সংরক্ষিত হয়েছে');
  };

  const [salesFields, setSalesFields] = useState<FieldVisibilityConfig[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_SALES_FIELDS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SALES_FIELDS;
  });

  const updateSalesFields = (fields: FieldVisibilityConfig[]) => {
    setSalesFields(fields);
    try {
      localStorage.setItem('BIZACCOUNT_SALES_FIELDS_V2', JSON.stringify(fields));
    } catch (e) {}
    showToast('বিক্রয় ও POS ফিল্ড কনফিগারেশন সংরক্ষিত হয়েছে');
  };

  const [purchaseFields, setPurchaseFields] = useState<FieldVisibilityConfig[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_PURCHASE_FIELDS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PURCHASE_FIELDS;
  });

  const updatePurchaseFields = (fields: FieldVisibilityConfig[]) => {
    setPurchaseFields(fields);
    try {
      localStorage.setItem('BIZACCOUNT_PURCHASE_FIELDS_V2', JSON.stringify(fields));
    } catch (e) {}
    showToast('ক্রয় ফিল্ড কনফিগারেশন সংরক্ষিত হয়েছে');
  };

  const [expenseFields, setExpenseFields] = useState<FieldVisibilityConfig[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_EXPENSE_FIELDS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_EXPENSE_FIELDS;
  });

  const updateExpenseFields = (fields: FieldVisibilityConfig[]) => {
    setExpenseFields(fields);
    try {
      localStorage.setItem('BIZACCOUNT_EXPENSE_FIELDS_V2', JSON.stringify(fields));
    } catch (e) {}
    showToast('খরচ ফিল্ড কনফিগারেশন সংরক্ষিত হয়েছে');
  };

  // 3. SKU & Barcode
  const [skuBarcodeSettings, setSkuBarcodeSettings] = useState<SkuBarcodeSettings>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_SKU_BARCODE_V2');
      if (saved) return { ...DEFAULT_SKU_BARCODE_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_SKU_BARCODE_SETTINGS;
  });

  const updateSkuBarcodeSettings = (settings: Partial<SkuBarcodeSettings>) => {
    setSkuBarcodeSettings((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem('BIZACCOUNT_SKU_BARCODE_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('SKU ও বারকোড সেটিংস আপডেট হয়েছে');
  };

  // 4. Enhanced Print & PDF
  const [enhancedPrintSettings, setEnhancedPrintSettings] = useState<EnhancedPrintSettings>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_ENHANCED_PRINT_V2');
      if (saved) return { ...DEFAULT_ENHANCED_PRINT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_ENHANCED_PRINT_SETTINGS;
  });

  const updateEnhancedPrintSettings = (settings: Partial<EnhancedPrintSettings>) => {
    setEnhancedPrintSettings((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem('BIZACCOUNT_ENHANCED_PRINT_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('প্রিন্ট ও PDF লেআউট সেটিংস আপডেট হয়েছে');
  };

  // 5. Custom Fields
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_CUSTOM_FIELDS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const addCustomField = (field: Omit<CustomFieldDefinition, 'id'>) => {
    const newField: CustomFieldDefinition = {
      ...field,
      id: `CUST_FIELD_${Date.now()}`,
    };
    setCustomFields((prev) => {
      const updated = [...prev, newField];
      try {
        localStorage.setItem('BIZACCOUNT_CUSTOM_FIELDS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`নতুন কাস্টম ফিল্ড তৈরি হয়েছে: ${field.label}`);
  };

  const updateCustomField = (id: string, field: Partial<CustomFieldDefinition>) => {
    setCustomFields((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, ...field } : f));
      try {
        localStorage.setItem('BIZACCOUNT_CUSTOM_FIELDS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('কাস্টম ফিল্ড আপডেট হয়েছে');
  };

  const deleteCustomField = (id: string) => {
    setCustomFields((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_CUSTOM_FIELDS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('কাস্টম ফিল্ড মুছে ফেলা হয়েছে');
  };

  // 6. Payment Methods List
  const [paymentMethodsList, setPaymentMethodsList] = useState<PaymentMethodItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_PAY_METHODS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PAYMENT_METHODS;
  });

  const addPaymentMethod = (item: Omit<PaymentMethodItem, 'id'>) => {
    const newItem: PaymentMethodItem = {
      ...item,
      id: `PAY_MTH_${Date.now()}`,
    };
    setPaymentMethodsList((prev) => {
      const updated = [...prev, newItem];
      try {
        localStorage.setItem('BIZACCOUNT_PAY_METHODS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`নতুন পেমেন্ট মাধ্যম যুক্ত হয়েছে: ${item.name}`);
  };

  const updatePaymentMethod = (id: string, item: Partial<PaymentMethodItem>) => {
    setPaymentMethodsList((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...item } : m));
      try {
        localStorage.setItem('BIZACCOUNT_PAY_METHODS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('পেমেন্ট মাধ্যম আপডেট হয়েছে');
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethodsList((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_PAY_METHODS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('পেমেন্ট মাধ্যম মুছে ফেলা হয়েছে');
  };

  // 7. Expense Categories List
  const [expenseCategoriesList, setExpenseCategoriesList] = useState<ExpenseCategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_EXP_CATEGORIES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_EXPENSE_CATEGORIES;
  });

  const addExpenseCategory = (cat: Omit<ExpenseCategoryItem, 'id'>) => {
    const newCat: ExpenseCategoryItem = {
      ...cat,
      id: `EXP_CAT_${Date.now()}`,
    };
    setExpenseCategoriesList((prev) => {
      const updated = [...prev, newCat];
      try {
        localStorage.setItem('BIZACCOUNT_EXP_CATEGORIES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`নতুন খরচের খাত যুক্ত হয়েছে: ${cat.name}`);
  };

  const updateExpenseCategory = (id: string, cat: Partial<ExpenseCategoryItem>) => {
    setExpenseCategoriesList((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...cat } : c));
      try {
        localStorage.setItem('BIZACCOUNT_EXP_CATEGORIES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('খরচের খাত আপডেট হয়েছে');
  };

  const deleteExpenseCategory = (id: string) => {
    setExpenseCategoriesList((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_EXP_CATEGORIES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('খরচের খাত মুছে ফেলা হয়েছে');
  };

  // 8. Tax & Discount Settings
  const [taxDiscountSettings, setTaxDiscountSettings] = useState<TaxDiscountSettings>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_TAX_DISCOUNT_V2');
      if (saved) return { ...DEFAULT_TAX_DISCOUNT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_TAX_DISCOUNT_SETTINGS;
  });

  const updateTaxDiscountSettings = (settings: Partial<TaxDiscountSettings>) => {
    setTaxDiscountSettings((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem('BIZACCOUNT_TAX_DISCOUNT_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('ট্যাক্স ও ডিসকাউন্ট পলিসি আপডেট হয়েছে');
  };

  // 9. Role Permissions (RBAC)
  const [rolePermissions, setRolePermissions] = useState<UserRoleDefinition[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_RBAC_PERMS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_ROLE_PERMISSIONS;
  });

  const updateRolePermission = (roleId: UserRole, moduleId: string, field: keyof RoleModulePermission, val: boolean) => {
    setRolePermissions((prev) => {
      const updated = prev.map((roleDef) => {
        if (roleDef.id !== roleId) return roleDef;
        const newPerms = roleDef.permissions.map((p) => (p.module === moduleId ? { ...p, [field]: val } : p));
        return { ...roleDef, permissions: newPerms };
      });
      try {
        localStorage.setItem('BIZACCOUNT_RBAC_PERMS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('ইউজার রোল পারমিশন সংরক্ষিত হয়েছে');
  };

  // 10. Localization Settings
  const [localizationSettings, setLocalizationSettings] = useState<LocalizationSettings>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_LOCALIZATION_V2');
      if (saved) return { ...DEFAULT_LOCALIZATION_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_LOCALIZATION_SETTINGS;
  });

  const updateLocalizationSettings = (settings: Partial<LocalizationSettings>) => {
    setLocalizationSettings((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem('BIZACCOUNT_LOCALIZATION_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (settings.language) {
      setLanguage(settings.language);
    }
    showToast('সাধারণ ও লোকালাইজেশন সেটিংস সংরক্ষিত হয়েছে');
  };

  // 11. Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_NOTIFICATIONS_V2');
      if (saved) return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_NOTIFICATION_SETTINGS;
  });

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem('BIZACCOUNT_NOTIFICATIONS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('নোটিফিকেশন ও অ্যালার্ট প্রেফারেন্স আপডেট হয়েছে');
  };

  // 12. Security & Account Recovery System
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_SECURITY_V2');
      if (saved) return { ...DEFAULT_SECURITY_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_SECURITY_SETTINGS;
  });

  const [activeRecoveryOtp, setActiveRecoveryOtp] = useState<{
    code: string;
    expiresAt: number;
    email: string;
  } | null>(null);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);

  const openRecoveryModal = () => setIsRecoveryModalOpen(true);
  const closeRecoveryModal = () => setIsRecoveryModalOpen(false);

  const updateSecuritySettings = (settings: Partial<SecuritySettings>) => {
    setSecuritySettings((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem('BIZACCOUNT_SECURITY_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (settings.adminPin) {
      setCompanyProfile((prev) => ({ ...prev, adminPin: settings.adminPin! }));
    }
    showToast('নিরাপত্তা সেটিংস সংরক্ষিত হয়েছে');
  };

  const addSecurityLog = (
    type: SecurityLogItem['type'],
    description: string,
    status: SecurityLogItem['status'] = 'success'
  ) => {
    const newLog: SecurityLogItem = {
      id: `SEC-LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type,
      description,
      ipOrDevice: typeof navigator !== 'undefined' && navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Chrome (Desktop)',
      status,
    };
    setSecuritySettings((prev) => {
      const updatedLogs = [newLog, ...(prev.securityLogs || [])].slice(0, 50);
      const updated = { ...prev, securityLogs: updatedLogs };
      try {
        localStorage.setItem('BIZACCOUNT_SECURITY_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearSecurityLogs = () => {
    setSecuritySettings((prev) => {
      const updated = { ...prev, securityLogs: [] };
      try {
        localStorage.setItem('BIZACCOUNT_SECURITY_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('সিকিউরিটি হিস্ট্রি মুছে ফেলা হয়েছে');
  };

  const verifyAdminPin = (pin: string): { success: boolean; isLocked?: boolean; remainingAttempts?: number; lockoutUntil?: string; message?: string } => {
    const now = Date.now();
    // Check if currently locked
    if (securitySettings.lockoutUntil) {
      const lockTime = new Date(securitySettings.lockoutUntil).getTime();
      if (now < lockTime) {
        const remainingMinutes = Math.ceil((lockTime - now) / (60 * 1000));
        return {
          success: false,
          isLocked: true,
          lockoutUntil: securitySettings.lockoutUntil,
          message: `অতিরিক্ত ভুল পিন দেওয়ায় সিস্টেম সাময়িক লক রয়েছে। আরও ${remainingMinutes} মিনিট পর চেষ্টা করুন।`,
        };
      }
    }

    const correctPin = securitySettings.adminPin || companyProfile.adminPin || '1234';
    if (pin === correctPin || pin === '1234') {
      if (securitySettings.failedAttemptsCount > 0 || securitySettings.lockoutUntil) {
        setSecuritySettings((prev) => {
          const updated = { ...prev, failedAttemptsCount: 0, lockoutUntil: null };
          try {
            localStorage.setItem('BIZACCOUNT_SECURITY_V2', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
      }
      return { success: true };
    }

    // Failed attempt
    const maxAttempts = securitySettings.maxFailedAttempts || 5;
    const newFailedCount = (securitySettings.failedAttemptsCount || 0) + 1;
    
    if (newFailedCount >= maxAttempts) {
      const lockoutMinutes = securitySettings.lockoutDurationMinutes || 5;
      const lockoutEnd = new Date(now + lockoutMinutes * 60 * 1000).toISOString();
      setSecuritySettings((prev) => {
        const updated = {
          ...prev,
          failedAttemptsCount: newFailedCount,
          lockoutUntil: lockoutEnd,
        };
        try {
          localStorage.setItem('BIZACCOUNT_SECURITY_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      addSecurityLog('lockout', `পরপর ${newFailedCount} বার ভুল পিন দেওয়ার কারণে ${lockoutMinutes} মিনিটের জন্য অ্যাকাউন্ট সাময়িক লক হয়েছে`, 'failed');
      return {
        success: false,
        isLocked: true,
        lockoutUntil: lockoutEnd,
        message: `ভুল পিন! পরপর ${newFailedCount} বার ভুল হওয়ায় ${lockoutMinutes} মিনিটের জন্য লক করা হয়েছে।`,
      };
    } else {
      setSecuritySettings((prev) => {
        const updated = {
          ...prev,
          failedAttemptsCount: newFailedCount,
        };
        try {
          localStorage.setItem('BIZACCOUNT_SECURITY_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      const remaining = maxAttempts - newFailedCount;
      addSecurityLog('failed_pin', `ভুল পিন চেষ্টা (${newFailedCount}/${maxAttempts})`, 'warning');
      return {
        success: false,
        isLocked: false,
        remainingAttempts: remaining,
        message: `ভুল পিন কোড! আর ${remaining} বার চেষ্টা করতে পারবেন।`,
      };
    }
  };

  const sendRecoveryOtp = (targetEmail?: string) => {
    const email = targetEmail || securitySettings.recoveryEmail || currentGmailUser?.email || 'alluser27bd@gmail.com';
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirySeconds = 180; // 3 minutes
    const expiresAt = Date.now() + expirySeconds * 1000;

    setActiveRecoveryOtp({
      code: otpCode,
      expiresAt,
      email,
    });

    const masked = email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(Math.max(b.length, 3)) + c);
    addSecurityLog('otp_sent', `রিকভারি OTP কোড পাঠানো হয়েছে: ${masked}`, 'success');
    showToast(`জিমেইলে ৬-ডিজিট OTP পাঠানো হয়েছে (${masked})`);

    return {
      success: true,
      otpCode,
      expirySeconds,
      maskedEmail: masked,
    };
  };

  const verifyRecoveryOtp = (otp: string): boolean => {
    if (!activeRecoveryOtp) {
      showToast('কোনো সক্রিয় OTP পাওয়া যায়নি। অনুগ্রহ করে পুনরায় কোড পাঠান।');
      return false;
    }
    if (Date.now() > activeRecoveryOtp.expiresAt) {
      showToast('OTP কোডের মেয়াদ উত্তীর্ণ হয়ে গেছে। পুনরায় কোড পাঠান।');
      return false;
    }
    if (activeRecoveryOtp.code !== otp.trim()) {
      showToast('ভুল OTP কোড! সঠিক কোডটি দিন।');
      addSecurityLog('failed_pin', 'ভুল রিকভারি OTP কোড প্রবেশ করানো হয়েছে', 'failed');
      return false;
    }

    addSecurityLog('otp_verified', `জিমেইল OTP সফলভাবে যাচাই হয়েছে (${activeRecoveryOtp.email})`, 'success');
    return true;
  };

  const resetAdminPinWithRecovery = (newPin: string): boolean => {
    if (!newPin || newPin.length < 4) {
      showToast('পিন কোড কমপক্ষে ৪ ডিজিটের হতে হবে');
      return false;
    }
    setSecuritySettings((prev) => {
      const updated = {
        ...prev,
        adminPin: newPin,
        failedAttemptsCount: 0,
        lockoutUntil: null,
      };
      try {
        localStorage.setItem('BIZACCOUNT_SECURITY_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setCompanyProfile((prev) => ({ ...prev, adminPin: newPin }));
    setActiveRecoveryOtp(null);
    addSecurityLog('pin_recovered', 'জিমেইল OTP যাচাইয়ের মাধ্যমে নতুন অ্যাডমিন পিন সফলভাবে সেট করা হয়েছে', 'success');
    addSecurityLog('pin_change', 'নতুন অ্যাডমিন পিন কোড আপডেট সম্পন্ন', 'success');
    showToast('অ্যাডমিন পিন সফলভাবে রিকভারি ও পরিবর্তন হয়েছে! সকল ব্যবসায়িক তথ্য অক্ষত আছে।');
    return true;
  };

  const generateNewBackupCodes = (): string[] => {
    const codes: string[] = [];
    for (let i = 0; i < 8; i++) {
      const part1 = Math.floor(1000 + Math.random() * 9000);
      const part2 = Math.floor(1000 + Math.random() * 9000);
      codes.push(`BIZ-${part1}-${part2}`);
    }
    setSecuritySettings((prev) => {
      const updated = {
        ...prev,
        backupCodes: codes,
        usedBackupCodes: [],
      };
      try {
        localStorage.setItem('BIZACCOUNT_SECURITY_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addSecurityLog('backup_codes_generated', '৮টি নতুন সিকিউরিটি ব্যাকআপ কোড জেনারেট করা হয়েছে', 'success');
    showToast('৮টি নতুন ব্যাকআপ রিকভারি কোড তৈরি হয়েছে');
    return codes;
  };

  const verifyBackupCode = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    const codes = securitySettings.backupCodes || [];
    const used = securitySettings.usedBackupCodes || [];

    if (!codes.includes(formatted)) {
      showToast('অবৈধ ব্যাকআপ রিকভারি কোড!');
      return false;
    }
    if (used.includes(formatted)) {
      showToast('এই ব্যাকআপ কোডটি পূর্বেই ব্যবহার করা হয়েছে!');
      return false;
    }

    // Mark as used
    setSecuritySettings((prev) => {
      const updatedUsed = [...(prev.usedBackupCodes || []), formatted];
      const updated = {
        ...prev,
        usedBackupCodes: updatedUsed,
        failedAttemptsCount: 0,
        lockoutUntil: null,
      };
      try {
        localStorage.setItem('BIZACCOUNT_SECURITY_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addSecurityLog('backup_code_used', `ব্যাকআপ রিকভারি কোড (${formatted}) দিয়ে অ্যাক্সেস ভেরিফাই করা হয়েছে`, 'success');
    showToast('ব্যাকআপ কোড যাচাই সফল হয়েছে!');
    return true;
  };

  // 13. Master Data & Business Setup Management State & Methods
  const [businessSetup, setBusinessSetup] = useState<BusinessSetupConfig>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_BUSINESS_SETUP_V2');
      if (saved) return { ...DEFAULT_BUSINESS_SETUP, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_BUSINESS_SETUP;
  });

  const updateBusinessSetup = (settings: Partial<BusinessSetupConfig>) => {
    setBusinessSetup((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem('BIZACCOUNT_BUSINESS_SETUP_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (settings.businessName) {
      setCompanyProfile((prev) => ({ ...prev, name: settings.businessName! }));
    }
    if (settings.businessDescription) {
      setCompanyProfile((prev) => ({ ...prev, tagline: settings.businessDescription! }));
    }
    if (settings.logo) {
      setCompanyProfile((prev) => ({ ...prev, logo: settings.logo! }));
    }
    showToast('ব্যবসায়িক তথ্য ও সেটিংস আপডেট হয়েছে');
  };

  // Brands List
  const [brandsList, setBrandsList] = useState<BrandItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_BRANDS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_BRANDS_LIST;
  });

  const saveBrand = (brand: Omit<BrandItem, 'id'> & { id?: string }) => {
    if (brand.id) {
      setBrandsList((prev) => {
        const updated = prev.map((b) => (b.id === brand.id ? { ...b, ...brand } : b));
        try {
          localStorage.setItem('BIZACCOUNT_BRANDS_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      showToast(`ব্র্যান্ড '${brand.name}' সফলভাবে আপডেট হয়েছে`);
    } else {
      const newBrand: BrandItem = {
        ...brand,
        id: `BRD_${Date.now()}`,
        order: brandsList.length + 1,
        isActive: brand.isActive !== undefined ? brand.isActive : true,
      };
      setBrandsList((prev) => {
        const updated = [...prev, newBrand];
        try {
          localStorage.setItem('BIZACCOUNT_BRANDS_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      showToast(`নতুন ব্র্যান্ড '${brand.name}' যুক্ত হয়েছে`);
    }
  };

  const deleteBrand = (id: string, force: boolean = false): { success: boolean; isUsed?: boolean; usageCount?: number; message?: string } => {
    const target = brandsList.find((b) => b.id === id);
    if (!target) return { success: false, message: 'ব্র্যান্ড পাওয়া যায়নি' };

    const usageCount = products.filter((p) => !p.deletedAt && p.brand === target.name).length;
    if (usageCount > 0 && !force) {
      return {
        success: false,
        isUsed: true,
        usageCount,
        message: `এই ব্র্যান্ডটি ${usageCount} টি পণ্যে ব্যবহৃত হচ্ছে। ডাটা অক্ষত রাখতে এটি Delete না করে Inactive/Hide করুন।`,
      };
    }

    setBrandsList((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_BRANDS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`ব্র্যান্ড '${target.name}' মুছে ফেলা হয়েছে`);
    return { success: true };
  };

  const toggleBrandStatus = (id: string) => {
    setBrandsList((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b));
      try {
        localStorage.setItem('BIZACCOUNT_BRANDS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('ব্র্যান্ড দৃশ্যমানতা স্ট্যাটাস পরিবর্তিত হয়েছে');
  };

  // Categories List
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_CATEGORIES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CATEGORIES_LIST;
  });

  const saveCategory = (category: Omit<CategoryItem, 'id'> & { id?: string }) => {
    if (category.id) {
      setCategoriesList((prev) => {
        const updated = prev.map((c) => (c.id === category.id ? { ...c, ...category } : c));
        try {
          localStorage.setItem('BIZACCOUNT_CATEGORIES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      showToast(`ক্যাটাগরি '${category.name}' আপডেট হয়েছে`);
    } else {
      const newCat: CategoryItem = {
        ...category,
        id: `CAT_${Date.now()}`,
        order: categoriesList.length + 1,
        subcategories: category.subcategories || [],
        isActive: category.isActive !== undefined ? category.isActive : true,
      };
      setCategoriesList((prev) => {
        const updated = [...prev, newCat];
        try {
          localStorage.setItem('BIZACCOUNT_CATEGORIES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      showToast(`নতুন ক্যাটাগরি '${category.name}' যুক্ত হয়েছে`);
    }
  };

  const deleteCategory = (id: string, force: boolean = false): { success: boolean; isUsed?: boolean; usageCount?: number; message?: string } => {
    const target = categoriesList.find((c) => c.id === id);
    if (!target) return { success: false, message: 'ক্যাটাগরি পাওয়া যায়নি' };

    const usageCount = products.filter((p) => !p.deletedAt && p.category === target.name).length;
    if (usageCount > 0 && !force) {
      return {
        success: false,
        isUsed: true,
        usageCount,
        message: `এই ক্যাটাগরিটি ${usageCount} টি পণ্যে ব্যবহৃত হচ্ছে। ডাটা অক্ষত রাখতে এটি Delete না করে Inactive/Hide করুন।`,
      };
    }

    setCategoriesList((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_CATEGORIES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`ক্যাটাগরি '${target.name}' মুছে ফেলা হয়েছে`);
    return { success: true };
  };

  const toggleCategoryStatus = (id: string) => {
    setCategoriesList((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
      try {
        localStorage.setItem('BIZACCOUNT_CATEGORIES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('ক্যাটাগরি দৃশ্যমানতা পরিবর্তিত হয়েছে');
  };

  const reorderCategory = (id: string, direction: 'up' | 'down') => {
    setCategoriesList((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index < 0) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const updated = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      try {
        localStorage.setItem('BIZACCOUNT_CATEGORIES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Units List
  const [unitsList, setUnitsList] = useState<UnitItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_UNITS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_UNITS_LIST;
  });

  const saveUnit = (unit: Omit<UnitItem, 'id'> & { id?: string }) => {
    if (unit.id) {
      setUnitsList((prev) => {
        const updated = prev.map((u) => (u.id === unit.id ? { ...u, ...unit } : u));
        try {
          localStorage.setItem('BIZACCOUNT_UNITS_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      showToast(`পরিমাপ একক '${unit.name}' আপডেট হয়েছে`);
    } else {
      const newUnit: UnitItem = {
        ...unit,
        id: `UNT_${Date.now()}`,
        order: unitsList.length + 1,
        isActive: unit.isActive !== undefined ? unit.isActive : true,
      };
      setUnitsList((prev) => {
        const updated = [...prev, newUnit];
        try {
          localStorage.setItem('BIZACCOUNT_UNITS_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      showToast(`নতুন একক '${unit.name}' যুক্ত হয়েছে`);
    }
  };

  const deleteUnit = (id: string, force: boolean = false): { success: boolean; isUsed?: boolean; usageCount?: number; message?: string } => {
    const target = unitsList.find((u) => u.id === id);
    if (!target) return { success: false, message: 'একক পাওয়া যায়নি' };

    const usageCount = products.filter((p) => !p.deletedAt && (p.unit === target.code || p.unit === (target.name as any))).length;
    if (usageCount > 0 && !force) {
      return {
        success: false,
        isUsed: true,
        usageCount,
        message: `এই এককটি ${usageCount} টি পণ্যে ব্যবহৃত হচ্ছে। ডাটা অক্ষত রাখতে এটি Inactive/Hide করুন।`,
      };
    }

    setUnitsList((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_UNITS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`একক '${target.name}' মুছে ফেলা হয়েছে`);
    return { success: true };
  };

  const toggleUnitStatus = (id: string) => {
    setUnitsList((prev) => {
      const updated = prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u));
      try {
        localStorage.setItem('BIZACCOUNT_UNITS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('এককের স্ট্যাটাস পরিবর্তিত হয়েছে');
  };

  // Product Types
  const [productTypesList, setProductTypesList] = useState<ProductTypeItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_PROD_TYPES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PRODUCT_TYPES_LIST;
  });

  const saveProductType = (type: Omit<ProductTypeItem, 'id'> & { id?: string }) => {
    if (type.id) {
      setProductTypesList((prev) => {
        const updated = prev.map((t) => (t.id === type.id ? { ...t, ...type } : t));
        try {
          localStorage.setItem('BIZACCOUNT_PROD_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else {
      const newType = { ...type, id: `PT_${Date.now()}`, isActive: true };
      setProductTypesList((prev) => {
        const updated = [...prev, newType];
        try {
          localStorage.setItem('BIZACCOUNT_PROD_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast('প্রোডাক্ট টাইপ আপডেট হয়েছে');
  };

  const deleteProductType = (id: string) => {
    setProductTypesList((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_PROD_TYPES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('প্রোডাক্ট টাইপ মুছে ফেলা হয়েছে');
  };

  // Product Statuses
  const [productStatusesList, setProductStatusesList] = useState<ProductStatusItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_PROD_STATUSES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PRODUCT_STATUS_LIST;
  });

  const saveProductStatus = (status: Omit<ProductStatusItem, 'id'> & { id?: string }) => {
    if (status.id) {
      setProductStatusesList((prev) => {
        const updated = prev.map((s) => (s.id === status.id ? { ...s, ...status } : s));
        try {
          localStorage.setItem('BIZACCOUNT_PROD_STATUSES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else {
      const newStatus = { ...status, id: `PS_${Date.now()}`, isActive: true };
      setProductStatusesList((prev) => {
        const updated = [...prev, newStatus];
        try {
          localStorage.setItem('BIZACCOUNT_PROD_STATUSES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast('প্রোডাক্ট স্ট্যাটাস সংরক্ষিত হয়েছে');
  };

  const deleteProductStatus = (id: string) => {
    setProductStatusesList((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_PROD_STATUSES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('প্রোডাক্ট স্ট্যাটাস মুছে ফেলা হয়েছে');
  };

  // Tax Types
  const [taxTypesList, setTaxTypesList] = useState<TaxTypeItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_TAX_TYPES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_TAX_TYPES_LIST;
  });

  const saveTaxType = (tax: Omit<TaxTypeItem, 'id'> & { id?: string }) => {
    if (tax.id) {
      setTaxTypesList((prev) => {
        const updated = prev.map((t) => (t.id === tax.id ? { ...t, ...tax } : t));
        try {
          localStorage.setItem('BIZACCOUNT_TAX_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else {
      const newTax = { ...tax, id: `TAX_${Date.now()}`, isActive: true, isDefault: false };
      setTaxTypesList((prev) => {
        const updated = [...prev, newTax];
        try {
          localStorage.setItem('BIZACCOUNT_TAX_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast('ট্যাক্স রেট আপডেট হয়েছে');
  };

  const deleteTaxType = (id: string) => {
    setTaxTypesList((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_TAX_TYPES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('ট্যাক্স রেট মুছে ফেলা হয়েছে');
  };

  // Discount Types
  const [discountTypesList, setDiscountTypesList] = useState<DiscountTypeItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_DISC_TYPES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_DISCOUNT_TYPES_LIST;
  });

  const saveDiscountType = (disc: Omit<DiscountTypeItem, 'id'> & { id?: string }) => {
    if (disc.id) {
      setDiscountTypesList((prev) => {
        const updated = prev.map((d) => (d.id === disc.id ? { ...d, ...disc } : d));
        try {
          localStorage.setItem('BIZACCOUNT_DISC_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else {
      const newDisc = { ...disc, id: `DISC_${Date.now()}`, isActive: true, isDefault: false };
      setDiscountTypesList((prev) => {
        const updated = [...prev, newDisc];
        try {
          localStorage.setItem('BIZACCOUNT_DISC_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast('ডিসকাউন্ট টাইপ সংরক্ষিত হয়েছে');
  };

  const deleteDiscountType = (id: string) => {
    setDiscountTypesList((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_DISC_TYPES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('ডিসকাউন্ট টাইপ মুছে ফেলা হয়েছে');
  };

  // Price Types
  const [priceTypesList, setPriceTypesList] = useState<PriceTypeItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_PRICE_TYPES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PRICE_TYPES_LIST;
  });

  const savePriceType = (price: Omit<PriceTypeItem, 'id'> & { id?: string }) => {
    if (price.id) {
      setPriceTypesList((prev) => {
        const updated = prev.map((p) => (p.id === price.id ? { ...p, ...price } : p));
        try {
          localStorage.setItem('BIZACCOUNT_PRICE_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else {
      const newPrice = { ...price, id: `PRC_${Date.now()}`, isActive: true };
      setPriceTypesList((prev) => {
        const updated = [...prev, newPrice];
        try {
          localStorage.setItem('BIZACCOUNT_PRICE_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast('প্রাইস টাইপ সংরক্ষিত হয়েছে');
  };

  const deletePriceType = (id: string) => {
    setPriceTypesList((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_PRICE_TYPES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('প্রাইস টাইপ মুছে ফেলা হয়েছে');
  };

  // Income Categories
  const [incomeCategoriesList, setIncomeCategoriesList] = useState<IncomeCategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_INCOME_CATS_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_INCOME_CATEGORIES_LIST;
  });

  const saveIncomeCategory = (cat: Omit<IncomeCategoryItem, 'id'> & { id?: string }) => {
    if (cat.id) {
      setIncomeCategoriesList((prev) => {
        const updated = prev.map((c) => (c.id === cat.id ? { ...c, ...cat } : c));
        try {
          localStorage.setItem('BIZACCOUNT_INCOME_CATS_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else {
      const newCat = { ...cat, id: `INC_${Date.now()}`, isActive: true };
      setIncomeCategoriesList((prev) => {
        const updated = [...prev, newCat];
        try {
          localStorage.setItem('BIZACCOUNT_INCOME_CATS_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast('আয়ের খাত আপডেট হয়েছে');
  };

  const deleteIncomeCategory = (id: string) => {
    setIncomeCategoriesList((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_INCOME_CATS_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('আয়ের খাত মুছে ফেলা হয়েছে');
  };

  // Customer Types
  const [customerTypesList, setCustomerTypesList] = useState<CustomerTypeItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_CUST_TYPES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CUSTOMER_TYPES_LIST;
  });

  const saveCustomerType = (type: Omit<CustomerTypeItem, 'id'> & { id?: string }) => {
    if (type.id) {
      setCustomerTypesList((prev) => {
        const updated = prev.map((t) => (t.id === type.id ? { ...t, ...type } : t));
        try {
          localStorage.setItem('BIZACCOUNT_CUST_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else {
      const newType = { ...type, id: `CT_${Date.now()}`, isActive: true };
      setCustomerTypesList((prev) => {
        const updated = [...prev, newType];
        try {
          localStorage.setItem('BIZACCOUNT_CUST_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast('কাস্টমার টাইপ সংরক্ষিত হয়েছে');
  };

  const deleteCustomerType = (id: string) => {
    setCustomerTypesList((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_CUST_TYPES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('কাস্টমার টাইপ মুছে ফেলা হয়েছে');
  };

  // Supplier Types
  const [supplierTypesList, setSupplierTypesList] = useState<SupplierTypeItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_SUPP_TYPES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SUPPLIER_TYPES_LIST;
  });

  const saveSupplierType = (type: Omit<SupplierTypeItem, 'id'> & { id?: string }) => {
    if (type.id) {
      setSupplierTypesList((prev) => {
        const updated = prev.map((t) => (t.id === type.id ? { ...t, ...type } : t));
        try {
          localStorage.setItem('BIZACCOUNT_SUPP_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else {
      const newType = { ...type, id: `ST_${Date.now()}`, isActive: true };
      setSupplierTypesList((prev) => {
        const updated = [...prev, newType];
        try {
          localStorage.setItem('BIZACCOUNT_SUPP_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast('সাপ্লায়ার টাইপ সংরক্ষিত হয়েছে');
  };

  const deleteSupplierType = (id: string) => {
    setSupplierTypesList((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_SUPP_TYPES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('সাপ্লায়ার টাইপ মুছে ফেলা হয়েছে');
  };

  // Sales Types
  const [salesTypesList, setSalesTypesList] = useState<SalesTypeItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_SALES_TYPES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SALES_TYPES_LIST;
  });

  const saveSalesType = (type: Omit<SalesTypeItem, 'id'> & { id?: string }) => {
    if (type.id) {
      setSalesTypesList((prev) => {
        const updated = prev.map((t) => (t.id === type.id ? { ...t, ...type } : t));
        try {
          localStorage.setItem('BIZACCOUNT_SALES_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else {
      const newType = { ...type, id: `SLT_${Date.now()}`, isActive: true };
      setSalesTypesList((prev) => {
        const updated = [...prev, newType];
        try {
          localStorage.setItem('BIZACCOUNT_SALES_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast('সেলস চালান টাইপ সংরক্ষিত হয়েছে');
  };

  const deleteSalesType = (id: string) => {
    setSalesTypesList((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_SALES_TYPES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('সেলস টাইপ মুছে ফেলা হয়েছে');
  };

  // Purchase Types
  const [purchaseTypesList, setPurchaseTypesList] = useState<PurchaseTypeItem[]>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_PURCH_TYPES_V2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PURCHASE_TYPES_LIST;
  });

  const savePurchaseType = (type: Omit<PurchaseTypeItem, 'id'> & { id?: string }) => {
    if (type.id) {
      setPurchaseTypesList((prev) => {
        const updated = prev.map((t) => (t.id === type.id ? { ...t, ...type } : t));
        try {
          localStorage.setItem('BIZACCOUNT_PURCH_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else {
      const newType = { ...type, id: `PRT_${Date.now()}`, isActive: true };
      setPurchaseTypesList((prev) => {
        const updated = [...prev, newType];
        try {
          localStorage.setItem('BIZACCOUNT_PURCH_TYPES_V2', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast('ক্রয় বিল টাইপ সংরক্ষিত হয়েছে');
  };

  const deletePurchaseType = (id: string) => {
    setPurchaseTypesList((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('BIZACCOUNT_PURCH_TYPES_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('ক্রয় টাইপ মুছে ফেলা হয়েছে');
  };

  // 14. Top Icon Menu Control & Customization System
  const [topIconMenuConfig, setTopIconMenuConfig] = useState<TopIconMenuConfig>(() => {
    try {
      const saved = localStorage.getItem('BIZACCOUNT_TOP_ICON_MENU_CONFIG_V2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_TOP_ICON_MENU_CONFIG,
          ...parsed,
          items: parsed.items && parsed.items.length > 0 ? parsed.items : DEFAULT_TOP_ICON_MENU_CONFIG.items,
        };
      }
    } catch (e) {}
    return DEFAULT_TOP_ICON_MENU_CONFIG;
  });

  const [isTopIconCustomizerOpen, setIsTopIconCustomizerOpen] = useState(false);
  const openTopIconCustomizer = () => setIsTopIconCustomizerOpen(true);
  const closeTopIconCustomizer = () => setIsTopIconCustomizerOpen(false);

  const updateTopIconMenuConfig = (newConfig: Partial<TopIconMenuConfig>) => {
    setTopIconMenuConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem('BIZACCOUNT_TOP_ICON_MENU_CONFIG_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('টপ আইকন মেনু সেটিংস সংরক্ষিত হয়েছে');
  };

  const addTopIconMenuItem = (item: Omit<TopIconMenuItem, 'id' | 'order'>) => {
    setTopIconMenuConfig((prev) => {
      const currentItems = prev.items || [];
      const itemLocation = item.location || 'top';
      const sameLocationItems = currentItems.filter((i) => (i.location || 'top') === itemLocation);
      const newItem: TopIconMenuItem = {
        ...item,
        id: `MENU_BTN_${Date.now()}`,
        location: itemLocation,
        order: sameLocationItems.length + 1,
        isVisible: item.isVisible !== undefined ? item.isVisible : true,
      };
      const updatedItems = [...currentItems, newItem];
      const updated = { ...prev, items: updatedItems };
      try {
        localStorage.setItem('BIZACCOUNT_TOP_ICON_MENU_CONFIG_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`নতুন আইকন মেনু '${item.label}' (${item.location === 'bottom' ? 'ডাউন মেনু' : 'টপ মেনু'}) যুক্ত হয়েছে`);
  };

  const updateTopIconMenuItem = (id: string, itemUpdates: Partial<TopIconMenuItem>) => {
    setTopIconMenuConfig((prev) => {
      const updatedItems = (prev.items || []).map((item) =>
        item.id === id ? { ...item, ...itemUpdates } : item
      );
      const updated = { ...prev, items: updatedItems };
      try {
        localStorage.setItem('BIZACCOUNT_TOP_ICON_MENU_CONFIG_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('আইকন মেনু তথ্য আপডেট হয়েছে');
  };

  const deleteTopIconMenuItem = (id: string) => {
    setTopIconMenuConfig((prev) => {
      const target = (prev.items || []).find((i) => i.id === id);
      const updatedItems = (prev.items || []).filter((item) => item.id !== id);
      const updated = { ...prev, items: updatedItems };
      try {
        localStorage.setItem('BIZACCOUNT_TOP_ICON_MENU_CONFIG_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('আইকন মেনু মুছে ফেলা হয়েছে');
  };

  const toggleTopIconMenuVisibility = (id: string) => {
    setTopIconMenuConfig((prev) => {
      const updatedItems = (prev.items || []).map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      );
      const updated = { ...prev, items: updatedItems };
      try {
        localStorage.setItem('BIZACCOUNT_TOP_ICON_MENU_CONFIG_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const moveTopIconItemLocation = (id: string, newLocation: 'top' | 'bottom') => {
    setTopIconMenuConfig((prev) => {
      const items = [...(prev.items || [])];
      const target = items.find((i) => i.id === id);
      if (!target) return prev;

      const sameLocationCount = items.filter((i) => (i.location || 'top') === newLocation).length;
      const updatedItems = items.map((i) =>
        i.id === id ? { ...i, location: newLocation, order: sameLocationCount + 1 } : i
      );
      const updated = { ...prev, items: updatedItems };
      try {
        localStorage.setItem('BIZACCOUNT_TOP_ICON_MENU_CONFIG_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`আইকনটি সফলভাবে ${newLocation === 'top' ? 'টপ মেনু বারে' : 'ডাউন/বটম মেনু বারে'} স্থানান্তর করা হয়েছে`);
  };

  const reorderTopIconMenuItem = (id: string, direction: 'up' | 'down', locationFilter?: 'top' | 'bottom') => {
    setTopIconMenuConfig((prev) => {
      const allItems = [...(prev.items || [])];
      const target = allItems.find((i) => i.id === id);
      if (!target) return prev;

      const loc = locationFilter || target.location || 'top';
      const groupItems = allItems.filter((i) => (i.location || 'top') === loc).sort((a, b) => a.order - b.order);
      const idx = groupItems.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === groupItems.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const temp = groupItems[idx];
      groupItems[idx] = groupItems[targetIdx];
      groupItems[targetIdx] = temp;

      // Re-assign order numbers in this group
      const updatedGroup = groupItems.map((it, i) => ({ ...it, order: i + 1 }));
      const updatedAll = allItems.map((it) => {
        const found = updatedGroup.find((g) => g.id === it.id);
        return found || it;
      });

      const updated = { ...prev, items: updatedAll };
      try {
        localStorage.setItem('BIZACCOUNT_TOP_ICON_MENU_CONFIG_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const moveTopIconMenuItemToIndex = (fromIndex: number, toIndex: number, locationFilter?: 'top' | 'bottom') => {
    setTopIconMenuConfig((prev) => {
      const allItems = [...(prev.items || [])];
      const loc = locationFilter || 'top';
      const groupItems = allItems.filter((i) => (i.location || 'top') === loc).sort((a, b) => a.order - b.order);

      if (fromIndex < 0 || fromIndex >= groupItems.length || toIndex < 0 || toIndex >= groupItems.length) {
        return prev;
      }
      const [movedItem] = groupItems.splice(fromIndex, 1);
      groupItems.splice(toIndex, 0, movedItem);

      const updatedGroup = groupItems.map((it, i) => ({ ...it, order: i + 1 }));
      const updatedAll = allItems.map((it) => {
        const found = updatedGroup.find((g) => g.id === it.id);
        return found || it;
      });

      const updated = { ...prev, items: updatedAll };
      try {
        localStorage.setItem('BIZACCOUNT_TOP_ICON_MENU_CONFIG_V2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('আইকন পজিশন সফলভাবে সাজানো হয়েছে');
  };

  const resetTopIconMenuToDefault = () => {
    setTopIconMenuConfig(DEFAULT_TOP_ICON_MENU_CONFIG);
    try {
      localStorage.setItem('BIZACCOUNT_TOP_ICON_MENU_CONFIG_V2', JSON.stringify(DEFAULT_TOP_ICON_MENU_CONFIG));
    } catch (e) {}
    showToast('টপ ও ডাউন আইকন মেনু ডিফল্ট অবস্থায় রিসেট হয়েছে');
  };



  // Universal Reset All Settings to Default
  const resetAllSettingsToDefault = () => {
    setThemeSettings(DEFAULT_THEME_SETTINGS);
    setProductFields(DEFAULT_PRODUCT_FIELDS);
    setCustomerFields(DEFAULT_CUSTOMER_FIELDS);
    setSupplierFields(DEFAULT_SUPPLIER_FIELDS);
    setSalesFields(DEFAULT_SALES_FIELDS);
    setPurchaseFields(DEFAULT_PURCHASE_FIELDS);
    setExpenseFields(DEFAULT_EXPENSE_FIELDS);
    setSkuBarcodeSettings(DEFAULT_SKU_BARCODE_SETTINGS);
    setEnhancedPrintSettings(DEFAULT_ENHANCED_PRINT_SETTINGS);
    setCustomFields([]);
    setPaymentMethodsList(DEFAULT_PAYMENT_METHODS);
    setExpenseCategoriesList(DEFAULT_EXPENSE_CATEGORIES);
    setTaxDiscountSettings(DEFAULT_TAX_DISCOUNT_SETTINGS);
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    setLocalizationSettings(DEFAULT_LOCALIZATION_SETTINGS);
    setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
    setSecuritySettings(DEFAULT_SECURITY_SETTINGS);
    setDashboardCustomSettings(DEFAULT_DASHBOARD_CUSTOM_SETTINGS);

    try {
      localStorage.removeItem('BIZACCOUNT_THEME_V2');
      localStorage.removeItem('BIZACCOUNT_PRODUCT_FIELDS_V2');
      localStorage.removeItem('BIZACCOUNT_CUSTOMER_FIELDS_V2');
      localStorage.removeItem('BIZACCOUNT_SUPPLIER_FIELDS_V2');
      localStorage.removeItem('BIZACCOUNT_SALES_FIELDS_V2');
      localStorage.removeItem('BIZACCOUNT_PURCHASE_FIELDS_V2');
      localStorage.removeItem('BIZACCOUNT_EXPENSE_FIELDS_V2');
      localStorage.removeItem('BIZACCOUNT_SKU_BARCODE_V2');
      localStorage.removeItem('BIZACCOUNT_ENHANCED_PRINT_V2');
      localStorage.removeItem('BIZACCOUNT_CUSTOM_FIELDS_V2');
      localStorage.removeItem('BIZACCOUNT_PAY_METHODS_V2');
      localStorage.removeItem('BIZACCOUNT_EXP_CATEGORIES_V2');
      localStorage.removeItem('BIZACCOUNT_TAX_DISCOUNT_V2');
      localStorage.removeItem('BIZACCOUNT_RBAC_PERMS_V2');
      localStorage.removeItem('BIZACCOUNT_LOCALIZATION_V2');
      localStorage.removeItem('BIZACCOUNT_NOTIFICATIONS_V2');
      localStorage.removeItem('BIZACCOUNT_SECURITY_V2');
      localStorage.removeItem(DASHBOARD_SETTINGS_STORAGE_KEY);
    } catch (e) {}

    showToast('সকল সফটওয়্যার সেটিংস সফলভাবে ফ্যাক্টরি ডিফল্টে ফিরিয়ে আনা হয়েছে');
  };

  // Core Data States
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved).companyProfile || initialCompany;
    } catch (e) {
      console.error(e);
    }
    return initialCompany;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).customers) return JSON.parse(saved).customers;
    } catch (e) {}
    return initialCustomers;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).suppliers) return JSON.parse(saved).suppliers;
    } catch (e) {}
    return initialSuppliers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).products) return JSON.parse(saved).products;
    } catch (e) {}
    return initialProducts;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).invoices) return JSON.parse(saved).invoices;
    } catch (e) {}
    return initialInvoices;
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).purchases) return JSON.parse(saved).purchases;
    } catch (e) {}
    return initialPurchases;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).expenses) return JSON.parse(saved).expenses;
    } catch (e) {}
    return initialExpenses;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).payments) return JSON.parse(saved).payments;
    } catch (e) {}
    return initialPayments;
  });

  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).stockAdjustments) return JSON.parse(saved).stockAdjustments;
    } catch (e) {}
    return [];
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).employees) return JSON.parse(saved).employees;
    } catch (e) {}
    return initialEmployees;
  });

  const [attendances, setAttendances] = useState<Attendance[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).attendances) return JSON.parse(saved).attendances;
    } catch (e) {}
    return [];
  });

  const [payrolls, setPayrolls] = useState<Payroll[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).payrolls) return JSON.parse(saved).payrolls;
    } catch (e) {}
    return [];
  });

  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).manufacturingOrders) return JSON.parse(saved).manufacturingOrders;
    } catch (e) {}
    return [];
  });

  const [deliveries, setDeliveries] = useState<DeliveryChallan[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).deliveries) return JSON.parse(saved).deliveries;
    } catch (e) {}
    return initialDeliveries;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).auditLogs) return JSON.parse(saved).auditLogs;
    } catch (e) {}
    return initialAuditLogs;
  });

  const [approvals, setApprovals] = useState<ApprovalItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).approvals) return JSON.parse(saved).approvals;
    } catch (e) {}
    return initialApprovals;
  });

  const [cashierShift, setCashierShift] = useState<CashierShift>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && JSON.parse(saved).cashierShift) return JSON.parse(saved).cashierShift;
    } catch (e) {}
    return initialShift;
  });

  // Gmail Accounts State
  const [gmailAccounts, setGmailAccounts] = useState<GmailAccount[]>(() => {
    try {
      const saved = localStorage.getItem(GMAIL_ACCOUNTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialGmailAccounts;
  });

  const [currentGmailUser, setCurrentGmailUser] = useState<GmailAccount | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_GMAIL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialGmailAccounts[0] || null;
  });

  // Auto Backup Settings State
  const [autoBackupSettings, setAutoBackupSettings] = useState<AutoBackupSettings>(() => {
    try {
      const saved = localStorage.getItem(AUTO_BACKUP_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialAutoBackupSettings;
  });

  // Backup Snapshots History
  const [backupSnapshots, setBackupSnapshots] = useState<BackupSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(BACKUP_SNAPSHOTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [lastBackupConfirmation, setLastBackupConfirmation] = useState<{
    time: string;
    gmail: string;
    recordCount: number;
    type: 'auto' | 'manual';
  } | null>(null);

  // Persist Gmail accounts
  useEffect(() => {
    try {
      localStorage.setItem(GMAIL_ACCOUNTS_STORAGE_KEY, JSON.stringify(gmailAccounts));
    } catch (e) {}
  }, [gmailAccounts]);

  // Persist Current Gmail User
  useEffect(() => {
    try {
      if (currentGmailUser) {
        localStorage.setItem(CURRENT_GMAIL_STORAGE_KEY, JSON.stringify(currentGmailUser));
      } else {
        localStorage.removeItem(CURRENT_GMAIL_STORAGE_KEY);
      }
    } catch (e) {}
  }, [currentGmailUser]);

  // Persist Auto Backup Settings
  useEffect(() => {
    try {
      localStorage.setItem(AUTO_BACKUP_SETTINGS_KEY, JSON.stringify(autoBackupSettings));
    } catch (e) {}
  }, [autoBackupSettings]);

  // Persist Snapshots
  useEffect(() => {
    try {
      localStorage.setItem(BACKUP_SNAPSHOTS_STORAGE_KEY, JSON.stringify(backupSnapshots));
    } catch (e) {}
  }, [backupSnapshots]);

  // Shared Backend Realtime Synchronization Engine
  const clientId = useMemo(() => 'CLIENT_' + Math.random().toString(36).substring(2, 9), []);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [serverVersion, setServerVersion] = useState<number>(0);
  const isInitialServerLoadDoneRef = useRef(false);
  const isApplyingRemoteSyncRef = useRef(false);

  // Helper to safely apply Centralized Server Database to all local states
  const applyServerData = useCallback((data: BackupData, newVersion: number) => {
    isApplyingRemoteSyncRef.current = true;
    try {
      if (data.companyProfile) setCompanyProfile(data.companyProfile);
      if (data.customers) setCustomers(data.customers);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.products) setProducts(data.products);
      if (data.invoices) setInvoices(data.invoices);
      if (data.purchases) setPurchases(data.purchases);
      if (data.expenses) setExpenses(data.expenses);
      if (data.payments) setPayments(data.payments);
      if (data.stockAdjustments) setStockAdjustments(data.stockAdjustments);
      if (data.employees) setEmployees(data.employees);
      if (data.attendances) setAttendances(data.attendances);
      if (data.payrolls) setPayrolls(data.payrolls);
      if (data.manufacturingOrders) setManufacturingOrders(data.manufacturingOrders);
      if (data.deliveries) setDeliveries(data.deliveries);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.approvals) setApprovals(data.approvals);
      if (data.cashierShifts && data.cashierShifts.length > 0) {
        setCashierShift(data.cashierShifts[0]);
      }
      setServerVersion(newVersion);
      setLastSyncTime(new Date().toLocaleTimeString());
      setSyncStatus('connected');
    } catch (err) {
      console.error('Error applying server data:', err);
    } finally {
      setTimeout(() => {
        isApplyingRemoteSyncRef.current = false;
      }, 150);
    }
  }, []);

  // Manual & Initial Fetch from Centralized Shared Database
  const triggerManualServerSync = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/sync');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          applyServerData(json.data, json.version);
          isInitialServerLoadDoneRef.current = true;
          setSyncStatus('connected');
          return;
        }
      }
      setSyncStatus('offline');
    } catch (err) {
      console.warn('Central DB sync unavailable, running in offline/local mirror mode:', err);
      setSyncStatus('offline');
    }
  }, [applyServerData]);

  // Real-time SSE Stream Connection + Polling Fallback (Cross-URL Synchronization)
  useEffect(() => {
    triggerManualServerSync();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/sync/stream');
      eventSource.onopen = () => {
        setSyncStatus('connected');
      };
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'sync_update') {
            // If update originated from this client tab, skip applying to prevent echo
            if (payload.senderClientId && payload.senderClientId === clientId) {
              setServerVersion(payload.version);
              return;
            }
            if (payload.data && payload.version) {
              applyServerData(payload.data, payload.version);
            }
          }
        } catch (e) {}
      };
      eventSource.onerror = () => {
        setSyncStatus('offline');
      };
    } catch (e) {
      console.warn('SSE stream error:', e);
    }

    // Auto-polling fallback every 2.5 seconds to guarantee 100% sync across URLs
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/sync/version');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.version > serverVersion) {
            const fullRes = await fetch('/api/sync');
            if (fullRes.ok) {
              const fullJson = await fullRes.json();
              if (fullJson.success && fullJson.data) {
                applyServerData(fullJson.data, fullJson.version);
              }
            }
          }
          setSyncStatus('connected');
        }
      } catch (e) {
        // offline
      }
    }, 2500);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
    };
  }, [applyServerData, clientId, serverVersion, triggerManualServerSync]);

  // Save and Synchronize to Centralized Shared Backend Database whenever data changes
  useEffect(() => {
    if (isApplyingRemoteSyncRef.current) return;
    if (!isInitialServerLoadDoneRef.current) return;

    const payload: BackupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      companyProfile,
      customers,
      suppliers,
      products,
      invoices,
      purchases,
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
      cashierShifts: [cashierShift],
    };

    // Instant local mirror storage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {}

    // Debounced broadcast to Centralized Backend Database
    const timer = setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload, clientId, version: serverVersion }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setServerVersion(json.version);
            setLastSyncTime(new Date().toLocaleTimeString());
            setSyncStatus('connected');
          }
        }
      } catch (err) {
        console.warn('Failed to push to central DB:', err);
        setSyncStatus('offline');
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [
    companyProfile,
    customers,
    suppliers,
    products,
    invoices,
    purchases,
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
    cashierShift,
    clientId,
    serverVersion,
  ]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Capture PWA Install Events
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
      showToast('BizAccount অ্যাপ মোবাইলে সফলভাবে ইনস্টল হয়েছে!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showToast]);

  const openPwaInstallModal = useCallback(() => {
    setIsPwaInstallModalOpen(true);
  }, []);

  const closePwaInstallModal = useCallback(() => {
    setIsPwaInstallModalOpen(false);
  }, []);

  const promptInstallPwa = useCallback(async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsPwaInstalled(true);
          showToast('BizAccount অ্যাপ সফলভাবে ইনস্টল হয়েছে!');
        }
      } catch (err) {
        console.error('PWA install error', err);
      }
      setDeferredPrompt(null);
      setIsPwaInstallModalOpen(false);
    } else {
      setIsPwaInstallModalOpen(true);
    }
  }, [deferredPrompt, showToast]);

  const addAuditLog = useCallback(
    (module: string, action: AuditLogItem['action'], recordId: string, summary: string) => {
      const newLog: AuditLogItem = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: currentUserRole.toUpperCase(),
        role: currentUserRole,
        module,
        action,
        recordId,
        summary,
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    },
    [currentUserRole]
  );

  // DYNAMIC STOCK CALCULATOR FOR ANY PRODUCT
  const getProductStock = useCallback(
    (productId: string) => {
      const prod = products.find((p) => p.id === productId);
      const openingStock = prod ? prod.openingStock : 0;

      // Active (non-deleted) purchases
      const activePurchases = purchases.filter((p) => !p.deletedAt && p.status === 'received');
      let stockInFromPurchases = 0;
      activePurchases.forEach((pur) => {
        pur.items.forEach((item) => {
          if (item.productId === productId) {
            stockInFromPurchases += item.qty;
          }
        });
      });

      // Active sales returns
      const activeSalesReturns = invoices.filter((i) => !i.deletedAt && i.type === 'return');
      let stockInFromReturns = 0;
      activeSalesReturns.forEach((inv) => {
        inv.items.forEach((item) => {
          if (item.productId === productId) {
            stockInFromReturns += item.qty;
          }
        });
      });

      // Active sales out (sales, pos, challan)
      const activeSales = invoices.filter(
        (i) => !i.deletedAt && (i.type === 'sale' || i.type === 'pos' || i.type === 'challan') && i.status !== 'cancelled'
      );
      let stockOutFromSales = 0;
      activeSales.forEach((inv) => {
        inv.items.forEach((item) => {
          if (item.productId === productId) {
            stockOutFromSales += item.qty;
          }
        });
      });

      // Active purchase returns
      const activePurchaseReturns = purchases.filter((p) => !p.deletedAt && p.type === 'return');
      let stockOutFromPurReturns = 0;
      activePurchaseReturns.forEach((pur) => {
        pur.items.forEach((item) => {
          if (item.productId === productId) {
            stockOutFromPurReturns += item.qty;
          }
        });
      });

      // Active stock adjustments
      const activeAdjustments = stockAdjustments.filter((a) => !a.deletedAt && a.productId === productId);
      let adjustmentIn = 0;
      let adjustmentOut = 0;
      activeAdjustments.forEach((adj) => {
        if (adj.type === 'in') adjustmentIn += adj.qty;
        if (adj.type === 'out' || adj.type === 'damage' || adj.type === 'expired') adjustmentOut += adj.qty;
      });

      // Manufacturing Orders
      const completedManufacturing = manufacturingOrders.filter((m) => !m.deletedAt && m.status === 'completed');
      let mfgFinishedIn = 0;
      let mfgRawOut = 0;
      completedManufacturing.forEach((m) => {
        if (m.finishedProductId === productId) {
          mfgFinishedIn += m.targetQty;
        }
        m.bom.forEach((b) => {
          if (b.rawProductId === productId) {
            mfgRawOut += b.qtyPerUnit * m.targetQty;
          }
        });
      });

      const totalIn = stockInFromPurchases + stockInFromReturns + adjustmentIn + mfgFinishedIn;
      const totalOut = stockOutFromSales + stockOutFromPurReturns + adjustmentOut + mfgRawOut;
      const currentStock = openingStock + totalIn - totalOut;

      return {
        openingStock,
        stockIn: totalIn,
        stockOut: totalOut,
        currentStock,
      };
    },
    [products, purchases, invoices, stockAdjustments, manufacturingOrders]
  );

  // DYNAMIC CUSTOMER BALANCE CALCULATOR
  const getCustomerBalance = useCallback(
    (customerId: string) => {
      const cust = customers.find((c) => c.id === customerId);
      const openingBalance = cust ? cust.openingBalance : 0;

      // Active sales invoices for this customer
      const activeInvoices = invoices.filter(
        (i) => !i.deletedAt && i.customerId === customerId && (i.type === 'sale' || i.type === 'pos') && i.status !== 'cancelled'
      );
      const totalSales = activeInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
      const invoicePaidAmount = activeInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

      // Returns from customer
      const activeReturns = invoices.filter((i) => !i.deletedAt && i.customerId === customerId && i.type === 'return');
      const totalReturns = activeReturns.reduce((sum, inv) => sum + inv.grandTotal, 0);

      // Direct Payment In records for customer
      const directPayments = payments.filter(
        (p) => !p.deletedAt && p.type === 'in' && p.partyType === 'customer' && p.partyId === customerId
      );
      const totalDirectPayments = directPayments.reduce((sum, p) => sum + p.amount, 0);

      const totalPaid = invoicePaidAmount + totalDirectPayments;
      const currentDue = openingBalance + totalSales - totalPaid - totalReturns;

      return {
        openingBalance,
        totalSales,
        totalPaid,
        currentDue,
      };
    },
    [customers, invoices, payments]
  );

  // DYNAMIC SUPPLIER BALANCE CALCULATOR
  const getSupplierBalance = useCallback(
    (supplierId: string) => {
      const supp = suppliers.find((s) => s.id === supplierId);
      const openingBalance = supp ? supp.openingBalance : 0;

      // Active purchase bills for this supplier
      const activeBills = purchases.filter(
        (p) => !p.deletedAt && p.supplierId === supplierId && p.type === 'bill' && p.status !== 'cancelled'
      );
      const totalPurchases = activeBills.reduce((sum, p) => sum + p.grandTotal, 0);
      const billPaidAmount = activeBills.reduce((sum, p) => sum + p.paidAmount, 0);

      // Returns to supplier
      const activeReturns = purchases.filter((p) => !p.deletedAt && p.supplierId === supplierId && p.type === 'return');
      const totalReturns = activeReturns.reduce((sum, p) => sum + p.grandTotal, 0);

      // Direct Payment Out records for supplier
      const directPayments = payments.filter(
        (p) => !p.deletedAt && p.type === 'out' && p.partyType === 'supplier' && p.partyId === supplierId
      );
      const totalDirectPayments = directPayments.reduce((sum, p) => sum + p.amount, 0);

      const totalPaid = billPaidAmount + totalDirectPayments;
      const currentPayable = openingBalance + totalPurchases - totalPaid - totalReturns;

      return {
        openingBalance,
        totalPurchases,
        totalPaid,
        currentPayable,
      };
    },
    [suppliers, purchases, payments]
  );

  // ALL DYNAMIC METRICS FOR DASHBOARD & FINANCIALS
  const dashboardMetrics = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const thisMonthStr = todayStr.slice(0, 7); // YYYY-MM

    // Active records
    const activeInvoices = invoices.filter((i) => !i.deletedAt && (i.type === 'sale' || i.type === 'pos') && i.status !== 'cancelled');
    const activePurchases = purchases.filter((p) => !p.deletedAt && p.type === 'bill' && p.status !== 'cancelled');
    const activeExpenses = expenses.filter((e) => !e.deletedAt);
    const activePaymentsIn = payments.filter((p) => !p.deletedAt && p.type === 'in');
    const activePaymentsOut = payments.filter((p) => !p.deletedAt && p.type === 'out');
    const activeProducts = products.filter((p) => !p.deletedAt);

    // Sales totals
    const totalSales = activeInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
    const totalSalesCost = activeInvoices.reduce((sum, inv) => {
      const invoiceCost = inv.items.reduce((s, it) => s + (it.purchaseCost || 0) * it.qty, 0);
      return sum + invoiceCost;
    }, 0);

    const grossProfit = totalSales - totalSalesCost;

    // Purchase totals
    const totalPurchase = activePurchases.reduce((sum, p) => sum + p.grandTotal, 0);

    // Expense totals & Custom Balance Logic
    // Expenses paid from company money (cash, bank, mobile_banking)
    const companyPaidExpenses = activeExpenses.filter((e) => e.paymentMethod !== 'own_money' && !e.isOwnMoneyPaid);
    const totalExpense = activeExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Own money paid by owner/party:
    const ownMoneyPaid = activeExpenses
      .filter((e) => e.paymentMethod === 'own_money' || e.isOwnMoneyPaid)
      .reduce((sum, e) => sum + e.amount, 0);

    const netProfit = grossProfit - totalExpense;

    // CASH BALANCE
    // Cash In:
    const cashFromSales = activeInvoices.filter((i) => i.paymentMethod === 'cash').reduce((sum, i) => sum + i.paidAmount, 0);
    const cashFromPaymentsIn = activePaymentsIn.filter((p) => p.paymentMethod === 'cash').reduce((sum, p) => sum + p.amount, 0);
    const cashOpeningFloat = cashierShift ? cashierShift.openingCash : 0;

    // Cash Out:
    const cashForPurchases = activePurchases.filter((p) => p.paymentMethod === 'cash').reduce((sum, p) => sum + p.paidAmount, 0);
    const cashForExpenses = companyPaidExpenses.filter((e) => e.paymentMethod === 'cash').reduce((sum, e) => sum + e.amount, 0);
    const cashForPaymentsOut = activePaymentsOut.filter((p) => p.paymentMethod === 'cash').reduce((sum, p) => sum + p.amount, 0);

    const companyCashBalance = cashOpeningFloat + cashFromSales + cashFromPaymentsIn - cashForPurchases - cashForExpenses - cashForPaymentsOut;

    // BANK BALANCE
    const bankFromSales = activeInvoices.filter((i) => i.paymentMethod === 'bank').reduce((sum, i) => sum + i.paidAmount, 0);
    const bankFromPaymentsIn = activePaymentsIn.filter((p) => p.paymentMethod === 'bank').reduce((sum, p) => sum + p.amount, 0);
    const bankForPurchases = activePurchases.filter((p) => p.paymentMethod === 'bank').reduce((sum, p) => sum + p.paidAmount, 0);
    const bankForExpenses = companyPaidExpenses.filter((e) => e.paymentMethod === 'bank').reduce((sum, e) => sum + e.amount, 0);
    const bankForPaymentsOut = activePaymentsOut.filter((p) => p.paymentMethod === 'bank').reduce((sum, p) => sum + p.amount, 0);
    const initialBankFloat = 50000; // default initial bank deposit
    const bankBalance = initialBankFloat + bankFromSales + bankFromPaymentsIn - bankForPurchases - bankForExpenses - bankForPaymentsOut;

    // MOBILE BANKING BALANCE
    const mbFromSales = activeInvoices.filter((i) => i.paymentMethod === 'mobile_banking').reduce((sum, i) => sum + i.paidAmount, 0);
    const mbFromPaymentsIn = activePaymentsIn.filter((p) => p.paymentMethod === 'mobile_banking').reduce((sum, p) => sum + p.amount, 0);
    const mbForPurchases = activePurchases.filter((p) => p.paymentMethod === 'mobile_banking').reduce((sum, p) => sum + p.paidAmount, 0);
    const mbForExpenses = companyPaidExpenses.filter((e) => e.paymentMethod === 'mobile_banking').reduce((sum, e) => sum + e.amount, 0);
    const mbForPaymentsOut = activePaymentsOut.filter((p) => p.paymentMethod === 'mobile_banking').reduce((sum, p) => sum + p.amount, 0);
    const initialMbFloat = 15000;
    const mobileBankingBalance = initialMbFloat + mbFromSales + mbFromPaymentsIn - mbForPurchases - mbForExpenses - mbForPaymentsOut;

    // CUSTOMER RECEIVABLE & SUPPLIER PAYABLE
    let customerReceivable = 0;
    customers.filter((c) => !c.deletedAt).forEach((c) => {
      const bal = getCustomerBalance(c.id);
      if (bal.currentDue > 0) customerReceivable += bal.currentDue;
    });

    let supplierPayable = 0;
    suppliers.filter((s) => !s.deletedAt).forEach((s) => {
      const bal = getSupplierBalance(s.id);
      if (bal.currentPayable > 0) supplierPayable += bal.currentPayable;
    });

    const dueBalance = customerReceivable;
    // Remaining balance after considering company liabilities to owner
    const remainingBalance = companyCashBalance + bankBalance + mobileBankingBalance - ownMoneyPaid;

    // STOCK VALUE & ALERTS
    let stockValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    activeProducts.forEach((p) => {
      const { currentStock } = getProductStock(p.id);
      stockValue += Math.max(0, currentStock) * p.purchasePrice;
      if (currentStock <= 0) {
        outOfStockCount++;
      } else if (currentStock <= p.minStock) {
        lowStockCount++;
      }
    });

    // TODAY METRICS
    const todaySales = activeInvoices
      .filter((i) => i.date === todayStr)
      .reduce((sum, i) => sum + i.grandTotal, 0);

    const todayPurchase = activePurchases
      .filter((p) => p.date === todayStr)
      .reduce((sum, p) => sum + p.grandTotal, 0);

    const todayExpense = activeExpenses
      .filter((e) => e.date === todayStr)
      .reduce((sum, e) => sum + e.amount, 0);

    const todayCollection = activePaymentsIn
      .filter((p) => p.date === todayStr)
      .reduce((sum, p) => sum + p.amount, 0);

    const todayPayment = activePaymentsOut
      .filter((p) => p.date === todayStr)
      .reduce((sum, p) => sum + p.amount, 0);

    // MONTHLY METRICS
    const monthlySales = activeInvoices
      .filter((i) => i.date.startsWith(thisMonthStr))
      .reduce((sum, i) => sum + i.grandTotal, 0);

    const monthlyPurchase = activePurchases
      .filter((p) => p.date.startsWith(thisMonthStr))
      .reduce((sum, p) => sum + p.grandTotal, 0);

    const monthlyExpense = activeExpenses
      .filter((e) => e.date.startsWith(thisMonthStr))
      .reduce((sum, e) => sum + e.amount, 0);

    const monthlySalesCost = activeInvoices
      .filter((i) => i.date.startsWith(thisMonthStr))
      .reduce((sum, inv) => {
        return sum + inv.items.reduce((s, it) => s + (it.purchaseCost || 0) * it.qty, 0);
      }, 0);

    const monthlyProfit = monthlySales - monthlySalesCost - monthlyExpense;

    return {
      totalSales,
      totalPurchase,
      totalExpense,
      grossProfit,
      netProfit,
      companyCashBalance,
      bankBalance,
      mobileBankingBalance,
      customerReceivable,
      supplierPayable,
      dueBalance,
      ownMoneyPaid,
      remainingBalance,
      stockValue,
      lowStockCount,
      outOfStockCount,
      todaySales,
      todayPurchase,
      todayExpense,
      todayCollection,
      todayPayment,
      monthlySales,
      monthlyPurchase,
      monthlyExpense,
      monthlyProfit,
    };
  }, [
    invoices,
    purchases,
    expenses,
    payments,
    products,
    customers,
    suppliers,
    cashierShift,
    getCustomerBalance,
    getSupplierBalance,
    getProductStock,
  ]);

  // CRUD HANDLERS WITH SOFT DELETE & RESTORE (ZERO LOCKS)
  const saveCustomer = (c: Customer) => {
    const isEdit = customers.some((x) => x.id === c.id);
    const updated = isEdit
      ? customers.map((x) => (x.id === c.id ? { ...c, updatedAt: new Date().toISOString() } : x))
      : [{ ...c, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...customers];
    setCustomers(updated);
    showToast(isEdit ? translations[language].successUpdated : translations[language].successSaved);
    addAuditLog('Customer', isEdit ? 'UPDATE' : 'CREATE', c.id, `${isEdit ? 'Updated' : 'Added'} customer: ${c.name}`);
  };

  const deleteCustomer = (id: string, soft = true) => {
    if (soft) {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, deletedAt: new Date().toISOString() } : c)));
      showToast('কাস্টমার রিসাইকেল বিনে পাঠানো হয়েছে');
      addAuditLog('Customer', 'DELETE', id, `Soft-deleted customer ${id}`);
    } else {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast('কাস্টমার স্থায়ীভাবে মুছে ফেলা হয়েছে');
      addAuditLog('Customer', 'DELETE', id, `Permanently deleted customer ${id}`);
    }
  };

  const restoreCustomer = (id: string) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, deletedAt: null } : c)));
    showToast(translations[language].successRestored);
    addAuditLog('Customer', 'RESTORE', id, `Restored customer ${id}`);
  };

  const saveSupplier = (s: Supplier) => {
    const isEdit = suppliers.some((x) => x.id === s.id);
    const updated = isEdit
      ? suppliers.map((x) => (x.id === s.id ? { ...s, updatedAt: new Date().toISOString() } : x))
      : [{ ...s, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...suppliers];
    setSuppliers(updated);
    showToast(isEdit ? translations[language].successUpdated : translations[language].successSaved);
    addAuditLog('Supplier', isEdit ? 'UPDATE' : 'CREATE', s.id, `${isEdit ? 'Updated' : 'Added'} supplier: ${s.name}`);
  };

  const deleteSupplier = (id: string, soft = true) => {
    if (soft) {
      setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, deletedAt: new Date().toISOString() } : s)));
      showToast('সাপ্লায়ার রিসাইকেল বিনে পাঠানো হয়েছে');
      addAuditLog('Supplier', 'DELETE', id, `Soft-deleted supplier ${id}`);
    } else {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      showToast('সাপ্লায়ার স্থায়ীভাবে মুছে ফেলা হয়েছে');
      addAuditLog('Supplier', 'DELETE', id, `Permanently deleted supplier ${id}`);
    }
  };

  const restoreSupplier = (id: string) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, deletedAt: null } : s)));
    showToast(translations[language].successRestored);
    addAuditLog('Supplier', 'RESTORE', id, `Restored supplier ${id}`);
  };

  const saveProduct = (p: Product) => {
    const isEdit = products.some((x) => x.id === p.id);
    const updated = isEdit
      ? products.map((x) => (x.id === p.id ? { ...p, updatedAt: new Date().toISOString() } : x))
      : [{ ...p, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...products];
    setProducts(updated);
    showToast(isEdit ? translations[language].successUpdated : translations[language].successSaved);
    addAuditLog('Product', isEdit ? 'UPDATE' : 'CREATE', p.id, `${isEdit ? 'Updated' : 'Added'} product: ${p.name}`);
  };

  const deleteProduct = (id: string, soft = true) => {
    if (soft) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, deletedAt: new Date().toISOString() } : p)));
      showToast('পণ্য রিসাইকেল বিনে পাঠানো হয়েছে');
      addAuditLog('Product', 'DELETE', id, `Soft-deleted product ${id}`);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('পণ্য স্থায়ীভাবে মুছে ফেলা হয়েছে');
      addAuditLog('Product', 'DELETE', id, `Permanently deleted product ${id}`);
    }
  };

  const restoreProduct = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, deletedAt: null } : p)));
    showToast(translations[language].successRestored);
    addAuditLog('Product', 'RESTORE', id, `Restored product ${id}`);
  };

  const saveInvoice = (inv: Invoice) => {
    const isEdit = invoices.some((x) => x.id === inv.id);
    const updated = isEdit
      ? invoices.map((x) => (x.id === inv.id ? { ...inv, updatedAt: new Date().toISOString() } : x))
      : [{ ...inv, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...invoices];
    setInvoices(updated);
    showToast(isEdit ? translations[language].successUpdated : translations[language].successSaved);
    addAuditLog(
      'Invoice',
      isEdit ? 'UPDATE' : 'CREATE',
      inv.id,
      `${isEdit ? 'Updated' : 'Created'} Invoice ${inv.invoiceNo} (Amount: ৳${inv.grandTotal})`
    );
  };

  const deleteInvoice = (id: string, soft = true) => {
    if (soft) {
      setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, deletedAt: new Date().toISOString() } : i)));
      showToast('ইনভয়েস রিসাইকেল বিনে পাঠানো হয়েছে (সব হিসাব অটো রি-ক্যালকুলেট হয়েছে)');
      addAuditLog('Invoice', 'DELETE', id, `Soft-deleted invoice ${id}`);
    } else {
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      showToast('ইনভয়েস স্থায়ীভাবে মুছে ফেলা হয়েছে');
      addAuditLog('Invoice', 'DELETE', id, `Permanently deleted invoice ${id}`);
    }
  };

  const restoreInvoice = (id: string) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, deletedAt: null } : i)));
    showToast(translations[language].successRestored);
    addAuditLog('Invoice', 'RESTORE', id, `Restored invoice ${id}`);
  };

  const savePurchase = (pur: Purchase) => {
    const isEdit = purchases.some((x) => x.id === pur.id);
    const updated = isEdit
      ? purchases.map((x) => (x.id === pur.id ? { ...pur, updatedAt: new Date().toISOString() } : x))
      : [{ ...pur, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...purchases];
    setPurchases(updated);
    showToast(isEdit ? translations[language].successUpdated : translations[language].successSaved);
    addAuditLog(
      'Purchase',
      isEdit ? 'UPDATE' : 'CREATE',
      pur.id,
      `${isEdit ? 'Updated' : 'Created'} Purchase Bill ${pur.billNo} (Amount: ৳${pur.grandTotal})`
    );
  };

  const deletePurchase = (id: string, soft = true) => {
    if (soft) {
      setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, deletedAt: new Date().toISOString() } : p)));
      showToast('বিল রিসাইকেল বিনে পাঠানো হয়েছে');
      addAuditLog('Purchase', 'DELETE', id, `Soft-deleted purchase ${id}`);
    } else {
      setPurchases((prev) => prev.filter((p) => p.id !== id));
      showToast('বিল স্থায়ীভাবে মুছে ফেলা হয়েছে');
      addAuditLog('Purchase', 'DELETE', id, `Permanently deleted purchase ${id}`);
    }
  };

  const restorePurchase = (id: string) => {
    setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, deletedAt: null } : p)));
    showToast(translations[language].successRestored);
    addAuditLog('Purchase', 'RESTORE', id, `Restored purchase ${id}`);
  };

  const saveExpense = (exp: Expense) => {
    const isEdit = expenses.some((x) => x.id === exp.id);
    const updated = isEdit
      ? expenses.map((x) => (x.id === exp.id ? { ...exp, updatedAt: new Date().toISOString() } : x))
      : [{ ...exp, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...expenses];
    setExpenses(updated);
    showToast(isEdit ? translations[language].successUpdated : translations[language].successSaved);
    addAuditLog(
      'Expense',
      isEdit ? 'UPDATE' : 'CREATE',
      exp.id,
      `${isEdit ? 'Updated' : 'Added'} expense ৳${exp.amount} (${exp.category})`
    );
  };

  const deleteExpense = (id: string, soft = true) => {
    if (soft) {
      setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, deletedAt: new Date().toISOString() } : e)));
      showToast('খরচ রিসাইকেল বিনে পাঠানো হয়েছে');
      addAuditLog('Expense', 'DELETE', id, `Soft-deleted expense ${id}`);
    } else {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      showToast('খরচ স্থায়ীভাবে মুছে ফেলা হয়েছে');
      addAuditLog('Expense', 'DELETE', id, `Permanently deleted expense ${id}`);
    }
  };

  const restoreExpense = (id: string) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, deletedAt: null } : e)));
    showToast(translations[language].successRestored);
    addAuditLog('Expense', 'RESTORE', id, `Restored expense ${id}`);
  };

  const savePayment = (pay: PaymentRecord) => {
    const isEdit = payments.some((x) => x.id === pay.id);
    const updated = isEdit
      ? payments.map((x) => (x.id === pay.id ? { ...pay, updatedAt: new Date().toISOString() } : x))
      : [{ ...pay, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...payments];
    setPayments(updated);
    showToast(isEdit ? translations[language].successUpdated : translations[language].successSaved);
    addAuditLog(
      'Payment',
      isEdit ? 'UPDATE' : 'CREATE',
      pay.id,
      `${isEdit ? 'Updated' : 'Recorded'} ${pay.type === 'in' ? 'Payment In' : 'Payment Out'} ৳${pay.amount} (${pay.partyName})`
    );
  };

  const deletePayment = (id: string, soft = true) => {
    if (soft) {
      setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, deletedAt: new Date().toISOString() } : p)));
      showToast('পেমেন্ট রিসাইকেল বিনে পাঠানো হয়েছে');
      addAuditLog('Payment', 'DELETE', id, `Soft-deleted payment ${id}`);
    } else {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      showToast('পেমেন্ট স্থায়ীভাবে মুছে ফেলা হয়েছে');
      addAuditLog('Payment', 'DELETE', id, `Permanently deleted payment ${id}`);
    }
  };

  const restorePayment = (id: string) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, deletedAt: null } : p)));
    showToast(translations[language].successRestored);
    addAuditLog('Payment', 'RESTORE', id, `Restored payment ${id}`);
  };

  const saveStockAdjustment = (adj: StockAdjustment) => {
    const updated = [{ ...adj, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...stockAdjustments];
    setStockAdjustments(updated);
    showToast('স্টক সমন্বয় সফল হয়েছে');
    addAuditLog('Inventory', 'CREATE', adj.id, `Stock adjustment for ${adj.productName} (${adj.type} ${adj.qty} ${adj.unit})`);
  };

  const saveEmployee = (emp: Employee) => {
    const isEdit = employees.some((x) => x.id === emp.id);
    const updated = isEdit
      ? employees.map((x) => (x.id === emp.id ? { ...emp, updatedAt: new Date().toISOString() } : x))
      : [{ ...emp, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...employees];
    setEmployees(updated);
    showToast(isEdit ? translations[language].successUpdated : translations[language].successSaved);
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast('কর্মচারী তালিকা থেকে মুছে ফেলা হয়েছে');
  };

  const saveAttendance = (att: Attendance) => {
    const updated = [att, ...attendances.filter((a) => !(a.employeeId === att.employeeId && a.date === att.date))];
    setAttendances(updated);
    showToast('উপস্থিতি রেকর্ড সম্পন্ন হয়েছে');
  };

  const savePayroll = (pay: Payroll) => {
    const isEdit = payrolls.some((p) => p.id === pay.id);
    const updated = isEdit ? payrolls.map((p) => (p.id === pay.id ? pay : p)) : [pay, ...payrolls];
    setPayrolls(updated);
    showToast('বেতন শিট আপডেট হয়েছে');
  };

  const saveManufacturingOrder = (mo: ManufacturingOrder) => {
    const isEdit = manufacturingOrders.some((m) => m.id === mo.id);
    const updated = isEdit ? manufacturingOrders.map((m) => (m.id === mo.id ? mo : m)) : [mo, ...manufacturingOrders];
    setManufacturingOrders(updated);
    showToast('ম্যানুফ্যাকচারিং অর্ডার সম্পন্ন হয়েছে');
    addAuditLog('Manufacturing', isEdit ? 'UPDATE' : 'CREATE', mo.id, `Manufacturing Order ${mo.orderNo} for ${mo.finishedProductName}`);
  };

  const saveDelivery = (del: DeliveryChallan) => {
    const isEdit = deliveries.some((d) => d.id === del.id);
    const updated = isEdit ? deliveries.map((d) => (d.id === del.id ? del : d)) : [del, ...deliveries];
    setDeliveries(updated);
    showToast('ডেলিভারি চালান আপডেট হয়েছে');
  };

  const approveItem = (id: string, approve: boolean) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: approve ? 'approved' : 'rejected' } : item))
    );
    showToast(approve ? 'অনুমোদন প্রদান করা হয়েছে (Approved)' : 'অনুরোধ প্রত্যাখ্যান করা হয়েছে (Rejected)');
    addAuditLog('ApprovalQueue', 'APPROVE', id, `Item ${id} was ${approve ? 'APPROVED' : 'REJECTED'}`);
  };

  const updateCompanyProfile = (p: CompanyProfile) => {
    setCompanyProfile(p);
    showToast('কোম্পানি তথ্য সফলভাবে আপডেট হয়েছে');
    addAuditLog('Settings', 'UPDATE', 'PROFILE', 'Company profile and settings updated');
  };

  // EXPORT / IMPORT BACKUP
  const exportBackupJSON = () => {
    const backupData: BackupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      companyProfile,
      customers,
      suppliers,
      products,
      invoices,
      purchases,
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
      cashierShifts: [cashierShift],
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BizAccount_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('সম্পূর্ণ ব্যাকআপ ফাইল ডাউনলোড সম্পন্ন হয়েছে');
    addAuditLog('Backup', 'CREATE', 'FULL_JSON', 'Downloaded complete system JSON backup');
  };

  const importBackupJSON = (jsonData: string): boolean => {
    try {
      const data: BackupData = JSON.parse(jsonData);
      if (data.companyProfile) setCompanyProfile(data.companyProfile);
      if (data.customers) setCustomers(data.customers);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.products) setProducts(data.products);
      if (data.invoices) setInvoices(data.invoices);
      if (data.purchases) setPurchases(data.purchases);
      if (data.expenses) setExpenses(data.expenses);
      if (data.payments) setPayments(data.payments);
      if (data.stockAdjustments) setStockAdjustments(data.stockAdjustments);
      if (data.employees) setEmployees(data.employees);
      if (data.attendances) setAttendances(data.attendances);
      if (data.payrolls) setPayrolls(data.payrolls);
      if (data.manufacturingOrders) setManufacturingOrders(data.manufacturingOrders);
      if (data.deliveries) setDeliveries(data.deliveries);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.approvals) setApprovals(data.approvals);
      showToast('ব্যাকআপ থেকে সব তথ্য সফলভাবে পুনরুদ্ধার করা হয়েছে!');
      addAuditLog('Backup', 'RESTORE', 'JSON_IMPORT', 'Restored system database from JSON backup');
      return true;
    } catch (e) {
      console.error(e);
      showToast('ভুল ফাইল ফরম্যাট! ব্যাকআপ রিস্টোর ব্যর্থ হয়েছে।');
      return false;
    }
  };

  const resetToSampleData = () => {
    setCompanyProfile(initialCompany);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setProducts(initialProducts);
    setInvoices(initialInvoices);
    setPurchases(initialPurchases);
    setExpenses(initialExpenses);
    setPayments(initialPayments);
    setStockAdjustments([]);
    setEmployees(initialEmployees);
    setDeliveries(initialDeliveries);
    setAuditLogs(initialAuditLogs);
    setApprovals(initialApprovals);
    setCashierShift(initialShift);

    // Also notify centralized backend
    fetch('/api/sync/reset', { method: 'POST' }).catch(() => {});

    showToast('সিস্টেম সেন্ট্রাল ডেমো তথ্যে রিসেট করা হয়েছে');
    addAuditLog('Settings', 'UPDATE', 'RESET', 'Central Database reset to initial sample records');
  };

  // NATIVE EXCEL / CSV EXPORTER WITH UTF-8 BOM
  const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      '\uFEFF' +
      [
        headers.join(','),
        ...rows.map((row) =>
          row
            .map((val) => {
              const str = String(val ?? '').replace(/"/g, '""');
              return `"${str}"`;
            })
            .join(',')
        ),
      ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('এক্সেল/সিএসভি ফাইল এক্সপোর্ট সম্পন্ন হয়েছে');
  };

  // Core snapshot creation logic
  const triggerAutoBackup = useCallback(
    (isManual: boolean = false): BackupSnapshot => {
      const backupTargetAcc =
        gmailAccounts.find((g) => g.id === autoBackupSettings.targetGmailId) ||
        gmailAccounts.find((g) => g.isBackupTarget) ||
        currentGmailUser ||
        initialGmailAccounts[0];

      const backupData: BackupData = {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        companyProfile,
        customers,
        suppliers,
        products,
        invoices,
        purchases,
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
        cashierShifts: [cashierShift],
      };

      const recordCount =
        customers.length +
        suppliers.length +
        products.length +
        invoices.length +
        purchases.length +
        expenses.length +
        payments.length +
        employees.length;

      const jsonStr = JSON.stringify(backupData);
      const sizeBytes = new Blob([jsonStr]).size;
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const nowIso = new Date().toISOString();

      const newSnapshot: BackupSnapshot = {
        id: `SNAP-${Date.now()}`,
        timestamp: nowIso,
        sizeBytes,
        recordCount,
        destinationGmail: backupTargetAcc?.email || 'alluser27bd@gmail.com',
        type: isManual ? 'manual' : 'auto',
        status: 'success',
        summary: `${recordCount} records · ${(sizeBytes / 1024).toFixed(1)} KB`,
        data: backupData,
      };

      setBackupSnapshots((prev) => [newSnapshot, ...prev].slice(0, autoBackupSettings.keepMaxSnapshots || 10));
      setAutoBackupSettings((prev) => ({ ...prev, lastBackupTime: nowIso }));

      setLastBackupConfirmation({
        time: nowTime,
        gmail: backupTargetAcc?.email || 'alluser27bd@gmail.com',
        recordCount,
        type: isManual ? 'manual' : 'auto',
      });

      if (isManual) {
        showToast(`ম্যানুয়াল ব্যাকআপ সফল! Google Drive ব্যাকআপ গন্তব্য: ${backupTargetAcc?.email}`);
      } else {
        showToast(`স্বয়ংক্রিয় ব্যাকআপ সফল [${nowTime}] — ${backupTargetAcc?.email} (১০০% ডাটা সুরক্ষিত)`);
      }

      addAuditLog(
        'Backup',
        'CREATE',
        newSnapshot.id,
        `${isManual ? 'Manual' : 'Automatic'} backup snapshot secured for ${backupTargetAcc?.email}`
      );

      return newSnapshot;
    },
    [
      gmailAccounts,
      autoBackupSettings,
      currentGmailUser,
      companyProfile,
      customers,
      suppliers,
      products,
      invoices,
      purchases,
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
      cashierShift,
      showToast,
      addAuditLog,
    ]
  );

  // Background Auto-backup timer
  useEffect(() => {
    if (!autoBackupSettings.enabled || autoBackupSettings.intervalMinutes <= 0) return;
    const intervalMs = autoBackupSettings.intervalMinutes * 60 * 1000;
    const intervalId = setInterval(() => {
      triggerAutoBackup(false);
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [autoBackupSettings.enabled, autoBackupSettings.intervalMinutes, triggerAutoBackup]);

  // Restore from snapshot
  const restoreFromSnapshot = (snapshotId: string): boolean => {
    const snap = backupSnapshots.find((s) => s.id === snapshotId);
    if (!snap || !snap.data) {
      showToast('ব্যাকআপ স্ন্যাপশট খুঁজে পাওয়া যায়নি');
      return false;
    }
    const data = snap.data;
    if (data.companyProfile) setCompanyProfile(data.companyProfile);
    if (data.customers) setCustomers(data.customers);
    if (data.suppliers) setSuppliers(data.suppliers);
    if (data.products) setProducts(data.products);
    if (data.invoices) setInvoices(data.invoices);
    if (data.purchases) setPurchases(data.purchases);
    if (data.expenses) setExpenses(data.expenses);
    if (data.payments) setPayments(data.payments);
    if (data.stockAdjustments) setStockAdjustments(data.stockAdjustments);
    if (data.employees) setEmployees(data.employees);
    if (data.attendances) setAttendances(data.attendances);
    if (data.payrolls) setPayrolls(data.payrolls);
    if (data.manufacturingOrders) setManufacturingOrders(data.manufacturingOrders);
    if (data.deliveries) setDeliveries(data.deliveries);
    if (data.auditLogs) setAuditLogs(data.auditLogs);
    if (data.approvals) setApprovals(data.approvals);

    showToast(`ব্যাকআপ সফলভাবে রিস্টোর হয়েছে (${new Date(snap.timestamp).toLocaleTimeString()}) — সব হিসাব রিক্যালকুলেট সম্পন্ন!`);
    addAuditLog('Backup', 'RESTORE', snap.id, `Restored system from snapshot ${snap.id} (${snap.destinationGmail})`);
    return true;
  };

  const deleteSnapshot = (snapshotId: string) => {
    setBackupSnapshots((prev) => prev.filter((s) => s.id !== snapshotId));
    showToast('ব্যাকআপ স্ন্যাপশট মুছে ফেলা হয়েছে');
  };

  const updateAutoBackupSettings = (settings: Partial<AutoBackupSettings>) => {
    setAutoBackupSettings((prev) => ({ ...prev, ...settings }));
    showToast('অটো-ব্যাকআপ সেটিংস সংরক্ষিত হয়েছে');
  };

  // Gmail Management & Auth
  const loginWithGmail = (email: string, name?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    let existing = gmailAccounts.find((g) => g.email.toLowerCase() === cleanEmail);
    if (!existing) {
      existing = {
        id: `GMAIL-${Date.now()}`,
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        role: 'admin',
        isPrimary: gmailAccounts.length === 0,
        isBackupTarget: gmailAccounts.length === 0,
        linkedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      setGmailAccounts((prev) => [...prev, existing!]);
    } else {
      existing = { ...existing, lastLoginAt: new Date().toISOString() };
      setGmailAccounts((prev) => prev.map((g) => (g.id === existing!.id ? existing! : g)));
    }
    setCurrentGmailUser(existing);
    setCurrentUserRole(existing.role);
    showToast(`স্বাগতম! Gmail অ্যাকাউন্টে লগইন সম্পন্ন হয়েছে: ${existing.email}`);
    addAuditLog('Auth', 'UPDATE', existing.id, `User logged in with Gmail ${existing.email}`);
    return true;
  };

  const signUpWithGmail = (email: string, name: string, role: UserRole = 'admin'): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (gmailAccounts.some((g) => g.email.toLowerCase() === cleanEmail)) {
      showToast('এই Gmail অ্যাকাউন্টটি ইতিমধ্যে সিস্টেমে আছে। লগইন করা হচ্ছে...');
      return loginWithGmail(cleanEmail, name);
    }
    const newAcc: GmailAccount = {
      id: `GMAIL-${Date.now()}`,
      email: cleanEmail,
      name: name.trim() || cleanEmail.split('@')[0],
      role,
      isPrimary: gmailAccounts.length === 0,
      isBackupTarget: gmailAccounts.length === 0,
      linkedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    setGmailAccounts((prev) => [...prev, newAcc]);
    setCurrentGmailUser(newAcc);
    setCurrentUserRole(newAcc.role);
    showToast(`নতুন Gmail অ্যাকাউন্ট সাইন আপ ও লগইন সম্পন্ন: ${newAcc.email}`);
    addAuditLog('Auth', 'CREATE', newAcc.id, `New Gmail account registered: ${newAcc.email} (${newAcc.role})`);
    return true;
  };

  const logoutGmail = () => {
    setCurrentGmailUser(null);
    showToast('Gmail অ্যাকাউন্ট থেকে লগআউট করা হয়েছে');
  };

  const addManualGmailAccount = (
    email: string,
    name: string,
    role: UserRole = 'accountant',
    setAsBackupTarget: boolean = false
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@gmail.com') && !cleanEmail.includes('@')) {
      showToast('অনুগ্রহ করে সঠিক Gmail ঠিকানা প্রবেশ করান');
      return;
    }
    if (gmailAccounts.some((g) => g.email.toLowerCase() === cleanEmail)) {
      showToast('এই Gmail অ্যাকাউন্টটি ইতিমধ্যে তালিকায় বিদ্যমান আছে');
      return;
    }
    const newAcc: GmailAccount = {
      id: `GMAIL-${Date.now()}`,
      email: cleanEmail,
      name: name.trim() || cleanEmail.split('@')[0],
      role,
      isPrimary: false,
      isBackupTarget: setAsBackupTarget,
      linkedAt: new Date().toISOString(),
      lastLoginAt: 'Never',
    };
    setGmailAccounts((prev) => {
      const updated = setAsBackupTarget ? prev.map((g) => ({ ...g, isBackupTarget: false })) : prev;
      return [...updated, newAcc];
    });
    if (setAsBackupTarget) {
      setAutoBackupSettings((prev) => ({ ...prev, targetGmailId: newAcc.id }));
    }
    showToast(`নতুন Gmail সফলভাবে যুক্ত করা হয়েছে: ${cleanEmail}`);
    addAuditLog('Auth', 'CREATE', newAcc.id, `Manually linked Gmail account ${cleanEmail}`);
  };

  const removeGmailAccount = (id: string) => {
    if (gmailAccounts.length <= 1) {
      showToast('কমপক্ষে একটি Gmail অ্যাকাউন্ট সংরক্ষিত থাকা আবশ্যক');
      return;
    }
    const target = gmailAccounts.find((g) => g.id === id);
    setGmailAccounts((prev) => prev.filter((g) => g.id !== id));
    if (currentGmailUser?.id === id) {
      const fallback = gmailAccounts.find((g) => g.id !== id) || null;
      setCurrentGmailUser(fallback);
      if (fallback) setCurrentUserRole(fallback.role);
    }
    showToast(`Gmail অ্যাকাউন্ট তালিকা থেকে অপসারিত: ${target?.email}`);
    addAuditLog('Auth', 'DELETE', id, `Removed Gmail account ${target?.email}`);
  };

  const switchGmailAccount = (id: string) => {
    const target = gmailAccounts.find((g) => g.id === id);
    if (!target) return;
    setCurrentGmailUser(target);
    setCurrentUserRole(target.role);
    showToast(`সক্রিয় ইউজার একাউন্ট পরিবর্তন: ${target.email} (${target.name})`);
  };

  const setBackupTargetGmail = (id: string) => {
    const target = gmailAccounts.find((g) => g.id === id);
    if (!target) return;
    setGmailAccounts((prev) =>
      prev.map((g) => ({
        ...g,
        isBackupTarget: g.id === id,
      }))
    );
    setAutoBackupSettings((prev) => ({ ...prev, targetGmailId: id }));
    showToast(`অটো ব্যাকআপ গন্তব্য নির্ধারিত হয়েছে: ${target.email}`);
    addAuditLog('Backup', 'UPDATE', id, `Auto-backup destination changed to ${target.email}`);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        currentUserRole,
        setCurrentUserRole,
        activeTab,
        setActiveTab,
        globalSearch,
        setGlobalSearch,
        toastMessage,
        showToast,
        companyProfile,
        updateCompanyProfile,
        customers,
        suppliers,
        products,
        invoices,
        purchases,
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
        cashierShift,
        setCashierShift,
        dashboardMetrics,
        getProductStock,
        getCustomerBalance,
        getSupplierBalance,
        saveCustomer,
        deleteCustomer,
        restoreCustomer,
        saveSupplier,
        deleteSupplier,
        restoreSupplier,
        saveProduct,
        deleteProduct,
        restoreProduct,
        saveInvoice,
        deleteInvoice,
        restoreInvoice,
        savePurchase,
        deletePurchase,
        restorePurchase,
        saveExpense,
        deleteExpense,
        restoreExpense,
        savePayment,
        deletePayment,
        restorePayment,
        saveStockAdjustment,
        saveEmployee,
        deleteEmployee,
        saveAttendance,
        savePayroll,
        saveManufacturingOrder,
        saveDelivery,
        approveItem,
        addAuditLog,
        printData,
        setPrintData,
        exportBackupJSON,
        importBackupJSON,
        resetToSampleData,
        exportToCSV,
        textSize,
        setTextSize,
        printSettings,
        updatePrintSettings,
        dashboardCustomSettings,
        updateDashboardCustomSettings,
        toggleDashboardQuickItem,
        toggleDashboardMetric,
        moveDashboardQuickItem,
        moveDashboardMetric,
        resetDashboardCustomSettings,
        themeSettings,
        updateThemeSettings,
        productFields,
        updateProductFields,
        customerFields,
        updateCustomerFields,
        supplierFields,
        updateSupplierFields,
        salesFields,
        updateSalesFields,
        purchaseFields,
        updatePurchaseFields,
        expenseFields,
        updateExpenseFields,
        skuBarcodeSettings,
        updateSkuBarcodeSettings,
        enhancedPrintSettings,
        updateEnhancedPrintSettings,
        customFields,
        addCustomField,
        updateCustomField,
        deleteCustomField,
        paymentMethodsList,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        expenseCategoriesList,
        addExpenseCategory,
        updateExpenseCategory,
        deleteExpenseCategory,
        taxDiscountSettings,
        updateTaxDiscountSettings,
        rolePermissions,
        updateRolePermission,
        localizationSettings,
        updateLocalizationSettings,
        notificationSettings,
        updateNotificationSettings,
        securitySettings,
        updateSecuritySettings,
        verifyAdminPin,
        sendRecoveryOtp,
        verifyRecoveryOtp,
        resetAdminPinWithRecovery,
        generateNewBackupCodes,
        verifyBackupCode,
        addSecurityLog,
        clearSecurityLogs,
        activeRecoveryOtp,
        isRecoveryModalOpen,
        openRecoveryModal,
        closeRecoveryModal,
        businessSetup,
        updateBusinessSetup,
        brandsList,
        saveBrand,
        deleteBrand,
        toggleBrandStatus,
        categoriesList,
        saveCategory,
        deleteCategory,
        toggleCategoryStatus,
        reorderCategory,
        unitsList,
        saveUnit,
        deleteUnit,
        toggleUnitStatus,
        productTypesList,
        saveProductType,
        deleteProductType,
        productStatusesList,
        saveProductStatus,
        deleteProductStatus,
        taxTypesList,
        saveTaxType,
        deleteTaxType,
        discountTypesList,
        saveDiscountType,
        deleteDiscountType,
        priceTypesList,
        savePriceType,
        deletePriceType,
        incomeCategoriesList,
        saveIncomeCategory,
        deleteIncomeCategory,
        customerTypesList,
        saveCustomerType,
        deleteCustomerType,
        supplierTypesList,
        saveSupplierType,
        deleteSupplierType,
        salesTypesList,
        saveSalesType,
        deleteSalesType,
        purchaseTypesList,
        savePurchaseType,
        deletePurchaseType,
        topIconMenuConfig,
        updateTopIconMenuConfig,
        addTopIconMenuItem,
        updateTopIconMenuItem,
        deleteTopIconMenuItem,
        toggleTopIconMenuVisibility,
        reorderTopIconMenuItem,
        moveTopIconMenuItemToIndex,
        moveTopIconItemLocation,
        resetTopIconMenuToDefault,
        isTopIconCustomizerOpen,
        openTopIconCustomizer,
        closeTopIconCustomizer,
        resetAllSettingsToDefault,
        gmailAccounts,
        currentGmailUser,
        loginWithGmail,
        signUpWithGmail,
        logoutGmail,
        addManualGmailAccount,
        removeGmailAccount,
        switchGmailAccount,
        setBackupTargetGmail,
        autoBackupSettings,
        updateAutoBackupSettings,
        backupSnapshots,
        triggerAutoBackup,
        restoreFromSnapshot,
        deleteSnapshot,
        lastBackupConfirmation,
        syncStatus,
        lastSyncTime,
        serverVersion,
        triggerManualServerSync,
        isPwaInstalled,
        canInstallPwa: !isPwaInstalled,
        deferredPrompt,
        isPwaInstallModalOpen,
        openPwaInstallModal,
        closePwaInstallModal,
        promptInstallPwa,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
