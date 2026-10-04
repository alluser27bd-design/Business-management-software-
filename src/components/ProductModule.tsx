import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, UnitType } from '../types';
import {
  Package,
  Plus,
  Search,
  Download,
  Printer,
  Edit,
  Trash2,
  Barcode,
  AlertTriangle,
  Boxes,
  Tag,
  Camera,
  Image as ImageIcon,
  ZoomIn,
  Sparkles,
} from 'lucide-react';
import { ImagePickerModal } from './ImagePickerModal';
import { BarcodeLabelPrintModal } from './BarcodeLabelPrintModal';
import { BarcodeScannerModal } from './BarcodeScannerModal';

export const ProductModule: React.FC = () => {
  const {
    t,
    products,
    saveProduct,
    deleteProduct,
    getProductStock,
    exportToCSV,
    showToast,
    categoriesList,
    brandsList,
    unitsList,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Barcode Label Print Modal
  const [barcodePrintItem, setBarcodePrintItem] = useState<Product | null>(null);
  const [isBatchBarcodeModalOpen, setIsBatchBarcodeModalOpen] = useState<boolean>(false);
  const [isBarcodeScanModalOpen, setIsBarcodeScanModalOpen] = useState<boolean>(false);

  // Form State
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>(categoriesList[0]?.name || 'চাল ও খাদ্যশস্য');
  const [subcategory, setSubcategory] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [sku, setSku] = useState<string>('');
  const [barcode, setBarcode] = useState<string>('');
  const [unit, setUnit] = useState<UnitType>('pcs');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [mrp, setMrp] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [openingStock, setOpeningStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(5);
  const [warehouse, setWarehouse] = useState<string>('Main Warehouse');
  const [variantSize, setVariantSize] = useState<string>('');
  const [variantColor, setVariantColor] = useState<string>('');
  const [batchNo, setBatchNo] = useState<string>('');
  const [expDate, setExpDate] = useState<string>('');
  const [isRawMaterial, setIsRawMaterial] = useState<boolean>(false);

  // Active subcategories based on chosen category
  const currentCatObj = categoriesList.find((c) => c.name === category);
  const availableSubcategories = currentCatObj?.subcategories || [];

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    categoriesList.filter((c) => c.isActive).forEach((c) => set.add(c.name));
    products.filter((p) => !p.deletedAt).forEach((p) => set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [products, categoriesList]);

  const filteredProducts = products.filter((p) => {
    if (p.deletedAt) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setPhoto(undefined);
    setName('');
    setCategory('মুদি সামগ্রী');
    setSubcategory('');
    setBrand('');
    const randomSku = `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    setSku(randomSku);
    setBarcode(`890${Math.floor(100000000 + Math.random() * 900000000)}`);
    setUnit('pcs');
    setPurchasePrice(0);
    setSalePrice(0);
    setMrp(0);
    setTaxPercent(0);
    setDiscountPercent(0);
    setOpeningStock(0);
    setMinStock(5);
    setWarehouse('Main Warehouse');
    setVariantSize('');
    setVariantColor('');
    setBatchNo('');
    setExpDate('');
    setIsRawMaterial(false);
    setIsModalOpen(true);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setPhoto(p.photo);
    setName(p.name);
    setCategory(p.category);
    setSubcategory(p.subcategory || '');
    setBrand(p.brand || '');
    setSku(p.sku);
    setBarcode(p.barcode);
    setUnit(p.unit);
    setPurchasePrice(p.purchasePrice);
    setSalePrice(p.salePrice);
    setMrp(p.mrp);
    setTaxPercent(p.taxPercent || 0);
    setDiscountPercent(p.discountPercent || 0);
    setOpeningStock(p.openingStock);
    setMinStock(p.minStock);
    setWarehouse(p.warehouse);
    setVariantSize(p.variant?.size || '');
    setVariantColor(p.variant?.color || '');
    setBatchNo(p.batchNo || '');
    setExpDate(p.expDate || '');
    setIsRawMaterial(p.isRawMaterial || false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('পণ্যের নাম লিখুন');
      return;
    }

    const payload: Product = {
      id: editingProduct ? editingProduct.id : `PROD-${Date.now().toString().slice(-4)}`,
      name,
      category,
      subcategory,
      brand,
      sku,
      barcode: barcode || `BC-${Date.now()}`,
      unit,
      purchasePrice: Number(purchasePrice),
      salePrice: Number(salePrice),
      mrp: Number(mrp) || Number(salePrice),
      taxPercent: Number(taxPercent),
      discountPercent: Number(discountPercent),
      openingStock: Number(openingStock),
      minStock: Number(minStock),
      warehouse,
      photo,
      variant: variantSize || variantColor ? { size: variantSize, color: variantColor } : undefined,
      batchNo,
      expDate,
      isRawMaterial,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    saveProduct(payload);
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Product ID', 'Name', 'Category', 'Barcode', 'Unit', 'Purchase Price', 'Sale Price', 'Current Stock', 'Min Stock'];
    const rows = filteredProducts.map((p) => {
      const { currentStock } = getProductStock(p.id);
      return [p.id, p.name, p.category, p.barcode, p.unit, p.purchasePrice, p.salePrice, currentStock, p.minStock];
    });
    exportToCSV('Product_Catalog_Stock', headers, rows);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>পণ্য তালিকা ও ক্যাটালগ (Products & Items)</span>
          </h2>
          <p className="text-xs text-slate-500">
            পণ্য তৈরি, বারকোড তৈরি, ক্রয়-বিক্রয় মূল্য, ভ্যারিয়েন্ট ও স্টক সীমার নিয়ন্ত্রণ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBarcodeScanModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
            title="ক্যামেরা বা গান দিয়ে বারকোড স্ক্যান করুন"
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>বারকোড স্ক্যান</span>
          </button>
          <button
            onClick={() => setIsBatchBarcodeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            title="সকল পণ্যের বারকোড স্টিকার প্রিন্ট করুন"
          >
            <Barcode className="w-3.5 h-3.5 text-emerald-600" />
            <span>বারকোড লেবেল প্রিন্টার</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.excel}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addProduct}</span>
          </button>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'সকল পণ্য' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="পণ্য, বারকোড বা SKU খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">পণ্য নাম ও কোড</th>
                <th className="py-3 px-3">ক্যাটাগরি ও ব্র্যান্ড</th>
                <th className="py-3 px-3">বারকোড</th>
                <th className="py-3 px-3 text-right">ক্রয় মূল্য</th>
                <th className="py-3 px-3 text-right">বিক্রয় মূল্য</th>
                <th className="py-3 px-3 text-center">বর্তমান স্টক</th>
                <th className="py-3 px-3 text-center">স্টক অবস্থা</th>
                <th className="py-3 px-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    কোনো পণ্য পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const { currentStock } = getProductStock(prod.id);
                  const isLow = currentStock <= prod.minStock && currentStock > 0;
                  const isOut = currentStock <= 0;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          {prod.photo ? (
                            <img
                              src={prod.photo}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                              <Package className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">{prod.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              SKU: {prod.sku} {prod.isRawMaterial && '· [কাঁচামাল]'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium">{prod.category}</div>
                        {prod.brand && <div className="text-[10px] text-slate-400">{prod.brand}</div>}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{prod.barcode}</td>
                      <td className="py-3 px-3 text-right font-medium text-slate-600">
                        ৳{prod.purchasePrice}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        ৳{prod.salePrice}
                      </td>
                      <td className="py-3 px-3 text-center font-black">
                        <span className={isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-900'}>
                          {currentStock} {prod.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold ${
                            isOut
                              ? 'text-red-600'
                              : isLow
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {isOut ? 'স্টক শেষ' : isLow ? 'কম স্টক' : 'পর্যাপ্ত'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setBarcodePrintItem(prod)}
                            title="বারকোড লেবেল ও স্টিকার প্রিন্ট"
                            className="px-2 py-1 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer text-xs font-bold"
                          >
                            <Barcode className="w-3.5 h-3.5 text-emerald-600" />
                            <span>বারকোড</span>
                          </button>
                          <button
                            onClick={() => handleEdit(prod)}
                            title="Edit"
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(t.confirmDelete)) {
                                deleteProduct(prod.id, true);
                              }
                            }}
                            title="Delete"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Barcode Label Modal */}
      {barcodePrintItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 p-5 text-center">
            <h3 className="text-sm font-bold text-slate-900 mb-1">বারকোড স্টিকার প্রিন্ট প্রিভিউ</h3>
            <p className="text-xs text-slate-500 mb-4">{barcodePrintItem.name}</p>

            {/* Simulated Label Sticker */}
            <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl bg-slate-50 space-y-2 mb-4">
              <div className="font-bold text-xs text-slate-900">{barcodePrintItem.name}</div>
              <div className="font-mono text-xl tracking-widest font-black text-slate-800">
                |||| || | |||| |||
              </div>
              <div className="font-mono text-xs font-bold text-slate-600">{barcodePrintItem.barcode}</div>
              <div className="text-sm font-black text-emerald-700">MRP: ৳{barcodePrintItem.salePrice}</div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setBarcodePrintItem(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  window.print();
                  setBarcodePrintItem(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>স্টিকার প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingProduct ? 'পণ্য তথ্য সম্পাদনা (Edit Product)' : 'নতুন পণ্য যুক্ত করুন (Add New Product)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
              {/* Product Photo Area - Requirement 6 */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200/90 rounded-xl">
                <div
                  onClick={() => setIsPhotoPickerOpen(true)}
                  className="relative w-20 h-20 rounded-xl bg-white border-2 border-dashed border-slate-300 hover:border-emerald-500 overflow-hidden flex flex-col items-center justify-center cursor-pointer group shadow-2xs transition-all shrink-0"
                  title="পণ্যের ছবি যোগ বা পরিবর্তন করুন"
                >
                  {photo ? (
                    <>
                      <img src={photo} alt="Product" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                        পরিবর্তন
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 text-center px-1">
                        ছবি যোগ
                      </span>
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">পণ্যের ছবি (Product Photo)</span>
                    {photo && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                        ✓ ছবি সংরক্ষিত
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ফটো এরিয়াতে চাপ দিয়ে গ্যালারি থেকে ছবি নিন অথবা সরাসরি মোবাইল/ওয়েবক্যাম ক্যামেরা দিয়ে ছবি তুলুন
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotoPickerOpen(true)}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">পণ্যের পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: সয়াবিন তেল ৫ লিটার বা মিনিকেট চাল ২৫ কেজি"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="তেল / চাল / পানীয় ইত্যাদি"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ব্র্যান্ড (Brand)</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="রূপচাঁদা / প্রাণ / তীর"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU কোড</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">বারকোড (Barcode)</label>
                    <button
                      type="button"
                      onClick={() => setIsBarcodeScanModalOpen(true)}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Barcode className="w-3 h-3" />
                      <span>ক্যামেরা স্ক্যান</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="স্ক্যান করুন বা অটো তৈরি হবে"
                      className="w-full pr-16 px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-mono focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsBarcodeScanModalOpen(true)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded cursor-pointer"
                    >
                      স্ক্যান
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">একক (Unit)</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitType)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  >
                    <option value="pcs">Pcs (পিস)</option>
                    <option value="kg">Kg (কেজি)</option>
                    <option value="gm">Gm (গ্রাম)</option>
                    <option value="ltr">Ltr (লিটার)</option>
                    <option value="bag">Bag (বস্তা)</option>
                    <option value="box">Box (বাক্স)</option>
                    <option value="carton">Carton (কার্টুন)</option>
                    <option value="meter">Meter (মিটার)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ওয়ারহাউস</label>
                  <select
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden"
                  >
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Shop Floor">Shop Floor</option>
                    <option value="Godown 1">Godown 1</option>
                  </select>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">মূল্য ও কর নির্ধারণ (Pricing & Tax)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">ক্রয় মূল্য (Cost) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">বিক্রয় মূল্য *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-emerald-500 rounded-lg outline-hidden font-bold text-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">MRP রেট</label>
                    <input
                      type="number"
                      value={mrp}
                      onChange={(e) => setMrp(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">ভ্যাট %</label>
                    <input
                      type="number"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Stock & Batch */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">স্টক ও মেয়াদ ট্র্যাকিং (Stock & Expiry)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">ওপেনিং স্টক</label>
                    <input
                      type="number"
                      value={openingStock}
                      onChange={(e) => setOpeningStock(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">মিনিমাম স্টক অ্যালার্ট</label>
                    <input
                      type="number"
                      value={minStock}
                      onChange={(e) => setMinStock(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">ব্যাচ নং (Batch)</label>
                    <input
                      type="text"
                      value={batchNo}
                      onChange={(e) => setBatchNo(e.target.value)}
                      placeholder="B-2026"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">মেয়াদ উত্তীর্ণের তারিখ</label>
                    <input
                      type="date"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRawMaterial"
                    checked={isRawMaterial}
                    onChange={(e) => setIsRawMaterial(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-sm"
                  />
                  <label htmlFor="isRawMaterial" className="text-slate-700 font-medium">
                    এটি উৎপাদন কারখানার কাঁচামাল (Raw Material for Manufacturing)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Image Picker & Camera Modal - Requirement 6 */}
      <ImagePickerModal
        isOpen={isPhotoPickerOpen}
        onClose={() => setIsPhotoPickerOpen(false)}
        currentImage={photo}
        onImageSelected={(newImg) => setPhoto(newImg)}
        title="পণ্যের ছবি নির্বাচন ও ক্যামেরা"
      />

      {/* Product Barcode Label Generator & Print Modal */}
      {(barcodePrintItem || isBatchBarcodeModalOpen) && (
        <BarcodeLabelPrintModal
          isOpen={!!barcodePrintItem || isBatchBarcodeModalOpen}
          onClose={() => {
            setBarcodePrintItem(null);
            setIsBatchBarcodeModalOpen(false);
          }}
          product={barcodePrintItem}
          allProducts={products.filter((p) => !p.deletedAt)}
        />
      )}
      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeScanModalOpen}
        onClose={() => setIsBarcodeScanModalOpen(false)}
        onProductScanned={(product, rawCode) => {
          if (isModalOpen) {
            // Inside Add/Edit Product Modal
            const codeToSet = rawCode || product?.barcode || '';
            setBarcode(codeToSet);
            if (!sku) {
              setSku(codeToSet ? `SKU-${codeToSet.slice(-4)}` : `SKU-${Date.now().toString().slice(-4)}`);
            }
            showToast(`বারকোড '${codeToSet}' সফলভাবে ইনপুটে যুক্ত হয়েছে`);
            setIsBarcodeScanModalOpen(false);
          } else {
            // In table view, search and open
            setSearchTerm(product.name || product.barcode);
            showToast(`পণ্য '${product.name}' পাওয়া গেছে`);
          }
        }}
        title="পণ্য বারকোড স্ক্যানার"
        subtitle="ক্যামেরা বা গান দিয়ে বারকোড স্ক্যান করুন"
      />
    </div>
  );
};
