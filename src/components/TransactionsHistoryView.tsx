import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney, formatDate, getPaymentTypeLabel } from '../utils/formatters';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Trash2, 
  Building2, 
  Calendar,
  Filter
} from 'lucide-react';

export const TransactionsHistoryView: React.FC = () => {
  const { debts, payments, workers, workshops, deleteDebt, deletePayment, confirmAction } = useApp();

  const [typeFilter, setTypeFilter] = useState<'ALL' | 'DEBT' | 'PAYMENT'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState('ALL');

  // Unified sorted chronological transaction list
  const transactions = useMemo(() => {
    const list: Array<{
      id: string;
      kind: 'debt' | 'payment';
      amount: number;
      date: string;
      workerId: string;
      workerName: string;
      workshopName: string;
      workshopId: string;
      detail: string;
      extra?: string;
      rawCreatedAt: string;
    }> = [];

    // Map debts
    debts.forEach((d) => {
      const worker = workers.find((w) => w.id === d.workerId);
      const workshop = workshops.find((ws) => ws.id === worker?.workshopId);
      list.push({
        id: d.id,
        kind: 'debt',
        amount: d.amount,
        date: d.date,
        workerId: d.workerId,
        workerName: worker?.fullName || 'Белгисиз',
        workshopName: workshop?.name || 'Белгисиз цех',
        workshopId: workshop?.id || '',
        detail: d.reason || 'Аванс / Карыз',
        extra: d.addedBy ? `Жазган: ${d.addedBy}` : undefined,
        rawCreatedAt: d.createdAt,
      });
    });

    // Map payments
    payments.forEach((p) => {
      const worker = workers.find((w) => w.id === p.workerId);
      const workshop = workshops.find((ws) => ws.id === worker?.workshopId);
      list.push({
        id: p.id,
        kind: 'payment',
        amount: p.amount,
        date: p.date,
        workerId: p.workerId,
        workerName: worker?.fullName || 'Белгисиз',
        workshopName: workshop?.name || 'Белгисиз цех',
        workshopId: workshop?.id || '',
        detail: p.note || 'Төлөндү',
        extra: `Түрү: ${getPaymentTypeLabel(p.paymentType)}`,
        rawCreatedAt: p.createdAt,
      });
    });

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [debts, payments, workers, workshops]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter === 'DEBT' && t.kind !== 'debt') return false;
      if (typeFilter === 'PAYMENT' && t.kind !== 'payment') return false;

      if (selectedWorkshop !== 'ALL' && t.workshopId !== selectedWorkshop) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          t.workerName.toLowerCase().includes(q) ||
          t.workshopName.toLowerCase().includes(q) ||
          t.detail.toLowerCase().includes(q) ||
          t.date.includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, selectedWorkshop, search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>📜</span> ТӨЛӨМ ЖАНА КАРЫЗ ТАРЫХЫ
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Бардык берилген карыздар жана кабыл алынган төлөмдөрдүн толук журналы
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Издөө (жумушчу, цех, себеби)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full border-none text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Type selector */}
        <div className="flex bg-slate-100 p-1 rounded-full text-xs font-semibold">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              typeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Бардыгы ({transactions.length})
          </button>
          <button
            onClick={() => setTypeFilter('DEBT')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              typeFilter === 'DEBT' ? 'bg-red-500 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-red-500'
            }`}
          >
            Карыздар ({debts.length})
          </button>
          <button
            onClick={() => setTypeFilter('PAYMENT')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              typeFilter === 'PAYMENT' ? 'bg-emerald-500 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Төлөмдөр ({payments.length})
          </button>
        </div>

        {/* Workshop filter */}
        <select
          value={selectedWorkshop}
          onChange={(e) => setSelectedWorkshop(e.target.value)}
          className="bg-slate-100 border-none text-slate-700 text-xs sm:text-sm font-semibold rounded-full px-3.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
        >
          <option value="ALL">Бардык цехтер</option>
          {workshops.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name}
            </option>
          ))}
        </select>
      </div>

      {/* History table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="py-3.5 px-4 sm:px-6">Дата</th>
                <th className="py-3.5 px-4">Түрү</th>
                <th className="py-3.5 px-4">Жумушчу</th>
                <th className="py-3.5 px-4">Цех</th>
                <th className="py-3.5 px-4">Себеби / Эскертүү</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Сумма</th>
                <th className="py-3.5 px-4 text-center">Өчүрүү</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Операциялар табылган жок
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const isDebt = t.kind === 'debt';
                  return (
                    <tr key={`${t.kind}-${t.id}`} className="hover:bg-slate-50/70 transition-colors border-b border-slate-50">
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-500 text-xs">
                        {formatDate(t.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        {isDebt ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-red-500 border border-rose-100">
                            <ArrowUpRight className="w-3 h-3 text-red-500" />
                            Карыз (Аванс)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-500" />
                            Төлөм
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {t.workerName}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        {t.workshopName}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-700">
                        <div>{t.detail}</div>
                        {t.extra && <div className="text-[11px] text-slate-400">{t.extra}</div>}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-bold">
                        {isDebt ? (
                          <span className="text-red-500 font-black text-sm">
                            +{formatMoney(t.amount)}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-black text-sm">
                            -{formatMoney(t.amount)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          title="Өчүрүү"
                          onClick={() => {
                            confirmAction({
                              title: isDebt ? 'Карыз жазуусун өчүрүү' : 'Төлөм жазуусун өчүрүү',
                              message: `Бул ${isDebt ? 'карыз' : 'төлөм'} жазуусун (${t.workerName}, ${formatMoney(t.amount)}) өчүрүүнү каалайсызбы?`,
                              confirmText: 'Өчүрүү',
                              onConfirm: () => {
                                if (isDebt) deleteDebt(t.id);
                                else deletePayment(t.id);
                              },
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
};
