import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useFarm } from '../contexts/FarmContext';

export default function PersonalInformationScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { farms } = useFarm();

  const displayRole = user?.role === 'farmer' ? 'Farm Owner' : user?.role || 'User';

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const renderInfoRow = (icon: keyof typeof Ionicons.glyphMap, label: string, value: string) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <Ionicons name={icon} size={20} color="#00E632" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.fullName)}</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          <Text style={styles.userRole}>{displayRole}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Details</Text>
          {renderInfoRow('person-outline', 'Full Name', user?.fullName || '')}
          {renderInfoRow('mail-outline', 'Email', user?.email || '')}
          {renderInfoRow('call-outline', 'Phone', user?.phone || '')}
          {renderInfoRow('card-outline', 'CIN', user?.cin || '')}
          {renderInfoRow('shield-checkmark-outline', 'Role', displayRole)}
        </View>

        {/* Farms Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Farms ({farms.length})</Text>
          {farms.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={32} color="#1D3B24" />
              <Text style={styles.emptyText}>No farms yet</Text>
            </View>
          ) : (
            farms.map((farm) => (
              <View key={farm._id} style={styles.farmRow}>
                <View style={styles.farmIcon}>
                  <Ionicons name="business-outline" size={20} color="#00E632" />
                </View>
                <View style={styles.farmInfo}>
                  <Text style={styles.farmName}>{farm.name}</Text>
                  {farm.location ? (
                    <Text style={styles.farmLocation}>{farm.location}</Text>
                  ) : null}
                </View>
                {farm.size ? (
                  <Text style={styles.farmSize}>{farm.size} ha</Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051207',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#051207',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#102815',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#00E632',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#102815',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#051207',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#00E632',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#102815',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1D3B24',
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 50, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8BA890',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#5A7560',
  },
  farmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1D3B24',
  },
  farmIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 50, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  farmLocation: {
    fontSize: 13,
    color: '#8BA890',
    marginTop: 2,
  },
  farmSize: {
    fontSize: 13,
    color: '#00E632',
    fontWeight: '600',
  },
});
