import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../lib/api';

// Mock recent activity (until activity log is implemented)
const MOCK_ACTIVITY = [
  {
    id: '1',
    date: 'NOV 12',
    year: '2023',
    title: 'Deworming',
    note: 'Administered Ivermectin dosage.',
    dot: '#00E632',
  },
  {
    id: '2',
    date: 'OCT 01',
    year: '2023',
    title: 'Weight Check',
    note: 'Measured at 510 kg. Growth on track.',
    dot: '#A0A0A0',
    highlight: '510 kg',
  },
  {
    id: '3',
    date: 'SEP 15',
    year: '2023',
    title: 'Vaccination',
    note: 'FMD Booster Shot.',
    dot: '#A0A0A0',
  },
];

function formatDob(dob: string): string {
  if (!dob) return '—';
  const parts = dob.includes('/') ? dob.split('/') : null;
  const date = parts
    ? new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]))
    : new Date(dob);
  if (isNaN(date.getTime())) return dob;
  return date.toDateString(); // e.g. "Wed Dec 14 2022"
}

function calculateAge(dob: string): string {
  if (!dob) return '—';
  // Supports both MM/DD/YYYY and ISO date strings
  const parts = dob.includes('/') ? dob.split('/') : null;
  const date = parts
    ? new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]))
    : new Date(dob);
  if (isNaN(date.getTime())) return '—';
  const now = new Date();
  const years = now.getFullYear() - date.getFullYear();
  const months = now.getMonth() - date.getMonth();
  const totalMonths = years * 12 + months;
  if (totalMonths < 12) return `${totalMonths} Mo`;
  return `${Math.floor(totalMonths / 12)} Yrs`;
}

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const openEdit = () => {
    setEditForm({
      name: animal.name || '',
      tagId: animal.tagId || '',
      breed: animal.breed || '',
      gender: animal.gender || '',
      dob: animal.dob || '',
      weight: animal.weight ? String(animal.weight) : '',
    });
    setEditVisible(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const payload: any = {
        name: editForm.name,
        tagId: editForm.tagId || undefined,
        breed: editForm.breed || undefined,
        gender: editForm.gender || undefined,
        dob: editForm.dob || undefined,
        weight: editForm.weight ? parseFloat(editForm.weight) : undefined,
      };
      const updated = await apiClient.updateAnimal(id, payload);
      setAnimal(updated);
      setEditVisible(false);
    } catch {
      Alert.alert('Error', 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Animal',
      `Are you sure you want to delete ${animal?.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.deleteAnimal(id);
              router.back();
            } catch {
              Alert.alert('Error', 'Could not delete animal.');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    apiClient
      .getAnimalById(id)
      .then((data) => setAnimal(data))
      .catch(() => Alert.alert('Error', 'Could not load animal details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00E632" />
      </View>
    );
  }

  if (!animal) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Animal not found.</Text>
      </View>
    );
  }

  const age = calculateAge(animal.dob);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Animal Details</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF4D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoWrapper}>
            {animal.photoUrl ? (
              <Image source={{ uri: animal.photoUrl }} style={styles.animalPhoto} />
            ) : (
              <View style={[styles.animalPhoto, styles.photoPlaceholder]}>
                <Text style={styles.photoEmoji}>{animal.gender === 'Male' ? '🐂' : '🐄'}</Text>
              </View>
            )}
            <View style={styles.healthBadge}>
              <Ionicons name="checkmark" size={16} color="#051207" />
            </View>
          </View>
        </View>

        {/* Name & Tags */}
        <View style={styles.nameSection}>
          <Text style={styles.animalName}>
            {animal.name}{animal.tagId ? ` ${animal.tagId}` : ''}
          </Text>
          <View style={styles.tagsRow}>
            {animal.breed ? (
              <View style={styles.tagBreed}>
                <Text style={styles.tagBreedText}>{animal.breed}</Text>
              </View>
            ) : null}
            {animal.status ? (
              <View style={styles.tagStatus}>
                <Text style={styles.tagStatusText}>{animal.status}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.idLocationText}>
            {animal.tagId ? `ID: #${animal.tagId}` : ''}
            {animal.tagId && animal.location ? ' • ' : ''}
            {animal.location || ''}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Weight</Text>
              {animal.weight ? (
                <Ionicons name="trending-up" size={16} color="#00E632" />
              ) : null}
            </View>
            {animal.weight ? (
              <Text style={styles.statValue}>
                <Text style={styles.statValueLarge}>{animal.weight}</Text>
                <Text style={styles.statUnit}> kg</Text>
              </Text>
            ) : (
              <Text style={styles.statValueLarge}>—</Text>
            )}
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>DOB</Text>
            {animal.dob ? (
              <Text style={styles.dobDay}>{formatDob(animal.dob)}</Text>
            ) : (
              <Text style={styles.statValueLarge}>—</Text>
            )}
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Age</Text>
            <Text style={styles.statValueLarge}>{age}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Sex</Text>
            <View style={styles.sexRow}>
              <Text style={styles.sexText}>{animal.gender || '—'}</Text>
              {animal.gender === 'Female' ? (
                <Text style={styles.genderIconPink}> ♀</Text>
              ) : animal.gender === 'Male' ? (
                <Text style={styles.genderIconBlue}> ♂</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Lineage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lineage</Text>
          <TouchableOpacity style={styles.lineageRow}>
            <View style={styles.lineageAvatar}>
              <Ionicons name="paw" size={20} color="#8BA890" />
            </View>
            <Text style={styles.lineageLabel}>Sire (Father)</Text>
            <Ionicons name="chevron-forward" size={20} color="#8BA890" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionSold}>
            <Ionicons name="pricetag-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.actionSoldText}>Mark as{'\n'}Sold</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionEdit} onPress={openEdit}>
            <Ionicons name="pencil" size={20} color="#051207" style={{ marginRight: 8 }} />
            <Text style={styles.actionEditText}>Edit Details</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Details</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {([
                { label: 'Name *', key: 'name', placeholder: 'e.g. Bessie' },
                { label: 'Tag ID', key: 'tagId', placeholder: 'e.g. 849321' },
                { label: 'Breed', key: 'breed', placeholder: 'e.g. Holstein-Friesian' },
                { label: 'DOB (MM/DD/YYYY)', key: 'dob', placeholder: 'e.g. 12/14/2022', keyboardType: 'numeric' },
                { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 520', keyboardType: 'numeric' },
              ] as any[]).map((field) => (
                <View key={field.key} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm[field.key]}
                    onChangeText={(v) => setEditForm((f: any) => ({ ...f, [field.key]: v }))}
                    placeholder={field.placeholder}
                    placeholderTextColor="#556B5A"
                    keyboardType={field.keyboardType || 'default'}
                  />
                </View>
              ))}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderToggle}>
                  {(['Male', 'Female'] as const).map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderOption,
                        editForm.gender === g && styles.genderOptionActive,
                      ]}
                      onPress={() => setEditForm((f: any) => ({ ...f, gender: g }))}
                    >
                      <Text
                        style={[
                          styles.genderOptionText,
                          editForm.gender === g && styles.genderOptionTextActive,
                        ]}
                      >
                        {g === 'Male' ? '♂ Male' : '♀ Female'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={saveEdit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#051207" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>

              <View style={{ height: 24 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051207',
  },
  centered: {
    flex: 1,
    backgroundColor: '#051207',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#8BA890',
    fontSize: 16,
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
  scrollContent: {
    paddingHorizontal: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photoWrapper: {
    position: 'relative',
  },
  animalPhoto: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: '#102815',
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoEmoji: {
    fontSize: 60,
  },
  healthBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00E632',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#051207',
  },
  nameSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  animalName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagBreed: {
    borderWidth: 1,
    borderColor: '#00E632',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  tagBreedText: {
    color: '#00E632',
    fontSize: 13,
    fontWeight: '600',
  },
  tagStatus: {
    backgroundColor: '#1D3B24',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  tagStatusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  idLocationText: {
    color: '#8BA890',
    fontSize: 14,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#102815',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: '#8BA890',
    fontSize: 13,
    marginBottom: 8,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValueLarge: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  statUnit: {
    color: '#8BA890',
    fontSize: 14,
  },
  dobDay: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sexText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  genderIconPink: {
    color: '#FF69B4',
    fontSize: 22,
    fontWeight: 'bold',
  },
  genderIconBlue: {
    color: '#3B82F6',
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 28,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  viewAll: {
    color: '#00E632',
    fontSize: 14,
    fontWeight: '600',
  },
  lineageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102815',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 14,
    gap: 12,
  },
  lineageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1D3B24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineageLabel: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  actionSold: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#102815',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1D3B24',
    paddingVertical: 16,
  },
  actionSoldText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionEdit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00E632',
    borderRadius: 14,
    paddingVertical: 16,
  },
  actionEditText: {
    color: '#051207',
    fontSize: 15,
    fontWeight: 'bold',
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#1D3B24',
    marginTop: 4,
    marginBottom: 0,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#102815',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1D3B24',
    padding: 14,
    marginBottom: 12,
  },
  eventDate: {
    color: '#8BA890',
    fontSize: 12,
    fontWeight: '600',
  },
  eventYear: {
    color: '#5A7560',
    fontSize: 11,
    marginBottom: 4,
  },
  eventTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventNote: {
    color: '#8BA890',
    fontSize: 13,
    lineHeight: 18,
  },
  // Edit Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0D2011',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#8BA890',
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#102815',
    borderWidth: 1,
    borderColor: '#1D3B24',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 15,
  },
  genderToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#102815',
    borderWidth: 1,
    borderColor: '#1D3B24',
    alignItems: 'center',
  },
  genderOptionActive: {
    backgroundColor: '#1D3B24',
    borderColor: '#00E632',
  },
  genderOptionText: {
    color: '#8BA890',
    fontSize: 15,
    fontWeight: '600',
  },
  genderOptionTextActive: {
    color: '#00E632',
  },
  saveBtn: {
    backgroundColor: '#00E632',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#051207',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
