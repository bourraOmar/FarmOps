import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Sprout } from 'lucide-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', cin: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSignup = async () => {
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (form.password !== form.confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (!agree) {
      alert('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setLoading(true);
    try {
      console.log('=== SIGNUP ATTEMPT ===', form.email);
      await signup({
        fullName: form.fullName, email: form.email, phone: form.phone,
        password: form.password, cin: form.cin || undefined
      });
      console.log('=== SIGNUP SUCCESS ===');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('=== SIGNUP ERROR ===', error.message);
      const msg = error.response?.data?.message || 'Erreur réseau ou interne';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
             <Sprout size={32} color="#77B254" />
          </View>
        </View>

        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#A0A0A0"
                value={form.fullName}
                onChangeText={v => setForm({...form, fullName: v})}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#A0A0A0"
                value={form.email}
                onChangeText={v => setForm({...form, email: v})}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
             <Text style={styles.label}>Phone Number</Text>
             <View style={styles.inputWrapper}>
               <TextInput
                 style={styles.input}
                 placeholder="Enter your phone number"
                 placeholderTextColor="#A0A0A0"
                 value={form.phone}
                 onChangeText={v => setForm({...form, phone: v})}
                 keyboardType="phone-pad"
                 editable={!loading}
               />
             </View>
           </View>

           <View style={styles.inputGroup}>
             <Text style={styles.label}>CIN (Optional)</Text>
             <View style={styles.inputWrapper}>
               <TextInput
                 style={styles.input}
                 placeholder="Enter your national ID"
                 placeholderTextColor="#A0A0A0"
                 value={form.cin}
                 onChangeText={v => setForm({...form, cin: v})}
                 editable={!loading}
               />
             </View>
           </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#A0A0A0"
                value={form.password}
                onChangeText={v => setForm({...form, password: v})}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? <EyeOff size={20} color="#A0A0A0" /> : <Eye size={20} color="#A0A0A0" />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#A0A0A0"
                value={form.confirm}
                onChangeText={v => setForm({...form, confirm: v})}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.termsRow}>
            <Checkbox
              value={agree}
              onValueChange={setAgree}
              color={agree ? '#77B254' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.termsText}>
              I read and agreed to <Text style={styles.linkText}>User Agreement</Text> and <Text style={styles.linkText}>privacy policy</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signupButtonText}>Sign Up</Text>}
          </TouchableOpacity>

          <View style={styles.orSection}>
             <View style={styles.divider} />
             <Text style={styles.orText}>Or Sign Up with</Text>
             <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
             <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="facebook-f" size={24} color="#3b5998" /></TouchableOpacity>
             <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="google" size={24} color="#DB4437" /></TouchableOpacity>
             <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="apple" size={24} color="#000" /></TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F9F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    height: 50,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    paddingRight: 10,
  },
  checkbox: {
    marginRight: 10,
    borderRadius: 4,
    borderColor: '#E8E8E8',
    width: 20,
    height: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#8B8B8B',
    flex: 1,
    flexWrap: 'wrap',
  },
  linkText: {
    color: '#77B254',
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#77B254',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#77B254",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 32,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  orText: {
    marginHorizontal: 16,
    color: '#8B8B8B',
    fontSize: 14,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 32,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#8B8B8B',
    fontSize: 14,
  },
  loginLink: {
    color: '#77B254',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
