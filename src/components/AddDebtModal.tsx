import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Worker } from '../types';
import { formatMoney, getTodayIsoDate } from '../utils/formatters';
import { X, Plus, AlertCircle, Calendar, DollarSign, Tag, User } from 'lucide-react';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetWorker?: Worker | null;
}

const COMMON_REASONS = [
  'Үй-бүлөлүк чыгым',
  'Аванс (Жол кире)',
  'Дары-дармек алууга',
  'Үй ижарасы (квартирант)',
  'Балдардын окуусуна',
  'Азык-түлүккө',
  'Тойго чыгымдар',
  'Материалдык жардам',
];

export const AddDebtModal: React.FC<AddDebtModalProps> = ({ isOpen, onClose, targetWorker }) => {
  const { workers, addDebt, getWorkerStats } = useApp();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayIsoDate());
  const [reason, setReason] = useState<string>('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/\s+/g, ''));
    if (!selectedWorkerId) {
      setError('Жумушчуну тандаңыз');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Карыз суммасын туура жазыңыз (0дөн жогору)');
      return;
    }

    addDebt({
      workerId: selectedWorkerId,
      amount: numAmount,
      date: date || getTodayIsoDate(),
      reason: reason.trim() || 'Аванс / Карыз',
    });

    setAmount('');
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header matching wireframe "КАРЫЗ КОШУУ" */}
        <div className="bg-red-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
                КАРЫЗ КОШУУ
              </h2>
              <p className="text-xs text-red-100">Жумушчуга берилген аванс же карызды жазуу</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-100 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
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

          {/* Worker selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Жумушчу:
            </label>
            {targetWorker ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-extrabold text-slate-900">{targetWorker.fullName}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>{currentStats?.workshopName}</span>
                  <span>•</span>
                  <span>Учурдагы калдыгы: <strong className="text-red-500 font-mono">{formatMoney(currentStats?.balance || 0)}</strong></span>
                </div>
              </div>
            ) : (
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-500 outline-none"
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.fullName} ({w.role || 'Тигүүчү'})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Amount input matching [ 20 000 ] */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              Сумма (сом):
            </label>
            <div className="relative">
              <input
                id="add-debt-amount-input"
                type="number"
                step="100"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="20 000"
                className="w-full p-3 pl-4 pr-12 bg-slate-50 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                сом
              </span>
            </div>

            {/* Quick amount pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[1000, 2000, 3000, 5000, 10000, 20000, 50000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAmount(String(val))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-red-500 text-xs font-semibold rounded-full border border-slate-200 transition-colors"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
            </div>
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
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Reason input matching [ Үй-бүлөлүк чыгым ] */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Себеби:
            </label>
            <input
              id="add-debt-reason-input"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Үй-бүлөлүк чыгым, аванс ж.б."
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-red-500 outline-none"
            />
            {/* Quick Reason tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_REASONS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setReason(r)}
                  className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium rounded-full transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
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
              id="save-debt-btn"
              type="submit"
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-red-500/20 active:scale-95 uppercase tracking-wider"
            >
              САКТОО
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
