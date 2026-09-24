import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { WorkerStats, Worker } from '../types';
import { formatMoney, formatNumber } from '../utils/formatters';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Eye, 
  Trash2, 
  ArrowUpDown,
  Building,
  UserCheck,
  AlertTriangle,
  FileSpreadsheet,
  PhoneCall
} from 'lucide-react';

interface DashboardViewProps {
  onSelectWorker: (worker: Worker) => void;
  onSelectWorkshop: (workshopId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectWorker, onSelectWorkshop }) => {
  const { 
    workerStatsList, 
    workshops, 
    overallStats, 
    openAddDebtModal, 
    openAddPaymentModal, 
    openAddWorkerModal,
    deleteWorker,
    confirmAction
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkshopFilter, setSelectedWorkshopFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DEBTORS' | 'CLEARED'>('ALL');
  const [sortBy, setSortBy] = useState<'balance_desc' | 'balance_asc' | 'name' | 'debt_desc'>('balance_desc');

  // Filtered and sorted workers list
  const filteredWorkers = useMemo(() => {
    return workerStatsList.filter((item) => {
      // Search filter
      const matchesSearch = 
        item.worker.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.worker.phone.includes(searchQuery) ||
        item.worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.workshopName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Workshop filter
      if (selectedWorkshopFilter !== 'ALL' && item.worker.workshopId !== selectedWorkshopFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'DEBTORS' && item.balance <= 0) return false;
      if (statusFilter === 'CLEARED' && item.balance > 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'balance_desc') return b.balance - a.balance;
      if (sortBy === 'balance_asc') return a.balance - b.balance;
      if (sortBy === 'debt_desc') return b.totalDebt - a.totalDebt;
      if (sortBy === 'name') return a.worker.fullName.localeCompare(b.worker.fullName);
      return 0;
    });
  }, [workerStatsList, searchQuery, selectedWorkshopFilter, statusFilter, sortBy]);

  // Current view's aggregated totals
  const currentViewTotals = useMemo(() => {
    let totalGiven = 0;
    let totalRepaid = 0;
    let debtorsCount = 0;

    filteredWorkers.forEach((w) => {
      totalGiven += w.totalDebt;
      totalRepaid += w.totalPaid;
      if (w.balance > 0) debtorsCount += 1;
    });

    return {
      totalGiven,
      totalRepaid,
      balance: Math.max(0, totalGiven - totalRepaid),
      workerCount: filteredWorkers.length,
      debtorsCount,
    };
  }, [filteredWorkers]);

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Top Highlight Stat Cards matching Vibrant Palette mockup */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 💰 Жалпы карыз */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-slate-500 text-xs font-semibold uppercase mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>💰</span> Жалпы карыз
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium hidden sm:inline">
              Берилген
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">
              {formatMoney(overallStats.totalDebt)}
            </div>
            <div className="mt-2 text-xs text-slate-400 font-medium">
              Бардык цехтер боюнча берилген
            </div>
          </div>
        </div>

        {/* ✅ Төлөнгөн */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-emerald-600 text-xs font-semibold uppercase mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>✅</span> Төлөнгөн
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold hidden sm:inline">
              {Math.round((overallStats.totalPaid / (overallStats.totalDebt || 1)) * 100)}%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight">
              {formatMoney(overallStats.totalPaid)}
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (overallStats.totalPaid / (overallStats.totalDebt || 1)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 🔴 Калдык */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-red-500 text-xs font-semibold uppercase mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>🔴</span> Калдык
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold">
              Өндүрүлүүчү
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl lg:text-3xl font-black text-red-500 tracking-tight">
              {formatMoney(overallStats.totalBalance)}
            </div>
            <div className="mt-2 text-xs text-red-400 font-medium">
              Азыркы карыз калдыгы
            </div>
          </div>
        </div>

        {/* 👷 Жумушчулар */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-blue-500 text-xs font-semibold uppercase mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>👷</span> Жумушчулар
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
              {overallStats.debtWorkersCount} карыз
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl lg:text-3xl font-black text-blue-500 tracking-tight flex items-baseline gap-2">
              <span>{overallStats.debtWorkersCount}</span>
              <span className="text-sm font-medium text-slate-400">/ {overallStats.totalWorkers} адам</span>
            </div>
            <div className="flex -space-x-2 mt-3 overflow-hidden">
              {workerStatsList.slice(0, 4).map((w, idx) => (
                <div
                  key={w.worker.id}
                  className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${
                    w.balance > 0 ? 'bg-red-400' : 'bg-emerald-400'
                  }`}
                  title={w.worker.fullName}
                >
                  {w.worker.fullName.charAt(0)}
                </div>
              ))}
              {workerStatsList.length > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                  +{workerStatsList.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container matching wireframe & Vibrant Palette */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          {/* Search Input matching rounded-full pill */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="worker-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔎 Жумушчу издөө (аты, телефон, цех)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 text-slate-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Workshop Dropdown Filter */}
            <select
              id="workshop-filter-select"
              value={selectedWorkshopFilter}
              onChange={(e) => setSelectedWorkshopFilter(e.target.value)}
              className="bg-slate-100 border-none text-slate-700 text-xs sm:text-sm font-semibold rounded-full px-3.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
              <option value="ALL">Бардык цехтер ▾</option>
              {workshops.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-100 border-none text-slate-700 text-xs sm:text-sm font-semibold rounded-full px-3.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
              <option value="ALL">Бардык жумушчулар</option>
              <option value="DEBTORS">🔴 Карызы барлар</option>
              <option value="CLEARED">🟢 Толук төлөгөндөр (0)</option>
            </select>

            {/* Add Worker Quick Button matching emerald primary */}
            <button
              id="add-worker-quick-btn"
              onClick={() => openAddWorkerModal(selectedWorkshopFilter !== 'ALL' ? selectedWorkshopFilter : undefined)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Жумушчу кошуу</span>
            </button>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="py-3.5 px-4 sm:px-6">Жумушчу</th>
                <th className="py-3.5 px-4">Цех</th>
                <th className="py-3.5 px-4 text-right">Алган (Карыз)</th>
                <th className="py-3.5 px-4 text-right">Төлөндү</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Калдык</th>
                <th className="py-3.5 px-4 text-center">Аракеттер</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="text-base font-semibold text-slate-600">
                        {workerStatsList.length === 0 ? 'Жумушчулар кошула элек' : 'Эч нерсе табылган жок'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {workerStatsList.length === 0 
                          ? 'Алгач цех жана жумушчу кошуп ишти баштаңыз' 
                          : 'Издөө сөзүн же чыпкаларды өзгөртүп көрүңүз'}
                      </p>
                      {workerStatsList.length === 0 ? (
                        <div className="pt-2 flex justify-center gap-2">
                          <button
                            onClick={() => openAddWorkerModal()}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Жумушчу кошуу</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setSearchQuery(''); setSelectedWorkshopFilter('ALL'); setStatusFilter('ALL'); }}
                          className="text-xs text-emerald-600 font-bold hover:underline pt-2 cursor-pointer"
                        >
                          Бардык чыпкаларды тазалоо
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((item, idx) => {
                  const hasDebt = item.balance > 0;
                  return (
                    <tr
                      key={item.worker.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer border-b border-slate-50"
                      onClick={() => onSelectWorker(item.worker)}
                    >
                      {/* Worker Name & Role */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            hasDebt ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.worker.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                              {item.worker.fullName}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2">
                              <span>{item.worker.role || 'Жумушчу'}</span>
                              {item.worker.phone && (
                                <span className="text-slate-400 font-mono">| {item.worker.phone}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Workshop Name */}
                      <td className="py-3.5 px-4">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectWorkshop(item.worker.workshopId);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Building className="w-3 h-3 text-slate-500" />
                          {item.workshopName}
                        </span>
                      </td>

                      {/* Total Taken */}
                      <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                        {formatMoney(item.totalDebt)}
                      </td>

                      {/* Total Paid */}
                      <td className="py-3.5 px-4 text-right font-medium text-emerald-600">
                        {formatMoney(item.totalPaid)}
                      </td>

                      {/* Balance Remaining matching Vibrant 🔴 20 000 сом and 🟢 0 сом */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        {hasDebt ? (
                          <span className="text-red-500 font-bold">
                            🔴 {formatMoney(item.balance)}
                          </span>
                        ) : (
                          <span className="text-emerald-500 font-bold">
                            🟢 0 сом
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Add debt */}
                          <button
                            title="Карыз / Аванс кошуу"
                            onClick={() => openAddDebtModal(item.worker)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">Карыз</span>
                          </button>

                          {/* Add payment */}
                          <button
                            title="Төлөм кошуу"
                            onClick={() => openAddPaymentModal(item.worker)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                          >
                            <Minus className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">Төлөм</span>
                          </button>

                          {/* View details */}
                          <button
                            title="Карточкасын көрүү"
                            onClick={() => onSelectWorker(item.worker)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-emerald-600 hover:bg-slate-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete Worker */}
                          <button
                            title="Жумушчуну өчүрүү"
                            onClick={() => {
                              confirmAction({
                                title: 'Жумушчуну өчүрүү',
                                message: `"${item.worker.fullName}" жумушчусун өчүрүүнү каалайсызбы?\nБул анын бардык карыз жана төлөм тарыхын да өчүрөт.`,
                                confirmText: 'Ооба, өчүрүү',
                                onConfirm: () => deleteWorker(item.worker.id),
                              });
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-red-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Summary Bar matching Wireframe exactly with #1e293b */}
        <div className="p-4 sm:p-5 bg-[#1e293b] text-white border-t border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-slate-400">Жалпы жумушчу:</p>
              <p className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                {currentViewTotals.workerCount} адам
              </p>
            </div>
            <div>
              <p className="text-slate-400">Карызы бар:</p>
              <p className="font-extrabold text-base sm:text-lg text-rose-400 mt-0.5">
                {currentViewTotals.debtorsCount} адам
              </p>
            </div>
            <div>
              <p className="text-slate-400">Жалпы берилген карыз:</p>
              <p className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                {formatMoney(currentViewTotals.totalGiven)}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Жалпы төлөнгөн:</p>
              <p className="font-extrabold text-base sm:text-lg text-emerald-400 mt-0.5">
                {formatMoney(currentViewTotals.totalRepaid)}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1 bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/60">
              <p className="text-rose-300 text-xs font-semibold">КАЛДЫК:</p>
              <p className="font-extrabold text-lg text-rose-400 mt-0.5">
                {formatMoney(currentViewTotals.balance)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
