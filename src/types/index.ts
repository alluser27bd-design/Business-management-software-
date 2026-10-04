// Types for BizAccount ERP & POS

export type UserRole = 'admin' | 'manager' | 'accountant' | 'sales' | 'cashier' | 'viewer';

export type PaymentMethod = 'cash' | 'bank' | 'mobile_banking' | 'credit' | 'own_money';

export type UnitType = 'pcs' | 'kg' | 'gm' | 'ltr' | 'box' | 'carton' | 'meter' | 'bag';

export interface CompanyProfile {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  website?: string;
  address: string;
  ownerName?: string;
  description?: string;
  logo?: string; // base64 or image URL
  logoSize?: 'small' | 'medium' | 'large';
  logoPosition?: 'left' | 'center' | 'right';
  currency: string;
  vatNumber: string;
  vatRate: number;
  periodLockedUntil?: string; // YYYY-MM-DD
  adminPin: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  photo?: string; // base64 or URL
  openingBalance: number; // positive = customer owes company
  creditLimit: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  openingBalance: number; // positive = company owes supplier
  creditLimit: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ProductVariant {
  size?: string;
  color?: string;
  model?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  sku: string;
  barcode: string;
  unit: UnitType;
  purchasePrice: number;
  salePrice: number;
  mrp: number;
  taxPercent: number;
  discountPercent: number;
  openingStock: number;
  minStock: number;
  warehouse: string;
  photo?: string; // base64 or URL
  variant?: ProductVariant;
  batchNo?: string;
  mfgDate?: string;
  expDate?: string;
  serialNumber?: string;
  warrantyMonths?: number;
  isRawMaterial?: boolean;
  isFinishedGood?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  barcode: string;
  unit: UnitType;
  qty: number;
  rate: number;
  discount: number; // in percent or flat
  taxPercent: number;
  total: number;
  purchaseCost: number; // for gross profit calculation
  batchNo?: string;
  serialNumber?: string;
}

export type InvoiceType = 'sale' | 'pos' | 'quotation' | 'order' | 'challan' | 'return';

export interface Invoice {
  id: string;
  invoiceNo: string;
  type: InvoiceType;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  additionalCharge: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: PaymentMethod;
  warehouse: string;
  salesmanName?: string;
  notes?: string;
  status: 'completed' | 'draft' | 'cancelled' | 'pending';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  unit: UnitType;
  qty: number;
  rate: number;
  discount: number;
  taxPercent: number;
  total: number;
  batchNo?: string;
  expDate?: string;
}

export type PurchaseType = 'bill' | 'order' | 'return';

export interface Purchase {
  id: string;
  billNo: string;
  type: PurchaseType;
  supplierId: string;
  supplierName: string;
  date: string;
  time: string;
  items: PurchaseItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  additionalCharge: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: PaymentMethod;
  warehouse: string;
  notes?: string;
  status: 'received' | 'ordered' | 'returned' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Expense {
  id: string;
  expenseNo: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'bank' | 'mobile_banking' | 'own_money';
  paidBy: string; // e.g. 'Company Cash' or Owner/Party Name
  ownerPartyName?: string; // used for custom balance tracking
  isOwnMoneyPaid?: boolean; // if true, tracked as company liability / due to owner
  status?: 'approved' | 'pending' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PaymentRecord {
  id: string;
  paymentNo: string;
  type: 'in' | 'out'; // 'in' = collection from customer, 'out' = payment to supplier or withdrawal
  partyType: 'customer' | 'supplier' | 'owner' | 'other';
  partyId?: string;
  partyName: string;
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'mobile_banking';
  referenceNo?: string; // invoice/bill reference
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export type StockMovementType = 'in' | 'out' | 'damage' | 'expired' | 'adjustment' | 'transfer';

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  qty: number;
  unit: UnitType;
  fromWarehouse?: string;
  toWarehouse?: string;
  reason: string;
  costImpact: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  designation: string;
  department: string;
  salary: number;
  address: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  dutyHours: number;
  overtimeHours: number;
  notes?: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  monthYear: string; // YYYY-MM
  basicSalary: number;
  overtimeAmount: number;
  bonus: number;
  deduction: number;
  netSalary: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: 'cash' | 'bank' | 'mobile_banking';
  paymentDate: string;
  status: 'paid' | 'partial' | 'due';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface BomItem {
  rawProductId: string;
  rawProductName: string;
  qtyPerUnit: number;
  cost: number;
}

export interface ManufacturingOrder {
  id: string;
  orderNo: string;
  finishedProductId: string;
  finishedProductName: string;
  targetQty: number;
  bom: BomItem[];
  additionalCost: number;
  totalCost: number;
  date: string;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface DeliveryChallan {
  id: string;
  challanNo: string;
  invoiceId?: string;
  invoiceNo?: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryPerson: string;
  deliveryDate: string;
  route: string;
  status: 'pending' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  module: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'VOID' | 'APPROVE';
  recordId: string;
  summary: string;
  details?: string;
}

export interface ApprovalItem {
  id: string;
  type: 'discount' | 'refund' | 'expense' | 'purchase' | 'adjustment' | 'price_change';
  title: string;
  amountOrDetail: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  notes?: string;
}

export interface CashierShift {
  id: string;
  cashierName: string;
  startTime: string;
  endTime?: string;
  openingCash: number;
  closingCash?: number;
  expectedCash?: number;
  cashDifference?: number;
  totalSales: number;
  status: 'open' | 'closed';
}

export interface BackupData {
  version: string;
  exportedAt: string;
  companyProfile: CompanyProfile;
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
  cashierShifts: CashierShift[];
}

export interface GmailAccount {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isPrimary: boolean;
  isBackupTarget: boolean;
  linkedAt: string;
  lastLoginAt: string;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  sizeBytes: number;
  recordCount: number;
  destinationGmail: string;
  type: 'auto' | 'manual';
  status: 'success' | 'failed';
  summary: string;
  data: BackupData;
}

export interface AutoBackupSettings {
  enabled: boolean;
  intervalMinutes: number; // e.g. 5, 10, 15, 30, 60
  targetGmailId: string;
  lastBackupTime?: string;
  keepMaxSnapshots: number;
}

export type TextSize = 'small' | 'medium' | 'large' | 'xl';

export interface PrintSettings {
  showPreviousBalance: boolean; // পূর্বের বকেয়া / ব্যালেন্স
  showReceived: boolean;        // প্রাপ্ত টাকা / পরিশোধ
  showTotalBalance: boolean;    // মোট ব্যালেন্স
  showTotalDue: boolean;        // সর্বমোট বকেয়া
  showInvoiceNo: boolean;       // চালান নং
  showDate: boolean;            // তারিখ ও সময়
  showCustomerInfo: boolean;    // কাস্টমার তথ্য
  showCustomerPhoto: boolean;   // কাস্টমার ছবি
  showItemPhoto: boolean;       // পণ্যের ছবি
  showItemSku: boolean;         // SKU কোড
  showItemBarcode: boolean;     // বারকোড
  showItemQrCode: boolean;      // QR কোড
  showItemDiscount: boolean;    // ছাড় (Discount)
  showItemTax: boolean;         // ট্যাক্স / ভ্যাট
  showVatBin: boolean;          // ভ্যাট / BIN নম্বর
  showSignatureLines: boolean;  // ক্রেতা ও অফিস স্বাক্ষর রেখা
  showNotes: boolean;           // নোটস ও শর্তাবলী
  receiptFooterNote: string;    // রসিদের নিচের ধন্যবাদ বার্তা
}

export interface TableColumnConfig {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface DashboardQuickItemConfig {
  id: string;
  label: string;
  iconName: string;
  tab: string;
  color: string;
  enabled: boolean;
  order: number;
}

export interface DashboardMetricConfig {
  id: string;
  label: string;
  category: 'all_time' | 'today';
  iconName: string;
  color: string;
  enabled: boolean;
  order: number;
}

export interface DashboardChartConfig {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface DashboardWidgetConfig {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface DashboardCustomSettings {
  quickItems: DashboardQuickItemConfig[];
  metrics: DashboardMetricConfig[];
  charts?: DashboardChartConfig[];
  widgets?: DashboardWidgetConfig[];
  cardSize?: 'compact' | 'standard' | 'large';
}

// 2. Appearance & Theme Settings
export type ThemeMode = 'light' | 'dark' | 'system';
export type PrimaryColorTheme = 'emerald' | 'blue' | 'indigo' | 'violet' | 'rose' | 'amber' | 'slate';
export type BorderRadiusOption = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface ThemeSettings {
  mode: ThemeMode;
  primaryColor: PrimaryColorTheme;
  fontFamily: string;
  textSize: TextSize;
  borderRadius: BorderRadiusOption;
  sidebarStyle: 'default' | 'compact' | 'dark' | 'glass';
  headerStyle: 'default' | 'clean' | 'accent';
  cardStyle: 'bordered' | 'shadow' | 'flat';
}

// 3. Module Field Config (Product, Customer, Supplier, Sales, Purchase, Expense)
export interface FieldVisibilityConfig {
  id: string;
  label: string;
  show: boolean;
  required: boolean;
  order: number;
}

export interface SkuBarcodeSettings {
  autoSku: boolean;
  skuPrefix: string;
  autoBarcode: boolean;
  barcodeType: 'CODE128' | 'EAN13' | 'QR';
  showSkuInTables: boolean;
  showBarcodeInTables: boolean;
}

// 4. Enhanced Print & PDF Settings
export type PaperSize = 'a4' | 'a5' | 'pos80' | 'pos58' | 'custom';
export type PrintLayoutTheme = 'classic' | 'modern' | 'minimal' | 'thermal';

export interface EnhancedPrintSettings extends PrintSettings {
  paperSize: PaperSize;
  printTheme: PrintLayoutTheme;
  customWidthMm: number;
  customHeightMm: number;
  marginTopMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  marginRightMm: number;
  headerHeightMm: number;
  footerHeightMm: number;
  fontSizePt: number;
  logoSize: 'small' | 'medium' | 'large';
  logoPosition: 'left' | 'center' | 'right';
  textAlignment: 'left' | 'center' | 'right';
  showLogo: boolean;
  showCompanyName: boolean;
  showAddress: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showTermsConditions: boolean;
  termsConditionsText: string;
  showPaymentMethod: boolean;
}

// 5. Custom Fields System
export interface CustomFieldDefinition {
  id: string;
  module: 'product' | 'customer' | 'supplier' | 'invoice' | 'expense';
  label: string;
  key: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  options?: string[]; // for select type
  required: boolean;
  showInPrint: boolean;
  showInTable: boolean;
  order: number;
}

// 6. Payment Method Settings
export interface PaymentMethodItem {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'mobile_banking' | 'card' | 'other';
  accountNumber?: string;
  bankName?: string;
  enabled: boolean;
  isDefault: boolean;
  order: number;
}

// 7. Expense Category Settings
export interface ExpenseCategoryItem {
  id: string;
  name: string;
  icon?: string;
  budgetMonthly?: number;
  enabled: boolean;
}

// 8. Tax & Discount Settings
export interface TaxDiscountSettings {
  taxEnabled: boolean;
  defaultTaxRate: number;
  taxName: string; // e.g. 'ভ্যাট / VAT'
  discountEnabled: boolean;
  defaultDiscountType: 'percentage' | 'fixed';
  maxDiscountPercent: number;
  showDiscountInPos: boolean;
}

// 9. Role Permissions
export interface RoleModulePermission {
  module: string;
  label: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPrint: boolean;
  canExport: boolean;
}

export interface UserRoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  permissions: RoleModulePermission[];
  canAccessSettings: boolean;
}

// 10. General & Localization
export interface LocalizationSettings {
  language: 'bn' | 'en';
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'DD-MM-YYYY' | 'MM/DD/YYYY';
  timeFormat: '12h' | '24h';
  numberFormat: 'bangladeshi' | 'international';
  timezone: string;
}

// 11. Notification Settings
export interface NotificationSettings {
  newSale: boolean;
  newPurchase: boolean;
  paymentReceived: boolean;
  duePaymentAlert: boolean;
  expenseAdded: boolean;
  lowStockAlert: boolean;
  systemAlert: boolean;
  soundEnabled: boolean;
}

// 12. Security & Recovery Settings
export interface SecurityLogItem {
  id: string;
  timestamp: string;
  type:
    | 'pin_change'
    | 'otp_sent'
    | 'otp_verified'
    | 'pin_recovered'
    | 'failed_pin'
    | 'lockout'
    | 'backup_codes_generated'
    | 'backup_code_used'
    | 'email_updated'
    | 'phone_updated'
    | 'account_created';
  description: string;
  ipOrDevice?: string;
  status: 'success' | 'warning' | 'failed';
}

export interface SecuritySettings {
  adminPin: string;
  recoveryEmail: string;
  isRecoveryEmailVerified: boolean;
  recoveryPhone: string;
  isRecoveryPhoneVerified: boolean;
  backupCodes: string[];
  usedBackupCodes: string[];
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
  failedAttemptsCount: number;
  lockoutUntil: string | null;
  requirePinForDelete: boolean;
  requirePinForBackup: boolean;
  requirePinForReset: boolean;
  autoLogoutMinutes: number;
  showActivityLog: boolean;
  securityLogs: SecurityLogItem[];
}

// 13. Master Data & Business Setup Management
export interface BranchItem {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface BusinessSetupConfig {
  businessName: string;
  businessType: string;
  shopType: string;
  businessCategory: string;
  businessDescription: string;
  branches: BranchItem[];
  businessTypesList: string[];
  shopTypesList: string[];
  businessCategoriesList: string[];
  logo?: string;
}

export interface BrandItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  order?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  icon?: string;
  subcategories: string[];
  isActive: boolean;
  order?: number;
}

export interface UnitItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  order?: number;
}

export interface ProductTypeItem {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface ProductStatusItem {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

export interface TaxTypeItem {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface DiscountTypeItem {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  isDefault: boolean;
  isActive: boolean;
}

export interface PriceTypeItem {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface IncomeCategoryItem {
  id: string;
  name: string;
  icon?: string;
  isActive: boolean;
}

export interface CustomerTypeItem {
  id: string;
  name: string;
  discountPercent?: number;
  isActive: boolean;
}

export interface SupplierTypeItem {
  id: string;
  name: string;
  isActive: boolean;
}

export interface SalesTypeItem {
  id: string;
  name: string;
  isActive: boolean;
}

export interface PurchaseTypeItem {
  id: string;
  name: string;
  isActive: boolean;
}

// 14. Top & Down Icon Menu Control & Customization
export type TopIconActionType =
  | 'tab'
  | 'modal'
  | 'custom_action'
  | 'external_link';

export type MenuLocation = 'top' | 'bottom';

export interface TopIconMenuItem {
  id: string;
  label: string;
  subLabel?: string;
  iconName: string;
  actionType: TopIconActionType;
  target: string;
  location: MenuLocation; // 'top' or 'bottom'
  badgeType?: 'count' | 'dot' | 'text' | 'none';
  badgeText?: string;
  color?: string; // e.g. emerald, blue, amber, purple, rose, slate, cyan, indigo, teal
  bgColor?: string;
  isVisible: boolean;
  order: number;
  showOnMobile?: boolean;
  showLabelOnDesktop?: boolean;
  tooltip?: string;
  isSystem?: boolean; // built-in system action
}

export interface TopIconMenuConfig {
  isEnabled: boolean;
  placement: 'top_navbar_right' | 'top_navbar_center' | 'sub_header_bar' | 'floating_bar' | 'bottom_bar';
  alignment: 'start' | 'center' | 'end' | 'between';
  spacing: 'compact' | 'standard' | 'spacious';
  buttonStyle: 'rounded_icon_button' | 'pill_with_label' | 'compact_tile' | 'minimal_flat';
  iconSize: 'small' | 'medium' | 'large';
  showLabels: boolean;
  // Down / Bottom Menu Settings
  bottomPlacement: 'fixed_bottom' | 'floating_dock' | 'bottom_navigation';
  showBottomOnDesktop: boolean;
  bottomSpacing: 'compact' | 'standard' | 'spacious';
  bottomButtonStyle: 'native_nav_tab' | 'pill_with_label' | 'compact_tile' | 'floating_circle';
  bottomIconSize: 'small' | 'medium' | 'large';
  items: TopIconMenuItem[];
}




