import React, { useState, useEffect } from 'react';
import { Calculator, X, Delete, RotateCcw, Check, Sparkles } from 'lucide-react';

interface QuickCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCalculatorModal: React.FC<QuickCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (/[0-9]/.test(e.key)) {
        handleDigit(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === '.') {
        handleDecimal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, display, equation]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    setDisplay((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  };

  const handleOperator = (op: string) => {
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleEquals = () => {
    if (!equation) return;
    try {
      const sanitized = (equation + display)
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/[^0-9+\-*/.]/g, '');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      const formatted = Number.isFinite(result) ? String(Math.round(result * 100) / 100) : 'Error';
      setDisplay(formatted);
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-xs overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold tracking-tight">দ্রুত ব্যবসায়িক ক্যালকুলেটর (Calculator)</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Display Area */}
        <div className="bg-slate-950 p-4 text-right">
          <div className="text-[11px] font-mono text-emerald-400 min-h-[16px] truncate">
            {equation || '\u00A0'}
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-wider truncate mt-0.5">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-3 bg-slate-50 grid grid-cols-4 gap-1.5">
          <button
            onClick={handleClear}
            className="col-span-2 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            AC (Clear)
          </button>
          <button
            onClick={handleBackspace}
            className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOperator('÷')}
            className="py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            ÷
          </button>

          {['7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOperator('×')}
            className="py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            ×
          </button>

          {['4', '5', '6'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOperator('-')}
            className="py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            -
          </button>

          {['1', '2', '3'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOperator('+')}
            className="py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            +
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="col-span-2 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-sm transition-colors cursor-pointer"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
