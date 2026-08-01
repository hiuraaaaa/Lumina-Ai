import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withSpring,
  Easing, FadeIn,
} from 'react-native-reanimated';
import { COLORS, LOGO_URL } from '@/constants';

const { width } = Dimensions.get('window');

interface Props {
  onRetry: () => void;
}

export default function OfflinePage({ onRetry }: Props) {
  const pulse  = useSharedValue(1);
  const floatY = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withSequence(
      withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      withTiming(1,    { duration: 900, easing: Easing.inOut(Easing.ease) }),
    ), -1, false);

    floatY.value = withRepeat(withSequence(
      withTiming(-10, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      withTiming(0,   { duration: 1800, easing: Easing.inOut(Easing.ease) }),
    ), -1, false);
  }, []);

  const logoStyle  = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: floatY.value }] }));

  return (
    <Animated.View entering={FadeIn.duration(400)} style={s.root}>

      {/* Background blobs */}
      <View style={[s.blob, { top: -60, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: `${COLORS.gold}08` }]} />
      <View style={[s.blob, { bottom: 100, left: -80, width: 280, height: 280, borderRadius: 140, backgroundColor: `${COLORS.gold}05` }]} />

      <Animated.View style={[s.center, floatStyle]}>

        {/* Logo */}
        <Animated.View style={[s.logoWrap, logoStyle]}>
          <Image
            source={{ uri: LOGO_URL }}
            style={s.logo}
            contentFit="contain"
          />
        </Animated.View>

        {/* Icon wifi off */}
        <View style={s.iconWrap}>
          <Text style={s.iconEmoji}>📡</Text>
        </View>

        <Text style={s.title}>Tidak Ada Koneksi</Text>
        <Text style={s.subtitle}>
          Periksa koneksi internet kamu{'\n'}dan coba lagi.
        </Text>

        {/* Retry button */}
        <TouchableOpacity
          onPress={onRetry}
          activeOpacity={0.85}
          style={s.btn}
        >
          <Text style={s.btnText}>Coba Lagi</Text>
        </TouchableOpacity>

        <Text style={s.hint}>Pastikan WiFi atau data seluler aktif</Text>
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#08080a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blob: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoWrap: {
    marginBottom: 24,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconEmoji: {
    fontSize: 32,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  btn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 6,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  btnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  hint: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});

