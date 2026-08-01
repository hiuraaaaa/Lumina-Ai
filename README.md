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

## Struktur penting
```
app/(tabs)/index.tsx      Layar Chat
app/(tabs)/history.tsx    Riwayat percakapan
app/(tabs)/profile.tsx    Settings (provider AI + tema)
hooks/ai/client.ts        Client OpenAI-compatible + fallback
hooks/storage/chat.ts     Storage sesi chat & settings AI (MMKV)
hooks/theme.ts            Sistem tema (dipertahankan dari base lama)
```
