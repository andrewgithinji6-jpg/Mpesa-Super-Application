import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING, SHADOWS } from '../utils/constants';
import { formatAmount, getRelativeTime, getTransactionIcon, getTransactionColor, getStatusColor } from '../utils/helpers';

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'airtime' | 'data' | 'bill' | 'withdrawal' | 'deposit';
  amount: number;
  description: string;
  recipient?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  onViewAll?: () => void;
  onTransactionPress?: (transaction: Transaction) => void;
  maxItems?: number;
}

// Mock transaction data - In production, this would come from API/Firebase
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'received',
    amount: 5000,
    description: 'Payment from Jane Smith',
    recipient: 'Jane Smith',
    date: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    status: 'completed',
    reference: 'MP2401151430'
  },
  {
    id: '2',
    type: 'airtime',
    amount: 100,
    description: 'Airtime Purchase',
    date: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    status: 'completed'
  },
  {
    id: '3',
    type: 'data',
    amount: 250,
    description: '2.5GB Data Bundle',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    status: 'completed'
  },
  {
    id: '4',
    type: 'sent',
    amount: 1500,
    description: 'Send Money to John Doe',
    recipient: 'John Doe',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    status: 'completed',
    reference: 'MP2401141020'
  },
  {
    id: '5',
    type: 'bill',
    amount: 850,
    description: 'KPLC Bill Payment',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'pending'
  },
];

export default function RecentTransactions({
  transactions = mockTransactions,
  onViewAll,
  onTransactionPress,
  maxItems = 5,
}: RecentTransactionsProps) {
  const displayTransactions = transactions.slice(0, maxItems);

  const handleTransactionPress = (transaction: Transaction) => {
    if (onTransactionPress) {
      onTransactionPress(transaction);
    } else {
      console.log('Transaction pressed:', transaction);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      console.log('View All Transactions pressed');
    }
  };

  return (
    <Animatable.View animation="fadeInUp" style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <View style={styles.transactionsContainer}>
        {displayTransactions.length > 0 ? (
          displayTransactions.map((transaction, index) => (
            <Animatable.View
              key={transaction.id}
              animation="fadeInRight"
              delay={index * 100}
              style={styles.transactionItem}
            >
              <TouchableOpacity
                onPress={() => handleTransactionPress(transaction)}
                style={styles.transactionButton}
                activeOpacity={0.7}
              >
                {/* Transaction Icon */}
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: getTransactionColor(transaction.type) }
                ]}>
                  <Ionicons
                    name={getTransactionIcon(transaction.type) as any}
                    size={20}
                    color="white"
                  />
                </View>

                {/* Transaction Details */}
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription} numberOfLines={1}>
                    {transaction.description}
                  </Text>
                  {transaction.recipient && (
                    <Text style={styles.transactionRecipient} numberOfLines={1}>
                      {transaction.recipient}
                    </Text>
                  )}
                  <View style={styles.transactionMeta}>
                    <Text style={styles.transactionDate}>
                      {getRelativeTime(transaction.date)}
                    </Text>
                    {transaction.reference && (
                      <Text style={styles.transactionRef}>
                        Ref: {transaction.reference}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Transaction Amount and Status */}
                <View style={styles.transactionRight}>
                  <Text style={[
                    styles.transactionAmount,
                    { color: getTransactionColor(transaction.type) }
                  ]}>
                    {(transaction.type === 'received' || transaction.type === 'deposit') ? '+' : '-'}
                    {formatAmount(transaction.amount)}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(transaction.status) }
                  ]}>
                    <Text style={styles.statusText}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.gray400} />
            <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Your recent transactions will appear here
            </Text>
          </View>
        )}
      </View>

      {/* Quick Stats */}
      {displayTransactions.length > 0 && (
        <Animatable.View animation="fadeInUp" delay={600} style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>
              {formatAmount(displayTransactions.reduce((sum, t) => 
                t.type === 'received' || t.type === 'deposit' ? sum + t.amount : sum, 0
              ))}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={[styles.statValue, { color: COLORS.gray600 }]}>
              {displayTransactions.length}
            </Text>
          </View>
        </Animatable.View>
      )}
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray800,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  viewAllText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: SPACING.xs,
  },
  transactionsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: SPACING.md,
    ...SHADOWS.md,
  },
  transactionItem: {
    marginBottom: SPACING.md,
  },
  transactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  transactionDetails: {
    flex: 1,
    marginRight: SPACING.md,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: 2,
  },
  transactionRecipient: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.gray500,
    marginRight: SPACING.sm,
  },
  transactionRef: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
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
    paddingVertical: SPACING.xl,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray600,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: SPACING.md,
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray200,
    marginHorizontal: SPACING.md,
  },
});
