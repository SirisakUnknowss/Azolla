import type { Lang } from '../i18n/lang';

/**
 * Design tokens lifted verbatim from the Deeptalk design canvas
 * (Deeptalk.dc.html). Keep hex values in sync with the canvas.
 */

export const color = {
  /** App canvas behind the screens. */
  bg: '#14101b',
  /** Radial backdrop used behind the device in the canvas. */
  bgDeep: '#0d0a12',
  /** Primary reading colour. */
  ink: '#f6efe4',
  /** Accent — every primary action, streak pill and marker. */
  accent: '#ff7a54',
  accentHover: '#ff8f6d',
  accentSoft: '#ffb59d',
  /** Text colour that sits on top of the accent. */
  onAccent: '#231007',
  /** Card face — the question card flips the palette. */
  card: '#f6efe4',
  cardInk: '#1a1420',
  /** Tab bar shell. */
  tabShell: 'rgba(28,22,38,.86)',
  danger: '#ff9db1',
} as const;

/** Translucent inks, mirroring the rgba() literals in the canvas. */
export const ink = {
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
} as const;

/** Surfaces built from white alpha, as in the canvas. */
export const surface = {
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
} as const;

export const accentAlpha = {
  a04: 'rgba(255,122,84,.04)',
  a12: 'rgba(255,122,84,.12)',
  a16: 'rgba(255,122,84,.16)',
  a22: 'rgba(255,122,84,.22)',
  a28: 'rgba(255,122,84,.28)',
  a45: 'rgba(255,122,84,.45)',
  a50: 'rgba(255,122,84,.5)',
  a85: 'rgba(255,122,84,.85)',
} as const;

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
