import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopIconMenuItem } from '../types';
import { getIconComponent, COLOR_PALETTE } from '../utils/iconMap';
import {
  Store,
  Receipt,
  FileBarChart,
  MoreHorizontal,
  LayoutDashboard,
  ShoppingCart,
  SlidersHorizontal,
  Bell,
  Sparkles,
} from 'lucide-react';
import { QuickCalculatorModal } from './QuickCalculatorModal';

interface BottomNavigationBarProps {
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const {
    topIconMenuConfig,
    activeTab,
    setActiveTab,
    openTopIconCustomizer,
    approvals,
    triggerManualServerSync,
    setPrintData,
    showToast,
  } = useApp();

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const bottomItems = (topIconMenuConfig.items || [])
    .filter((item) => item.location === 'bottom' && item.isVisible)
    .sort((a, b) => a.order - b.order);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  const handleItemClick = (item: TopIconMenuItem) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }

    if (item.target === 'mobileMenu' || (item.actionType === 'modal' && item.target === 'more')) {
      setIsOpenMobile(true);
      return;
    }

    if (item.actionType === 'tab') {
      setActiveTab(item.target);
    } else if (item.actionType === 'modal') {
      if (item.target === 'quickAction' || item.target === 'calculator') {
        setIsCalculatorOpen(true);
      } else if (item.target === 'sync') {
        triggerManualServerSync();
        showToast('সেন্ট্রাল ডাটাবেস সিঙ্ক চেক করা হচ্ছে...');
      } else {
        setActiveTab(item.target);
      }
    } else if (item.actionType === 'custom_action') {
      if (item.target === 'calculator') {
        setIsCalculatorOpen(true);
      } else if (item.target === 'fullscreen') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          showToast('ফুলস্ক্রিন মোড সক্রিয়');
        } else {
          document.exitFullscreen().catch(() => {});
          showToast('ফুলস্ক্রিন মোড বন্ধ');
        }
      }
    } else if (item.actionType === 'external_link' && item.target) {
      window.open(item.target, '_blank');
    }
  };

  // If no bottom items are active, don't render
  if (bottomItems.length === 0) return null;

  const showOnDesktop = topIconMenuConfig.showBottomOnDesktop;
  const isFloatingDock = topIconMenuConfig.bottomPlacement === 'floating_dock';

  return (
    <>
      <QuickCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <nav
        className={`fixed bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-2 sm:px-4 no-print shadow-xl pb-safe select-none transition-all ${
          showOnDesktop ? 'left-0 right-0 flex' : 'left-0 right-0 flex lg:hidden'
        } ${
          isFloatingDock
            ? 'max-w-xl mx-auto mb-3 rounded-3xl border shadow-2xl border-slate-300/80 left-4 right-4'
            : ''
        } ${
          topIconMenuConfig.bottomSpacing === 'compact'
            ? 'justify-center gap-1'
            : topIconMenuConfig.bottomSpacing === 'spacious'
            ? 'justify-around gap-3'
            : 'justify-around'
        }`}
      >
        {bottomItems.map((item) => {
          const Icon = getIconComponent(item.iconName);
          const isDrawerAction = item.target === 'mobileMenu' || item.target === 'more';
          const isActive = isDrawerAction ? isOpenMobile : activeTab === item.target;
          const palette = COLOR_PALETTE.find((c) => c.id === item.color) || COLOR_PALETTE[0];

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`flex flex-col items-center justify-center py-1 px-2 sm:px-3 rounded-2xl transition-all cursor-pointer min-w-[54px] relative group ${
                isActive
                  ? `${palette.bg} font-extrabold scale-105 shadow-2xs border`
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium'
              } ${
                topIconMenuConfig.bottomButtonStyle === 'pill_with_label'
                  ? 'flex-row gap-1.5 px-3.5 py-1.5 rounded-full'
                  : ''
              }`}
              title={item.tooltip || item.label}
            >
              <div className="relative">
                <Icon
                  className={`${
                    topIconMenuConfig.bottomIconSize === 'small'
                      ? 'w-4 h-4'
                      : topIconMenuConfig.bottomIconSize === 'large'
                      ? 'w-6 h-6'
                      : 'w-5 h-5'
                  } ${isActive ? `${palette.text} stroke-[2.5]` : 'text-slate-500'}`}
                />
                {item.badgeType === 'dot' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"></span>
                )}
                {item.badgeType === 'count' && pendingApprovalsCount > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 bg-red-500 text-white rounded-full text-[9px] font-bold ring-1 ring-white">
                    {pendingApprovalsCount}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] leading-tight mt-0.5 font-bold truncate max-w-[70px] ${
                  isActive ? palette.text : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
