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
import { formatAmount } from '../utils/helpers';

const { width } = Dimensions.get('window');

interface BundleCardProps {
  bundle: {
    id: string;
    name: string;
    description: string;
    price: number;
    validity: string;
    size?: string;
    count?: number;
    category: 'data' | 'sms';
    popular: boolean;
    features: string[];
  };
  onPress: () => void;
}

export default function BundleCard({ bundle, onPress }: BundleCardProps) {
  const cardRef = useRef<Animatable.View>(null);

  const handlePress = async () => {
    // Animate press effect
    if (cardRef.current) {
      await cardRef.current.animate({
        0: { scale: 1 },
        0.1: { scale: 0.98 },
        0.2: { scale: 1 },
      }, 150);
    }

    onPress();
  };

  const getBundleIcon = () => {
    return bundle.category === 'data' ? 'wifi' : 'chatbubble';
  };

  const getBundleColor = () => {
    return bundle.category === 'data' ? COLORS.primary : '#FF6B6B';
  };

  const getBundleGradient = () => {
    return bundle.category === 'data' 
      ? [COLORS.primary, COLORS.primaryDark]
      : ['#FF6B6B', '#FF5252'];
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Animatable.View ref={cardRef} style={styles.card}>
        <LinearGradient
          colors={getBundleGradient()}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Popular Badge */}
          {bundle.popular && (
            <View style={styles.popularBadge}>
              <Ionicons name="star" size={12} color="white" />
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={getBundleIcon() as keyof typeof Ionicons.glyphMap}
                size={24}
                color="white"
              />
            </View>
            <View style={styles.bundleInfo}>
              <Text style={styles.bundleName}>{bundle.name}</Text>
              <Text style={styles.bundleDescription}>{bundle.description}</Text>
            </View>
          </View>

          {/* Bundle Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Size</Text>
              <Text style={styles.detailValue}>
                {bundle.size || `${bundle.count} SMS`}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Validity</Text>
              <Text style={styles.detailValue}>{bundle.validity}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>{formatAmount(bundle.price)}</Text>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Includes:</Text>
            <View style={styles.featuresList}>
              {bundle.features.slice(0, 2).map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={14} color="white" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Buy Button */}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.buttonGradient}
            >
              <Ionicons name="card" size={16} color={getBundleColor()} />
              <Text style={[styles.buttonText, { color: getBundleColor() }]}>
                Buy Now
              </Text>
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
    marginBottom: SPACING.md,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  gradient: {
    padding: SPACING.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  bundleInfo: {
    flex: 1,
  },
  bundleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bundleDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SPACING.md,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: SPACING.md,
  },
  featuresTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginBottom: SPACING.xs,
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
    flex: 1,
  },
  buyButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
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
    width: 80,
    height: 80,
    top: -20,
    right: -20,
  },
  circle2: {
    width: 60,
    height: 60,
    bottom: -10,
    right: 20,
  },
});
