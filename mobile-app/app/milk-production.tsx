import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../lib/api';
import { useFarm } from '../contexts/FarmContext';

type MilkRecord = {
  _id: string;
  animalId: string;
  date: string;
  amountLiters: number;
  session: 'Morning' | 'Evening' | 'Night';
  notes?: string;
  createdAt?: string;
};

const SESSION_ICONS: Record<string, string> = {
  Morning: '🌅',
  Evening: '🌇',
  Night: '🌙',
};

const SESSION_COLORS: Record<string, string> = {
  Morning: '#F59E0B',
  Evening: '#F97316',
  Night: '#6366F1',
};

export default function MilkProductionScreen() {
  const router = useRouter();
  const { selectedFarm } = useFarm();
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [stats, setStats] = useState({ totalToday: 0, totalThisMonth: 0, recordCount: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [recs, st] = await Promise.all([
        apiClient.getMilkRecords(selectedFarm?._id),
        apiClient.getMilkStats(selectedFarm?._id),
      ]);
      setRecords(recs);
      setStats(st);
    } catch {
      Alert.alert('Error', 'Could not load milk records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [selectedFarm?._id])
  );

  const handleDelete = (record: MilkRecord) => {
    Alert.alert(
      'Delete Record',
      `Remove ${record.amountLiters}L ${record.session} record on ${record.date}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.deleteMilkRecord(record._id);
              setRecords((prev) => prev.filter((r) => r._id !== record._id));
            } catch {
              Alert.alert('Error', 'Could not delete record.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00E632" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Milk Production</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            tintColor="#00E632"
          />
        }
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="water" size={22} color="#00E632" />
            <Text style={styles.statValue}>{stats.totalToday.toFixed(1)}L</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={22} color="#00E632" />
            <Text style={styles.statValue}>{stats.totalThisMonth.toFixed(1)}L</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="list" size={22} color="#00E632" />
            <Text style={styles.statValue}>{stats.recordCount}</Text>
            <Text style={styles.statLabel}>Records</Text>
          </View>
        </View>

        {/* Records List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Records</Text>

          {records.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🥛</Text>
              <Text style={styles.emptyText}>No records yet</Text>
              <Text style={styles.emptySubText}>Tap "Log Milk" to add the first entry</Text>
            </View>
          ) : (
            records.map((record) => (
              <View key={record._id} style={styles.recordCard}>
                <View style={[styles.sessionBadge, { backgroundColor: SESSION_COLORS[record.session] + '22' }]}>
                  <Text style={styles.sessionEmoji}>{SESSION_ICONS[record.session]}</Text>
                </View>
                <View style={styles.recordInfo}>
                  <View style={styles.recordTopRow}>
                    <Text style={[styles.sessionLabel, { color: SESSION_COLORS[record.session] }]}>
                      {record.session}
                    </Text>
                    <Text style={styles.recordDate}>{record.date}</Text>
                  </View>
                  <Text style={styles.recordAmount}>{record.amountLiters} <Text style={styles.recordUnit}>Litres</Text></Text>
                  {record.notes ? <Text style={styles.recordNotes}>{record.notes}</Text> : null}
                </View>
                <TouchableOpacity onPress={() => handleDelete(record)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/log-milk')}
      >
        <Ionicons name="add" size={28} color="#051207" />
        <Text style={styles.fabText}>Log Milk</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#102815',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#8BA890',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptySubText: {
    color: '#8BA890',
    fontSize: 14,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102815',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  sessionBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionEmoji: {
    fontSize: 24,
  },
  recordInfo: {
    flex: 1,
  },
  recordTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sessionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  recordDate: {
    color: '#8BA890',
    fontSize: 12,
  },
  recordAmount: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  recordUnit: {
    color: '#8BA890',
    fontSize: 14,
    fontWeight: 'normal',
  },
  recordNotes: {
    color: '#8BA890',
    fontSize: 13,
    marginTop: 3,
  },
  deleteBtn: {
    padding: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00E632',
    borderRadius: 16,
    paddingVertical: 18,
    gap: 8,
  },
  fabText: {
    color: '#051207',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
