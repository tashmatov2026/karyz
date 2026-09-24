import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Workshop, Worker, DebtRecord, PaymentRecord, WorkerStats, WorkshopStats, OverallStats } from '../types';
import { INITIAL_WORKSHOPS, INITIAL_WORKERS, INITIAL_DEBTS, INITIAL_PAYMENTS } from '../data/initialData';

interface AppContextType {
  workshops: Workshop[];
  workers: Worker[];
  debts: DebtRecord[];
  payments: PaymentRecord[];
  isLoggedIn: boolean;
  currentUser: string;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  
  // Workshop CRUD
  addWorkshop: (workshop: Omit<Workshop, 'id' | 'createdAt'>) => Workshop;
  updateWorkshop: (id: string, data: Partial<Workshop>) => void;
  deleteWorkshop: (id: string) => void;
  
  // Worker CRUD
  addWorker: (
    worker: Omit<Worker, 'id' | 'createdAt'>,
    initialDebt?: { amount: number; reason: string; date: string }
  ) => Worker;
  updateWorker: (id: string, data: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  
  // Debt & Payment
  addDebt: (debt: Omit<DebtRecord, 'id' | 'createdAt' | 'addedBy'>) => DebtRecord;
  deleteDebt: (id: string) => void;
  addPayment: (payment: Omit<PaymentRecord, 'id' | 'createdAt' | 'receivedBy'>) => PaymentRecord;
  deletePayment: (id: string) => void;
  
  // Statistics
  getWorkerStats: (workerId: string) => WorkerStats | undefined;
  workerStatsList: WorkerStats[];
  workshopStatsList: WorkshopStats[];
  overallStats: OverallStats;
  
  // Reset
  resetToDefaultData: () => void;
  
  // Active selection states
  selectedWorkerForDetail: Worker | null;
  setSelectedWorkerForDetail: (worker: Worker | null) => void;
  
  // Modals visibility
  modalState: {
    addDebt: boolean;
    addPayment: boolean;
    addWorker: boolean;
    addWorkshop: boolean;
    receipt: boolean;
    targetWorker: Worker | null;
    targetWorkshopId?: string;
  };
  openAddDebtModal: (worker?: Worker) => void;
  openAddPaymentModal: (worker?: Worker) => void;
  openAddWorkerModal: (workshopId?: string) => void;
  openAddWorkshopModal: () => void;
  openReceiptModal: (worker: Worker) => void;
  closeModals: () => void;

  // Confirm Modal
  confirmModalState: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  };
  confirmAction: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => void;
  closeConfirmModal: () => void;
}

const STORAGE_KEYS = {
  WORKSHOPS: 'karyzdar_workshops_v2',
  WORKERS: 'karyzdar_workers_v2',
  DEBTS: 'karyzdar_debts_v2',
  PAYMENTS: 'karyzdar_payments_v2',
  AUTH: 'karyzdar_auth_v2',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKSHOPS);
      return saved ? JSON.parse(saved) : INITIAL_WORKSHOPS;
    } catch {
      return INITIAL_WORKSHOPS;
    }
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKERS);
      return saved ? JSON.parse(saved) : INITIAL_WORKERS;
    } catch {
      return INITIAL_WORKERS;
    }
  });

  const [debts, setDebts] = useState<DebtRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEBTS);
      return saved ? JSON.parse(saved) : INITIAL_DEBTS;
    } catch {
      return INITIAL_DEBTS;
    }
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      return saved ? JSON.parse(saved).isLoggedIn : true; // Default logged in for smooth immediate preview
    } catch {
      return true;
    }
  });

  const [currentUser, setCurrentUser] = useState<string>('Админ');
  const [selectedWorkerForDetail, setSelectedWorkerForDetail] = useState<Worker | null>(null);

  const [modalState, setModalState] = useState<{
    addDebt: boolean;
    addPayment: boolean;
    addWorker: boolean;
    addWorkshop: boolean;
    receipt: boolean;
    targetWorker: Worker | null;
    targetWorkshopId?: string;
  }>({
    addDebt: false,
    addPayment: false,
    addWorker: false,
    addWorkshop: false,
    receipt: false,
    targetWorker: null,
    targetWorkshopId: undefined,
  });

  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Өчүрүү',
    cancelText: 'Жокко чыгаруу',
    onConfirm: () => {},
  });

  const confirmAction = (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => {
    setConfirmModalState({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || 'Өчүрүү',
      cancelText: options.cancelText || 'Жокко чыгаруу',
      onConfirm: options.onConfirm,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(workshops));
    } catch (e) {
      console.error(e);
    }
  }, [workshops]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
    } catch (e) {
      console.error(e);
    }
  }, [workers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
    } catch (e) {
      console.error(e);
    }
  }, [debts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (e) {
      console.error(e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ isLoggedIn, currentUser }));
    } catch (e) {
      console.error(e);
    }
  }, [isLoggedIn, currentUser]);

  const login = (username: string, pass: string) => {
    if (username.trim()) {
      setIsLoggedIn(true);
      setCurrentUser(username.trim() === 'admin' ? 'Админ' : username.trim());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  // Workshop Actions
  const addWorkshop = (workshopData: Omit<Workshop, 'id' | 'createdAt'>): Workshop => {
    const newWs: Workshop = {
      ...workshopData,
      id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setWorkshops((prev) => [...prev, newWs]);
    return newWs;
  };

  const updateWorkshop = (id: string, data: Partial<Workshop>) => {
    setWorkshops((prev) => prev.map((ws) => (ws.id === id ? { ...ws, ...data } : ws)));
  };

  const deleteWorkshop = (id: string) => {
    setWorkshops((prev) => prev.filter((ws) => ws.id !== id));
  };

  // Worker Actions
  const addWorker = (
    workerData: Omit<Worker, 'id' | 'createdAt'>,
    initialDebt?: { amount: number; reason: string; date: string }
  ): Worker => {
    const newWorkerId = `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newWorker: Worker = {
      ...workerData,
      id: newWorkerId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setWorkers((prev) => [...prev, newWorker]);

    if (initialDebt && initialDebt.amount > 0) {
      addDebt({
        workerId: newWorkerId,
        amount: initialDebt.amount,
        date: initialDebt.date || new Date().toISOString().split('T')[0],
        reason: initialDebt.reason || 'Баштапкы карыз',
      });
    }

    return newWorker;
  };

  const updateWorker = (id: string, data: Partial<Worker>) => {
    setWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)));
    if (selectedWorkerForDetail && selectedWorkerForDetail.id === id) {
      setSelectedWorkerForDetail((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  const deleteWorker = (id: string) => {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
    setDebts((prev) => prev.filter((d) => d.workerId !== id));
    setPayments((prev) => prev.filter((p) => p.workerId !== id));
    if (selectedWorkerForDetail?.id === id) {
      setSelectedWorkerForDetail(null);
    }
  };

  // Debt Actions
  const addDebt = (debtData: Omit<DebtRecord, 'id' | 'createdAt' | 'addedBy'>): DebtRecord => {
    const newDebt: DebtRecord = {
      ...debtData,
      id: `d-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      addedBy: currentUser,
    };
    setDebts((prev) => [newDebt, ...prev]);
    return newDebt;
  };

  const deleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  // Payment Actions
  const addPayment = (paymentData: Omit<PaymentRecord, 'id' | 'createdAt' | 'receivedBy'>): PaymentRecord => {
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      receivedBy: currentUser,
    };
    setPayments((prev) => [newPayment, ...prev]);
    return newPayment;
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  // Reset
  const resetToDefaultData = () => {
    setWorkshops(INITIAL_WORKSHOPS);
    setWorkers(INITIAL_WORKERS);
    setDebts(INITIAL_DEBTS);
    setPayments(INITIAL_PAYMENTS);
    setSelectedWorkerForDetail(null);
  };

  // Worker Stats Calculator
  const getWorkerStats = (workerId: string): WorkerStats | undefined => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return undefined;

    const workshop = workshops.find((ws) => ws.id === worker.workshopId);
    const workerDebts = debts
      .filter((d) => d.workerId === workerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const workerPayments = payments
      .filter((p) => p.workerId === workerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalDebt = workerDebts.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const totalPaid = workerPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const balance = Math.max(0, totalDebt - totalPaid);

    return {
      worker,
      workshopName: workshop ? workshop.name : 'Белгисиз цех',
      totalDebt,
      totalPaid,
      balance,
      hasDebt: balance > 0,
      debtRecords: workerDebts,
      paymentRecords: workerPayments,
    };
  };

  const workerStatsList = useMemo(() => {
    return workers.map((w) => {
      const stats = getWorkerStats(w.id);
      if (stats) return stats;
      const ws = workshops.find((item) => item.id === w.workshopId);
      return {
        worker: w,
        workshopName: ws?.name || 'Белгисиз цех',
        totalDebt: 0,
        totalPaid: 0,
        balance: 0,
        hasDebt: false,
        debtRecords: [],
        paymentRecords: [],
      };
    });
  }, [workers, workshops, debts, payments]);

  const workshopStatsList = useMemo(() => {
    return workshops.map((ws) => {
      const wsWorkers = workers.filter((w) => w.workshopId === ws.id);
      let totalDebt = 0;
      let totalPaid = 0;
      let debtWorkerCount = 0;

      wsWorkers.forEach((w) => {
        const stats = getWorkerStats(w.id);
        if (stats) {
          totalDebt += stats.totalDebt;
          totalPaid += stats.totalPaid;
          if (stats.balance > 0) {
            debtWorkerCount += 1;
          }
        }
      });

      return {
        workshop: ws,
        workerCount: wsWorkers.length,
        debtWorkerCount,
        totalDebt,
        totalPaid,
        balance: Math.max(0, totalDebt - totalPaid),
      };
    });
  }, [workshops, workers, debts, payments]);

  const overallStats: OverallStats = useMemo(() => {
    let totalDebt = 0;
    let totalPaid = 0;
    let debtWorkersCount = 0;

    workerStatsList.forEach((stat) => {
      totalDebt += stat.totalDebt;
      totalPaid += stat.totalPaid;
      if (stat.balance > 0) {
        debtWorkersCount += 1;
      }
    });

    return {
      totalDebt,
      totalPaid,
      totalBalance: Math.max(0, totalDebt - totalPaid),
      totalWorkers: workers.length,
      debtWorkersCount,
      totalWorkshops: workshops.length,
    };
  }, [workerStatsList, workers.length, workshops.length]);

  // Modal helpers
  const openAddDebtModal = (worker?: Worker) => {
    setModalState({
      addDebt: true,
      addPayment: false,
      addWorker: false,
      addWorkshop: false,
      receipt: false,
      targetWorker: worker || selectedWorkerForDetail || (workers.length > 0 ? workers[0] : null),
    });
  };

  const openAddPaymentModal = (worker?: Worker) => {
    setModalState({
      addDebt: false,
      addPayment: true,
      addWorker: false,
      addWorkshop: false,
      receipt: false,
      targetWorker: worker || selectedWorkerForDetail || (workers.length > 0 ? workers[0] : null),
    });
  };

  const openAddWorkerModal = (workshopId?: string) => {
    setModalState({
      addDebt: false,
      addPayment: false,
      addWorker: true,
      addWorkshop: false,
      receipt: false,
      targetWorker: null,
      targetWorkshopId: workshopId,
    });
  };

  const openAddWorkshopModal = () => {
    setModalState({
      addDebt: false,
      addPayment: false,
      addWorker: false,
      addWorkshop: true,
      receipt: false,
      targetWorker: null,
    });
  };

  const openReceiptModal = (worker: Worker) => {
    setModalState({
      addDebt: false,
      addPayment: false,
      addWorker: false,
      addWorkshop: false,
      receipt: true,
      targetWorker: worker,
    });
  };

  const closeModals = () => {
    setModalState({
      addDebt: false,
      addPayment: false,
      addWorker: false,
      addWorkshop: false,
      receipt: false,
      targetWorker: null,
      targetWorkshopId: undefined,
    });
  };

  return (
    <AppContext.Provider
      value={{
        workshops,
        workers,
        debts,
        payments,
        isLoggedIn,
        currentUser,
        login,
        logout,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        addWorker,
        updateWorker,
        deleteWorker,
        addDebt,
        deleteDebt,
        addPayment,
        deletePayment,
        getWorkerStats,
        workerStatsList,
        workshopStatsList,
        overallStats,
        resetToDefaultData,
        selectedWorkerForDetail,
        setSelectedWorkerForDetail,
        modalState,
        openAddDebtModal,
        openAddPaymentModal,
        openAddWorkerModal,
        openAddWorkshopModal,
        openReceiptModal,
        closeModals,
        confirmModalState,
        confirmAction,
        closeConfirmModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
