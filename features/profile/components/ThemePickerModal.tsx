import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme, setGlobalTheme } from '@/hooks/theme';
import { THEMES } from '@/constants';

export function ThemePickerModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const theme = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
        <BlurView intensity={40} tint="dark" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity activeOpacity={1}>
            <View style={{
              backgroundColor: theme.card,
              borderTopLeftRadius: 24, borderTopRightRadius: 24,
              paddingBottom: 40, paddingTop: 16,
              borderWidth: 1, borderColor: theme.border,
            }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginBottom: 20 }} />
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '900', paddingHorizontal: 20, marginBottom: 16 }}>Pilih Tema</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
                {THEMES.map(t => {
                  const isActive = theme.id === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() => { Haptics.selectionAsync(); setGlobalTheme(t.id); }}
                      style={{
                        width: 110, borderRadius: 14, padding: 12,
                        backgroundColor: t.bg,
                        borderWidth: isActive ? 2 : 1,
                        borderColor: isActive ? t.accent : 'rgba(255,255,255,0.06)',
                      }}
                    >
                      <View style={{ gap: 4, marginBottom: 8 }}>
                        <View style={{ height: 6, borderRadius: 3, backgroundColor: t.accent, width: '75%' }} />
                        <View style={{ height: 3, borderRadius: 2, backgroundColor: t.card, width: '100%' }} />
                        <View style={{ height: 3, borderRadius: 2, backgroundColor: t.card, width: '60%' }} />
                        <View style={{ flexDirection: 'row', gap: 4, marginTop: 2 }}>
                          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: t.accent }} />
                          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: t.card }} />
                        </View>
                      </View>
                      <Text style={{ color: t.text, fontSize: 10, fontWeight: '700' }} numberOfLines={1}>{t.name}</Text>
                      {isActive && (
                        <View style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="checkmark" size={10} color={t.bg} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
}
