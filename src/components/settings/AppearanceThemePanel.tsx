import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeSettings, PrimaryColorTheme, ThemeMode, TextSize, BorderRadiusOption } from '../../types';
import { Palette, Sun, Moon, Laptop, Type, Check, Sparkles, Layout, Box } from 'lucide-react';

export const AppearanceThemePanel: React.FC = () => {
  const { themeSettings, updateThemeSettings, setTextSize: setGlobalTextSize, textSize: globalTextSize, showToast } = useApp();

  const [mode, setMode] = useState<ThemeMode>(themeSettings.mode || 'light');
  const [primaryColor, setPrimaryColor] = useState<PrimaryColorTheme>(themeSettings.primaryColor || 'emerald');
  const [textSize, setTextSizeState] = useState<TextSize>(globalTextSize || themeSettings.textSize || 'medium');
  const [borderRadius, setBorderRadius] = useState<BorderRadiusOption>(themeSettings.borderRadius || '2xl');
  const [sidebarStyle, setSidebarStyle] = useState<'default' | 'compact' | 'dark' | 'glass'>(themeSettings.sidebarStyle || 'default');
  const [headerStyle, setHeaderStyle] = useState<'default' | 'clean' | 'accent'>(themeSettings.headerStyle || 'default');
  const [cardStyle, setCardStyle] = useState<'bordered' | 'shadow' | 'flat'>(themeSettings.cardStyle || 'bordered');

  const colorPalette: { id: PrimaryColorTheme; name: string; hex: string; bgClass: string; badge: string }[] = [
    { id: 'emerald', name: 'Emerald Green (স্ট্যান্ডার্ড)', hex: '#059669', bgClass: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { id: 'blue', name: 'Sapphire Blue (কর্পোরেট)', hex: '#2563eb', bgClass: 'bg-blue-600', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'indigo', name: 'Royal Indigo (প্রিমিয়াম)', hex: '#4f46e5', bgClass: 'bg-indigo-600', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { id: 'violet', name: 'Electric Violet (মডার্ন)', hex: '#7c3aed', bgClass: 'bg-violet-600', badge: 'bg-violet-50 text-violet-800 border-violet-200' },
    { id: 'rose', name: 'Crimson Rose (ভাইব্রেন্ট)', hex: '#e11d48', bgClass: 'bg-rose-600', badge: 'bg-rose-50 text-rose-800 border-rose-200' },
    { id: 'amber', name: 'Amber Gold (লাক্সারি)', hex: '#d97706', bgClass: 'bg-amber-600', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
    { id: 'slate', name: 'Midnight Slate (মিনিমাল)', hex: '#475569', bgClass: 'bg-slate-700', badge: 'bg-slate-100 text-slate-800 border-slate-300' },
  ];

  const textSizeOptions: { id: TextSize; label: string; px: string; desc: string }[] = [
    { id: 'small', label: 'Small (ছোট)', px: '13.5px', desc: 'কমপ্যাক্ট লেআউট, একসাথে অনেক তথ্য ও বড় টেবিল দেখতে সেরা' },
    { id: 'medium', label: 'Medium (মাঝারি)', px: '16px', desc: 'স্ট্যান্ডার্ড ব্যালেন্সড সাইজ, অফিস ও দৈনন্দিন ব্যবহারের জন্য আদর্শ' },
    { id: 'large', label: 'Large (বড়)', px: '18px', desc: 'চোখের আরামদায়ক, দ্রুত নজরে পড়ার জন্য চমৎকার' },
    { id: 'xl', label: 'Extra Large (অতিরিক্ত বড়)', px: '20.5px', desc: 'সর্বোচ্চ স্পষ্টতা, টাচস্ক্রিন ও সিনিয়র ব্যবহারকারীদের জন্য সবচেয়ে সহজ' },
  ];

  const handleTextSizeSelect = (size: TextSize) => {
    setTextSizeState(size);
    setGlobalTextSize(size);
    updateThemeSettings({ textSize: size });
  };

  const handleModeSelect = (newMode: ThemeMode) => {
    setMode(newMode);
    updateThemeSettings({ mode: newMode });
  };

  const handlePrimaryColorSelect = (color: PrimaryColorTheme) => {
    setPrimaryColor(color);
    updateThemeSettings({ primaryColor: color });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ThemeSettings = {
      ...themeSettings,
      mode,
      primaryColor,
      textSize,
      borderRadius,
      sidebarStyle,
      headerStyle,
      cardStyle,
    };
    updateThemeSettings(updated);
    setGlobalTextSize(textSize);
    showToast('থিম ও ডিজাইন সফলভাবে সেভ করা হয়েছে');
  };

  const handleReset = () => {
    const defaultMode = themeSettings.mode || 'light';
    const defaultColor = themeSettings.primaryColor || 'emerald';
    const defaultSize = themeSettings.textSize || 'medium';
    setMode(defaultMode);
    setPrimaryColor(defaultColor);
    setTextSizeState(defaultSize);
    setGlobalTextSize(defaultSize);
    setBorderRadius(themeSettings.borderRadius || '2xl');
    setSidebarStyle(themeSettings.sidebarStyle || 'default');
    setHeaderStyle(themeSettings.headerStyle || 'default');
    setCardStyle(themeSettings.cardStyle || 'bordered');
    showToast('ডিজাইন রিসেট করা হয়েছে');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-600" />
            <span>থিম, কালার ও ভিজ্যুয়াল অ্যাপিয়ারেন্স (Appearance & Theme)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            পুরো ERP সফটওয়্যারের কালার স্কিম, ফন্ট সাইজ, ডার্ক মোড ও কার্ডের স্টাইল লাইভ কাস্টমাইজ করুন
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>সেভ করুন</span>
          </button>
        </div>
      </div>

      {/* Live Preview Banner */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Live Appearance Preview</span>
          </div>
          <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full">
            {mode.toUpperCase()} · {primaryColor.toUpperCase()} · {textSize.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black ${
                primaryColor === 'blue'
                  ? 'bg-blue-600'
                  : primaryColor === 'indigo'
                  ? 'bg-indigo-600'
                  : primaryColor === 'violet'
                  ? 'bg-violet-600'
                  : primaryColor === 'rose'
                  ? 'bg-rose-600'
                  : primaryColor === 'amber'
                  ? 'bg-amber-600'
                  : primaryColor === 'slate'
                  ? 'bg-slate-700'
                  : 'bg-emerald-600'
              }`}
            >
              ৳
            </div>
            <div>
              <div className="text-[10px] text-slate-300">আজকের মোট বিক্রয়</div>
              <div className="text-sm font-black text-white font-mono">৳৭৪,৫০০</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-black">
              ✓
            </div>
            <div>
              <div className="text-[10px] text-slate-300">লাইভ সিঙ্ক স্ট্যাটাস</div>
              <div className="text-sm font-black text-emerald-400 font-mono">100% Active</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-300">নমুনা অ্যাকশন বাটন</div>
              <div className="text-xs font-bold text-white">POS Quick Sale</div>
            </div>
            <button
              type="button"
              className={`px-3 py-1 rounded-xl text-xs font-bold text-white shadow-xs ${
                primaryColor === 'blue'
                  ? 'bg-blue-600'
                  : primaryColor === 'indigo'
                  ? 'bg-indigo-600'
                  : primaryColor === 'violet'
                  ? 'bg-violet-600'
                  : primaryColor === 'rose'
                  ? 'bg-rose-600'
                  : primaryColor === 'amber'
                  ? 'bg-amber-600'
                  : primaryColor === 'slate'
                  ? 'bg-slate-700'
                  : 'bg-emerald-600'
              }`}
            >
              + বিক্রয়
            </button>
          </div>
        </div>
      </div>

      {/* 1. Light / Dark / System Mode */}
      <div className="space-y-2">
        <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
          ১. ডিসপ্লে মোড (Display Mode)
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light Mode (উজ্জ্বল)', icon: Sun, desc: 'দিনের স্বাভাবিক কাজের জন্য সেরা' },
            { id: 'dark', label: 'Dark Mode (ডার্ক)', icon: Moon, desc: 'চোখের আরাম ও রাতের কাজের উপযোগী' },
            { id: 'system', label: 'System Auto', icon: Laptop, desc: 'ডিভাইস সেটিংস অনুযায়ী অটো অ্যাডজাস্ট' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = mode === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => handleModeSelect(item.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Primary Color Theme */}
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
          ২. প্রাইমারি ব্র্যান্ড কালার (Primary Brand Color Palette)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {colorPalette.map((col) => {
            const isSelected = primaryColor === col.id;
            return (
              <button
                type="button"
                key={col.id}
                onClick={() => handlePrimaryColorSelect(col.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white ${col.bgClass}`}>
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{col.name.split('(')[0]}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{col.hex}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Text Size */}
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
          <Type className="w-4 h-4 text-emerald-600" />
          <span>৩. ইউনিভার্সাল ফন্ট সাইজ (Universal Font Size)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {textSizeOptions.map((opt) => {
            const isSelected = textSize === opt.id;
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => handleTextSizeSelect(opt.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-extrabold text-slate-900">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                </div>
                <span className="text-xs font-mono font-bold bg-white px-2 py-1 rounded-lg border border-slate-200 shrink-0">
                  {opt.px}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Layout & Card Styles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">বর্ডার রেডিয়াস (Corner Radius)</label>
          <select
            value={borderRadius}
            onChange={(e) => {
              const r = e.target.value as any;
              setBorderRadius(r);
              updateThemeSettings({ borderRadius: r });
            }}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
          >
            <option value="none">None (স্কয়ার - তীক্ষ্ণ কোণা)</option>
            <option value="sm">Small (হালকা গোলাকার)</option>
            <option value="md">Medium (মাঝারি)</option>
            <option value="lg">Large (সুন্দর গোলাকার)</option>
            <option value="xl">XL (মডার্ন রাউন্ড)</option>
            <option value="2xl">2XL (সফট স্কুইর্কল - ডিফল্ট)</option>
            <option value="3xl">3XL (সর্বোচ্চ কার্ভ)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">সাইডবার লেআউট (Sidebar Style)</label>
          <select
            value={sidebarStyle}
            onChange={(e) => {
              const s = e.target.value as any;
              setSidebarStyle(s);
              updateThemeSettings({ sidebarStyle: s });
            }}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
          >
            <option value="default">Default (ফুল মেনু ক্যাটাগরি)</option>
            <option value="compact">Compact (স্লিম আইকন বার)</option>
            <option value="dark">Dark Slate Sidebar</option>
            <option value="glass">Modern Glass Effect</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">কার্ড ও বক্স স্টাইল (Card Style)</label>
          <select
            value={cardStyle}
            onChange={(e) => {
              const c = e.target.value as any;
              setCardStyle(c);
              updateThemeSettings({ cardStyle: c });
            }}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
          >
            <option value="bordered">Bordered (ক্লিন বর্ডার - ডিফল্ট)</option>
            <option value="shadow">Elevated Shadow (ছায়াযুক্ত)</option>
            <option value="flat">Flat Minimal (ফ্ল্যাট মিনিমাল)</option>
          </select>
        </div>
      </div>
    </form>
  );
};
