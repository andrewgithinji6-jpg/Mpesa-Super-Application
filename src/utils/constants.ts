// App-wide constants and configuration

export const APP_CONFIG = {
  name: 'M-Pesa+ SuperApp',
  version: '1.0.0',
  description: 'Unified mobile money and banking platform',
};

export const COLORS = {
  primary: '#2BB673',
  primaryDark: '#1E8B5A',
  secondary: '#4ECDC4',
  accent: '#FF6B6B',
  success: '#2BB673',
  warning: '#FFA500',
  error: '#FF6B6B',
  info: '#45B7D1',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F8F9FA',
  gray100: '#E9ECEF',
  gray200: '#DEE2E6',
  gray300: '#CED4DA',
  gray400: '#ADB5BD',
  gray500: '#6C757D',
  gray600: '#495057',
  gray700: '#343A40',
  gray800: '#212529',
  gray900: '#121416',
};

export const FONTS = {
  regular: 'Roboto',
  medium: 'Roboto_medium',
  bold: 'Roboto_bold',
  light: 'Roboto_light',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 50,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const TRANSACTION_TYPES = {
  SENT: 'sent',
  RECEIVED: 'received',
  AIRTIME: 'airtime',
  DATA: 'data',
  BILL: 'bill',
  WITHDRAWAL: 'withdrawal',
  DEPOSIT: 'deposit',
} as const;

export const TRANSACTION_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
} as const;

export const SERVICE_CATEGORIES = {
  DATA: 'data',
  SMS: 'sms',
  BONGA: 'bonga',
  VOICE: 'voice',
  INTERNATIONAL: 'international',
} as const;

export const BANK_TRANSFER_TYPES = {
  MPESA_TO_BANK: 'mpesa_to_bank',
  BANK_TO_MPESA: 'bank_to_mpesa',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile',
    LOGOUT: '/api/auth/logout',
  },
  MPESA: {
    STK_PUSH: '/api/mpesa/stk-push',
    SEND_MONEY: '/api/mpesa/send-money',
    BALANCE: '/api/mpesa/balance',
    TRANSACTION_STATUS: '/api/mpesa/transaction-status',
  },
  TRANSACTIONS: {
    LIST: '/api/transactions',
    DETAILS: '/api/transactions',
    STATS: '/api/transactions/stats',
  },
  SERVICES: {
    PLANS: '/api/services/plans',
    BALANCES: '/api/services/balances',
    PURCHASE: '/api/services/purchase',
  },
  BANK: {
    ACCOUNTS: '/api/bank/accounts',
    TRANSFER_TO_BANK: '/api/bank/transfer-to-bank',
    TRANSFER_FROM_BANK: '/api/bank/transfer-from-bank',
    TRANSFERS: '/api/bank/transfers',
  },
};

export const MOCK_DATA = {
  USER: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254700000000',
    balance: 'KES 15,420.00',
  },
  TRANSACTIONS: [
    {
      id: '1',
      type: 'received',
      amount: 5000,
      description: 'Payment from Jane Smith',
      date: '2024-01-15',
      time: '14:30',
      status: 'completed',
    },
    {
      id: '2',
      type: 'airtime',
      amount: 100,
      description: 'Airtime Purchase',
      date: '2024-01-15',
      time: '12:15',
      status: 'completed',
    },
  ],
  SERVICE_BALANCES: {
    data: { amount: '2.5 GB', expiry: '2024-02-15' },
    sms: { amount: '100 SMS', expiry: '2024-02-20' },
    bonga: { amount: '2,500 pts', expiry: null },
  },
};

export const VALIDATION_RULES = {
  PHONE: /^(\+254|254|0)[17]\d{8}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PIN: /^\d{4}$/,
  AMOUNT: /^\d+(\.\d{1,2})?$/,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_PHONE: 'Please enter a valid Kenyan phone number.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PIN: 'PIN must be 4 digits.',
  INVALID_AMOUNT: 'Please enter a valid amount.',
  REQUIRED_FIELD: 'This field is required.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Account created successfully!',
  TRANSACTION_SUCCESS: 'Transaction completed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PIN_CHANGED: 'PIN changed successfully!',
  SERVICE_PURCHASED: 'Service purchased successfully!',
  TRANSFER_SUCCESS: 'Transfer completed successfully!',
};

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

export const STORAGE_KEYS = {
  USER_TOKEN: '@mpesa_superapp:user_token',
  USER_DATA: '@mpesa_superapp:user_data',
  SETTINGS: '@mpesa_superapp:settings',
  ONBOARDING_COMPLETED: '@mpesa_superapp:onboarding_completed',
};

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const REFRESH_INTERVALS = {
  BALANCE: 30000, // 30 seconds
  TRANSACTIONS: 60000, // 1 minute
  SERVICES: 300000, // 5 minutes
};

export const SUPPORTED_CURRENCIES = ['KES'] as const;

export const DEFAULT_COUNTRY_CODE = '+254';

export const APP_FEATURES = {
  MPESA_INTEGRATION: true,
  BANK_TRANSFERS: true,
  DATA_BUNDLES: true,
  SMS_BUNDLES: true,
  BONGA_POINTS: true,
  BILL_PAYMENTS: false, // Coming soon
  INVESTMENTS: false, // Coming soon
  LOANS: false, // Coming soon
} as const;
