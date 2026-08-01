// components/ui/SideMenu.tsx — Drawer hamburger ala Claude: New chat, Riwayat, Pengaturan.
// Flat & borderless: grouping dipisah lewat spacing/warna, bukan garis.
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';

import { useTheme } from '@/lib/theme/theme';
import { ChatSession } from '@/types';
import { getSessions, deleteSession } from '@/lib/storage/chat';
import { APP_NAME } from '@/config/app';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PANEL_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 340);

function formatRelative(ts: number): string {
  const diffMin = Math.floor((Date.now() - ts) / 60000);
  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} jam lalu`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return new Date(ts).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onOpenSession: (id: string) => void;
  onOpenSettings: () => void;
  activeSessionId?: string;
}

export function SideMenu({ visible, onClose, onNewChat, onOpenSession, onOpenSettings, activeSessionId }: Props) {
  const theme = useTheme();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setSessions(getSessions().sort((a, b) => b.updatedAt - a.updatedAt));
      progress.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) });
    }
  }, [visible]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (progress.value - 1) * PANEL_WIDTH }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.55,
  }));

  const close = () => {
    progress.value = withTiming(0, { duration: 180, easing: Easing.in(Easing.cubic) });
    setTimeout(onClose, 160);
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
    <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Animated.View style={[{ width: PANEL_WIDTH, backgroundColor: theme.card }, panelStyle]}>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              paddingHorizontal: 18, paddingTop: 14, paddingBottom: 8,
            }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '900' }}>{APP_NAME}</Text>
              <TouchableOpacity onPress={close} hitSlop={10}>
                <Ionicons name="close" size={20} color={theme.subtext} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => { Haptics.selectionAsync(); onNewChat(); close(); }}
              activeOpacity={0.6}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 10,
                marginHorizontal: 12, marginTop: 8, marginBottom: 4,
                paddingHorizontal: 12, paddingVertical: 11,
                borderRadius: 14,
                backgroundColor: `${theme.accent}16`,
              }}
            >
              <Ionicons name="add-circle-outline" size={18} color={theme.accent} />
              <Text style={{ color: theme.accent, fontSize: 13, fontWeight: '700' }}>Chat baru</Text>
            </TouchableOpacity>

            <Text style={{
              color: theme.subtext, fontSize: 10, fontWeight: '800', letterSpacing: 1.2,
              textTransform: 'uppercase', paddingHorizontal: 22, marginTop: 18, marginBottom: 4,
            }}>
              Riwayat
            </Text>

            {sessions.length === 0 ? (
              <Text style={{ color: theme.subtext, fontSize: 12, paddingHorizontal: 22, marginTop: 8 }}>
                Belum ada percakapan.
              </Text>
            ) : (
              <FlatList
                style={{ flex: 1 }}
                data={sessions}
                keyExtractor={s => s.id}
                contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 8 }}
                renderItem={({ item }) => {
                  const active = item.id === activeSessionId;
                  return (
                    <TouchableOpacity
                      onPress={() => { Haptics.selectionAsync(); onOpenSession(item.id); close(); }}
                      onLongPress={() => handleDelete(item.id)}
                      activeOpacity={0.6}
                      style={{
                        paddingHorizontal: 12, paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: active ? `${theme.accent}14` : 'transparent',
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{ color: active ? theme.accent : theme.text, fontSize: 13, fontWeight: '600' }}
                      >
                        {item.title || 'Chat baru'}
                      </Text>
                      <Text style={{ color: theme.subtext, fontSize: 10, marginTop: 2 }}>
                        {formatRelative(item.updatedAt)}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => { Haptics.selectionAsync(); onOpenSettings(); close(); }}
              activeOpacity={0.6}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 10,
                marginHorizontal: 12, marginBottom: 6, marginTop: 6,
                paddingHorizontal: 12, paddingVertical: 12,
              }}
            >
              <Ionicons name="settings-outline" size={17} color={theme.subtext} />
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>Pengaturan</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Animated.View>

        <Animated.View style={[{ flex: 1, backgroundColor: '#000' }, backdropStyle]}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={close} />
        </Animated.View>
      </View>
    </Modal>
  );
}

