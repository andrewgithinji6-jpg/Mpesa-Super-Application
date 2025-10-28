import React from 'react';
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
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface PointsCardProps {
  totalPoints: number;
  availablePoints: number;
  tier: string;
  onRedeemNow: () => void;
  nextTierPoints?: number;
}

export default function PointsCard({
  totalPoints,
  availablePoints,
  tier,
  onRedeemNow,
  nextTierPoints = 500,
}: PointsCardProps) {
  // Calculate progress for next tier (simplified)
  const progress = Math.min((availablePoints / (availablePoints + nextTierPoints)) * 100, 100);
  const radius = 60;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return '#CD7F32';
      case 'silver':
        return '#C0C0C0';
      case 'gold':
        return '#FFD700';
      case 'platinum':
        return '#E5E4E2';
      default:
        return COLORS.primary;
    }
  };

  const tierColor = getTierColor(tier);

  return (
    <Animatable.View animation="fadeInUp" style={styles.container}>
      <LinearGradient
        colors={[tierColor, `${tierColor}CC`]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Progress Ring */}
        <View style={styles.progressContainer}>
          <Svg width="140" height="140" style={styles.progressSvg}>
            {/* Background Circle */}
            <Circle
              cx="70"
              cy="70"
              r={radius}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx="70"
              cy="70"
              r={radius}
              stroke="white"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />
          </Svg>
          
          {/* Center Content */}
          <View style={styles.centerContent}>
            <Text style={styles.pointsLabel}>Available Points</Text>
            <Text style={styles.pointsValue}>{availablePoints.toLocaleString()}</Text>
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>{tier}</Text>
            </View>
          </View>
        </View>

        {/* Points Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Points</Text>
              <Text style={styles.summaryValue}>{totalPoints.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryValue}>{(totalPoints - availablePoints).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Redeem Button */}
        <TouchableOpacity
          style={styles.redeemButton}
          onPress={onRedeemNow}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
            style={styles.buttonGradient}
          >
            <Ionicons name="gift" size={20} color={tierColor} />
            <Text style={[styles.buttonText, { color: tierColor }]}>Redeem Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Decorative Elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>
      </LinearGradient>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  card: {
    borderRadius: 24,
    padding: SPACING.xl,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  progressSvg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.xs,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.sm,
  },
  tierBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tierText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  summarySection: {
    marginBottom: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: SPACING.lg,
  },
  redeemButton: {
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
  circle: {
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
    width: 120,
    height: 120,
    top: 60,
    right: -40,
  },
  circle3: {
    width: 60,
    height: 60,
    bottom: -10,
    left: -10,
  },
});
