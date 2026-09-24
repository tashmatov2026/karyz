import React from 'react';
import { useApp } from '../context/AppContext';
import { Worker } from '../types';
import { formatMoney, formatDate, getCurrentDateFormatted, getPaymentTypeLabel } from '../utils/formatters';
import { X, Printer, MessageCircle, Building2, User, CheckCircle2 } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: Worker | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, worker }) => {
  const { getWorkerStats, currentUser } = useApp();

  if (!isOpen || !worker) return null;

  const stats = getWorkerStats(worker.id);
  if (!stats) return null;

  const { workshopName, totalDebt, totalPaid, balance, debtRecords, paymentRecords } = stats;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `🧾 КАРЫЗ ЖАНА ТӨЛӨМ КВИТАНЦИЯСЫ\n` +
      `Дата: ${getCurrentDateFormatted()}\n` +
      `Жумушчу: ${worker.fullName} (${worker.role || 'Тигүүчү'})\n` +
      `Цех: ${workshopName}\n` +
      `------------------------\n` +
      `Жалпы алынган карыз: ${formatMoney(totalDebt)}\n` +
      `Жалпы төлөнгөн: ${formatMoney(totalPaid)}\n` +
      `------------------------\n` +
      `КАЛДЫК: ${formatMoney(balance)}\n` +
      `------------------------\n` +
      `Эсептеген: ${currentUser}`
    );
    const phoneClean = (worker.phone || '').replace(/[^0-9]/g, '');
    const url = phoneClean 
      ? `https://wa.me/${phoneClean.startsWith('0') ? '996' + phoneClean.substring(1) : phoneClean}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="bg-[#1e293b] text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Карыз жана төлөм квитанциясы</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Басып чыгаруу
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div className="p-6 sm:p-8 bg-white font-mono text-slate-900 space-y-4 print:p-0">
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-slate-300 pb-4">
            <h1 className="text-xl font-extrabold uppercase tracking-wider">
              🏭 {workshopName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">ТИГҮҮ ЦЕХИ КАРЫЗ ЭСЕБИ</p>
            <div className="flex items-center justify-between text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200">
              <span>Дата: {getCurrentDateFormatted()}</span>
              <span>№ {worker.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>

          {/* Worker Info */}
          <div className="space-y-1.5 text-xs sm:text-sm border-b border-slate-200 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Жумушчу:</span>
              <span className="font-bold text-slate-900">{worker.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Кызматы:</span>
              <span>{worker.role || 'Тигүүчү'}</span>
            </div>
            {worker.phone && (
              <div className="flex justify-between">
                <span className="text-slate-500">Телефон:</span>
                <span>{worker.phone}</span>
              </div>
            )}
          </div>

          {/* Summary calculations */}
          <div className="space-y-2 py-2 border-b-2 border-dashed border-slate-300 text-sm">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Жалпы алынган карыз:</span>
              <span>{formatMoney(totalDebt)}</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-700">
              <span>Жалпы төлөнгөн сумма:</span>
              <span>{formatMoney(totalPaid)}</span>
            </div>
            <div className="flex justify-between font-black text-base pt-2 border-t border-slate-300 text-slate-950">
              <span>КАЛДЫК:</span>
              <span className={balance > 0 ? 'text-rose-600 font-extrabold' : 'text-emerald-700'}>
                {formatMoney(balance)}
              </span>
            </div>
          </div>

          {/* Recent transactions breakdown */}
          <div className="space-y-3 pt-2 text-xs">
            <p className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              Акыркы операциялар:
            </p>

            {debtRecords.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-rose-700 mb-1">Карыздар:</p>
                <div className="space-y-1 pl-2 border-l-2 border-rose-200">
                  {debtRecords.slice(0, 4).map((d) => (
                    <div key={d.id} className="flex justify-between text-slate-700">
                      <span>{formatDate(d.date)} {d.reason ? `(${d.reason})` : ''}</span>
                      <span className="font-bold text-rose-600">+{formatMoney(d.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paymentRecords.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-emerald-700 mb-1">Төлөмдөр:</p>
                <div className="space-y-1 pl-2 border-l-2 border-emerald-200">
                  {paymentRecords.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex justify-between text-slate-700">
                      <span>{formatDate(p.date)} ({getPaymentTypeLabel(p.paymentType)})</span>
                      <span className="font-bold text-emerald-600">-{formatMoney(p.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t-2 border-dashed border-slate-300 space-y-6 text-xs">
            <div className="flex justify-between pt-4">
              <div>
                <p className="text-slate-500">Берди (Цех жетекчиси):</p>
                <p className="mt-4 border-b border-slate-400 w-32"></p>
              </div>
              <div>
                <p className="text-slate-500 text-right">Алды (Жумушчу):</p>
                <p className="mt-4 border-b border-slate-400 w-32 ml-auto"></p>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 italic">
              Рахмат! Маалыматтар такталды.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
