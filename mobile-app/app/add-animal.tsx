import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  FlatList, 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { apiClient } from '../lib/api';

const BREEDS = [
  'Holstein', 'Jersey', 'Angus', 'Hereford', 'Simmental',
  'Charolais', 'Limousin', 'Brown Swiss', 'Ayrshire',
  'Guernsey', 'Shorthorn', 'Brahman', 'Other',
];

export default function AddAnimalScreen() {
  const router = useRouter();
  const [gender, setGender] = useState<'Male' | 'Female' | null>('Female'); 
  const [name, setName] = useState('');
  const [tagId, setTagId] = useState('');
  const [breed, setBreed] = useState('');
  const [dob, setDob] = useState('');
  const [weight, setWeight] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [breedModalVisible, setBreedModalVisible] = useState(false);

  // Auto-populate next Tag ID on mount
  useEffect(() => {
    apiClient.getNextTagId().then((id) => setTagId(id)).catch(() => {});
  }, []);

  // --- Image Picker ---
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to add a photo.');
      return;
    }

    Alert.alert(
      'Add Photo',
      'Choose a source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const camPerm = await ImagePicker.requestCameraPermissionsAsync();
            if (camPerm.status !== 'granted') {
              Alert.alert('Permission Required', 'Please grant camera permissions.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled) {
              setPhotoUri(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled) {
              setPhotoUri(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // --- Date auto-format: typed as MMDDYYYY -> MM/DD/YYYY ---
  const handleDobChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length >= 3 && digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
    setDob(formatted);
  };

  // --- Submit ---
  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert("Missing Information", "Please enter the animal's name or tag ID.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createAnimal({
        name,
        tagId: tagId || undefined,
        breed,
        gender: gender || undefined,
        dob: dob || undefined,
        weight: weight ? parseFloat(weight) : undefined,
        photoUrl: photoUri || undefined,
      });
      setLoading(false);
      Alert.alert("Success", "Animal added successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Failed to add animal:', error);
      setLoading(false);
      Alert.alert("Error", "Failed to save animal. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#8BA890" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Animal</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Photo Upload Section */}
          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.photoCircle} onPress={handlePickImage}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              ) : (
                <>
                  <Ionicons name="camera" size={40} color="#8BA890" />
                  <Text style={styles.addPhotoText}>ADD PHOTO</Text>
                </>
              )}
              <View style={styles.cameraButtonSmall}>
                <Ionicons name={photoUri ? 'pencil' : 'add'} size={18} color="#051207" />
              </View>
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Tap to take a clear picture of{'\n'}the animal face or tag.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Animal Name <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Bessie"
                  placeholderTextColor="#5A7560"
                  value={name}
                  onChangeText={setName}
                />
                <Ionicons name="paw-outline" size={20} color="#5A7560" />
              </View>
            </View>

            {/* Tag ID Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tag ID</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 4092"
                  placeholderTextColor="#5A7560"
                  value={tagId}
                  onChangeText={setTagId}
                  keyboardType="numeric"
                />
                <Ionicons name="pricetag-outline" size={20} color="#5A7560" />
              </View>
            </View>

            {/* Breed Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Breed</Text>
              <TouchableOpacity style={styles.inputWrapper} onPress={() => setBreedModalVisible(true)}>
                <Text style={[styles.inputText, !breed && styles.placeholderText]}>
                  {breed || "Select Breed"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#5A7560" />
              </TouchableOpacity>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity 
                  style={[styles.genderButton, gender === 'Male' && styles.genderButtonActive]}
                  onPress={() => setGender('Male')}
                >
                  <Ionicons name="male" size={24} color={gender === 'Male' ? '#00E632' : '#8BA890'} />
                  <Text style={[styles.genderText, gender === 'Male' && styles.genderTextActive]}>Male</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.genderButton, gender === 'Female' && styles.genderButtonActive]}
                  onPress={() => setGender('Female')}
                >
                  <Ionicons name="female" size={24} color={gender === 'Female' ? '#00E632' : '#8BA890'} />
                  <Text style={[styles.genderText, gender === 'Female' && styles.genderTextActive]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#5A7560"
                  value={dob}
                  onChangeText={handleDobChange}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <Ionicons name="calendar-outline" size={20} color="#5A7560" />
              </View>
            </View>

            {/* Weight */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight (kg)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 650"
                  placeholderTextColor="#5A7560"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
                <Ionicons name="barbell-outline" size={20} color="#5A7560" />
              </View>
            </View>

          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.submitButton, loading && { opacity: 0.7 }]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#051207" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#051207" style={{marginRight: 8}} />
                <Text style={styles.submitButtonText}>Register Animal</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      {/* Breed Selection Modal */}
      <Modal
        visible={breedModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBreedModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setBreedModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Breed</Text>
            <FlatList
              data={BREEDS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.breedItem}
                  onPress={() => {
                    setBreed(item);
                    setBreedModalVisible(false);
                  }}
                >
                  <Text style={[styles.breedItemText, breed === item && styles.breedItemActive]}>
                    {item}
                  </Text>
                  {breed === item && (
                    <Ionicons name="checkmark" size={20} color="#00E632" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.breedSeparator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>

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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#102815',
  },
  cancelText: {
    color: '#8BA890',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  photoSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  photoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#2A3F30',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#0D1F12',
    overflow: 'hidden',
  },
  photoPreview: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  addPhotoText: {
    color: '#8BA890',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  cameraButtonSmall: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#00E632', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#051207',
  },
  helperText: {
    color: '#8BA890',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  formSection: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#102815',
    borderWidth: 1,
    borderColor: '#1D3B24',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
  },
  inputText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  placeholderText: {
    color: '#5A7560',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 16,
  },
  genderButton: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1D3B24',
    backgroundColor: '#102815',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  genderButtonActive: {
    backgroundColor: '#102815', 
    borderColor: '#00E632',     
  },
  genderText: {
    color: '#8BA890',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  genderTextActive: {
    color: '#00E632', 
  },
  footer: {
    padding: 24,
    backgroundColor: '#051207', 
  },
  submitButton: {
    backgroundColor: '#00E632',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#00E632",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: '#051207',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0D1F12',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#2A3F30',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  breedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  breedItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  breedItemActive: {
    color: '#00E632',
    fontWeight: '600',
  },
  breedSeparator: {
    height: 1,
    backgroundColor: '#1D3B24',
  },
});
