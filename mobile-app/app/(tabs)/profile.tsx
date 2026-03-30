import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const [stats, setStats] = useState({ totalAnimals: 0, totalWorkers: 0, totalFarms: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const [livestockRes, workersRes, farmsRes] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getWorkers(),
        apiClient.getFarms(),
      ]);
      setStats({
        totalAnimals: livestockRes.totalAnimals ?? 0,
        totalWorkers: Array.isArray(workersRes) ? workersRes.length : 0,
        totalFarms: Array.isArray(farmsRes) ? farmsRes.length : 0,
      });
    } catch (e) {
      console.error('[Profile] Failed to load stats:', e);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoadingStats(true);
      loadStats();
    }, [loadStats])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, [loadStats]);

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

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const renderMenuItem = (icon: keyof typeof Ionicons.glyphMap, title: string, subtitle?: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
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

  const displayRole = user?.role === 'farmer' ? 'Farm Owner' : user?.role || 'User';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E632" />
        }
      >
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
               <Text style={styles.avatarText}>{getInitials(user?.fullName)}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="checkmark" size={12} color="#051207" />
            </View>
          </View>
          <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          <Text style={styles.userRole}>{displayRole}</Text>
        </View>

        {/* Statistics Row */}
        <View style={styles.statsRow}>
          {loadingStats ? (
            <ActivityIndicator color="#00E632" style={{ paddingVertical: 10 }} />
          ) : (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalFarms}</Text>
                <Text style={styles.statLabel}>Farms</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalAnimals}</Text>
                <Text style={styles.statLabel}>Animals</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalWorkers}</Text>
                <Text style={styles.statLabel}>Workers</Text>
              </View>
            </>
          )}
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ACCOUNT</Text>
          {renderMenuItem("person-outline", "Personal Information", "Edit your details", () => router.push('/personal-information'))}
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
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#051207',
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
    color: '#00E632',
    marginBottom: 4,
    fontWeight: '600',
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
