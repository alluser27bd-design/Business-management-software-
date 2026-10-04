import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopIconMenuItem, TopIconMenuConfig, TopIconActionType, MenuLocation } from '../types';
import { getIconComponent, AVAILABLE_ICON_NAMES, COLOR_PALETTE } from '../utils/iconMap';
import {
  SlidersHorizontal,
  X,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  CheckCircle2,
  Sparkles,
  Layout,
  Layers,
  Move,
  Smartphone,
  Monitor,
  Tag,
  HelpCircle,
  GripVertical,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ExternalLink,
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  MoveDown,
  MoveUp,
} from 'lucide-react';

interface TopIconMenuCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopIconMenuCustomizerModal: React.FC<TopIconMenuCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
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
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'items' | 'layout' | 'presets'>('items');
  const [selectedLocationTab, setSelectedLocationTab] = useState<'all' | 'top' | 'bottom'>('top');

  // Edit / Add Modal State
  const [editingItem, setEditingItem] = useState<TopIconMenuItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formItem, setFormItem] = useState<Omit<TopIconMenuItem, 'id' | 'order'>>({
    label: '',
    subLabel: '',
    iconName: 'Sparkles',
    actionType: 'tab',
    target: 'pos',
    location: 'top',
    color: 'emerald',
    badgeType: 'none',
    badgeText: '',
    isVisible: true,
    showOnMobile: true,
    showLabelOnDesktop: true,
    tooltip: '',
  });

  const [iconSearch, setIconSearch] = useState('');

  // Drag & Drop tracking
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const items = topIconMenuConfig.items || [];
  const topItems = items.filter((i) => (i.location || 'top') === 'top').sort((a, b) => a.order - b.order);
  const bottomItems = items.filter((i) => i.location === 'bottom').sort((a, b) => a.order - b.order);

  const displayedItems =
    selectedLocationTab === 'top'
      ? topItems
      : selectedLocationTab === 'bottom'
      ? bottomItems
      : [...items].sort((a, b) => a.order - b.order);

  const handleOpenAddModal = (defaultLocation: MenuLocation = 'top') => {
    setEditingItem(null);
    setFormItem({
      label: '',
      subLabel: '',
      iconName: 'Sparkles',
      actionType: 'tab',
      target: 'pos',
      location: defaultLocation,
      color: defaultLocation === 'bottom' ? 'blue' : 'emerald',
      badgeType: 'none',
      badgeText: '',
      isVisible: true,
      showOnMobile: true,
      showLabelOnDesktop: true,
      tooltip: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: TopIconMenuItem) => {
    setEditingItem(item);
    setFormItem({
      label: item.label,
      subLabel: item.subLabel || '',
      iconName: item.iconName || 'Tag',
      actionType: item.actionType || 'tab',
      target: item.target || 'pos',
      location: item.location || 'top',
      color: item.color || 'emerald',
      badgeType: item.badgeType || 'none',
      badgeText: item.badgeText || '',
      isVisible: item.isVisible,
      showOnMobile: item.showOnMobile ?? true,
      showLabelOnDesktop: item.showLabelOnDesktop ?? true,
      tooltip: item.tooltip || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItem.label.trim()) {
      showToast('অনুগ্রহ করে আইকন মেনুর নাম / লেবেল দিন');
      return;
    }

    if (editingItem) {
      updateTopIconMenuItem(editingItem.id, formItem);
    } else {
      addTopIconMenuItem(formItem);
    }
    setIsAddModalOpen(false);
  };

  const applyPresetTemplate = (type: 'pos' | 'finance' | 'manager' | 'mobile_app' | 'minimal') => {
    let updatedItems: TopIconMenuItem[] = [];

    if (type === 'pos') {
      updatedItems = items.map((it) => {
        if (['btn-pos', 'btn-quick', 'btn-sale', 'btn-shift', 'btn-calculator'].includes(it.id)) {
          return { ...it, isVisible: true, showLabelOnDesktop: true, location: 'top' as MenuLocation };
        }
        if (['btm-dashboard', 'btm-pos', 'btm-sales', 'btm-more'].includes(it.id)) {
          return { ...it, isVisible: true, location: 'bottom' as MenuLocation };
        }
        if (['btn-sync', 'btn-role', 'btn-text'].includes(it.id)) {
          return { ...it, isVisible: true, showLabelOnDesktop: false, location: 'top' as MenuLocation };
        }
        return { ...it, isVisible: false };
      });
      updateTopIconMenuConfig({
        placement: 'top_navbar_right',
        spacing: 'standard',
        buttonStyle: 'pill_with_label',
        showBottomOnDesktop: true,
        bottomPlacement: 'fixed_bottom',
        items: updatedItems,
      });
      showToast('পিওএস এক্সপ্রেস প্রিসেট সক্রিয় হয়েছে');
    } else if (type === 'finance') {
      updatedItems = items.map((it) => {
        if (['btn-reports', 'btn-expenses', 'btn-sale', 'btn-purchase', 'btn-sync', 'btn-calculator'].includes(it.id)) {
          return { ...it, isVisible: true, showLabelOnDesktop: true, location: 'top' as MenuLocation };
        }
        if (['btm-dashboard', 'btm-sales', 'btm-reports', 'btm-more'].includes(it.id)) {
          return { ...it, isVisible: true, location: 'bottom' as MenuLocation };
        }
        return { ...it, isVisible: false };
      });
      updateTopIconMenuConfig({
        placement: 'top_navbar_right',
        spacing: 'standard',
        buttonStyle: 'rounded_icon_button',
        showBottomOnDesktop: true,
        items: updatedItems,
      });
      showToast('অ্যাকাউন্টিং ও ফিন্যান্স প্রিসেট সক্রিয় হয়েছে');
    } else if (type === 'mobile_app') {
      updatedItems = items.map((it) => {
        if (it.location === 'bottom') return { ...it, isVisible: true };
        if (['btn-sync', 'btn-quick', 'btn-role'].includes(it.id)) return { ...it, isVisible: true };
        return { ...it, isVisible: false };
      });
      updateTopIconMenuConfig({
        placement: 'top_navbar_right',
        spacing: 'compact',
        showBottomOnDesktop: true,
        bottomPlacement: 'floating_dock',
        bottomButtonStyle: 'native_nav_tab',
        items: updatedItems,
      });
      showToast('মোবাইল অ্যাপ নেটিভ ফিল প্রিসেট সক্রিয় হয়েছে');
    } else if (type === 'manager') {
      updatedItems = items.map((it) => ({ ...it, isVisible: true }));
      updateTopIconMenuConfig({
        placement: 'sub_header_bar',
        spacing: 'compact',
        buttonStyle: 'compact_tile',
        showBottomOnDesktop: true,
        items: updatedItems,
      });
      showToast('ম্যানেজার ফুল স্যুট প্রিসেট সক্রিয় হয়েছে');
    } else if (type === 'minimal') {
      updatedItems = items.map((it) => {
        if (['btn-sync', 'btn-quick', 'btn-role'].includes(it.id)) {
          return { ...it, isVisible: true, showLabelOnDesktop: false };
        }
        if (['btm-dashboard', 'btm-pos', 'btm-more'].includes(it.id)) {
          return { ...it, isVisible: true };
        }
        return { ...it, isVisible: false };
      });
      updateTopIconMenuConfig({
        placement: 'top_navbar_right',
        spacing: 'compact',
        buttonStyle: 'rounded_icon_button',
        iconSize: 'small',
        showBottomOnDesktop: false,
        items: updatedItems,
      });
      showToast('মিনিমালিস্ট ক্লিন প্রিসেট সক্রিয় হয়েছে');
    }
  };

  const filteredIcons = AVAILABLE_ICON_NAMES.filter((n) =>
    n.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-emerald-600 text-white rounded-md tracking-wider">
                  Top & Down Control
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  টপ ও ডাউন আইকন মেনু ম্যানুয়াল কন্ট্রোল (Top & Down Icon Menu)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Top বা Down Menu থেকে আইকন Show/Hide, Add, Edit, Delete করুন এবং Top ↔ Down যেকোনো স্থানে স্থানান্তর করুন
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

        {/* Live Dual Preview Box: Top & Down Previews */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 text-white space-y-3">
          {/* Top Bar Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-slate-300">১. টপ মেনু বার প্রিভিউ (Top Menu Bar Preview):</span>
                <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                  {topItems.filter((i) => i.isVisible).length} Active
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Pos: {topIconMenuConfig.placement} · Spacing: {topIconMenuConfig.spacing}
              </span>
            </div>

            <div
              className={`p-2 bg-slate-900/90 rounded-2xl border border-slate-800/80 flex items-center flex-wrap ${
                topIconMenuConfig.alignment === 'start'
                  ? 'justify-start'
                  : topIconMenuConfig.alignment === 'center'
                  ? 'justify-center'
                  : topIconMenuConfig.alignment === 'between'
                  ? 'justify-between'
                  : 'justify-end'
              } ${
                topIconMenuConfig.spacing === 'compact'
                  ? 'gap-1'
                  : topIconMenuConfig.spacing === 'spacious'
                  ? 'gap-3'
                  : 'gap-1.5'
              }`}
            >
              {topItems
                .filter((item) => item.isVisible)
                .map((item) => {
                  const Icon = getIconComponent(item.iconName);
                  const palette = COLOR_PALETTE.find((c) => c.id === item.color) || COLOR_PALETTE[0];
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold select-none ${palette.bg}`}
                    >
                      {item.badgeType === 'dot' && (
                        <span className={`w-1.5 h-1.5 rounded-full ${palette.dot} animate-pulse`}></span>
                      )}
                      <Icon className="w-3.5 h-3.5" />
                      {item.showLabelOnDesktop && (
                        <span className="text-[11px] font-extrabold">{item.label}</span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Down / Bottom Bar Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold text-slate-300">২. ডাউন / বটম মেনু প্রিভিউ (Down/Bottom Menu Preview):</span>
                <span className="text-[10px] bg-slate-800 text-blue-400 px-2 py-0.5 rounded font-mono font-bold">
                  {bottomItems.filter((i) => i.isVisible).length} Active
                </span>
                {topIconMenuConfig.showBottomOnDesktop && (
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">
                    Desktop Active
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Style: {topIconMenuConfig.bottomButtonStyle}
              </span>
            </div>

            <div
              className={`p-2 bg-slate-900/90 rounded-2xl border border-slate-800/80 flex items-center ${
                topIconMenuConfig.bottomSpacing === 'compact'
                  ? 'justify-center gap-2'
                  : topIconMenuConfig.bottomSpacing === 'spacious'
                  ? 'justify-around gap-4'
                  : 'justify-around'
              }`}
            >
              {bottomItems
                .filter((item) => item.isVisible)
                .map((item) => {
                  const Icon = getIconComponent(item.iconName);
                  const palette = COLOR_PALETTE.find((c) => c.id === item.color) || COLOR_PALETTE[0];
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl border text-xs font-bold select-none ${palette.bg}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] leading-none mt-1">{item.label}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'items'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>১. আইকন তালিকা ও Top ↔ Down সাজান ({items.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'layout'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>২. পজিশন, অ্যালাইনমেন্ট ও স্পেসিং</span>
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'presets'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>৩. ওয়ান-ক্লিক প্রিসেট টেমপ্লেট</span>
          </button>
        </div>

        {/* Main Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* TAB 1: ITEMS MANAGEMENT */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              {/* Location Sub-Tabs Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                {/* Location Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setSelectedLocationTab('top')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedLocationTab === 'top'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>টপ মেনু বার ({topItems.length})</span>
                  </button>
                  <button
                    onClick={() => setSelectedLocationTab('bottom')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedLocationTab === 'bottom'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowDownCircle className="w-3.5 h-3.5" />
                    <span>ডাউন / বটম মেনু ({bottomItems.length})</span>
                  </button>
                  <button
                    onClick={() => setSelectedLocationTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedLocationTab === 'all'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    সকল মেনু ({items.length})
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleOpenAddModal(selectedLocationTab === 'bottom' ? 'bottom' : 'top')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {selectedLocationTab === 'bottom' ? 'নতুন ডাউন মেনু যোগ' : 'নতুন টপ মেনু যোগ'}
                    </span>
                  </button>
                  <button
                    onClick={resetTopIconMenuToDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    title="ফ্যাক্টরি ডিফল্ট মেনু ফিরিয়ে আনুন"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>ডিফল্ট রিসেট</span>
                  </button>
                </div>
              </div>

              {/* Draggable Items List */}
              <div className="space-y-2">
                {displayedItems.map((item, index) => {
                  const Icon = getIconComponent(item.iconName);
                  const palette = COLOR_PALETTE.find((c) => c.id === item.color) || COLOR_PALETTE[0];
                  const isTop = (item.location || 'top') === 'top';

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => setDraggedIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedIndex !== null && draggedIndex !== index) {
                          moveTopIconMenuItemToIndex(
                            draggedIndex,
                            index,
                            selectedLocationTab === 'all' ? undefined : selectedLocationTab
                          );
                          setDraggedIndex(null);
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        item.isVisible
                          ? 'bg-white border-slate-200/90 shadow-2xs hover:border-emerald-300'
                          : 'bg-slate-100/70 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Drag Handle */}
                        <div
                          className="text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing p-1"
                          title="ড্র্যাগ করে পজিশন সাজান"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Order Badge */}
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>

                        {/* Icon Preview */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${palette.bg}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Name, Location & Target Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {item.label}
                            </span>
                            {item.subLabel && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({item.subLabel})
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                                isTop ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {isTop ? '🔝 TOP' : '⬇️ DOWN'}
                            </span>
                            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] font-mono uppercase font-bold">
                              {item.actionType}: {item.target}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                            <span>আইকন: {item.iconName}</span>
                            <span>·</span>
                            <span>রং: {palette.label}</span>
                            <span>·</span>
                            <span>মোবাইল: {item.showOnMobile ? 'হ্যাঁ' : 'না'}</span>
                            <span>·</span>
                            <span>লেবেল: {item.showLabelOnDesktop ? 'দেখান' : 'শুধু আইকন'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Controls & Top ↔ Down Move Button */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Location Switcher Button: Move to Down or Move to Top */}
                        <button
                          onClick={() => moveTopIconItemLocation(item.id, isTop ? 'bottom' : 'top')}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                            isTop
                              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                          title={isTop ? 'ডাউন মেনুতে পাঠান (Move to Down Menu)' : 'টপ মেনুতে পাঠান (Move to Top Menu)'}
                        >
                          {isTop ? (
                            <>
                              <MoveDown className="w-3.5 h-3.5 text-blue-600" />
                              <span className="hidden sm:inline">ডাউনে নিন</span>
                            </>
                          ) : (
                            <>
                              <MoveUp className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden sm:inline">টপে নিন</span>
                            </>
                          )}
                        </button>

                        {/* Reorder Arrows */}
                        <button
                          disabled={index === 0}
                          onClick={() =>
                            reorderTopIconMenuItem(
                              item.id,
                              'up',
                              selectedLocationTab === 'all' ? undefined : selectedLocationTab
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="উপরে নিন"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === displayedItems.length - 1}
                          onClick={() =>
                            reorderTopIconMenuItem(
                              item.id,
                              'down',
                              selectedLocationTab === 'all' ? undefined : selectedLocationTab
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="নিচে নিন"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Visibility */}
                        <button
                          onClick={() => toggleTopIconMenuVisibility(item.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            item.isVisible
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                          }`}
                          title={item.isVisible ? 'হাইড করুন (Hide)' : 'দেখান (Show)'}
                        >
                          {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="এডিট / পরিবর্তন করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (window.confirm(`আপনি কি '${item.label}' মেনুটি মুছে ফেলতে চান?`)) {
                              deleteTopIconMenuItem(item.id);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LAYOUT & POSITIONING FOR BOTH TOP & DOWN */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              {/* TOP MENU BAR SETTINGS */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                    <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                    <span>টপ মেনু বার প্লেসমেন্ট ও পজিশন (Top Menu Settings)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">টপ মেনু কোথায় কীভাবে বসবে তা ঠিক করুন</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'top_navbar_right',
                      title: 'টপ হেডার বার (ডানপাশে)',
                      desc: 'ডিফল্ট নেভবারের ডানদিকের টুলস হিসেবে',
                    },
                    {
                      id: 'top_navbar_center',
                      title: 'টপ হেডার বার (মাঝখানে)',
                      desc: 'সার্চ বারের পাশে সেন্ট্রাল প্লেসমেন্ট',
                    },
                    {
                      id: 'sub_header_bar',
                      title: 'ডেডিকেটেড সাব-টপ বার',
                      desc: 'নেভবারের নিচে হাই-প্রোডাক্টিভিটি অ্যাকশন বার',
                    },
                  ].map((pos) => (
                    <div
                      key={pos.id}
                      onClick={() => updateTopIconMenuConfig({ placement: pos.id as any })}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        topIconMenuConfig.placement === pos.id
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Top Position
                        </span>
                        {topIconMenuConfig.placement === pos.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{pos.title}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{pos.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Top Spacing & Alignment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      টপ মেনু স্পেসিং (Spacing)
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'compact', label: 'কমপ্যাক্ট' },
                        { id: 'standard', label: 'স্ট্যান্ডার্ড' },
                        { id: 'spacious', label: 'প্রশস্ত' },
                      ].map((sp) => (
                        <button
                          key={sp.id}
                          type="button"
                          onClick={() => updateTopIconMenuConfig({ spacing: sp.id as any })}
                          className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            topIconMenuConfig.spacing === sp.id
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {sp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      টপ মেনু বাটন স্টাইল
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'rounded_icon_button', label: 'রাউন্ডেড বাটন' },
                        { id: 'pill_with_label', label: 'পিল উইথ লেবেল' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => updateTopIconMenuConfig({ buttonStyle: st.id as any })}
                          className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            topIconMenuConfig.buttonStyle === st.id
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* DOWN / BOTTOM MENU BAR SETTINGS */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                    <ArrowDownCircle className="w-4 h-4 text-blue-600" />
                    <span>ডাউন / বটম মেনু বার সেটিংস (Down / Bottom Navigation Settings)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    নিচের মেনুর স্টাইল, পজিশন এবং ডেস্কটপে দেখানোর অপশন পরিচালনা করুন
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'fixed_bottom',
                      title: 'বটম ফিক্সড বার (Fixed Bottom)',
                      desc: 'স্ক্রিনের নিচে স্থির পূর্ণাঙ্গ ন্যাভিগেশন বার',
                    },
                    {
                      id: 'floating_dock',
                      title: 'ফ্লোটিং কুইক ডক (Floating Dock)',
                      desc: 'স্ক্রিনের নিচে সুন্দর ভাসমান আইকন ডক',
                    },
                  ].map((pos) => (
                    <div
                      key={pos.id}
                      onClick={() => updateTopIconMenuConfig({ bottomPlacement: pos.id as any })}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        topIconMenuConfig.bottomPlacement === pos.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Down Position
                        </span>
                        {topIconMenuConfig.bottomPlacement === pos.id && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{pos.title}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{pos.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Show on Desktop Switch */}
                <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <h5 className="text-xs font-bold text-blue-950">
                      ডেস্কটপ ও ল্যাপটপেও ডাউন মেনু দেখান (Show Down Menu on Desktop)
                    </h5>
                    <p className="text-[11px] text-blue-700">
                      সক্রিয় করলে মোবাইলের পাশাপাশি কম্পিউটার স্ক্রিনেও নিচের কুইক ন্যাভিগেশন বার প্রদর্শিত হবে
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={topIconMenuConfig.showBottomOnDesktop}
                      onChange={(e) =>
                        updateTopIconMenuConfig({ showBottomOnDesktop: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 1-CLICK PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  আপনার কাজের সুবিধা অনুযায়ী তাৎক্ষণিক ১-ক্লিকেই তৈরি প্রিসেট টেমপ্লেট নির্বাচন করতে পারেন:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'pos',
                    title: '১. পিওএস ক্যাশিয়ার মোড (POS Express)',
                    desc: 'টপে পিওএস ও শিফট, ডাউনে দ্রুত বিক্রয় ও হোম ন্যাভিগেশন।',
                    color: 'border-emerald-200 bg-emerald-50/40 text-emerald-950',
                  },
                  {
                    id: 'finance',
                    title: '২. অ্যাকাউন্ট্যান্ট ও ফিন্যান্স মোড (Finance Hub)',
                    desc: 'টপে রিপোর্ট ও খরচ, ডাউনে লেজার ও ব্যালেন্স শর্টকাট।',
                    color: 'border-blue-200 bg-blue-50/40 text-blue-950',
                  },
                  {
                    id: 'mobile_app',
                    title: '৩. ফুল মোবাইল অ্যাপ ও ফ্লোটিং ডক (Mobile Dock)',
                    desc: 'ডাউনে ভাসমান ফ্লোটিং ডক সহ পূর্ণাঙ্গ আধুনিক টাচ কন্ট্রোল।',
                    color: 'border-indigo-200 bg-indigo-50/40 text-indigo-950',
                  },
                  {
                    id: 'manager',
                    title: '৪. ম্যানেজার ফুল স্যুট (Manager All Tools)',
                    desc: 'টপ ও ডাউন মেনুর সমস্ত ফিচার ও টুলস সক্রিয়।',
                    color: 'border-purple-200 bg-purple-50/40 text-purple-950',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-3xl border ${item.color} flex flex-col justify-between gap-4`}
                  >
                    <div>
                      <h4 className="text-sm font-black">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => applyPresetTemplate(item.id as any)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-start"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>এই প্রিসেটটি প্রয়োগ করুন</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-5 py-3.5 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            টপ ও ডাউন মেনুর সমস্ত পরিবর্তন তাৎক্ষণিকভাবে স্বয়ংক্রিয় সংরক্ষিত হয়।
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            সম্পন্ন করুন (Close)
          </button>
        </div>
      </div>

      {/* ADD / EDIT ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h4 className="text-xs font-bold flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {editingItem ? `'${editingItem.label}' এডিট করুন` : 'নতুন আইকন মেনু তৈরি করুন'}
                </span>
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Location Selector (Top vs Down) */}
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  মেনু লোকেশন নির্বাচন করুন (Menu Location) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormItem({ ...formItem, location: 'top' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formItem.location === 'top'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>🔝 টপ মেনু বার (Top Menu)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormItem({ ...formItem, location: 'bottom' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formItem.location === 'bottom'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <ArrowDownCircle className="w-4 h-4" />
                    <span>⬇️ ডাউন / বটম মেনু (Down Menu)</span>
                  </button>
                </div>
              </div>

              {/* Label & Sublabel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বাটন নাম / লেবেল *
                  </label>
                  <input
                    type="text"
                    required
                    value={formItem.label}
                    onChange={(e) => setFormItem({ ...formItem, label: e.target.value })}
                    placeholder="যেমন: পিওএস শপ"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সাব-লেবেল (English/Short)
                  </label>
                  <input
                    type="text"
                    value={formItem.subLabel}
                    onChange={(e) => setFormItem({ ...formItem, subLabel: e.target.value })}
                    placeholder="যেমন: POS Counter"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Action Type & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অ্যাকশন ধরন (Action Type)
                  </label>
                  <select
                    value={formItem.actionType}
                    onChange={(e) =>
                      setFormItem({
                        ...formItem,
                        actionType: e.target.value as TopIconActionType,
                        target: e.target.value === 'tab' ? 'pos' : e.target.value === 'modal' ? 'shiftModal' : 'calculator',
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden font-semibold cursor-pointer"
                  >
                    <option value="tab">মডিউল পেজে যান (Module Tab)</option>
                    <option value="modal">পপআপ মোডাল ওপেন (Open Modal)</option>
                    <option value="custom_action">কাস্টম টুল অ্যাকশন (Custom Tool)</option>
                    <option value="external_link">বাহ্যিক লিংক (External URL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    টার্গেট নির্বাচন (Target Action)
                  </label>
                  {formItem.actionType === 'tab' ? (
                    <select
                      value={formItem.target}
                      onChange={(e) => setFormItem({ ...formItem, target: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden font-semibold cursor-pointer"
                    >
                      <option value="dashboard">ড্যাশবোর্ড (Dashboard)</option>
                      <option value="pos">পিওএস ক্যাশ কাউন্টার (POS Counter)</option>
                      <option value="sales">বিক্রয় ও চালান (Sales & Invoices)</option>
                      <option value="purchases">ক্রয় ও বিল (Purchases)</option>
                      <option value="products">পণ্য তালিকা (Products Catalog)</option>
                      <option value="inventory">ইনভেন্টরি ও স্টক (Inventory Stock)</option>
                      <option value="customers">কাস্টমার খাতা (Customers)</option>
                      <option value="suppliers">সাপ্লায়ার খাতা (Suppliers)</option>
                      <option value="expenses">খরচের হিসাব (Expenses)</option>
                      <option value="payments">পেমেন্ট কালেকশন (Payments)</option>
                      <option value="cashbank">ক্যাশ ও ব্যাংক (Cash & Bank)</option>
                      <option value="accounting">হিসাববিজ্ঞান লেজার (Accounting)</option>
                      <option value="manufacturing">উৎপাদন ও কারখানা (Manufacturing)</option>
                      <option value="delivery">ডেলিভারি চালান (Delivery)</option>
                      <option value="hr">কর্মচারী ও বেতন (HR & Payroll)</option>
                      <option value="reports">রিপোর্ট সেন্টার (Report Center)</option>
                      <option value="recyclebin">রিসাইকেল বিন (Recycle Bin)</option>
                      <option value="approvals">অনুমোদন কিউ (Approvals Queue)</option>
                      <option value="settings">মাস্টার সেটিংস (Settings Hub)</option>
                    </select>
                  ) : formItem.actionType === 'modal' ? (
                    <select
                      value={formItem.target}
                      onChange={(e) => setFormItem({ ...formItem, target: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden font-semibold cursor-pointer"
                    >
                      <option value="mobileMenu">সকল মডিউলের ড্রয়ার মেনু (More Drawer)</option>
                      <option value="quickAction">কুইক অ্যাকশন মেনু (Quick Add)</option>
                      <option value="shiftModal">ক্যাশিয়ার শিফট ক্লোজিং (Cashier Shift)</option>
                      <option value="backupModal">অটো ক্লাউড ব্যাকআপ (Auto Backup)</option>
                      <option value="gmailModal">জিমেইল অ্যাকাউন্ট (Gmail Sync)</option>
                      <option value="role">ইউজার রোল পরিবর্তন (Role Switcher)</option>
                      <option value="textSize">টেক্সট সাইজ স্কেল (Font Zoom)</option>
                      <option value="sync">সেন্ট্রাল সিঙ্ক রিফ্রেশ (DB Sync)</option>
                    </select>
                  ) : formItem.actionType === 'custom_action' ? (
                    <select
                      value={formItem.target}
                      onChange={(e) => setFormItem({ ...formItem, target: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden font-semibold cursor-pointer"
                    >
                      <option value="calculator">দ্রুত ক্যালকুলেটর (Quick Calculator)</option>
                      <option value="fullscreen">ফুলস্ক্রিন মোড (Toggle Fullscreen)</option>
                      <option value="printTest">ইনভয়েস টেস্ট প্রিন্ট (Print Preview)</option>
                      <option value="reload">অ্যাপ রিলোড ও রিফ্রেশ (Refresh)</option>
                    </select>
                  ) : (
                    <input
                      type="url"
                      value={formItem.target}
                      onChange={(e) => setFormItem({ ...formItem, target: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden font-mono"
                    />
                  )}
                </div>
              </div>

              {/* Icon Selector with Visual Grid */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    আইকন নির্বাচন (Icon Selection)
                  </label>
                  <div className="relative w-36">
                    <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      placeholder="সার্চ..."
                      className="w-full pl-6 pr-2 py-0.5 text-[11px] bg-slate-100 border border-slate-200 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-2xl max-h-36 overflow-y-auto">
                  {filteredIcons.map((icName) => {
                    const IconComp = getIconComponent(icName);
                    const isSelected = formItem.iconName === icName;
                    return (
                      <button
                        key={icName}
                        type="button"
                        onClick={() => setFormItem({ ...formItem, iconName: icName })}
                        className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-2xs scale-110'
                            : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                        }`}
                        title={icName}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  কালার থিম (Color Accent)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {COLOR_PALETTE.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setFormItem({ ...formItem, color: pal.id })}
                      className={`flex items-center gap-1.5 p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                        formItem.color === pal.id
                          ? `${pal.bg} ring-2 ring-emerald-500`
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${pal.dot}`}></span>
                      <span className="truncate">{pal.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge & Tooltip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ব্যাজ স্টাইল (Badge Type)
                  </label>
                  <select
                    value={formItem.badgeType || 'none'}
                    onChange={(e) => setFormItem({ ...formItem, badgeType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden font-semibold cursor-pointer"
                  >
                    <option value="none">কোনো ব্যাজ নেই (None)</option>
                    <option value="dot">অ্যাক্টিভ ডট / সিগন্যাল (Live Dot)</option>
                    <option value="count">সংখ্যা ব্যাজ (Count Number)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    টুলটিপ বিবরণ (Tooltip Description)
                  </label>
                  <input
                    type="text"
                    value={formItem.tooltip}
                    onChange={(e) => setFormItem({ ...formItem, tooltip: e.target.value })}
                    placeholder="যেমন: দ্রুত ক্যাশ কাউন্টার"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Show on Mobile & Show Label Switches */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formItem.showLabelOnDesktop}
                    onChange={(e) =>
                      setFormItem({ ...formItem, showLabelOnDesktop: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>ডেস্কটপে নাম / লেবেল দেখান (Show Label)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formItem.showOnMobile}
                    onChange={(e) => setFormItem({ ...formItem, showOnMobile: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>মোবাইলে দেখান (Show on Mobile)</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  সংরক্ষণ করুন (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
