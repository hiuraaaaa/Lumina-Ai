// app/index.tsx — Layar Chat utama
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withDelay, Easing,
} from 'react-native-reanimated';

import { useTheme } from '@/lib/theme/theme';
import { ChatMessage, ChatSession } from '@/types';
import { getSession, saveSession, getAiSettings } from '@/lib/storage/chat';
import { streamChatMessage, AiRequestError } from '@/lib/ai/client';
import { APP_NAME } from '@/config/app';
import { SideMenu } from '@/components/ui/SideMenu';

const newId = () => Crypto.randomUUID();

// KeyboardAvoidingView gak reliable di Android kalau edge-to-edge aktif
// (adjustResize native-nya suka gak ke-trigger). Jadi track tinggi keyboard
// manual lewat event, terus dorong input bar pake padding.
function useKeyboardOffset() {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  return height;
}

// Indikator "sedang mengetik" — dot yang napas (opacity pulse), bukan spinner muter.
function TypingDots() {
  const theme = useTheme();
  const d1 = useSharedValue(0.25);
  const d2 = useSharedValue(0.25);
  const d3 = useSharedValue(0.25);

  useEffect(() => {
    const loop = (sv: typeof d1, delay: number) => {
      sv.value = withDelay(delay, withRepeat(
        withSequence(
          withTiming(1, { duration: 420, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.25, { duration: 420, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ));
    };
    loop(d1, 0);
    loop(d2, 140);
    loop(d3, 280);
  }, []);

  const s1 = useAnimatedStyle(() => ({ opacity: d1.value }));
  const s2 = useAnimatedStyle(() => ({ opacity: d2.value }));
  const s3 = useAnimatedStyle(() => ({ opacity: d3.value }));
  const dotStyle = { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.subtext };

  return (
    <View style={{ flexDirection: 'row', gap: 5, paddingVertical: 6 }}>
      <Animated.View style={[dotStyle, s1]} />
      <Animated.View style={[dotStyle, s2]} />
      <Animated.View style={[dotStyle, s3]} />
    </View>
  );
}

// Tanpa bubble buat balasan AI (flat text, kek Claude). User tetap dikasih
// fill lembut biar kebaca siapa ngomong apa — borderless, no stroke.
function MessageBlock({ message }: { message: ChatMessage }) {
  const theme = useTheme();
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View style={{ alignItems: 'flex-end', marginVertical: 6 }}>
        <View style={{
          maxWidth: '86%',
          backgroundColor: theme.card,
          borderRadius: 18,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}>
          <Text style={{ color: theme.text, fontSize: 14, lineHeight: 21 }}>{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginVertical: 6, paddingRight: 20 }}>
      {message.pending ? (
        <TypingDots />
      ) : (
        <Text style={{
          color: message.error ? '#e63946' : theme.text,
          fontSize: 14,
          lineHeight: 22,
        }}>
          {message.content}
        </Text>
      )}
    </View>
  );
}

export default function ChatScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const listRef = useRef<FlatList>(null);

  const [session, setSession] = useState<ChatSession>(() => {
    if (params.sessionId) {
      const existing = getSession(params.sessionId);
      if (existing) return existing;
    }
    const ai = getAiSettings();
    return {
      id: newId(),
      title: 'Chat baru',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model: ai.model,
      messages: [],
    };
  });

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const keyboardOffset = useKeyboardOffset();

  useEffect(() => {
    if (keyboardOffset > 0) {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }, [keyboardOffset]);

  // Kalau dibuka dengan sessionId baru (misal via deep link), reload sesi tsb
  useEffect(() => {
    if (params.sessionId) {
      const existing = getSession(params.sessionId);
      if (existing) setSession(existing);
    }
  }, [params.sessionId]);

  const persist = useCallback((next: ChatSession) => {
    setSession(next);
    saveSession(next);
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = { id: newId(), role: 'user', content: text, createdAt: Date.now() };
    const pendingMsg: ChatMessage = { id: newId(), role: 'assistant', content: '', createdAt: Date.now(), pending: true };

    const title = session.messages.length === 0 ? text.slice(0, 40) : session.title;
    const withUser: ChatSession = {
      ...session,
      title,
      messages: [...session.messages, userMsg, pendingMsg],
      updatedAt: Date.now(),
    };
    persist(withUser);
    setInput('');
    setSending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    listRef.current?.scrollToEnd({ animated: true });

    const ai = getAiSettings();
    let streamed = '';
    let gotFirstDelta = false;

    try {
      await streamChatMessage(
        [...session.messages, userMsg],
        { baseUrl: ai.baseUrl, apiKey: ai.apiKey, model: session.model || ai.model },
        (chunk) => {
          streamed += chunk;
          gotFirstDelta = true;
          setSession(prev => {
            const next = {
              ...prev,
              messages: prev.messages.map(m =>
                m.id === pendingMsg.id ? { ...m, content: streamed, pending: false } : m
              ),
            };
            saveSession(next);
            return next;
          });
        },
      );
      // Kalau stream berhasil tapi kosong (misal koneksi putus di awal)
      if (!gotFirstDelta) throw new AiRequestError('Provider mengembalikan response kosong.');
    } catch (e) {
      const msg = e instanceof AiRequestError ? e.message : 'Terjadi kesalahan tak terduga.';
      setSession(prev => {
        const next = {
          ...prev,
          messages: prev.messages.map(m =>
            m.id === pendingMsg.id
              ? { ...m, content: gotFirstDelta ? streamed : msg, pending: false, error: !gotFirstDelta }
              : m
          ),
          updatedAt: Date.now(),
        };
        saveSession(next);
        return next;
      });
    } finally {
      setSending(false);
    }
  }, [input, sending, session, persist]);

  const handleNewChat = useCallback(() => {
    const ai = getAiSettings();
    setSession({
      id: newId(),
      title: 'Chat baru',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model: ai.model,
      messages: [],
    });
  }, []);

  const handleOpenSession = useCallback((id: string) => {
    const existing = getSession(id);
    if (existing) setSession(existing);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top', 'bottom']}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 14, paddingVertical: 10,
      }}>
        <TouchableOpacity
          onPress={() => { Haptics.selectionAsync(); setMenuOpen(true); }}
          hitSlop={8}
          style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="menu-outline" size={22} color={theme.text} />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: '900' }} numberOfLines={1}>
            {APP_NAME}
          </Text>
          <Text style={{ color: theme.subtext, fontSize: 10 }} numberOfLines={1}>
            {session.model}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => { Haptics.selectionAsync(); handleNewChat(); }}
          hitSlop={8}
          style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="create-outline" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>

      {session.messages.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
          <Ionicons name="sparkles-outline" size={36} color={theme.subtext} />
          <Text style={{ color: theme.subtext, fontSize: 13, textAlign: 'center', marginTop: 12 }}>
            Mulai percakapan baru. Pastikan API key sudah diisi di tab Settings.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          style={{ flex: 1 }}
          data={session.messages}
          keyExtractor={m => m.id}
          renderItem={({ item }) => <MessageBlock message={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ paddingBottom: Platform.OS === 'android' ? keyboardOffset : 0 }}
      >
        <View style={{
          flexDirection: 'row', alignItems: 'flex-end', gap: 8,
          paddingHorizontal: 16, paddingVertical: 10, paddingBottom: 10,
        }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Tulis pesan..."
            placeholderTextColor={theme.subtext}
            multiline
            style={{
              flex: 1, maxHeight: 120, color: theme.text, fontSize: 14,
              backgroundColor: theme.card, borderRadius: 18,
              paddingHorizontal: 14, paddingVertical: 10,
            }}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={sending || !input.trim()}
            style={{
              width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
              backgroundColor: theme.accent, opacity: sending || !input.trim() ? 0.5 : 1,
            }}
          >
            <Ionicons name="arrow-up" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNewChat={handleNewChat}
        onOpenSession={handleOpenSession}
        onOpenSettings={() => router.push('/settings')}
        activeSessionId={session.id}
      />
    </SafeAreaView>
  );
}
