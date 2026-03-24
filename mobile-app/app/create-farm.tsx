import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Warehouse, MapPin, Ruler, FileText } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFarm } from '../contexts/FarmContext';

export default function CreateFarmScreen() {
  const router = useRouter();
  const { createFarm } = useFarm();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a farm name');
      return;
    }

    setSaving(true);
    try {
      await createFarm({
        name: name.trim(),
        location: location.trim() || undefined,
        size: size ? parseFloat(size) : undefined,
        description: description.trim() || undefined,
      });
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create farm');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Farm</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Icon */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['rgba(0,230,50,0.15)', 'rgba(0,230,50,0.05)']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Warehouse size={48} color="#00E632" />
          </LinearGradient>
          <Text style={styles.heroTitle}>New Farm</Text>
          <Text style={styles.heroSubtitle}>
            Add a new farm to manage its livestock, workers, and milk production separately
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          {/* Farm Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Farm Name *</Text>
            <View style={styles.inputContainer}>
              <Warehouse size={20} color="#8BA890" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Green Valley Farm"
                placeholderTextColor="#5A7C60"
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#8BA890" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Marrakech, Morocco"
                placeholderTextColor="#5A7C60"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* Size */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Size (hectares)</Text>
            <View style={styles.inputContainer}>
              <Ruler size={20} color="#8BA890" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 50"
                placeholderTextColor="#5A7C60"
                value={size}
                onChangeText={setSize}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <FileText size={20} color="#8BA890" style={[styles.inputIcon, { marginTop: 16 }]} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your farm..."
                placeholderTextColor="#5A7C60"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveButton, (!name.trim() || saving) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!name.trim() || saving}
        >
          {saving ? (
            <ActivityIndicator color="#051207" />
          ) : (
            <Text style={styles.saveButtonText}>Create Farm</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  heroGradient: {
    width: 96,
    height: 96,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#8BA890',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  formSection: {
    gap: 20,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8BA890',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102815',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 36,
    backgroundColor: '#051207',
    borderTopWidth: 1,
    borderTopColor: '#1D3B24',
  },
  saveButton: {
    backgroundColor: '#00E632',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00E632',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#051207',
  },
});
