import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Workshop, Worker } from '../types';
import { formatMoney } from '../utils/formatters';
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Phone, 
  User, 
  ArrowLeft, 
  Eye, 
  Printer, 
  Minus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface WorkshopsViewProps {
  selectedWorkshopId: string | null;
  onSelectWorkshopId: (id: string | null) => void;
  onSelectWorker: (worker: Worker) => void;
}

export const WorkshopsView: React.FC<WorkshopsViewProps> = ({
  selectedWorkshopId,
  onSelectWorkshopId,
  onSelectWorker,
}) => {
  const { 
    workshops, 
    workshopStatsList, 
    workerStatsList, 
    addWorkshop,
    openAddWorkshopModal, 
    openAddWorkerModal,
    openAddDebtModal,
    openAddPaymentModal,
    deleteWorker,
    deleteWorkshop,
    confirmAction
  } = useApp();

  const [workshopSearchQuery, setWorkshopSearchQuery] = useState('');
  const [workerInWorkshopSearch, setWorkerInWorkshopSearch] = useState('');
  const [inlineName, setInlineName] = useState('');
  const [inlineLeader, setInlineLeader] = useState('');
  const [inlinePhone, setInlinePhone] = useState('');
  const [inlineError, setInlineError] = useState('');

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineName.trim()) {
      setInlineError('Цехтин атын жазыңыз');
      return;
    }
    addWorkshop({
      name: inlineName.trim(),
      leaderName: inlineLeader.trim(),
      phone: inlinePhone.trim(),
    });
    setInlineName('');
    setInlineLeader('');
    setInlinePhone('');
    setInlineError('');
  };

  // Currently viewed workshop
  const currentWorkshopStats = useMemo(() => {
    if (!selectedWorkshopId) return null;
    return workshopStatsList.find((w) => w.workshop.id === selectedWorkshopId) || null;
  }, [selectedWorkshopId, workshopStatsList]);

  // Workers for the current workshop
  const currentWorkshopWorkers = useMemo(() => {
    if (!selectedWorkshopId) return [];
    return workerStatsList.filter((item) => {
      if (item.worker.workshopId !== selectedWorkshopId) return false;
      if (!workerInWorkshopSearch.trim()) return true;
      const q = workerInWorkshopSearch.toLowerCase();
      return (
        item.worker.fullName.toLowerCase().includes(q) ||
        item.worker.phone.includes(q) ||
        item.worker.role.toLowerCase().includes(q)
      );
    });
  }, [selectedWorkshopId, workerStatsList, workerInWorkshopSearch]);

  // Filtered workshops list for main view
  const filteredWorkshops = useMemo(() => {
    if (!workshopSearchQuery.trim()) return workshopStatsList;
    const q = workshopSearchQuery.toLowerCase();
    return workshopStatsList.filter(
      (w) =>
        w.workshop.name.toLowerCase().includes(q) ||
        w.workshop.leaderName.toLowerCase().includes(q) ||
        w.workshop.phone.includes(q)
    );
  }, [workshopStatsList, workshopSearchQuery]);

  // If a single workshop is selected, show its dedicated detailed view matching Wireframe 4
  if (currentWorkshopStats) {
    const { workshop, workerCount, debtWorkerCount, totalDebt, totalPaid, balance } = currentWorkshopStats;

    return (
      <div className="space-y-6 pb-12">
        {/* Back navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectWorkshopId(null)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Цехтер тизмесине кайтуу</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddWorkerModal(workshop.id)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Жумушчу кошуу</span>
            </button>
          </div>
        </div>

        {/* Workshop Profile Summary Header matching #1e293b dark header */}
        <div className="bg-[#1e293b] text-white p-6 rounded-2xl shadow-md border border-slate-800">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black uppercase tracking-wide text-emerald-400">
                  🏭 {workshop.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-300">
                {workshop.leaderName && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    Жетекчиси: <strong className="text-white">{workshop.leaderName}</strong>
                  </span>
                )}
                {workshop.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    Тел: <strong className="text-white font-mono">{workshop.phone}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4 Stats Cards inside workshop detail */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700/60">
              <p className="text-xs text-slate-400 font-medium">Жумушчулар:</p>
              <p className="text-xl sm:text-2xl font-black text-blue-400 mt-0.5">
                {workerCount} адам
              </p>
              <p className="text-[11px] text-rose-300 mt-1">Карызы бар: {debtWorkerCount}</p>
            </div>

            <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700/60">
              <p className="text-xs text-slate-400 font-medium">Жалпы карыз:</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {formatMoney(totalDebt)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Цех боюнча берилген</p>
            </div>

            <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700/60">
              <p className="text-xs text-slate-400 font-medium">Төлөнгөн:</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
                {formatMoney(totalPaid)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Кайтарылган сумма</p>
            </div>

            <div className="bg-slate-800/90 p-3.5 rounded-xl border border-rose-900/60">
              <p className="text-xs text-rose-300 font-medium">Калдык:</p>
              <p className="text-xl sm:text-2xl font-black text-red-500 mt-0.5">
                {formatMoney(balance)}
              </p>
              <p className="text-[11px] text-rose-400/80 mt-1">Өндүрүлүүчү калдык</p>
            </div>
          </div>
        </div>

        {/* Workers of this workshop */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={workerInWorkshopSearch}
                onChange={(e) => setWorkerInWorkshopSearch(e.target.value)}
                placeholder="🔎 Жумушчу издөө..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={() => openAddWorkerModal(workshop.id)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Жумушчу кошуу</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
                  <th className="py-3.5 px-4 sm:px-6">Аты-жөнү</th>
                  <th className="py-3.5 px-4">Кызматы</th>
                  <th className="py-3.5 px-4 text-right">Алган</th>
                  <th className="py-3.5 px-4 text-right">Төлөгөн</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Калдык</th>
                  <th className="py-3.5 px-4 text-center">Аракеттер</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {currentWorkshopWorkers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Бул цехте азырынча жумушчулар жок. "+ Жумушчу кошуу" баскычын басыңыз.
                    </td>
                  </tr>
                ) : (
                  currentWorkshopWorkers.map((item) => {
                    const hasDebt = item.balance > 0;
                    return (
                      <tr
                        key={item.worker.id}
                        className="hover:bg-slate-50/70 transition-colors group cursor-pointer border-b border-slate-50"
                        onClick={() => onSelectWorker(item.worker)}
                      >
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {item.worker.fullName}
                          </div>
                          {item.worker.phone && (
                            <div className="text-xs text-slate-400 font-mono">{item.worker.phone}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {item.worker.role || 'Тигүүчү'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                          {formatMoney(item.totalDebt)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-emerald-600">
                          {formatMoney(item.totalPaid)}
                        </td>
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
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              title="+ Карыз кошуу"
                              onClick={() => openAddDebtModal(item.worker)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="+ Төлөм кошуу"
                              onClick={() => openAddPaymentModal(item.worker)}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
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
        </div>
      </div>
    );
  }

  // Workshops Grid / List View (Wireframe 2)
  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>🏭</span> ЦЕХТЕР
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {workshops.length === 0 
              ? 'Системада азырынча цех кошула элек' 
              : `Бардык цехтердин саны: ${workshops.length}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {workshops.length > 0 && (
            <div className="relative max-w-xs hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={workshopSearchQuery}
                onChange={(e) => setWorkshopSearchQuery(e.target.value)}
                placeholder="Цех издөө..."
                className="pl-9 pr-3 py-2 bg-slate-100 rounded-full border-none text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
          )}

          <button
            id="add-new-workshop-btn"
            onClick={openAddWorkshopModal}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>[+ ЖАҢЫ ЦЕХ КОШУУ]</span>
          </button>
        </div>
      </div>

      {workshops.length === 0 ? (
        /* Empty State matching wireframe "ЖАҢЫ ЦЕХ" */
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden my-6">
          <div className="bg-[#1e293b] text-white p-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-2 shadow-md">
              🏭
            </div>
            <h3 className="text-xl font-black uppercase tracking-wider">
              ЖАҢЫ ЦЕХ
            </h3>
            <p className="text-xs text-slate-400 mt-1">Ишти баштоо үчүн цехтин атын киргизиңиз</p>
          </div>

          <form onSubmit={handleInlineSubmit} className="p-6 space-y-4">
            {inlineError && (
              <div className="p-3 bg-rose-50 text-red-600 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{inlineError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                Цехтин атын жазыңыз:
              </label>
              <input
                id="inline-workshop-name"
                type="text"
                required
                autoFocus
                value={inlineName}
                onChange={(e) => setInlineName(e.target.value)}
                placeholder="Цехтин атын жазыңыз..."
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Жетекчиси <span className="text-slate-400 font-normal text-xs">(Мастер)</span>:
              </label>
              <input
                id="inline-workshop-leader"
                type="text"
                value={inlineLeader}
                onChange={(e) => setInlineLeader(e.target.value)}
                placeholder="Жетекчинин аты-жөнү..."
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Телефон:
              </label>
              <input
                id="inline-workshop-phone"
                type="tel"
                value={inlinePhone}
                onChange={(e) => setInlinePhone(e.target.value)}
                placeholder="Телефон номери..."
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="pt-3">
              <button
                id="inline-save-workshop-btn"
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-95 uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                [ САКТОО ]
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Grid of Workshops */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkshops.map((wsStat) => {
            const { workshop, workerCount, debtWorkerCount, totalDebt, totalPaid, balance } = wsStat;
            return (
              <div
                key={workshop.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                        🏭
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {workshop.name}
                        </h3>
                        {workshop.leaderName && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-slate-400" />
                            Жетекчиси: <span className="font-semibold text-slate-700">{workshop.leaderName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {workshop.phone && (
                      <a
                        href={`tel:${workshop.phone}`}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title={workshop.phone}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Metrics Breakdown */}
                  <div className="mt-5 space-y-2.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Жумушчулар:
                      </span>
                      <span className="font-bold text-slate-900">
                        {workerCount} адам{' '}
                        {debtWorkerCount > 0 && (
                          <span className="text-red-500 font-semibold">({debtWorkerCount} карызы бар)</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Жалпы карыз:</span>
                      <span className="font-bold text-slate-800">{formatMoney(totalDebt)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Төлөнгөн:</span>
                      <span className="font-bold text-emerald-600">{formatMoney(totalPaid)}</span>
                    </div>

                    <div className="h-px bg-slate-200 my-1"></div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-extrabold text-red-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Калдык:
                      </span>
                      <span className="font-black text-red-500 text-base">{formatMoney(balance)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectWorkshopId(workshop.id)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Цехти ачуу</span>
                  </button>

                  <button
                    onClick={() => openAddWorkerModal(workshop.id)}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500" />
                    <span>Жумушчу</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
