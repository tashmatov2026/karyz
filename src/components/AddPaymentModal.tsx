import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Worker } from '../types';
import { formatMoney, getTodayIsoDate } from '../utils/formatters';
import { X, Minus, AlertCircle, Calendar, DollarSign, CreditCard, User, CheckCircle2 } from 'lucide-react';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetWorker?: Worker | null;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, targetWorker }) => {
  const { workers, addPayment, getWorkerStats } = useApp();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayIsoDate());
  const [paymentType, setPaymentType] = useState<'salary_deduction' | 'cash' | 'card' | 'mbank' | 'other'>('salary_deduction');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (targetWorker) {
      setSelectedWorkerId(targetWorker.id);
    } else if (workers.length > 0 && !selectedWorkerId) {
      setSelectedWorkerId(workers[0].id);
    }
  }, [targetWorker, workers, isOpen]);

  if (!isOpen) return null;

  const currentStats = selectedWorkerId ? getWorkerStats(selectedWorkerId) : null;
  const currentBalance = currentStats ? currentStats.balance : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/\s+/g, ''));
    if (!selectedWorkerId) {
      setError('Жумушчуну тандаңыз');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Төлөнгөн сумманы туура жазыңыз (0дөн жогору)');
      return;
    }

    addPayment({
      workerId: selectedWorkerId,
      amount: numAmount,
      date: date || getTodayIsoDate(),
      paymentType,
      note: note.trim() || (paymentType === 'salary_deduction' ? 'Айлыктан кармалды' : 'Төлөндү'),
    });

    setAmount('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header matching wireframe "ТӨЛӨМ КОШУУ" */}
        <div className="bg-emerald-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
                ТӨЛӨМ КОШУУ
              </h2>
              <p className="text-xs text-emerald-100">Карызды кайтаруу же айлыктан кармоо</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-red-600 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Worker Info */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Жумушчу:
            </label>
            {targetWorker ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-extrabold text-slate-900 text-base">{targetWorker.fullName}</div>
                <div className="text-xs text-slate-500 mt-0.5">{currentStats?.workshopName}</div>
              </div>
            ) : (
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {workers.map((w) => {
                  const s = getWorkerStats(w.id);
                  return (
                    <option key={w.id} value={w.id}>
                      {w.fullName} (Калдык: {formatMoney(s?.balance || 0)})
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* Current Debt Indicator matching wireframe: "Карыз: 20 000 сом" */}
          <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-red-700">
              Карыз калдыгы:
            </span>
            <span className="font-black text-red-500 text-base sm:text-lg">
              {formatMoney(currentBalance)}
            </span>
          </div>

          {/* Amount input matching [ 5 000 ] */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Төлөнгөн сумма:
              </span>
              {currentBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(String(currentBalance))}
                  className="text-xs text-emerald-600 hover:text-emerald-800 font-bold hover:underline"
                >
                  Толук жабуу ({formatMoney(currentBalance)})
                </button>
              )}
            </label>
            <div className="relative">
              <input
                id="add-payment-amount-input"
                type="number"
                step="100"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5 000"
                className="w-full p-3 pl-4 pr-12 bg-slate-50 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                сом
              </span>
            </div>

            {/* Quick amount pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[1000, 2000, 3000, 5000, 10000, 20000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAmount(String(val))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-full border border-slate-200 transition-colors"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              Төлөм түрү:
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="salary_deduction">Айлыктан кармалды</option>
              <option value="cash">Накталай төлөндү</option>
              <option value="mbank">MBank / Элкарт</option>
              <option value="card">Банк картасы</option>
              <option value="other">Башка</option>
            </select>
          </div>

          {/* Date input matching [ 29.08.2026 ] */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Дата:
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Эскертүү / Комментарий:
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Мисалы: 1-жарым жылдыктан кармалды"
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Action buttons matching wireframe [Жокко чыгаруу] [САКТОО] */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
            >
              Жокко чыгаруу
            </button>
            <button
              id="save-payment-btn"
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-95 uppercase tracking-wider"
            >
              САКТОО
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
