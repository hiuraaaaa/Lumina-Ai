# Nefu AI

Expo app buat chat AI, base project di-derive dari struktur UI NefuSoft
(tema, tab bar, storage pattern) tapi semua bagian scraper/streaming anime
sudah dihapus total.

## Fitur
- Chat dengan provider AI apa pun yang OpenAI-compatible (default: NaraRouter)
- Riwayat percakapan tersimpan lokal (MMKV)
- Ganti base URL / API key / model langsung dari tab **Settings**
- Fallback otomatis ke provider cadangan kalau provider utama gagal/token habis
  (opsional, isi lewat kode di `hooks/ai/client.ts` kalau mau dipakai)
- 12 tema warna siap pakai

## Setup

```bash
npm install
npx expo start
```

Lalu buka tab **Settings**, isi:
- **Base URL** — endpoint OpenAI-compatible providermu (contoh: `https://router.bynara.id/v1`)
- **API Key**
- **Model** — pilih preset atau ketik manual

## Catatan soal NaraRouter
NaraRouter itu gateway pihak ketiga (bukan produk resmi OpenAI/Anthropic).
Untuk pemakaian serius/production, pertimbangkan:
- Simpan fallback provider resmi di Settings kalau NaraRouter down
- Jangan hardcode API key di kode — biarkan user isi sendiri lewat Settings
- Cek ulang ToS/kebijakan pembayaran mereka sebelum top-up

## Arsitektur

```
app/                          Routing doang (Expo Router) — thin re-export,
                               semua logic ada di features/. Kalau nambah
                               layar baru: bikin file di features/<nama>/screens/,
                               lalu re-export 1 baris di sini.

features/
  chat/screens/ChatScreen.tsx      Layar Chat
  history/screens/HistoryScreen.tsx Riwayat percakapan
  settings/
    screens/SettingsScreen.tsx      Settings (provider AI + tema)
    components/ThemePickerModal.tsx Modal pemilih tema (khusus settings)

lib/                           Infrastruktur — dipakai lintas fitur
  ai/client.ts                 Client AI OpenAI-compatible + fallback + streaming
  storage/chat.ts              Persistence (MMKV): sesi chat & AI settings
  theme/theme.ts               State/hook tema aktif
  theme/themes.ts              Definisi palet warna (12 tema)

components/ui/                 Design system generik (dipakai fitur mana pun)
  shared.tsx                   Card, SectionLabel, SettingRow
  Skeleton.tsx, OfflinePage.tsx, MaintenancePage.tsx, DebugOverlay.tsx

config/app.ts                  Konstanta app-wide (nama app, default provider AI)
types/index.ts                 Kontrak data (ChatMessage, ChatSession, AiSettings)
```

**Prinsip:** `app/` gak boleh isi logic, cuma nunjuk ke `features/`. Tiap fitur
self-contained (screen + component + hook miliknya sendiri). Kalau sesuatu
dipakai di 2+ fitur, naikkan ke `components/ui/` atau `lib/`. Ini bikin nambah
fitur baru gak nyenggol kode fitur lain, dan gampang di-trace kalau ada error.

**Cara nambah fitur baru** (misal "image gen"):
1. `features/image-gen/screens/ImageGenScreen.tsx`
2. `app/image-gen.tsx` → `export { default } from '@/features/image-gen/screens/ImageGenScreen';`
3. Kalau butuh state/logic sendiri → `features/image-gen/hooks/useImageGen.ts`
4. Kalau butuh API call baru → tambah di `lib/ai/client.ts` atau bikin `lib/ai/image.ts`


