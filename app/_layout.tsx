import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

function InitialLayout() {
  const { user, initializing } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (initializing) return;
    const isPublicRoute = segments.length === 0 || segments[0] === 'index' || segments[0] === 'login';
    if (user && isPublicRoute) {
      router.replace('/(tabs)');
    } else if (!user && !isPublicRoute) {
      router.replace('/login');
    }
  }, [user, initializing, segments]);

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={COLORS.accent} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='login' />
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='event-detail' options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: COLORS.bg }}>
      <StatusBar style='light' />
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
