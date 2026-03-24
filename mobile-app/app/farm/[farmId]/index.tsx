import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import {
  ArrowLeft,
  PawPrint,
  Users,
  Droplets,
  Warehouse,
  ChevronRight,
  Plus,
  MapPin,
  TrendingUp,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { apiClient, Farm } from '../../../lib/api';
import { useFarm } from '../../../contexts/FarmContext';
import { useAuth } from '../../../contexts/AuthContext';

export default function FarmHomeScreen() {
  const { farmId } = useLocalSearchParams<{ farmId: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { selectFarm } = useFarm();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [stats, setStats] = useState({ animals: 0, workers: 0, milkToday: 0, milkMonth: 0, milkRecords: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [farmData, livestockStats, milkStats, workersList] = await Promise.all([
        apiClient.getFarmById(farmId!),
        apiClient.getDashboardStats(farmId),
        apiClient.getMilkStats(farmId),
        apiClient.getWorkers(farmId),
      ]);
      setFarm(farmData);
      // Set this farm as the selected farm so add screens use it
      selectFarm(farmData);
      setStats({
        animals: livestockStats.totalAnimals,
        workers: Array.isArray(workersList) ? workersList.length : 0,
        milkToday: milkStats.totalToday,
        milkMonth: milkStats.totalThisMonth,
        milkRecords: milkStats.recordCount,
      });
    } catch (e) {
      console.error('Failed to load farm data:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      setLoading(true);
      loadData();
    }, [farmId, isAuthenticated])
  );

  const onRefresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [farmId, isAuthenticated]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00E632" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E632" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>{farm?.name || 'Farm'}</Text>
            {farm?.location ? (
              <View style={styles.locationRow}>
                <MapPin size={12} color="#8BA890" />
                <Text style={styles.locationText}>{farm.location}</Text>
              </View>
            ) : null}
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Farm Info Banner */}
        <LinearGradient
          colors={['#0D2E14', '#0A2410']}
          style={styles.farmBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.farmBannerIcon}>
            <Warehouse size={28} color="#00E632" />
          </View>
          <View style={styles.farmBannerInfo}>
            <Text style={styles.farmBannerName}>{farm?.name}</Text>
            {farm?.description ? (
              <Text style={styles.farmBannerDesc} numberOfLines={2}>{farm.description}</Text>
            ) : null}
            {farm?.size ? (
              <Text style={styles.farmBannerSize}>{farm.size} hectares</Text>
            ) : null}
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient colors={['#102815', '#0D1F12']} style={styles.statGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(0, 230, 50, 0.12)' }]}>
                <PawPrint size={22} color="#00E632" />
              </View>
              <Text style={styles.statNumber}>{stats.animals}</Text>
              <Text style={styles.statLabel}>Animals</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient colors={['#102815', '#0D1F12']} style={styles.statGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                <Users size={22} color="#6366F1" />
              </View>
              <Text style={styles.statNumber}>{stats.workers}</Text>
              <Text style={styles.statLabel}>Workers</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient colors={['#102815', '#0D1F12']} style={styles.statGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
                <Droplets size={22} color="#3B82F6" />
              </View>
              <Text style={styles.statNumber}>{stats.milkToday.toFixed(1)}L</Text>
              <Text style={styles.statLabel}>Milk Today</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient colors={['#102815', '#0D1F12']} style={styles.statGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                <TrendingUp size={22} color="#F59E0B" />
              </View>
              <Text style={styles.statNumber}>{stats.milkMonth.toFixed(1)}L</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/add-animal')}>
            <LinearGradient colors={['#102815', '#0D1F12']} style={styles.actionGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(0, 230, 50, 0.12)' }]}>
                <Plus size={18} color="#00E632" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Add Animal</Text>
                <Text style={styles.actionSubtitle}>Register new livestock to this farm</Text>
              </View>
              <ChevronRight size={18} color="#8BA890" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/log-milk')}>
            <LinearGradient colors={['#102815', '#0D1F12']} style={styles.actionGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
                <Droplets size={18} color="#3B82F6" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Log Milk</Text>
                <Text style={styles.actionSubtitle}>Record milk production</Text>
              </View>
              <ChevronRight size={18} color="#8BA890" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/add-worker')}>
            <LinearGradient colors={['#102815', '#0D1F12']} style={styles.actionGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                <Users size={18} color="#6366F1" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Add Worker</Text>
                <Text style={styles.actionSubtitle}>Register new staff to this farm</Text>
              </View>
              <ChevronRight size={18} color="#8BA890" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
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
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#8BA890',
  },
  farmBanner: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  farmBannerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 230, 50, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  farmBannerInfo: {
    flex: 1,
  },
  farmBannerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  farmBannerDesc: {
    fontSize: 13,
    color: '#8BA890',
    marginBottom: 2,
  },
  farmBannerSize: {
    fontSize: 12,
    color: '#5A7C60',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: '47%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#8BA890',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3B24',
    gap: 14,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#8BA890',
    marginTop: 2,
  },
});
