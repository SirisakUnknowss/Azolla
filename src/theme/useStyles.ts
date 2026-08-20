import { useMemo } from 'react';

import { useI18n } from '../i18n';

import { typo, type Typo } from './tokens';

/**
 * Build a screen's stylesheet for the active language.
 *
 * Font family and leading are the only things that move, so the sheet is
 * rebuilt only when the language does — a `StyleSheet.create` per language, not
 * per render.
 */
export function useStyles<T>(make: (t: Typo) => T): T {
  const { lang } = useI18n();
  return useMemo(() => make(typo(lang)), [make, lang]);
}
