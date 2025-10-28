// Utility functions and helpers

import { VALIDATION_RULES, DEFAULT_COUNTRY_CODE } from './constants';

/**
 * Format phone number to standard format
 * @param phoneNumber - Phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`;
  } else if (cleaned.length === 9) {
    return `+254${cleaned}`;
  }
  
  return phoneNumber;
};

/**
 * Format amount to currency format
 * @param amount - Amount to format
 * @param currency - Currency code (default: KES)
 * @returns Formatted amount string
 */
export const formatAmount = (amount: number | string, currency: string = 'KES'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return `${currency} 0.00`;
  
  return `${currency} ${numAmount.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format date to readable format
 * @param date - Date to format
 * @param includeTime - Whether to include time
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, includeTime: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('en-KE', options);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param date - Date to compare
 * @returns Relative time string
 */
export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(dateObj);
};

/**
 * Validate phone number
 * @param phoneNumber - Phone number to validate
 * @returns True if valid
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  return VALIDATION_RULES.PHONE.test(formatPhoneNumber(phoneNumber));
};

/**
 * Validate email address
 * @param email - Email to validate
 * @returns True if valid
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL.test(email);
};

/**
 * Validate PIN
 * @param pin - PIN to validate
 * @returns True if valid
 */
export const isValidPIN = (pin: string): boolean => {
  return VALIDATION_RULES.PIN.test(pin);
};

/**
 * Validate amount
 * @param amount - Amount to validate
 * @returns True if valid
 */
export const isValidAmount = (amount: string): boolean => {
  return VALIDATION_RULES.AMOUNT.test(amount);
};

/**
 * Generate transaction reference
 * @returns Random transaction reference
 */
export const generateTransactionRef = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `MP${timestamp}${random}`.toUpperCase();
};

/**
 * Mask sensitive information
 * @param value - Value to mask
 * @param visibleChars - Number of characters to show at the end
 * @returns Masked string
 */
export const maskSensitiveData = (value: string, visibleChars: number = 4): string => {
  if (!value || value.length <= visibleChars) return value;
  
  const maskedLength = value.length - visibleChars;
  const masked = '*'.repeat(maskedLength);
  return masked + value.slice(-visibleChars);
};

/**
 * Capitalize first letter of each word
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Get transaction icon based on type
 * @param type - Transaction type
 * @returns Icon name
 */
export const getTransactionIcon = (type: string): string => {
  switch (type) {
    case 'sent':
      return 'arrow-up-circle';
    case 'received':
      return 'arrow-down-circle';
    case 'airtime':
      return 'phone-portrait';
    case 'data':
      return 'wifi';
    case 'bill':
      return 'receipt';
    case 'withdrawal':
      return 'card';
    case 'deposit':
      return 'add-circle';
    default:
      return 'help-circle';
  }
};

/**
 * Get transaction color based on type
 * @param type - Transaction type
 * @returns Color string
 */
export const getTransactionColor = (type: string): string => {
  switch (type) {
    case 'received':
    case 'deposit':
      return '#2BB673';
    case 'sent':
    case 'airtime':
    case 'data':
    case 'bill':
    case 'withdrawal':
      return '#FF6B6B';
    default:
      return '#666';
  }
};

/**
 * Get status color
 * @param status - Status string
 * @returns Color string
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#2BB673';
    case 'pending':
      return '#FFA500';
    case 'failed':
      return '#FF6B6B';
    default:
      return '#666';
  }
};

/**
 * Debounce function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 * @param func - Function to throttle
 * @param limit - Limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate random ID
 * @param length - Length of ID
 * @returns Random ID string
 */
export const generateRandomId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Check if value is empty
 * @param value - Value to check
 * @returns True if empty
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Deep clone object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Format file size
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get initials from name
 * @param name - Full name
 * @returns Initials string
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Check if device is online
 * @returns Promise that resolves to online status
 */
export const isOnline = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      resolve(navigator.onLine);
    } else {
      // Fallback for React Native
      resolve(true);
    }
  });
};
