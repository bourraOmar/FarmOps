import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { apiClient } from '../lib/api';

const ROLES = [
  'Head Herdsman',
  'Veterinarian',
  'Field Operator',
  'Nutritionist',
  'Equipment Tech',
  'Farm Manager',
  'Milking Technician',
  'Other',
];

export default function AddWorkerScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter the worker\'s name.');
      return;
    }
    if (!role) {
      Alert.alert('Missing Info', 'Please select a role.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.createWorker({
        name: name.trim(),
        role,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      });
      Alert.alert('Success', `${name} has been added as a ${role}.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save worker. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Worker</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar placeholder */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={48} color="#8BA890" />
            </View>
            <TouchableOpacity style={styles.uploadHint}>
              <Ionicons name="camera-outline" size={16} color="#00E632" />
              <Text style={styles.uploadHintText}>Add Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. John Doe"
              placeholderTextColor="#557060"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Role selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role *</Text>
            <TouchableOpacity
              style={[styles.input, styles.selectorRow]}
              onPress={() => setRoleDropdownOpen((v) => !v)}
            >
              <Text style={role ? styles.selectorValue : styles.selectorPlaceholder}>
                {role || 'Select a role...'}
              </Text>
              <Ionicons
                name={roleDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#8BA890"
              />
            </TouchableOpacity>
            {roleDropdownOpen && (
              <View style={styles.dropdown}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.dropdownItem, role === r && styles.dropdownItemActive]}
                    onPress={() => {
                      setRole(r);
                      setRoleDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        role === r && styles.dropdownItemTextActive,
                      ]}
                    >
                      {r}
                    </Text>
                    {role === r && (
                      <Ionicons name="checkmark" size={16} color="#00E632" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="call-outline" size={18} color="#8BA890" style={styles.inputIcon} />
              <TextInput
                style={styles.inputInner}
                placeholder="e.g. +1 234 567 8900"
                placeholderTextColor="#557060"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="mail-outline" size={18} color="#8BA890" style={styles.inputIcon} />
              <TextInput
                style={styles.inputInner}
                placeholder="e.g. john@farm.com"
                placeholderTextColor="#557060"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#051207" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#051207" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Save Worker</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  backBtn: {
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
    paddingTop: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#102815',
    borderWidth: 2,
    borderColor: '#1D3B24',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  uploadHintText: {
    color: '#00E632',
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#8BA890',
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#102815',
    borderWidth: 1,
    borderColor: '#1D3B24',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorValue: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  selectorPlaceholder: {
    color: '#557060',
    fontSize: 15,
  },
  dropdown: {
    backgroundColor: '#102815',
    borderWidth: 1,
    borderColor: '#1D3B24',
    borderRadius: 14,
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#1D3B24',
  },
  dropdownItemActive: {
    backgroundColor: '#1A3020',
  },
  dropdownItemText: {
    color: '#8BA890',
    fontSize: 15,
  },
  dropdownItemTextActive: {
    color: '#00E632',
    fontWeight: '600',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102815',
    borderWidth: 1,
    borderColor: '#1D3B24',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputInner: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    paddingVertical: 14,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00E632',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 12,
  },
  saveBtnText: {
    color: '#051207',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
