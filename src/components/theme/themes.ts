import type { ThemeConfig, ThemeType } from '../../../shared/types';

export const themes: Record<ThemeType, ThemeConfig> = {
  physics: {
    name: 'physics',
    displayName: '物理主题',
    colors: {
      background: '#0F172A',
      surface: '#1E293B',
      accent: '#3B82F6',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      border: '#475569',
      grid: 'rgba(71, 85, 105, 0.2)',
    },
    fonts: {
      title: "'Noto Serif SC', 'Songti SC', serif",
      body: "'Noto Sans SC', -apple-system, sans-serif",
      data: "'JetBrains Mono', 'SF Mono', monospace",
    },
  },
  biology: {
    name: 'biology',
    displayName: '生物主题',
    colors: {
      background: '#F7F3E9',
      surface: '#FEFDFB',
      accent: '#22C55E',
      text: '#14532D',
      textSecondary: '#166534',
      border: '#86EFAC',
      grid: 'rgba(134, 239, 172, 0.3)',
    },
    fonts: {
      title: "'Noto Serif SC', 'Songti SC', serif",
      body: "'Noto Sans SC', -apple-system, sans-serif",
      data: "'JetBrains Mono', 'SF Mono', monospace",
    },
  },
};

export const applyTheme = (theme: ThemeType): void => {
  const config = themes[theme];
  const root = document.documentElement;
  
  Object.entries(config.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
  
  Object.entries(config.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });
};

export const getThemeColors = (theme: ThemeType) => themes[theme].colors;
export const getThemeFonts = (theme: ThemeType) => themes[theme].fonts;
