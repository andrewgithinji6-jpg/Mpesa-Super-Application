import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING, SHADOWS } from '../utils/constants';
import { formatAmount } from '../utils/helpers';

const { width } = Dimensions.get('window');

interface TransferModalProps {
  visible: boolean;
  onClose: () => void;
  transferType: 'mpesa_to_bank' | 'bank_to_mpesa';
  bank: any;
  onTransfer: (amount: string, reference: string) => void;
}

export default function TransferModal({
  visible,
  onClose,
  transferType,
  bank,
  onTransfer,
}: TransferModalProps) {
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (numAmount < 10) {
      Alert.alert('Error', 'Minimum transfer amount is KES 10');
      return;
    }

    // Check if transfer is from bank and amount exceeds balance
    if (transferType === 'bank_to_mpesa' && numAmount > bank.balance) {
      Alert.alert('Error', 'Insufficient bank account balance');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onTransfer(amount, reference);
    }, 2000);
  };

  const handleClose = () => {
    setAmount('');
    setReference('');
    setLoading(false);
    onClose();
  };

  const getTransferTitle = () => {
    return transferType === 'mpesa_to_bank' ? 'Transfer to Bank' : 'Transfer from Bank';
  };

  const getTransferIcon = () => {
    return transferType === 'mpesa_to_bank' ? 'arrow-up' : 'arrow-down';
  };

  const getTransferColor = () => {
    return transferType === 'mpesa_to_bank' ? COLORS.primary : '#4ECDC4';
  };

  const getTransferGradient = () => {
    return transferType === 'mpesa_to_bank' 
      ? [COLORS.primary, COLORS.primaryDark]
      : ['#4ECDC4', '#26A69A'];
  };

  const suggestedAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.overlay}>
          <Animatable.View animation="slideInUp" style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={[styles.headerIcon, { backgroundColor: getTransferColor() }]}>
                  <Ionicons name={getTransferIcon() as keyof typeof Ionicons.glyphMap} size={24} color="white" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>{getTransferTitle()}</Text>
                  <Text style={styles.headerSubtitle}>{bank?.bankName}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.gray500} />
              </TouchableOpacity>
            </View>

            {/* Bank Info */}
            {bank && (
              <View style={styles.bankInfo}>
                <View style={styles.bankLogo}>
                  <Text style={styles.bankLogoText}>{bank.bankLogo || '🏦'}</Text>
                </View>
                <View style={styles.bankDetails}>
                  <Text style={styles.bankName}>{bank.bankName}</Text>
                  <Text style={styles.accountNumber}>•••• {bank.accountNumber.slice(-4)}</Text>
                  <Text style={styles.accountName}>{bank.accountName}</Text>
                  {transferType === 'bank_to_mpesa' && (
                    <Text style={styles.balance}>
                      Available: {formatAmount(bank.balance)}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Amount Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Amount (KES)</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>KES</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.gray400}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Suggested Amounts */}
            <View style={styles.suggestedSection}>
              <Text style={styles.suggestedLabel}>Quick Amounts</Text>
              <View style={styles.suggestedAmounts}>
                {suggestedAmounts.map((suggestedAmount) => (
                  <TouchableOpacity
                    key={suggestedAmount}
                    style={[
                      styles.suggestedButton,
                      amount === suggestedAmount.toString() && styles.selectedSuggestedButton
                    ]}
                    onPress={() => setAmount(suggestedAmount.toString())}
                  >
                    <Text style={[
                      styles.suggestedButtonText,
                      amount === suggestedAmount.toString() && styles.selectedSuggestedButtonText
                    ]}>
                      {formatAmount(suggestedAmount)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Reference Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Reference (Optional)</Text>
              <TextInput
                style={styles.referenceInput}
                placeholder="Enter reference"
                placeholderTextColor={COLORS.gray400}
                value={reference}
                onChangeText={setReference}
                maxLength={50}
              />
            </View>

            {/* Transfer Summary */}
            {amount && (
              <Animatable.View animation="fadeInUp" style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Transfer Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount:</Text>
                  <Text style={styles.summaryValue}>{formatAmount(parseFloat(amount) || 0)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>To:</Text>
                  <Text style={styles.summaryValue}>{bank?.bankName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Account:</Text>
                  <Text style={styles.summaryValue}>•••• {bank?.accountNumber.slice(-4)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Fee:</Text>
                  <Text style={styles.summaryValue}>KES 0</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>{formatAmount(parseFloat(amount) || 0)}</Text>
                </View>
              </Animatable.View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonSection}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.transferButton,
                  (!amount || loading) && styles.disabledButton
                ]}
                onPress={handleTransfer}
                disabled={!amount || loading}
              >
                <LinearGradient
                  colors={loading ? [COLORS.gray400, COLORS.gray500] : getTransferGradient()}
                  style={styles.transferButtonGradient}
                >
                  <Text style={styles.transferButtonText}>
                    {loading ? 'Processing...' : 'Transfer Now'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray800,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray600,
    marginTop: 2,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  bankLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.sm,
  },
  bankLogoText: {
    fontSize: 28,
  },
  bankDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 16,
    color: COLORS.gray600,
    marginBottom: 2,
  },
  accountName: {
    fontSize: 14,
    color: COLORS.gray500,
    marginBottom: 4,
  },
  balance: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: SPACING.sm,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  currencySymbol: {
    fontSize: 18,
    color: COLORS.gray600,
    marginRight: SPACING.sm,
    fontWeight: '600',
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: COLORS.gray800,
    fontWeight: 'bold',
  },
  suggestedSection: {
    marginBottom: SPACING.lg,
  },
  suggestedLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: SPACING.sm,
  },
  suggestedAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  suggestedButton: {
    backgroundColor: COLORS.gray100,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  selectedSuggestedButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  suggestedButtonText: {
    fontSize: 14,
    color: COLORS.gray700,
    fontWeight: '600',
  },
  selectedSuggestedButtonText: {
    color: 'white',
  },
  referenceInput: {
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.gray800,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  summarySection: {
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray800,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray600,
  },
  transferButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  transferButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  transferButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
