import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanyProfile } from '../../types';
import { Building, Upload, Image, Trash2, RotateCcw, Check, Globe, Phone, Mail, MapPin } from 'lucide-react';

export const CompanyLogoSettingsPanel: React.FC = () => {
  const { companyProfile, updateCompanyProfile, showToast } = useApp();

  const [name, setName] = useState(companyProfile.name || '');
  const [tagline, setTagline] = useState(companyProfile.tagline || '');
  const [phone, setPhone] = useState(companyProfile.phone || '');
  const [email, setEmail] = useState(companyProfile.email || '');
  const [website, setWebsite] = useState(companyProfile.website || '');
  const [address, setAddress] = useState(companyProfile.address || '');
  const [ownerName, setOwnerName] = useState(companyProfile.ownerName || '');
  const [description, setDescription] = useState(companyProfile.description || '');
  const [vatNumber, setVatNumber] = useState(companyProfile.vatNumber || '');
  const [vatRate, setVatRate] = useState(companyProfile.vatRate || 0);
  const [currency, setCurrency] = useState(companyProfile.currency || '৳');
  const [logo, setLogo] = useState(companyProfile.logo || '');
  const [logoSize, setLogoSize] = useState<'small' | 'medium' | 'large'>(companyProfile.logoSize || 'medium');
  const [logoPosition, setLogoPosition] = useState<'left' | 'center' | 'right'>(companyProfile.logoPosition || 'left');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('লোগো ফাইলের সাইজ সর্বোচ্চ ২MB হতে পারে');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setLogo(base64);
        showToast('লোগো সফলভাবে আপলোড হয়েছে (সেভ বাটনে চাপ দিন)');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogo('');
    showToast('লোগো সরানো হয়েছে');
  };

  const handleRestoreDefaultLogo = () => {
    const defaultLogo = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23059669"/><text x="50" y="65" font-size="50" font-family="sans-serif" font-weight="900" fill="white" text-anchor="middle">B</text></svg>`;
    setLogo(defaultLogo);
    showToast('ডিফল্ট লোগো রিস্টোর করা হয়েছে');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CompanyProfile = {
      ...companyProfile,
      name,
      tagline,
      phone,
      email,
      website,
      address,
      ownerName,
      description,
      vatNumber,
      vatRate: Number(vatRate),
      currency,
      logo,
      logoSize,
      logoPosition,
    };
    updateCompanyProfile(updated);
    showToast('কোম্পানি প্রোফাইল ও লোগো সফলভাবে আপডেট হয়েছে');
  };

  const handleReset = () => {
    setName(companyProfile.name || '');
    setTagline(companyProfile.tagline || '');
    setPhone(companyProfile.phone || '');
    setEmail(companyProfile.email || '');
    setWebsite(companyProfile.website || '');
    setAddress(companyProfile.address || '');
    setOwnerName(companyProfile.ownerName || '');
    setDescription(companyProfile.description || '');
    setVatNumber(companyProfile.vatNumber || '');
    setVatRate(companyProfile.vatRate || 0);
    setCurrency(companyProfile.currency || '৳');
    setLogo(companyProfile.logo || '');
    setLogoSize(companyProfile.logoSize || 'medium');
    setLogoPosition(companyProfile.logoPosition || 'left');
    showToast('পরিবর্তন বাতিল করা হয়েছে');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            <span>কোম্পানি প্রোফাইল ও ব্র্যান্ডিং কন্ট্রোল (Company Profile & Logo)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            কোম্পানির নাম, লোগো, যোগাযোগের ঠিকানা ও ব্যবসায়িক তথ্য পরিচালনা করুন (পুরো সফটওয়্যারে স্বয়ংক্রিয়ভাবে কার্যকর হবে)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            বাতিল (Cancel)
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>সেভ করুন (Save Changes)</span>
          </button>
        </div>
      </div>

      {/* 1. Logo Management Hub */}
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4">
        <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
          <Image className="w-4 h-4 text-emerald-600" />
          <span>লোগো ম্যানেজমেন্ট (Logo Management & Live Preview)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Logo Preview Area */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[140px] text-center shadow-2xs">
            {logo ? (
              <div
                className={`flex items-center justify-center ${
                  logoPosition === 'left' ? 'self-start' : logoPosition === 'right' ? 'self-end' : 'self-center'
                }`}
              >
                <img
                  src={logo}
                  alt="Company Logo"
                  className={`object-contain transition-all rounded-lg ${
                    logoSize === 'small' ? 'max-h-12 max-w-28' : logoSize === 'large' ? 'max-h-24 max-w-44' : 'max-h-16 max-w-36'
                  }`}
                />
              </div>
            ) : (
              <div className="text-slate-400 flex flex-col items-center gap-1.5">
                <Building className="w-8 h-8 stroke-[1.5]" />
                <span className="text-xs font-bold">কোনো লোগো নেই</span>
              </div>
            )}
            <span className="text-[10px] text-slate-400 font-mono mt-2">
              আকার: {logoSize.toUpperCase()} · পজিশন: {logoPosition.toUpperCase()}
            </span>
          </div>

          {/* Logo Controls */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>নতুন লোগো আপলোড (Upload Logo)</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>

              {logo && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>লোগো মুছুন (Remove)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRestoreDefaultLogo}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>ডিফল্ট লোগো</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">লোগো সাইজ (Logo Size)</label>
                <select
                  value={logoSize}
                  onChange={(e) => setLogoSize(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="small">Small (ছোট - Compact)</option>
                  <option value="medium">Medium (মাঝারি - Standard)</option>
                  <option value="large">Large (বড় - Highlighted)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">প্রিন্ট ও হেডার পজিশন (Position)</label>
                <select
                  value={logoPosition}
                  onChange={(e) => setLogoPosition(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="left">Left (বামে)</option>
                  <option value="center">Center (মাঝখানে)</option>
                  <option value="right">Right (ডানে)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Company Information Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            কোম্পানি / প্রতিষ্ঠানের নাম (Company Name) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="মেসার্স ভাই ভাই এন্টারপ্রাইজ"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">স্লোগান / ট্যাগলাইন (Tagline)</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
            placeholder="হোলসেল ও রিটেইল ট্রেডার্স এবং সাপ্লাইয়ার্স"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">মালিক / প্রোপ্রাইটরের নাম (Owner Name)</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
            placeholder="জনাব মোর্শেদ আলম"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল / ফোন নম্বর (Phone)</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              placeholder="+880 1711-234567"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা (Email)</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              placeholder="info@vaivaienterprise.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ওয়েবসাইট / অনলাইন লিংক (Website)</label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              placeholder="https://vaivaienterprise.com"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ ঠিকানা ও আউটলেট (Address)</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              placeholder="দোকান নং ১২, নিউ মার্কেট রোড, ঢাকা-১২০৫"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ভ্যাট / BIN নম্বর (BIN/VAT Number)</label>
          <input
            type="text"
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 font-mono"
            placeholder="BIN-12345678901"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ডিফল্ট ভ্যাট হার % (Default VAT %)</label>
          <input
            type="number"
            value={vatRate}
            onChange={(e) => setVatRate(Number(e.target.value))}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 font-mono"
            placeholder="5"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">ব্যবসার সংক্ষিপ্ত বিবরণ (Business Description)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 resize-none"
            placeholder="আমাদের প্রতিষ্ঠানে সুলভ মূল্যে পাইকারি ও খুচরা চাল, ডাল, তেল ও নিত্যপ্রয়োজনীয় ভোগ্যপণ্য সরবরাহ করা হয়।"
          />
        </div>
      </div>
    </form>
  );
};
