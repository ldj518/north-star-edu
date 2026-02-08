// Local Storage Helpers for Data Persistence

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: Date;
  category: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  taskName: string;
  status: 'completed' | 'abandoned';
  duration: number; // seconds
  reward: number;
  timestamp: Date;
}

const STORAGE_KEYS = {
  TRANSACTIONS: 'northstar_transactions',
  TASK_HISTORY: 'northstar_task_history',
  MARKET_PURCHASES: 'northstar_purchases',
};

// Transactions
export const saveTransaction = (transaction: Transaction) => {
  const history = getTransactions();
  history.unshift(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(history));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (!data) return [];
  
  return JSON.parse(data).map((t: any) => ({
    ...t,
    timestamp: new Date(t.timestamp)
  }));
};

// Task History
export const saveTaskHistory = (history: TaskHistory) => {
  const all = getTaskHistory();
  all.unshift(history);
  localStorage.setItem(STORAGE_KEYS.TASK_HISTORY, JSON.stringify(all));
};

export const getTaskHistory = (): TaskHistory[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TASK_HISTORY);
  if (!data) return [];
  
  return JSON.parse(data).map((t: any) => ({
    ...t,
    timestamp: new Date(t.timestamp)
  }));
};

// Market Purchases
export const savePurchase = (item: { name: string; cost: number }) => {
  const purchases = getPurchases();
  const purchase = {
    id: Date.now().toString(),
    ...item,
    timestamp: new Date()
  };
  purchases.unshift(purchase);
  localStorage.setItem(STORAGE_KEYS.MARKET_PURCHASES, JSON.stringify(purchases));
};

export const getPurchases = () => {
  const data = localStorage.getItem(STORAGE_KEYS.MARKET_PURCHASES);
  return data ? JSON.parse(data) : [];
};

// Stats
export const getStats = () => {
  const transactions = getTransactions();
  const taskHistory = getTaskHistory();
  
  const totalEarned = transactions
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalSpent = transactions
    .filter(t => t.type === 'spend')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalFocusTime = taskHistory
    .reduce((sum, t) => sum + t.duration, 0);
    
  const completedTasks = taskHistory.filter(t => t.status === 'completed').length;
  
  return {
    totalEarned,
    totalSpent,
    totalFocusTime,
    completedTasks,
    averageTaskDuration: completedTasks > 0 
      ? totalFocusTime / completedTasks 
      : 0
  };
};
