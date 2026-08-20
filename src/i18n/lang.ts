/** The two languages the app ships in. */
export type Lang = 'en' | 'th';

export const LANGS: readonly Lang[] = ['en', 'th'];

/** What the toggle shows for each language. */
export const LANG_LABEL: Record<Lang, string> = { en: 'EN', th: 'TH' };

/**
 * The language to open with on a fresh install. Hermes ships Intl on both
 * platforms, but the lookup is wrapped anyway — a missing locale should fall
 * back to English rather than throw on the first render.
 */
export function deviceLang(): Lang {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale.toLowerCase().startsWith('th') ? 'th' : 'en';
  } catch {
    return 'en';
  }
}
