import { Platform } from 'react-native';

import type { Lang } from '../i18n/lang';

/** Light or dark chrome — independent of language, switched from Header or Packs → App. */
export type ThemeMode = 'light' | 'dark';
export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark'];

type ColorTokens = {
  /** App canvas behind the screens. */
  bg: string;
  /** Outer backdrop behind the phone container on wide screens. */
  bgDeep: string;
  /** `bg`, alpha 0 — the fade-in edge of a scrim gradient over the canvas. */
  bgFade: string;
  /** Primary reading colour. */
  ink: string;
  /** Accent — every primary action, streak pill and marker. */
  accent: string;
  accentHover: string;
  accentSoft: string;
  /** Text colour that sits on top of the accent. */
  onAccent: string;
  /** Question card face. */
  card: string;
  cardInk: string;
  /** Tab bar shell. */
  tabShell: string;
  danger: string;
};

type InkTokens = {
  a75: string;
  a72: string;
  a70: string;
  a60: string;
  a55: string;
  a50: string;
  a48: string;
  a45: string;
  a42: string;
  a40: string;
  a35: string;
};

type SurfaceTokens = {
  s03: string;
  s04: string;
  s045: string;
  s05: string;
  s06: string;
  s07: string;
  s08: string;
  s09: string;
  s10: string;
  s11: string;
  border: string;
  borderSoft: string;
  borderStrong: string;
  dashed: string;
  dashedStrong: string;
  ring: string;
};

type AccentAlphaTokens = {
  a04: string;
  a12: string;
  a16: string;
  a22: string;
  a28: string;
  a45: string;
  a50: string;
  a85: string;
};

export type Palette = {
  color: ColorTokens;
  ink: InkTokens;
  surface: SurfaceTokens;
  accentAlpha: AccentAlphaTokens;
};

const DARK: Palette = {
  color: {
    bg: '#0c110e',
    bgDeep: '#060807',
    bgFade: 'rgba(12,17,14,0)',
    ink: '#f4f6f3',
    accent: '#5cd67d',
    accentHover: '#4bc46c',
    accentSoft: '#9be7af',
    onAccent: '#0b2212',
    card: '#162019',
    cardInk: '#f4f6f3',
    tabShell: 'rgba(18,25,20,.92)',
    danger: '#ff7b93',
  },
  ink: {
    a75: 'rgba(244,246,243,.85)',
    a72: 'rgba(244,246,243,.80)',
    a70: 'rgba(244,246,243,.76)',
    a60: 'rgba(244,246,243,.68)',
    a55: 'rgba(244,246,243,.64)',
    a50: 'rgba(244,246,243,.60)',
    a48: 'rgba(244,246,243,.58)',
    a45: 'rgba(244,246,243,.55)',
    a42: 'rgba(244,246,243,.50)',
    a40: 'rgba(244,246,243,.46)',
    a35: 'rgba(244,246,243,.40)',
  },
  surface: {
    s03: '#131b15',
    s04: '#151e18',
    s045: '#162019',
    s05: 'rgba(255,255,255,.05)',
    s06: 'rgba(255,255,255,.07)',
    s07: 'rgba(255,255,255,.09)',
    s08: 'rgba(255,255,255,.10)',
    s09: 'rgba(92,214,125,.12)',
    s10: 'rgba(255,255,255,.12)',
    s11: 'rgba(255,255,255,.15)',
    border: 'rgba(255,255,255,.09)',
    borderSoft: 'rgba(255,255,255,.11)',
    borderStrong: 'rgba(255,255,255,.16)',
    dashed: 'rgba(255,255,255,.18)',
    dashedStrong: 'rgba(255,255,255,.22)',
    ring: 'rgba(255,255,255,.32)',
  },
  accentAlpha: {
    a04: 'rgba(92,214,125,.05)',
    a12: 'rgba(92,214,125,.14)',
    a16: 'rgba(92,214,125,.18)',
    a22: 'rgba(92,214,125,.24)',
    a28: 'rgba(92,214,125,.32)',
    a45: 'rgba(92,214,125,.48)',
    a50: 'rgba(92,214,125,.55)',
    a85: 'rgba(92,214,125,.90)',
  },
};

const LIGHT: Palette = {
  color: {
    bg: '#f5f7f4',
    bgDeep: '#e7ece5',
    bgFade: 'rgba(245,247,244,0)',
    ink: '#14261c',
    accent: '#1f7a44',
    accentHover: '#186336',
    accentSoft: '#196638',
    onAccent: '#ffffff',
    card: '#ffffff',
    cardInk: '#14261c',
    tabShell: 'rgba(255,255,255,.94)',
    danger: '#d9385a',
  },
  ink: {
    a75: 'rgba(20,38,28,.86)',
    a72: 'rgba(20,38,28,.82)',
    a70: 'rgba(20,38,28,.78)',
    a60: 'rgba(20,38,28,.70)',
    a55: 'rgba(20,38,28,.66)',
    a50: 'rgba(20,38,28,.62)',
    a48: 'rgba(20,38,28,.60)',
    a45: 'rgba(20,38,28,.58)',
    a42: 'rgba(20,38,28,.54)',
    a40: 'rgba(20,38,28,.50)',
    a35: 'rgba(20,38,28,.42)',
  },
  surface: {
    s03: '#ffffff',
    s04: '#ffffff',
    s045: '#ffffff',
    s05: 'rgba(20,38,28,.04)',
    s06: 'rgba(20,38,28,.055)',
    s07: 'rgba(20,38,28,.07)',
    s08: 'rgba(20,38,28,.085)',
    s09: '#eaf5ee',
    s10: 'rgba(20,38,28,.10)',
    s11: 'rgba(20,38,28,.12)',
    border: 'rgba(20,38,28,.09)',
    borderSoft: 'rgba(20,38,28,.10)',
    borderStrong: 'rgba(20,38,28,.15)',
    dashed: 'rgba(20,38,28,.18)',
    dashedStrong: 'rgba(20,38,28,.22)',
    ring: 'rgba(20,38,28,.28)',
  },
  accentAlpha: {
    a04: 'rgba(31,122,68,.04)',
    a12: 'rgba(31,122,68,.11)',
    a16: 'rgba(31,122,68,.15)',
    a22: 'rgba(31,122,68,.20)',
    a28: 'rgba(31,122,68,.28)',
    a45: 'rgba(31,122,68,.45)',
    a50: 'rgba(31,122,68,.55)',
    a85: 'rgba(31,122,68,.90)',
  },
};

export function palette(mode: ThemeMode): Palette {
  return mode === 'light' ? LIGHT : DARK;
}

export type FontSet = {
  serif: string;
  sans: string;
  sansMedium: string;
  sansBold: string;
};

const SYSTEM_FONT =
  Platform.select({
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Thai", Roboto, sans-serif',
    ios: 'System',
    default: 'sans-serif',
  }) ?? 'System';

const SYSTEM_FONT_MEDIUM =
  Platform.select({
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Thai", Roboto, sans-serif',
    ios: 'System',
    default: 'sans-serif-medium',
  }) ?? 'System';

const SYSTEM_FONT_SET: FontSet = {
  serif: SYSTEM_FONT,
  sans: SYSTEM_FONT,
  sansMedium: SYSTEM_FONT_MEDIUM,
  sansBold: SYSTEM_FONT,
};

/**
 * System UI typeface across both languages. Native OS fonts on iOS, Android,
 * and Web include full Latin and Thai glyph coverage out of the box.
 */
export const FONTS: Record<Lang, FontSet> = {
  en: SYSTEM_FONT_SET,
  th: SYSTEM_FONT_SET,
};

export type Typo = {
  lang: Lang;
  font: FontSet;
  line: (size: number, latin: number) => number;
  eyebrow: {
    fontFamily: string;
    fontWeight: '700';
    fontSize: number;
    letterSpacing: number;
  };
  upper: (s: string) => string;
};

const TYPO: Record<Lang, Typo> = {
  en: typoFor('en'),
  th: typoFor('th'),
};

function typoFor(lang: Lang): Typo {
  const font = FONTS[lang];
  const thai = lang === 'th';
  return {
    lang,
    font,
    line: (size, latin) => (thai ? Math.max(latin, Math.round(size * 1.48)) : latin),
    eyebrow: {
      fontFamily: font.sansBold,
      fontWeight: '700',
      fontSize: 11,
      letterSpacing: thai ? 0.3 : 1.1,
    },
    upper: (s) => (thai ? s : s.toUpperCase()),
  };
}

export function typo(lang: Lang): Typo {
  return TYPO[lang];
}

export const radius = {
  sm: 12,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  card: 28,
  pill: 999,
} as const;

export const screenPad = 20;
