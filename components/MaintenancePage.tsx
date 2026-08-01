// components/MaintenancePage.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown, useSharedValue, withRepeat,
  withSequence, withTiming, useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/theme';

interface Props {
  message?: string;
  estimasi?: string;
}

export default function MaintenancePage({ message, estimasi }: Props) {
  const theme = useTheme();

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 900 }),
        withTiming(1, { duration: 900 }),
      ),
      -1,
      false,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <SafeAreaView style={{
      flex: 1, backgroundColor: theme.bg,
      alignItems: 'center', justifyContent: 'center', padding: 32,
    }}>

      {/* Icon */}
      <Animated.View style={[{
        width: 96, height: 96, borderRadius: 24,
        backgroundColor: theme.accentDim,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 28,
      }, pulseStyle]}>
        <Ionicons name="construct-outline" size={48} color={theme.accent} />
      </Animated.View>

      {/* Title */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text style={{
          color: theme.text, fontSize: 22, fontWeight: '900',
          letterSpacing: -0.5, textAlign: 'center', marginBottom: 10,
        }}>
          Sedang Maintenance
        </Text>
        <Text style={{
          color: theme.subtext, fontSize: 13, textAlign: 'center',
          lineHeight: 20, marginBottom: 24,
        }}>
          {message || 'Kami sedang melakukan pembaruan sistem.\nMohon tunggu sebentar.'}
        </Text>
      </Animated.View>

      {/* Estimasi */}
      {estimasi ? (
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: theme.card, paddingHorizontal: 20,
            paddingVertical: 12, borderRadius: 12,
            borderWidth: 1, borderColor: theme.border,
            marginBottom: 32,
          }}
        >
          <Ionicons name="time-outline" size={16} color={theme.accent} />
          <Text style={{ color: theme.text, fontSize: 13, fontWeight: '700' }}>
            Estimasi selesai: <Text style={{ color: theme.accent }}>{estimasi}</Text>
          </Text>
        </Animated.View>
      ) : <View style={{ marginBottom: 32 }} />}

      {/* Loading indicator */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={{ alignItems: 'center', gap: 10 }}>
        <ActivityIndicator color={theme.accent} size="small" />
        <Text style={{ color: theme.subtext, fontSize: 11, fontWeight: '600' }}>
          Memeriksa status server...
        </Text>
      </Animated.View>

    </SafeAreaView>
  );
}

