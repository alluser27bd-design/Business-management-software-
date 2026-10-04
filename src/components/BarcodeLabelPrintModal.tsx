import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Barcode,
  Printer,
  X,
  Sparkles,
  Check,
  Building2,
} from 'lucide-react';

interface BarcodeLabelPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  allProducts?: Product[];
}

export const BarcodeLabelPrintModal: React.FC<BarcodeLabelPrintModalProps> = ({
  isOpen,
  onClose,
  product,
  allProducts = [],
}) => {
  const { companyProfile, showToast } = useApp();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(product);
  const [printCopies, setPrintCopies] = useState<number>(12);
  const [layoutStyle, setLayoutStyle] = useState<'thermal_50x30' | 'thermal_38x25' | 'a4_24' | 'a4_40'>('a4_24');

  // Label Customization options
  const [showCompanyName, setShowCompanyName] = useState<boolean>(true);
  const [showProductName, setShowProductName] = useState<boolean>(true);
  const [showPrice, setShowPrice] = useState<boolean>(true);
  const [showSku, setShowSku] = useState<boolean>(true);
  const [showBarcodeNumber, setShowBarcodeNumber] = useState<boolean>(true);

  React.useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    } else if (allProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(allProducts[0]);
    }
  }, [product, allProducts]);

  if (!isOpen || !selectedProduct) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate SVG 1D Barcode bars dynamically
  const renderBarcodeBars = (code: string) => {
    const cleanCode = code.replace(/[^0-9A-Za-z]/g, '') || '890123456789';
    // Generate deterministic bar widths based on char codes
    const bars: { width: number; isSpace: boolean }[] = [];
    for (let i = 0; i < cleanCode.length; i++) {
      const charVal = cleanCode.charCodeAt(i);
      const b1 = (charVal % 3) + 1;
      const s1 = ((charVal >> 1) % 2) + 1;
      const b2 = ((charVal >> 2) % 3) + 1;
      const s2 = ((charVal >> 3) % 2) + 1;
      bars.push({ width: b1, isSpace: false });
      bars.push({ width: s1, isSpace: true });
      bars.push({ width: b2, isSpace: false });
      bars.push({ width: s2, isSpace: true });
    }

    return (
      <div className="flex items-end justify-center h-10 px-1 py-0.5 overflow-hidden">
        {/* Guard bars start */}
        <div className="w-[1.5px] h-10 bg-black"></div>
        <div className="w-[1px] h-10 bg-transparent"></div>
        <div className="w-[1.5px] h-10 bg-black mr-1"></div>

        {bars.slice(0, 32).map((bar, idx) => (
          <div
            key={idx}
            style={{ width: `${bar.width * 1.4}px` }}
            className={`h-8 ${bar.isSpace ? 'bg-transparent' : 'bg-black'}`}
          />
        ))}

        {/* Guard bars end */}
        <div className="w-[1.5px] h-10 bg-black ml-1"></div>
        <div className="w-[1px] h-10 bg-transparent"></div>
        <div className="w-[1.5px] h-10 bg-black"></div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-emerald-600 text-white rounded-md tracking-wider">
                  Barcode Studio
                </span>
                <h3 className="text-base font-black tracking-tight">
                  পণ্যের বারকোড জেনারেটর ও স্টিকার প্রিন্টার
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedProduct.name} [{selectedProduct.barcode || selectedProduct.sku}] · 1D Barcode Stickers
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

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 flex flex-col lg:flex-row gap-6">
          {/* Controls */}
          <div className="w-full lg:w-80 space-y-4 no-print shrink-0">
            {allProducts.length > 1 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  পণ্য নির্বাচন করুন (Select Product)
                </label>
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const found = allProducts.find((p) => p.id === e.target.value);
                    if (found) setSelectedProduct(found);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden font-semibold"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (৳{p.salePrice}) [{p.barcode}]
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Layout Format */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                প্রিন্ট পেপার লেআউট (Paper Layout)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'a4_24', label: 'A4 শিট (২৪ স্টিকার)', desc: '3x8 গ্রিড' },
                  { id: 'a4_40', label: 'A4 শিট (৪০ স্টিকার)', desc: '4x10 গ্রিড' },
                  { id: 'thermal_50x30', label: 'থার্মাল 50x30mm', desc: 'সিঙ্গেল স্টিকার' },
                  { id: 'thermal_38x25', label: 'থার্মাল 38x25mm', desc: 'কমপ্যাক্ট লেবেল' },
                ].map((ly) => (
                  <button
                    key={ly.id}
                    onClick={() => setLayoutStyle(ly.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      layoutStyle === ly.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{ly.label}</div>
                    <div className="text-[10px] text-slate-500">{ly.desc}</div>
                  </button>
                ))}
              </div>

              {/* Number of Copies */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোট প্রিন্ট কপি সংখ্যা (Copies)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 6, 12, 24, 40].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPrintCopies(num)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        printCopies === num
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={printCopies}
                    onChange={(e) => setPrintCopies(Math.max(1, Number(e.target.value)))}
                    className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Label Elements Checklist */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                স্টিকারে কী কী তথ্য থাকবে (Label Content)
              </label>
              <div className="space-y-1.5 text-xs text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={showCompanyName}
                    onChange={(e) => setShowCompanyName(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded"
                  />
                  <span>কোম্পানি নাম ({companyProfile.name.split('(')[0]})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={showProductName}
                    onChange={(e) => setShowProductName(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded"
                  />
                  <span>পণ্যের নাম ({selectedProduct.name})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={showPrice}
                    onChange={(e) => setShowPrice(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded"
                  />
                  <span>বিক্রয় মূল্য (৳{selectedProduct.salePrice})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={showSku}
                    onChange={(e) => setShowSku(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded"
                  />
                  <span>SKU কোড ({selectedProduct.sku})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={showBarcodeNumber}
                    onChange={(e) => setShowBarcodeNumber(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded"
                  />
                  <span>বারকোড সংখ্যা ({selectedProduct.barcode})</span>
                </label>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>বারকোড স্টিকার প্রিন্ট করুন</span>
            </button>
          </div>

          {/* Right Label Print Preview */}
          <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 no-print">
              <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>লাইভ বারকোড প্রিভিউ ({printCopies} টি স্টিকার)</span>
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {layoutStyle === 'a4_24'
                  ? 'A4 Page (3x8)'
                  : layoutStyle === 'a4_40'
                  ? 'A4 Page (4x10)'
                  : 'Thermal Label'}
              </span>
            </div>

            <div
              className={`print-barcode-container grid gap-2.5 ${
                layoutStyle === 'a4_40'
                  ? 'grid-cols-2 sm:grid-cols-4'
                  : layoutStyle === 'a4_24'
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {Array.from({ length: printCopies }).map((_, i) => (
                <div
                  key={i}
                  className="p-3 bg-white border border-slate-300 rounded-2xl flex flex-col items-center justify-between text-center shadow-2xs min-h-[130px]"
                >
                  {showCompanyName && (
                    <div className="text-[10px] font-black uppercase tracking-tight text-slate-700 truncate w-full">
                      {companyProfile.name.split('(')[0]}
                    </div>
                  )}

                  {showProductName && (
                    <div className="text-[11px] font-extrabold text-slate-900 leading-tight truncate w-full mt-0.5">
                      {selectedProduct.name}
                    </div>
                  )}

                  <div className="my-1.5 w-full flex flex-col items-center">
                    {renderBarcodeBars(selectedProduct.barcode || selectedProduct.sku)}
                    {showBarcodeNumber && (
                      <div className="text-[10px] font-mono tracking-widest text-slate-900 font-bold mt-0.5">
                        {selectedProduct.barcode || selectedProduct.sku}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] mt-0.5">
                    {showSku && (
                      <span className="font-mono text-slate-500 font-semibold">
                        {selectedProduct.sku}
                      </span>
                    )}
                    {showPrice && (
                      <span className="font-black text-emerald-800 font-mono text-[11px]">
                        ৳{selectedProduct.salePrice}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between no-print">
          <div className="text-xs text-slate-500">
            স্ট্যান্ডার্ড 1D EAN-13 / Code-128 বারকোড স্টিকার প্রিন্ট ফরম্যাট।
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
