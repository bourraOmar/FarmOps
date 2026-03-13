import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../lib/api';

const ROLES = [
  'Farm Manager',
  'Livestock Handler',
  'Veterinarian',
  'Milking Technician',
  'Field Worker',
  'Driver',
  'Security',
  'Other',
];

type Worker = {
  _id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
};

export default function WorkerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Edit form state
  const [eName, setEName] = useState('');
  const [eRole, setERole] = useState('');
  const [ePhone, setEPhone] = useState('');
  const [eEmail, setEEmail] = useState('');

  useEffect(() => {
    fetchWorker();
  }, [id]);

  const fetchWorker = async () => {
    try {
      const data = await apiClient.getWorkerById(id);
      setWorker(data);
    } catch {
      Alert.alert('Error', 'Could not load worker profile.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const openEdit = () => {
    if (!worker) return;
    setEName(worker.name);
    setERole(worker.role);
    setEPhone(worker.phone ?? '');
    setEEmail(worker.email ?? '');
    setEditVisible(true);
  };

  const handleSave = async () => {
    if (!eName.trim()) {
      Alert.alert('Validation', 'Name is required.');
      return;
    }
    if (!eRole) {
      Alert.alert('Validation', 'Please select a role.');
      return;
    }
    setSaving(true);
    try {
      const updated = await apiClient.updateWorker(id, {
        name: eName.trim(),
        role: eRole,
        phone: ePhone.trim() || undefined,
        email: eEmail.trim() || undefined,
      });
      setWorker(updated);
      setEditVisible(false);
    } catch {
      Alert.alert('Error', 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Worker',
      `Are you sure you want to remove ${worker?.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.deleteWorker(id);
              router.back();
            } catch {
              Alert.alert('Error', 'Could not delete worker.');
            }
          },
        },
      ]
    );
  };

  const handleCall = () => {
    if (!worker?.phone) {
      Alert.alert('No Phone', 'This worker has no phone number on file.');
      return;
    }
    Linking.openURL(`tel:${worker.phone}`);
  };

  const handleEmail = () => {
    if (!worker?.email) {
      Alert.alert('No Email', 'This worker has no email address on file.');
      return;
    }
    Linking.openURL(`mailto:${worker.email}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00E632" />
      </View>
    );
  }

  if (!worker) return null;

  const initials = worker.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Worker Profile</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={22} color="#FF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar & Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            {worker.avatarUrl ? (
              <Image source={{ uri: worker.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.initials}>{initials}</Text>
              </View>
            )}
          </View>
          <Text style={styles.workerName}>{worker.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{worker.role}</Text>
          </View>
        </View>

        {/* Contact Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
            <Ionicons name="call" size={22} color="#00E632" />
            <Text style={styles.actionLabel}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleEmail}>
            <Ionicons name="mail" size={22} color="#00E632" />
            <Text style={styles.actionLabel}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={openEdit}>
            <Ionicons name="create-outline" size={22} color="#00E632" />
            <Text style={styles.actionLabel}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#8BA890" />
            <View style={styles.infoTexts}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{worker.phone || '—'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color="#8BA890" />
            <View style={styles.infoTexts}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{worker.email || '—'}</Text>
            </View>
          </View>
        </View>

        {/* Job Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Job Details</Text>

          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={18} color="#8BA890" />
            <View style={styles.infoTexts}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{worker.role}</Text>
            </View>
          </View>
        </View>

        {/* Edit Button */}
        <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
          <Ionicons name="create-outline" size={20} color="#051207" style={{ marginRight: 8 }} />
          <Text style={styles.editBtnText}>Edit Worker</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Edit Modal ── */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Worker</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Ionicons name="close" size={24} color="#8BA890" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Name */}
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={eName}
                onChangeText={setEName}
                placeholderTextColor="#557060"
                placeholder="e.g. John Smith"
              />

              {/* Role */}
              <Text style={styles.label}>Role *</Text>
              <TouchableOpacity style={styles.picker} onPress={() => setShowRoleModal(true)}>
                <Text style={eRole ? styles.pickerValue : styles.pickerPlaceholder}>
                  {eRole || 'Select role...'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#8BA890" />
              </TouchableOpacity>

              {/* Phone */}
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={ePhone}
                onChangeText={setEPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#557060"
                placeholder="+1 (555) 000-0000"
              />

              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={eEmail}
                onChangeText={setEEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#557060"
                placeholder="worker@example.com"
              />

              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#051207" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Role Picker Modal */}
      <Modal visible={showRoleModal} animationType="fade" transparent>
        <TouchableOpacity
          style={styles.roleOverlay}
          activeOpacity={1}
          onPress={() => setShowRoleModal(false)}
        >
          <View style={styles.roleSheet}>
            <Text style={styles.roleSheetTitle}>Select Role</Text>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleOption, eRole === r && styles.roleOptionActive]}
                onPress={() => {
                  setERole(r);
                  setShowRoleModal(false);
                }}
              >
                <Text style={[styles.roleOptionText, eRole === r && styles.roleOptionTextActive]}>
                  {r}
                </Text>
                {eRole === r && <Ionicons name="checkmark" size={18} color="#00E632" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#051207' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  deleteBtn: { padding: 4 },

  content: { paddingBottom: 40 },

  profileSection: { alignItems: 'center', paddingVertical: 28 },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#00E632',
    overflow: 'hidden',
    marginBottom: 14,
  },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: {
    backgroundColor: '#1D3B24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: { color: '#00E632', fontSize: 32, fontWeight: 'bold' },
  workerName: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  roleBadge: {
    backgroundColor: '#1D3B24',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: { color: '#00E632', fontSize: 13, fontWeight: '600' },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  actionBtn: {
    alignItems: 'center',
    backgroundColor: '#102815',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 6,
    flex: 1,
  },
  actionLabel: { color: '#8BA890', fontSize: 12, fontWeight: '600' },

  card: {
    backgroundColor: '#102815',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  cardTitle: { color: '#8BA890', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  infoTexts: { flex: 1 },
  infoLabel: { color: '#8BA890', fontSize: 11, marginBottom: 2 },
  infoValue: { color: '#FFFFFF', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#1D3B24', marginVertical: 4 },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00E632',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 8,
  },
  editBtnText: { color: '#051207', fontSize: 16, fontWeight: 'bold' },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: {
    backgroundColor: '#102815',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#1D3B24',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  label: { color: '#8BA890', fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#051207',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  picker: {
    backgroundColor: '#051207',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1D3B24',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerValue: { color: '#FFFFFF', fontSize: 15 },
  pickerPlaceholder: { color: '#557060', fontSize: 15 },
  saveBtn: {
    backgroundColor: '#00E632',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnText: { color: '#051207', fontSize: 16, fontWeight: 'bold' },

  // Role picker modal
  roleOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 24 },
  roleSheet: {
    backgroundColor: '#102815',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  roleSheetTitle: { color: '#8BA890', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingHorizontal: 8 },
  roleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  roleOptionActive: { backgroundColor: '#1D3B24' },
  roleOptionText: { color: '#FFFFFF', fontSize: 15 },
  roleOptionTextActive: { color: '#00E632', fontWeight: '600' },
});
