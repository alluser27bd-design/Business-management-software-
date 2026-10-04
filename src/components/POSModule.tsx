import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Invoice, InvoiceItem, PaymentMethod, Product } from '../types';
import {
  ShoppingCart,
  Barcode,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Clock,
  User,
  Edit2,
  X,
  Sparkles,
  Tag,
  Percent,
} from 'lucide-react';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { QuickAddProductModal } from './QuickAddProductModal';

export const POSModule: React.FC = () => {
  const {
    t,
    products,
    customers,
    getProductStock,
    saveInvoice,
    setPrintData,
    cashierShift,
    setCashierShift,
    showToast,
  } = useApp();

  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [searchProduct, setSearchProduct] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [mobileActiveView, setMobileActiveView] = useState<'products' | 'cart'>('products');
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState<boolean>(false);
  const [quickAddBarcode, setQuickAddBarcode] = useState<string>('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);

  // Edit Item in Cart state
  const [editingCartItem, setEditingCartItem] = useState<{
    index: number;
    item: InvoiceItem;
  } | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    products.filter((p) => !p.deletedAt).forEach((p) => set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  const filteredProducts = products.filter((p) => {
    if (p.deletedAt) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchProduct) {
      const q = searchProduct.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.barcode.includes(q) && !p.sku.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const addToCart = (product: Product) => {
    const { currentStock } = getProductStock(product.id);
    if (currentStock <= 0) {
      showToast(`সতর্কতা: ${product.name} স্টকে নেই! তবুও বিক্রয় করা হচ্ছে।`);
    }

    const idx = cart.findIndex((i) => i.productId === product.id);
    if (idx >= 0) {
      // Auto-increment quantity if scanned/added again
      const updated = [...cart];
      const newQty = updated[idx].qty + 1;
      const discount = updated[idx].discount || 0;
      updated[idx].qty = newQty;
      updated[idx].total = Math.max(0, newQty * updated[idx].rate - discount);
      setCart(updated);
      showToast(`'${product.name}' পরিমাণ বৃদ্ধি: ${newQty} ${product.unit}`);
    } else {
      const newItem: InvoiceItem = {
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        unit: product.unit,
        qty: 1,
        rate: product.salePrice,
        discount: 0,
        taxPercent: product.taxPercent || 0,
        total: product.salePrice,
        purchaseCost: product.purchasePrice,
      };
      setCart([...cart, newItem]);
      showToast(`'${product.name}' কার্টে যুক্ত হয়েছে`);
    }
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = barcodeInput.trim();
    if (!query) return;

    // Look up Product Master by exact barcode, SKU, ID, or partial match
    const prod = products.find(
      (p) =>
        !p.deletedAt &&
        (p.barcode === query ||
          p.sku.toLowerCase() === query.toLowerCase() ||
          p.id === query ||
          (p.barcode && p.barcode.includes(query)))
    );

    if (prod) {
      addToCart(prod);
      setBarcodeInput('');
    } else {
      setQuickAddBarcode(query);
      setIsQuickAddOpen(true);
      setBarcodeInput('');
    }
  };

  // Global Hardware Barcode Scanner Gun Listener
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is editing inside a modal or editing a text field
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
      if (isInput && target !== barcodeInputRef.current) {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 160) {
        buffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        const scannedCode = buffer.trim();
        if (scannedCode.length >= 2) {
          const prod = products.find(
            (p) =>
              !p.deletedAt &&
              (p.barcode === scannedCode ||
                p.sku.toLowerCase() === scannedCode.toLowerCase() ||
                p.id === scannedCode)
          );
          if (prod) {
            addToCart(prod);
            buffer = '';
            e.preventDefault();
          } else {
            setQuickAddBarcode(scannedCode);
            setIsQuickAddOpen(true);
            buffer = '';
            e.preventDefault();
          }
        }
        buffer = '';
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [products, cart]);

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            const discount = item.discount || 0;
            return {
              ...item,
              qty: newQty,
              total: Math.max(0, newQty * item.rate - discount),
            };
          }
          return item;
        })
        .filter(Boolean) as InvoiceItem[]
    );
  };

  const removeCartItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  // Handle Cart Item Manual Edit (Name, Rate, Qty, Discount)
  const handleSaveCartItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCartItem) return;

    const { index, item } = editingCartItem;
    const qty = Number(item.qty) || 1;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;
    const total = Math.max(0, qty * rate - discount);

    const updatedItem: InvoiceItem = {
      ...item,
      qty,
      rate,
      discount,
      total,
    };

    setCart((prev) => {
      const next = [...prev];
      next[index] = updatedItem;
      return next;
    });

    setEditingCartItem(null);
    showToast('কার্ট আইটেমের তথ্য ও হিসাব আপডেট হয়েছে');
  };

  // Totals Calculation (Automatic Sync with edited items)
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxAmount = ((subtotal - discountAmount) * taxPercent) / 100;
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);
  const changeDue = Math.max(0, cashGiven - grandTotal);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('কার্টে কোনো পণ্য নেই!');
      return;
    }

    const selectedCust = customers.find((c) => c.id === selectedCustomerId);
    const invoiceNo = `POS-${Date.now().toString().slice(-6)}`;
    const now = new Date();

    const invoicePayload: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNo,
      type: 'pos',
      customerId: selectedCustomerId || 'WALKING',
      customerName: selectedCust ? selectedCust.name : 'Walking Customer (কাউন্টার সেল)',
      customerPhone: selectedCust?.phone,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 8),
      items: cart,
      subtotal,
      discountAmount,
      taxAmount,
      additionalCharge: 0,
      grandTotal,
      paidAmount: paymentMethod === 'credit' ? 0 : grandTotal,
      dueAmount: paymentMethod === 'credit' ? grandTotal : 0,
      paymentMethod,
      warehouse: 'Shop Floor',
      salesmanName: cashierShift.cashierName,
      status: 'completed',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: null,
    };

    saveInvoice(invoicePayload);

    // Update Cashier Shift Sales
    setCashierShift((prev) => ({
      ...prev,
      totalSales: prev.totalSales + grandTotal,
    }));

    // Trigger Instant Thermal Print
    setPrintData({
      type: 'pos',
      data: invoicePayload,
    });

    showToast('বিক্রয় সফল হয়েছে এবং রসিদ তৈরি হয়েছে');
    setCart([]);
    setCashGiven(0);
    setDiscountPercent(0);
    setMobileActiveView('products');
  };

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col gap-3">
      {/* Barcode Scanner Live Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onProductScanned={(product) => addToCart(product)}
        title="পিওএস বারকোড স্ক্যানার"
        subtitle="ক্যামেরা বা বারকোড স্ক্যানার গান দিয়ে স্ক্যান করলে স্বয়ংক্রিয় শনাক্ত হয়ে কার্টে যোগ হবে"
      />

      {/* Quick Add Product Modal when Barcode is New */}
      <QuickAddProductModal
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setQuickAddBarcode('');
        }}
        scannedBarcode={quickAddBarcode}
        onProductCreatedAndAdded={(newProd) => {
          addToCart(newProd);
          setIsQuickAddOpen(false);
          setQuickAddBarcode('');
        }}
      />

      {/* Cart Item Edit Modal */}
      {editingCartItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h4 className="text-xs font-bold flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-emerald-400" />
                <span>পণ্য বিক্রয় বিবরণ সম্পাদনা (Edit Cart Item)</span>
              </h4>
              <button
                onClick={() => setEditingCartItem(null)}
                className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSaveCartItemEdit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">পণ্যের নাম (Product Name)</label>
                <input
                  type="text"
                  value={editingCartItem.item.productName}
                  onChange={(e) =>
                    setEditingCartItem({
                      ...editingCartItem,
                      item: { ...editingCartItem.item, productName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 font-bold outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">বিক্রয় দর (Rate ৳)</label>
                  <input
                    type="number"
                    step="any"
                    value={editingCartItem.item.rate}
                    onChange={(e) =>
                      setEditingCartItem({
                        ...editingCartItem,
                        item: { ...editingCartItem.item, rate: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 font-bold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">পরিমাণ (Quantity)</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={editingCartItem.item.qty}
                    onChange={(e) =>
                      setEditingCartItem({
                        ...editingCartItem,
                        item: { ...editingCartItem.item, qty: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 font-bold outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">আইটেম ছাড় (Discount ৳)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={editingCartItem.item.discount || 0}
                  onChange={(e) =>
                    setEditingCartItem({
                      ...editingCartItem,
                      item: { ...editingCartItem.item, discount: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 font-bold outline-hidden"
                />
              </div>

              {/* Real-time Calculated Item Total Preview */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-950 font-bold">
                <span>আইটেম মোট মূল্য:</span>
                <span className="text-sm font-black font-mono">
                  ৳
                  {Math.max(
                    0,
                    (Number(editingCartItem.item.qty) || 0) * (Number(editingCartItem.item.rate) || 0) -
                      (Number(editingCartItem.item.discount) || 0)
                  ).toLocaleString()}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCartItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POS Top Control Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 sm:p-3 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          {/* Barcode / SKU Scan Input */}
          <form onSubmit={handleBarcodeSubmit} className="relative flex-1">
            <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={barcodeInputRef}
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="বারকোড / SKU স্ক্যান বা লিখুন..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden font-mono"
            />
          </form>

          {/* Barcode Camera Scanner Trigger Button */}
          <button
            type="button"
            onClick={() => setIsBarcodeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0 animate-in zoom-in"
            title="লাইভ ক্যামেরা দিয়ে বারকোড স্ক্যান করুন"
          >
            <Barcode className="w-4 h-4 text-emerald-100" />
            <span className="hidden sm:inline">বারকোড স্ক্যানার</span>
          </button>
        </div>

        {/* Shift Badge & Mobile View Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>শিফট: {cashierShift.cashierName}</span>
          </div>

          <div className="lg:hidden flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setMobileActiveView('products')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                mobileActiveView === 'products' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              পণ্যসমূহ ({filteredProducts.length})
            </button>
            <button
              onClick={() => setMobileActiveView('cart')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors relative ${
                mobileActiveView === 'cart' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              কার্ট
              {cart.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px]">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* POS Main Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
        {/* Left Column: Products Showcase (7-8 cols) */}
        <div
          className={`lg:col-span-7 xl:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs ${
            mobileActiveView === 'products' ? 'flex h-full' : 'hidden lg:flex'
          }`}
        >
          {/* Category Filter Pills & Search */}
          <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'সকল ক্যাটাগরি' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-40 sm:w-48 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                placeholder="পণ্য সার্চ..."
                className="w-full pl-8 pr-2 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-hidden"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredProducts.map((prod) => {
              const { currentStock } = getProductStock(prod.id);
              const inCart = cart.find((i) => i.productId === prod.id);

              return (
                <div
                  key={prod.id}
                  onClick={() => addToCart(prod)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                    inCart
                      ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-200 shadow-2xs'
                      : 'border-slate-200 hover:border-emerald-300 hover:shadow-xs bg-white'
                  }`}
                >
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                      <span>{prod.sku}</span>
                      <span
                        className={`font-semibold ${
                          currentStock <= 0
                            ? 'text-red-500'
                            : currentStock <= prod.minStock
                            ? 'text-amber-500'
                            : 'text-slate-500'
                        }`}
                      >
                        {currentStock} {prod.unit}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mt-1">{prod.name}</h4>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900 font-mono">৳{prod.salePrice}</span>
                    {inCart ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {inCart.qty}
                      </span>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-emerald-600">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Cart & Cash Register Checkout (4-5 cols) */}
        <div
          className={`lg:col-span-5 xl:col-span-4 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md ${
            mobileActiveView === 'cart' ? 'flex h-full' : 'hidden lg:flex'
          }`}
        >
          {/* Cart Top Bar */}
          <div className="p-3 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mobileActiveView === 'cart' && (
                <button
                  onClick={() => setMobileActiveView('products')}
                  className="lg:hidden p-1 mr-0.5 text-slate-300 hover:text-white font-bold cursor-pointer"
                  title="পণ্য তালিকায় ফিরুন"
                >
                  ←
                </button>
              )}
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">POS রেজিস্টার ও বিলিং</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBarcodeModalOpen(true)}
                className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                title="বারকোড স্ক্যান করুন"
              >
                <Barcode className="w-3 h-3" />
                <span>বারকোড স্ক্যান</span>
              </button>
              <div className="text-[11px] text-slate-300">
                আইটেম: <span className="font-bold text-white">{cart.length}</span>
              </div>
            </div>
          </div>

          {/* Customer Select Bar */}
          <div className="p-2 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="flex-1 text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-lg outline-hidden"
            >
              <option value="">খুচরা ক্রেতা (Walking Customer)</option>
              {customers
                .filter((c) => !c.deletedAt)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
            </select>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs p-6 text-center">
                <ShoppingCart className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
                কার্ট খালি। বাম পাশের পণ্য ক্লিক করুন অথবা ক্যামেরা দিয়ে QR Code স্ক্যান করুন।
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={item.productId} className="py-2 px-1 flex items-center justify-between text-xs group">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 line-clamp-1">{item.productName}</span>
                      <button
                        onClick={() => setEditingCartItem({ index: idx, item: { ...item } })}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-emerald-600 transition-opacity cursor-pointer"
                        title="পণ্য ও মূল্য এডিট করুন"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      ৳{item.rate} × {item.qty} {item.discount ? `- ৳${item.discount}` : ''} ={' '}
                      <span className="font-black text-slate-900">৳{item.total}</span>
                    </div>
                  </div>

                  {/* Qty increment / decrement & Edit */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateCartQty(item.productId, -1)}
                      className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-slate-800 font-mono">{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(item.productId, 1)}
                      className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setEditingCartItem({ index: idx, item: { ...item } })}
                      className="p-1 text-slate-400 hover:text-emerald-600 ml-0.5 cursor-pointer"
                      title="এডিট করুন"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeCartItem(item.productId)}
                      className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout & Calculation Box */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>সাবটোটাল:</span>
              <span className="font-bold text-slate-800 font-mono">৳{subtotal.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500">ছাড় %:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-12 text-right font-bold outline-hidden font-mono"
                />
              </div>
              <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500">ভ্যাট %:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-12 text-right font-bold outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
              <span>সর্বমোট প্রদেয়:</span>
              <span className="text-emerald-600 font-mono">৳{grandTotal.toLocaleString()}</span>
            </div>

            {/* Payment Method Select */}
            <div className="grid grid-cols-3 gap-1 pt-1">
              {[
                { id: 'cash', label: 'নগদ', icon: Banknote },
                { id: 'bkash', label: 'বিকাশ', icon: Smartphone },
                { id: 'card', label: 'কার্ড', icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`py-1 px-1.5 rounded-lg border flex items-center justify-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
                      paymentMethod === m.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Received Cash Input */}
            {paymentMethod === 'cash' && (
              <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500">গৃহীত নগদ ৳:</span>
                <input
                  type="number"
                  value={cashGiven || ''}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                  placeholder="0"
                  className="w-24 text-right font-black outline-hidden text-slate-900 font-mono"
                />
              </div>
            )}

            {cashGiven > 0 && paymentMethod === 'cash' && (
              <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                <span>ফেরত দিন (Change):</span>
                <span className="font-bold text-blue-600 font-mono">৳{changeDue.toLocaleString()}</span>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>বিল সম্পন্ন ও রসিদ প্রিন্ট (৳{grandTotal.toLocaleString()})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
