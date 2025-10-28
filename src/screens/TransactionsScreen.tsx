import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'airtime' | 'data' | 'bill' | 'withdrawal' | 'deposit';
  amount: number;
  recipient?: string;
  description: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onFilter: (filter: string) => void;
  selectedFilter: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onFilter, selectedFilter }) => {
  const filters = [
    { key: 'all', label: 'All Transactions', icon: 'list' },
    { key: 'sent', label: 'Sent Money', icon: 'arrow-up-circle' },
    { key: 'received', label: 'Received Money', icon: 'arrow-down-circle' },
    { key: 'airtime', label: 'Airtime', icon: 'phone-portrait' },
    { key: 'data', label: 'Data Bundle', icon: 'wifi' },
    { key: 'bill', label: 'Bill Payment', icon: 'receipt' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Transactions</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filterList}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterItem,
                  selectedFilter === filter.key && styles.selectedFilterItem
                ]}
                onPress={() => {
                  onFilter(filter.key);
                  onClose();
                }}
              >
                <Ionicons 
                  name={filter.icon as any} 
                  size={20} 
                  color={selectedFilter === filter.key ? '#2BB673' : '#666'} 
                />
                <Text style={[
                  styles.filterLabel,
                  selectedFilter === filter.key && styles.selectedFilterLabel
                ]}>
                  {filter.label}
                </Text>
                {selectedFilter === filter.key && (
                  <Ionicons name="checkmark" size={20} color="#2BB673" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'sent': return 'arrow-up-circle';
      case 'received': return 'arrow-down-circle';
      case 'airtime': return 'phone-portrait';
      case 'data': return 'wifi';
      case 'bill': return 'receipt';
      case 'withdrawal': return 'card';
      case 'deposit': return 'add-circle';
      default: return 'help-circle';
    }
  };

  const getTransactionColor = () => {
    switch (transaction.type) {
      case 'received':
      case 'deposit':
        return '#2BB673';
      case 'sent':
      case 'airtime':
      case 'data':
      case 'bill':
      case 'withdrawal':
        return '#FF6B6B';
      default:
        return '#666';
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed': return '#2BB673';
      case 'pending': return '#FFA500';
      case 'failed': return '#FF6B6B';
      default: return '#666';
    }
  };

  return (
    <Animatable.View animation="fadeInRight" style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor() }]}>
        <Ionicons name={getTransactionIcon() as any} size={20} color="white" />
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{transaction.description}</Text>
        {transaction.recipient && (
          <Text style={styles.transactionRecipient}>{transaction.recipient}</Text>
        )}
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
          <Text style={styles.transactionTime}>{transaction.time}</Text>
          {transaction.reference && (
            <Text style={styles.transactionRef}>Ref: {transaction.reference}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.transactionAmountContainer}>
        <Text style={[
          styles.transactionAmount,
          { color: getTransactionColor() }
        ]}>
          {transaction.type === 'received' || transaction.type === 'deposit' ? '+' : '-'}
          KES {transaction.amount.toLocaleString()}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
      </View>
    </Animatable.View>
  );
};

export default function TransactionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock transaction data
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'received',
      amount: 5000,
      recipient: 'Jane Smith',
      description: 'Payment from Jane Smith',
      date: '2024-01-15',
      time: '14:30',
      status: 'completed',
      reference: 'MP2401151430'
    },
    {
      id: '2',
      type: 'airtime',
      amount: 100,
      description: 'Airtime Purchase',
      date: '2024-01-15',
      time: '12:15',
      status: 'completed'
    },
    {
      id: '3',
      type: 'data',
      amount: 250,
      description: '2.5GB Data Bundle',
      date: '2024-01-14',
      time: '16:45',
      status: 'completed'
    },
    {
      id: '4',
      type: 'sent',
      amount: 1500,
      recipient: 'John Doe',
      description: 'Send Money to John Doe',
      date: '2024-01-14',
      time: '10:20',
      status: 'completed',
      reference: 'MP2401141020'
    },
    {
      id: '5',
      type: 'bill',
      amount: 850,
      description: 'KPLC Bill Payment',
      date: '2024-01-13',
      time: '09:30',
      status: 'completed'
    },
    {
      id: '6',
      type: 'withdrawal',
      amount: 2000,
      description: 'ATM Withdrawal',
      date: '2024-01-13',
      time: '18:15',
      status: 'completed'
    },
    {
      id: '7',
      type: 'sent',
      amount: 500,
      recipient: 'Mary Johnson',
      description: 'Send Money to Mary Johnson',
      date: '2024-01-12',
      time: '15:45',
      status: 'pending',
      reference: 'MP2401121545'
    },
  ]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.recipient?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || transaction.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getTotalAmount = (type: 'sent' | 'received') => {
    return transactions
      .filter(t => t.type === type && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={24} color="#2BB673" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons name="arrow-down-circle" size={24} color="#2BB673" />
          </View>
          <View style={styles.summaryDetails}>
            <Text style={styles.summaryLabel}>Money In</Text>
            <Text style={styles.summaryAmount}>KES {getTotalAmount('received').toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#FF6B6B20' }]}>
            <Ionicons name="arrow-up-circle" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.summaryDetails}>
            <Text style={styles.summaryLabel}>Money Out</Text>
            <Text style={[styles.summaryAmount, { color: '#FF6B6B' }]}>
              KES {getTotalAmount('sent').toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={60} color="#CCC" />
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Your transactions will appear here'}
            </Text>
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onFilter={setSelectedFilter}
        selectedFilter={selectedFilter}
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
  filterButton: {
    padding: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  summaryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2BB67320',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  summaryDetails: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2BB673',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  transactionRecipient: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginRight: 10,
  },
  transactionTime: {
    fontSize: 12,
    color: '#999',
    marginRight: 10,
  },
  transactionRef: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '70%',
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
  filterList: {
    maxHeight: 400,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedFilterItem: {
    backgroundColor: '#2BB67310',
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  selectedFilterLabel: {
    color: '#2BB673',
    fontWeight: '600',
  },
});
