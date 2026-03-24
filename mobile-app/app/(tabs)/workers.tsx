import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../lib/api';
import { useFarm } from '../../contexts/FarmContext';
import { useAuth } from '../../contexts/AuthContext';

type Worker = {
  _id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
};

export default function WorkersScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { selectedFarm } = useFarm();
  const [search, setSearch] = useState('');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkers = async () => {
    try {
      const data = await apiClient.getWorkers(selectedFarm?._id);
      setWorkers(data);
    } catch {
      Alert.alert('Error', 'Could not load workers.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      setLoading(true);
      fetchWorkers();
    }, [selectedFarm?._id, isAuthenticated])
  );

  const filtered = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleCall = (worker: Worker) => {
    if (!worker.phone) {
      Alert.alert('No Phone', 'This worker has no phone number.');
      return;
    }
    Alert.alert(
      `Call ${worker.name}`,
      worker.phone,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${worker.phone}`) },
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
        <Text style={styles.headerTitle}>Farm Workers</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#8BA890" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name or role..."
          placeholderTextColor="#557060"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchWorkers(); }}
            tintColor="#00E632"
          />
        }
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>👷</Text>
            <Text style={styles.emptyText}>No workers yet</Text>
            <Text style={styles.emptySubText}>Tap "Add New Worker" to get started</Text>
          </View>
        ) : (
          filtered.map((worker) => (
            <TouchableOpacity key={worker._id} style={styles.card} onPress={() => router.push(`/worker/${worker._id}`)}>
              <View style={styles.avatarWrap}>
                {worker.avatarUrl ? (
                  <Image source={{ uri: worker.avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Ionicons name="person" size={28} color="#8BA890" />
                  </View>
                )}
              </View>
              <View style={styles.info}>
                <Text style={styles.workerName}>{worker.name}</Text>
                <Text style={styles.workerRole}>{worker.role}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn} onPress={(e) => { e.stopPropagation(); handleCall(worker); }}>
                <Ionicons name="call" size={20} color="#00E632" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add New Worker */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-worker')}>
          <Ionicons name="add" size={22} color="#051207" style={{ marginRight: 8 }} />
          <Text style={styles.addBtnText}>Add New Worker</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  filterBtn: {
    padding: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102815',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102815',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 14,
    gap: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1D3B24',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#102815',
  },
  info: {
    flex: 1,
  },
  workerName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  workerRole: {
    color: '#8BA890',
    fontSize: 14,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1D3B24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: '#051207',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00E632',
    borderRadius: 16,
    paddingVertical: 18,
  },
  addBtnText: {
    color: '#051207',
    fontSize: 17,
    fontWeight: 'bold',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
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
});
