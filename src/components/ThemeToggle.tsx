import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../i18n';
import { useTheme } from '../theme';
import { radius, THEME_MODES, type Palette, type ThemeMode, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';

import { Icon } from './Icon';

/** Crisp iOS-style Light | Dark segmented control with Lucide Sun & Moon icons. */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const { mode, setMode, palette: p } = useTheme();
  const styles = useStyles(makeStyles);
  const label: Record<ThemeMode, string> = { dark: t.themeDark, light: t.themeLight };

  return (
    <View style={styles.shell}>
      {THEME_MODES.map((id) => {
        const on = id === mode;
        const iconColor = on ? p.color.accent : p.ink.a50;
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
            style={[
              styles.seg,
              compact && styles.segCompact,
              on && styles.segOn,
            ]}
          >
            <Icon
              name={id === 'light' ? 'sun' : 'moon'}
              size={15}
              color={iconColor}
              strokeWidth={on ? 2.25 : 1.9}
            />
            {!compact && (
              <Text style={[styles.label, on && styles.labelOn]}>{label[id]}</Text>
            )}
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
      alignItems: 'center',
      gap: 2,
      padding: 3,
      borderRadius: radius.pill,
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.surface.border,
    },
    seg: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 11,
      borderRadius: radius.pill,
    },
    segCompact: {
      paddingVertical: 6,
      paddingHorizontal: 9,
    },
    segOn: {
      backgroundColor: p.color.card,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
    label: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 12,
      color: p.ink.a50,
    },
    labelOn: {
      color: p.color.ink,
      fontWeight: '700',
    },
  });
