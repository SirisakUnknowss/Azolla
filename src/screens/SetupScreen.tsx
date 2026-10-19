import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bandFor, HUES, MODE_IDS, type ModeId, type Relationship } from '../data/decks';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import { useSubscription } from '../subscription';
import { useTheme } from '../theme';
import { radius, screenPad, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';

const MAX_PLAYERS = 6;

type Props = {
  rel: Relationship;
  depth: number;
  mode: ModeId;
  onChangeDepth: (depth: number) => void;
  onChangeMode: (mode: ModeId) => void;
  onBack: () => void;
  onStart: () => void;
  onOpenPaywall: () => void;
};

export function SetupScreen({
  rel,
  depth,
  mode,
  onChangeDepth,
  onChangeMode,
  onBack,
  onStart,
  onOpenPaywall,
}: Props) {
  const insets = useSafeAreaInsets();
  const { players, addPlayer, removePlayer } = useStore();
  const { t, content, typo } = useI18n();
  const { palette: p } = useTheme();
  const { isLevelLocked } = useSubscription();
  const styles = useStyles(makeStyles);
  const [nameDraft, setNameDraft] = useState('');

  const hue = HUES[rel][0];
  const bandLabel = content.bands[bandFor(depth)];
  // "Pass the phone" and "Group table" both deal turns out by name.
  const needsPlayers = mode === 'pass' || mode === 'group';

  const submitName = () => {
    if (!nameDraft.trim()) return;
    addPlayer(nameDraft);
    setNameDraft('');
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 130 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.back}
          onPress={() => {
            tapLight();
            onBack();
          }}
          style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
        >
          <Text style={styles.backGlyph}>←</Text>
        </Pressable>

        <Text style={[styles.relEyebrow, { color: hue }]}>{typo.upper(content.rel[rel])}</Text>
        <Text style={styles.title}>{t.setupTitle}</Text>

        <View style={styles.bars}>
          {Array.from({ length: 10 }, (_, i) => {
            const level = i + 1;
            const locked = isLevelLocked(level);
            return (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={
                  locked ? t.lockedA11y(t.levelOfTen(level)) : t.setDepthA11y(level)
                }
                onPress={() => {
                  tapLight();
                  if (locked) {
                    onOpenPaywall();
                    return;
                  }
                  onChangeDepth(level);
                }}
                style={styles.barHit}
              >
                <View
                  style={[
                    styles.bar,
                    {
                      height: 16 + i * 4,
                      backgroundColor: i < depth ? hue : p.surface.s11,
                    },
                    // A locked level still shows its height, so the dial reads
                    // as a ladder that continues past where you can go.
                    locked && styles.barLocked,
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.depthRow}>
          <Text style={styles.depthLabel}>{bandLabel}</Text>
          <Text style={styles.depthCount}>{t.levelOfTen(depth)}</Text>
        </View>

        <Text style={styles.sectionEyebrow}>{t.howYouArePlaying}</Text>
        <View style={styles.modes}>
          {MODE_IDS.map((id) => {
            const on = id === mode;
            const { name, blurb } = content.modes[id];
            return (
              <Pressable
                key={id}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${name}. ${blurb}`}
                onPress={() => {
                  tapLight();
                  onChangeMode(id);
                }}
                style={[
                  styles.mode,
                  {
                    backgroundColor: on ? p.surface.s09 : p.surface.s03,
                    borderColor: on ? p.accentAlpha.a50 : p.surface.border,
                  },
                ]}
              >
                <View style={[styles.radio, { borderColor: on ? p.color.accent : p.surface.ring }]}>
                  {on && <View style={styles.radioDot} />}
                </View>
                <View style={styles.modeText}>
                  <Text style={styles.modeName}>{name}</Text>
                  <Text style={styles.modeBlurb}>{blurb}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {needsPlayers && (
          <View>
            <Text style={styles.sectionEyebrow}>{t.atTheTable(players.length)}</Text>
            {players.length > 0 && (
              <View style={styles.chips}>
                {players.map((name, i) => (
                  <Pressable
                    key={`${name}-${i}`}
                    accessibilityRole="button"
                    accessibilityLabel={t.removePlayerA11y(name)}
                    onPress={() => {
                      tapLight();
                      removePlayer(i);
                    }}
                    style={styles.chip}
                  >
                    <View
                      style={[
                        styles.chipDot,
                        { backgroundColor: Object.values(HUES)[i % 7][0] },
                      ]}
                    />
                    <Text style={styles.chipName}>{name}</Text>
                    <Text style={styles.chipX}>×</Text>
                  </Pressable>
                ))}
              </View>
            )}
            {players.length === 0 && <Text style={styles.emptyPlayers}>{t.noPlayers}</Text>}
            {players.length < MAX_PLAYERS && (
              <View style={styles.inputRow}>
                <TextInput
                  value={nameDraft}
                  onChangeText={setNameDraft}
                  onSubmitEditing={submitName}
                  placeholder={t.addNamePlaceholder}
                  placeholderTextColor={p.ink.a35}
                  returnKeyType="done"
                  autoCapitalize="words"
                  style={styles.input}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t.addPlayerA11y}
                  onPress={submitName}
                  style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
                >
                  <Text style={styles.addBtnText}>{t.add}</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <LinearGradient
        colors={[p.color.bgFade, p.color.bg, p.color.bg]}
        locations={[0, 0.45, 1]}
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 14 }]}
        pointerEvents="box-none"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.dealFirstCard}
          onPress={() => {
            Keyboard.dismiss();
            tapLight();
            onStart();
          }}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaText}>{t.dealFirstCard}</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const makeStyles = (t: Typo, p: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: p.color.bg },
    content: { paddingHorizontal: screenPad },
    back: {
      width: 38,
      height: 38,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surface.s07,
      marginBottom: 22,
    },
    backPressed: { backgroundColor: p.surface.s11 },
    backGlyph: { fontFamily: t.font.sans, fontSize: 18, color: p.ink.a70 },
    relEyebrow: { ...t.eyebrow, marginBottom: 9 },
    title: { fontFamily: t.font.serif, fontSize: 34, lineHeight: t.line(34, 36), color: p.color.ink, marginBottom: 28 },
    bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 14 },
    barHit: { flex: 1, justifyContent: 'flex-end', paddingVertical: 6 },
    bar: { borderRadius: 6 },
    barLocked: { opacity: 0.35 },
    depthRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 34,
    },
    depthLabel: { fontFamily: t.font.serif, fontSize: 26, color: p.color.ink },
    depthCount: { fontFamily: t.font.sansMedium, fontSize: 13, color: p.ink.a45 },
    sectionEyebrow: { ...t.eyebrow, color: p.ink.a40, marginBottom: 12 },
    modes: { gap: 9, marginBottom: 30 },
    mode: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      paddingVertical: 15,
      paddingHorizontal: 16,
      borderRadius: radius.md,
      borderWidth: 1,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 99,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioDot: { width: 9, height: 9, borderRadius: 99, backgroundColor: p.color.accent },
    modeText: { flex: 1 },
    modeName: { fontFamily: t.font.sansMedium, fontSize: 15, color: p.color.ink },
    modeBlurb: { fontFamily: t.font.sans, fontSize: 11.5, lineHeight: t.line(11.5, 15.5), color: p.ink.a45, marginTop: 2 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 9,
      paddingHorizontal: 13,
      borderRadius: radius.pill,
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.surface.s10,
    },
    chipDot: { width: 8, height: 8, borderRadius: 99 },
    chipName: { fontFamily: t.font.sansMedium, fontSize: 13, color: p.color.ink },
    chipX: { fontFamily: t.font.sans, fontSize: 13, color: p.ink.a35 },
    emptyPlayers: { fontFamily: t.font.sans, fontSize: 13, lineHeight: t.line(13, 19), color: p.ink.a42, marginBottom: 12 },
    inputRow: { flexDirection: 'row', gap: 8 },
    input: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      backgroundColor: p.surface.s04,
      color: p.color.ink,
      fontFamily: t.font.sans,
      fontSize: 14,
    },
    addBtn: {
      paddingHorizontal: 17,
      justifyContent: 'center',
      borderRadius: radius.sm,
      backgroundColor: p.surface.s10,
    },
    addBtnPressed: { backgroundColor: p.surface.s07 },
    addBtnText: { fontFamily: t.font.sansMedium, fontSize: 14, color: p.color.ink },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: 26,
      paddingHorizontal: screenPad,
    },
    cta: {
      paddingVertical: 17,
      borderRadius: radius.lg,
      backgroundColor: p.color.accent,
      alignItems: 'center',
    },
    ctaPressed: { backgroundColor: p.color.accentHover },
    ctaText: { fontFamily: t.font.sansMedium, fontSize: 16, color: p.color.onAccent },
  });
