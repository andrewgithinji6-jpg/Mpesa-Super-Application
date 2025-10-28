import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING } from '../utils/constants';

interface OTPInputProps {
  length?: number;
  value: string;
  onChangeText: (otp: string) => void;
  onComplete?: (otp: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  resendAvailable?: boolean;
  resendTimeLeft?: number;
  onResend?: () => void;
  phoneNumber?: string;
}

export default function OTPInput({
  length = 6,
  value,
  onChangeText,
  onComplete,
  error,
  disabled = false,
  autoFocus = true,
  secureTextEntry = false,
  resendAvailable = false,
  resendTimeLeft = 0,
  onResend,
  phoneNumber,
}: OTPInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleTextChange = (text: string, index: number) => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/\D/g, '');
    
    if (cleanedText.length > 1) {
      // Handle paste operation
      const pastedText = cleanedText.slice(0, length);
      const newValue = value.split('');
      
      for (let i = 0; i < pastedText.length; i++) {
        if (index + i < length) {
          newValue[index + i] = pastedText[i];
        }
      }
      
      onChangeText(newValue.join(''));
      
      // Focus on the last filled input or next empty input
      const nextIndex = Math.min(index + pastedText.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
      
      return;
    }

    // Single character input
    const newValue = value.split('');
    newValue[index] = cleanedText;
    
    onChangeText(newValue.join(''));

    // Move to next input if character is entered
    if (cleanedText && index < length - 1) {
      const nextIndex = index + 1;
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      // Move to previous input if current is empty and backspace is pressed
      const prevIndex = index - 1;
      inputRefs.current[prevIndex]?.focus();
      setFocusedIndex(prevIndex);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handleResend = () => {
    if (resendAvailable && onResend) {
      onResend();
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 9) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}${cleaned.slice(9)}`;
    }
    return phone;
  };

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderInput = (index: number) => {
    const digit = value[index] || '';
    const isFocused = focusedIndex === index;
    const hasError = !!error;

    return (
      <Animatable.View
        key={index}
        animation={hasError ? "shake" : undefined}
        duration={500}
        style={styles.inputContainer}
      >
        <TextInput
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            hasError && styles.inputError,
            digit && styles.inputFilled,
          ]}
          value={digit}
          onChangeText={(text) => handleTextChange(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          keyboardType="numeric"
          maxLength={length}
          selectTextOnFocus
          editable={!disabled}
          secureTextEntry={secureTextEntry}
        />
        
        {/* Bottom indicator */}
        <View style={[
          styles.indicator,
          isFocused && styles.indicatorFocused,
          hasError && styles.indicatorError,
          digit && styles.indicatorFilled,
        ]} />
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Phone Number Display */}
      {phoneNumber && (
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneLabel}>Code sent to:</Text>
          <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</Text>
        </View>
      )}

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {Array.from({ length }, (_, index) => renderInput(index))}
      </View>

      {/* Error Message */}
      {error && (
        <Animatable.View animation="fadeInDown" style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </Animatable.View>
      )}

      {/* Resend Section */}
      <View style={styles.resendContainer}>
        {resendTimeLeft > 0 ? (
          <View style={styles.resendTimer}>
            <Text style={styles.resendTimerText}>
              Resend code in {formatTimeLeft(resendTimeLeft)}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.resendButton, !resendAvailable && styles.resendButtonDisabled]}
            onPress={handleResend}
            disabled={!resendAvailable}
          >
            <Ionicons 
              name="refresh" 
              size={16} 
              color={resendAvailable ? COLORS.primary : COLORS.gray400} 
            />
            <Text style={[
              styles.resendButtonText,
              !resendAvailable && styles.resendButtonTextDisabled
            ]}>
              Resend Code
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Helper Text */}
      {!error && (
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            Enter the {length}-digit verification code
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  phoneContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  phoneLabel: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: SPACING.xs,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray800,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F9FF',
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  inputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F9FF',
  },
  indicator: {
    width: 20,
    height: 3,
    backgroundColor: COLORS.gray300,
    borderRadius: 2,
    marginTop: SPACING.sm,
  },
  indicatorFocused: {
    backgroundColor: COLORS.primary,
  },
  indicatorError: {
    backgroundColor: COLORS.error,
  },
  indicatorFilled: {
    backgroundColor: COLORS.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginLeft: SPACING.xs,
    textAlign: 'center',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  resendTimer: {
    paddingVertical: SPACING.sm,
  },
  resendTimerText: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
  },
  resendButtonDisabled: {
    backgroundColor: COLORS.gray50,
  },
  resendButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  resendButtonTextDisabled: {
    color: COLORS.gray400,
  },
  helperContainer: {
    paddingHorizontal: SPACING.lg,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
});
