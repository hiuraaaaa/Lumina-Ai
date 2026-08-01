// shared.tsx — Glassmorphism shared components
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/theme';

export function SectionLabel({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 20,
      marginBottom: 8,
      marginTop: 6,
    }}>
      <View style={{ width: 3, height: 12, borderRadius: 2, backgroundColor: theme.accent }} />
      <Text style={{
        color: theme.subtext,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        textTransform: 'uppercase',
      }}>{label}</Text>
    </View>
  );
}

export function SettingRow({ icon, label, subtitle, onPress, right, last = false }: {
  icon: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  last?: boolean;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 13,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: `${theme.accent}10`,
      }}
    >
      {/* Icon container with glass look */}
      <View style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${theme.accent}18`,
        borderWidth: 1,
        borderColor: `${theme.accent}25`,
      }}>
        <Ionicons name={icon as any} size={17} color={theme.accent} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>{label}</Text>
        {subtitle && (
          <Text style={{ color: theme.subtext, fontSize: 10, marginTop: 1 }}>{subtitle}</Text>
        )}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={15} color={`${theme.accent}50`} />}
    </TouchableOpacity>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  const theme = useTheme();
  return (
    <View style={[{
      marginHorizontal: 16,
      marginBottom: 10,
      backgroundColor: theme.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: `${theme.accent}20`,
      overflow: 'hidden',
    }, style]}>
      {/* Glass shimmer */}
      <LinearGradient
        colors={[`${theme.accent}0a`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}
