// app/settings.tsx — Settings: provider AI (base URL/API key/model) + tema
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/lib/theme/theme';
import { AiSettings } from '@/types';
import { getAiSettings, saveAiSettings, clearSessions } from '@/lib/storage/chat';
import { AI_MODEL_PRESETS, APP_NAME } from '@/config/app';
import { SectionLabel, Card, SettingRow } from '@/components/ui/shared';
import { ThemePickerModal } from '@/features/settings/components/ThemePickerModal';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [settings, setSettings] = useState<AiSettings>(getAiSettings());
  const [showKey, setShowKey] = useState(false);
  const [themeModal, setThemeModal] = useState(false);
  const [dirty, setDirty] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSettings(getAiSettings());
      setDirty(false);
    }, [])
  );

  const update = (patch: Partial<AiSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const handleSave = () => {
    saveAiSettings(settings);
    setDirty(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Tersimpan', 'Pengaturan provider AI berhasil disimpan.');
  };

  const handleClearHistory = () => {
    Alert.alert('Hapus semua riwayat?', 'Semua chat yang tersimpan akan dihapus permanen.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => clearSessions() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 12,
          paddingHorizontal: 14, paddingVertical: 10,
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
              backgroundColor: theme.card,
            }}
          >
            <Ionicons name="chevron-back" size={19} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '900' }}>Settings</Text>
            <Text style={{ color: theme.subtext, fontSize: 10 }}>{APP_NAME}</Text>
          </View>
        </View>

        <SectionLabel label="Provider AI" />
        <Card>
          <View style={{ padding: 14, gap: 10 }}>
            <View>
              <Text style={{ color: theme.subtext, fontSize: 10, fontWeight: '700', marginBottom: 6 }}>BASE URL</Text>
              <TextInput
                value={settings.baseUrl}
                onChangeText={v => update({ baseUrl: v })}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="https://router.bynara.id/v1"
                placeholderTextColor={theme.subtext}
                style={{
                  color: theme.text, fontSize: 13, backgroundColor: theme.bg,
                  borderRadius: 10,
                  paddingHorizontal: 12, paddingVertical: 10,
                }}
              />
            </View>

            <View>
              <Text style={{ color: theme.subtext, fontSize: 10, fontWeight: '700', marginBottom: 6 }}>API KEY</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TextInput
                  value={settings.apiKey}
                  onChangeText={v => update({ apiKey: v })}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showKey}
                  placeholder="sk-..."
                  placeholderTextColor={theme.subtext}
                  style={{
                    flex: 1, color: theme.text, fontSize: 13, backgroundColor: theme.bg,
                    borderRadius: 10,
                    paddingHorizontal: 12, paddingVertical: 10,
                  }}
                />
                <TouchableOpacity onPress={() => setShowKey(v => !v)} hitSlop={8}>
                  <Ionicons name={showKey ? 'eye-off-outline' : 'eye-outline'} size={18} color={theme.subtext} />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={{ color: theme.subtext, fontSize: 10, fontWeight: '700', marginBottom: 6 }}>MODEL</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {AI_MODEL_PRESETS.map(m => {
                  const active = settings.model === m.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => update({ model: m.id })}
                      style={{
                        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
                        backgroundColor: active ? theme.accent : theme.card,
                      }}
                    >
                      <Text style={{ color: active ? '#000' : theme.text, fontSize: 11, fontWeight: '700' }}>
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TextInput
                value={settings.model}
                onChangeText={v => update({ model: v })}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="atau ketik model id manual"
                placeholderTextColor={theme.subtext}
                style={{
                  marginTop: 8, color: theme.text, fontSize: 13, backgroundColor: theme.bg,
                  borderRadius: 10,
                  paddingHorizontal: 12, paddingVertical: 10,
                }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              disabled={!dirty}
              style={{
                marginTop: 4, backgroundColor: theme.accent, borderRadius: 10,
                paddingVertical: 12, alignItems: 'center', opacity: dirty ? 1 : 0.5,
              }}
            >
              <Text style={{ color: '#000', fontWeight: '800', fontSize: 13 }}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <SectionLabel label="Tampilan" />
        <Card>
          <SettingRow icon="color-palette-outline" label="Tema" subtitle={theme.name} onPress={() => setThemeModal(true)} last />
        </Card>

        <SectionLabel label="Data" />
        <Card>
          <SettingRow icon="trash-outline" label="Hapus semua riwayat chat" onPress={handleClearHistory} last />
        </Card>
      </ScrollView>

      <ThemePickerModal visible={themeModal} onClose={() => setThemeModal(false)} />
    </SafeAreaView>
  );
}
