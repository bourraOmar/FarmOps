import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { FarmProvider } from '../contexts/FarmContext';
import { StatusBar } from 'expo-status-bar';
import { ShieldX, Clock, LogOut } from 'lucide-react-native';

function AccountStatusOverlay() {
  const { accountStatus, clearAccountStatus } = useAuth();
  const router = useRouter();

  if (!accountStatus) return null;

  const isBanned = accountStatus.type === 'banned';

  const handleDismiss = () => {
    clearAccountStatus();
    router.replace('/login');
  };

  return (
    <Modal visible animationType="fade" transparent={false}>
      <View style={[
        overlayStyles.container,
        isBanned ? overlayStyles.bannedBg : overlayStyles.pendingBg,
      ]}>
        <View style={overlayStyles.content}>
          {/* Icon */}
          <View style={[
            overlayStyles.iconCircle,
            isBanned ? overlayStyles.bannedIcon : overlayStyles.pendingIcon,
          ]}>
            {isBanned ? (
              <ShieldX size={56} color="#EF4444" />
            ) : (
              <Clock size={56} color="#F59E0B" />
            )}
          </View>

          {/* Title */}
          <Text style={overlayStyles.title}>
            {isBanned ? 'Compte Suspendu' : 'Compte Non Approuvé'}
          </Text>

          {/* Message from server */}
          <Text style={overlayStyles.message}>
            {accountStatus.message}
          </Text>

          {/* Info Box */}
          <View style={[
            overlayStyles.infoBox,
            isBanned ? overlayStyles.bannedInfoBox : overlayStyles.pendingInfoBox,
          ]}>
            <Text style={overlayStyles.infoText}>
              {isBanned
                ? 'Votre compte a été suspendu par l\'administrateur. Vous avez été déconnecté automatiquement. Si vous pensez qu\'il s\'agit d\'une erreur, veuillez contacter le support.'
                : 'Votre compte n\'a pas encore été approuvé par un administrateur. Veuillez patienter ou contacter l\'administrateur.'}
            </Text>
          </View>

          {/* Dismiss */}
          <TouchableOpacity
            style={[
              overlayStyles.button,
              isBanned ? overlayStyles.bannedButton : overlayStyles.pendingButton,
            ]}
            onPress={handleDismiss}
          >
            <LogOut size={20} color="#FFFFFF" />
            <Text style={overlayStyles.buttonText}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const isPublicRoute =
      segments[0] === 'index' ||
      segments[0] === 'login' ||
      segments[0] === 'signup' ||
      segments.length < 1;

    console.log('[NAV] Segment:', segments, 'IsAuth:', isAuthenticated);

    if (isAuthenticated) {
      if (isPublicRoute) {
        router.replace('/(tabs)');
      }
    } else {
      if (!isPublicRoute) {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00E632" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="create-farm" />
        <Stack.Screen name="manage-farms" />
        <Stack.Screen name="farm/[farmId]" />
      </Stack>
      <StatusBar style="light" backgroundColor="#051207" />
      {/* Global account status overlay — shows when user gets banned/suspended while using the app */}
      <AccountStatusOverlay />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FarmProvider>
        <RootLayoutNav />
      </FarmProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#051207',
  },
});

const overlayStyles = StyleSheet.create({
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
