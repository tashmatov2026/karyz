import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Users, 
  CreditCard, 
  History, 
  PlusCircle, 
  LogOut, 
  RotateCcw, 
  Download, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';

interface NavbarProps {
  activeTab: 'debts' | 'workshops' | 'workers' | 'history' | 'reports';
  setActiveTab: (tab: 'debts' | 'workshops' | 'workers' | 'history' | 'reports') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { 
    currentUser, 
    logout, 
    overallStats, 
    resetToDefaultData,
    openAddDebtModal,
    openAddPaymentModal,
    openAddWorkerModal,
    openAddWorkshopModal,
    workerStatsList,
    workshops,
    confirmAction
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleExportCsv = () => {
    // Generate CSV for export
    const headers = ['Жумушчу', 'Телефон', 'Кызматы', 'Цех', 'Жалпы алган (сом)', 'Төлөгөн (сом)', 'Калдык (сом)', 'Статус'];
    const rows = workerStatsList.map(s => [
      `"${s.worker.fullName}"`,
      `"${s.worker.phone || '-'}"`,
      `"${s.worker.role || '-'}"`,
      `"${s.workshopName}"`,
      s.totalDebt,
      s.totalPaid,
      s.balance,
      s.balance > 0 ? 'Карызы бар' : 'Толук төлөнгөн'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Тигуу_цехтери_карыздар_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="bg-[#1e293b] text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('debts')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-xl">
              🏭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white">
                  КАРЫЗДАР
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                  Цехтер системасы
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Тигүү цехтеринин карыз жана төлөм эсеби
              </p>
            </div>
          </div>

          {/* Quick Summary Pill (Medium+ screens) */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-800/90 px-4 py-1.5 rounded-full border border-slate-700/80 text-xs shadow-inner">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-400 font-medium">Жалпы:</span>
              <span className="font-bold text-white">{formatMoney(overallStats.totalDebt)}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Төлөндү:</span>
              <span className="font-bold">{formatMoney(overallStats.totalPaid)}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Калдык:</span>
              <span className="font-bold">{formatMoney(overallStats.totalBalance)}</span>
            </div>
          </div>

          {/* Action Buttons & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Add Dropdown */}
            <div className="relative">
              <button
                id="quick-add-button"
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">+ Кошуу</span>
              </button>

              {showQuickAdd && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-slate-800"
                  onClick={() => setShowQuickAdd(false)}
                >
                  <button
                    id="nav-quick-add-debt"
                    onClick={() => openAddDebtModal()}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-rose-50 text-rose-700 flex items-center gap-2.5 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    + Карыз кошуу (Аванс)
                  </button>
                  <button
                    id="nav-quick-add-payment"
                    onClick={() => openAddPaymentModal()}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-emerald-50 text-emerald-700 flex items-center gap-2.5 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    + Төлөм кошуу (Кайтаруу)
                  </button>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button
                    id="nav-quick-add-worker"
                    onClick={() => openAddWorkerModal()}
                    className="w-full px-4 py-2 text-left text-xs font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2.5"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    + Жаңы жумушчу
                  </button>
                  <button
                    id="nav-quick-add-workshop"
                    onClick={() => openAddWorkshopModal()}
                    className="w-full px-4 py-2 text-left text-xs font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2.5"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    + Жаңы цех
                  </button>
                </div>
              )}
            </div>

            {/* Admin Profile Badge */}
            <div className="relative">
              <button
                id="admin-menu-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 px-3 py-2 rounded-xl text-sm border border-slate-700 text-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  👤
                </div>
                <span className="font-semibold text-xs sm:text-sm">{currentUser}</span>
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 text-slate-800"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Системага кирген колдонуучу:</p>
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      👤 {currentUser}
                    </p>
                  </div>
                  
                  <button
                    id="export-excel-btn"
                    onClick={handleExportCsv}
                    className="w-full px-4 py-2 text-left text-xs font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Excel / CSV жүктөп алуу
                  </button>

                  <button
                    id="reset-demo-data-btn"
                    onClick={() => {
                      setShowUserMenu(false);
                      confirmAction({
                        title: 'Демо маалыматтарды баштапкы абалга кайтаруу',
                        message: 'Бардык өзгөртүүлөр өчүп, баштапкы үлгү маалыматтар калыбына келет. Улантууну каалайсызбы?',
                        confirmText: 'Калыбына келтирүү',
                        onConfirm: () => resetToDefaultData(),
                      });
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium hover:bg-emerald-50 text-emerald-700 flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-600" />
                    Демо маалыматтарды жаңылоо
                  </button>

                  <div className="h-px bg-slate-100 my-1"></div>

                  <button
                    id="logout-btn"
                    onClick={logout}
                    className="w-full px-4 py-2 text-left text-xs font-medium hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Чыгуу (Логин экраны)
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex space-x-1 py-2 border-t border-slate-800/80">
          <button
            id="tab-nav-debts"
            onClick={() => setActiveTab('debts')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'debts'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <span>🏭</span>
            КАРЫЗДАР
            {overallStats.debtWorkersCount > 0 && (
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'debts' ? 'bg-emerald-700 text-white' : 'bg-rose-500/30 text-rose-300'
              }`}>
                {overallStats.debtWorkersCount}
              </span>
            )}
          </button>

          <button
            id="tab-nav-workshops"
            onClick={() => setActiveTab('workshops')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'workshops'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Building2 className="w-4 h-4" />
            ЦЕХТЕР
            <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'workshops' ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              {workshops.length}
            </span>
          </button>

          <button
            id="tab-nav-workers"
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'workers'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Users className="w-4 h-4" />
            ЖУМУШЧУЛАР
            <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'workers' ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              {workerStatsList.length}
            </span>
          </button>

          <button
            id="tab-nav-history"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <History className="w-4 h-4" />
            ТӨЛӨМ ЖАНА КАРЫЗ ТАРЫХЫ
          </button>
        </nav>
      </div>

      {/* Mobile navigation drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-1">
          <button
            id="mobile-tab-debts"
            onClick={() => { setActiveTab('debts'); setIsMenuOpen(false); }}
            className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium flex items-center justify-between ${
              activeTab === 'debts' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">🏭 КАРЫЗДАР</span>
            <span className="text-xs bg-slate-950/40 px-2 py-0.5 rounded-full">{overallStats.debtWorkersCount}</span>
          </button>

          <button
            id="mobile-tab-workshops"
            onClick={() => { setActiveTab('workshops'); setIsMenuOpen(false); }}
            className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium flex items-center justify-between ${
              activeTab === 'workshops' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2"><Building2 className="w-4 h-4" /> ЦЕХТЕР</span>
            <span className="text-xs bg-slate-950/40 px-2 py-0.5 rounded-full">{workshops.length}</span>
          </button>

          <button
            id="mobile-tab-workers"
            onClick={() => { setActiveTab('workers'); setIsMenuOpen(false); }}
            className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium flex items-center justify-between ${
              activeTab === 'workers' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> ЖУМУШЧУЛАР</span>
            <span className="text-xs bg-slate-950/40 px-2 py-0.5 rounded-full">{workerStatsList.length}</span>
          </button>

          <button
            id="mobile-tab-history"
            onClick={() => { setActiveTab('history'); setIsMenuOpen(false); }}
            className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium flex items-center gap-2 ${
              activeTab === 'history' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" /> ТАРЫХ (Операциялар)
          </button>
        </div>
      )}
    </header>
  );
};
