// hooks/useTabAnimation.ts
// ─────────────────────────────────────────────────────────────────────────────
// Hook ini sekarang tidak dipakai langsung di _layout.tsx versi Fukunime
// (animasi inline di TabIcon untuk simplicity).
// Tetap disimpan sebagai utilitas jika dibutuhkan di komponen lain.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SPRING_CONFIG, TIMING_CONFIG } from '@/constants/tabConfig';

export interface TabAnimatedStyles {
  iconStyle:  ReturnType<typeof useAnimatedStyle>;
  labelStyle: ReturnType<typeof useAnimatedStyle>;
  pillStyle:  ReturnType<typeof useAnimatedStyle>;
}

export function useTabAnimation(focused: boolean): TabAnimatedStyles {
  const iconScale      = useSharedValue(focused ? 1.15 : 1);
  const labelOpacity   = useSharedValue(focused ? 1 : 0.5);
  const labelTranslate = useSharedValue(0);
  const pillOpacity    = useSharedValue(focused ? 1 : 0);
  const pillScale      = useSharedValue(focused ? 1 : 0.5);

  useEffect(() => {
    if (focused) {
      iconScale.value    = withSpring(1.15, SPRING_CONFIG.ICON);
      labelOpacity.value = withTiming(1,   { duration: TIMING_CONFIG.LABEL_OPACITY });
      pillOpacity.value  = withTiming(1,   { duration: TIMING_CONFIG.PILL_OPACITY });
      pillScale.value    = withSpring(1,   SPRING_CONFIG.ICON);
    } else {
      iconScale.value    = withSpring(1,   SPRING_CONFIG.ICON);
      labelOpacity.value = withTiming(0.5, { duration: TIMING_CONFIG.LABEL_OPACITY });
      pillOpacity.value  = withTiming(0,   { duration: TIMING_CONFIG.PILL_OPACITY });
      pillScale.value    = withSpring(0.5, SPRING_CONFIG.ICON);
    }
  }, [focused]);

  const iconStyle  = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));
  const labelStyle = useAnimatedStyle(() => ({
    opacity:   labelOpacity.value,
    transform: [{ translateY: labelTranslate.value }],
  }));
  const pillStyle  = useAnimatedStyle(() => ({
    opacity:   pillOpacity.value,
    transform: [{ scale: pillScale.value }],
  }));

  return { iconStyle, labelStyle, pillStyle };
}
