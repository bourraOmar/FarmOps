import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Plus,
  MapPin,
  Ruler,
  ChevronRight,
  Warehouse,
  Trash2,
  PawPrint,
  Users,
  Droplets,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFarm } from '../../contexts/FarmContext';
import { apiClient } from '../../lib/api';

export default function FarmsScreen() {
  const router = useRouter();
  const { farms, refreshFarms, loading, deleteFarm } = useFarm();
  const [refreshing, setRefreshing] = useState(false);
  const [farmStats, setFarmStats] = useState<Record<string, { animals: number; workers: number; milk: number }>>({});

  const loadStats = async () => {
    try {
      const statsMap: Record<string, { animals: number; workers: number; milk: number }> = {};
      for (const farm of farms) {
        const [animalsData, workersData, milkData] = await Promise.all([
          apiClient.getDashboardStats(farm._id),
          apiClient.getWorkers(farm._id),
          apiClient.getMilkStats(farm._id),
        ]);
        statsMap[farm._id] = {
          animals: animalsData.totalAnimals,
          workers: Array.isArray(workersData) ? workersData.length : 0,
          milk: milkData.totalToday,
        };
      }
      setFarmStats(statsMap);
    } catch (e) {
      console.error('Failed to load farm stats:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshFarms();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (farms.length > 0) {
        loadStats();
      }
    }, [farms.length])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFarms();
    setRefreshing(false);
  }, []);

  const handleDelete = (farmId: string, farmName: string) => {
    Alert.alert(
      'Delete Farm',
      `Are you sure you want to delete "${farmName}"? This will also delete all animals, workers, and milk records associated with this farm.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFarm(farmId);
            } catch (e) {
              Alert.alert('Error', 'Failed to delete farm');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>My Farms</Text>
          <Text style={styles.headerSubtitle}>{farms.length} farm{farms.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create-farm')}
        >
          <Plus size={24} color="#051207" />
        </TouchableOpacity>
      </View>

      {/* Farm List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E632" />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#00E632" style={{ marginTop: 60 }} />
        ) : farms.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏡</Text>
            <Text style={styles.emptyTitle}>No farms yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first farm to start managing your livestock, workers, and production
            </Text>
            <TouchableOpacity
              style={styles.createFirstButton}
              onPress={() => router.push('/create-farm')}
            >
              <Plus size={20} color="#051207" />
              <Text style={styles.createFirstButtonText}>Create Farm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          farms.map((farm) => {
            const stats = farmStats[farm._id];

            return (
              <TouchableOpacity
                key={farm._id}
                style={styles.cardContainer}
                onPress={() => router.push(`/farm/${farm._id}`)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#102815', '#0D1F12']}
                  style={styles.card}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardContent}>
                    {/* Farm Icon */}
                    <View style={styles.farmIcon}>
                      <Warehouse size={26} color="#00E632" />
                    </View>

                    {/* Farm Details */}
                    <View style={styles.detailsContainer}>
                      <Text style={styles.farmName}>{farm.name}</Text>

                      {farm.location ? (
                        <View style={styles.infoRow}>
                          <MapPin size={13} color="#8BA890" />
                          <Text style={styles.infoText}>{farm.location}</Text>
                        </View>
                      ) : null}

                      {farm.size ? (
                        <View style={styles.infoRow}>
                          <Ruler size={13} color="#8BA890" />
                          <Text style={styles.infoText}>{farm.size} hectares</Text>
                        </View>
                      ) : null}
                    </View>
                    
                  </View>

                  {/* Stats Row */}
                  <View style={styles.cardStatsRow}>
                    <View style={styles.cardStat}>
                      <PawPrint size={14} color="#00E632" />
                      <Text style={styles.cardStatNum}>{stats?.animals ?? '–'}</Text>
                      <Text style={styles.cardStatLabel}>Animals</Text>
                    </View>
                    <View style={styles.cardStatDivider} />
                    <View style={styles.cardStat}>
                      <Users size={14} color="#6366F1" />
                      <Text style={styles.cardStatNum}>{stats?.workers ?? '–'}</Text>
                      <Text style={styles.cardStatLabel}>Workers</Text>
                    </View>
                    <View style={styles.cardStatDivider} />
                    <View style={styles.cardStat}>
                      <Droplets size={14} color="#3B82F6" />
                      <Text style={styles.cardStatNum}>{stats?.milk != null ? `${stats.milk.toFixed(1)}L` : '–'}</Text>
                      <Text style={styles.cardStatLabel}>Today</Text>
                    </View>
                  </View>

                  {/* Delete Button */}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(farm._id, farm.name);
                    }}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051207',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8BA890',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#00E632',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00E632',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  cardContainer: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1D3B24',
    overflow: 'hidden',
    position: 'relative',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    paddingBottom: 14,
    gap: 14,
  },
  farmIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 230, 50, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  farmName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: '#8BA890',
  },
  cardStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginHorizontal: 18,
    marginBottom: 14,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
  },
  cardStat: {
    alignItems: 'center',
    flex: 1,
    gap: 3,
  },
  cardStatNum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardStatLabel: {
    fontSize: 10,
    color: '#8BA890',
    textTransform: 'uppercase',
  },
  cardStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#1D3B24',
  },
  deleteButton: {
    position: 'absolute',
    top: 18,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8BA890',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00E632',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  createFirstButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#051207',
  },
});
