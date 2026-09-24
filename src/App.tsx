import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { WorkshopsView } from './components/WorkshopsView';
import { WorkersListView } from './components/WorkersListView';
import { TransactionsHistoryView } from './components/TransactionsHistoryView';
import { WorkerDetailModal } from './components/WorkerDetailModal';
import { AddDebtModal } from './components/AddDebtModal';
import { AddPaymentModal } from './components/AddPaymentModal';
import { AddWorkerModal } from './components/AddWorkerModal';
import { AddWorkshopModal } from './components/AddWorkshopModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ConfirmModal } from './components/ConfirmModal';
import { LoginView } from './components/LoginView';
import { Worker } from './types';

const MainAppContent: React.FC = () => {
  const { 
    isLoggedIn, 
    modalState, 
    closeModals, 
    selectedWorkerForDetail, 
    setSelectedWorkerForDetail 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'debts' | 'workshops' | 'workers' | 'history' | 'reports'>('debts');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

  if (!isLoggedIn) {
    return <LoginView />;
  }

  const handleSelectWorker = (worker: Worker) => {
    setSelectedWorkerForDetail(worker);
  };

  const handleSelectWorkshop = (workshopId: string) => {
    setSelectedWorkshopId(workshopId);
    setActiveTab('workshops');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] flex flex-col selection:bg-emerald-500 selection:text-white font-sans">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'debts' && (
          <DashboardView
            onSelectWorker={handleSelectWorker}
            onSelectWorkshop={handleSelectWorkshop}
          />
        )}

        {activeTab === 'workshops' && (
          <WorkshopsView
            selectedWorkshopId={selectedWorkshopId}
            onSelectWorkshopId={setSelectedWorkshopId}
            onSelectWorker={handleSelectWorker}
          />
        )}

        {activeTab === 'workers' && (
          <WorkersListView
            onSelectWorker={handleSelectWorker}
            onSelectWorkshop={handleSelectWorkshop}
          />
        )}

        {activeTab === 'history' && (
          <TransactionsHistoryView />
        )}
      </main>

      {/* Footer matching Vibrant Palette design */}
      <footer className="bg-slate-50 border-t border-slate-200 py-3.5 mt-auto text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] uppercase tracking-wider font-medium">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Тигүү цехтеринин карыз жана төлөм системасы &copy; 2026
          </span>
          <span className="text-slate-400">
            Маалыматтар коопсуз сакталат • Кыргызстан
          </span>
        </div>
      </footer>

      {/* Worker Detail Modal */}
      {selectedWorkerForDetail && (
        <WorkerDetailModal
          worker={selectedWorkerForDetail}
          onClose={() => setSelectedWorkerForDetail(null)}
        />
      )}

      {/* Global Modals */}
      <AddDebtModal
        isOpen={modalState.addDebt}
        onClose={closeModals}
        targetWorker={modalState.targetWorker}
      />

      <AddPaymentModal
        isOpen={modalState.addPayment}
        onClose={closeModals}
        targetWorker={modalState.targetWorker}
      />

      <AddWorkerModal
        isOpen={modalState.addWorker}
        onClose={closeModals}
        targetWorkshopId={modalState.targetWorkshopId}
      />

      <AddWorkshopModal
        isOpen={modalState.addWorkshop}
        onClose={closeModals}
      />

      <ReceiptModal
        isOpen={modalState.receipt}
        onClose={closeModals}
        worker={modalState.targetWorker}
      />

      <ConfirmModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
