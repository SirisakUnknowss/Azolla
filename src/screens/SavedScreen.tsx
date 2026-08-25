import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HUES } from '../data/decks';
import { textFor } from '../data/questions';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import { radius, screenPad, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';

export function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { saved, removeSaved } = useStore();
  const { lang, t, content } = useI18n();
  const styles = useStyles(makeStyles);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 108 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{t.keptTitle}</Text>
      <Text style={styles.subtitle}>
        {saved.length === 0 ? t.keptEmptySubtitle : t.keptSubtitle(saved.length)}
      </Text>

      {saved.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t.keptEmpty}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {saved.map((item) => {
            // A question written by the user has no translation to fall back on,
            // so it reads as typed whichever language the app is in.
            const question = textFor(item.key, lang) ?? item.q;
            const rel = content.rel[item.rel] ?? content.rel.Lover;
            return (
              <View key={item.key} style={styles.card}>
                <View style={styles.metaRow}>
                  <View
                    style={[styles.dot, { backgroundColor: (HUES[item.rel] ?? HUES.Lover)[0] }]}
                  />
                  <Text style={styles.meta}>{t.keptMeta(rel, item.depth)}</Text>
                </View>
                <Text style={styles.question}>{question}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t.removeA11y(question)}
                  hitSlop={8}
                  onPress={() => {
                    tapLight();
                    removeSaved(item.key);
                  }}
                >
                  <Text style={styles.remove}>{t.remove}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const makeStyles = (t: Typo, p: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: p.color.bg },
    content: { paddingHorizontal: screenPad },
    title: { fontFamily: t.font.serif, fontSize: 36, lineHeight: t.line(36, 38), color: p.color.ink, marginBottom: 6 },
    subtitle: { fontFamily: t.font.sans, fontSize: 13.5, lineHeight: t.line(13.5, 20), color: p.ink.a45, marginBottom: 24 },
    empty: {
      paddingVertical: 34,
      paddingHorizontal: 20,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: p.surface.dashed,
    },
    emptyText: { fontFamily: t.font.sans, fontSize: 14, lineHeight: t.line(14, 21), color: p.ink.a42, textAlign: 'center' },
    list: { gap: 10 },
    card: {
      paddingVertical: 16,
      paddingHorizontal: 17,
      borderRadius: radius.lg,
      backgroundColor: p.surface.s045,
      borderWidth: 1,
      borderColor: p.surface.border,
    },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
    dot: { width: 7, height: 7, borderRadius: 99 },
    meta: { fontFamily: t.font.sansBold, fontSize: 9.5, letterSpacing: 1.52, color: p.ink.a42 },
    question: { fontFamily: t.font.serif, fontSize: 21, lineHeight: t.line(21, 26), color: p.color.ink },
    remove: { fontFamily: t.font.sansMedium, fontSize: 12, color: p.accentAlpha.a85, marginTop: 10 },
  });
