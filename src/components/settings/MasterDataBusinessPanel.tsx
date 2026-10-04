import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Tag,
  FolderTree,
  Package,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Layers,
  Scale,
  Percent,
  Receipt,
  Truck,
  Users,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  FileText,
} from 'lucide-react';
import {
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
} from '../../types';

export const MasterDataBusinessPanel: React.FC = () => {
  const {
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
    paymentMethodsList,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    expenseCategoriesList,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    products,
    showToast,
  } = useApp();

  // Active Main Sub-Tab
  const [activeTab, setActiveTab] = useState<
    'business' | 'brands' | 'categories' | 'productMaster' | 'financeMaster'
  >('business');

  // Product Master Sub-Selection
  const [productMasterTab, setProductMasterTab] = useState<
    'units' | 'types' | 'statuses' | 'tax' | 'discount' | 'prices'
  >('units');

  // Finance Master Sub-Selection
  const [financeMasterTab, setFinanceMasterTab] = useState<
    'payments' | 'expenses' | 'income' | 'customerTypes' | 'supplierTypes' | 'salesTypes' | 'purchaseTypes'
  >('payments');

  // -------------------------------------------------------------
  // Modals & Form States
  // -------------------------------------------------------------

  // Delete & Safety Warning Modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'brand' | 'category' | 'unit' | 'other';
    id: string;
    name: string;
    usageCount: number;
    onConfirmDelete: () => void;
    onDeactivate: () => void;
  } | null>(null);

  // Business Setup Form States
  const [bizForm, setBizForm] = useState(businessSetup);
  const [newBizTypeInput, setNewBizTypeInput] = useState('');
  const [newShopTypeInput, setNewShopTypeInput] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Branch Modal
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);
  const [branchForm, setBranchForm] = useState<Omit<BranchItem, 'id'>>({
    name: '',
    code: '',
    address: '',
    phone: '',
    isDefault: false,
    isActive: true,
  });

  // Brand Modal
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [brandForm, setBrandForm] = useState<Omit<BrandItem, 'id' | 'order'>>({
    name: '',
    code: '',
    description: '',
    logo: '',
    isActive: true,
  });

  // Category Modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [catForm, setCatForm] = useState<Omit<CategoryItem, 'id' | 'order'>>({
    name: '',
    code: '',
    description: '',
    subcategories: [],
    isActive: true,
  });
  const [subcatTagInput, setSubcatTagInput] = useState('');

  // Unit Modal
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitItem | null>(null);
  const [unitForm, setUnitForm] = useState<Omit<UnitItem, 'id' | 'order'>>({
    name: '',
    code: '',
    description: '',
    isActive: true,
  });

  // Generic Item Modal (for Product Type, Status, Tax, Discount, Price, Income, Customer Type, Supplier Type, Sales Type, Purchase Type)
  const [genericModalOpen, setGenericModalOpen] = useState(false);
  const [genericModalConfig, setGenericModalConfig] = useState<{
    title: string;
    type: string;
    item?: any;
  } | null>(null);
  const [genericNameInput, setGenericNameInput] = useState('');
  const [genericExtraInput, setGenericExtraInput] = useState('');

  // -------------------------------------------------------------
  // Handlers for Business Setup
  // -------------------------------------------------------------
  const handleSaveBusinessSetup = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSetup(bizForm);
    showToast('ব্যবসায়িক তথ্য সফলভাবে সংরক্ষিত হয়েছে');
  };

  const handleAddBizType = () => {
    if (!newBizTypeInput.trim()) return;
    const current = bizForm.businessTypesList || [];
    if (!current.includes(newBizTypeInput.trim())) {
      const updated = [...current, newBizTypeInput.trim()];
      setBizForm({ ...bizForm, businessTypesList: updated, businessType: newBizTypeInput.trim() });
      updateBusinessSetup({ businessTypesList: updated, businessType: newBizTypeInput.trim() });
      setNewBizTypeInput('');
      showToast('নতুন বিজনেস টাইপ যুক্ত হয়েছে');
    }
  };

  const handleDeleteBizType = (type: string) => {
    const updated = (bizForm.businessTypesList || []).filter((t) => t !== type);
    setBizForm({ ...bizForm, businessTypesList: updated });
    updateBusinessSetup({ businessTypesList: updated });
    showToast('বিজনেস টাইপ অপশন থেকে সরানো হয়েছে');
  };

  const handleAddShopType = () => {
    if (!newShopTypeInput.trim()) return;
    const current = bizForm.shopTypesList || [];
    if (!current.includes(newShopTypeInput.trim())) {
      const updated = [...current, newShopTypeInput.trim()];
      setBizForm({ ...bizForm, shopTypesList: updated, shopType: newShopTypeInput.trim() });
      updateBusinessSetup({ shopTypesList: updated, shopType: newShopTypeInput.trim() });
      setNewShopTypeInput('');
      showToast('নতুন শপ টাইপ যুক্ত হয়েছে');
    }
  };

  const handleDeleteShopType = (type: string) => {
    const updated = (bizForm.shopTypesList || []).filter((t) => t !== type);
    setBizForm({ ...bizForm, shopTypesList: updated });
    updateBusinessSetup({ shopTypesList: updated });
    showToast('শপ টাইপ অপশন থেকে সরানো হয়েছে');
  };

  // Branch CRUD
  const handleOpenBranchModal = (branch?: BranchItem) => {
    if (branch) {
      setEditingBranch(branch);
      setBranchForm({
        name: branch.name,
        code: branch.code,
        address: branch.address,
        phone: branch.phone,
        isDefault: branch.isDefault,
        isActive: branch.isActive,
      });
    } else {
      setEditingBranch(null);
      setBranchForm({
        name: '',
        code: `BR-0${(bizForm.branches?.length || 0) + 1}`,
        address: '',
        phone: '',
        isDefault: (bizForm.branches?.length || 0) === 0,
        isActive: true,
      });
    }
    setBranchModalOpen(true);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name.trim()) return;

    let updatedBranches = [...(bizForm.branches || [])];
    if (editingBranch) {
      updatedBranches = updatedBranches.map((b) =>
        b.id === editingBranch.id
          ? {
              ...b,
              ...branchForm,
              isDefault: branchForm.isDefault ? true : b.isDefault && !branchForm.isDefault ? false : b.isDefault,
            }
          : branchForm.isDefault
          ? { ...b, isDefault: false }
          : b
      );
    } else {
      const newB: BranchItem = {
        id: `BR_${Date.now()}`,
        ...branchForm,
      };
      if (branchForm.isDefault) {
        updatedBranches = updatedBranches.map((b) => ({ ...b, isDefault: false }));
      }
      updatedBranches.push(newB);
    }

    setBizForm({ ...bizForm, branches: updatedBranches });
    updateBusinessSetup({ branches: updatedBranches });
    setBranchModalOpen(false);
    showToast(editingBranch ? 'শাখা আপডেট হয়েছে' : 'নতুন শাখা যুক্ত হয়েছে');
  };

  const handleDeleteBranch = (id: string) => {
    if ((bizForm.branches || []).length <= 1) {
      showToast('কমপক্ষে একটি প্রধান শাখা সক্রিয় থাকতে হবে');
      return;
    }
    const updated = (bizForm.branches || []).filter((b) => b.id !== id);
    setBizForm({ ...bizForm, branches: updated });
    updateBusinessSetup({ branches: updated });
    showToast('শাখা মুছে ফেলা হয়েছে');
  };

  // -------------------------------------------------------------
  // Handlers for Brands
  // -------------------------------------------------------------
  const handleOpenBrandModal = (brand?: BrandItem) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandForm({
        name: brand.name,
        code: brand.code || '',
        description: brand.description || '',
        logo: brand.logo || '',
        isActive: brand.isActive,
      });
    } else {
      setEditingBrand(null);
      setBrandForm({
        name: '',
        code: '',
        description: '',
        logo: '',
        isActive: true,
      });
    }
    setBrandModalOpen(true);
  };

  const handleSaveBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name.trim()) return;

    saveBrand({
      ...(editingBrand ? { id: editingBrand.id } : {}),
      ...brandForm,
    });
    setBrandModalOpen(false);
  };

  const handleAttemptDeleteBrand = (brand: BrandItem) => {
    const res = deleteBrand(brand.id, false);
    if (!res.success && res.isUsed) {
      setDeleteModal({
        isOpen: true,
        type: 'brand',
        id: brand.id,
        name: brand.name,
        usageCount: res.usageCount || 0,
        onConfirmDelete: () => {
          deleteBrand(brand.id, true);
          setDeleteModal(null);
        },
        onDeactivate: () => {
          toggleBrandStatus(brand.id);
          setDeleteModal(null);
        },
      });
    }
  };

  // -------------------------------------------------------------
  // Handlers for Categories
  // -------------------------------------------------------------
  const handleOpenCatModal = (cat?: CategoryItem) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({
        name: cat.name,
        code: cat.code || '',
        description: cat.description || '',
        subcategories: [...cat.subcategories],
        isActive: cat.isActive,
      });
    } else {
      setEditingCat(null);
      setCatForm({
        name: '',
        code: '',
        description: '',
        subcategories: [],
        isActive: true,
      });
    }
    setSubcatTagInput('');
    setCatModalOpen(true);
  };

  const handleAddSubcatTag = () => {
    if (!subcatTagInput.trim()) return;
    if (!catForm.subcategories.includes(subcatTagInput.trim())) {
      setCatForm({
        ...catForm,
        subcategories: [...catForm.subcategories, subcatTagInput.trim()],
      });
      setSubcatTagInput('');
    }
  };

  const handleRemoveSubcatTag = (sub: string) => {
    setCatForm({
      ...catForm,
      subcategories: catForm.subcategories.filter((s) => s !== sub),
    });
  };

  const handleSaveCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;

    saveCategory({
      ...(editingCat ? { id: editingCat.id } : {}),
      ...catForm,
    });
    setCatModalOpen(false);
  };

  const handleAttemptDeleteCat = (cat: CategoryItem) => {
    const res = deleteCategory(cat.id, false);
    if (!res.success && res.isUsed) {
      setDeleteModal({
        isOpen: true,
        type: 'category',
        id: cat.id,
        name: cat.name,
        usageCount: res.usageCount || 0,
        onConfirmDelete: () => {
          deleteCategory(cat.id, true);
          setDeleteModal(null);
        },
        onDeactivate: () => {
          toggleCategoryStatus(cat.id);
          setDeleteModal(null);
        },
      });
    }
  };

  // -------------------------------------------------------------
  // Handlers for Units
  // -------------------------------------------------------------
  const handleOpenUnitModal = (unit?: UnitItem) => {
    if (unit) {
      setEditingUnit(unit);
      setUnitForm({
        name: unit.name,
        code: unit.code,
        description: unit.description || '',
        isActive: unit.isActive,
      });
    } else {
      setEditingUnit(null);
      setUnitForm({
        name: '',
        code: '',
        description: '',
        isActive: true,
      });
    }
    setUnitModalOpen(true);
  };

  const handleSaveUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitForm.name.trim() || !unitForm.code.trim()) return;

    saveUnit({
      ...(editingUnit ? { id: editingUnit.id } : {}),
      ...unitForm,
    });
    setUnitModalOpen(false);
  };

  const handleAttemptDeleteUnit = (unit: UnitItem) => {
    const res = deleteUnit(unit.id, false);
    if (!res.success && res.isUsed) {
      setDeleteModal({
        isOpen: true,
        type: 'unit',
        id: unit.id,
        name: unit.name,
        usageCount: res.usageCount || 0,
        onConfirmDelete: () => {
          deleteUnit(unit.id, true);
          setDeleteModal(null);
        },
        onDeactivate: () => {
          toggleUnitStatus(unit.id);
          setDeleteModal(null);
        },
      });
    }
  };

  // -------------------------------------------------------------
  // Generic Modal Openers for Other Master Items
  // -------------------------------------------------------------
  const handleOpenGenericModal = (type: string, title: string, item?: any) => {
    setGenericModalConfig({ type, title, item });
    if (item) {
      setGenericNameInput(item.name || '');
      setGenericExtraInput(item.rate !== undefined ? String(item.rate) : item.code || item.discountPercent || '');
    } else {
      setGenericNameInput('');
      setGenericExtraInput('');
    }
    setGenericModalOpen(true);
  };

  const handleSaveGenericSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genericNameInput.trim() || !genericModalConfig) return;

    const { type, item } = genericModalConfig;

    if (type === 'product_type') {
      saveProductType({
        ...(item ? { id: item.id } : {}),
        name: genericNameInput.trim(),
        code: genericExtraInput.trim().toLowerCase() || genericNameInput.trim().toLowerCase(),
        isActive: true,
      });
    } else if (type === 'product_status') {
      saveProductStatus({
        ...(item ? { id: item.id } : {}),
        name: genericNameInput.trim(),
        color: genericExtraInput.trim() || 'emerald',
        isActive: true,
      });
    } else if (type === 'tax_type') {
      saveTaxType({
        ...(item ? { id: item.id } : {}),
        name: genericNameInput.trim(),
        rate: Number(genericExtraInput) || 0,
        isDefault: false,
        isActive: true,
      });
    } else if (type === 'discount_type') {
      saveDiscountType({
        ...(item ? { id: item.id } : {}),
        name: genericNameInput.trim(),
        type: genericExtraInput === 'fixed' ? 'fixed' : 'percentage',
        isDefault: false,
        isActive: true,
      });
    } else if (type === 'price_type') {
      savePriceType({
        ...(item ? { id: item.id } : {}),
        name: genericNameInput.trim(),
        code: genericExtraInput.trim().toLowerCase() || 'custom',
        isActive: true,
      });
    } else if (type === 'income_cat') {
      saveIncomeCategory({
        ...(item ? { id: item.id } : {}),
        name: genericNameInput.trim(),
        isActive: true,
      });
    } else if (type === 'customer_type') {
      saveCustomerType({
        ...(item ? { id: item.id } : {}),
        name: genericNameInput.trim(),
        discountPercent: Number(genericExtraInput) || 0,
        isActive: true,
      });
    } else if (type === 'supplier_type') {
      saveSupplierType({
        ...(item ? { id: item.id } : {}),
        name: genericNameInput.trim(),
        isActive: true,
      });
    } else if (type === 'sales_type') {
      saveSalesType({
        ...(item ? { id: item.id } : {}),
        name: genericNameInput.trim(),
        isActive: true,
      });
    } else if (type === 'purchase_type') {
      savePurchaseType({
        ...(item ? { id: item.id } : {}),
        name: genericNameInput.trim(),
        isActive: true,
      });
    }

    setGenericModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Hub Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>মাস্টার ডাটা ও বিজনেস সেটআপ কন্ট্রোল (Master Data & Business Setup)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            কোড পরিবর্তন না করেই ব্যবসা প্রতিষ্ঠান, ব্র্যান্ড, ক্যাটাগরি, ইউনিট, পেমেন্ট ও সকল মাস্টার ডাটা এখান থেকেই নিয়ন্ত্রণ করুন
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black self-start sm:self-auto shadow-2xs">
          সেন্ট্রাল মাস্টার সিঙ্ক সক্রিয়
        </span>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 overflow-x-auto">
        {[
          { id: 'business', label: '১. বিজনেস সেটআপ ও শাখা', icon: Building2 },
          { id: 'brands', label: '২. ব্র্যান্ড ম্যানেজমেন্ট', icon: Tag, count: brandsList.length },
          { id: 'categories', label: '৩. ক্যাটাগরি ও সাবক্যাটাগরি', icon: FolderTree, count: categoriesList.length },
          { id: 'productMaster', label: '৪. প্রোডাক্ট মাস্টার (Unit/Tax/Price)', icon: Package },
          { id: 'financeMaster', label: '৫. পেমেন্ট, খরচ ও অন্যান্য মাস্টার', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. BUSINESS SETUP & BRANCHES */}
      {/* ======================================================== */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveBusinessSetup} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">ব্যবসার সাধারণ প্রোফাইল (Business Profile)</h4>
                  <p className="text-[11px] text-slate-500">আপনার প্রতিষ্ঠানের মূল পরিচিতি ও ক্যাটাগরি নির্ধারণ করুন</p>
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                পরিবর্তন সংরক্ষণ করুন
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ব্যবসা প্রতিষ্ঠানের নাম (Business Name) *</label>
                <input
                  type="text"
                  required
                  value={bizForm.businessName}
                  onChange={(e) => setBizForm({ ...bizForm, businessName: e.target.value })}
                  placeholder="যেমন: মেসার্স ভাই ভাই এন্টারপ্রাইজ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিজনেস টাইপ (Business Type) *</label>
                <select
                  value={bizForm.businessType}
                  onChange={(e) => setBizForm({ ...bizForm, businessType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600"
                >
                  {(bizForm.businessTypesList || []).map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শপ / আউটলেট টাইপ (Shop Type)</label>
                <select
                  value={bizForm.shopType}
                  onChange={(e) => setBizForm({ ...bizForm, shopType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600"
                >
                  {(bizForm.shopTypesList || []).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">ব্যবসার বিবরণ বা ট্যাগলাইন (Description / Tagline)</label>
                <input
                  type="text"
                  value={bizForm.businessDescription}
                  onChange={(e) => setBizForm({ ...bizForm, businessDescription: e.target.value })}
                  placeholder="হোলসেল ও রিটেইল ট্রেডার্স এবং সাপ্লাইয়ার্স..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিজনেস ক্যাটাগরি (Industry Sector)</label>
                <select
                  value={bizForm.businessCategory}
                  onChange={(e) => setBizForm({ ...bizForm, businessCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600"
                >
                  {(bizForm.businessCategoriesList || []).map((bc) => (
                    <option key={bc} value={bc}>
                      {bc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Business Types / Shop Types Tag Manager */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">কাস্টম বিজনেস টাইপ তালিকা পরিচালনা:</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="নতুন বিজনেস টাইপ লিখুন..."
                    value={newBizTypeInput}
                    onChange={(e) => setNewBizTypeInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAddBizType}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    যুক্ত করুন
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(bizForm.businessTypesList || []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg text-[11px] font-bold shadow-2xs"
                    >
                      <span>{t}</span>
                      {bizForm.businessTypesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteBizType(t)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">কাস্টম শপ টাইপ তালিকা পরিচালনা:</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="নতুন শপ টাইপ লিখুন..."
                    value={newShopTypeInput}
                    onChange={(e) => setNewShopTypeInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAddShopType}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    যুক্ত করুন
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(bizForm.shopTypesList || []).map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg text-[11px] font-bold shadow-2xs"
                    >
                      <span>{s}</span>
                      {bizForm.shopTypesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteShopType(s)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {/* Branch / Location Master */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">শাখা ও আউটলেট লোকেশন (Branches & Locations)</h4>
                  <p className="text-[11px] text-slate-500">আপনার ব্যবসা প্রতিষ্ঠানের একাধিক শাখা বা শোরুম পরিচালনা করুন</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBranchModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন শাখা যুক্ত করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(bizForm.branches || []).map((branch) => (
                <div
                  key={branch.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    branch.isDefault
                      ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/10 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-bold text-xs text-slate-900 truncate">{branch.name}</span>
                      </div>
                      {branch.isDefault && (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-blue-600 text-white rounded-md shrink-0">
                          Main Branch
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mb-1 font-mono">কোড: {branch.code}</div>
                    <div className="text-xs text-slate-700 mb-1 font-medium">{branch.address}</div>
                    <div className="text-[11px] text-slate-600">{branch.phone}</div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-100 mt-3">
                    <button
                      type="button"
                      onClick={() => handleOpenBranchModal(branch)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!branch.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. BRANDS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'brands' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900">ব্র্যান্ড ম্যানেজমেন্ট (Brand Master)</h4>
                <p className="text-[11px] text-slate-500">
                  পণ্য প্রস্তুতকারক ও ব্র্যান্ড তালিকা যুক্ত, পরিবর্তন, দৃশ্যমানতা ও সুরক্ষিত ডিলিট নিয়ন্ত্রণ করুন
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenBrandModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন ব্র্যান্ড যুক্ত করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {brandsList.map((brand) => {
              const productCount = products.filter((p) => !p.deletedAt && p.brand === brand.name).length;
              return (
                <div
                  key={brand.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    brand.isActive
                      ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-black text-xs">
                          {brand.name.slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 truncate">{brand.name}</h5>
                          {brand.code && <span className="text-[10px] text-slate-400 font-mono">{brand.code}</span>}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBrandStatus(brand.id)}
                        title={brand.isActive ? 'লুকিয়ে রাখুন (Hide)' : 'দৃশ্যমান করুন (Show)'}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          brand.isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                        }`}
                      >
                        {brand.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                      {brand.description || 'কোনো বিবরণ যোগ করা হয়নি'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                      {productCount} টি পণ্য সংযুক্ত
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenBrandModal(brand)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAttemptDeleteBrand(brand)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CATEGORIES & SUBCATEGORIES MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <FolderTree className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900">ক্যাটাগরি ও সাবক্যাটাগরি (Category Master)</h4>
                <p className="text-[11px] text-slate-500">
                  পণ্যের মূল ক্যাটাগরি, সাব-ক্যাটাগরি ট্যাগ, প্রদর্শন ক্রম ও ডেটা-সুরক্ষিত রিমুভ পরিচালনা
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCatModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন ক্যাটাগরি যুক্ত করুন</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {categoriesList.map((cat, idx) => {
              const productCount = products.filter((p) => !p.deletedAt && p.category === cat.name).length;
              return (
                <div
                  key={cat.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    cat.isActive
                      ? 'bg-white border-slate-200 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorderCategory(cat.id, 'up')}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === categoriesList.length - 1}
                        onClick={() => reorderCategory(cat.id, 'down')}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{cat.name}</span>
                        {cat.code && (
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-mono font-bold">
                            {cat.code}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          {productCount} টি পণ্য
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{cat.description || 'কোনো বিবরণ নেই'}</p>

                      {/* Subcategories tags */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subcategories.map((sub) => (
                            <span
                              key={sub}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md"
                            >
                              • {sub}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => toggleCategoryStatus(cat.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        cat.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{cat.isActive ? 'সক্রিয়' : 'হাইড'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenCatModal(cat)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAttemptDeleteCat(cat)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. PRODUCT MASTER (Units, Types, Status, Tax, Disc, Price) */}
      {/* ======================================================== */}
      {activeTab === 'productMaster' && (
        <div className="space-y-4">
          {/* Sub-Tabs within Product Master */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1 rounded-2xl">
            {[
              { id: 'units', label: '১. পরিমাপ একক (Units)', count: unitsList.length },
              { id: 'types', label: '২. প্রোডাক্ট টাইপ (Product Types)', count: productTypesList.length },
              { id: 'statuses', label: '৩. স্টক স্ট্যাটাস (Statuses)', count: productStatusesList.length },
              { id: 'tax', label: '৪. ট্যাক্স রেট (Tax Rates)', count: taxTypesList.length },
              { id: 'discount', label: '৫. ডিসকাউন্ট পলিসি (Discount)', count: discountTypesList.length },
              { id: 'prices', label: '৬. মূল্য স্তর (Price Types)', count: priceTypesList.length },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setProductMasterTab(sub.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  productMasterTab === sub.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{sub.label}</span>
              </button>
            ))}
          </div>

          {/* 4A. UNITS LIST */}
          {productMasterTab === 'units' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">পরিমাপ একক মাস্টার (Units of Measurement)</h4>
                  <p className="text-[11px] text-slate-500">কেজি, লিটার, ব্যাগ, পিস, বক্স ইত্যাদি পরিমাপের একক নিয়ন্ত্রণ করুন</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenUnitModal()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন ইউনিট</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {unitsList.map((u) => {
                  const count = products.filter((p) => !p.deletedAt && (p.unit === u.code || p.unit === (u.name as any))).length;
                  return (
                    <div
                      key={u.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        u.isActive ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">{u.name}</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {u.code}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">{u.description || 'Standard Unit'}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold">{count} পণ্য</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleUnitStatus(u.id)}
                            className="p-1 text-slate-400 hover:text-slate-800"
                          >
                            {u.isActive ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenUnitModal(u)}
                            className="p-1 text-slate-400 hover:text-slate-800"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttemptDeleteUnit(u)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4B. PRODUCT TYPES */}
          {productMasterTab === 'types' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">প্রোডাক্ট টাইপ মাস্টার (Product Types)</h4>
                  <p className="text-[11px] text-slate-500">ফিনিশড গুডস, কাঁচামাল, কম্বো প্যাক ও সার্ভিস আইটেম</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGenericModal('product_type', 'নতুন প্রোডাক্ট টাইপ যুক্ত করুন')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন টাইপ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {productTypesList.map((pt) => (
                  <div key={pt.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{pt.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">কোড: {pt.code}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGenericModal('product_type', 'প্রোডাক্ট টাইপ এডিট', pt)}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProductType(pt.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4C. STOCK STATUSES */}
          {productMasterTab === 'statuses' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">ইনভেন্টরি স্টক স্ট্যাটাস (Stock Statuses)</h4>
                  <p className="text-[11px] text-slate-500">মজুদ পর্যাপ্ততা ও পণ্য লেবেল কনফিগার করুন</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGenericModal('product_status', 'নতুন স্টক স্ট্যাটাস যোগ করুন')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন স্ট্যাটাস</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {productStatusesList.map((ps) => (
                  <div key={ps.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <span className="font-bold text-xs text-slate-900">{ps.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGenericModal('product_status', 'স্ট্যাটাস এডিট', ps)}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProductStatus(ps.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4D. TAX TYPES */}
          {productMasterTab === 'tax' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">ট্যাক্স ও ভ্যাট স্ল্যাব মাস্টার (VAT & Tax Rates)</h4>
                  <p className="text-[11px] text-slate-500">০%, ৫%, ৭.৫%, ১৫% সহ কাস্টম ভ্যাট স্ল্যাবসমূহ</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGenericModal('tax_type', 'নতুন ট্যাক্স স্ল্যাব যোগ করুন')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন ভ্যাট স্ল্যাব</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {taxTypesList.map((tax) => (
                  <div key={tax.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{tax.name}</div>
                      <div className="text-xs font-black text-emerald-700">{tax.rate}% ভ্যাট</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGenericModal('tax_type', 'ট্যাক্স স্ল্যাব এডিট', tax)}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTaxType(tax.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4E. DISCOUNT TYPES */}
          {productMasterTab === 'discount' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">ডিসকাউন্ট পলিসি মাস্টার (Discount Types)</h4>
                  <p className="text-[11px] text-slate-500">শতাংশ ও ফ্ল্যাট ক্যাশ ডিসকাউন্টের ধরন</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGenericModal('discount_type', 'নতুন ডিসকাউন্ট টাইপ যোগ করুন')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন ডিসকাউন্ট</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {discountTypesList.map((disc) => (
                  <div key={disc.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{disc.name}</div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{disc.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGenericModal('discount_type', 'ডিসকাউন্ট এডিট', disc)}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDiscountType(disc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4F. PRICE TYPES */}
          {productMasterTab === 'prices' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">মূল্য স্তর মাস্টার (Price Levels)</h4>
                  <p className="text-[11px] text-slate-500">খুচরা MRP, পাইকারি রেট ও ডিলার মূল্য</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGenericModal('price_type', 'নতুন প্রাইস লেভেল যোগ করুন')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন প্রাইস লেভেল</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {priceTypesList.map((prc) => (
                  <div key={prc.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{prc.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">কোড: {prc.code}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGenericModal('price_type', 'প্রাইস লেভেল এডিট', prc)}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePriceType(prc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. FINANCE & OTHER MASTER DATA */}
      {/* ======================================================== */}
      {activeTab === 'financeMaster' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1 rounded-2xl">
            {[
              { id: 'payments', label: '১. পেমেন্ট মেথড (Payment Methods)', count: paymentMethodsList.length },
              { id: 'expenses', label: '২. খরচের খাত (Expense Cats)', count: expenseCategoriesList.length },
              { id: 'income', label: '৩. আয়ের খাত (Income Cats)', count: incomeCategoriesList.length },
              { id: 'customerTypes', label: '৪. কাস্টমার ধরন (Customer Types)', count: customerTypesList.length },
              { id: 'supplierTypes', label: '৫. সাপ্লায়ার ধরন (Supplier Types)', count: supplierTypesList.length },
              { id: 'salesTypes', label: '৬. বিক্রয় চালান ধরন (Sales Types)', count: salesTypesList.length },
              { id: 'purchaseTypes', label: '৭. ক্রয় বিল ধরন (Purchase Types)', count: purchaseTypesList.length },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setFinanceMasterTab(sub.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  financeMasterTab === sub.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{sub.label}</span>
              </button>
            ))}
          </div>

          {/* 5A. PAYMENT METHODS */}
          {financeMasterTab === 'payments' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">পেমেন্ট মাধ্যম মাস্টার (Payment Methods)</h4>
                  <p className="text-[11px] text-slate-500">ক্যাশ, ব্যাংক, বিকাশ, নগদ, কার্ড ইত্যাদি মাধ্যম</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const name = prompt('নতুন পেমেন্ট মাধ্যমের নাম লিখুন (যেমন: Upay, Rocket):');
                    if (name && name.trim()) {
                      addPaymentMethod({
                        name: name.trim(),
                        type: 'mobile_banking',
                        enabled: true,
                        isDefault: false,
                        order: paymentMethodsList.length + 1,
                      });
                    }
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন পেমেন্ট মাধ্যম</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {paymentMethodsList.map((m) => (
                  <div key={m.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{m.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{m.type}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updatePaymentMethod(m.id, { enabled: !m.enabled })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          m.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {m.enabled ? 'ON' : 'OFF'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePaymentMethod(m.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5B. EXPENSE CATEGORIES */}
          {financeMasterTab === 'expenses' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">খরচের খাত মাস্টার (Expense Categories)</h4>
                  <p className="text-[11px] text-slate-500">দোকান ভাড়া, ইউটিলিটি বিল, কর্মী বেতন ও পরিবহন খরচ</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const name = prompt('নতুন খরচের খাতের নাম লিখুন:');
                    if (name && name.trim()) {
                      addExpenseCategory({
                        name: name.trim(),
                        enabled: true,
                      });
                    }
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন খরচের খাত</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {expenseCategoriesList.map((exp) => (
                  <div key={exp.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">{exp.name}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateExpenseCategory(exp.id, { enabled: !exp.enabled })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          exp.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {exp.enabled ? 'ON' : 'OFF'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteExpenseCategory(exp.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5C. INCOME CATEGORIES */}
          {financeMasterTab === 'income' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">অন্যান্য আয়ের খাত মাস্টার (Income Categories)</h4>
                  <p className="text-[11px] text-slate-500">স্ক্র্যাপ বিক্রয়, কমিশন ও ডেলিভারি সার্ভিস চার্জ আয়</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGenericModal('income_cat', 'নতুন আয়ের খাত যোগ করুন')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন আয়ের খাত</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {incomeCategoriesList.map((inc) => (
                  <div key={inc.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">{inc.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGenericModal('income_cat', 'আয়ের খাত এডিট', inc)}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteIncomeCategory(inc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5D. CUSTOMER TYPES */}
          {financeMasterTab === 'customerTypes' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">কাস্টমার ধরন মাস্টার (Customer Types)</h4>
                  <p className="text-[11px] text-slate-500">খুচরা ক্রেতা, পাইকারি পার্টি, করপোরেট ও ডিলার</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGenericModal('customer_type', 'নতুন কাস্টমার টাইপ যোগ করুন')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন কাস্টমার টাইপ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {customerTypesList.map((ct) => (
                  <div key={ct.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{ct.name}</div>
                      {ct.discountPercent !== undefined && ct.discountPercent > 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold">{ct.discountPercent}% প্রিভিলেজ ডিসকাউন্ট</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGenericModal('customer_type', 'কাস্টমার টাইপ এডিট', ct)}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCustomerType(ct.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5E. SUPPLIER TYPES */}
          {financeMasterTab === 'supplierTypes' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">সাপ্লায়ার ধরন মাস্টার (Supplier Types)</h4>
                  <p className="text-[11px] text-slate-500">ম্যানুফ্যাকচারার, আমদানিকারক ও লোকাল আড়তদার</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGenericModal('supplier_type', 'নতুন সাপ্লায়ার টাইপ যোগ করুন')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন সাপ্লায়ার টাইপ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {supplierTypesList.map((st) => (
                  <div key={st.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">{st.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGenericModal('supplier_type', 'সাপ্লায়ার টাইপ এডিট', st)}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSupplierType(st.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5F. SALES TYPES */}
          {financeMasterTab === 'salesTypes' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">বিক্রয় চালান ধরন মাস্টার (Sales Types)</h4>
                  <p className="text-[11px] text-slate-500">নগদ বিক্রয়, বাকি বিক্রয়, কাউন্টার পিওএস ও অনলাইন অর্ডার</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGenericModal('sales_type', 'নতুন সেলস টাইপ যোগ করুন')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন সেলস টাইপ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {salesTypesList.map((slt) => (
                  <div key={slt.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">{slt.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGenericModal('sales_type', 'সেলস টাইপ এডিট', slt)}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSalesType(slt.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5G. PURCHASE TYPES */}
          {financeMasterTab === 'purchaseTypes' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">ক্রয় বিল ধরন মাস্টার (Purchase Types)</h4>
                  <p className="text-[11px] text-slate-500">নগদ ক্রয়, বাকিতে বিল ও কাঁচামাল আমদানি</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGenericModal('purchase_type', 'নতুন ক্রয় টাইপ যোগ করুন')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন ক্রয় টাইপ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {purchaseTypesList.map((prt) => (
                  <div key={prt.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">{prt.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGenericModal('purchase_type', 'ক্রয় টাইপ এডিট', prt)}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePurchaseType(prt.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: BRANCH MODAL */}
      {/* ======================================================== */}
      {branchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveBranch} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-sm text-slate-900">
                {editingBranch ? 'শাখা তথ্য পরিবর্তন' : 'নতুন শাখা যুক্ত করুন'}
              </h4>
              <button type="button" onClick={() => setBranchModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শাখার নাম *</label>
                <input
                  type="text"
                  required
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  placeholder="যেমন: মতিঝিল করপোরেট আউটলেট"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শাখা কোড</label>
                <input
                  type="text"
                  value={branchForm.code}
                  onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                  placeholder="MOT-03"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা / লোকেশন</label>
                <input
                  type="text"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  placeholder="দোকান নং ৫, বাণিজ্যিক এলাকা, ঢাকা"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">যোগাযোগ ফোন</label>
                <input
                  type="tel"
                  value={branchForm.phone}
                  onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                  placeholder="+880 17XXXXXXXX"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="branchDefault"
                  checked={branchForm.isDefault}
                  onChange={(e) => setBranchForm({ ...branchForm, isDefault: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="branchDefault" className="text-xs font-bold text-slate-700 cursor-pointer">
                  প্রধান শাখা হিসেবে সেট করুন (Default Main Branch)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBranchModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: BRAND MODAL */}
      {/* ======================================================== */}
      {brandModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveBrandSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-sm text-slate-900">
                {editingBrand ? 'ব্র্যান্ড এডিট করুন' : 'নতুন ব্র্যান্ড যুক্ত করুন'}
              </h4>
              <button type="button" onClick={() => setBrandModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ব্র্যান্ডের নাম *</label>
                <input
                  type="text"
                  required
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  placeholder="যেমন: রূপচাঁদা / তীর / প্রাণ"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ব্র্যান্ড কোড (Code / Prefix)</label>
                <input
                  type="text"
                  value={brandForm.code}
                  onChange={(e) => setBrandForm({ ...brandForm, code: e.target.value })}
                  placeholder="RUP"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ (Description)</label>
                <input
                  type="text"
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                  placeholder="প্রিমিয়াম কোয়ালিটি ভোগ্যপণ্য..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBrandModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: CATEGORY MODAL */}
      {/* ======================================================== */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveCatSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-sm text-slate-900">
                {editingCat ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}
              </h4>
              <button type="button" onClick={() => setCatModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরির নাম *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="যেমন: চাল ও খাদ্যশস্য"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি কোড (Code)</label>
                <input
                  type="text"
                  value={catForm.code}
                  onChange={(e) => setCatForm({ ...catForm, code: e.target.value })}
                  placeholder="RICE"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ</label>
                <input
                  type="text"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="খাদ্যশস্য ও ডাল সামগ্রী..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              {/* Subcategories tag input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সাব-ক্যাটাগরি ট্যাগসমূহ (Subcategories)</label>
                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    type="text"
                    placeholder="সাব-ক্যাটাগরি লিখে যোগ করুন..."
                    value={subcatTagInput}
                    onChange={(e) => setSubcatTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcatTag();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcatTag}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    যোগ
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {catForm.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[11px] font-bold"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubcatTag(sub)}
                        className="text-amber-700 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCatModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: UNIT MODAL */}
      {/* ======================================================== */}
      {unitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveUnitSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-sm text-slate-900">
                {editingUnit ? 'পরিমাপ একক এডিট' : 'নতুন পরিমাপ একক তৈরি'}
              </h4>
              <button type="button" onClick={() => setUnitModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">এককের নাম *</label>
                <input
                  type="text"
                  required
                  value={unitForm.name}
                  onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })}
                  placeholder="যেমন: কেজি (kg) / লিটার (ltr)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষিপ্ত কোড *</label>
                <input
                  type="text"
                  required
                  value={unitForm.code}
                  onChange={(e) => setUnitForm({ ...unitForm, code: e.target.value.toLowerCase() })}
                  placeholder="kg / ltr / pcs / box"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ</label>
                <input
                  type="text"
                  value={unitForm.description}
                  onChange={(e) => setUnitForm({ ...unitForm, description: e.target.value })}
                  placeholder="ওজন বা আয়তন পরিমাপ..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUnitModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: GENERIC MASTER ITEM MODAL */}
      {/* ======================================================== */}
      {genericModalOpen && genericModalConfig && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveGenericSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-sm text-slate-900">{genericModalConfig.title}</h4>
              <button type="button" onClick={() => setGenericModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নাম / শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={genericNameInput}
                  onChange={(e) => setGenericNameInput(e.target.value)}
                  placeholder="নাম লিখুন..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              {(genericModalConfig.type === 'tax_type' ||
                genericModalConfig.type === 'customer_type' ||
                genericModalConfig.type === 'product_type' ||
                genericModalConfig.type === 'price_type' ||
                genericModalConfig.type === 'discount_type') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {genericModalConfig.type === 'tax_type'
                      ? 'ট্যাক্স হার % (Rate)'
                      : genericModalConfig.type === 'customer_type'
                      ? 'স্পেশাল ডিসকাউন্ট %'
                      : genericModalConfig.type === 'discount_type'
                      ? 'ধরন (percentage / fixed)'
                      : 'কোড বা ভ্যালু'}
                  </label>
                  <input
                    type="text"
                    value={genericExtraInput}
                    onChange={(e) => setGenericExtraInput(e.target.value)}
                    placeholder="মান লিখুন..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setGenericModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: SAFETY USAGE CHECK & DEACTIVATION CONFIRMATION */}
      {/* ======================================================== */}
      {deleteModal && deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">ডাটা সুরক্ষা ও ব্যবহার সতর্কতা</h4>
                <p className="text-xs text-slate-500">পুরোনো বিক্রয় বা পণ্যের হিসাব অক্ষত রাখুন</p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
              <p>
                আপনি <strong>'{deleteModal.name}'</strong> মুছে ফেলতে চাচ্ছেন। কিন্তু এটি বর্তমানে{' '}
                <strong className="text-rose-700 underline">{deleteModal.usageCount} টি পণ্যে</strong> ব্যবহৃত হচ্ছে।
              </p>
              <p className="text-[11px] text-slate-600">
                <strong>পরামর্শ:</strong> এটি সরাসরি ডিলিট করলে পুরোনো ইনভয়েস বা পণ্যের তথ্যে গরমিল হতে পারে। আপনি এটি{' '}
                <strong>'নিষ্ক্রিয়/হাইড (Inactive)'</strong> করে রাখতে পারেন, যাতে ভবিষ্যতে নতুন পণ্যে এটি না আসে কিন্তু পুরোনো সব হিসাব সুরক্ষিত থাকে।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
              >
                বাতিল করুন
              </button>

              <button
                type="button"
                onClick={deleteModal.onDeactivate}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>নিষ্ক্রিয় / হাইড করুন (সুপারিশকৃত)</span>
              </button>

              <button
                type="button"
                onClick={deleteModal.onConfirmDelete}
                className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                স্থায়ীভাবে মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
