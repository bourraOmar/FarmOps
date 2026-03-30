import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Sprout, ShieldX, Clock, ArrowLeft } from 'lucide-react-native'; 
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Account status modal
  const [statusModal, setStatusModal] = useState<{
    visible: boolean;
    type: 'banned' | 'pending' | null;
    message: string;
  }>({ visible: false, type: null, message: '' });

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      console.log('=== LOGIN ATTEMPT ===', email);
      await login(email, password);
      console.log('=== LOGIN SUCCESS ===');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('=== LOGIN ERROR ===', error.message);
      const errorCode = error.response?.data?.error;
      const msg = error.response?.data?.message || error.message || 'Connexion échouée';

      if (errorCode === 'ACCOUNT_BANNED') {
        setStatusModal({ visible: true, type: 'banned', message: msg });
      } else if (errorCode === 'ACCOUNT_PENDING') {
        setStatusModal({ visible: true, type: 'pending', message: msg });
      } else {
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
             <Sprout size={40} color="#00E632" />
          </View>
          <Text style={styles.appName}>FarmOps</Text>
          <Text style={styles.appTagline}>Sign in to manage your farms</Text>
        </View>

        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#5A7A60"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#5A7A60"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? <EyeOff size={20} color="#8BA890" /> : <Eye size={20} color="#8BA890" />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowBetween}>
             <View style={styles.rememberRow}>
              <Checkbox
                value={rememberMe}
                onValueChange={setRememberMe}
                color={rememberMe ? '#00E632' : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </View>
            <TouchableOpacity>
               <Text style={styles.forgotPasswordText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            <LinearGradient
              colors={['#00E632', '#00C72A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButtonGradient}
            >
              {loading ? <ActivityIndicator color="#051207" /> : <Text style={styles.loginButtonText}>Login</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.orSection}>
             <View style={styles.divider} />
             <Text style={styles.orText}>Or Login with</Text>
             <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
             <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="facebook-f" size={24} color="#3b5998" /></TouchableOpacity>
             <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="google" size={24} color="#DB4437" /></TouchableOpacity>
             <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="apple" size={24} color="#FFFFFF" /></TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Account Status Modal */}
      <Modal
        visible={statusModal.visible}
        animationType="slide"
        transparent={false}
      >
        <View style={[
          statusModalStyles.container,
          statusModal.type === 'banned' ? statusModalStyles.bannedBg : statusModalStyles.pendingBg,
        ]}>
          <View style={statusModalStyles.content}>
            {/* Icon */}
            <View style={[
              statusModalStyles.iconCircle,
              statusModal.type === 'banned' ? statusModalStyles.bannedIcon : statusModalStyles.pendingIcon,
            ]}>
              {statusModal.type === 'banned' ? (
                <ShieldX size={48} color="#EF4444" />
              ) : (
                <Clock size={48} color="#F59E0B" />
              )}
            </View>

            {/* Title */}
            <Text style={statusModalStyles.title}>
              {statusModal.type === 'banned'
                ? 'Compte Suspendu'
                : 'En Attente d\'Approbation'}
            </Text>

            {/* Message */}
            <Text style={statusModalStyles.message}>
              {statusModal.message}
            </Text>

            {/* Additional Info */}
            <View style={[
              statusModalStyles.infoBox,
              statusModal.type === 'banned' ? statusModalStyles.bannedInfoBox : statusModalStyles.pendingInfoBox,
            ]}>
              <Text style={statusModalStyles.infoText}>
                {statusModal.type === 'banned'
                  ? 'Votre compte a été suspendu par l\'administrateur. Si vous pensez qu\'il s\'agit d\'une erreur, veuillez contacter le support.'
                  : 'Votre inscription a bien été enregistrée. Un administrateur doit approuver votre compte avant que vous puissiez vous connecter. Vous recevrez une notification une fois approuvé.'}
              </Text>
            </View>

            {/* Dismiss Button */}
            <TouchableOpacity
              style={[
                statusModalStyles.button,
                statusModal.type === 'banned' ? statusModalStyles.bannedButton : statusModalStyles.pendingButton,
              ]}
              onPress={() => setStatusModal({ visible: false, type: null, message: '' })}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
              <Text style={statusModalStyles.buttonText}>Retour à la connexion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const statusModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  bannedBg: {
    backgroundColor: '#1A0505',
  },
  pendingBg: {
    backgroundColor: '#1A1205',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  bannedIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  pendingIcon: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoBox: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  bannedInfoBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  pendingInfoBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  infoText: {
    fontSize: 14,
    color: '#AAAAAA',
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: 56,
    borderRadius: 28,
  },
  bannedButton: {
    backgroundColor: '#EF4444',
  },
  pendingButton: {
    backgroundColor: '#F59E0B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051207',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 230, 50, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 50, 0.25)',
  },
  appName: {
    fontSize: 28,
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E8E2',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D3B24',
    borderRadius: 16,
    backgroundColor: '#102815',
    height: 56,
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
    borderRadius: 4,
    borderColor: '#1D3B24',
    width: 20,
    height: 20,
  },
  rememberText: {
    color: '#8BA890',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: '#00E632',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 32,
  },
  loginButtonGradient: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
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
    marginBottom: 40,
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
  },
  footerText: {
    color: '#8BA890',
    fontSize: 14,
  },
  signupLink: {
    color: '#00E632',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
