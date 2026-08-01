import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES, Theme } from '@/constants';

const THEME_KEY = 'nefusoft_theme';

let globalTheme: Theme = THEMES[0];
let listeners: ((t: Theme) => void)[] = [];

const notifyListeners = (t: Theme) => listeners.forEach(fn => fn(t));

export const setGlobalTheme = (themeId: string): void => {
  const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0];
  globalTheme = theme;
  AsyncStorage.setItem(THEME_KEY, themeId).catch(() => {});
  notifyListeners(theme);
};

export const loadSavedTheme = (): void => {
  AsyncStorage.getItem(THEME_KEY).then(saved => {
    if (saved) {
      const theme = THEMES.find(t => t.id === saved) ?? THEMES[0];
      globalTheme = theme;
      notifyListeners(theme);
    }
  }).catch(() => {});
};

export const useTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>(globalTheme);

  useEffect(() => {
    listeners.push(setTheme);
    setTheme(globalTheme);
    return () => {
      listeners = listeners.filter(fn => fn !== setTheme);
    };
  }, []);

  return theme;
};
