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
import { formatAmount, getRelativeTime } from '../utils/helpers';

const { width } = Dimensions.get('window');

interface BankCardProps {
  bank: {
    id: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    balance: number;
    accountType: string;
    isVerified: boolean;
    lastUsed: string;
    bankLogo?: string;
  };
  onTransferToBank: () => void;
  onTransferFromBank: () => void;
}

export default function BankCard({ bank, onTransferToBank, onTransferFromBank }: BankCardProps) {
  const cardRef = useRef<Animatable.View>(null);

  const handlePress = async () => {
    if (cardRef.current) {
      await cardRef.current.animate({
        0: { scale: 1 },
        0.1: { scale: 0.98 },
        0.2: { scale: 1 },
      }, 150);
    }
  };

  const getBankColor = (bankName: string) => {
    switch (bankName.toLowerCase()) {
      case 'kcb bank':
        return ['#2BB673', '#1E8B5A'];
      case 'equity bank':
        return ['#FF6B6B', '#FF5252'];
      case 'cooperative bank':
        return ['#4ECDC4', '#26A69A'];
      default:
        return [COLORS.primary, COLORS.primaryDark];
    }
  };

  const getBankIcon = (bankName: string) => {
    switch (bankName.toLowerCase()) {
      case 'kcb bank':
        return 'business';
      case 'equity bank':
        return 'trending-up';
      case 'cooperative bank':
        return 'people';
      default:
        return 'business';
    }
  };

  const bankGradient = getBankColor(bank.bankName);
  const bankIcon = getBankIcon(bank.bankName);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Animatable.View ref={cardRef} style={styles.card}>
        <LinearGradient
          colors={bankGradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Verified Badge */}
          {bank.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="white" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.bankInfo}>
              <View style={styles.bankLogo}>
                <Text style={styles.bankLogoText}>{bank.bankLogo || '🏦'}</Text>
              </View>
              <View style={styles.bankDetails}>
                <Text style={styles.bankName}>{bank.bankName}</Text>
                <Text style={styles.accountType}>{bank.accountType} Account</Text>
              </View>
            </View>
            <View style={styles.bankIcon}>
              <Ionicons name={bankIcon as keyof typeof Ionicons.glyphMap} size={24} color="rgba(255, 255, 255, 0.8)" />
            </View>
          </View>

          {/* Account Details */}
          <View style={styles.accountSection}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>Account Number</Text>
              <Text style={styles.accountNumber}>
                •••• {bank.accountNumber.slice(-4)}
              </Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>Account Name</Text>
              <Text style={styles.accountName}>{bank.accountName}</Text>
            </View>
          </View>

          {/* Balance */}
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>{formatAmount(bank.balance)}</Text>
          </View>

          {/* Transfer Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.transferButton}
              onPress={onTransferToBank}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                style={styles.buttonGradient}
              >
                <Ionicons name="arrow-up" size={16} color={bankGradient[0]} />
                <Text style={[styles.buttonText, { color: bankGradient[0] }]}>
                  Transfer To
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.transferButton}
              onPress={onTransferFromBank}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                style={styles.buttonGradient}
              >
                <Ionicons name="arrow-down" size={16} color={bankGradient[0]} />
                <Text style={[styles.buttonText, { color: bankGradient[0] }]}>
                  Transfer From
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Last Used */}
          <View style={styles.lastUsedSection}>
            <Text style={styles.lastUsedText}>
              Last used: {getRelativeTime(bank.lastUsed)}
            </Text>
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeElements}>
            <View style={[styles.decorativeCircle, styles.circle1]} />
            <View style={[styles.decorativeCircle, styles.circle2]} />
            <View style={[styles.decorativeCircle, styles.circle3]} />
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
  verifiedBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    zIndex: 1,
  },
  verifiedText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  bankLogoText: {
    fontSize: 24,
  },
  bankDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bankIcon: {
    opacity: 0.3,
  },
  accountSection: {
    marginBottom: SPACING.md,
  },
  accountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  accountLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SPACING.md,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  transferButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  lastUsedSection: {
    alignItems: 'center',
  },
  lastUsedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
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
