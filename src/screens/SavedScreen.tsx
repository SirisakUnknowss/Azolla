import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../components/Icon';
import { HUES, REL_IMAGES } from '../data/decks';
import { textFor } from '../data/questions';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import { useTheme } from '../theme';
import { radius, screenPad, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';
import { shareQuestion } from '../util/share';

export function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { saved, removeSaved } = useStore();
  const { lang, t, content } = useI18n();
  const { palette: p } = useTheme();
  const styles = useStyles(makeStyles);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 112 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{t.keptTitle}</Text>
      <Text style={styles.subtitle}>
        {saved.length === 0 ? t.keptEmptySubtitle : t.keptSubtitle(saved.length)}
      </Text>

      {saved.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <Icon name="bookmark" size={24} color={p.color.accent} />
          </View>
          <Text style={styles.emptyText}>{t.keptEmpty}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {saved.map((item) => {
            const question = textFor(item.key, lang) ?? item.q;
            const rel = content.rel[item.rel] ?? content.rel['New friend'];
            const [hue, soft] = HUES[item.rel] ?? HUES['New friend'];
            const img = REL_IMAGES[item.rel] ?? REL_IMAGES['New friend'];
            const isCopied = copiedKey === item.key;
            return (
              <View key={item.key} style={styles.card}>
                <View style={styles.metaRow}>
                  <View style={[styles.relBadge, { backgroundColor: soft }]}>
                    <Image source={img} style={styles.relBadgeImg} resizeMode="cover" />
                    <Text style={[styles.meta, { color: hue }]}>
                      {t.keptMeta(rel, item.depth)}
                    </Text>
                  </View>
                  <View style={styles.rowActions}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={lang === 'th' ? 'แชร์คำถามนี้' : 'Share this question'}
                      hitSlop={8}
                      onPress={async () => {
                        tapLight();
                        const res = await shareQuestion(question, rel);
                        if (res === 'copied') {
                          setCopiedKey(item.key);
                          setTimeout(() => setCopiedKey(null), 1800);
                        }
                      }}
                      style={styles.shareBtn}
                    >
                      <Icon
                        name={isCopied ? 'check' : 'share'}
                        size={11}
                        color={isCopied ? p.color.accent : p.ink.a60}
                      />
                      <Text
                        style={[
                          styles.remove,
                          isCopied && { color: p.color.accent },
                        ]}
                      >
                        {isCopied
                          ? lang === 'th'
                            ? 'คัดลอกแล้ว'
                            : 'Copied'
                          : lang === 'th'
                            ? 'แชร์'
                            : 'Share'}
                      </Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t.removeA11y(question)}
                      hitSlop={8}
                      onPress={() => {
                        tapLight();
                        removeSaved(item.key);
                      }}
                      style={styles.removeBtn}
                    >
                      <Text style={styles.remove}>{t.remove}</Text>
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.question}>{question}</Text>
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
    title: {
      fontFamily: t.font.serif,
      fontWeight: '700',
      fontSize: 28,
      lineHeight: t.line(28, 34),
      color: p.color.ink,
      marginBottom: 6,
    },
    subtitle: {
      fontFamily: t.font.sans,
      fontSize: 13.5,
      lineHeight: t.line(13.5, 20),
      color: p.ink.a55,
      marginBottom: 22,
    },
    empty: {
      paddingVertical: 40,
      paddingHorizontal: 24,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: p.surface.dashedStrong,
      backgroundColor: p.surface.s045,
      alignItems: 'center',
      gap: 12,
    },
    emptyIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: p.accentAlpha.a12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontFamily: t.font.sans,
      fontSize: 14,
      lineHeight: t.line(14, 21),
      color: p.ink.a55,
      textAlign: 'center',
    },
    list: { gap: 11 },
    card: {
      paddingVertical: 16,
      paddingHorizontal: 17,
      borderRadius: radius.lg,
      backgroundColor: p.surface.s045,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      shadowColor: '#000',
      shadowOpacity: 0.03,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      gap: 8,
    },
    rowActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    relBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      paddingVertical: 4,
      paddingLeft: 5,
      paddingRight: 10,
      borderRadius: radius.pill,
    },
    relBadgeImg: {
      width: 20,
      height: 20,
      borderRadius: 99,
    },
    meta: { fontFamily: t.font.sansBold, fontWeight: '700', fontSize: 11 },
    question: {
      fontFamily: t.font.serif,
      fontWeight: '600',
      fontSize: 17,
      lineHeight: t.line(17, 24),
      color: p.color.ink,
    },
    shareBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 9,
      borderRadius: radius.pill,
      backgroundColor: p.surface.s06,
    },
    removeBtn: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: radius.pill,
      backgroundColor: p.surface.s06,
    },
    remove: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 11.5,
      color: p.ink.a55,
    },
  });
