// config/app.ts — konstanta app-wide (nama app, default provider AI, dst)

// NaraRouter itu gateway pihak ketiga (bukan produk resmi OpenAI/Anthropic),
// jadi treat sebagai provider "best effort" — sudah ada fallback di lib/ai/client.ts.
export const DEFAULT_AI_BASE_URL = 'https://router.bynara.id/v1';
export const DEFAULT_AI_MODEL = 'claude-sonnet-4.5';
export const APP_NAME = 'Nefu AI';

export const AI_MODEL_PRESETS = [
  { id: 'claude-sonnet-4.5', label: 'Claude Sonnet 4.5' },
  { id: 'claude-haiku-4.5', label: 'Claude Haiku 4.5' },
  { id: 'deepseek-3.2', label: 'DeepSeek 3.2' },
  { id: 'auto', label: 'Auto (router memilih)' },
];
