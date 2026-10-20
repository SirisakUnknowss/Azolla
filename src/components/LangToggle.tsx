import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LANG_LABEL, LANGS, useI18n } from '../i18n';
import { radius, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';

/** Crisp iOS-style TH | EN segmented pill. */
export function LangToggle() {
  const { lang, setLang, t } = useI18n();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.shell}>
      {LANGS.map((id) => {
        const on = id === lang;
        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={t.languageA11y(LANG_LABEL[id])}
            hitSlop={6}
            onPress={() => {
              if (on) return;
              tapLight();
              setLang(id);
            }}
            style={[styles.seg, on && styles.segOn]}
          >
            <Text style={[styles.label, on && styles.labelOn]}>{LANG_LABEL[id]}</Text>
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
      paddingVertical: 5,
      paddingHorizontal: 11,
      borderRadius: radius.pill,
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
      fontSize: 11.5,
      letterSpacing: 0.5,
      color: p.ink.a50,
    },
    labelOn: {
      color: p.color.accent,
      fontWeight: '700',
    },
  });
