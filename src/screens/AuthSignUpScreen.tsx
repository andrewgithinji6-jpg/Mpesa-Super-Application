import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import PhoneInput from '../components/PhoneInput';
import AuthInput from '../components/AuthInput';
import { COLORS, SPACING } from '../utils/constants';

interface AuthSignUpScreenProps {
  onSignUp: (userData: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  }) => void;
  onNavigateToLogin: () => void;
  isLoading?: boolean;
}

export default function AuthSignUpScreen({ 
  onSignUp, 
  onNavigateToLogin, 
  isLoading = false 
}: AuthSignUpScreenProps) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      phoneNumber: '',
      email: '',
    };

    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Validate phone number
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!cleanedPhone.startsWith('254')) {
      newErrors.phoneNumber = 'Please enter a valid Kenyan phone number';
    } else if (cleanedPhone.length !== 12) {
      newErrors.phoneNumber = 'Phone number must be 12 digits';
    }

    // Validate email (optional but if provided, must be valid)
    if (email.trim() && !isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the parent's sign up function
      onSignUp({
        fullName: fullName.trim(),
        phoneNumber,
        email: email.trim() || undefined,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    switch (field) {
      case 'fullName':
        setFullName(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      case 'email':
        setEmail(value);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Gradient */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Background Pattern */}
            <View style={styles.backgroundPattern}>
              <View style={[styles.circle, styles.circle1]} />
              <View style={[styles.circle, styles.circle2]} />
              <View style={[styles.circle, styles.circle3]} />
            </View>

            {/* Header Content */}
            <Animatable.View animation="fadeInDown" style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <Ionicons name="person-add" size={40} color="white" />
                </View>
                <Text style={styles.appName}>M-Pesa+</Text>
              </View>
              
              <Text style={styles.welcomeTitle}>Create Account</Text>
              <Text style={styles.welcomeSubtitle}>
                Join thousands of Kenyans using M-Pesa+
              </Text>
            </Animatable.View>
          </LinearGradient>

          {/* Form Content */}
          <Animatable.View animation="fadeInUp" style={styles.formContainer}>
            <View style={styles.formContent}>
              {/* Full Name Input */}
              <View style={styles.inputSection}>
                <AuthInput
                  label="Full Name"
                  value={fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                  error={errors.fullName}
                  placeholder="Enter your full name"
                  leftIcon="person"
                  autoCapitalize="words"
                  textContentType="name"
                />
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <PhoneInput
                  value={phoneNumber}
                  onChangeText={(text) => handleInputChange('phoneNumber', text)}
                  error={errors.phoneNumber}
                  placeholder="0712345678"
                />
              </View>

              {/* Email Input (Optional) */}
              <View style={styles.inputSection}>
                <AuthInput
                  label="Email Address (Optional)"
                  value={email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  error={errors.email}
                  placeholder="Enter your email address"
                  leftIcon="mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                />
              </View>

              {/* Benefits Section */}
              <View style={styles.benefitsSection}>
                <Text style={styles.benefitsTitle}>What you'll get:</Text>
                <View style={styles.benefitsList}>
                  <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                    <Text style={styles.benefitText}>Access to all M-Pesa services</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                    <Text style={styles.benefitText}>Data, SMS & Bonga Points management</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                    <Text style={styles.benefitText}>Bank transfers & bill payments</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                    <Text style={styles.benefitText}>Enhanced security & privacy</Text>
                  </View>
                </View>
              </View>

              {/* Create Account Button */}
              <TouchableOpacity
                style={[
                  styles.createAccountButton,
                  (!fullName.trim() || !phoneNumber.trim() || isSubmitting || isLoading) && styles.createAccountButtonDisabled
                ]}
                onPress={handleSignUp}
                disabled={!fullName.trim() || !phoneNumber.trim() || isSubmitting || isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={(!fullName.trim() || !phoneNumber.trim() || isSubmitting || isLoading) 
                    ? [COLORS.gray400, COLORS.gray500] 
                    : [COLORS.primary, COLORS.primaryDark]
                  }
                  style={styles.buttonGradient}
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <Ionicons name="hourglass" size={20} color="white" />
                      <Text style={styles.buttonText}>Creating Account...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="person-add" size={20} color="white" />
                      <Text style={styles.buttonText}>Create Account</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Login Link */}
              <View style={styles.loginSection}>
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={onNavigateToLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>

              {/* Terms and Privacy */}
              <View style={styles.termsSection}>
                <Text style={styles.termsText}>
                  By creating an account, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 120,
    height: 120,
    top: 50,
    right: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    bottom: 30,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    top: 100,
    left: 50,
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: SPACING.xl,
  },
  formContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  inputSection: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: SPACING.sm,
  },
  benefitsSection: {
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: SPACING.md,
  },
  benefitsList: {
    gap: SPACING.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.gray700,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  createAccountButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  createAccountButtonDisabled: {
    opacity: 0.6,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: SPACING.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray200,
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.gray500,
    marginHorizontal: SPACING.md,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  loginText: {
    fontSize: 16,
    color: COLORS.gray600,
  },
  loginLink: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  termsSection: {
    paddingHorizontal: SPACING.md,
  },
  termsText: {
    fontSize: 12,
    color: COLORS.gray500,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
