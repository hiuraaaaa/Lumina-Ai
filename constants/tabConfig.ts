// constants/tabConfig.ts
// TABS & TabConfig sekarang ada di _layout.tsx (pakai LucideIcon type langsung)
// File ini hanya menyimpan konstanta animasi yang dipakai useTabAnimation hook

export const SPRING_CONFIG = {
  ICON:  { damping: 12, stiffness: 180 } as const,
  LABEL: { damping: 16, stiffness: 220 } as const,
} as const;

export const TIMING_CONFIG = {
  LABEL_OPACITY: 200,
  PILL_OPACITY:  200,
} as const;

// Re-export TAB_BAR untuk kompatibilitas jika dipakai di file lain
export const TAB_BAR = {
  FLOAT_MARGIN:  16,
  HEIGHT:        62,
  BORDER_RADIUS: 36,
  PILL_RADIUS:   2,
  PILL_WIDTH:    18,
  PILL_HEIGHT:   2.5,
} as const;
