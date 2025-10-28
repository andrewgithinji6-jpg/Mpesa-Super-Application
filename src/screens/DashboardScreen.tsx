import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';
import BalanceCard from '../components/BalanceCard';
import QuickAccessTile from '../components/QuickAccessTile';
import RecentTransactions from '../components/RecentTransactions';
import useDashboard from '../hooks/useDashboard';
import { COLORS, SPACING, SHADOWS } from '../utils/constants';
import { getRelativeTime } from '../utils/helpers';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const quickAccessItems = [
  {
    id: 'send-money',
    title: 'Send Money',
    subtitle: 'Transfer to M-Pesa',
    icon: 'send' as keyof typeof Ionicons.glyphMap,
    color: COLORS.primary,
    gradient: [COLORS.primary, '#1E8B5A'],
    onPress: () => console.log('Send Money pressed'),
  },
  {
    id: 'buy-airtime',
    title: 'Buy Airtime',
    subtitle: 'Top up your phone',
    icon: 'phone-portrait' as keyof typeof Ionicons.glyphMap,
    color: COLORS.accent,
    gradient: [COLORS.accent, '#FF5252'],
    onPress: () => console.log('Buy Airtime pressed'),
  },
  {
    id: 'pay-bill',
    title: 'Pay Bill',
    subtitle: 'Utilities & services',
    icon: 'receipt' as keyof typeof Ionicons.glyphMap,
    color: COLORS.secondary,
    gradient: [COLORS.secondary, '#26A69A'],
    onPress: () => console.log('Pay Bill pressed'),
  },
  {
    id: 'withdraw-cash',
    title: 'Withdraw Cash',
    subtitle: 'ATM withdrawal',
    icon: 'card' as keyof typeof Ionicons.glyphMap,
    color: '#45B7D1',
    gradient: ['#45B7D1', '#2196F3'],
    onPress: () => console.log('Withdraw Cash pressed'),
  },
  {
    id: 'bonga-points',
    title: 'Bonga Points',
    subtitle: 'Loyalty rewards',
    icon: 'gift' as keyof typeof Ionicons.glyphMap,
    color: '#96CEB4',
    gradient: ['#96CEB4', '#4CAF50'],
    onPress: () => (navigation as any).navigate('BongaPoints'),
  },
  {
    id: 'bank-services',
    title: 'Bank Services',
    subtitle: 'Transfer to/from bank',
    icon: 'business' as keyof typeof Ionicons.glyphMap,
    color: '#FFEAA7',
    gradient: ['#FFEAA7', '#FFC107'],
    onPress: () => (navigation as any).navigate('Bank'),
  },
  {
    id: 'buy-data',
    title: 'Buy Data',
    subtitle: 'Data bundles',
    icon: 'wifi' as keyof typeof Ionicons.glyphMap,
    color: '#DDA0DD',
    gradient: ['#DDA0DD', '#9C27B0'],
    onPress: () => (navigation as any).navigate('Bundles'),
  },
  {
    id: 'transaction-history',
    title: 'History',
    subtitle: 'View transactions',
    icon: 'time' as keyof typeof Ionicons.glyphMap,
    color: '#FFB6C1',
    gradient: ['#FFB6C1', '#E91E63'],
    onPress: () => (navigation as any).navigate('Transactions'),
  },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { 
    userProfile, 
    isLoading, 
    error, 
    refreshData,
    getRecentTransactions,
    transactionStats 
  } = useDashboard();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Handle refresh
  const onRefresh = async () => {
    await refreshData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header Section */}
        <Animatable.View animation="fadeInDown" delay={200} style={styles.header}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Text style={styles.greeting}>
                  {getGreeting()}, {userProfile.name} 👋
                </Text>
                <Text style={styles.lastLogin}>
                  Last login: {getRelativeTime(userProfile.lastLogin)}
                </Text>
              </View>
              
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerButton}>
                  <Ionicons name="notifications-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton}>
                  <Ionicons name="settings-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Balance Card */}
        <Animatable.View animation="fadeInUp" delay={400} style={styles.balanceSection}>
          <BalanceCard 
            balance={userProfile.balance}
            onAddMoney={() => console.log('Add Money pressed')}
            onWithdraw={() => console.log('Withdraw pressed')}
          />
        </Animatable.View>

        {/* Quick Access Tiles */}
        <Animatable.View animation="fadeInUp" delay={600} style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {quickAccessItems.map((item, index) => (
              <Animatable.View
                key={item.id}
                animation="fadeInUp"
                delay={800 + index * 100}
                style={styles.quickAccessItem}
              >
                <QuickAccessTile
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  gradient={item.gradient}
                  onPress={item.onPress}
                />
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

        {/* Recent Transactions */}
        <Animatable.View animation="fadeInUp" delay={1200} style={styles.recentTransactionsSection}>
          <RecentTransactions 
            transactions={getRecentTransactions()}
            onViewAll={() => console.log('View All Transactions pressed')}
            onTransactionPress={(transaction) => console.log('Transaction pressed:', transaction)}
          />
        </Animatable.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  scrollView: {
    flex: 1,
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
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.xs,
  },
  lastLogin: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  balanceSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  quickAccessSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: SPACING.lg,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    marginBottom: SPACING.md,
  },
  recentTransactionsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});
