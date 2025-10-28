import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/constants';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onFinish: () => void;
}

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: string[];
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: 'All Your Safaricom Services',
    subtitle: 'in One App',
    description: 'Access M-Pesa, data bundles, SMS, Bonga Points, and bank services all in one convenient place.',
    icon: 'apps',
    color: COLORS.primary,
    gradient: [COLORS.primary, COLORS.primaryDark],
  },
  {
    id: 2,
    title: 'Manage Data, SMS, and',
    subtitle: 'Bonga Points Instantly',
    description: 'Buy data bundles, SMS packages, and redeem Bonga Points with just a few taps.',
    icon: 'wifi',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF5252'],
  },
  {
    id: 3,
    title: 'Pay Bills and Move',
    subtitle: 'Money Faster',
    description: 'Pay utility bills, send money, and transfer to banks instantly with enhanced security.',
    icon: 'flash',
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#26A69A'],
  },
];

export default function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    onFinish();
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    onFinish();
  };

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={styles.slide}>
      <LinearGradient
        colors={item.gradient}
        style={styles.slideGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>

        <SafeAreaView style={styles.slideContent}>
          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {/* Icon */}
          <Animatable.View
            animation="zoomIn"
            duration={1000}
            delay={200}
            style={styles.iconContainer}
          >
            <View style={[styles.iconBackground, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Ionicons name={item.icon} size={80} color="white" />
            </View>
          </Animatable.View>

          {/* Content */}
          <View style={styles.textContainer}>
            <Animatable.View
              animation="fadeInUp"
              duration={1000}
              delay={400}
              style={styles.titleContainer}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </Animatable.View>

            <Animatable.View
              animation="fadeInUp"
              duration={1000}
              delay={600}
              style={styles.descriptionContainer}
            >
              <Text style={styles.description}>{item.description}</Text>
            </Animatable.View>
          </View>

          {/* Navigation Buttons */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={800}
            style={styles.buttonContainer}
          >
            <View style={styles.navigationButtons}>
              {currentIndex > 0 && (
                <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              )}
              
              <View style={styles.spacer} />
              
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                  style={styles.nextButtonGradient}
                >
                  <Text style={[styles.nextButtonText, { color: item.color }]}>
                    {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                  </Text>
                  <Ionicons 
                    name={currentIndex === onboardingData.length - 1 ? 'checkmark' : 'arrow-forward'} 
                    size={20} 
                    color={item.color} 
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {onboardingData.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.activeDot,
          ]}
          onPress={() => {
            setCurrentIndex(index);
            flatListRef.current?.scrollToIndex({ index, animated: true });
          }}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      
      {renderPaginationDots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  slide: {
    width,
    height,
  },
  slideGradient: {
    flex: 1,
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
    width: 200,
    height: 200,
    top: height * 0.1,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: height * 0.3,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.6,
    right: 50,
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  descriptionContainer: {
    alignItems: 'center',
  },
  description: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '300',
  },
  buttonContainer: {
    paddingBottom: SPACING.xl,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previousButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: SPACING.sm,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 30,
    height: 10,
    borderRadius: 5,
  },
});
