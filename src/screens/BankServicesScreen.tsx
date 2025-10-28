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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  balance?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface TransferModalProps {
  visible: boolean;
  onClose: () => void;
  transferType: 'mpesa_to_bank' | 'bank_to_mpesa';
  accounts: BankAccount[];
  onTransfer: (amount: string, account: BankAccount, reference: string) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ 
  visible, 
  onClose, 
  transferType, 
  accounts, 
  onTransfer 
}) => {
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!amount || !selectedAccount || !reference) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Transfer Successful!',
        `KES ${amount} has been ${transferType === 'mpesa_to_bank' ? 'sent to' : 'received from'} ${selectedAccount.bankName} account.`,
        [
          {
            text: 'OK',
            onPress: () => {
              onTransfer(amount, selectedAccount, reference);
              onClose();
              setAmount('');
              setSelectedAccount(null);
              setReference('');
            }
          }
        ]
      );
    }, 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView 
        style={styles.modalOverlay} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {transferType === 'mpesa_to_bank' ? 'Transfer to Bank' : 'Transfer from Bank'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (KES)</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>KES</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Account Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Bank Account</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsScroll}>
                {accounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountCard,
                      selectedAccount?.id === account.id && styles.selectedAccountCard
                    ]}
                    onPress={() => setSelectedAccount(account)}
                  >
                    <View style={[styles.accountIcon, { backgroundColor: account.color }]}>
                      <Ionicons name={account.icon} size={20} color="white" />
                    </View>
                    <Text style={styles.accountBank}>{account.bankName}</Text>
                    <Text style={styles.accountNumber}>•••• {account.accountNumber.slice(-4)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Reference */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reference (Optional)</Text>
              <TextInput
                style={styles.referenceInput}
                placeholder="Enter reference"
                placeholderTextColor="#999"
                value={reference}
                onChangeText={setReference}
              />
            </View>

            {/* Transfer Details */}
            {amount && selectedAccount && (
              <Animatable.View animation="fadeInUp" style={styles.transferSummary}>
                <Text style={styles.summaryTitle}>Transfer Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount:</Text>
                  <Text style={styles.summaryValue}>KES {parseFloat(amount).toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>To:</Text>
                  <Text style={styles.summaryValue}>{selectedAccount.bankName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Account:</Text>
                  <Text style={styles.summaryValue}>•••• {selectedAccount.accountNumber.slice(-4)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Fee:</Text>
                  <Text style={styles.summaryValue}>KES 0</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>KES {parseFloat(amount).toLocaleString()}</Text>
                </View>
              </Animatable.View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.transferButton,
                (!amount || !selectedAccount || loading) && styles.transferButtonDisabled
              ]}
              onPress={handleTransfer}
              disabled={!amount || !selectedAccount || loading}
            >
              <Text style={styles.transferButtonText}>
                {loading ? 'Processing...' : 'Transfer Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

interface BankServiceCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

const BankServiceCard: React.FC<BankServiceCardProps> = ({ title, description, icon, color, onPress }) => (
  <TouchableOpacity style={styles.serviceCard} onPress={onPress}>
    <LinearGradient
      colors={[color, `${color}CC`]}
      style={styles.serviceCardGradient}
    >
      <View style={styles.serviceCardContent}>
        <Ionicons name={icon} size={30} color="white" />
        <Text style={styles.serviceCardTitle}>{title}</Text>
        <Text style={styles.serviceCardDescription}>{description}</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function BankServicesScreen() {
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferType, setTransferType] = useState<'mpesa_to_bank' | 'bank_to_mpesa'>('mpesa_to_bank');

  const bankAccounts: BankAccount[] = [
    {
      id: '1',
      bankName: 'KCB Bank',
      accountNumber: '1234567890',
      accountName: 'John Doe',
      balance: 'KES 45,230.00',
      icon: 'business',
      color: '#2BB673'
    },
    {
      id: '2',
      bankName: 'Equity Bank',
      accountNumber: '0987654321',
      accountName: 'John Doe',
      balance: 'KES 12,500.00',
      icon: 'business',
      color: '#FF6B6B'
    },
    {
      id: '3',
      bankName: 'Cooperative Bank',
      accountNumber: '1122334455',
      accountName: 'John Doe',
      balance: 'KES 8,750.00',
      icon: 'business',
      color: '#4ECDC4'
    },
  ];

  const bankServices = [
    {
      title: 'M-Pesa to Bank',
      description: 'Transfer money to your bank account',
      icon: 'arrow-up-circle' as keyof typeof Ionicons.glyphMap,
      color: '#2BB673',
      onPress: () => {
        setTransferType('mpesa_to_bank');
        setTransferModalVisible(true);
      }
    },
    {
      title: 'Bank to M-Pesa',
      description: 'Transfer money from your bank account',
      icon: 'arrow-down-circle' as keyof typeof Ionicons.glyphMap,
      color: '#FF6B6B',
      onPress: () => {
        setTransferType('bank_to_mpesa');
        setTransferModalVisible(true);
      }
    },
    {
      title: 'Link Bank Account',
      description: 'Add a new bank account',
      icon: 'link' as keyof typeof Ionicons.glyphMap,
      color: '#4ECDC4',
      onPress: () => Alert.alert('Coming Soon', 'Bank account linking feature will be available soon.')
    },
    {
      title: 'Bank Statements',
      description: 'View your bank account statements',
      icon: 'document-text' as keyof typeof Ionicons.glyphMap,
      color: '#45B7D1',
      onPress: () => Alert.alert('Coming Soon', 'Bank statements feature will be available soon.')
    },
  ];

  const handleTransfer = (amount: string, account: BankAccount, reference: string) => {
    console.log('Transfer completed:', { amount, account, reference });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bank Services</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="time-outline" size={24} color="#2BB673" />
        </TouchableOpacity>
      </View>

      {/* Balance Summary */}
      <View style={styles.balanceContainer}>
        <LinearGradient
          colors={['#2BB673', '#1E8B5A']}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Total Bank Balance</Text>
          <Text style={styles.balanceAmount}>KES 66,480.00</Text>
          <Text style={styles.balanceSubtext}>Across 3 bank accounts</Text>
        </LinearGradient>
      </View>

      {/* Bank Accounts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Bank Accounts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsList}>
          {bankAccounts.map((account, index) => (
            <Animatable.View
              key={account.id}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.bankAccountCard}
            >
              <View style={[styles.bankIcon, { backgroundColor: account.color }]}>
                <Ionicons name={account.icon} size={24} color="white" />
              </View>
              <Text style={styles.bankName}>{account.bankName}</Text>
              <Text style={styles.accountNumber}>•••• {account.accountNumber.slice(-4)}</Text>
              <Text style={styles.accountBalance}>{account.balance}</Text>
            </Animatable.View>
          ))}
        </ScrollView>
      </View>

      {/* Bank Services */}
      <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Bank Services</Text>
        <View style={styles.servicesGrid}>
          {bankServices.map((service, index) => (
            <Animatable.View
              key={index}
              animation="fadeInUp"
              delay={400 + index * 100}
              style={styles.serviceCardContainer}
            >
              <BankServiceCard {...service} />
            </Animatable.View>
          ))}
        </View>

        {/* Recent Bank Transactions */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Bank Transactions</Text>
          <View style={styles.recentList}>
            {[
              { 
                type: 'Transfer to KCB', 
                amount: '+KES 5,000', 
                date: '2 days ago', 
                icon: 'arrow-up-circle', 
                color: '#2BB673' 
              },
              { 
                type: 'Transfer from Equity', 
                amount: '-KES 2,500', 
                date: '5 days ago', 
                icon: 'arrow-down-circle', 
                color: '#FF6B6B' 
              },
              { 
                type: 'KCB Deposit', 
                amount: '+KES 10,000', 
                date: '1 week ago', 
                icon: 'add-circle', 
                color: '#4ECDC4' 
              },
            ].map((transaction, index) => (
              <Animatable.View
                key={index}
                animation="fadeInRight"
                delay={800 + index * 100}
                style={styles.recentItem}
              >
                <View style={[styles.recentIcon, { backgroundColor: transaction.color }]}>
                  <Ionicons name={transaction.icon as any} size={20} color="white" />
                </View>
                <View style={styles.recentDetails}>
                  <Text style={styles.recentType}>{transaction.type}</Text>
                  <Text style={styles.recentDate}>{transaction.date}</Text>
                </View>
                <Text style={[
                  styles.recentAmount,
                  { color: transaction.amount.startsWith('+') ? '#2BB673' : '#FF6B6B' }
                ]}>
                  {transaction.amount}
                </Text>
              </Animatable.View>
            ))}
          </View>
        </View>
      </ScrollView>

      <TransferModal
        visible={transferModalVisible}
        onClose={() => setTransferModalVisible(false)}
        transferType={transferType}
        accounts={bankAccounts}
        onTransfer={handleTransfer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  historyButton: {
    padding: 10,
  },
  balanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  balanceSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  accountsList: {
    marginBottom: 10,
  },
  bankAccountCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  bankIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2BB673',
  },
  servicesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  serviceCardContainer: {
    width: '48%',
    marginBottom: 15,
  },
  serviceCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  serviceCardGradient: {
    padding: 20,
    minHeight: 120,
  },
  serviceCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  serviceCardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 20,
  },
  recentList: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recentDetails: {
    flex: 1,
  },
  recentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  recentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
    maxHeight: 500,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
    fontWeight: '600',
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  accountsScroll: {
    marginBottom: 10,
  },
  accountCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    width: 140,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAccountCard: {
    borderColor: '#2BB673',
    backgroundColor: '#2BB67310',
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  accountBank: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  accountNumber: {
    fontSize: 12,
    color: '#666',
  },
  referenceInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  transferSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2BB673',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  transferButton: {
    backgroundColor: '#2BB673',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transferButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  transferButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
