import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import PointsCard from '../components/PointsCard';
import RedemptionOption from '../components/RedemptionOption';
import { COLORS, SPACING, SHADOWS } from '../utils/constants';
import { formatAmount } from '../utils/helpers';

// Mock data for Bonga Points
const mockBongaData = {
  totalPoints: 2500,
  availablePoints: 2200,
  pendingPoints: 300,
  tier: 'Gold',
  nextTierPoints: 500,
  monthlyEarned: 450,
  monthlyRedeemed: 200,
};

const mockRedemptionOptions = [
  {
    id: 'airtime',
    title: 'Airtime',
    subtitle: 'Convert points to airtime',
    icon: 'phone-portrait' as keyof typeof Ionicons.glyphMap,
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF5252'],
    pointsRequired: 100,
    value: 'KES 50',
    popular: true,
  },
  {
    id: 'data',
    title: 'Data Bundles',
    subtitle: 'Redeem for data plans',
    icon: 'wifi' as keyof typeof Ionicons.glyphMap,
    color: '#2BB673',
    gradient: ['#2BB673', '#1E8B5A'],
    pointsRequired: 250,
    value: '1GB Bundle',
    popular: false,
  },
  {
    id: 'devices',
    title: 'Devices',
    subtitle: 'Smartphones & accessories',
    icon: 'phone-portrait' as keyof typeof Ionicons.glyphMap,
    color: '#45B7D1',
    gradient: ['#45B7D1', '#2196F3'],
    pointsRequired: 5000,
    value: 'Samsung Galaxy',
    popular: false,
  },
  {
    id: 'bills',
    title: 'Bill Payments',
    subtitle: 'Pay utilities with points',
    icon: 'receipt' as keyof typeof Ionicons.glyphMap,
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#26A69A'],
    pointsRequired: 400,
    value: 'KPLC Bill',
    popular: false,
  },
];

const mockRedemptionHistory = [
  {
    id: '1',
    type: 'airtime',
    title: 'Airtime Redemption',
    points: 200,
    value: 'KES 100',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '2',
    type: 'data',
    title: 'Data Bundle Redemption',
    points: 500,
    value: '2GB Bundle',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '3',
    type: 'airtime',
    title: 'Airtime Redemption',
    points: 100,
    value: 'KES 50',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '4',
    type: 'bills',
    title: 'Bill Payment',
    points: 800,
    value: 'KPLC Bill',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
];

export default function BongaPointsScreen() {
  const [bongaData] = useState(mockBongaData);
  const [redemptionHistory] = useState(mockRedemptionHistory);

  const handleRedeemNow = () => {
    Alert.alert(
      'Quick Redeem',
      'Choose your preferred redemption option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Airtime', onPress: () => handleRedemption('airtime') },
        { text: 'Data Bundle', onPress: () => handleRedemption('data') },
      ]
    );
  };

  const handleRedemption = (optionId: string) => {
    const option = mockRedemptionOptions.find(opt => opt.id === optionId);
    if (!option) return;

    Alert.alert(
      'Confirm Redemption',
      `Redeem ${option.pointsRequired} points for ${option.value}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            Alert.alert('Success', 'Your redemption request has been submitted!');
          },
        },
      ]
    );
  };

  const handleViewHistory = () => {
    Alert.alert('History', 'View full redemption history');
  };

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
            <Text style={styles.headerTitle}>Bonga Points</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="help-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animatable.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Points Summary Card */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.pointsSection}>
          <PointsCard
            totalPoints={bongaData.totalPoints}
            availablePoints={bongaData.availablePoints}
            tier={bongaData.tier}
            onRedeemNow={handleRedeemNow}
          />
        </Animatable.View>

        {/* Quick Stats */}
        <Animatable.View animation="fadeInUp" delay={400} style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{bongaData.monthlyEarned}</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
              <Text style={styles.statPeriod}>This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{bongaData.monthlyRedeemed}</Text>
              <Text style={styles.statLabel}>Points Redeemed</Text>
              <Text style={styles.statPeriod}>This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{bongaData.nextTierPoints}</Text>
              <Text style={styles.statLabel}>To Next Tier</Text>
              <Text style={styles.statPeriod}>Platinum</Text>
            </View>
          </View>
        </Animatable.View>

        {/* Redemption Options */}
        <Animatable.View animation="fadeInUp" delay={600} style={styles.redemptionSection}>
          <Text style={styles.sectionTitle}>Redeem Points</Text>
          <View style={styles.redemptionGrid}>
            {mockRedemptionOptions.map((option, index) => (
              <Animatable.View
                key={option.id}
                animation="fadeInUp"
                delay={800 + index * 100}
                style={styles.redemptionOption}
              >
                <RedemptionOption
                  title={option.title}
                  subtitle={option.subtitle}
                  icon={option.icon}
                  gradient={option.gradient}
                  pointsRequired={option.pointsRequired}
                  value={option.value}
                  popular={option.popular}
                  onPress={() => handleRedemption(option.id)}
                />
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

        {/* Recent Redemptions */}
        <Animatable.View animation="fadeInUp" delay={1000} style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Recent Redemptions</Text>
            <TouchableOpacity onPress={handleViewHistory}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.historyList}>
            {redemptionHistory.map((redemption, index) => (
              <Animatable.View
                key={redemption.id}
                animation="fadeInRight"
                delay={1200 + index * 100}
                style={styles.historyItem}
              >
                <View style={styles.historyIcon}>
                  <Ionicons
                    name={redemption.type === 'airtime' ? 'phone-portrait' :
                          redemption.type === 'data' ? 'wifi' :
                          redemption.type === 'devices' ? 'phone-portrait' : 'receipt'}
                    size={20}
                    color="white"
                  />
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyTitle}>{redemption.title}</Text>
                  <Text style={styles.historyValue}>{redemption.value}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(redemption.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyPoints}>-{redemption.points} pts</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: redemption.status === 'completed' ? COLORS.success : COLORS.warning }
                  ]}>
                    <Text style={styles.statusText}>{redemption.status}</Text>
                  </View>
                </View>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

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
  pointsSection: {
    marginBottom: SPACING.xl,
  },
  statsSection: {
    marginBottom: SPACING.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray600,
    textAlign: 'center',
    marginBottom: 2,
  },
  statPeriod: {
    fontSize: 12,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  redemptionSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: SPACING.lg,
  },
  redemptionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  redemptionOption: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  historySection: {
    marginBottom: SPACING.xl,
  },
  historyHeader: {
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
  historyList: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  historyDetails: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: 2,
  },
  historyValue: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
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
