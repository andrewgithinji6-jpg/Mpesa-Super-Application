import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  uid: string;
  phoneNumber: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  sendPhoneOTP: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyPhoneOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
  createUserProfile: (userData: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  hasOnboarded: boolean;
  setHasOnboarded: (value: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboardedState] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user has onboarded
        const onboarded = await AsyncStorage.getItem('hasOnboarded');
        setHasOnboardedState(onboarded === 'true');

        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user);
          
          if (user) {
            // Create user profile from Firebase user
            const profile: UserProfile = {
              uid: user.uid,
              phoneNumber: user.phoneNumber || '',
              displayName: user.displayName || undefined,
              email: user.email || undefined,
              photoURL: user.photoURL || undefined,
            };
            setUserProfile(profile);
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const sendPhoneOTP = async (phoneNumber: string): Promise<ConfirmationResult> => {
    try {
      // For development, we'll simulate the OTP process
      // In production, you would use Firebase Phone Auth
      console.log('Sending OTP to:', phoneNumber);
      
      // Mock confirmation result for development
      const mockConfirmationResult = {
        verificationId: 'mock-verification-id',
        confirm: async (verificationCode: string) => {
          // Mock verification
          console.log('Verifying OTP:', verificationCode);
          return {} as any;
        }
      } as ConfirmationResult;

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockConfirmationResult;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const verifyPhoneOTP = async (confirmationResult: ConfirmationResult, otp: string): Promise<void> => {
    try {
      // For development, accept any 6-digit code
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        console.log('OTP verified successfully:', otp);
        // In production, you would call confirmationResult.confirm(otp)
        return;
      } else {
        throw new Error('Invalid OTP code');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const createUserProfile = async (userData: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  }) => {
    try {
      // Store user profile data temporarily
      // In production, you would save this to Firestore
      const profile: UserProfile = {
        uid: `temp-${Date.now()}`, // Temporary ID
        phoneNumber: userData.phoneNumber,
        displayName: userData.fullName,
        email: userData.email,
      };
      
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      console.log('User profile created:', profile);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userProfile');
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  const setHasOnboarded = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('hasOnboarded', value.toString());
      setHasOnboardedState(value);
    } catch (error) {
      console.error('Error setting onboarded state:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    sendPhoneOTP,
    verifyPhoneOTP,
    createUserProfile,
    logout,
    hasOnboarded,
    setHasOnboarded,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
