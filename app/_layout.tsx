import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState, useCallback, useRef, Component, ReactNode } from 'react';
import { Text, ScrollView, AppState, AppStateStatus } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import { loadSavedTheme, useTheme } from '@/lib/theme/theme';
import OfflinePage from '@/components/ui/OfflinePage';
import { SystemBars } from 'react-native-edge-to-edge';
import { useFonts } from 'expo-font';
import { Unbounded_500Medium, Unbounded_700Bold } from '@expo-google-fonts/unbounded';
import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { JetBrainsMono_500Medium, JetBrainsMono_600SemiBold } from '@expo-google-fonts/jetbrains-mono';
import '../global.css';

SplashScreen.preventAutoHideAsync();

// ─── Error Boundary ───────────────────────────────────────────────────────────
class RootErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) {
    return { error: e.message + '\n\n' + e.stack };
  }
  render() {
    if (this.state.error) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: '#000' }} contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
          <Text style={{ color: '#e63946', fontSize: 14, fontWeight: '900', marginBottom: 8 }}>🔴 JS CRASH</Text>
          <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'monospace', lineHeight: 18 }}>{this.state.error}</Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

// ─── AppLayout ────────────────────────────────────────────────────────────────
function AppLayout() {
  const theme = useTheme();
  const [isOffline, setIsOffline] = useState(false);

  const splashHiddenRef = useRef(false);
  const hideSplash = useCallback(async () => {
    if (splashHiddenRef.current) return;
    splashHiddenRef.current = true;
    try { await SplashScreen.hideAsync(); } catch {}
  }, []);

  useEffect(() => { loadSavedTheme(); hideSplash(); }, []);

  useEffect(() => {
    NetInfo.fetch().then(state => setIsOffline(!state.isConnected));
    const unsub = NetInfo.addEventListener(state => setIsOffline(!state.isConnected));
    return unsub;
  }, []);

  useEffect(() => {
    const handler = (nextState: AppStateStatus) => {
      if (nextState === 'active') NetInfo.fetch().then(state => setIsOffline(!state.isConnected));
    };
    const sub = AppState.addEventListener('change', handler);
    return () => sub.remove();
  }, []);

  const handleRetry = useCallback(() => {
    NetInfo.fetch().then(state => setIsOffline(!state.isConnected));
  }, []);

  const statusBarStyle = theme.tint === 'light' ? 'dark' : 'light';

  if (isOffline) {
    return (
      <>
        <SystemBars style="light" />
        <StatusBar style="light" />
        <OfflinePage onRetry={handleRetry} />
      </>
    );
  }

  return (
    <>
      <SystemBars style={statusBarStyle} />
      <StatusBar style={statusBarStyle} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg }, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="history" options={{ animation: 'slide_from_left' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Unbounded_500Medium,
    Unbounded_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <RootErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppLayout />
      </GestureHandlerRootView>
    </RootErrorBoundary>
  );
}
