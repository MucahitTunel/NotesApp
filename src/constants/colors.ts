export const COLORS = {
  // Ana Renkler
  PRIMARY: '#2C3E50',
  SECONDARY: '#34495E',
  WHITE: '#FFFFFF',
  BLACK: '#000000',

  // Gri Tonları
  GRAY_LIGHT: '#F5F5F5',
  GRAY_MEDIUM: '#EEEEEE',
  GRAY_DARK: '#666666',
  GRAY_DARKER: '#333333',

  // Önem Seviyeleri (Kırmızı Tonları)
  IMPORTANCE: {
    LEVEL_1: '#FFCDD2', // Çok açık kırmızı
    LEVEL_2: '#EF9A9A', // Açık kırmızı
    LEVEL_3: '#E57373', // Orta kırmızı
    LEVEL_4: '#EF5350', // Koyu kırmızı
    LEVEL_5: '#E53935', // Çok koyu kırmızı
    INACTIVE: '#E0E0E0', // Seçili olmayan
  },

  // Durum Renkleri
  STATUS: {
    SUCCESS: '#4CAF50',
    ERROR: '#F44336',
    WARNING: '#FFC107',
    INFO: '#2196F3',
  },

  // Gölge
  SHADOW: {
    COLOR: '#000000',
    OPACITY: 0.1,
  },
} as const; 