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
import { COLORS, SPACING } from '../utils/constants';

interface AuthLoginScreenProps {
  onLogin: (phoneNumber: string) => void;
  onNavigateToSignUp: () => void;
  isLoading?: boolean;
}

export default function AuthLoginScreen({ 
  onLogin, 
  onNavigateToSignUp, 
  isLoading = false 
}: AuthLoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    
    if (!cleaned.startsWith('254')) {
      return 'Please enter a valid Kenyan phone number';
    }
    
    if (cleaned.length !== 12) {
      return 'Phone number must be 12 digits';
    }
    
    return '';
  };

  const handleSendOTP = async () => {
    const error = validatePhoneNumber(phoneNumber);
    
    if (error) {
      setPhoneError(error);
      return;
    }
    
    setPhoneError('');
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the parent's login function
      onLogin(phoneNumber);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    if (phoneError) {
      setPhoneError('');
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
                  <Ionicons name="phone-portrait" size={40} color="white" />
                </View>
                <Text style={styles.appName}>M-Pesa+</Text>
              </View>
              
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>
                Sign in to access your M-Pesa services
              </Text>
            </Animatable.View>
          </LinearGradient>

          {/* Form Content */}
          <Animatable.View animation="fadeInUp" style={styles.formContainer}>
            <View style={styles.formContent}>
              {/* Phone Input Section */}
              <View style={styles.inputSection}>
                <Text style={styles.sectionTitle}>Enter your phone number</Text>
                <Text style={styles.sectionSubtitle}>
                  We'll send you a verification code
                </Text>
                
                <PhoneInput
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  error={phoneError}
                  placeholder="0712345678"
                />
              </View>

              {/* Send OTP Button */}
              <TouchableOpacity
                style={[
                  styles.sendOTPButton,
                  (!phoneNumber.trim() || isSubmitting || isLoading) && styles.sendOTPButtonDisabled
                ]}
                onPress={handleSendOTP}
                disabled={!phoneNumber.trim() || isSubmitting || isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={(!phoneNumber.trim() || isSubmitting || isLoading) 
                    ? [COLORS.gray400, COLORS.gray500] 
                    : [COLORS.primary, COLORS.primaryDark]
                  }
                  style={styles.buttonGradient}
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <Ionicons name="hourglass" size={20} color="white" />
                      <Text style={styles.buttonText}>Sending...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="send" size={20} color="white" />
                      <Text style={styles.buttonText}>Send OTP</Text>
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

              {/* Sign Up Link */}
              <View style={styles.signUpSection}>
                <Text style={styles.signUpText}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={onNavigateToSignUp}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              {/* Terms and Privacy */}
              <View style={styles.termsSection}>
                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
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
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.gray600,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  sendOTPButton: {
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
  sendOTPButtonDisabled: {
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
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  signUpText: {
    fontSize: 16,
    color: COLORS.gray600,
  },
  signUpLink: {
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
