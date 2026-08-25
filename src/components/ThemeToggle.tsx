import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../i18n';
import { useTheme } from '../theme';
import { radius, THEME_MODES, type Palette, type ThemeMode, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';

/** The Dark | Light segmented pill — the theme twin of `LangToggle`. */
export function ThemeToggle() {
  const { t } = useI18n();
  const { mode, setMode } = useTheme();
  const styles = useStyles(makeStyles);
  const label: Record<ThemeMode, string> = { dark: t.themeDark, light: t.themeLight };

  return (
    <View style={styles.shell}>
      {THEME_MODES.map((id) => {
        const on = id === mode;
        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={t.themeA11y(label[id])}
            hitSlop={6}
            onPress={() => {
              if (on) return;
              tapLight();
              setMode(id);
            }}
            style={[styles.seg, on && styles.segOn]}
          >
            <Text style={[styles.label, on && styles.labelOn]}>{label[id]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (t: Typo, p: Palette) =>
  StyleSheet.create({
    shell: {
      flexDirection: 'row',
      gap: 2,
      padding: 3,
      borderRadius: radius.pill,
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.surface.border,
    },
    seg: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill },
    segOn: { backgroundColor: p.surface.s11 },
    label: { fontFamily: t.font.sansBold, fontSize: 10.5, letterSpacing: 0.9, color: p.ink.a45 },
    labelOn: { color: p.color.ink },
  });
