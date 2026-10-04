import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Printer, X, SlidersHorizontal, CheckSquare, Square, Building2, Phone, Mail } from 'lucide-react';

export const PrintModal: React.FC = () => {
  const {
    printData,
    setPrintData,
    companyProfile,
    printSettings,
    updatePrintSettings,
    customers,
    getCustomerBalance,
  } = useApp();

  const [printFormat, setPrintFormat] = useState<'a4' | 'thermal'>('a4');
  const [showQuickControls, setShowQuickControls] = useState(false);

  if (!printData) return null;

  const { type, data } = printData;

  const handlePrint = () => {
    window.print();
  };

  // Resolve Customer & Accurate Historical Balances
  const customerId = data.customerId;
  const matchedCustomer = customerId
    ? customers.find((c) => c.id === customerId)
    : data.customerName
    ? customers.find((c) => c.name.toLowerCase() === data.customerName.toLowerCase())
    : null;

  const grandTotal = Number(data.grandTotal ?? data.amount ?? 0);
  const received = Number(data.paidAmount ?? (data.type === 'in' ? data.amount : 0));
  const currentInvoiceDue = Number(data.dueAmount ?? Math.max(0, grandTotal - received));

  let previousBalance = 0;
  let totalBalance = grandTotal;
  let totalDue = currentInvoiceDue;

  if (matchedCustomer) {
    const custBalance = getCustomerBalance(matchedCustomer.id);
    const overallCustomerDue = custBalance.currentDue;
    previousBalance = Math.max(0, overallCustomerDue - currentInvoiceDue);
    totalBalance = previousBalance + grandTotal;
    totalDue = Math.max(0, totalBalance - received);
  } else if (data.previousBalance !== undefined) {
    previousBalance = Number(data.previousBalance);
    totalBalance = previousBalance + grandTotal;
    totalDue = Math.max(0, totalBalance - received);
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      {/* Container */}
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Modal Controls Bar (hidden during print) */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-200 text-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-800">প্রিন্ট প্রিভিউ ও ফরম্যাট:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs border border-slate-200">
              <button
                onClick={() => setPrintFormat('a4')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  printFormat === 'a4'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A4 ইনভয়েস
              </button>
              <button
                onClick={() => setPrintFormat('thermal')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  printFormat === 'thermal'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                থার্মাল POS রসিদ
              </button>
            </div>

            {/* Quick Balance Control Toggle Button */}
            <button
              onClick={() => setShowQuickControls(!showQuickControls)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="ব্যালেন্স শো/হাইড কন্ট্রোল"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>ব্যালেন্স তথ্য ফিল্টার</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={() => setPrintData(null)}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-base transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Balance Visibility Toggles Strip (collapsible / toggleable in preview) */}
        {showQuickControls && (
          <div className="bg-emerald-50/70 border-b border-emerald-200/80 px-5 py-2.5 flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-950 no-print">
            <span className="text-[11px] text-emerald-800 uppercase tracking-wider font-extrabold flex items-center gap-1">
              প্রিন্ট কন্ট্রোল:
            </span>

            <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={printSettings.showPreviousBalance}
                onChange={(e) => updatePrintSettings({ showPreviousBalance: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>পূর্বের বকেয়া (Previous Balance)</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={printSettings.showReceived}
                onChange={(e) => updatePrintSettings({ showReceived: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>প্রাপ্ত টাকা (Received)</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={printSettings.showTotalBalance}
                onChange={(e) => updatePrintSettings({ showTotalBalance: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>মোট ব্যালেন্স (Total Balance)</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={printSettings.showTotalDue}
                onChange={(e) => updatePrintSettings({ showTotalDue: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>সর্বমোট বকেয়া (Total Due)</span>
            </label>
          </div>
        )}

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 flex justify-center print:p-0 print:bg-white">
          {printFormat === 'thermal' ? (
            /* 58mm / 80mm POS Thermal Receipt Format */
            <div className="w-80 bg-white p-4 rounded-xl shadow-xs border border-slate-300 font-mono text-[11px] leading-tight text-slate-900 space-y-2.5 print:shadow-none print:border-none print:w-full print:p-0">
              {/* Receipt Header */}
              <div className="text-center space-y-0.5 border-b border-dashed border-slate-400 pb-2">
                <h2 className="text-sm font-black tracking-tight">{companyProfile.name}</h2>
                <p className="text-[10px] text-slate-600">{companyProfile.address}</p>
                <p className="text-[10px] text-slate-600">ফোন: {companyProfile.phone}</p>
                {printSettings.showVatBin && companyProfile.vatNumber && (
                  <p className="text-[10px] text-slate-600">ভ্যাট BIN: {companyProfile.vatNumber}</p>
                )}
              </div>

              {/* Invoice Meta */}
              <div className="flex justify-between text-[10px] border-b border-dashed border-slate-400 pb-1">
                <span>নং: {data.invoiceNo || data.billNo || data.paymentNo || 'N/A'}</span>
                <span>
                  {data.date} {data.time || ''}
                </span>
              </div>

              {data.customerName && (
                <div className="text-[10px] border-b border-dashed border-slate-400 pb-1">
                  ক্রেতা: <strong>{data.customerName}</strong>
                  {data.customerPhone && <div>ফোন: {data.customerPhone}</div>}
                </div>
              )}

              {/* Items List */}
              {data.items && data.items.length > 0 && (
                <div className="space-y-1 py-1 border-b border-dashed border-slate-400">
                  <div className="flex justify-between font-bold text-[10px] border-b border-slate-200 pb-0.5">
                    <span>আইটেম</span>
                    <span>পরিমাণ × দর</span>
                    <span className="text-right">মোট</span>
                  </div>
                  {data.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[10px]">
                      <span className="truncate max-w-[120px]">{item.productName}</span>
                      <span>
                        {item.qty} × {item.rate}
                      </span>
                      <span className="font-bold text-right">৳{item.total}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Calculations Block with Controlled Balance Info */}
              <div className="space-y-1 text-xs pt-1 border-b border-dashed border-slate-400 pb-2">
                {data.subtotal !== undefined && (
                  <div className="flex justify-between">
                    <span>সাবটোটাল:</span>
                    <span>৳{data.subtotal.toLocaleString()}</span>
                  </div>
                )}
                {data.discountAmount > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>ছাড় (Discount):</span>
                    <span>-৳{data.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {data.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>ভ্যাট:</span>
                    <span>+৳{data.taxAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between font-black text-sm border-t border-slate-800 pt-1">
                  <span>বর্তমান বিল:</span>
                  <span>৳{grandTotal.toLocaleString()}</span>
                </div>

                {/* 1. Previous Balance (Conditional) */}
                {printSettings.showPreviousBalance && (
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>পূর্বের বকেয়া (Prev Balance):</span>
                    <span>৳{previousBalance.toLocaleString()}</span>
                  </div>
                )}

                {/* 2. Total Balance (Conditional) */}
                {printSettings.showTotalBalance && (
                  <div className="flex justify-between font-bold text-slate-900 border-t border-dotted border-slate-300 pt-0.5">
                    <span>মোট ব্যালেন্স (Total Balance):</span>
                    <span>৳{totalBalance.toLocaleString()}</span>
                  </div>
                )}

                {/* 3. Received Amount (Conditional) */}
                {printSettings.showReceived && (
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>প্রাপ্ত টাকা (Received):</span>
                    <span>৳{received.toLocaleString()}</span>
                  </div>
                )}

                {/* 4. Total Due (Conditional) */}
                {printSettings.showTotalDue && (
                  <div className="flex justify-between font-black text-slate-900 border-t border-slate-900 pt-1 text-xs">
                    <span>সর্বমোট বকেয়া (Total Due):</span>
                    <span className={totalDue > 0 ? 'text-red-600' : 'text-emerald-700'}>
                      ৳{totalDue.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Receipt Footer */}
              <div className="text-center pt-2 text-[10px] space-y-1">
                <p className="font-bold">{printSettings.receiptFooterNote || 'ধন্যবাদ! আবার আসবেন।'}</p>
                <p className="text-slate-400">Software: BizAccount ERP</p>
              </div>
            </div>
          ) : (
            /* A4 Full Professional Layout */
            <div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 text-slate-800 space-y-6 print:shadow-none print:border-none print:p-0">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{companyProfile.name}</h1>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{companyProfile.tagline}</p>
                  <p className="text-xs text-slate-500 mt-1">{companyProfile.address}</p>
                  <p className="text-xs text-slate-500">
                    ফোন: {companyProfile.phone} · ইমেইল: {companyProfile.email}
                  </p>
                  {printSettings.showVatBin && companyProfile.vatNumber && (
                    <p className="text-xs text-slate-600 font-mono mt-0.5 font-bold">
                      ভ্যাট BIN: {companyProfile.vatNumber}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-base font-black uppercase text-emerald-800 tracking-wider">
                    {type === 'invoice'
                      ? 'বিক্রয় চালান / ইনভয়েস'
                      : type === 'statement'
                      ? 'হিসাব বিবরণী (STATEMENT)'
                      : 'পেমেন্ট মানি রিসিট'}
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-700 mt-1">
                    ইনভয়েস নং: {data.invoiceNo || data.billNo || data.paymentNo || 'N/A'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    তারিখ: {data.date || new Date().toISOString().slice(0, 10)}
                  </div>
                </div>
              </div>

              {/* Bill To */}
              {(data.customerName || data.party?.name) && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    {(matchedCustomer?.photo || data.party?.photo || data.customerPhoto) && (
                      <img
                        src={matchedCustomer?.photo || data.party?.photo || data.customerPhoto}
                        alt="Customer"
                        className="w-14 h-14 rounded-xl object-cover border border-slate-300 shadow-2xs shrink-0"
                      />
                    )}
                    <div>
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                        প্রাপক / কাস্টমার বিবরণ:
                      </span>
                      <div className="text-sm font-black text-slate-900 mt-0.5">
                        {data.customerName || data.party?.name}
                      </div>
                      {(data.customerPhone || data.party?.phone) && (
                        <div className="text-slate-600">মোবাইল: {data.customerPhone || data.party?.phone}</div>
                      )}
                      {(data.address || data.party?.address) && (
                        <div className="text-slate-600">ঠিকানা: {data.address || data.party?.address}</div>
                      )}
                    </div>
                  </div>
                  {data.party?.creditLimit && (
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-400 font-medium">ক্রেডিট লিমিট:</span>
                      <div className="text-xs font-bold font-mono text-slate-700">
                        ৳{Number(data.party.creditLimit).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Items Table */}
              {data.items && data.items.length > 0 && (
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">ক্রমিক</th>
                      <th className="py-2.5 px-3">পণ্যের বিবরণ</th>
                      <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                      <th className="py-2.5 px-3 text-right">দর (Rate)</th>
                      <th className="py-2.5 px-3 text-right">ছাড় %</th>
                      <th className="py-2.5 px-3 text-right">মোট টাকা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{item.productName}</td>
                        <td className="py-2 px-3 text-center">
                          {item.qty} {item.unit}
                        </td>
                        <td className="py-2 px-3 text-right font-mono">৳{item.rate.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-mono">{item.discount || 0}%</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900 font-mono">
                          ৳{item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Statement Entries if Statement */}
              {type === 'statement' && data.entries && (
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">তারিখ</th>
                      <th className="py-2.5 px-3">রেফারেন্স</th>
                      <th className="py-2.5 px-3">বিবরণ</th>
                      <th className="py-2.5 px-3 text-right">ডেবিট (+)</th>
                      <th className="py-2.5 px-3 text-right">ক্রেডিট (-)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.entries.map((e: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 text-slate-500">{e.date}</td>
                        <td className="py-2 px-3 font-mono">{e.refNo}</td>
                        <td className="py-2 px-3">{e.description}</td>
                        <td className="py-2 px-3 text-right font-bold font-mono">
                          {e.debit ? `৳${e.debit.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-600 font-mono">
                          {e.credit ? `৳${e.credit.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Calculations Bottom with Print Controls applied */}
              <div className="flex justify-end pt-2">
                {type === 'statement' && data.balance ? (
                  <div className="w-88 space-y-1.5 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                      হিসাব বিবরণী সারসংক্ষেপ (Statement Summary)
                    </div>
                    {printSettings.showPreviousBalance && (
                      <div className="flex justify-between py-1 border-b border-slate-200/80 text-slate-700">
                        <span className="font-semibold">পূর্বের / প্রারম্ভিক বকেয়া:</span>
                        <span className="font-bold font-mono">৳{Number(data.balance.openingBalance).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-200/80 text-slate-900">
                      <span className="font-semibold">সর্বমোট বিক্রয় (Total Sales):</span>
                      <span className="font-bold font-mono text-indigo-700">৳{Number(data.balance.totalSales).toLocaleString()}</span>
                    </div>
                    {printSettings.showTotalBalance && (
                      <div className="flex justify-between py-1 border-b border-slate-200/80 text-slate-900 font-bold">
                        <span>মোট হিসাব ব্যালেন্স (Total Balance):</span>
                        <span className="font-mono">
                          ৳{(Number(data.balance.openingBalance) + Number(data.balance.totalSales)).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {printSettings.showReceived && (
                      <div className="flex justify-between py-1 border-b border-slate-200/80 text-emerald-700 font-bold">
                        <span>মোট জমা / পরিশোধ (Received):</span>
                        <span className="font-mono">৳{Number(data.balance.totalPaid).toLocaleString()}</span>
                      </div>
                    )}
                    {printSettings.showTotalDue && (
                      <div className="flex justify-between py-1.5 border-t-2 border-slate-800 font-black text-sm text-slate-900">
                        <span>সর্বমোট বর্তমান বকেয়া (Current Due):</span>
                        <span className={`font-mono ${data.balance.currentDue > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                          ৳{Number(data.balance.currentDue).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-80 space-y-1.5 text-xs bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                    {data.subtotal !== undefined && (
                      <div className="flex justify-between py-1 border-b border-slate-200/80">
                        <span className="text-slate-600">সাবটোটাল:</span>
                        <span className="font-bold font-mono">৳{data.subtotal.toLocaleString()}</span>
                      </div>
                    )}
                    {data.discountAmount > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-200/80">
                        <span className="text-slate-600">ছাড় (Discount):</span>
                        <span className="font-bold text-red-600 font-mono">-৳{data.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {data.taxAmount > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-200/80">
                        <span className="text-slate-600">ভ্যাট:</span>
                        <span className="font-bold text-slate-800 font-mono">+৳{data.taxAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between py-1.5 border-b-2 border-slate-300 text-xs font-black text-slate-900">
                      <span>বর্তমান ইনভয়েস মোট:</span>
                      <span className="text-emerald-700 font-mono">৳{grandTotal.toLocaleString()}</span>
                    </div>

                    {/* 1. PREVIOUS BALANCE (Controlled by PrintSettings) */}
                    {printSettings.showPreviousBalance && (
                      <div className="flex justify-between py-1 border-b border-slate-200/80 text-slate-700">
                        <span className="font-semibold">পূর্বের বকেয়া (Previous Balance):</span>
                        <span className="font-bold font-mono">৳{previousBalance.toLocaleString()}</span>
                      </div>
                    )}

                    {/* 2. TOTAL BALANCE (Controlled by PrintSettings) */}
                    {printSettings.showTotalBalance && (
                      <div className="flex justify-between py-1 border-b border-slate-200/80 text-slate-900 font-bold">
                        <span>মোট হিসাব ব্যালেন্স (Total Balance):</span>
                        <span className="font-mono">৳{totalBalance.toLocaleString()}</span>
                      </div>
                    )}

                    {/* 3. RECEIVED / PAID (Controlled by PrintSettings) */}
                    {printSettings.showReceived && (
                      <div className="flex justify-between py-1 border-b border-slate-200/80 text-emerald-700 font-bold">
                        <span>পরিশোধিত / প্রাপ্ত টাকা (Received):</span>
                        <span className="font-mono">৳{received.toLocaleString()}</span>
                      </div>
                    )}

                    {/* 4. TOTAL DUE (Controlled by PrintSettings) */}
                    {printSettings.showTotalDue && (
                      <div className="flex justify-between py-1.5 border-t-2 border-slate-800 font-black text-sm text-slate-900">
                        <span>সর্বমোট বকেয়া (Total Due):</span>
                        <span className={`font-mono ${totalDue > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                          ৳{totalDue.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Signatures */}
              {printSettings.showSignatureLines && (
                <div className="pt-16 flex justify-between text-xs text-slate-500">
                  <div className="border-t border-slate-400 pt-1.5 w-44 text-center font-semibold">
                    ক্রেতার স্বাক্ষর
                  </div>
                  <div className="border-t border-slate-400 pt-1.5 w-44 text-center font-semibold">
                    কর্তৃপক্ষের স্বাক্ষর
                  </div>
                </div>
              )}

              {/* Footer Note */}
              <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500">
                {printSettings.receiptFooterNote || 'ধন্যবাদ! আপনার সহযোগিতার জন্য কৃতজ্ঞতা।'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
