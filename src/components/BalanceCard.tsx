import React, { useState } from 'react';
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

interface BalanceCardProps {
  balance: number;
  onAddMoney: () => void;
  onWithdraw: () => void;
  currency?: string;
}

export default function BalanceCard({ 
  balance, 
  onAddMoney, 
  onWithdraw,
  currency = 'KES'
}: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const displayBalance = showBalance ? formatAmount(balance, currency) : '••••••••';

  return (
    <Animatable.View 
      animation="fadeInUp" 
      style={styles.container}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Balance Header */}
        <View style={styles.balanceHeader}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>M-Pesa Balance</Text>
            <TouchableOpacity
              onPress={toggleBalanceVisibility}
              style={styles.eyeButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showBalance ? 'eye' : 'eye-off'}
                size={20}
                color="rgba(255, 255, 255, 0.8)"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Amount */}
        <Animatable.View
          animation={showBalance ? 'fadeIn' : 'fadeOut'}
          duration={300}
          style={styles.balanceAmountContainer}
        >
          <Text style={styles.balanceAmount}>{displayBalance}</Text>
        </Animatable.View>

        {/* Balance Subtext */}
        <Text style={styles.balanceSubtext}>Available balance</Text>

        {/* Quick Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAddMoney}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.buttonGradient}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.buttonText}>Add Money</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onWithdraw}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.buttonGradient}
            >
              <Ionicons name="arrow-up" size={20} color="white" />
              <Text style={styles.buttonText}>Withdraw</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
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
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    flex: 1,
  },
  eyeButton: {
    padding: SPACING.xs,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  balanceAmountContainer: {
    marginBottom: SPACING.sm,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  balanceSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
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
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
});
