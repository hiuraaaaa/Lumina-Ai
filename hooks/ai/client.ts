// hooks/ai/client.ts — Client generik buat provider AI yang OpenAI-compatible
// (NaraRouter, OpenRouter, atau endpoint resmi OpenAI/Anthropic-compatible lain).
//
// Didesain biar gampang ganti provider: tinggal ubah baseUrl + apiKey + model
// di Settings, gak perlu ubah kode. Ada fallback opsional kalau provider
// utama gagal (misal token abis / provider lagi down).

import { ChatMessage, AiSettings } from '@/types';

export class AiRequestError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

interface CompletionResult {
  content: string;
  usedFallback: boolean;
}

const toApiMessages = (messages: ChatMessage[]) =>
  messages
    .filter(m => !m.pending)
    .map(m => ({ role: m.role, content: m.content }));

/** Satu kali request ke satu provider. Melempar AiRequestError kalau gagal. */
async function requestCompletion(
  settings: AiSettings,
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<string> {
  if (!settings.baseUrl) throw new AiRequestError('Base URL provider belum diisi.');
  if (!settings.apiKey) throw new AiRequestError('API key belum diisi.');

  const url = `${settings.baseUrl.replace(/\/+$/, '')}/chat/completions`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: toApiMessages(messages),
      }),
      signal,
    });
  } catch (e: any) {
    throw new AiRequestError(`Gagal terhubung ke provider: ${e?.message ?? 'network error'}`);
  }

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.error?.message ?? body?.message ?? '';
    } catch {}

    // Klasifikasi error umum biar pesannya jelas ke user
    if (res.status === 401 || res.status === 403) {
      throw new AiRequestError(detail || 'API key salah atau ditolak.', res.status);
    }
    if (res.status === 429) {
      throw new AiRequestError(detail || 'Token/kuota habis atau rate limit tercapai.', res.status);
    }
    if (res.status >= 500) {
      throw new AiRequestError(detail || 'Server provider sedang bermasalah.', res.status);
    }
    throw new AiRequestError(detail || `Request gagal (HTTP ${res.status}).`, res.status);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new AiRequestError('Provider mengembalikan response kosong.');
  }
  return content;
}

/**
 * Kirim pesan ke provider utama. Kalau gagal DAN fallback tersedia
 * (baseUrl + apiKey keduanya terisi), otomatis coba fallback sekali.
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  primary: AiSettings,
  fallback?: AiSettings | null,
  signal?: AbortSignal,
): Promise<CompletionResult> {
  try {
    const content = await requestCompletion(primary, messages, signal);
    return { content, usedFallback: false };
  } catch (primaryError) {
    if (fallback?.baseUrl && fallback?.apiKey) {
      const content = await requestCompletion(fallback, messages, signal);
      return { content, usedFallback: true };
    }
    throw primaryError;
  }
}
