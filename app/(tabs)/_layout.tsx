// app/(tabs)/_layout.tsx
import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import {
  MessageCircle, History, Settings, type LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/theme';
import { type Theme } from '@/constants';

const FLOAT_MARGIN  = 16;
const TAB_HEIGHT    = 62;
const BORDER_RADIUS = 36;
const ICON_SIZE     = 23;

type TabName = 'index' | 'history' | 'profile';
interface TabConfig { name: TabName; label: string; Icon: LucideIcon; badge?: string; }

const TABS: readonly TabConfig[] = [
  { name: 'index',   label: 'Chat',    Icon: MessageCircle },
  { name: 'history', label: 'Riwayat', Icon: History        },
  { name: 'profile', label: 'Settings', Icon: Settings      },
] as const;

// ── Background ────────────────────────────────────────────────────────────────
interface TabBarBgProps { cardColor: string; borderColor: string; }

const TabBarBackground = memo<TabBarBgProps>(({ cardColor, borderColor }) => (
  <View style={[StyleSheet.absoluteFill, { borderRadius: BORDER_RADIUS, overflow: 'hidden' }]}>
    <BlurView
      intensity={95}
      tint="dark"
      blurMethod="dimezisBlurViewSdk31Plus"
      style={StyleSheet.absoluteFill}
    />
    <View style={[
      StyleSheet.absoluteFill,
      { borderRadius: BORDER_RADIUS, borderWidth: 0.8, borderColor, backgroundColor: 'rgba(255,255,255,0.03)' },
    ]} />
  </View>
));
TabBarBackground.displayName = 'TabBarBackground';

// ── Tab Icon ──────────────────────────────────────────────────────────────────
interface TabIconProps {
  focused: boolean; Icon: LucideIcon; badge?: string;
  accent: string; accentDim: string; subtext: string;
}

const TabIcon = memo<TabIconProps>(({ focused, Icon, badge, accent, accentDim, subtext }) => {
  const scale    = useSharedValue(focused ? 1.1 : 1);
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value    = withSpring(focused ? 1.1 : 1, { damping: 12, stiffness: 180 });
    progress.value = withTiming(focused ? 1 : 0, { duration: 200 });
  }, [focused]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity:   interpolate(progress.value, [0, 1], [0, 1]),
    transform: [
      { scaleX: interpolate(progress.value, [0, 1], [0.6, 1]) },
      { scaleY: interpolate(progress.value, [0, 1], [0.6, 1]) },
    ],
  }));

  return (
    <View style={styles.tabItem}>
      <Animated.View style={[styles.pill, { backgroundColor: accentDim }, pillStyle]} />
      <Animated.View style={[iconAnimStyle, { zIndex: 1 }]}>
        <View>
          <Icon
            size={ICON_SIZE}
            color={focused ? accent : subtext}
            strokeWidth={focused ? 2.2 : 1.8}
            fill={focused ? accent + '30' : 'transparent'}
          />
          {badge != null && (
            <View style={[styles.badge, { backgroundColor: accent }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
});
TabIcon.displayName = 'TabIcon';

// ── Layout ────────────────────────────────────────────────────────────────────
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const theme  = useTheme();

  const bottomPad = Math.max(insets.bottom, 8);

  const tabBarBackground = React.useMemo(
    () => () => <TabBarBackground cardColor={theme.card} borderColor={theme.border} />,
    [theme.card, theme.border],
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle:  { backgroundColor: theme.bg },
        animation:   'fade',
        tabBarStyle: {
          position:        'absolute',
          bottom:          bottomPad + FLOAT_MARGIN,
          left:            FLOAT_MARGIN,
          right:           FLOAT_MARGIN,
          width:           undefined,
          height:          TAB_HEIGHT,
          paddingBottom:   0,
          paddingTop:      0,
          paddingLeft:     0,
          paddingRight:    0,
          marginLeft:      FLOAT_MARGIN,
          marginRight:     FLOAT_MARGIN,
          backgroundColor: 'transparent',
          borderTopWidth:  0,
          elevation:       0,
          borderRadius:    BORDER_RADIUS,
          shadowColor:     '#000',
          shadowOffset:    { width: 0, height: 8 },
          shadowOpacity:   0.4,
          shadowRadius:    20,
        },
        tabBarItemStyle: { height: TAB_HEIGHT, padding: 0, margin: 0, flex: 1 },
        tabBarBackground,
        tabBarShowLabel:         false,
        tabBarActiveTintColor:   theme.accent,
        tabBarInactiveTintColor: theme.subtext,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                Icon={tab.Icon}
                badge={tab.badge}
                accent={theme.accent}
                accentDim={theme.accentDim}
                subtext={theme.subtext}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems:     'center',
    justifyContent: 'center',
    width:          '100%',
    height:         TAB_HEIGHT,
    paddingTop:     20,
  },
  pill: {
    position:     'absolute',
    top:          21,
    width:        69,
    height:       42,
    borderRadius: 21,
  },
  badge: {
    position:          'absolute',
    top:               -4,
    right:             -10,
    borderRadius:      4,
    paddingHorizontal: 3,
    paddingVertical:   1,
  },
  badgeText: {
    fontSize:      6,
    fontWeight:    '900',
    color:         '#000',
    letterSpacing: 0.3,
  },
});
