import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Worker } from '../types';
import { formatMoney, formatDate, getPaymentTypeLabel } from '../utils/formatters';
import { 
  X, 
  Building, 
  Briefcase, 
  Phone, 
  Plus, 
  Minus, 
  Printer, 
  MessageCircle, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Clock,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

interface WorkerDetailModalProps {
  worker: Worker | null;
  onClose: () => void;
}

export const WorkerDetailModal: React.FC<WorkerDetailModalProps> = ({ worker, onClose }) => {
  const { 
    getWorkerStats, 
    openAddDebtModal, 
    openAddPaymentModal, 
    openReceiptModal,
    deleteDebt,
    deletePayment,
    deleteWorker,
    confirmAction
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'debts' | 'payments'>('all');

  if (!worker) return null;

  const stats = getWorkerStats(worker.id);
  if (!stats) return null;

  const { workshopName, totalDebt, totalPaid, balance, debtRecords, paymentRecords } = stats;
  const hasDebt = balance > 0;

  // WhatsApp share message
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Саламатсызбы, ${worker.fullName}!\n` +
      `Цех: ${workshopName}\n` +
      `Сиздин карыз эсебиңиз боюнча маалымат:\n` +
      `• Жалпы алынган сумма: ${formatMoney(totalDebt)}\n` +
      `• Төлөнгөн сумма: ${formatMoney(totalPaid)}\n` +
      `• КАЛДЫК КАРЫЗ: ${formatMoney(balance)}\n` +
      `Маалымат тактоо үчүн байланышыңыз.`
    );
    const phoneClean = (worker.phone || '').replace(/[^0-9]/g, '');
    const url = phoneClean 
      ? `https://wa.me/${phoneClean.startsWith('0') ? '996' + phoneClean.substring(1) : phoneClean}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleDeleteWorker = () => {
    confirmAction({
      title: 'Жумушчуну өчүрүү',
      message: `"${worker.fullName}" жумушчусун жана анын бардык тарыхын өчүрүүнү каалайсызбы?`,
      confirmText: 'Ооба, өчүрүү',
      onConfirm: () => {
        deleteWorker(worker.id);
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header matching Vibrant Palette */}
        <div className="bg-[#1e293b] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              {worker.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white uppercase">
                {worker.fullName}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🏭 Цех: <strong className="text-white">{workshopName}</strong></span>
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>👷 Кызматы: <strong className="text-white">{worker.role || 'Тигүүчү'}</strong></span>
                </span>
                {worker.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-white">{worker.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Financial Balance Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div className="space-y-2.5 text-sm sm:text-base">
              <div className="flex items-center justify-between font-medium text-slate-600">
                <span>Жалпы алган:</span>
                <span className="font-bold text-slate-900 text-base">{formatMoney(totalDebt)}</span>
              </div>
              <div className="flex items-center justify-between font-medium text-slate-600">
                <span>Төлөгөн:</span>
                <span className="font-bold text-emerald-600 text-base">{formatMoney(totalPaid)}</span>
              </div>
              
              <div className="h-px bg-slate-200 my-2"></div>
              
              <div className="flex items-center justify-between font-black text-lg sm:text-xl">
                <span className="text-slate-900 tracking-wider">КАЛДЫК:</span>
                <span className={hasDebt ? 'text-red-500 flex items-center gap-1.5' : 'text-emerald-600'}>
                  {hasDebt ? `🔴 ${formatMoney(balance)}` : `🟢 0 сом`}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              id="worker-add-debt-btn"
              onClick={() => openAddDebtModal(worker)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>[ + КАРЫЗ КОШУУ ]</span>
            </button>

            <button
              id="worker-add-payment-btn"
              onClick={() => openAddPaymentModal(worker)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
              <span>[ + ТӨЛӨМ КОШУУ ]</span>
            </button>

            <button
              id="worker-delete-btn"
              onClick={() => {
                confirmAction({
                  title: 'Жумушчуну өчүрүү',
                  message: `"${worker.fullName}" жумушчусун толугу менен өчүрүүнү каалайсызбы?\nБул анын бардык карыз жана төлөм тарыхын да өчүрөт.`,
                  confirmText: 'Ооба, өчүрүү',
                  onConfirm: () => {
                    deleteWorker(worker.id);
                    onClose();
                  },
                });
              }}
              className="bg-rose-50 hover:bg-rose-100 text-red-600 border border-rose-200 font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>[ ӨЧҮРҮҮ ]</span>
            </button>

            <button
              id="worker-whatsapp-btn"
              onClick={handleWhatsApp}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* History Sections matching mockup */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Операциялар тарыхы
              </h3>
              <div className="flex bg-slate-100 p-0.5 rounded-full text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    activeTab === 'all' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  Бардыгы
                </button>
                <button
                  onClick={() => setActiveTab('debts')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    activeTab === 'debts' ? 'bg-white shadow-sm text-red-500 font-bold' : 'text-slate-500'
                  }`}
                >
                  Карыздар ({debtRecords.length})
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    activeTab === 'payments' ? 'bg-white shadow-sm text-emerald-600 font-bold' : 'text-slate-500'
                  }`}
                >
                  Төлөмдөр ({paymentRecords.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Карыз тарыхы (Debts List) */}
              {(activeTab === 'all' || activeTab === 'debts') && (
                <div className="bg-rose-50/30 rounded-xl border border-rose-100 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-red-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4 text-red-500" />
                      Карыз тарыхы:
                    </span>
                    <span>+{formatMoney(totalDebt)}</span>
                  </div>

                  {debtRecords.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">Карыз жазуулары жок</p>
                  ) : (
                    <div className="space-y-2">
                      {debtRecords.map((d) => (
                        <div
                          key={d.id}
                          className="bg-white p-3 rounded-lg border border-slate-100 shadow-xs flex items-center justify-between text-xs sm:text-sm group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-400">{formatDate(d.date)}</span>
                              <span className="font-bold text-red-500 text-sm">
                                +{formatMoney(d.amount)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{d.reason || 'Себеби көрсөтүлгөн эмес'}</p>
                          </div>

                          <button
                            title="Өчүрүү"
                            onClick={() => {
                              confirmAction({
                                title: 'Карызды өчүрүү',
                                message: `Карыз жазуусун (${formatDate(d.date)}: +${formatMoney(d.amount)}) өчүрүүнү каалайсызбы?`,
                                confirmText: 'Өчүрүү',
                                onConfirm: () => deleteDebt(d.id),
                              });
                            }}
                            className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Төлөмдөр (Payments List) */}
              {(activeTab === 'all' || activeTab === 'payments') && (
                <div className="bg-emerald-50/30 rounded-xl border border-emerald-100 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                      Төлөмдөр:
                    </span>
                    <span>-{formatMoney(totalPaid)}</span>
                  </div>

                  {paymentRecords.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">Төлөм жазуулары жок</p>
                  ) : (
                    <div className="space-y-2">
                      {paymentRecords.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white p-3 rounded-lg border border-slate-100 shadow-xs flex items-center justify-between text-xs sm:text-sm group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-400">{formatDate(p.date)}</span>
                              <span className="font-bold text-emerald-600 text-sm">
                                -{formatMoney(p.amount)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-medium">
                                {getPaymentTypeLabel(p.paymentType)}
                              </span>
                              {p.note && <span className="text-xs text-slate-600">{p.note}</span>}
                            </div>
                          </div>

                          <button
                            title="Өчүрүү"
                            onClick={() => {
                              confirmAction({
                                title: 'Төлөмдү өчүрүү',
                                message: `Төлөм жазуусун (${formatDate(p.date)}: -${formatMoney(p.amount)}) өчүрүүнү каалайсызбы?`,
                                confirmText: 'Өчүрүү',
                                onConfirm: () => deletePayment(p.id),
                              });
                            }}
                            className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleDeleteWorker}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 hover:underline"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Жумушчуну өчүрүү
          </button>

          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-bold px-5 py-2 rounded-xl transition-colors"
          >
            Жабуу
          </button>
        </div>
      </div>
    </div>
  );
};
