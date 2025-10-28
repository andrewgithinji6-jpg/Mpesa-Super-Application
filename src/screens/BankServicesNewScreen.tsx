import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import BankCard from '../components/BankCard';
import TransferModal from '../components/TransferModal';
import { COLORS, SPACING, SHADOWS } from '../utils/constants';
import { formatAmount } from '../utils/helpers';

const { width } = Dimensions.get('window');

// Mock data for bank services
const mockBankAccounts = [
  {
    id: 'bank_1',
    bankName: 'KCB Bank',
    accountNumber: '1234567890',
    accountName: 'Andrew Mwangi',
    balance: 45230.00,
    accountType: 'Savings',
    isVerified: true,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    bankLogo: '🏦', // In real app, this would be an image URL
  },
  {
    id: 'bank_2',
    bankName: 'Equity Bank',
    accountNumber: '0987654321',
    accountName: 'Andrew Mwangi',
    balance: 12500.00,
    accountType: 'Current',
    isVerified: true,
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    bankLogo: '🏛️',
  },
  {
    id: 'bank_3',
    bankName: 'Cooperative Bank',
    accountNumber: '1122334455',
    accountName: 'Andrew Mwangi',
    balance: 8750.00,
    accountType: 'Savings',
    isVerified: true,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    bankLogo: '🏪',
  },
];

const mockTransferHistory = [
  {
    id: '1',
    type: 'mpesa_to_bank',
    bankName: 'KCB Bank',
    amount: 5000,
    status: 'completed',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reference: 'TR240115001',
  },
  {
    id: '2',
    type: 'bank_to_mpesa',
    bankName: 'Equity Bank',
    amount: 2500,
    status: 'completed',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reference: 'TR240112002',
  },
  {
    id: '3',
    type: 'mpesa_to_bank',
    bankName: 'Cooperative Bank',
    amount: 1000,
    status: 'pending',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reference: 'TR240114003',
  },
];

export default function BankServicesNewScreen() {
  const [bankAccounts] = useState(mockBankAccounts);
  const [transferHistory] = useState(mockTransferHistory);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<'mpesa_to_bank' | 'bank_to_mpesa'>('mpesa_to_bank');
  const [selectedBank, setSelectedBank] = useState<any>(null);

  const handleAddBankAccount = () => {
    Alert.alert(
      'Add Bank Account',
      'This feature will allow you to link your bank account to M-Pesa for seamless transfers.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Add bank account') },
      ]
    );
  };

  const handleTransferToBank = (bank: any) => {
    setSelectedBank(bank);
    setTransferType('mpesa_to_bank');
    setShowTransferModal(true);
  };

  const handleTransferFromBank = (bank: any) => {
    setSelectedBank(bank);
    setTransferType('bank_to_mpesa');
    setShowTransferModal(true);
  };

  const handleTransfer = (amount: string, reference: string) => {
    Alert.alert(
      'Transfer Initiated',
      `Transferring ${formatAmount(parseFloat(amount))} ${transferType === 'mpesa_to_bank' ? 'to' : 'from'} ${selectedBank?.bankName}`,
      [
        { text: 'OK', onPress: () => setShowTransferModal(false) }
      ]
    );
  };

  const handleViewAllTransfers = () => {
    Alert.alert('Transfer History', 'View all bank transfers');
  };

  const totalBankBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bank Services</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="help-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animatable.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Total Balance Card */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceIcon}>
                <Ionicons name="business" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Total Bank Balance</Text>
                <Text style={styles.balanceAmount}>{formatAmount(totalBankBalance)}</Text>
                <Text style={styles.balanceSubtext}>Across {bankAccounts.length} accounts</Text>
              </View>
            </View>
          </View>
        </Animatable.View>

        {/* Quick Actions */}
        <Animatable.View animation="fadeInUp" delay={400} style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleAddBankAccount}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.actionGradient}
              >
                <Ionicons name="add-circle" size={30} color="white" />
                <Text style={styles.actionText}>Add Bank Account</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                setSelectedBank(bankAccounts[0]);
                setTransferType('mpesa_to_bank');
                setShowTransferModal(true);
              }}
            >
              <LinearGradient
                colors={['#4ECDC4', '#26A69A']}
                style={styles.actionGradient}
              >
                <Ionicons name="arrow-up" size={30} color="white" />
                <Text style={styles.actionText}>M-Pesa to Bank</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                setSelectedBank(bankAccounts[0]);
                setTransferType('bank_to_mpesa');
                setShowTransferModal(true);
              }}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF5252']}
                style={styles.actionGradient}
              >
                <Ionicons name="arrow-down" size={30} color="white" />
                <Text style={styles.actionText}>Bank to M-Pesa</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Linked Banks */}
        <Animatable.View animation="fadeInUp" delay={600} style={styles.banksSection}>
          <Text style={styles.sectionTitle}>Linked Bank Accounts</Text>
          {bankAccounts.map((bank, index) => (
            <Animatable.View
              key={bank.id}
              animation="fadeInUp"
              delay={800 + index * 100}
              style={styles.bankItem}
            >
              <BankCard
                bank={bank}
                onTransferToBank={() => handleTransferToBank(bank)}
                onTransferFromBank={() => handleTransferFromBank(bank)}
              />
            </Animatable.View>
          ))}
        </Animatable.View>

        {/* Recent Transfers */}
        <Animatable.View animation="fadeInUp" delay={1000} style={styles.transfersSection}>
          <View style={styles.transfersHeader}>
            <Text style={styles.sectionTitle}>Recent Transfers</Text>
            <TouchableOpacity onPress={handleViewAllTransfers}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transfersList}>
            {transferHistory.map((transfer, index) => (
              <Animatable.View
                key={transfer.id}
                animation="fadeInRight"
                delay={1200 + index * 100}
                style={styles.transferItem}
              >
                <View style={[
                  styles.transferIcon,
                  { backgroundColor: transfer.type === 'mpesa_to_bank' ? COLORS.primary : '#4ECDC4' }
                ]}>
                  <Ionicons
                    name={transfer.type === 'mpesa_to_bank' ? 'arrow-up' : 'arrow-down'}
                    size={20}
                    color="white"
                  />
                </View>
                <View style={styles.transferDetails}>
                  <Text style={styles.transferDescription}>
                    {transfer.type === 'mpesa_to_bank' ? 'Transfer to Bank' : 'Transfer from Bank'}
                  </Text>
                  <Text style={styles.transferBank}>{transfer.bankName}</Text>
                  <Text style={styles.transferRef}>Ref: {transfer.reference}</Text>
                  <Text style={styles.transferDate}>
                    {new Date(transfer.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.transferRight}>
                  <Text style={[
                    styles.transferAmount,
                    { color: transfer.type === 'mpesa_to_bank' ? COLORS.accent : COLORS.primary }
                  ]}>
                    {transfer.type === 'mpesa_to_bank' ? '-' : '+'}{formatAmount(transfer.amount)}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: transfer.status === 'completed' ? COLORS.success : COLORS.warning }
                  ]}>
                    <Text style={styles.statusText}>{transfer.status}</Text>
                  </View>
                </View>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Transfer Modal */}
      <TransferModal
        visible={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        transferType={transferType}
        bank={selectedBank}
        onTransfer={handleTransfer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  headerGradient: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: SPACING.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  balanceSection: {
    marginBottom: SPACING.xl,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 16,
    color: COLORS.gray600,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  actionsSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: SPACING.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 3,
    height: 100,
    marginBottom: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  actionText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  banksSection: {
    marginBottom: SPACING.xl,
  },
  bankItem: {
    marginBottom: SPACING.md,
  },
  transfersSection: {
    marginBottom: SPACING.xl,
  },
  transfersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  viewAllText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  transfersList: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  transferItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  transferIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  transferDetails: {
    flex: 1,
  },
  transferDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: 2,
  },
  transferBank: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 2,
  },
  transferRef: {
    fontSize: 12,
    color: COLORS.gray500,
    marginBottom: 2,
  },
  transferDate: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  transferRight: {
    alignItems: 'flex-end',
  },
  transferAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});
