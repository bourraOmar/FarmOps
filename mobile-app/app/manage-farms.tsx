import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useFarm } from '../contexts/FarmContext';

export default function ManageFarmsScreen() {
  const router = useRouter();
  const { farms } = useFarm();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Farms</Text>
        <TouchableOpacity onPress={() => router.push('/create-farm')} style={styles.addButton}>
          <Plus size={24} color="#051207" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {farms.map((farm) => (
          <View key={farm._id} style={styles.farmCard}>
            <Text style={styles.farmName}>{farm.name}</Text>
            {farm.location ? <Text style={styles.farmDetail}>📍 {farm.location}</Text> : null}
            {farm.size ? <Text style={styles.farmDetail}>📐 {farm.size} hectares</Text> : null}
          </View>
        ))}
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
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#00E632',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    gap: 12,
    paddingBottom: 40,
  },
  farmCard: {
    backgroundColor: '#102815',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 20,
  },
  farmName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  farmDetail: {
    fontSize: 14,
    color: '#8BA890',
    marginBottom: 2,
  },
});
