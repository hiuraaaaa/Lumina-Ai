// components/ui/ChatInput.tsx — Kolom input chat, floating pill dengan blur di belakangnya
// (kek Claude AI: ngambang di atas isi chat, transparan-blur, borderless).
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  sending: boolean;
  placeholder?: string;
}

export function ChatInput({ value, onChangeText, onSend, sending, placeholder = 'Tulis pesan...' }: Props) {
  const theme = useTheme();
  const blurTint = theme.tint === 'light' ? 'light' : 'dark';
  const disabled = sending || !value.trim();

  return (
    <View style={{ paddingHorizontal: 14, paddingBottom: 10, paddingTop: 6 }}>
      <BlurView
        intensity={55}
        tint={blurTint}
        experimentalBlurMethod="dimezisBlurView"
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 8,
          borderRadius: 26,
          paddingHorizontal: 10,
          paddingVertical: 8,
          overflow: 'hidden',
          // tint tambahan di atas blur biar teks tetap kebaca di semua tema
          backgroundColor: `${theme.card}66`,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.subtext}
          multiline
          style={{
            flex: 1,
            maxHeight: 120,
            color: theme.text,
            fontSize: 14,
            paddingHorizontal: 10,
            paddingVertical: 8,
          }}
        />
        <TouchableOpacity
          onPress={onSend}
          disabled={disabled}
          style={{
            width: 38, height: 38, borderRadius: 19,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: theme.accent,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <Ionicons name="arrow-up" size={18} color="#000" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

