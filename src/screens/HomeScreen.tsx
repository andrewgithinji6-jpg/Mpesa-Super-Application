import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, title, subtitle, onPress, color }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color="white" />
    </View>
    <Text style={styles.quickActionTitle}>{title}</Text>
    <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

interface ServiceCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  amount: string;
  color: string;
  onPress: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, amount, color, onPress }) => (
  <TouchableOpacity style={styles.serviceCard} onPress={onPress}>
    <LinearGradient
      colors={[color, `${color}CC`]}
      style={styles.serviceCardGradient}
    >
      <View style={styles.serviceCardContent}>
        <Ionicons name={icon} size={30} color="white" />
        <Text style={styles.serviceCardTitle}>{title}</Text>
        <Text style={styles.serviceCardAmount}>{amount}</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [balance] = useState('KES 15,420.00');
  const [showBalance, setShowBalance] = useState(true);

  const quickActions = [
    {
      icon: 'send' as keyof typeof Ionicons.glyphMap,
      title: 'Send Money',
      subtitle: 'Transfer to M-Pesa',
      color: '#2BB673',
      onPress: () => console.log('Send Money'),
    },
    {
      icon: 'phone-portrait' as keyof typeof Ionicons.glyphMap,
      title: 'Buy Airtime',
      subtitle: 'Top up your phone',
      color: '#FF6B6B',
      onPress: () => console.log('Buy Airtime'),
    },
    {
      icon: 'receipt' as keyof typeof Ionicons.glyphMap,
      title: 'Pay Bill',
      subtitle: 'Utilities & services',
      color: '#4ECDC4',
      onPress: () => console.log('Pay Bill'),
    },
    {
      icon: 'card' as keyof typeof Ionicons.glyphMap,
      title: 'Lipa na M-Pesa',
      subtitle: 'Pay merchants',
      color: '#45B7D1',
      onPress: () => console.log('Lipa na M-Pesa'),
    },
  ];

  const services = [
    {
      icon: 'wifi' as keyof typeof Ionicons.glyphMap,
      title: 'Data Bundle',
      amount: '2.5 GB',
      color: '#2BB673',
      onPress: () => console.log('Data Bundle'),
    },
    {
      icon: 'chatbubble' as keyof typeof Ionicons.glyphMap,
      title: 'SMS Bundle',
      amount: '100 SMS',
      color: '#FF6B6B',
      onPress: () => console.log('SMS Bundle'),
    },
    {
      icon: 'gift' as keyof typeof Ionicons.glyphMap,
      title: 'Bonga Points',
      amount: '2,500 pts',
      color: '#4ECDC4',
      onPress: () => console.log('Bonga Points'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#2BB673', '#1E8B5A']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>John Doe</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <Animatable.View animation="fadeInUp" delay={200} style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>M-Pesa Balance</Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                <Ionicons 
                  name={showBalance ? "eye" : "eye-off"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>
              {showBalance ? balance : '••••••••'}
            </Text>
            <Text style={styles.balanceSubtext}>Available balance</Text>
          </Animatable.View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                delay={300 + index * 100}
                style={styles.quickActionContainer}
              >
                <QuickAction {...action} />
              </Animatable.View>
            ))}
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                delay={700 + index * 100}
                style={styles.serviceCardContainer}
              >
                <ServiceCard {...service} />
              </Animatable.View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <Animatable.View animation="fadeInUp" delay={1000} style={styles.transactionList}>
            {[
              { type: 'Received', amount: '+KES 5,000', time: '2 mins ago', icon: 'arrow-down-circle', color: '#2BB673' },
              { type: 'Airtime', amount: '-KES 100', time: '1 hour ago', icon: 'phone-portrait', color: '#FF6B6B' },
              { type: 'Data Bundle', amount: '-KES 250', time: '3 hours ago', icon: 'wifi', color: '#4ECDC4' },
            ].map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={[styles.transactionIcon, { backgroundColor: transaction.color }]}>
                  <Ionicons name={transaction.icon as any} size={20} color="white" />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionType}>{transaction.type}</Text>
                  <Text style={styles.transactionTime}>{transaction.time}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.amount.startsWith('+') ? '#2BB673' : '#FF6B6B' }
                ]}>
                  {transaction.amount}
                </Text>
              </View>
            ))}
          </Animatable.View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    padding: 10,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  balanceSubtext: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 16,
    color: '#2BB673',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionContainer: {
    width: (width - 60) / 2,
    marginBottom: 15,
  },
  quickAction: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceCardContainer: {
    flex: 1,
    marginHorizontal: 5,
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
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  serviceCardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  transactionList: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 20,
  },
});
