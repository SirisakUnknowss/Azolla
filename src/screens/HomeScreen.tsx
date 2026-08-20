import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LangToggle } from '../components/LangToggle';
import { HUES, RELATIONSHIPS, type Relationship } from '../data/decks';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import {
  accentAlpha,
  color,
  ink,
  radius,
  screenPad,
  surface,
  type Typo,
} from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { dailyQuestion } from '../util/daily';
import { tapLight } from '../util/haptics';

type Props = {
  onPickRelationship: (rel: Relationship) => void;
  onStartDaily: (question: string) => void;
};

export function HomeScreen({ onPickRelationship, onStartDaily }: Props) {
  const insets = useSafeAreaInsets();
  const { streak } = useStore();
  const { t, content } = useI18n();
  const styles = useStyles(makeStyles);
  const daily = useMemo(() => dailyQuestion(content.daily), [content]);

  const streakLabel = streak.count === 0 ? t.startStreak : t.streakDays(streak.count);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 108 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.wordmark}>DEEPTALK</Text>
        <View style={styles.headerRight}>
          <LangToggle />
          <View style={styles.streakPill}>
            <View style={styles.streakDot} />
            <Text style={styles.streakText}>{streakLabel}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>{t.homeTitle}</Text>
      <Text style={styles.subtitle}>{t.homeSubtitle}</Text>

      <View style={styles.grid}>
        {RELATIONSHIPS.map((id) => {
          const [hue, soft] = HUES[id];
          const name = content.rel[id];
          const blurb = content.blurb[id];
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={`${name}. ${blurb}`}
              onPress={() => {
                tapLight();
                onPickRelationship(id);
              }}
              style={({ pressed }) => [styles.relCard, pressed && styles.relCardPressed]}
            >
              <View style={[styles.relIcon, { backgroundColor: soft }]}>
                <View style={[styles.relIconDot, { backgroundColor: hue }]} />
              </View>
              <View>
                <Text style={styles.relName}>{name}</Text>
                <Text style={styles.relBlurb}>{blurb}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <LinearGradient
        colors={[accentAlpha.a16, accentAlpha.a04]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.daily}
      >
        <Text style={styles.dailyEyebrow}>{t.dailyEyebrow}</Text>
        <Text style={styles.dailyQuestion}>{daily}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.dailyCtaA11y}
          onPress={() => {
            tapLight();
            onStartDaily(daily);
          }}
          style={({ pressed }) => [styles.dailyCta, pressed && styles.dailyCtaPressed]}
        >
          <Text style={styles.dailyCtaText}>{t.dailyCta}</Text>
        </Pressable>
      </LinearGradient>
    </ScrollView>
  );
}

const makeStyles = (t: Typo) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: color.bg },
    content: { paddingHorizontal: screenPad },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 26,
    },
    wordmark: { fontFamily: t.font.sansBold, fontSize: 12, letterSpacing: 2.64, color: color.accent },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    streakPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 11,
      borderRadius: radius.pill,
      backgroundColor: accentAlpha.a12,
      borderWidth: 1,
      borderColor: accentAlpha.a28,
    },
    streakDot: { width: 6, height: 6, borderRadius: 99, backgroundColor: color.accent },
    streakText: { fontFamily: t.font.sansMedium, fontSize: 12, color: color.accentSoft },
    title: {
      fontFamily: t.font.serif,
      fontSize: 40,
      lineHeight: t.line(40, 41),
      color: color.ink,
      marginBottom: 8,
    },
    subtitle: { fontFamily: t.font.sans, fontSize: 14, lineHeight: t.line(14, 21), color: ink.a50, marginBottom: 26 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
    relCard: {
      flexGrow: 1,
      flexBasis: '46%',
      minHeight: 104,
      borderRadius: radius.xl,
      padding: 14,
      justifyContent: 'space-between',
      backgroundColor: surface.s045,
      borderWidth: 1,
      borderColor: surface.border,
    },
    relCardPressed: { backgroundColor: surface.s09 },
    relIcon: { width: 26, height: 26, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    relIconDot: { width: 9, height: 9, borderRadius: 99 },
    relName: { fontFamily: t.font.sansMedium, fontSize: 16, color: color.ink, marginBottom: 3 },
    relBlurb: { fontFamily: t.font.sans, fontSize: 11.5, lineHeight: t.line(11.5, 15.5), color: ink.a45 },
    daily: {
      marginTop: 22,
      borderRadius: radius.xxl,
      padding: 18,
      borderWidth: 1,
      borderColor: accentAlpha.a22,
    },
    dailyEyebrow: { ...t.eyebrow, color: color.accentSoft, marginBottom: 10 },
    dailyQuestion: {
      fontFamily: t.font.serif,
      fontSize: 24,
      lineHeight: t.line(24, 29),
      color: color.ink,
      marginBottom: 14,
    },
    dailyCta: {
      alignSelf: 'flex-start',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: radius.pill,
      backgroundColor: color.accent,
    },
    dailyCtaPressed: { backgroundColor: color.accentHover },
    dailyCtaText: { fontFamily: t.font.sansMedium, fontSize: 13.5, color: color.onAccent },
  });
