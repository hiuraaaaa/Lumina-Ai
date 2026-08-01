import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { COLORS } from '@/constants';

const { width } = Dimensions.get('window');

// ─── ShimmerBox ───────────────────────────────────────────────────────────────

export function ShimmerBox({ w, h, borderRadius = 6, style }: {
  w: number | string;
  h: number | string;
  borderRadius?: number;
  style?: object;
}) {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, { duration: 1200 }),
      -1,
      false,
    );
    return () => cancelAnimation(translateX);
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { skewX: '-20deg' }],
  }));

  return (
    <View style={[{
      width: w as any, height: h as any, borderRadius,
      backgroundColor: '#1e1e24', overflow: 'hidden',
    }, style]}>
      <Animated.View style={[{
        position: 'absolute', top: 0, bottom: 0, width: 100,
        backgroundColor: 'rgba(255,255,255,0.07)',
      }, shimmerStyle]} />
    </View>
  );
}

// ─── CardSkeleton ─────────────────────────────────────────────────────────────

export function CardSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      <ShimmerBox w="100%" h={0} borderRadius={8} style={{ aspectRatio: 3 / 4.5 }} />
      <ShimmerBox w="75%" h={9} borderRadius={4} style={{ marginTop: 7 }} />
      <ShimmerBox w="50%" h={8} borderRadius={4} style={{ marginTop: 4 }} />
    </View>
  );
}

// ─── HeroSkeleton ─────────────────────────────────────────────────────────────

export function HeroSkeleton() {
  const heroH = width * 0.7;
  return (
    <View style={{ width, height: heroH, backgroundColor: COLORS.card }}>
      <ShimmerBox w="100%" h="100%" borderRadius={0} />
      <View style={{ position: 'absolute', bottom: 24, left: 24, right: 24,
        flexDirection: 'row', gap: 16, alignItems: 'flex-end' }}>
        <ShimmerBox w={80} h={0} borderRadius={8} style={{ aspectRatio: 3 / 4.2 }} />
        <View style={{ flex: 1, gap: 8 }}>
          <ShimmerBox w="90%" h={18} borderRadius={4} />
          <ShimmerBox w="70%" h={18} borderRadius={4} />
          <ShimmerBox w="55%" h={10} borderRadius={4} />
          <ShimmerBox w={120} h={32} borderRadius={4} style={{ marginTop: 4 }} />
        </View>
      </View>
    </View>
  );
}

// ─── HorizontalCardSkeleton ───────────────────────────────────────────────────

export function HorizontalCardSkeleton() {
  return (
    <View style={{ width: 100, marginRight: 10 }}>
      <ShimmerBox w={100} h={0} borderRadius={8} style={{ aspectRatio: 3 / 4.5 }} />
      <ShimmerBox w={75} h={9} borderRadius={4} style={{ marginTop: 7 }} />
      <ShimmerBox w={50} h={8} borderRadius={4} style={{ marginTop: 4 }} />
    </View>
  );
}

// ─── RankSkeleton ─────────────────────────────────────────────────────────────

export function RankSkeleton() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14,
      backgroundColor: COLORS.card, borderRadius: 16, padding: 14, marginBottom: 10,
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', height: 88 }}>
      <ShimmerBox w={40} h={40} borderRadius={20} />
      <View style={{ flex: 1, gap: 8 }}>
        <ShimmerBox w="80%" h={13} borderRadius={4} />
        <ShimmerBox w="45%" h={10} borderRadius={4} />
      </View>
    </View>
  );
}

// ─── ScheduleCardSkeleton ─────────────────────────────────────────────────────

export function ScheduleCardSkeleton() {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
      <View style={{ width: 40, alignItems: 'center', paddingTop: 16 }}>
        <ShimmerBox w={32} h={10} borderRadius={4} />
        <View style={{ width: 1.5, flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginTop: 6 }} />
      </View>
      <View style={{ width: 10, alignItems: 'center', paddingTop: 18 }}>
        <ShimmerBox w={8} h={8} borderRadius={4} />
      </View>
      <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 14,
        overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
        <View style={{ flexDirection: 'row' }}>
          <ShimmerBox w={64} h={0} borderRadius={0} style={{ aspectRatio: 3 / 4 }} />
          <View style={{ flex: 1, padding: 12, gap: 8, justifyContent: 'center' }}>
            <ShimmerBox w="90%" h={13} borderRadius={4} />
            <ShimmerBox w="70%" h={13} borderRadius={4} />
            <ShimmerBox w="50%" h={9} borderRadius={4} />
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── EpisodeRowSkeleton ───────────────────────────────────────────────────────
// Sinkron dengan EpisodeButton:
// paddingHorizontal: 14, paddingVertical: 13, borderRadius: 10, marginBottom: 6

function EpisodeRowSkeleton() {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 10,
      paddingHorizontal: 14, paddingVertical: 13,
      borderRadius: 10, marginBottom: 6,
      backgroundColor: 'transparent',
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    }}>
      {/* index number */}
      <ShimmerBox w={32} h={14} borderRadius={4} />
      {/* title */}
      <ShimmerBox w="65%" h={13} borderRadius={4} style={{ flex: 1 }} />
    </View>
  );
}

// ─── WatchSkeleton ────────────────────────────────────────────────────────────
// Sinkron penuh dengan watch screen layout

export function WatchSkeleton() {
  // Sinkron: width * (9/16) — sama persis kayak watch screen
  const videoH = width * (9 / 16);

  // Sinkron: marginHorizontal: 16, padding: 16
  const CARD_MX  = 16;
  const CARD_PAD = 16;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Video area */}
      <ShimmerBox w={width} h={videoH} borderRadius={0} />

      <View style={{ padding: 16, gap: 12 }}>

        {/* Tombol prev/next episode */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <ShimmerBox w="48%" h={48} borderRadius={10} />
          <ShimmerBox w="48%" h={48} borderRadius={10} />
        </View>

        {/* AutoNext toggle */}
        <ShimmerBox w="100%" h={52} borderRadius={10} />

        {/* Daftar Episode — sinkron dengan card layout watch screen */}
        <View style={{
          marginHorizontal: 0,
          backgroundColor: COLORS.card, borderRadius: 12,
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
          padding: CARD_PAD,
        }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <ShimmerBox w={120} h={13} borderRadius={4} />
            <ShimmerBox w={40} h={13} borderRadius={4} />
          </View>
          {/* Search bar */}
          <ShimmerBox w="100%" h={36} borderRadius={8} style={{ marginBottom: 12 }} />
          {/* Episode rows — 6 baris */}
          {Array.from({ length: 6 }).map((_, i) => (
            <EpisodeRowSkeleton key={i} />
          ))}
        </View>

        {/* Info Anime — sinkron: marginHorizontal 16, borderRadius 16 */}
        <View style={{
          borderRadius: 16, overflow: 'hidden',
          backgroundColor: COLORS.card,
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
        }}>
          {/* Cover banner */}
          <ShimmerBox w="100%" h={200} borderRadius={0} />
          {/* Poster center */}
          <View style={{ alignItems: 'center', marginTop: -50, marginBottom: 16 }}>
            <ShimmerBox w={110} h={0} borderRadius={10} style={{ aspectRatio: 3 / 4.2 }} />
          </View>
          {/* Title */}
          <View style={{ paddingHorizontal: 16, gap: 8, marginBottom: 16, alignItems: 'center' }}>
            <ShimmerBox w="80%" h={18} borderRadius={4} />
            <ShimmerBox w="60%" h={18} borderRadius={4} />
            {/* Badges */}
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
              <ShimmerBox w={50} h={24} borderRadius={6} />
              <ShimmerBox w={70} h={24} borderRadius={6} />
              <ShimmerBox w={60} h={24} borderRadius={6} />
            </View>
            {/* Synopsis lines */}
            <ShimmerBox w="100%" h={10} borderRadius={4} style={{ marginTop: 8 }} />
            <ShimmerBox w="90%"  h={10} borderRadius={4} />
            <ShimmerBox w="75%"  h={10} borderRadius={4} />
          </View>
        </View>

      </View>
    </View>
  );
}
