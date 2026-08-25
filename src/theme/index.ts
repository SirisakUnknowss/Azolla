/**
 * The one hook screens use to read the active theme.
 *
 * Mirrors `useI18n`: the choice lives in persisted prefs rather than a
 * provider of its own, so it survives a relaunch and rides the same
 * hydration gate as the rest of the store.
 */

import { useCallback, useMemo } from 'react';

import { useStore } from '../state/store';

import { palette, type Palette, type ThemeMode } from './tokens';

export type Theme = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  palette: Palette;
};

export function useTheme(): Theme {
  const { prefs, setPrefs } = useStore();
  const mode = prefs.themeMode;

  const setMode = useCallback((next: ThemeMode) => setPrefs({ themeMode: next }), [setPrefs]);

  return useMemo(() => ({ mode, setMode, palette: palette(mode) }), [mode, setMode]);
}

export { THEME_MODES, type Palette, type ThemeMode } from './tokens';
