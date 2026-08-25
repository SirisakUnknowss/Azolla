import { useMemo } from 'react';

import { useI18n } from '../i18n';

import { useTheme } from './index';
import { typo, type Palette, type Typo } from './tokens';

/**
 * Build a screen's stylesheet for the active language and theme.
 *
 * Font family, leading and every colour are the only things that move, so the
 * sheet is rebuilt only when one of those does — a `StyleSheet.create` per
 * language/theme pair, not per render.
 */
export function useStyles<T>(make: (t: Typo, p: Palette) => T): T {
  const { lang } = useI18n();
  const { mode, palette } = useTheme();
  return useMemo(() => make(typo(lang), palette), [make, lang, mode, palette]);
}
