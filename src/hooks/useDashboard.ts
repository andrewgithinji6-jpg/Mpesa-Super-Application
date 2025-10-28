import { useState, useEffect, useCallback } from 'react';
import { 
  mockUserProfile, 
  mockTransactions, 
  mockServiceBalances,
  getTransactionStats 
} from '../data/mockData';
import { UserProfile, Transaction, ServiceBalance, TransactionStats } from '../types';

interface DashboardState {
  userProfile: UserProfile;
  transactions: Transaction[];
  serviceBalances: ServiceBalance;
  transactionStats: TransactionStats;
  isLoading: boolean;
  error: string | null;
}

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    userProfile: mockUserProfile,
    transactions: mockTransactions,
    serviceBalances: mockServiceBalances,
    transactionStats: getTransactionStats(mockTransactions),
    isLoading: false,
    error: null,
  });

  // Refresh dashboard data
  const refreshData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would fetch from Firebase/API
      const updatedTransactions = mockTransactions;
      const updatedStats = getTransactionStats(updatedTransactions);
      
      setState(prev => ({
        ...prev,
        transactions: updatedTransactions,
        transactionStats: updatedStats,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to refresh data',
      }));
    }
  }, []);

  // Update user balance (for demo purposes)
  const updateBalance = useCallback((newBalance: number) => {
    setState(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        balance: newBalance,
      },
    }));
  }, []);

  // Add new transaction (for demo purposes)
  const addTransaction = useCallback((transaction: Transaction) => {
    setState(prev => {
      const updatedTransactions = [transaction, ...prev.transactions];
      return {
        ...prev,
        transactions: updatedTransactions,
        transactionStats: getTransactionStats(updatedTransactions),
      };
    });
  }, []);

  // Update transaction status
  const updateTransactionStatus = useCallback((transactionId: string, status: 'completed' | 'pending' | 'failed') => {
    setState(prev => {
      const updatedTransactions = prev.transactions.map(t =>
        t.id === transactionId ? { ...t, status } : t
      );
      return {
        ...prev,
        transactions: updatedTransactions,
        transactionStats: getTransactionStats(updatedTransactions),
      };
    });
  }, []);

  // Update service balances
  const updateServiceBalances = useCallback((balances: Partial<ServiceBalance>) => {
    setState(prev => ({
      ...prev,
      serviceBalances: {
        ...prev.serviceBalances,
        ...balances,
      },
    }));
  }, []);

  // Get recent transactions (last 5)
  const getRecentTransactions = useCallback(() => {
    return state.transactions.slice(0, 5);
  }, [state.transactions]);

  // Get transactions by type
  const getTransactionsByType = useCallback((type: Transaction['type']) => {
    return state.transactions.filter(t => t.type === type);
  }, [state.transactions]);

  // Get transactions by status
  const getTransactionsByStatus = useCallback((status: Transaction['status']) => {
    return state.transactions.filter(t => t.status === status);
  }, [state.transactions]);

  // Search transactions
  const searchTransactions = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return state.transactions.filter(t =>
      t.description.toLowerCase().includes(lowercaseQuery) ||
      t.recipient?.toLowerCase().includes(lowercaseQuery) ||
      t.reference?.toLowerCase().includes(lowercaseQuery)
    );
  }, [state.transactions]);

  return {
    // State
    userProfile: state.userProfile,
    transactions: state.transactions,
    serviceBalances: state.serviceBalances,
    transactionStats: state.transactionStats,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    refreshData,
    updateBalance,
    addTransaction,
    updateTransactionStatus,
    updateServiceBalances,
    
    // Getters
    getRecentTransactions,
    getTransactionsByType,
    getTransactionsByStatus,
    searchTransactions,
  };
};

export default useDashboard;
