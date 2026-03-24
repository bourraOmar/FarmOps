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
import { useRouter, useFocusEffect } from 'expo-router';
import {
  PawPrint,
  Users,
  Droplets,
  Warehouse,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useFarm } from '../../contexts/FarmContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { farms } = useFarm();
  const [globalStats, setGlobalStats] = useState({
    totalAnimals: 0,
    totalWorkers: 0,
    totalMilkToday: 0,
    totalMilkMonth: 0,
  });
  const [farmStats, setFarmStats] = useState<
    { farmId: string; name: string; animals: number; workers: number; milkToday: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAllStats = async () => {
    try {
      // Get global stats (no farmId = all farms)
      const [livestockAll, milkAll, workersAll] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getMilkStats(),
        apiClient.getWorkers(),
      ]);

      setGlobalStats({
        totalAnimals: livestockAll.totalAnimals,
        totalWorkers: Array.isArray(workersAll) ? workersAll.length : 0,
        totalMilkToday: milkAll.totalToday,
        totalMilkMonth: milkAll.totalThisMonth,
      });

      // Get per-farm stats
      const perFarm = await Promise.all(
        farms.map(async (farm) => {
          try {
            const [ls, ms, ws] = await Promise.all([
              apiClient.getDashboardStats(farm._id),
              apiClient.getMilkStats(farm._id),
              apiClient.getWorkers(farm._id),
            ]);
            return {
              farmId: farm._id,
              name: farm.name,
              animals: ls.totalAnimals,
              workers: Array.isArray(ws) ? ws.length : 0,
              milkToday: ms.totalToday,
            };
          } catch {
            return { farmId: farm._id, name: farm.name, animals: 0, workers: 0, milkToday: 0 };
          }
        })
      );
      setFarmStats(perFarm);
    } catch (e) {
      console.error('Failed to load global stats:', e);
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
      loadAllStats();
    }, [farms.length, isAuthenticated])
  );

  const onRefresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setRefreshing(true);
    await loadAllStats();
    setRefreshing(false);
  }, [farms.length, isAuthenticated]);

  const firstName = user?.fullName?.split(' ')[0] || 'Farmer';

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
          <View>
            <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
            <Text style={styles.subtitle}>Overview of all your farms</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#00E632" style={{ marginTop: 60 }} />
        ) : (
          <>
            {/* Global Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#102815', '#0D1F12']}
                  style={styles.statGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                    <Warehouse size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.statNumber}>{farms.length}</Text>
                  <Text style={styles.statLabel}>Total Farms</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#102815', '#0D1F12']}
                  style={styles.statGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={[styles.statIcon, { backgroundColor: 'rgba(0, 230, 50, 0.12)' }]}>
                    <PawPrint size={24} color="#00E632" />
                  </View>
                  <Text style={styles.statNumber}>{globalStats.totalAnimals}</Text>
                  <Text style={styles.statLabel}>Total Animals</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#102815', '#0D1F12']}
                  style={styles.statGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={[styles.statIcon, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                    <Users size={24} color="#6366F1" />
                  </View>
                  <Text style={styles.statNumber}>{globalStats.totalWorkers}</Text>
                  <Text style={styles.statLabel}>Total Workers</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#102815', '#0D1F12']}
                  style={styles.statGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
                    <Droplets size={24} color="#3B82F6" />
                  </View>
                  <Text style={styles.statNumber}>{globalStats.totalMilkToday.toFixed(1)}L</Text>
                  <Text style={styles.statLabel}>Milk Today</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Monthly Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Monthly Summary</Text>
              <LinearGradient
                colors={['#0D2E14', '#0A2410']}
                style={styles.summaryCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLeft}>
                    <TrendingUp size={18} color="#00E632" />
                    <Text style={styles.summaryLabel}>Total Milk This Month</Text>
                  </View>
                  <Text style={styles.summaryValue}>{globalStats.totalMilkMonth.toFixed(1)} L</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Per-Farm Breakdown */}
            {farmStats.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Farm Breakdown</Text>
                {farmStats.map((fs) => (
                  <TouchableOpacity
                    key={fs.farmId}
                    style={styles.farmBreakdownCard}
                    onPress={() => router.push(`/farm/${fs.farmId}`)}
                  >
                    <LinearGradient
                      colors={['#102815', '#0D1F12']}
                      style={styles.farmBreakdownGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.farmBreakdownHeader}>
                        <View style={styles.farmBreakdownIcon}>
                          <Warehouse size={20} color="#00E632" />
                        </View>
                        <Text style={styles.farmBreakdownName}>{fs.name}</Text>
                        <ChevronRight size={18} color="#8BA890" />
                      </View>
                      <View style={styles.farmBreakdownStats}>
                        <View style={styles.farmBreakdownStat}>
                          <Text style={styles.fbStatNum}>{fs.animals}</Text>
                          <Text style={styles.fbStatLabel}>Animals</Text>
                        </View>
                        <View style={styles.fbDivider} />
                        <View style={styles.farmBreakdownStat}>
                          <Text style={styles.fbStatNum}>{fs.workers}</Text>
                          <Text style={styles.fbStatLabel}>Workers</Text>
                        </View>
                        <View style={styles.fbDivider} />
                        <View style={styles.farmBreakdownStat}>
                          <Text style={styles.fbStatNum}>{fs.milkToday.toFixed(1)}L</Text>
                          <Text style={styles.fbStatLabel}>Milk Today</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* No Farms CTA */}
            {farms.length === 0 && (
              <TouchableOpacity style={styles.noFarmBanner} onPress={() => router.push('/create-farm')}>
                <LinearGradient
                  colors={['#0D2E14', '#0A2410']}
                  style={styles.noFarmGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Warehouse size={32} color="#00E632" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.noFarmTitle}>Create Your First Farm</Text>
                    <Text style={styles.noFarmSubtitle}>
                      Get started by creating a farm to manage your livestock
                    </Text>
                  </View>
                  <ChevronRight size={24} color="#8BA890" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </>
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
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#8BA890',
    marginTop: 4,
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
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 13,
    color: '#8BA890',
    marginTop: 4,
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
  summaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8BA890',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00E632',
  },
  farmBreakdownCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  farmBreakdownGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 18,
  },
  farmBreakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  farmBreakdownIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 50, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  farmBreakdownName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  farmBreakdownStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  farmBreakdownStat: {
    alignItems: 'center',
    flex: 1,
  },
  fbStatNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fbStatLabel: {
    fontSize: 11,
    color: '#8BA890',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  fbDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#1D3B24',
  },
  noFarmBanner: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  noFarmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#00E632',
    borderRadius: 20,
  },
  noFarmTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  noFarmSubtitle: {
    fontSize: 13,
    color: '#8BA890',
  },
});
