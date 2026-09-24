import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Worker } from '../types';
import { formatMoney } from '../utils/formatters';
import { Search, Plus, UserPlus, Eye, Trash2, Phone, Building, Briefcase } from 'lucide-react';

interface WorkersListViewProps {
  onSelectWorker: (worker: Worker) => void;
  onSelectWorkshop: (workshopId: string) => void;
}

export const WorkersListView: React.FC<WorkersListViewProps> = ({
  onSelectWorker,
  onSelectWorkshop,
}) => {
  const { 
    workerStatsList, 
    workshops, 
    openAddWorkerModal, 
    openAddDebtModal, 
    openAddPaymentModal,
    deleteWorker,
    confirmAction
  } = useApp();

  const [search, setSearch] = useState('');
  const [workshopFilter, setWorkshopFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const allRoles = useMemo(() => {
    const roles = new Set<string>();
    workerStatsList.forEach((w) => {
      if (w.worker.role) roles.add(w.worker.role);
    });
    return Array.from(roles);
  }, [workerStatsList]);

  const filtered = useMemo(() => {
    return workerStatsList.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.worker.fullName.toLowerCase().includes(q) ||
        item.worker.phone.includes(q) ||
        item.workshopName.toLowerCase().includes(q) ||
        item.worker.role.toLowerCase().includes(q);

      if (!matchSearch) return false;
      if (workshopFilter !== 'ALL' && item.worker.workshopId !== workshopFilter) return false;
      if (roleFilter !== 'ALL' && item.worker.role !== roleFilter) return false;

      return true;
    });
  }, [workerStatsList, search, workshopFilter, roleFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>👷</span> ЖУМУШЧУЛАР
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Бардык цехтердин жумушчуларынын жалпы тизмеси жана байланыштары
          </p>
        </div>

        <button
          onClick={() => openAddWorkerModal()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>[+ Жаңы жумушчу]</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔎 Аты-жөнү же телефон боюнча издөө..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full border-none text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <select
          value={workshopFilter}
          onChange={(e) => setWorkshopFilter(e.target.value)}
          className="bg-slate-100 border-none text-slate-700 text-xs sm:text-sm font-semibold rounded-full px-3.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
        >
          <option value="ALL">Бардык цехтер</option>
          {workshops.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name}
            </option>
          ))}
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-100 border-none text-slate-700 text-xs sm:text-sm font-semibold rounded-full px-3.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
        >
          <option value="ALL">Бардык кызматтар</option>
          {allRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const hasDebt = item.balance > 0;
          return (
            <div
              key={item.worker.id}
              onClick={() => onSelectWorker(item.worker)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 ${
                      hasDebt ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.worker.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.worker.fullName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{item.worker.role || 'Тигүүчү'}</span>
                      </div>
                    </div>
                  </div>

                  {item.worker.phone && (
                    <a
                      href={`tel:${item.worker.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title={item.worker.phone}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Цех:</span>
                    <span className="font-semibold text-slate-800">{item.workshopName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Жалпы алган:</span>
                    <span className="font-medium text-slate-700">{formatMoney(item.totalDebt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Төлөгөн:</span>
                    <span className="font-medium text-emerald-600">{formatMoney(item.totalPaid)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1.5 border-t border-slate-100 text-sm">
                    <span className="text-slate-700">Калдык:</span>
                    <span className={hasDebt ? 'text-red-500 font-extrabold' : 'text-emerald-600 font-bold'}>
                      {hasDebt ? `🔴 ${formatMoney(item.balance)}` : '🟢 0 сом'}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => openAddDebtModal(item.worker)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold text-center border border-rose-200"
                >
                  + Карыз
                </button>
                <button
                  onClick={() => openAddPaymentModal(item.worker)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold text-center border border-emerald-200"
                >
                  + Төлөм
                </button>
                <button
                  onClick={() => {
                    confirmAction({
                      title: 'Жумушчуну өчүрүү',
                      message: `"${item.worker.fullName}" жумушчусун өчүрүүнү каалайсызбы?\nБул анын бардык карыз жана төлөм тарыхын да өчүрөт.`,
                      confirmText: 'Ооба, өчүрүү',
                      onConfirm: () => deleteWorker(item.worker.id),
                    });
                  }}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Жумушчуну өчүрүү"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
