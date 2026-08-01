// ─── AI provider defaults ───────────────────────────────────────────────────
// NaraRouter itu gateway pihak ketiga (bukan produk resmi OpenAI/Anthropic),
// jadi treat sebagai provider "best effort" — sudah ada fallback di hooks/ai.
export const DEFAULT_AI_BASE_URL = 'https://router.bynara.id/v1';
export const DEFAULT_AI_MODEL = 'claude-sonnet-4.5';
export const APP_NAME = 'Nefu AI';

export const AI_MODEL_PRESETS = [
  { id: 'claude-sonnet-4.5', label: 'Claude Sonnet 4.5' },
  { id: 'claude-haiku-4.5', label: 'Claude Haiku 4.5' },
  { id: 'deepseek-3.2', label: 'DeepSeek 3.2' },
  { id: 'auto', label: 'Auto (router memilih)' },
];

export type Theme = {
  id: string;
  name: string;
  bg: string;
  card: string;
  accent: string;
  accentDim: string;
  border: string;
  text: string;
  subtext: string;
  tint: 'dark' | 'light' | 'default';
};

export const THEMES: Theme[] = [
  {
    id: 'lunar',
    name: 'Lunar',
    bg: '#05050a',
    card: '#101018',
    accent: '#3b6fe0',
    accentDim: 'rgba(59,111,224,0.18)',
    border: 'rgba(159,216,255,0.08)',
    text: '#f1f3f9',
    subtext: '#7c8299',
    tint: 'dark',
  },
  {
    id: 'gold',
    name: 'Gold',
    bg: '#0a0a0c',
    card: '#16161a',
    accent: '#F6CF80',
    accentDim: 'rgba(246,207,128,0.2)',
    border: 'rgba(255,255,255,0.05)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
  {
    id: 'sakura',
    name: 'Sakura',
    bg: '#0d0a12',
    card: '#1a1220',
    accent: '#ff6b9d',
    accentDim: 'rgba(255,107,157,0.2)',
    border: 'rgba(255,107,157,0.08)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
  {
    id: 'abyss',
    name: 'Abyss',
    bg: '#050d1a',
    card: '#0d1a2e',
    accent: '#4a9eff',
    accentDim: 'rgba(74,158,255,0.2)',
    border: 'rgba(74,158,255,0.08)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    bg: '#0f0505',
    card: '#1a0a0a',
    accent: '#e63946',
    accentDim: 'rgba(230,57,70,0.2)',
    border: 'rgba(230,57,70,0.08)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    bg: '#050f08',
    card: '#0a1a0f',
    accent: '#2ecc71',
    accentDim: 'rgba(46,204,113,0.2)',
    border: 'rgba(46,204,113,0.08)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
  {
    id: 'violet',
    name: 'Violet',
    bg: '#0a0512',
    card: '#130a1e',
    accent: '#a855f7',
    accentDim: 'rgba(168,85,247,0.2)',
    border: 'rgba(168,85,247,0.08)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bg: '#0f0800',
    card: '#1a1000',
    accent: '#ff8c42',
    accentDim: 'rgba(255,140,66,0.2)',
    border: 'rgba(255,140,66,0.08)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    bg: '#00080f',
    card: '#001525',
    accent: '#00d4ff',
    accentDim: 'rgba(0,212,255,0.2)',
    border: 'rgba(0,212,255,0.08)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    bg: '#0f0a0a',
    card: '#1e1212',
    accent: '#e8a598',
    accentDim: 'rgba(232,165,152,0.2)',
    border: 'rgba(232,165,152,0.08)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
  {
    id: 'mint',
    name: 'Mint',
    bg: '#040f0d',
    card: '#081a16',
    accent: '#00e5c3',
    accentDim: 'rgba(0,229,195,0.2)',
    border: 'rgba(0,229,195,0.08)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
  {
    id: 'pure-white',
    name: 'Pure White',
    bg: '#f5f5f5',
    card: '#ffffff',
    accent: '#333333',
    accentDim: 'rgba(51,51,51,0.15)',
    border: 'rgba(0,0,0,0.08)',
    text: '#111111',
    subtext: 'rgba(0,0,0,0.4)',
    tint: 'light',
  },
  {
    id: 'pure-black',
    name: 'Pure Black',
    bg: '#000000',
    card: '#0a0a0a',
    accent: '#ffffff',
    accentDim: 'rgba(255,255,255,0.15)',
    border: 'rgba(255,255,255,0.05)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.4)',
    tint: 'dark',
  },
];

// Backward compatibility
export const COLORS = {
  bg: '#0a0a0c',
  card: '#16161a',
  gold: '#F6CF80',
  goldDim: 'rgba(246, 207, 128, 0.2)',
  white: '#ffffff',
  whiteDim: 'rgba(255,255,255,0.05)',
  whiteMid: 'rgba(255,255,255,0.1)',
};
