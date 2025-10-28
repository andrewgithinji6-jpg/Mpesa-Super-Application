// TypeScript type definitions for the M-Pesa+ SuperApp

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phoneNumber: string;
  balance: number;
  lastLogin: string;
  profilePicture?: string | null;
  isVerified: boolean;
  preferences: {
    notifications: boolean;
    biometric: boolean;
    darkMode: boolean;
  };
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'airtime' | 'data' | 'bill' | 'withdrawal' | 'deposit';
  amount: number;
  description: string;
  recipient?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceBalance {
  data: {
    amount: string;
    expiry: string | null;
    plan: string;
  };
  sms: {
    amount: string;
    expiry: string | null;
    plan: string;
  };
  bonga: {
    amount: string;
    expiry: string | null;
    plan: string;
  };
  voice?: {
    amount: string;
    expiry: string | null;
    plan: string;
  };
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  accountType: 'Savings' | 'Current' | 'Fixed Deposit';
  isVerified: boolean;
  lastUsed: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicePlan {
  id: string;
  name: string;
  price: number;
  description: string;
  validity?: string;
  size?: string;
  count?: number;
  popular: boolean;
  category: 'data' | 'sms' | 'bonga' | 'voice';
}

export interface QuickAccessItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: string[];
  route: string;
}

export interface TransactionStats {
  totalReceived: number;
  totalSent: number;
  netAmount: number;
  transactionCount: number;
  completedTransactions: number;
  pendingTransactions: number;
}

export interface ServiceStats {
  hasDataBalance: boolean;
  hasSmsBalance: boolean;
  hasBongaPoints: boolean;
  totalServices: number;
}

export interface BankTransfer {
  id: string;
  userId: string;
  type: 'mpesa_to_bank' | 'bank_to_mpesa';
  accountId: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  updatedAt: string;
}

export interface ServicePurchase {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  category: 'data' | 'sms' | 'bonga';
  price: number;
  description: string;
  phoneNumber?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  SendMoney: undefined;
  BuyAirtime: undefined;
  PayBill: undefined;
  WithdrawCash: undefined;
  BongaPoints: undefined;
  BankServices: undefined;
  BuyData: undefined;
  TransactionHistory: undefined;
  TransactionDetails: { transactionId: string };
  Settings: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Home: undefined;
  Transactions: undefined;
  Services: undefined;
  Bank: undefined;
  Settings: undefined;
};

// Component Props Types
export interface BalanceCardProps {
  balance: number;
  onAddMoney: () => void;
  onWithdraw: () => void;
  currency?: string;
}

export interface QuickAccessTileProps {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string[];
  onPress: () => void;
  disabled?: boolean;
}

export interface RecentTransactionsProps {
  transactions?: Transaction[];
  onViewAll?: () => void;
  onTransactionPress?: (transaction: Transaction) => void;
  maxItems?: number;
}

export interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface SendMoneyForm {
  phoneNumber: string;
  amount: string;
  reference?: string;
  description?: string;
}

export interface PayBillForm {
  billType: string;
  accountNumber: string;
  amount: string;
  reference?: string;
}

export interface BankTransferForm {
  accountId: string;
  amount: string;
  reference?: string;
}

// Settings Types
export interface AppSettings {
  notifications: {
    transactions: boolean;
    promotions: boolean;
    security: boolean;
  };
  security: {
    biometric: boolean;
    pinRequired: boolean;
    autoLock: boolean;
  };
  appearance: {
    darkMode: boolean;
    language: string;
    currency: string;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: AppError;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    white: string;
    black: string;
    gray50: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
    light: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
}

// Export all types
export * from './index';
