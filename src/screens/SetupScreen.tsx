import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../components/Icon';
import {
  bandFor,
  HUES,
  MODE_ICONS,
  MODE_IDS,
  REL_IMAGES,
  type BandId,
  type ModeId,
  type Relationship,
} from '../data/decks';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import { useSubscription } from '../subscription';
import { useTheme } from '../theme';
import { radius, screenPad, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';

const MAX_PLAYERS = 6;

const BAND_PRESETS: readonly { id: BandId; range: string; defaultLevel: number }[] = [
  { id: 'warm', range: '1–3', defaultLevel: 2 },
  { id: 'real', range: '4–6', defaultLevel: 5 },
  { id: 'honest', range: '7–8', defaultLevel: 7 },
  { id: 'final', range: '9–10', defaultLevel: 10 },
];

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
  const { t, content } = useI18n();
  const { palette: p } = useTheme();
  const { isLevelLocked } = useSubscription();
  const styles = useStyles(makeStyles);
  const [nameDraft, setNameDraft] = useState('');

  const [hue, soft] = HUES[rel];
  const relImg = REL_IMAGES[rel];
  const activeBand = bandFor(depth);
  const bandLabel = content.bands[activeBand];
  const needsPlayers = mode === 'pass' || mode === 'group';
  const checkLevelLocked = (lvl: number) => isLevelLocked(lvl);

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
        <View style={styles.topRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.back}
            onPress={() => {
              tapLight();
              onBack();
            }}
            style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
          >
            <Icon name="arrow-left" size={16} color={p.ink.a75} />
            <Text style={styles.backGlyph}>{t.back}</Text>
          </Pressable>

          <View style={[styles.relBadge, { backgroundColor: soft }]}>
            <Image source={relImg} style={styles.relBadgeImg} resizeMode="cover" />
            <Text style={[styles.relBadgeText, { color: hue }]}>{content.rel[rel]}</Text>
          </View>
        </View>

        <Text style={styles.title}>{t.setupTitle}</Text>
        <Text style={styles.subtitle}>{t.setupSubtitle}</Text>

        <View style={styles.depthCard}>
          <View style={styles.depthHeader}>
            <View>
              <Text style={[styles.depthBandTitle, { color: hue }]}>{bandLabel}</Text>
              <Text style={styles.depthSub}>{t.cardsInDeck(50)}</Text>
            </View>
            <View style={[styles.levelPill, { backgroundColor: soft }]}>
              <Text style={[styles.levelPillText, { color: hue }]}>{t.levelOfTen(depth)}</Text>
            </View>
          </View>

          <View style={styles.bandPillsRow}>
            {BAND_PRESETS.map((b) => {
              const on = activeBand === b.id;
              const locked = checkLevelLocked(b.defaultLevel);
              return (
                <Pressable
                  key={b.id}
                  accessibilityRole="button"
                  onPress={() => {
                    tapLight();
                    if (locked) {
                      onOpenPaywall();
                      return;
                    }
                    onChangeDepth(b.defaultLevel);
                  }}
                  style={[
                    styles.bandPill,
                    on && { backgroundColor: soft, borderColor: hue },
                  ]}
                >
                  <View style={styles.bandPillTop}>
                    <Text style={[styles.bandPillRange, on && { color: hue }]}>{b.range}</Text>
                    {locked && <Icon name="lock" size={13} color={p.ink.a45} />}
                  </View>
                  <Text
                    style={[styles.bandPillLabel, on && { color: p.color.ink, fontWeight: '700' }]}
                    numberOfLines={1}
                  >
                    {content.bands[b.id]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.levelGrid}>
            {Array.from({ length: 10 }, (_, i) => {
              const level = i + 1;
              const selected = level === depth;
              const inRange = level <= depth;
              const locked = checkLevelLocked(level);
              return (
                <Pressable
                  key={level}
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
                  style={[
                    styles.levelBtn,
                    inRange && { backgroundColor: soft, borderColor: hue },
                    selected && { backgroundColor: hue, borderColor: hue },
                    locked && styles.levelBtnLocked,
                  ]}
                >
                  <Text
                    style={[
                      styles.levelBtnNum,
                      inRange && { color: hue },
                      selected && { color: '#fff', fontWeight: '700' },
                    ]}
                  >
                    {level}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionEyebrow}>{t.howYouArePlaying}</Text>
        <View style={styles.modes}>
          {MODE_IDS.map((id) => {
            const on = id === mode;
            const { name, blurb } = content.modes[id];
            const icon = MODE_ICONS[id];
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
                    backgroundColor: on ? p.surface.s09 : p.surface.s045,
                    borderColor: on ? p.color.accent : p.surface.borderStrong,
                  },
                ]}
              >
                <View style={[styles.modeIconWrap, on && { backgroundColor: p.accentAlpha.a16 }]}>
                  <Icon name={icon} size={18} color={on ? p.color.accent : p.ink.a60} />
                </View>
                <View style={styles.modeText}>
                  <Text style={styles.modeName}>{name}</Text>
                  <Text style={styles.modeBlurb}>{blurb}</Text>
                </View>
                <View style={[styles.radio, { borderColor: on ? p.color.accent : p.surface.ring }]}>
                  {on && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {needsPlayers && (
          <View style={styles.playersCard}>
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
                    <Icon name="close" size={13} color={p.ink.a50} />
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
                  placeholderTextColor={p.ink.a40}
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
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18,
    },
    back: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: radius.pill,
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.surface.border,
    },
    backPressed: { backgroundColor: p.surface.s10 },
    backGlyph: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 13.5, color: p.ink.a75 },
    relBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 5,
      paddingLeft: 6,
      paddingRight: 12,
      borderRadius: radius.pill,
    },
    relBadgeImg: {
      width: 24,
      height: 24,
      borderRadius: 99,
    },
    relBadgeText: { fontFamily: t.font.sansBold, fontWeight: '700', fontSize: 13 },
    title: {
      fontFamily: t.font.serif,
      fontWeight: '700',
      fontSize: 26,
      lineHeight: t.line(26, 32),
      color: p.color.ink,
      marginBottom: 4,
    },
    subtitle: {
      fontFamily: t.font.sans,
      fontSize: 13.5,
      lineHeight: t.line(13.5, 19),
      color: p.ink.a55,
      marginBottom: 18,
    },
    depthCard: {
      padding: 16,
      borderRadius: radius.xl,
      backgroundColor: p.surface.s045,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      marginBottom: 24,
    },
    depthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    depthBandTitle: {
      fontFamily: t.font.serif,
      fontWeight: '700',
      fontSize: 20,
    },
    depthSub: {
      fontFamily: t.font.sans,
      fontSize: 12,
      color: p.ink.a50,
      marginTop: 2,
    },
    levelPill: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: radius.pill,
    },
    levelPillText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 12.5,
    },
    bandPillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 14,
    },
    bandPill: {
      flexGrow: 1,
      flexBasis: '22%',
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: radius.sm,
      backgroundColor: p.surface.s05,
      borderWidth: 1,
      borderColor: p.surface.border,
      alignItems: 'center',
    },
    bandPillTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 2,
    },
    bandPillRange: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 11,
      color: p.ink.a50,
    },
    bandPillLabel: {
      fontFamily: t.font.sansMedium,
      fontWeight: '500',
      fontSize: 11,
      color: p.ink.a70,
    },
    levelGrid: {
      flexDirection: 'row',
      gap: 5,
    },
    levelBtn: {
      flex: 1,
      height: 38,
      borderRadius: 10,
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.surface.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    levelBtnLocked: {
      opacity: 0.45,
    },
    levelBtnNum: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 13,
      color: p.ink.a70,
    },
    sectionEyebrow: { ...t.eyebrow, color: p.ink.a50, marginBottom: 10 },
    modes: { gap: 10, marginBottom: 24 },
    mode: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
      paddingHorizontal: 15,
      borderRadius: radius.lg,
      borderWidth: 1.5,
    },
    modeIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: p.surface.s06,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modeText: { flex: 1 },
    modeName: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 15, color: p.color.ink },
    modeBlurb: {
      fontFamily: t.font.sans,
      fontSize: 12,
      lineHeight: t.line(12, 16),
      color: p.ink.a55,
      marginTop: 2,
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 99,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioDot: { width: 10, height: 10, borderRadius: 99, backgroundColor: p.color.accent },
    playersCard: {
      padding: 16,
      borderRadius: radius.xl,
      backgroundColor: p.surface.s045,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: radius.pill,
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
    },
    chipDot: { width: 8, height: 8, borderRadius: 99 },
    chipName: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 13, color: p.color.ink },
    emptyPlayers: {
      fontFamily: t.font.sans,
      fontSize: 12.5,
      lineHeight: t.line(12.5, 18),
      color: p.ink.a55,
      marginBottom: 12,
    },
    inputRow: { flexDirection: 'row', gap: 8 },
    input: {
      flex: 1,
      paddingVertical: 11,
      paddingHorizontal: 14,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      backgroundColor: p.surface.s05,
      color: p.color.ink,
      fontFamily: t.font.sans,
      fontSize: 14,
    },
    addBtn: {
      paddingHorizontal: 16,
      justifyContent: 'center',
      borderRadius: radius.sm,
      backgroundColor: p.color.accent,
    },
    addBtnPressed: { backgroundColor: p.color.accentHover },
    addBtnText: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 13.5, color: p.color.onAccent },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: 24,
      paddingHorizontal: screenPad,
    },
    cta: {
      paddingVertical: 16,
      borderRadius: radius.lg,
      backgroundColor: p.color.accent,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    ctaPressed: { backgroundColor: p.color.accentHover },
    ctaText: { fontFamily: t.font.sansMedium, fontWeight: '700', fontSize: 16, color: p.color.onAccent },
  });
