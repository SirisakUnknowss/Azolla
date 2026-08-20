/**
 * The one hook screens use to read the active language.
 *
 * The choice lives in persisted prefs rather than a provider of its own, so it
 * survives a relaunch and rides the same hydration gate as the rest of the
 * store — no flash of English before the stored choice lands.
 */

import { useCallback, useMemo } from 'react';

import { contentFor, type Content } from '../data/decks';
import { useStore } from '../state/store';
import { typo, type Typo } from '../theme/tokens';

import { type Lang } from './lang';
import { STRINGS, type Strings } from './strings';

export type I18n = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Chrome — buttons, titles, accessibility labels. */
  t: Strings;
  /** Questions, relationships, packs, bands. */
  content: Content;
  /** Faces and leading for the active language. */
  typo: Typo;
};

export function useI18n(): I18n {
  const { prefs, setPrefs } = useStore();
  const lang = prefs.lang;

  const setLang = useCallback((next: Lang) => setPrefs({ lang: next }), [setPrefs]);

  return useMemo(
    () => ({
      lang,
      setLang,
      t: STRINGS[lang],
      content: contentFor(lang),
      typo: typo(lang),
    }),
    [lang, setLang],
  );
}

export { LANG_LABEL, LANGS, type Lang } from './lang';
