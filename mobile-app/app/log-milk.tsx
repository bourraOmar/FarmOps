import React, { useState, useEffect } from 'react';
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

const SESSIONS = ['Morning', 'Evening', 'Night'] as const;
const SESSION_ICONS: Record<string, string> = {
  Morning: '🌅',
  Evening: '🌇',
  Night: '🌙',
};

type Animal = { _id: string; name: string; tagId?: string };

export default function LogMilkScreen() {
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [session, setSession] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [animalDropdownOpen, setAnimalDropdownOpen] = useState(false);

  // Auto-fill today's date
  useEffect(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    setDate(`${mm}/${dd}/${yyyy}`);

    apiClient.getAnimals().then((data: Animal[]) => setAnimals(data)).catch(() => {});
  }, []);

  const handleDateChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length >= 3 && digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
    setDate(formatted);
  };

  const handleSave = async () => {
    if (!selectedAnimal) {
      Alert.alert('Missing Info', 'Please select an animal.');
      return;
    }
    const liters = parseFloat(amount);
    if (!amount || isNaN(liters) || liters <= 0) {
      Alert.alert('Missing Info', 'Please enter a valid amount in litres.');
      return;
    }
    if (!date || date.length < 10) {
      Alert.alert('Missing Info', 'Please enter a valid date (MM/DD/YYYY).');
      return;
    }

    setLoading(true);
    try {
      await apiClient.createMilkRecord({
        animalId: selectedAnimal._id,
        date,
        amountLiters: liters,
        session,
        notes: notes.trim() || undefined,
      });
      Alert.alert('Saved', 'Milk record logged successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Milk Production</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Animal selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Animal *</Text>
            <TouchableOpacity
              style={[styles.input, styles.selectorRow]}
              onPress={() => setAnimalDropdownOpen((v) => !v)}
            >
              <Text style={selectedAnimal ? styles.selectorValue : styles.selectorPlaceholder}>
                {selectedAnimal
                  ? `${selectedAnimal.name}${selectedAnimal.tagId ? ` (#${selectedAnimal.tagId})` : ''}`
                  : 'Select animal...'}
              </Text>
              <Ionicons name={animalDropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#8BA890" />
            </TouchableOpacity>
            {animalDropdownOpen && (
              <View style={styles.dropdown}>
                {animals.length === 0 ? (
                  <Text style={styles.dropdownEmpty}>No animals found</Text>
                ) : (
                  animals.map((a) => (
                    <TouchableOpacity
                      key={a._id}
                      style={[styles.dropdownItem, selectedAnimal?._id === a._id && styles.dropdownItemActive]}
                      onPress={() => { setSelectedAnimal(a); setAnimalDropdownOpen(false); }}
                    >
                      <Text style={[styles.dropdownItemText, selectedAnimal?._id === a._id && styles.dropdownItemTextActive]}>
                        {a.name}{a.tagId ? ` (#${a.tagId})` : ''}
                      </Text>
                      {selectedAnimal?._id === a._id && <Ionicons name="checkmark" size={16} color="#00E632" />}
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </View>

          {/* Session picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Session *</Text>
            <View style={styles.sessionRow}>
              {SESSIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sessionBtn, session === s && styles.sessionBtnActive]}
                  onPress={() => setSession(s)}
                >
                  <Text style={styles.sessionEmoji}>{SESSION_ICONS[s]}</Text>
                  <Text style={[styles.sessionBtnText, session === s && styles.sessionBtnTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount (Litres) *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="water-outline" size={18} color="#8BA890" style={styles.inputIcon} />
              <TextInput
                style={styles.inputInner}
                placeholder="e.g. 12.5"
                placeholderTextColor="#557060"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
              <Text style={styles.inputSuffix}>L</Text>
            </View>
          </View>

          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="calendar-outline" size={18} color="#8BA890" style={styles.inputIcon} />
              <TextInput
                style={styles.inputInner}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#557060"
                value={date}
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. Cow seemed healthy, normal yield"
              placeholderTextColor="#557060"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

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
                <Text style={styles.saveBtnText}>Save Record</Text>
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
  container: { flex: 1, backgroundColor: '#051207' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  inputGroup: { marginBottom: 18 },
  label: { color: '#8BA890', fontSize: 13, marginBottom: 8 },
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
  textArea: { height: 90, textAlignVertical: 'top' },
  selectorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectorValue: { color: '#FFFFFF', fontSize: 15 },
  selectorPlaceholder: { color: '#557060', fontSize: 15 },
  dropdown: {
    backgroundColor: '#102815',
    borderWidth: 1,
    borderColor: '#1D3B24',
    borderRadius: 14,
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownEmpty: { color: '#8BA890', padding: 14, textAlign: 'center' },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#1D3B24',
  },
  dropdownItemActive: { backgroundColor: '#1A3020' },
  dropdownItemText: { color: '#8BA890', fontSize: 15 },
  dropdownItemTextActive: { color: '#00E632', fontWeight: '600' },
  sessionRow: { flexDirection: 'row', gap: 10 },
  sessionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#102815',
    borderWidth: 1,
    borderColor: '#1D3B24',
    gap: 4,
  },
  sessionBtnActive: { borderColor: '#00E632', backgroundColor: '#1A3020' },
  sessionEmoji: { fontSize: 20 },
  sessionBtnText: { color: '#8BA890', fontSize: 13, fontWeight: '600' },
  sessionBtnTextActive: { color: '#00E632' },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102815',
    borderWidth: 1,
    borderColor: '#1D3B24',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  inputInner: { flex: 1, color: '#FFFFFF', fontSize: 15, paddingVertical: 14 },
  inputSuffix: { color: '#8BA890', fontSize: 15 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00E632',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 12,
  },
  saveBtnText: { color: '#051207', fontSize: 17, fontWeight: 'bold' },
});
