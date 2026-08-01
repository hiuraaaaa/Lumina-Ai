// app/(tabs)/index.tsx — Layar Chat utama
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '@/hooks/theme';
import { ChatMessage, ChatSession } from '@/types';
import { getSession, saveSession, getAiSettings } from '@/hooks/storage/chat';
import { sendChatMessage, AiRequestError } from '@/hooks/ai/client';
import { APP_NAME } from '@/constants';

const newId = () => Crypto.randomUUID();

function Bubble({ message }: { message: ChatMessage }) {
  const theme = useTheme();
  const isUser = message.role === 'user';
  return (
    <View style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      maxWidth: '84%',
      marginVertical: 5,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      borderBottomRightRadius: isUser ? 4 : 16,
      borderBottomLeftRadius: isUser ? 16 : 4,
      backgroundColor: isUser ? theme.accent : theme.card,
      borderWidth: isUser ? 0 : 1,
      borderColor: theme.border,
    }}>
      {message.pending ? (
        <ActivityIndicator size="small" color={isUser ? '#000' : theme.accent} />
      ) : (
        <Text style={{
          color: isUser ? '#000' : (message.error ? '#e63946' : theme.text),
          fontSize: 14,
          lineHeight: 20,
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

  // Kalau dibuka dari History dengan sessionId baru, reload sesi tsb
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
    try {
      const result = await sendChatMessage(
        [...session.messages, userMsg],
        { baseUrl: ai.baseUrl, apiKey: ai.apiKey, model: session.model || ai.model },
      );
      const finalMsg: ChatMessage = { ...pendingMsg, content: result.content, pending: false };
      persist({
        ...withUser,
        messages: withUser.messages.map(m => (m.id === pendingMsg.id ? finalMsg : m)),
        updatedAt: Date.now(),
      });
    } catch (e) {
      const msg = e instanceof AiRequestError ? e.message : 'Terjadi kesalahan tak terduga.';
      const errMsg: ChatMessage = { ...pendingMsg, content: msg, pending: false, error: true };
      persist({
        ...withUser,
        messages: withUser.messages.map(m => (m.id === pendingMsg.id ? errMsg : m)),
        updatedAt: Date.now(),
      });
    } finally {
      setSending(false);
    }
  }, [input, sending, session, persist]);

  const handleNewChat = useCallback(() => {
    Haptics.selectionAsync();
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 12,
      }}>
        <View>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '900' }}>{APP_NAME}</Text>
          <Text style={{ color: theme.subtext, fontSize: 11 }} numberOfLines={1}>
            {session.model}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleNewChat}
          style={{
            width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
            backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border,
          }}
        >
          <Ionicons name="add" size={20} color={theme.accent} />
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
          data={session.messages}
          keyExtractor={m => m.id}
          renderItem={({ item }) => <Bubble message={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{
          flexDirection: 'row', alignItems: 'flex-end', gap: 8,
          paddingHorizontal: 16, paddingVertical: 10, paddingBottom: 20,
          borderTopWidth: 1, borderTopColor: theme.border,
        }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Tulis pesan..."
            placeholderTextColor={theme.subtext}
            multiline
            style={{
              flex: 1, maxHeight: 120, color: theme.text, fontSize: 14,
              backgroundColor: theme.card, borderRadius: 16,
              borderWidth: 1, borderColor: theme.border,
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
    </SafeAreaView>
  );
}
