import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/constants';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user has onboarded before
        const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
        
        // Simulate app initialization time
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setIsVisible(false);
        
        // Small delay before navigation for smooth transition
        setTimeout(() => {
          onFinish();
        }, 500);
      } catch (error) {
        console.error('Error initializing app:', error);
        onFinish();
      }
    };

    initializeApp();
  }, [onFinish]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
          <View style={[styles.circle, styles.circle4]} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* App Logo */}
          <Animatable.View
            animation="zoomIn"
            duration={1500}
            delay={500}
            style={styles.logoContainer}
          >
            <View style={styles.logoBackground}>
              <Ionicons name="phone-portrait" size={60} color="white" />
            </View>
            <Text style={styles.appName}>M-Pesa+</Text>
            <Text style={styles.appSubtitle}>SuperApp</Text>
          </Animatable.View>

          {/* Tagline */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={1500}
            style={styles.taglineContainer}
          >
            <Text style={styles.tagline}>Experience M-Pesa,</Text>
            <Text style={styles.taglineAccent}>Reinvented</Text>
          </Animatable.View>

          {/* Loading Indicator */}
          <Animatable.View
            animation="fadeIn"
            duration={500}
            delay={2000}
            style={styles.loadingContainer}
          >
            <View style={styles.loadingDots}>
              <Animatable.View
                animation="bounce"
                iterationCount="infinite"
                duration={1000}
                delay={0}
                style={[styles.dot, styles.dot1]}
              />
              <Animatable.View
                animation="bounce"
                iterationCount="infinite"
                duration={1000}
                delay={200}
                style={[styles.dot, styles.dot2]}
              />
              <Animatable.View
                animation="bounce"
                iterationCount="infinite"
                duration={1000}
                delay={400}
                style={[styles.dot, styles.dot3]}
              />
            </View>
            <Text style={styles.loadingText}>Initializing...</Text>
          </Animatable.View>
        </View>

        {/* Footer */}
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          delay={2500}
          style={styles.footer}
        >
          <Text style={styles.footerText}>Powered by Safaricom</Text>
        </Animatable.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 200,
    height: 200,
    top: height * 0.1,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    top: height * 0.3,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: height * 0.2,
    right: 50,
  },
  circle4: {
    width: 120,
    height: 120,
    bottom: height * 0.4,
    left: -60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...StyleSheet.absoluteFillObject,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '300',
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  tagline: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 4,
  },
  taglineAccent: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  dot1: {},
  dot2: {},
  dot3: {},
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '300',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '300',
  },
});
