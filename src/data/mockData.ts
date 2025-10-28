// Mock data for development and testing
// In production, this data would come from Firebase/API

import { Transaction, UserProfile, ServiceBalance, BankAccount } from '../types';

export const mockUserProfile: UserProfile = {
  uid: 'user_123',
  name: 'Andrew',
  email: 'andrew@example.com',
  phoneNumber: '+254700000000',
  balance: 15420.00,
  lastLogin: new Date().toISOString(),
  profilePicture: null,
  isVerified: true,
  preferences: {
    notifications: true,
    biometric: false,
    darkMode: false,
  },
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'received',
    amount: 5000,
    description: 'Payment from Jane Smith',
    recipient: 'Jane Smith',
    date: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    status: 'completed',
    reference: 'MP2401151430'
  },
  {
    id: '2',
    type: 'airtime',
    amount: 100,
    description: 'Airtime Purchase',
    date: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    status: 'completed'
  },
  {
    id: '3',
    type: 'data',
    amount: 250,
    description: '2.5GB Data Bundle',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    status: 'completed'
  },
  {
    id: '4',
    type: 'sent',
    amount: 1500,
    description: 'Send Money to John Doe',
    recipient: 'John Doe',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    status: 'completed',
    reference: 'MP2401141020'
  },
  {
    id: '5',
    type: 'bill',
    amount: 850,
    description: 'KPLC Bill Payment',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'pending'
  },
  {
    id: '6',
    type: 'withdrawal',
    amount: 2000,
    description: 'ATM Withdrawal',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'completed'
  },
  {
    id: '7',
    type: 'received',
    amount: 3000,
    description: 'Payment from Business',
    recipient: 'Business Partner',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'completed',
    reference: 'MP2401121000'
  },
];

export const mockServiceBalances: ServiceBalance = {
  data: {
    amount: '2.5 GB',
    expiry: '2024-02-15',
    plan: 'Monthly Bundle'
  },
  sms: {
    amount: '100 SMS',
    expiry: '2024-02-20',
    plan: 'SMS 100'
  },
  bonga: {
    amount: '2,500 pts',
    expiry: null,
    plan: 'Points Balance'
  },
  voice: {
    amount: '50 minutes',
    expiry: '2024-02-10',
    plan: 'Voice Bundle'
  }
};

export const mockBankAccounts: BankAccount[] = [
  {
    id: 'bank_1',
    bankName: 'KCB Bank',
    accountNumber: '1234567890',
    accountName: 'Andrew Mwangi',
    balance: 45230.00,
    accountType: 'Savings',
    isVerified: true,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'bank_2',
    bankName: 'Equity Bank',
    accountNumber: '0987654321',
    accountName: 'Andrew Mwangi',
    balance: 12500.00,
    accountType: 'Current',
    isVerified: true,
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'bank_3',
    bankName: 'Cooperative Bank',
    accountNumber: '1122334455',
    accountName: 'Andrew Mwangi',
    balance: 8750.00,
    accountType: 'Savings',
    isVerified: true,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockDataPlans = [
  {
    id: 'data1',
    name: 'Daily Bundle',
    price: 50,
    description: '100MB + 50MB YouTube',
    validity: '24 hours',
    size: '150MB',
    popular: false,
    category: 'data'
  },
  {
    id: 'data2',
    name: 'Weekly Bundle',
    price: 250,
    description: '1GB + 500MB YouTube',
    validity: '7 days',
    size: '1.5GB',
    popular: true,
    category: 'data'
  },
  {
    id: 'data3',
    name: 'Monthly Bundle',
    price: 1000,
    description: '5GB + 2GB YouTube + WhatsApp',
    validity: '30 days',
    size: '7GB',
    popular: false,
    category: 'data'
  },
  {
    id: 'data4',
    name: 'Super Bundle',
    price: 2000,
    description: '15GB + 5GB YouTube + Facebook',
    validity: '30 days',
    size: '20GB',
    popular: false,
    category: 'data'
  }
];

export const mockSmsPlans = [
  {
    id: 'sms1',
    name: 'SMS 50',
    price: 30,
    description: '50 SMS messages',
    validity: '7 days',
    count: 50,
    popular: false,
    category: 'sms'
  },
  {
    id: 'sms2',
    name: 'SMS 100',
    price: 50,
    description: '100 SMS messages',
    validity: '14 days',
    count: 100,
    popular: true,
    category: 'sms'
  },
  {
    id: 'sms3',
    name: 'SMS 500',
    price: 200,
    description: '500 SMS messages',
    validity: '30 days',
    count: 500,
    popular: false,
    category: 'sms'
  }
];

export const mockBongaPlans = [
  {
    id: 'bonga1',
    name: 'Points Purchase',
    price: 100,
    description: 'Buy Bonga Points',
    count: 100,
    popular: false,
    category: 'bonga'
  },
  {
    id: 'bonga2',
    name: 'Points Purchase',
    price: 500,
    description: 'Buy Bonga Points',
    count: 550,
    popular: true,
    category: 'bonga'
  },
  {
    id: 'bonga3',
    name: 'Points Purchase',
    price: 1000,
    description: 'Buy Bonga Points',
    count: 1200,
    popular: false,
    category: 'bonga'
  }
];

// Quick access items configuration
export const quickAccessItems = [
  {
    id: 'send-money',
    title: 'Send Money',
    subtitle: 'Transfer to M-Pesa',
    icon: 'send' as const,
    color: '#2BB673',
    gradient: ['#2BB673', '#1E8B5A'],
    route: 'SendMoney',
  },
  {
    id: 'buy-airtime',
    title: 'Buy Airtime',
    subtitle: 'Top up your phone',
    icon: 'phone-portrait' as const,
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF5252'],
    route: 'BuyAirtime',
  },
  {
    id: 'pay-bill',
    title: 'Pay Bill',
    subtitle: 'Utilities & services',
    icon: 'receipt' as const,
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#26A69A'],
    route: 'PayBill',
  },
  {
    id: 'withdraw-cash',
    title: 'Withdraw Cash',
    subtitle: 'ATM withdrawal',
    icon: 'card' as const,
    color: '#45B7D1',
    gradient: ['#45B7D1', '#2196F3'],
    route: 'WithdrawCash',
  },
  {
    id: 'bonga-points',
    title: 'Bonga Points',
    subtitle: 'Loyalty rewards',
    icon: 'gift' as const,
    color: '#96CEB4',
    gradient: ['#96CEB4', '#4CAF50'],
    route: 'BongaPoints',
  },
  {
    id: 'bank-services',
    title: 'Bank Services',
    subtitle: 'Transfer to/from bank',
    icon: 'business' as const,
    color: '#FFEAA7',
    gradient: ['#FFEAA7', '#FFC107'],
    route: 'BankServices',
  },
  {
    id: 'buy-data',
    title: 'Buy Data',
    subtitle: 'Data bundles',
    icon: 'wifi' as const,
    color: '#DDA0DD',
    gradient: ['#DDA0DD', '#9C27B0'],
    route: 'BuyData',
  },
  {
    id: 'transaction-history',
    title: 'History',
    subtitle: 'View transactions',
    icon: 'time' as const,
    color: '#FFB6C1',
    gradient: ['#FFB6C1', '#E91E63'],
    route: 'TransactionHistory',
  },
];

// Transaction statistics
export const getTransactionStats = (transactions: Transaction[]) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const thisWeekTransactions = transactions.filter(t => 
    new Date(t.date) >= oneWeekAgo
  );

  const totalReceived = thisWeekTransactions
    .filter(t => t.type === 'received' || t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSent = thisWeekTransactions
    .filter(t => ['sent', 'airtime', 'data', 'bill', 'withdrawal'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalReceived,
    totalSent,
    netAmount: totalReceived - totalSent,
    transactionCount: thisWeekTransactions.length,
    completedTransactions: thisWeekTransactions.filter(t => t.status === 'completed').length,
    pendingTransactions: thisWeekTransactions.filter(t => t.status === 'pending').length,
  };
};

// Service statistics
export const getServiceStats = (balances: ServiceBalance) => {
  return {
    hasDataBalance: balances.data.amount !== '0 GB',
    hasSmsBalance: balances.sms.amount !== '0 SMS',
    hasBongaPoints: parseInt(balances.bonga.amount.replace(/[^\d]/g, '')) > 0,
    totalServices: Object.keys(balances).length,
  };
};

export default {
  mockUserProfile,
  mockTransactions,
  mockServiceBalances,
  mockBankAccounts,
  mockDataPlans,
  mockSmsPlans,
  mockBongaPlans,
  quickAccessItems,
  getTransactionStats,
  getServiceStats,
};
