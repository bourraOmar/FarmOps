import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth(); // Destructuring user too to display name dynamically if needed

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: 'destructive', 
          onPress: async () => {
            try {
              await logout();
              router.replace('/');
            } catch (error) {
              console.error('Logout failed', error);
              Alert.alert('Error', 'Failed to log out');
            }
          } 
        } 
      ]
    );
  };

  const renderMenuItem = (icon: keyof typeof Ionicons.glyphMap, title: string, subtitle?: string) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color="#00E632" />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#5A7560" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
               <Ionicons name="person" size={40} color="#0D1F12" />
            </View>
            <View style={styles.badge}>
              <Ionicons name="checkmark" size={12} color="#051207" />
            </View>
          </View>
          <Text style={styles.userName}>{user?.fullName || 'Omar Bourra'}</Text>
          <Text style={styles.userRole}>{user?.role || 'Farm Owner'}</Text>
          <View style={styles.farmTag}>
            <Ionicons name="location-outline" size={14} color="#8BA890" style={{marginRight: 4}} />
            <Text style={styles.farmName}>Green Valley Farm</Text>
          </View>
        </View>

        {/* Statistics Row (Optional Dashboard summary) */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>124</Text>
            <Text style={styles.statLabel}>Cattle</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Staff</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ACCOUNT</Text>
          {renderMenuItem("person-outline", "Personal Information", "Edit your details")}
          {renderMenuItem("shield-checkmark-outline", "Security", "Password & 2FA")}
          {renderMenuItem("notifications-outline", "Notifications", "Manage alerts")}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>SUPPORT</Text>
          {renderMenuItem("help-circle-outline", "Help & Support")}
          {renderMenuItem("information-circle-outline", "About App", "Version 1.0.0")}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{marginRight: 8}} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051207',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#051207',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00E632',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#102815',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00E632',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#051207',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#8BA890',
    marginBottom: 8,
  },
  farmTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102815',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  farmName: {
    color: '#8BA890',
    fontSize: 14,
    fontWeight: '500', 
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#102815',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#1D3B24',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8BA890',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5A7560',
    marginBottom: 12,
    paddingHorizontal: 8,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102815',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 230, 50, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#8BA890',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3F1D1D',
    backgroundColor: '#1F0A0A',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
