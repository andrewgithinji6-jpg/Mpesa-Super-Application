import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showArrow?: boolean;
  color?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  rightComponent, 
  showArrow = true,
  color = '#2BB673'
}) => (
  <TouchableOpacity 
    style={styles.settingItem} 
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={[styles.settingIcon, { backgroundColor: color }]}>
      <Ionicons name={icon} size={20} color="white" />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {rightComponent || (showArrow && onPress && (
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    ))}
  </TouchableOpacity>
);

interface PINModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (newPIN: string, confirmPIN: string) => void;
}

const PINModal: React.FC<PINModalProps> = ({ visible, onClose, onConfirm }) => {
  const [currentPIN, setCurrentPIN] = useState('');
  const [newPIN, setNewPIN] = useState('');
  const [confirmPIN, setConfirmPIN] = useState('');

  const handleConfirm = () => {
    if (!currentPIN || !newPIN || !confirmPIN) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPIN !== confirmPIN) {
      Alert.alert('Error', 'New PIN and confirm PIN do not match');
      return;
    }

    if (newPIN.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }

    Alert.alert(
      'Change PIN',
      'Are you sure you want to change your PIN?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: () => {
            onConfirm(newPIN, confirmPIN);
            setCurrentPIN('');
            setNewPIN('');
            setConfirmPIN('');
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change PIN</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current PIN</Text>
              <TextInput
                style={styles.pinInput}
                placeholder="Enter current PIN"
                placeholderTextColor="#999"
                value={currentPIN}
                onChangeText={setCurrentPIN}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New PIN</Text>
              <TextInput
                style={styles.pinInput}
                placeholder="Enter new PIN"
                placeholderTextColor="#999"
                value={newPIN}
                onChangeText={setNewPIN}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New PIN</Text>
              <TextInput
                style={styles.pinInput}
                placeholder="Confirm new PIN"
                placeholderTextColor="#999"
                value={confirmPIN}
                onChangeText={setConfirmPIN}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.changePINButton} onPress={handleConfirm}>
              <Text style={styles.changePINButtonText}>Change PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pinModalVisible, setPINModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handleChangePIN = (newPIN: string, confirmPIN: string) => {
    Alert.alert('Success', 'Your PIN has been changed successfully');
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing feature will be available soon.');
  };

  const handleSecuritySettings = () => {
    Alert.alert('Coming Soon', 'Security settings feature will be available soon.');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Coming Soon', 'Privacy settings feature will be available soon.');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact support at support@safaricom.co.ke or call 100');
  };

  const handleAbout = () => {
    Alert.alert(
      'About M-Pesa+ SuperApp',
      'Version 1.0.0\n\nM-Pesa+ SuperApp brings together mobile money and banking services in one convenient app.\n\n© 2024 Safaricom PLC'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#2BB673', '#1E8B5A']}
          style={styles.profileHeader}
        >
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="white" />
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            <Text style={styles.profilePhone}>+254 700 000 000</Text>
          </View>
        </LinearGradient>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="person-outline"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={handleEditProfile}
              color="#2BB673"
            />
            <SettingItem
              icon="lock-closed-outline"
              title="Change PIN"
              subtitle="Update your M-Pesa PIN"
              onPress={() => setPINModalVisible(true)}
              color="#FF6B6B"
            />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Security Settings"
              subtitle="Manage your security preferences"
              onPress={handleSecuritySettings}
              color="#4ECDC4"
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              subtitle="Switch to dark theme"
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#E0E0E0', true: '#2BB673' }}
                  thumbColor={darkMode ? '#FFFFFF' : '#F4F3F4'}
                />
              }
              showArrow={false}
              color="#666"
            />
            <SettingItem
              icon="finger-print-outline"
              title="Biometric Login"
              subtitle="Use fingerprint or face ID"
              rightComponent={
                <Switch
                  value={biometricEnabled}
                  onValueChange={setBiometricEnabled}
                  trackColor={{ false: '#E0E0E0', true: '#2BB673' }}
                  thumbColor={biometricEnabled ? '#FFFFFF' : '#F4F3F4'}
                />
              }
              showArrow={false}
              color="#45B7D1"
            />
            <SettingItem
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Receive transaction alerts"
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#E0E0E0', true: '#2BB673' }}
                  thumbColor={notificationsEnabled ? '#FFFFFF' : '#F4F3F4'}
                />
              }
              showArrow={false}
              color="#96CEB4"
            />
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="lock-closed-outline"
              title="Privacy Settings"
              subtitle="Control your data sharing"
              onPress={handlePrivacySettings}
              color="#FF6B6B"
            />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Two-Factor Authentication"
              subtitle="Add extra security to your account"
              onPress={handleSecuritySettings}
              color="#4ECDC4"
            />
          </View>
        </View>

        {/* Support & Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Information</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="help-circle-outline"
              title="Help & Support"
              subtitle="Get help with your account"
              onPress={handleSupport}
              color="#45B7D1"
            />
            <SettingItem
              icon="document-text-outline"
              title="Terms & Conditions"
              subtitle="Read our terms of service"
              onPress={handleSupport}
              color="#96CEB4"
            />
            <SettingItem
              icon="information-circle-outline"
              title="About"
              subtitle="App version and information"
              onPress={handleAbout}
              color="#FFEAA7"
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <PINModal
        visible={pinModalVisible}
        onClose={() => setPINModalVisible(false)}
        onConfirm={handleChangePIN}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileHeader: {
    padding: 30,
    paddingTop: 20,
    alignItems: 'center',
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2BB673',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  profilePhone: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 10,
  },
  bottomPadding: {
    height: 20,
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
    maxWidth: 400,
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
  pinInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    letterSpacing: 2,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  changePINButton: {
    backgroundColor: '#2BB673',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePINButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
