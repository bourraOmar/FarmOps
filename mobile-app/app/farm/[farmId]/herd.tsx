import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import {
  Plus,
  Search,
  ChevronRight,
  BriefcaseMedical,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { apiClient } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

const filters = ['All', 'Bulls', 'Cows', 'Sick'];

export default function FarmHerdScreen() {
  const { farmId } = useLocalSearchParams<{ farmId: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnimals = async () => {
    try {
      const data = await apiClient.getAnimals(farmId);
      setAnimals(data);
    } catch (error) {
      console.error('Failed to fetch animals:', error);
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
      fetchAnimals();
    }, [farmId, isAuthenticated])
  );

  const onRefresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setRefreshing(true);
    await fetchAnimals();
    setRefreshing(false);
  }, [farmId, isAuthenticated]);

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch =
      animal.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      (animal.tagId || animal._id)?.toString().includes(searchText);

    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Bulls') return animal.gender === 'Male';
    if (activeFilter === 'Cows') return animal.gender === 'Female';
    if (activeFilter === 'Sick') return animal.status === 'Sick';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Herd</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-animal')}>
          <Plus size={24} color="#051207" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#8BA890" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID or Name..."
          placeholderTextColor="#8BA890"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.activeFilterChip,
                filter === 'Sick' && styles.sickFilterChip,
                (filter === 'Sick' && activeFilter === 'Sick') && styles.activeSickFilterChip,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
                filter === 'Sick' && styles.sickFilterText,
                (filter === 'Sick' && activeFilter === 'Sick') && styles.activeSickFilterText,
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Animal List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E632" />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#00E632" style={{ marginTop: 60 }} />
        ) : filteredAnimals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🐄</Text>
            <Text style={styles.emptyTitle}>No animals yet</Text>
            <Text style={styles.emptySubtitle}>Tap the + button to add your first animal</Text>
          </View>
        ) : (
          filteredAnimals.map((item) => (
            <TouchableOpacity key={item._id} style={styles.cardContainer} onPress={() => router.push(`/animal/${item._id}`)}>
              <LinearGradient
                colors={['#102815', '#0D1F12']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {item.status === 'Sick' && <View style={styles.sickStripe} />}

                <View style={styles.cardContent}>
                  <View style={styles.imageContainer}>
                    {item.photoUrl ? (
                      <Image source={{ uri: item.photoUrl }} style={styles.animalImage} />
                    ) : (
                      <View style={[styles.animalImage, styles.placeholderImage]}>
                        <Text style={styles.placeholderEmoji}>
                          {item.gender === 'Male' ? '🐂' : '🐄'}
                        </Text>
                      </View>
                    )}
                    <View style={[
                      styles.statusDot,
                      item.status === 'Sick' ? { backgroundColor: '#EF4444' } : { backgroundColor: '#00E632' },
                    ]} />
                  </View>

                  <View style={styles.detailsContainer}>
                    <View style={styles.row}>
                      <Text style={styles.nameText}>{item.name}</Text>
                      {item.tagId ? <Text style={styles.idText}>ID: {item.tagId}</Text> : null}
                      {item.gender === 'Female' ? (
                        <Text style={styles.genderIconPink}>♀</Text>
                      ) : item.gender === 'Male' ? (
                        <Text style={styles.genderIconBlue}>♂</Text>
                      ) : null}
                    </View>
                    <View style={styles.subRow}>
                      {item.breed ? <Text style={styles.detailText}>{item.breed}</Text> : null}
                      {item.breed && item.weight ? <View style={styles.dotSeparator} /> : null}
                      {item.weight ? <Text style={styles.detailText}>{item.weight} kg</Text> : null}
                      {!item.breed && !item.weight ? <Text style={styles.detailText}>No details</Text> : null}
                    </View>
                    {item.status === 'Sick' && (
                      <View style={styles.statusBadgeSick}>
                        <BriefcaseMedical size={12} color="#EF4444" />
                        <Text style={styles.statusBadgeTextSick}>{item.statusText}</Text>
                      </View>
                    )}
                  </View>

                  <ChevronRight size={24} color="#8BA890" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#051207', paddingTop: 60 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, marginBottom: 24,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  addButton: {
    width: 48, height: 48, backgroundColor: '#00E632', borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#00E632', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  searchContainer: { paddingHorizontal: 24, marginBottom: 24, position: 'relative' },
  searchIcon: { position: 'absolute', left: 40, top: 18, zIndex: 1 },
  searchInput: {
    backgroundColor: '#102815', borderWidth: 1, borderColor: '#1D3B24', borderRadius: 16,
    height: 56, paddingLeft: 48, paddingRight: 16, color: '#FFFFFF', fontSize: 16,
  },
  filterContainer: { marginBottom: 24 },
  filterScrollContent: { paddingHorizontal: 24, gap: 12 },
  filterChip: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24,
    backgroundColor: '#102815', borderWidth: 1, borderColor: '#1D3B24',
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  activeFilterChip: { backgroundColor: '#00E632', borderColor: '#00E632' },
  sickFilterChip: { borderColor: '#3A1515', backgroundColor: '#1A0F0F' },
  activeSickFilterChip: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  filterText: { color: '#8BA890', fontSize: 14, fontWeight: '600' },
  activeFilterText: { color: '#051207' },
  sickFilterText: { color: '#EF4444' },
  activeSickFilterText: { color: '#FFFFFF' },
  listContent: { paddingHorizontal: 24, gap: 16 },
  cardContainer: { width: '100%' },
  card: {
    borderRadius: 24, borderWidth: 1, borderColor: '#1D3B24',
    overflow: 'hidden', position: 'relative',
  },
  sickStripe: {
    position: 'absolute', left: 0, top: 16, bottom: 16, width: 4,
    backgroundColor: '#EF4444', borderTopRightRadius: 4, borderBottomRightRadius: 4,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  imageContainer: { position: 'relative' },
  animalImage: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#2A3F30' },
  statusDot: {
    position: 'absolute', bottom: -2, right: -2, width: 14, height: 14,
    borderRadius: 7, borderWidth: 2, borderColor: '#102815',
  },
  detailsContainer: { flex: 1, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  nameText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  idText: { fontSize: 14, color: '#8BA890', fontFamily: 'monospace' },
  genderIconPink: { color: '#FF69B4', fontSize: 14, fontWeight: 'bold' },
  genderIconBlue: { color: '#3B82F6', fontSize: 14, fontWeight: 'bold' },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14, color: '#8BA890' },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#8BA890' },
  statusBadgeSick: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusBadgeTextSick: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
  placeholderImage: { justifyContent: 'center', alignItems: 'center' },
  placeholderEmoji: { fontSize: 30 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#8BA890', textAlign: 'center' },
});
