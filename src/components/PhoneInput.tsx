import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING } from '../utils/constants';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function PhoneInput({
  value,
  onChangeText,
  onFocus,
  onBlur,
  error,
  placeholder = 'Enter phone number',
  disabled = false,
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Handle Kenyan phone number formatting
    if (cleaned.startsWith('254')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('07') || cleaned.startsWith('01')) {
      return `+254${cleaned.slice(1)}`;
    } else if (cleaned.length > 0 && !cleaned.startsWith('254')) {
      return `+254${cleaned}`;
    }
    
    return cleaned;
  };

  const handleTextChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    onChangeText(formatted);
  };

  const isValidKenyanNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('254') && cleaned.length === 12;
  };

  const getValidationIcon = () => {
    if (!value) return null;
    
    if (isValidKenyanNumber(value)) {
      return (
        <Ionicons 
          name="checkmark-circle" 
          size={20} 
          color={COLORS.success} 
        />
      );
    }
    
    return (
      <Ionicons 
        name="close-circle" 
        size={20} 
        color={COLORS.error} 
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {/* Country Code */}
        <View style={styles.countryCodeContainer}>
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>🇰🇪</Text>
          </View>
          <Text style={styles.countryCode}>+254</Text>
        </View>

        {/* Input Field */}
        <View style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={COLORS.gray400}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            editable={!disabled}
            maxLength={13} // +254XXXXXXXXX
          />
          
          {/* Validation Icon */}
          {getValidationIcon()}
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <Animatable.View animation="fadeInDown" style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </Animatable.View>
      )}

      {/* Helper Text */}
      {!error && value && !isValidKenyanNumber(value) && (
        <Animatable.View animation="fadeInDown" style={styles.helperContainer}>
          <Text style={styles.helperText}>
            Enter a valid Kenyan phone number (e.g., 0712345678)
          </Text>
        </Animatable.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    overflow: 'hidden',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.gray100,
    borderRightWidth: 1,
    borderRightColor: COLORS.gray200,
  },
  flagContainer: {
    marginRight: SPACING.sm,
  },
  flag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  inputDisabled: {
    backgroundColor: COLORS.gray100,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.gray800,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  helperContainer: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.gray500,
  },
});
