import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Sprout, Clock, ArrowLeft } from 'lucide-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', cin: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [pendingScreen, setPendingScreen] = useState(false);

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
      const result = await signup({
        fullName: form.fullName, email: form.email, phone: form.phone,
        password: form.password, cin: form.cin || undefined
      });
      console.log('=== SIGNUP SUCCESS ===', result.status);

      if (result.status === 'pending') {
        // Show pending approval screen
        setPendingScreen(true);
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.log('=== SIGNUP ERROR ===', error.message);
      const msg = error.response?.data?.message || 'Erreur réseau ou interne';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Show pending approval full screen
  if (pendingScreen) {
    return (
      <View style={pendingStyles.container}>
        <View style={pendingStyles.content}>
          <View style={pendingStyles.iconCircle}>
            <Clock size={56} color="#F59E0B" />
          </View>
          <Text style={pendingStyles.title}>Inscription Réussie !</Text>
          <Text style={pendingStyles.subtitle}>
            Votre compte est en attente d'approbation
          </Text>
          <View style={pendingStyles.infoBox}>
            <Text style={pendingStyles.infoText}>
              Un administrateur doit approuver votre compte avant que vous puissiez
              vous connecter. Vous serez notifié une fois votre compte activé.
            </Text>
          </View>
          <View style={pendingStyles.stepsContainer}>
            <View style={pendingStyles.step}>
              <View style={[pendingStyles.stepDot, pendingStyles.stepDotDone]} />
              <Text style={pendingStyles.stepText}>Inscription</Text>
              <Text style={pendingStyles.stepStatus}>✅ Terminé</Text>
            </View>
            <View style={pendingStyles.stepLine} />
            <View style={pendingStyles.step}>
              <View style={[pendingStyles.stepDot, pendingStyles.stepDotActive]} />
              <Text style={pendingStyles.stepText}>Approbation Admin</Text>
              <Text style={[pendingStyles.stepStatus, { color: '#F59E0B' }]}>⏳ En attente</Text>
            </View>
            <View style={pendingStyles.stepLine} />
            <View style={pendingStyles.step}>
              <View style={pendingStyles.stepDot} />
              <Text style={pendingStyles.stepText}>Accès à l'application</Text>
              <Text style={pendingStyles.stepStatus}>⬜ À venir</Text>
            </View>
          </View>
          <TouchableOpacity
            style={pendingStyles.button}
            onPress={() => router.replace('/login')}
          >
            <ArrowLeft size={20} color="#1A1205" />
            <Text style={pendingStyles.buttonText}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
             <Sprout size={32} color="#00E632" />
          </View>
          <Text style={styles.appName}>Create Account</Text>
          <Text style={styles.appTagline}>Join FarmOps to get started</Text>
        </View>

        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#5A7A60"
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
                placeholderTextColor="#5A7A60"
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
                 placeholderTextColor="#5A7A60"
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
                 placeholderTextColor="#5A7A60"
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
                placeholderTextColor="#5A7A60"
                value={form.password}
                onChangeText={v => setForm({...form, password: v})}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? <EyeOff size={20} color="#8BA890" /> : <Eye size={20} color="#8BA890" />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#5A7A60"
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
              color={agree ? '#00E632' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.termsText}>
              I read and agreed to <Text style={styles.linkText}>User Agreement</Text> and <Text style={styles.linkText}>privacy policy</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
            <LinearGradient
              colors={['#00E632', '#00C72A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signupButtonGradient}
            >
              {loading ? <ActivityIndicator color="#051207" /> : <Text style={styles.signupButtonText}>Sign Up</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.orSection}>
             <View style={styles.divider} />
             <Text style={styles.orText}>Or Sign Up with</Text>
             <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
             <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="facebook-f" size={24} color="#3b5998" /></TouchableOpacity>
             <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="google" size={24} color="#DB4437" /></TouchableOpacity>
             <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="apple" size={24} color="#FFFFFF" /></TouchableOpacity>
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
    backgroundColor: '#051207',
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
    backgroundColor: 'rgba(0, 230, 50, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 50, 0.25)',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: '#8BA890',
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
    color: '#E0E8E2',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D3B24',
    borderRadius: 16,
    backgroundColor: '#102815',
    height: 50,
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
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
    borderColor: '#1D3B24',
    width: 20,
    height: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#8BA890',
    flex: 1,
    flexWrap: 'wrap',
  },
  linkText: {
    color: '#00E632',
    fontWeight: 'bold',
  },
  signupButton: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 32,
  },
  signupButtonGradient: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#051207',
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
    backgroundColor: '#1D3B24',
  },
  orText: {
    marginHorizontal: 16,
    color: '#8BA890',
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
    backgroundColor: '#102815',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#8BA890',
    fontSize: 14,
  },
  loginLink: {
    color: '#00E632',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

const pendingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051207',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoBox: {
    width: '100%',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    color: '#AAAAAA',
    lineHeight: 22,
    textAlign: 'center',
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1D3B24',
    borderWidth: 2,
    borderColor: '#2D4B34',
  },
  stepDotDone: {
    backgroundColor: '#00E632',
    borderColor: '#00E632',
  },
  stepDotActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  stepStatus: {
    fontSize: 13,
    color: '#8BA890',
  },
  stepLine: {
    width: 2,
    height: 20,
    backgroundColor: '#1D3B24',
    marginLeft: 6,
    marginVertical: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F59E0B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1205',
  },
});
