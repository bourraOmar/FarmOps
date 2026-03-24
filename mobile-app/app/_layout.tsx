import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { FarmProvider } from '../contexts/FarmContext';
import { StatusBar } from 'expo-status-bar';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    
    // Identify routes that should only be accessible when logged OUT (Public)
    // "index" (Landing), "login", "signup"
    const isPublicRoute = 
      segments[0] === 'index' || 
      segments[0] === 'login' || 
      segments[0] === 'signup' || 
      segments.length < 1;

    console.log('[NAV] Segment:', segments, 'IsAuth:', isAuthenticated);

    if (isAuthenticated) {
      // If user is logged in, redirect them away from public routes to the dashboard
      if (isPublicRoute) {
        router.replace('/(tabs)');
      }
      // If they are on a protected route (like add-animal or (tabs)), allow it.
    } else {
      // If user is NOT logged in, redirect them away from protected routes to landing
      if (!isPublicRoute) {
        router.replace('/');
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


