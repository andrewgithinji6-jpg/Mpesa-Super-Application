import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { ConfirmationResult } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import AuthLoginScreen from './AuthLoginScreen';
import AuthSignUpScreen from './AuthSignUpScreen';
import AuthVerifyOTPScreen from './AuthVerifyOTPScreen';

type AuthScreen = 'login' | 'signup' | 'verify';

interface AuthFlowScreenProps {
  onAuthSuccess: () => void;
}

export default function AuthFlowScreen({ onAuthSuccess }: AuthFlowScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [userData, setUserData] = useState<{
    fullName: string;
    phoneNumber: string;
    email?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { sendPhoneOTP, verifyPhoneOTP, createUserProfile } = useAuth();

  const handleLogin = async (phone: string) => {
    try {
      setIsLoading(true);
      setError('');
      setPhoneNumber(phone);
      
      const result = await sendPhoneOTP(phone);
      setConfirmationResult(result);
      setCurrentScreen('verify');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to send verification code. Please try again.');
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  }) => {
    try {
      setIsLoading(true);
      setError('');
      setUserData(data);
      setPhoneNumber(data.phoneNumber);
      
      // Create user profile first
      await createUserProfile(data);
      
      const result = await sendPhoneOTP(data.phoneNumber);
      setConfirmationResult(result);
      setCurrentScreen('verify');
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Failed to create account. Please try again.');
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    if (!confirmationResult) {
      setError('Verification session expired. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await verifyPhoneOTP(confirmationResult, otp);
      
      // Authentication successful
      onAuthSuccess();
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await sendPhoneOTP(phoneNumber);
      setConfirmationResult(result);
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Failed to resend verification code. Please try again.');
      Alert.alert('Error', 'Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentScreen('login');
    setPhoneNumber('');
    setConfirmationResult(null);
    setUserData(null);
    setError('');
  };

  const handleNavigateToSignUp = () => {
    setCurrentScreen('signup');
    setError('');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
    setError('');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <AuthLoginScreen
            onLogin={handleLogin}
            onNavigateToSignUp={handleNavigateToSignUp}
            isLoading={isLoading}
          />
        );
      
      case 'signup':
        return (
          <AuthSignUpScreen
            onSignUp={handleSignUp}
            onNavigateToLogin={handleNavigateToLogin}
            isLoading={isLoading}
          />
        );
      
      case 'verify':
        return (
          <AuthVerifyOTPScreen
            phoneNumber={phoneNumber}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            onBack={handleBack}
            isLoading={isLoading}
            error={error}
          />
        );
      
      default:
        return (
          <AuthLoginScreen
            onLogin={handleLogin}
            onNavigateToSignUp={handleNavigateToSignUp}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
