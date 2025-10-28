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

interface RedemptionOptionProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
  pointsRequired: number;
  value: string;
  popular?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export default function RedemptionOption({
  title,
  subtitle,
  icon,
  gradient,
  pointsRequired,
  value,
  popular = false,
  onPress,
  disabled = false,
}: RedemptionOptionProps) {
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
          {/* Popular Badge */}
          {popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}

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
            
            {/* Points and Value */}
            <View style={styles.detailsContainer}>
              <View style={styles.pointsContainer}>
                <Ionicons name="star" size={14} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.pointsText}>{pointsRequired.toLocaleString()} pts</Text>
              </View>
              <Text style={styles.valueText}>{value}</Text>
            </View>
          </View>

          {/* Redeem Button */}
          <TouchableOpacity
            style={styles.redeemButton}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Redeem</Text>
            </LinearGradient>
          </TouchableOpacity>

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
    height: 160,
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
  popularBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  iconContainer: {
    marginBottom: SPACING.sm,
  },
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.md,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
    fontWeight: '600',
  },
  valueText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  redeemButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 14,
    color: COLORS.gray800,
    fontWeight: 'bold',
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
