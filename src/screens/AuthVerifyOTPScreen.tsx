import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import OTPInput from '../components/OTPInput';
import { COLORS, SPACING } from '../utils/constants';

interface AuthVerifyOTPScreenProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function AuthVerifyOTPScreen({ 
  phoneNumber, 
  onVerify, 
  onResend, 
  onBack,
  isLoading = false,
  error
}: AuthVerifyOTPScreenProps) {
  const [otp, setOtp] = useState('');
  const [resendTimeLeft, setResendTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verificationError, setVerificationError] = useState(error || '');

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Handle back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });

    return () => backHandler.remove();
  }, [onBack]);

  useEffect(() => {
    // Update error state when prop changes
    setVerificationError(error || '');
  }, [error]);

  const handleOTPComplete = (otpCode: string) => {
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  const handleOTPChange = (otpCode: string) => {
    setOtp(otpCode);
    // Clear error when user starts typing
    if (verificationError) {
      setVerificationError('');
    }
  };

  const handleResend = () => {
    if (canResend) {
      setResendTimeLeft(30);
      setCanResend(false);
      setOtp('');
      onResend();
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Go Back',
      'Are you sure you want to go back? You will need to request a new verification code.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go Back', style: 'destructive', onPress: onBack },
      ]
    );
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 9) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}${cleaned.slice(9)}`;
    }
    return phone;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
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
        <View style={styles.headerContent}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Header Info */}
          <Animatable.View animation="fadeInDown" style={styles.headerInfo}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={40} color="white" />
            </View>
            
            <Text style={styles.headerTitle}>Verify Your Phone</Text>
            <Text style={styles.headerSubtitle}>
              We've sent a verification code to your phone
            </Text>
          </Animatable.View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <Animatable.View animation="fadeInUp" style={styles.otpSection}>
          <OTPInput
            value={otp}
            onChangeText={handleOTPChange}
            onComplete={handleOTPComplete}
            error={verificationError}
            disabled={isLoading}
            resendAvailable={canResend}
            resendTimeLeft={resendTimeLeft}
            onResend={handleResend}
            phoneNumber={phoneNumber}
          />
        </Animatable.View>

        {/* Additional Options */}
        <Animatable.View animation="fadeInUp" delay={300} style={styles.optionsSection}>
          <View style={styles.optionItem}>
            <Ionicons name="help-circle" size={20} color={COLORS.gray500} />
            <Text style={styles.optionText}>
              Didn't receive the code? Check your SMS or{' '}
              <Text style={styles.optionLink} onPress={handleResend}>
                resend
              </Text>
            </Text>
          </View>
          
          <View style={styles.optionItem}>
            <Ionicons name="time" size={20} color={COLORS.gray500} />
            <Text style={styles.optionText}>
              The code will expire in 10 minutes
            </Text>
          </View>
          
          <View style={styles.optionItem}>
            <Ionicons name="shield" size={20} color={COLORS.gray500} />
            <Text style={styles.optionText}>
              Your phone number is secure and private
            </Text>
          </View>
        </Animatable.View>

        {/* Loading Overlay */}
        {isLoading && (
          <Animatable.View animation="fadeIn" style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <Animatable.View
                animation="rotate"
                iterationCount="infinite"
                duration={1000}
              >
                <Ionicons name="hourglass" size={40} color={COLORS.primary} />
              </Animatable.View>
              <Text style={styles.loadingText}>Verifying...</Text>
            </View>
          </Animatable.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
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
    position: 'relative',
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  headerInfo: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: SPACING.xl,
    position: 'relative',
  },
  otpSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  optionsSection: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.gray600,
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: 20,
  },
  optionLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.gray700,
    marginTop: SPACING.md,
    fontWeight: '600',
  },
});
