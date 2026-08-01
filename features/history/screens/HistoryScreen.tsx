// app/history.tsx — Daftar riwayat chat
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/lib/theme/theme';
import { ChatSession } from '@/types';
import { getSessions, deleteSession } from '@/lib/storage/chat';

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useFocusEffect(
    useCallback(() => {
      setSessions(getSessions().sort((a, b) => b.updatedAt - a.updatedAt));
    }, [])
  );

  const handleOpen = (id: string) => {
    Haptics.selectionAsync();
    router.push({ pathname: '/', params: { sessionId: id } });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus chat?', 'Riwayat percakapan ini akan dihapus permanen.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive', onPress: () => {
          deleteSession(id);
          setSessions(getSessions().sort((a, b) => b.updatedAt - a.updatedAt));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingHorizontal: 14, paddingVertical: 10,
        borderBottomWidth: 1, borderBottomColor: theme.border,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
            backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border,
          }}
        >
          <Ionicons name="chevron-back" size={19} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontSize: 16, fontWeight: '900' }}>Riwayat</Text>
      </View>

      {sessions.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
          <Ionicons name="time-outline" size={36} color={theme.subtext} />
          <Text style={{ color: theme.subtext, fontSize: 13, textAlign: 'center', marginTop: 12 }}>
            Belum ada percakapan tersimpan.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={s => s.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleOpen(item.id)}
              onLongPress={() => handleDelete(item.id)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 12,
                backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border,
                paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8,
              }}
            >
              <View style={{
                width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                backgroundColor: `${theme.accent}18`,
              }}>
                <Ionicons name="chatbubble-ellipses-outline" size={17} color={theme.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ color: theme.text, fontSize: 13, fontWeight: '700' }}>
                  {item.title || 'Chat baru'}
                </Text>
                <Text style={{ color: theme.subtext, fontSize: 11, marginTop: 2 }}>
                  {item.messages.length} pesan · {formatDate(item.updatedAt)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={10}>
                <Ionicons name="trash-outline" size={17} color={`${theme.subtext}`} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
