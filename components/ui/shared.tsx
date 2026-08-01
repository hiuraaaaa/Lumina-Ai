// shared.tsx — Design system dasar: flat, borderless, no strokes kecuali perlu
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme/theme';

export function SectionLabel({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <Text style={{
      color: theme.subtext,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      paddingHorizontal: 20,
      marginTop: 20,
      marginBottom: 8,
    }}>
      {label}
    </Text>
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
      activeOpacity={onPress ? 0.6 : 1}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
      }}
    >
      <View style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${theme.accent}16`,
      }}>
        <Ionicons name={icon as any} size={16} color={theme.accent} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>{label}</Text>
        {subtitle && (
          <Text style={{ color: theme.subtext, fontSize: 11, marginTop: 2 }}>{subtitle}</Text>
        )}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={15} color={theme.subtext} /> : null)}
    </TouchableOpacity>
  );
}

// Borderless: dibedain dari background layar cukup lewat warna fill, bukan stroke.
export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  const theme = useTheme();
  return (
    <View style={[{
      marginHorizontal: 16,
      marginBottom: 10,
      backgroundColor: theme.card,
      borderRadius: 18,
      overflow: 'hidden',
    }, style]}>
      {children}
    </View>
  );
}
