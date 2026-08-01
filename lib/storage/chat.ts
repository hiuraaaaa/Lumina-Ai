// hooks/storage/chat.ts — MMKV storage untuk chat sessions & AI settings
import { createMMKV } from 'react-native-mmkv';
import { ChatSession, AiSettings } from '@/types';
import { DEFAULT_AI_BASE_URL, DEFAULT_AI_MODEL } from '@/config/app';

export const storageMain = createMMKV({ id: 'nefuai-main' });

const SESSIONS_KEY = 'chat_sessions';
const AI_SETTINGS_KEY = 'ai_settings';
const MAX_SESSIONS = 100;

const getJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = storageMain.getString(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const setJSON = (key: string, value: unknown): void => {
  try {
    storageMain.set(key, JSON.stringify(value));
  } catch {}
};

// ─── Sessions ─────────────────────────────────────────────────────────────

export const getSessions = (): ChatSession[] => getJSON<ChatSession[]>(SESSIONS_KEY, []);

export const getSession = (id: string): ChatSession | null =>
  getSessions().find(s => s.id === id) ?? null;

export const saveSession = (session: ChatSession): void => {
  const sessions = getSessions();
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  setJSON(SESSIONS_KEY, sessions.slice(0, MAX_SESSIONS));
};

export const deleteSession = (id: string): void => {
  setJSON(SESSIONS_KEY, getSessions().filter(s => s.id !== id));
};

export const clearSessions = (): void => setJSON(SESSIONS_KEY, []);

// ─── AI settings (base URL / API key / model) ──────────────────────────────

export const getAiSettings = (): AiSettings =>
  getJSON<AiSettings>(AI_SETTINGS_KEY, {
    baseUrl: DEFAULT_AI_BASE_URL,
    apiKey: '',
    model: DEFAULT_AI_MODEL,
  });

export const saveAiSettings = (settings: AiSettings): void => setJSON(AI_SETTINGS_KEY, settings);
