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

interface AuthInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  textContentType?: string;
  maxLength?: number;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function AuthInput({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  error,
  placeholder,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  textContentType,
  maxLength,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconButton}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color={COLORS.gray500}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.iconButton}
        >
          <Ionicons
            name={rightIcon}
            size={20}
            color={COLORS.gray500}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  const getValidationIcon = () => {
    if (!value || error) return null;

    // Basic validation based on input type
    if (textContentType === 'emailAddress' && value.includes('@')) {
      return (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={COLORS.success}
        />
      );
    }

    if (textContentType === 'telephoneNumber' && value.length >= 10) {
      return (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={COLORS.success}
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={[
          styles.label,
          error && styles.labelError,
        ]}>
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        error && styles.inputError,
        disabled && styles.inputDisabled,
        multiline && styles.inputMultiline,
      ]}>
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons
              name={leftIcon}
              size={20}
              color={isFocused ? COLORS.primary : COLORS.gray500}
            />
          </View>
        )}

        {/* Input Field */}
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultilineText,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry || getValidationIcon()) && styles.inputWithRightIcon,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray400}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          maxLength={maxLength}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />

        {/* Right Icons */}
        <View style={styles.rightIconsContainer}>
          {getValidationIcon()}
          {getRightIcon()}
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <Animatable.View animation="fadeInDown" style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </Animatable.View>
      )}

      {/* Character Count */}
      {maxLength && (
        <View style={styles.characterCountContainer}>
          <Text style={[
            styles.characterCount,
            value.length > maxLength * 0.9 && styles.characterCountWarning,
          ]}>
            {value.length}/{maxLength}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: SPACING.sm,
  },
  labelError: {
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    minHeight: 56,
    paddingHorizontal: SPACING.md,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: 'white',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  inputDisabled: {
    backgroundColor: COLORS.gray100,
    opacity: 0.6,
  },
  inputMultiline: {
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    minHeight: 80,
  },
  leftIconContainer: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.gray800,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : 0,
  },
  inputMultilineText: {
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  inputWithLeftIcon: {
    marginLeft: 0,
  },
  inputWithRightIcon: {
    marginRight: SPACING.sm,
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
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
  characterCountContainer: {
    alignItems: 'flex-end',
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  characterCountWarning: {
    color: COLORS.warning,
    fontWeight: '600',
  },
});
