import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, Building, Phone, Briefcase, DollarSign, AlertCircle } from 'lucide-react';

interface AddWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetWorkshopId?: string;
}

const COMMON_ROLES = [
  'Тигүүчү',
  'Үтүкчү',
  'Бычмачы',
  'Таңгактоочу',
  'Контролер (ОТК)',
  'Мастер / Бригадир',
  'Жардамчы',
  'Башка',
];

export const AddWorkerModal: React.FC<AddWorkerModalProps> = ({
  isOpen,
  onClose,
  targetWorkshopId,
}) => {
  const { workshops, addWorker, openAddWorkshopModal } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Тигүүчү');
  const [workshopId, setWorkshopId] = useState('');
  const [initialDebtAmount, setInitialDebtAmount] = useState('');
  const [initialDebtReason, setInitialDebtReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (targetWorkshopId) {
      setWorkshopId(targetWorkshopId);
    } else if (workshops.length > 0) {
      if (!workshopId || !workshops.some(w => w.id === workshopId)) {
        setWorkshopId(workshops[0].id);
      }
    } else {
      setWorkshopId('');
    }
  }, [targetWorkshopId, workshops, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Жумушчунун аты-жөнүн жазыңыз');
      return;
    }
    if (!workshopId) {
      setError('Цехти тандаңыз');
      return;
    }

    const initialAmount = parseFloat(initialDebtAmount.replace(/\s+/g, ''));

    addWorker(
      {
        fullName: fullName.trim(),
        phone: phone.trim(),
        role: role.trim() || 'Тигүүчү',
        workshopId,
      },
      !isNaN(initialAmount) && initialAmount > 0
        ? {
            amount: initialAmount,
            reason: initialDebtReason.trim() || 'Баштапкы карыз',
            date: new Date().toISOString().split('T')[0],
          }
        : undefined
    );

    setFullName('');
    setPhone('');
    setRole('Тигүүчү');
    setInitialDebtAmount('');
    setInitialDebtReason('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header matching "ЖАҢЫ ЖУМУШЧУ" */}
        <div className="bg-[#1e293b] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
                ЖАҢЫ ЖУМУШЧУ
              </h2>
              <p className="text-xs text-slate-400">Цехке жаңы жумушчуну кошуу</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
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

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Аты-жөнү:
            </label>
            <input
              id="worker-fullname-input"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Айбек Токторов"
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Телефон:
            </label>
            <input
              id="worker-phone-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0700 123 456"
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Кызматы:
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {COMMON_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Workshop Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Цех:
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAddWorkshopModal();
                }}
                className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
              >
                + Жаңы цех кошуу
              </button>
            </div>
            {workshops.length === 0 ? (
              <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs flex items-center justify-between">
                <span>Адегенде цех кошушуңуз керек</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAddWorkshopModal();
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer"
                >
                  Цех кошуу
                </button>
              </div>
            ) : (
              <select
                value={workshopId}
                onChange={(e) => setWorkshopId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {workshops.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Optional Initial Debt */}
          <div className="pt-2 border-t border-slate-100">
            <details className="text-xs group">
              <summary className="font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer list-none flex items-center gap-1.5 py-1">
                <span>+ Баштапкы карыз бар болсо жазуу</span>
              </summary>
              <div className="space-y-3 pt-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Баштапкы карыз суммасы (сом):
                  </label>
                  <input
                    type="number"
                    value={initialDebtAmount}
                    onChange={(e) => setInitialDebtAmount(e.target.value)}
                    placeholder="0"
                    className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Себеби:
                  </label>
                  <input
                    type="text"
                    value={initialDebtReason}
                    onChange={(e) => setInitialDebtReason(e.target.value)}
                    placeholder="Аванс"
                    className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </details>
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
              id="save-worker-btn"
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
