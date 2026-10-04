import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, UnitType } from '../types';
import {
  PackagePlus,
  Barcode,
  X,
  Tag,
  DollarSign,
  Boxes,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface QuickAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  scannedBarcode: string;
  onProductCreatedAndAdded: (product: Product) => void;
}

export const QuickAddProductModal: React.FC<QuickAddProductModalProps> = ({
  isOpen,
  onClose,
  scannedBarcode,
  onProductCreatedAndAdded,
}) => {
  const { products, saveProduct, categoriesList, brandsList, unitsList, showToast } = useApp();

  const [barcode, setBarcode] = useState<string>('');
  const [sku, setSku] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>(categoriesList[0]?.name || 'চাল ও খাদ্যশস্য');
  const [brand, setBrand] = useState<string>('');
  const [unit, setUnit] = useState<UnitType>('pcs');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [openingStock, setOpeningStock] = useState<number>(10);
  const [minStock, setMinStock] = useState<number>(2);

  useEffect(() => {
    if (isOpen) {
      const cleanBarcode = scannedBarcode.trim();
      setBarcode(cleanBarcode);
      setSku(cleanBarcode ? `SKU-${cleanBarcode.slice(-4)}` : `SKU-${Date.now().toString().slice(-4)}`);
      setName('');
      setPurchasePrice(0);
      setSalePrice(0);
      setOpeningStock(10);
      setMinStock(2);
      if (categoriesList.length > 0) {
        setCategory(categoriesList[0].name);
      }
    }
  }, [isOpen, scannedBarcode, categoriesList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('পণ্যের নাম লিখুন');
      return;
    }

    if (salePrice <= 0) {
      showToast('সঠিক বিক্রয় মূল্য নির্ধারণ করুন');
      return;
    }

    const now = new Date().toISOString();
    const newProduct: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      category: category.trim() || 'সাধারণ',
      brand: brand.trim() || undefined,
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      barcode: barcode.trim() || Date.now().toString(),
      unit,
      purchasePrice: Number(purchasePrice) || 0,
      salePrice: Number(salePrice) || 0,
      mrp: Number(salePrice) || 0,
      taxPercent: 0,
      discountPercent: 0,
      openingStock: Number(openingStock) || 0,
      minStock: Number(minStock) || 0,
      warehouse: 'Shop Floor',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    saveProduct(newProduct);
    showToast(`'${newProduct.name}' সফলভাবে সংরক্ষিত ও ইনভয়েসে যুক্ত হয়েছে!`);
    onProductCreatedAndAdded(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-emerald-600 text-white rounded-md tracking-wider">
                  New Barcode Detected
                </span>
                <h3 className="text-base font-black tracking-tight">নতুন পণ্য যোগ করুন (Add Product)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                বারকোড: <span className="text-emerald-400 font-bold">{barcode || 'N/A'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Strip */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            এই বারকোডটি প্রথমবার স্ক্যান করা হয়েছে। নিচের তথ্যগুলো পূরণ করে সেভ করলেই সরাসরি বিলে যোগ হবে।
          </span>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পণ্যের নাম (Product Name) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: মিনিকেট চাল ৫০ কেজি বা লাক্স সাবান ১০০ গ্রাম"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 font-bold text-xs outline-hidden"
            />
          </div>

          {/* Barcode & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                বারকোড (Barcode)
              </label>
              <div className="relative">
                <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono text-xs font-bold outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SKU কোড</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU-XXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-hidden font-bold"
              />
            </div>
          </div>

          {/* Category, Brand, Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-hidden"
              >
                {categoriesList.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ব্র্যান্ড (ঐচ্ছিক)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="ব্র্যান্ডের নাম"
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">একক (Unit)</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-hidden"
              >
                {unitsList.map((u) => (
                  <option key={u.id} value={u.code}>
                    {u.name} ({u.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Purchase Price & Sale Price */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ক্রয় মূল্য (Purchase Price ৳)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={purchasePrice || ''}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-800 mb-1">
                বিক্রয় মূল্য (Sale Price ৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="any"
                value={salePrice || ''}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-xl text-xs font-black text-emerald-700 outline-hidden"
              />
            </div>
          </div>

          {/* Opening Stock & Min Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                প্রারম্ভিক স্টক (Opening Stock)
              </label>
              <input
                type="number"
                min="0"
                value={openingStock}
                onChange={(e) => setOpeningStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কম স্টক সতর্কতা সীমা (Min Stock)
              </label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-hidden"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>সংরক্ষণ ও বিলে যোগ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
