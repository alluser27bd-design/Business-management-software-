import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Check, ArrowUp, ArrowDown, RotateCcw, X, Eye } from 'lucide-react';
import { TableColumnConfig } from '../types';

interface TableColumnCustomizerProps {
  title?: string;
  columns: TableColumnConfig[];
  onChange: (updated: TableColumnConfig[]) => void;
  onReset: () => void;
}

export const TableColumnCustomizer: React.FC<TableColumnCustomizerProps> = ({
  title = 'কলাম কাস্টমাইজেশন',
  columns,
  onChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (id: string) => {
    const updated = columns.map((col) =>
      col.id === id ? { ...col, enabled: !col.enabled } : col
    );
    onChange(updated);
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const list = [...columns];
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }

    const reordered = list.map((c, idx) => ({ ...c, order: idx + 1 }));
    onChange(reordered);
  };

  const enabledCount = columns.filter((c) => c.enabled).length;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
        title="টেবিলের কলাম অন/অফ ও সাজান"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
        <span>কলাম সাজান ({enabledCount})</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3.5 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div>
              <span className="font-bold text-slate-900 block">{title}</span>
              <span className="text-[10px] text-slate-400">কলাম Show/Hide এবং সিরিয়াল পরিবর্তন</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 py-1">
            {columns.map((col, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === columns.length - 1;

              return (
                <div
                  key={col.id}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-colors ${
                    col.enabled
                      ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-950'
                      : 'bg-slate-50/70 border-slate-200/60 text-slate-400'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 select-none">
                    <input
                      type="checkbox"
                      checked={col.enabled}
                      onChange={() => handleToggle(col.id)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span className="font-bold text-xs truncate">{col.label}</span>
                  </label>

                  <div className="flex items-center gap-0.5 shrink-0 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
                    <button
                      onClick={() => handleMove(col.id, 'up')}
                      disabled={isFirst}
                      className={`p-1 rounded transition-colors ${
                        isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'
                      }`}
                      title="উপরে স্থানান্তর"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMove(col.id, 'down')}
                      disabled={isLast}
                      className={`p-1 rounded transition-colors ${
                        isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'
                      }`}
                      title="নিচে স্থানান্তর"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-2.5 mt-2 flex items-center justify-between text-slate-500">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-emerald-700 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ডিফল্ট কলাম ফিরুন</span>
            </button>
            <span className="text-[10px] text-slate-400 font-mono">
              {enabledCount}/{columns.length} সক্রিয়
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
