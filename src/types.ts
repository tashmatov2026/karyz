export interface Workshop {
  id: string;
  name: string;
  leaderName: string;
  phone: string;
  createdAt: string;
}

export interface Worker {
  id: string;
  fullName: string;
  phone: string;
  role: string;
  workshopId: string;
  createdAt: string;
  notes?: string;
}

export interface DebtRecord {
  id: string;
  workerId: string;
  amount: number;
  date: string;
  reason: string;
  createdAt: string;
  addedBy?: string;
}

export interface PaymentRecord {
  id: string;
  workerId: string;
  amount: number;
  date: string;
  paymentType: 'salary_deduction' | 'cash' | 'card' | 'mbank' | 'other';
  note: string;
  createdAt: string;
  receivedBy?: string;
}

export interface WorkerStats {
  worker: Worker;
  workshopName: string;
  totalDebt: number;
  totalPaid: number;
  balance: number;
  hasDebt: boolean;
  debtRecords: DebtRecord[];
  paymentRecords: PaymentRecord[];
}

export interface WorkshopStats {
  workshop: Workshop;
  workerCount: number;
  debtWorkerCount: number;
  totalDebt: number;
  totalPaid: number;
  balance: number;
}

export interface OverallStats {
  totalDebt: number;
  totalPaid: number;
  totalBalance: number;
  totalWorkers: number;
  debtWorkersCount: number;
  totalWorkshops: number;
}
