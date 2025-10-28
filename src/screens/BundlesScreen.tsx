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
import BundleCard from '../components/BundleCard';
import { COLORS, SPACING, SHADOWS } from '../utils/constants';
import { formatAmount } from '../utils/helpers';

const { width } = Dimensions.get('window');

// Mock data for bundles
const mockDataBundles = [
  {
    id: 'data1',
    name: 'Daily Bundle',
    description: '100MB + 50MB YouTube',
    price: 50,
    validity: '24 hours',
    size: '150MB',
    category: 'data',
    popular: false,
    features: ['100MB General Data', '50MB YouTube', '24 hours validity'],
  },
  {
    id: 'data2',
    name: 'Weekly Bundle',
    description: '1GB + 500MB YouTube',
    price: 250,
    validity: '7 days',
    size: '1.5GB',
    category: 'data',
    popular: true,
    features: ['1GB General Data', '500MB YouTube', '7 days validity'],
  },
  {
    id: 'data3',
    name: 'Monthly Bundle',
    description: '5GB + 2GB YouTube + WhatsApp',
    price: 1000,
    validity: '30 days',
    size: '7GB',
    category: 'data',
    popular: false,
    features: ['5GB General Data', '2GB YouTube', 'WhatsApp unlimited', '30 days validity'],
  },
  {
    id: 'data4',
    name: 'Super Bundle',
    description: '15GB + 5GB YouTube + Facebook',
    price: 2000,
    validity: '30 days',
    size: '20GB',
    category: 'data',
    popular: false,
    features: ['15GB General Data', '5GB YouTube', 'Facebook unlimited', '30 days validity'],
  },
];

const mockSmsBundles = [
  {
    id: 'sms1',
    name: 'SMS 50',
    description: '50 SMS messages',
    price: 30,
    validity: '7 days',
    count: 50,
    category: 'sms',
    popular: false,
    features: ['50 SMS messages', '7 days validity'],
  },
  {
    id: 'sms2',
    name: 'SMS 100',
    description: '100 SMS messages',
    price: 50,
    validity: '14 days',
    count: 100,
    category: 'sms',
    popular: true,
    features: ['100 SMS messages', '14 days validity'],
  },
  {
    id: 'sms3',
    name: 'SMS 500',
    description: '500 SMS messages',
    price: 200,
    validity: '30 days',
    count: 500,
    category: 'sms',
    popular: false,
    features: ['500 SMS messages', '30 days validity'],
  },
];

const mockCurrentPlans = {
  data: {
    amount: '2.5 GB',
    expiry: '2024-02-15',
    plan: 'Monthly Bundle',
    daysLeft: 15,
  },
  sms: {
    amount: '100 SMS',
    expiry: '2024-02-20',
    plan: 'SMS 100',
    daysLeft: 20,
  },
};

export default function BundlesScreen() {
  const [activeTab, setActiveTab] = useState<'data' | 'sms'>('data');
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleBundlePress = (bundle: any) => {
    setSelectedBundle(bundle);
    setShowPurchaseModal(true);
  };

  const handlePurchase = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `Buy ${selectedBundle.name} for ${formatAmount(selectedBundle.price)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy Now',
          onPress: () => {
            Alert.alert('Success', 'Your bundle has been purchased successfully!');
            setShowPurchaseModal(false);
            setSelectedBundle(null);
            setPhoneNumber('');
          },
        },
      ]
    );
  };

  const handleCloseModal = () => {
    setShowPurchaseModal(false);
    setSelectedBundle(null);
    setPhoneNumber('');
  };

  const getCurrentPlan = () => {
    return activeTab === 'data' ? mockCurrentPlans.data : mockCurrentPlans.sms;
  };

  const getBundles = () => {
    return activeTab === 'data' ? mockDataBundles : mockSmsBundles;
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
            <Text style={styles.headerTitle}>Data & SMS Bundles</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="help-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animatable.View>

      {/* Current Plan Card */}
      <Animatable.View animation="fadeInUp" delay={200} style={styles.currentPlanSection}>
        <View style={styles.currentPlanCard}>
          <View style={styles.currentPlanHeader}>
            <View style={styles.currentPlanIcon}>
              <Ionicons 
                name={activeTab === 'data' ? 'wifi' : 'chatbubble'} 
                size={24} 
                color={COLORS.primary} 
              />
            </View>
            <View style={styles.currentPlanInfo}>
              <Text style={styles.currentPlanTitle}>
                Current {activeTab === 'data' ? 'Data' : 'SMS'} Plan
              </Text>
              <Text style={styles.currentPlanName}>{getCurrentPlan().plan}</Text>
            </View>
          </View>
          <View style={styles.currentPlanDetails}>
            <View style={styles.currentPlanDetail}>
              <Text style={styles.currentPlanLabel}>Balance</Text>
              <Text style={styles.currentPlanValue}>{getCurrentPlan().amount}</Text>
            </View>
            <View style={styles.currentPlanDetail}>
              <Text style={styles.currentPlanLabel}>Expires</Text>
              <Text style={styles.currentPlanValue}>{getCurrentPlan().expiry}</Text>
            </View>
            <View style={styles.currentPlanDetail}>
              <Text style={styles.currentPlanLabel}>Days Left</Text>
              <Text style={styles.currentPlanValue}>{getCurrentPlan().daysLeft}</Text>
            </View>
          </View>
        </View>
      </Animatable.View>

      {/* Tab Selector */}
      <Animatable.View animation="fadeInUp" delay={400} style={styles.tabSection}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'data' && styles.activeTab]}
            onPress={() => setActiveTab('data')}
          >
            <Ionicons 
              name="wifi" 
              size={20} 
              color={activeTab === 'data' ? COLORS.primary : COLORS.gray500} 
            />
            <Text style={[styles.tabText, activeTab === 'data' && styles.activeTabText]}>
              Data Bundles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sms' && styles.activeTab]}
            onPress={() => setActiveTab('sms')}
          >
            <Ionicons 
              name="chatbubble" 
              size={20} 
              color={activeTab === 'sms' ? COLORS.primary : COLORS.gray500} 
            />
            <Text style={[styles.tabText, activeTab === 'sms' && styles.activeTabText]}>
              SMS Bundles
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      {/* Bundles List */}
      <Animatable.View animation="fadeInUp" delay={600} style={styles.bundlesSection}>
        <Text style={styles.sectionTitle}>Available {activeTab === 'data' ? 'Data' : 'SMS'} Plans</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {getBundles().map((bundle, index) => (
            <Animatable.View
              key={bundle.id}
              animation="fadeInUp"
              delay={800 + index * 100}
              style={styles.bundleItem}
            >
              <BundleCard
                bundle={bundle}
                onPress={() => handleBundlePress(bundle)}
              />
            </Animatable.View>
          ))}
        </ScrollView>
      </Animatable.View>

      {/* Purchase Confirmation Modal */}
      <Modal
        visible={showPurchaseModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View animation="slideInUp" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Purchase</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={COLORS.gray500} />
              </TouchableOpacity>
            </View>

            {selectedBundle && (
              <>
                <View style={styles.bundleSummary}>
                  <View style={styles.bundleIcon}>
                    <Ionicons 
                      name={selectedBundle.category === 'data' ? 'wifi' : 'chatbubble'} 
                      size={30} 
                      color={COLORS.primary} 
                    />
                  </View>
                  <View style={styles.bundleInfo}>
                    <Text style={styles.bundleName}>{selectedBundle.name}</Text>
                    <Text style={styles.bundleDescription}>{selectedBundle.description}</Text>
                    <Text style={styles.bundlePrice}>{formatAmount(selectedBundle.price)}</Text>
                  </View>
                </View>

                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter phone number"
                    placeholderTextColor={COLORS.gray400}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={handlePurchase}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.primaryDark]}
                      style={styles.buyButtonGradient}
                    >
                      <Text style={styles.buyButtonText}>Buy Now</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animatable.View>
        </View>
      </Modal>
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
  currentPlanSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  currentPlanCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  currentPlanIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  currentPlanInfo: {
    flex: 1,
  },
  currentPlanTitle: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 4,
  },
  currentPlanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray800,
  },
  currentPlanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentPlanDetail: {
    alignItems: 'center',
  },
  currentPlanLabel: {
    fontSize: 12,
    color: COLORS.gray500,
    marginBottom: 4,
  },
  currentPlanValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tabSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: SPACING.xs,
    ...SHADOWS.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray500,
    marginLeft: SPACING.sm,
  },
  activeTabText: {
    color: 'white',
  },
  bundlesSection: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: SPACING.lg,
  },
  bundleItem: {
    marginBottom: SPACING.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray800,
  },
  bundleSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  bundleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  bundleInfo: {
    flex: 1,
  },
  bundleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  bundleDescription: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 4,
  },
  bundlePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  phoneInput: {
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.gray800,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  modalFooter: {
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
  buyButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buyButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
