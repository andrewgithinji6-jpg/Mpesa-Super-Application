import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING, SHADOWS } from '../utils/constants';

const { width } = Dimensions.get('window');

interface QuickAccessTileProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
  onPress: () => void;
  disabled?: boolean;
}

export default function QuickAccessTile({
  title,
  subtitle,
  icon,
  gradient,
  onPress,
  disabled = false,
}: QuickAccessTileProps) {
  const tileRef = useRef<Animatable.View>(null);

  const handlePress = async () => {
    if (disabled) return;

    // Animate press effect
    if (tileRef.current) {
      await tileRef.current.animate({
        0: { scale: 1 },
        0.1: { scale: 0.95 },
        0.2: { scale: 1 },
      }, 150);
    }

    // Call the onPress function
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <Animatable.View ref={tileRef} style={styles.tile}>
        <LinearGradient
          colors={gradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Icon Container */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons
                name={icon}
                size={24}
                color="white"
              />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>

          {/* Arrow Icon */}
          <View style={styles.arrowContainer}>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="rgba(255, 255, 255, 0.7)"
            />
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeElements}>
            <View style={[styles.decorativeCircle, styles.circle1]} />
            <View style={[styles.decorativeCircle, styles.circle2]} />
          </View>
        </LinearGradient>
      </Animatable.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    marginBottom: SPACING.md,
  },
  tile: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  gradient: {
    flex: 1,
    padding: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    marginBottom: SPACING.sm,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  arrowContainer: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 60,
    height: 60,
    top: -15,
    right: -15,
  },
  circle2: {
    width: 30,
    height: 30,
    bottom: -5,
    right: 10,
  },
});
