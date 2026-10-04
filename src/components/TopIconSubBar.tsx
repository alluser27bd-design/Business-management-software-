import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopIconMenuItem } from '../types';
import { getIconComponent, COLOR_PALETTE } from '../utils/iconMap';
import {
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Clock,
  HardDrive,
  Mail,
  ShieldCheck,
  Type,
  PlusCircle,
  Bell,
  Calculator,
  Maximize,
  Minimize,
  X,
} from 'lucide-react';
import { QuickCalculatorModal } from './QuickCalculatorModal';

interface TopIconSubBarProps {
  onOpenShiftModal?: () => void;
  onOpenGmailModal?: () => void;
  onOpenBackupModal?: () => void;
  onToggleQuickMenu?: () => void;
  onToggleRoleMenu?: () => void;
  onToggleTextSizeMenu?: () => void;
}

export const TopIconSubBar: React.FC<TopIconSubBarProps> = ({
  onOpenShiftModal,
  onOpenGmailModal,
  onOpenBackupModal,
  onToggleQuickMenu,
  onToggleRoleMenu,
  onToggleTextSizeMenu,
}) => {
  const {
    topIconMenuConfig,
    openTopIconCustomizer,
    setActiveTab,
    triggerManualServerSync,
    setPrintData,
    showToast,
    approvals,
  } = useApp();

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!topIconMenuConfig.isEnabled) return null;
  if (
    topIconMenuConfig.placement !== 'sub_header_bar' &&
    topIconMenuConfig.placement !== 'floating_bar' &&
    topIconMenuConfig.placement !== 'bottom_bar'
  ) {
    return null;
  }

  const items = (topIconMenuConfig.items || [])
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  const handleItemClick = (item: TopIconMenuItem) => {
    if (item.actionType === 'tab') {
      setActiveTab(item.target);
    } else if (item.actionType === 'modal') {
      if (item.target === 'shiftModal' && onOpenShiftModal) {
        onOpenShiftModal();
      } else if (item.target === 'gmailModal' && onOpenGmailModal) {
        onOpenGmailModal();
      } else if (item.target === 'backupModal' && onOpenBackupModal) {
        onOpenBackupModal();
      } else if (item.target === 'quickAction' && onToggleQuickMenu) {
        onToggleQuickMenu();
      } else if (item.target === 'role' && onToggleRoleMenu) {
        onToggleRoleMenu();
      } else if (item.target === 'textSize' && onToggleTextSizeMenu) {
        onToggleTextSizeMenu();
      } else if (item.target === 'sync') {
        triggerManualServerSync();
        showToast('সেন্ট্রাল ডাটাবেস সিঙ্ক চেক করা হচ্ছে...');
      }
    } else if (item.actionType === 'custom_action') {
      if (item.target === 'calculator') {
        setIsCalculatorOpen(true);
      } else if (item.target === 'fullscreen') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          setIsFullscreen(true);
          showToast('ফুলস্ক্রিন মোড চালু হয়েছে');
        } else {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
          showToast('ফুলস্ক্রিন মোড বন্ধ হয়েছে');
        }
      } else if (item.target === 'printTest') {
        setPrintData({
          type: 'invoice',
          data: {
            invoiceNo: 'INV-DEMO-TEST',
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toLocaleTimeString(),
            customerName: 'মেহরাব হোসেন (নমুনা কাস্টমার)',
            items: [{ productName: 'সুগন্ধি বাসমতি চাল (২৫ কেজি)', qty: 1, rate: 2600, total: 2600, unit: 'bag' }],
            subtotal: 2600,
            grandTotal: 2600,
            paidAmount: 2600,
            dueAmount: 0,
          },
        });
      } else if (item.target === 'reload') {
        window.location.reload();
      }
    } else if (item.actionType === 'external_link' && item.target) {
      window.open(item.target, '_blank');
    }
  };

  const isFloating = topIconMenuConfig.placement === 'floating_bar';
  const isBottom = topIconMenuConfig.placement === 'bottom_bar';

  return (
    <>
      <QuickCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {isFloating ? (
        /* Floating Dock */
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 no-print flex items-center gap-2 p-2 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-sm sm:max-w-md">
            {items.map((item) => {
              const Icon = getIconComponent(item.iconName);
              const palette = COLOR_PALETTE.find((c) => c.id === item.color) || COLOR_PALETTE[0];

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-2 rounded-xl text-white hover:bg-white/20 transition-all cursor-pointer relative group flex items-center gap-1.5 ${
                    item.color ? palette.bg : 'bg-slate-800'
                  }`}
                  title={item.tooltip || item.label}
                >
                  <Icon className="w-4 h-4" />
                  {item.showLabelOnDesktop && (
                    <span className="text-[11px] font-bold hidden sm:inline">{item.label}</span>
                  )}
                  {item.badgeType === 'dot' && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                  {item.badgeType === 'count' && pendingApprovalsCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1 bg-red-500 text-white rounded-full text-[9px] font-bold">
                      {pendingApprovalsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={openTopIconCustomizer}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors cursor-pointer"
            title="কাস্টমাইজ টপ মেনু"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      ) : isBottom ? (
        /* Bottom Sub-Bar */
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex items-center justify-between no-print shadow-lg">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {items.map((item) => {
              const Icon = getIconComponent(item.iconName);
              const palette = COLOR_PALETTE.find((c) => c.id === item.color) || COLOR_PALETTE[0];
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${palette.bg}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={openTopIconCustomizer}
            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg shrink-0 cursor-pointer"
            title="মেনু কাস্টমাইজ"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Sub-Header Bar (Directly below Navbar) */
        <div className="bg-slate-900 text-white border-b border-slate-800 px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 no-print shadow-xs overflow-x-auto">
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto py-0.5">
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-md shrink-0">
              <Sparkles className="w-3 h-3" />
              <span>Quick Bar</span>
            </span>

            <div
              className={`flex items-center flex-wrap sm:flex-nowrap ${
                topIconMenuConfig.spacing === 'compact'
                  ? 'gap-1'
                  : topIconMenuConfig.spacing === 'spacious'
                  ? 'gap-3'
                  : 'gap-1.5'
              }`}
            >
              {items.map((item) => {
                const Icon = getIconComponent(item.iconName);
                const palette = COLOR_PALETTE.find((c) => c.id === item.color) || COLOR_PALETTE[0];

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer select-none ${
                      palette.bg
                    } ${
                      topIconMenuConfig.buttonStyle === 'compact_tile'
                        ? 'p-2'
                        : topIconMenuConfig.buttonStyle === 'pill_with_label'
                        ? 'rounded-full px-3'
                        : ''
                    }`}
                    title={item.tooltip || item.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.showLabelOnDesktop && (
                      <span className="text-[11px] font-extrabold truncate max-w-[140px]">
                        {item.label}
                      </span>
                    )}
                    {item.badgeType === 'dot' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                    {item.badgeType === 'count' && pendingApprovalsCount > 0 && (
                      <span className="px-1 py-0.2 bg-red-500 text-white rounded-full text-[9px] font-bold">
                        {pendingApprovalsCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Customize Launcher Button */}
          <button
            onClick={openTopIconCustomizer}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold transition-colors cursor-pointer shrink-0"
            title="টপ আইকন মেনু সম্পূর্ণ কাস্টমাইজ করুন"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">কাস্টমাইজ</span>
          </button>
        </div>
      )}
    </>
  );
};
