import type { Lang } from '../i18n/lang';

/** Light or dark chrome — independent of language, switched from Packs → Session. */
export type ThemeMode = 'light' | 'dark';
export const THEME_MODES: readonly ThemeMode[] = ['dark', 'light'];

type ColorTokens = {
  /** App canvas behind the screens. */
  bg: string;
  /** Radial backdrop used behind the device in the canvas. */
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
  /** Card face — the question card flips the palette. Same in both themes:
   *  the card is paper, not chrome. */
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

/**
 * Colour identity sampled from the app icon (assets/icon.png) — a two-tone
 * sprouting leaf mark. Dark keeps the icon's bright mint as an accent on a
 * near-black canvas; light flips to a soft mint canvas, with the leaf's
 * darker green doing the work of legible text and accent fills. `surface`
 * and `ink` invert the same way: white-alpha lightens the dark canvas,
 * dark-alpha dims the light one, at matching alpha steps so a given step
 * reads as the same "amount of emphasis" in either theme.
 */
const DARK: Palette = {
  color: {
    bg: '#0a0e0b',
    bgDeep: '#050705',
    bgFade: 'rgba(10,14,11,0)',
    ink: '#f6efe4',
    accent: '#8fd39a',
    accentHover: '#a6dfb1',
    accentSoft: '#bfe6c7',
    onAccent: '#12271a',
    card: '#f6efe4',
    cardInk: '#12271a',
    tabShell: 'rgba(10,14,11,.86)',
    danger: '#ff9db1',
  },
  ink: {
    a75: 'rgba(246,239,228,.75)',
    a72: 'rgba(246,239,228,.72)',
    a70: 'rgba(246,239,228,.7)',
    a60: 'rgba(246,239,228,.6)',
    a55: 'rgba(246,239,228,.55)',
    a50: 'rgba(246,239,228,.5)',
    a48: 'rgba(246,239,228,.48)',
    a45: 'rgba(246,239,228,.45)',
    a42: 'rgba(246,239,228,.42)',
    a40: 'rgba(246,239,228,.4)',
    a35: 'rgba(246,239,228,.35)',
  },
  surface: {
    s03: 'rgba(255,255,255,.03)',
    s04: 'rgba(255,255,255,.04)',
    s045: 'rgba(255,255,255,.045)',
    s05: 'rgba(255,255,255,.05)',
    s06: 'rgba(255,255,255,.06)',
    s07: 'rgba(255,255,255,.07)',
    s08: 'rgba(255,255,255,.08)',
    s09: 'rgba(255,255,255,.09)',
    s10: 'rgba(255,255,255,.1)',
    s11: 'rgba(255,255,255,.11)',
    border: 'rgba(255,255,255,.08)',
    borderSoft: 'rgba(255,255,255,.09)',
    borderStrong: 'rgba(255,255,255,.12)',
    dashed: 'rgba(255,255,255,.14)',
    dashedStrong: 'rgba(255,255,255,.16)',
    ring: 'rgba(255,255,255,.28)',
  },
  accentAlpha: {
    a04: 'rgba(143,211,154,.04)',
    a12: 'rgba(143,211,154,.12)',
    a16: 'rgba(143,211,154,.16)',
    a22: 'rgba(143,211,154,.22)',
    a28: 'rgba(143,211,154,.28)',
    a45: 'rgba(143,211,154,.45)',
    a50: 'rgba(143,211,154,.5)',
    a85: 'rgba(143,211,154,.85)',
  },
};

const LIGHT: Palette = {
  color: {
    bg: '#f4f7f0',
    bgDeep: '#e8f0e2',
    bgFade: 'rgba(244,247,240,0)',
    ink: '#152a1d',
    accent: '#237a45',
    accentHover: '#1b5f37',
    accentSoft: '#1d6b3e',
    onAccent: '#ffffff',
    card: '#f6efe4',
    cardInk: '#12271a',
    tabShell: 'rgba(244,247,240,.86)',
    danger: '#d6486b',
  },
  ink: {
    a75: 'rgba(21,42,29,.75)',
    a72: 'rgba(21,42,29,.72)',
    a70: 'rgba(21,42,29,.7)',
    a60: 'rgba(21,42,29,.6)',
    a55: 'rgba(21,42,29,.55)',
    a50: 'rgba(21,42,29,.5)',
    a48: 'rgba(21,42,29,.48)',
    a45: 'rgba(21,42,29,.45)',
    a42: 'rgba(21,42,29,.42)',
    a40: 'rgba(21,42,29,.4)',
    a35: 'rgba(21,42,29,.35)',
  },
  surface: {
    s03: 'rgba(21,42,29,.03)',
    s04: 'rgba(21,42,29,.04)',
    s045: 'rgba(21,42,29,.045)',
    s05: 'rgba(21,42,29,.05)',
    s06: 'rgba(21,42,29,.06)',
    s07: 'rgba(21,42,29,.07)',
    s08: 'rgba(21,42,29,.08)',
    s09: 'rgba(21,42,29,.09)',
    s10: 'rgba(21,42,29,.1)',
    s11: 'rgba(21,42,29,.11)',
    border: 'rgba(21,42,29,.08)',
    borderSoft: 'rgba(21,42,29,.09)',
    borderStrong: 'rgba(21,42,29,.12)',
    dashed: 'rgba(21,42,29,.14)',
    dashedStrong: 'rgba(21,42,29,.16)',
    ring: 'rgba(21,42,29,.28)',
  },
  accentAlpha: {
    a04: 'rgba(35,122,69,.04)',
    a12: 'rgba(35,122,69,.12)',
    a16: 'rgba(35,122,69,.16)',
    a22: 'rgba(35,122,69,.22)',
    a28: 'rgba(35,122,69,.28)',
    a45: 'rgba(35,122,69,.45)',
    a50: 'rgba(35,122,69,.5)',
    a85: 'rgba(35,122,69,.85)',
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

/**
 * One face set per language. Instrument Serif and DM Sans carry no Thai
 * glyphs — on Android a custom typeface gets no fallback chain, so Thai set in
 * them renders as empty boxes rather than borrowing the system font. Thai
 * therefore gets its own Noto pair, loaded alongside the Latin one in App.tsx.
 */
export const FONTS: Record<Lang, FontSet> = {
  en: {
    serif: 'InstrumentSerif_400Regular',
    sans: 'DMSans_400Regular',
    sansMedium: 'DMSans_500Medium',
    sansBold: 'DMSans_700Bold',
  },
  th: {
    serif: 'NotoSerifThai_400Regular',
    sans: 'NotoSansThai_400Regular',
    sansMedium: 'NotoSansThai_500Medium',
    sansBold: 'NotoSansThai_700Bold',
  },
};

/**
 * Everything a stylesheet needs to know about the active language.
 *
 * Screens build their styles through `useStyles(makeStyles)` and receive one of
 * these, so a language switch restyles the app without every `Text` having to
 * carry an override.
 */
export type Typo = {
  lang: Lang;
  font: FontSet;
  /**
   * Line height for a given font size. Thai stacks vowels and tone marks above
   * and below the baseline, so the canvas's tight Latin leading clips it; take
   * the roomier of the Latin value and a 1.5 ratio.
   */
  line: (size: number, latin: number) => number;
  /** The `letter-spacing:.18em`-style eyebrow used across every screen. */
  eyebrow: { fontFamily: string; fontSize: number; letterSpacing: number };
  /** Uppercasing is a Latin device — Thai has no case to change. */
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
    line: (size, latin) => (thai ? Math.max(latin, Math.round(size * 1.5)) : latin),
    eyebrow: {
      fontFamily: font.sansBold,
      fontSize: 10.5,
      // Thai clusters break apart when the letters are pushed this far apart.
      letterSpacing: thai ? 0.5 : 1.89,
    },
    upper: (s) => (thai ? s : s.toUpperCase()),
  };
}

export function typo(lang: Lang): Typo {
  return TYPO[lang];
}

export const radius = {
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 22,
  card: 28,
  pill: 999,
} as const;

export const screenPad = 22;
