import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getIconComponent } from '../../utils/dashboardIcons';
import {
  SlidersHorizontal,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  BarChart3,
  LayoutGrid,
  TrendingUp,
  Boxes,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Sparkles,
} from 'lucide-react';

export const DashboardControlPanel: React.FC = () => {
  const {
    dashboardCustomSettings,
    updateDashboardCustomSettings,
    toggleDashboardQuickItem,
    toggleDashboardMetric,
    moveDashboardQuickItem,
    moveDashboardMetric,
    resetDashboardCustomSettings,
    showToast,
  } = useApp();

  const [cardSize, setCardSize] = useState<'compact' | 'standard' | 'large'>(
    dashboardCustomSettings.cardSize || 'standard'
  );

  const handleToggleChart = (chartId: string) => {
    const charts = dashboardCustomSettings.charts || [];
    const updated = charts.map((c) => (c.id === chartId ? { ...c, enabled: !c.enabled } : c));
    updateDashboardCustomSettings({ charts: updated });
    showToast('চার্ট ভিজিবিলিটি আপডেট হয়েছে');
  };

  const handleToggleWidget = (widgetId: string) => {
    const widgets = dashboardCustomSettings.widgets || [];
    const updated = widgets.map((w) => (w.id === widgetId ? { ...w, enabled: !w.enabled } : w));
    updateDashboardCustomSettings({ widgets: updated });
    showToast('উইজেট ভিজিবিলিটি আপডেট হয়েছে');
  };

  const handleSaveCardSize = (size: 'compact' | 'standard' | 'large') => {
    setCardSize(size);
    updateDashboardCustomSettings({ cardSize: size });
    showToast(`ড্যাশবোর্ড কার্ড সাইজ: ${size.toUpperCase()} এ সংরক্ষিত হয়েছে`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
            <span>ড্যাশবোর্ড ফুল কন্ট্রোল ও লেআউট সেন্টার (Dashboard Full Control)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ড্যাশবোর্ডের প্রতিটি কার্ড, শর্টকাট আইকন, চার্ট ও উইজেট Show/Hide করুন এবং ইচ্ছামতো পজিশন সাজান
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetDashboardCustomSettings}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="ফ্যাক্টরি ডিফল্ট ড্যাশবোর্ড ফিরিয়ে আনুন"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>ডিফল্ট রিসেট (Reset Default)</span>
          </button>
        </div>
      </div>

      {/* Card Size Selector */}
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-black uppercase text-slate-700">ড্যাশবোর্ড কার্ডের আকার (Card Density & Size)</h4>
          <p className="text-[11px] text-slate-500">আপনার স্ক্রিনের রেজোলিউশন ও পছন্দ অনুযায়ী কার্ডের সাইজ নির্বাচন করুন</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          {(['compact', 'standard', 'large'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSaveCardSize(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                cardSize === s ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s === 'compact' ? 'কমপ্যাক্ট (Compact)' : s === 'large' ? 'লার্জ (Large)' : 'স্ট্যান্ডার্ড (Standard)'}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Quick Access Shortcuts Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>১. কুইক অ্যাক্সেস মেনু আইকন (Quick Access Shortcuts)</span>
            </h4>
            <p className="text-xs text-slate-500">
              যে শর্টকাটগুলো ড্যাশবোর্ডে দেখাতে চান সেগুলো ON রাখুন। অপ্রয়োজনীয় শর্টকাট OFF করুন এবং উপরে-নিচে নিয়ে সাজান।
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            {dashboardCustomSettings.quickItems.filter((i) => i.enabled).length} টি সক্রিয়
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {dashboardCustomSettings.quickItems.map((item, idx) => {
            const Icon = getIconComponent(item.iconName);
            const isFirst = idx === 0;
            const isLast = idx === dashboardCustomSettings.quickItems.length - 1;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.enabled ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-2xs ${item.color}`}>
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">পজিশন #{idx + 1}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => moveDashboardQuickItem(item.id, 'up')}
                      disabled={isFirst}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`}
                      title="উপরে নিন"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDashboardQuickItem(item.id, 'down')}
                      disabled={isLast}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isLast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`}
                      title="নিচে নিন"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleDashboardQuickItem(item.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      item.enabled ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {item.enabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Business Summary Cards Control */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>২. ব্যবসায়িক আর্থিক হিসাব কার্ড (Business Metrics & Summary Cards)</span>
            </h4>
            <p className="text-xs text-slate-500">
              ড্যাশবোর্ডে যে হিসাবগুলো দেখতে চান সেগুলো ON রাখুন।
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
            {dashboardCustomSettings.metrics.filter((m) => m.enabled).length} টি সক্রিয়
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {dashboardCustomSettings.metrics.map((item, idx) => {
            const Icon = getIconComponent(item.iconName);
            const isFirst = idx === 0;
            const isLast = idx === dashboardCustomSettings.metrics.length - 1;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.enabled ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700">
                    <Icon className="w-4 h-4 text-slate-800" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.category === 'today' ? 'আজকের' : 'সার্বিক'} · #{idx + 1}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => moveDashboardMetric(item.id, 'up')}
                      disabled={isFirst}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`}
                      title="উপরে নিন"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDashboardMetric(item.id, 'down')}
                      disabled={isLast}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isLast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`}
                      title="নিচে নিন"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleDashboardMetric(item.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      item.enabled ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {item.enabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Charts & Visual Reports Control */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-600" />
              <span>৩. চার্ট ও গ্রাফিক্যাল রিপোর্ট কন্ট্রোল (Dashboard Charts)</span>
            </h4>
            <p className="text-xs text-slate-500">ড্যাশবোর্ডে কোন কোন চার্ট ও বিশ্লেষণ দেখতে চান তা নির্বাচন করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(dashboardCustomSettings.charts || []).map((chart) => (
            <div
              key={chart.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                chart.enabled ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">{chart.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{chart.enabled ? 'প্রদর্শিত হবে' : 'লুকানো আছে'}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleChart(chart.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chart.enabled ? 'bg-violet-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {chart.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Widgets Control */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-600" />
              <span>৪. ড্যাশবোর্ড উইজেট ও সাম্প্রতিক অ্যাক্টিভিটি (Activity Widgets)</span>
            </h4>
            <p className="text-xs text-slate-500">সাম্প্রতিক ইনভয়েস, পেমেন্ট, শীর্ষ পণ্য ও কাস্টমার উইজেট নিয়ন্ত্রণ করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(dashboardCustomSettings.widgets || []).map((widget) => (
            <div
              key={widget.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                widget.enabled ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">{widget.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{widget.enabled ? 'প্রদর্শিত হবে' : 'লুকানো আছে'}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleWidget(widget.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  widget.enabled ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {widget.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
