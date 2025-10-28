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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

interface Service {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
  category: 'data' | 'sms' | 'bonga' | 'other';
}

interface ServicePlan {
  id: string;
  name: string;
  price: number;
  description: string;
  validity?: string;
  size?: string;
  count?: number;
  popular?: boolean;
}

interface PurchaseModalProps {
  visible: boolean;
  onClose: () => void;
  service: Service | null;
  plans: ServicePlan[];
  onPurchase: (plan: ServicePlan) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ visible, onClose, service, plans, onPurchase }) => {
  const [selectedPlan, setSelectedPlan] = useState<ServicePlan | null>(null);

  const handlePurchase = () => {
    if (selectedPlan) {
      Alert.alert(
        'Confirm Purchase',
        `Are you sure you want to buy ${selectedPlan.name} for KES ${selectedPlan.price}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Buy Now', 
            onPress: () => {
              onPurchase(selectedPlan);
              onClose();
              setSelectedPlan(null);
            }
          }
        ]
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              {service && (
                <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                  <Ionicons name={service.icon} size={24} color="white" />
                </View>
              )}
              <View>
                <Text style={styles.modalTitle}>{service?.name}</Text>
                <Text style={styles.modalSubtitle}>{service?.description}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.plansList}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planItem,
                  selectedPlan?.id === plan.id && styles.selectedPlanItem
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.planDescription}>{plan.description}</Text>
                <View style={styles.planDetails}>
                  <Text style={styles.planPrice}>KES {plan.price}</Text>
                  {plan.validity && <Text style={styles.planValidity}>{plan.validity}</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedPlan && (
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
                <Text style={styles.purchaseButtonText}>
                  Buy Now - KES {selectedPlan.price}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => (
  <TouchableOpacity style={styles.serviceCard} onPress={onPress}>
    <LinearGradient
      colors={[service.color, `${service.color}CC`]}
      style={styles.serviceCardGradient}
    >
      <View style={styles.serviceCardContent}>
        <Ionicons name={service.icon} size={30} color="white" />
        <Text style={styles.serviceCardTitle}>{service.name}</Text>
        <Text style={styles.serviceCardDescription}>{service.description}</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function ServicesScreen() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);

  const services: Service[] = [
    {
      id: '1',
      name: 'Data Bundles',
      icon: 'wifi',
      color: '#2BB673',
      description: 'High-speed internet bundles',
      category: 'data'
    },
    {
      id: '2',
      name: 'SMS Bundles',
      icon: 'chatbubble',
      color: '#FF6B6B',
      description: 'Text message bundles',
      category: 'sms'
    },
    {
      id: '3',
      name: 'Bonga Points',
      icon: 'gift',
      color: '#4ECDC4',
      description: 'Loyalty rewards program',
      category: 'bonga'
    },
    {
      id: '4',
      name: 'Voice Bundles',
      icon: 'call',
      color: '#45B7D1',
      description: 'Voice call bundles',
      category: 'other'
    },
    {
      id: '5',
      name: 'International',
      icon: 'globe',
      color: '#96CEB4',
      description: 'International bundles',
      category: 'other'
    },
    {
      id: '6',
      name: 'SMS to Email',
      icon: 'mail',
      color: '#FFEAA7',
      description: 'Send SMS via email',
      category: 'other'
    },
  ];

  const getServicePlans = (serviceId: string): ServicePlan[] => {
    switch (serviceId) {
      case '1': // Data Bundles
        return [
          {
            id: 'data1',
            name: 'Daily Bundle',
            price: 50,
            description: '100MB + 50MB YouTube',
            validity: '24 hours',
            size: '150MB',
            popular: false
          },
          {
            id: 'data2',
            name: 'Weekly Bundle',
            price: 250,
            description: '1GB + 500MB YouTube',
            validity: '7 days',
            size: '1.5GB',
            popular: true
          },
          {
            id: 'data3',
            name: 'Monthly Bundle',
            price: 1000,
            description: '5GB + 2GB YouTube + WhatsApp',
            validity: '30 days',
            size: '7GB',
            popular: false
          },
          {
            id: 'data4',
            name: 'Super Bundle',
            price: 2000,
            description: '15GB + 5GB YouTube + WhatsApp + Facebook',
            validity: '30 days',
            size: '20GB',
            popular: false
          }
        ];
      
      case '2': // SMS Bundles
        return [
          {
            id: 'sms1',
            name: 'SMS 50',
            price: 30,
            description: '50 SMS messages',
            validity: '7 days',
            count: 50,
            popular: false
          },
          {
            id: 'sms2',
            name: 'SMS 100',
            price: 50,
            description: '100 SMS messages',
            validity: '14 days',
            count: 100,
            popular: true
          },
          {
            id: 'sms3',
            name: 'SMS 500',
            price: 200,
            description: '500 SMS messages',
            validity: '30 days',
            count: 500,
            popular: false
          }
        ];
      
      case '3': // Bonga Points
        return [
          {
            id: 'bonga1',
            name: 'Points Purchase',
            price: 100,
            description: 'Buy Bonga Points',
            count: 100,
            popular: false
          },
          {
            id: 'bonga2',
            name: 'Points Purchase',
            price: 500,
            description: 'Buy Bonga Points',
            count: 550,
            popular: true
          },
          {
            id: 'bonga3',
            name: 'Points Purchase',
            price: 1000,
            description: 'Buy Bonga Points',
            count: 1200,
            popular: false
          }
        ];
      
      default:
        return [];
    }
  };

  const handleServicePress = (service: Service) => {
    setSelectedService(service);
    setPurchaseModalVisible(true);
  };

  const handlePurchase = (plan: ServicePlan) => {
    // Mock purchase logic
    Alert.alert(
      'Purchase Successful!',
      `You have successfully purchased ${plan.name}. You will receive a confirmation SMS shortly.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="time-outline" size={24} color="#2BB673" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="wifi" size={24} color="#2BB673" />
          <View style={styles.statDetails}>
            <Text style={styles.statLabel}>Data Balance</Text>
            <Text style={styles.statValue}>2.5 GB</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="chatbubble" size={24} color="#FF6B6B" />
          <View style={styles.statDetails}>
            <Text style={styles.statLabel}>SMS Balance</Text>
            <Text style={styles.statValue}>100 SMS</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="gift" size={24} color="#4ECDC4" />
          <View style={styles.statDetails}>
            <Text style={styles.statLabel}>Bonga Points</Text>
            <Text style={styles.statValue}>2,500 pts</Text>
          </View>
        </View>
      </View>

      {/* Services Grid */}
      <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Available Services</Text>
        <View style={styles.servicesGrid}>
          {services.map((service, index) => (
            <Animatable.View
              key={service.id}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.serviceCardContainer}
            >
              <ServiceCard
                service={service}
                onPress={() => handleServicePress(service)}
              />
            </Animatable.View>
          ))}
        </View>

        {/* Recent Purchases */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Purchases</Text>
          <View style={styles.recentList}>
            {[
              { service: 'Data Bundle', plan: 'Weekly Bundle', date: '2 days ago', amount: 250 },
              { service: 'SMS Bundle', plan: 'SMS 100', date: '5 days ago', amount: 50 },
              { service: 'Bonga Points', plan: 'Points Purchase', date: '1 week ago', amount: 500 },
            ].map((purchase, index) => (
              <Animatable.View
                key={index}
                animation="fadeInRight"
                delay={700 + index * 100}
                style={styles.recentItem}
              >
                <View style={styles.recentIcon}>
                  <Ionicons 
                    name={
                      purchase.service === 'Data Bundle' ? 'wifi' :
                      purchase.service === 'SMS Bundle' ? 'chatbubble' : 'gift'
                    } 
                    size={20} 
                    color="white" 
                  />
                </View>
                <View style={styles.recentDetails}>
                  <Text style={styles.recentService}>{purchase.service}</Text>
                  <Text style={styles.recentPlan}>{purchase.plan}</Text>
                  <Text style={styles.recentDate}>{purchase.date}</Text>
                </View>
                <Text style={styles.recentAmount}>KES {purchase.amount}</Text>
              </Animatable.View>
            ))}
          </View>
        </View>
      </ScrollView>

      <PurchaseModal
        visible={purchaseModalVisible}
        onClose={() => setPurchaseModalVisible(false)}
        service={selectedService}
        plans={selectedService ? getServicePlans(selectedService.id) : []}
        onPurchase={handlePurchase}
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statDetails: {
    marginLeft: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  servicesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
    backgroundColor: '#2BB673',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recentDetails: {
    flex: 1,
  },
  recentService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentPlan: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  recentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  recentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  plansList: {
    maxHeight: 400,
    padding: 20,
  },
  planItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlanItem: {
    borderColor: '#2BB673',
    backgroundColor: '#2BB67310',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  popularBadge: {
    backgroundColor: '#2BB673',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2BB673',
  },
  planValidity: {
    fontSize: 12,
    color: '#999',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  purchaseButton: {
    backgroundColor: '#2BB673',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
