import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../components/Icon';
import { QuestionCard, type QuestionCardHandle } from '../components/QuestionCard';
import { bandFor, REL_IMAGES, type ModeId, type Relationship } from '../data/decks';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import { useTheme } from '../theme';
import { radius, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { notifyWarning, tapLight, tapMedium } from '../util/haptics';

const LOW_TIME_SECONDS = 15;

export type SessionConfig = {
  id: number;
  rel: Relationship;
  sourceLabel: string;
  hue: string;
  depth: number;
  mode: ModeId;
  deck: readonly string[];
};

type Props = {
  config: SessionConfig;
  onExit: () => void;
  onGoDeeper: (depth: number) => void;
};

export function SessionScreen({ config, onExit, onGoDeeper }: Props) {
  const insets = useSafeAreaInsets();
  const { players, saved, prefs, toggleSaved, isSaved, markSeen } = useStore();
  const { t, content } = useI18n();
  const { palette: p } = useTheme();
  const styles = useStyles(makeStyles);
  const cardRef = useRef<QuestionCardHandle>(null);

  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  idxRef.current = idx;
  const depth = config.depth;
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(prefs.showTimer);
  const firedTimeUp = useRef(false);

  const deck = config.deck;
  const done = idx >= deck.length;
  const question = deck[Math.min(idx, deck.length - 1)] ?? '';
  const bandLabel = content.bands[bandFor(depth)];
  const isGroup = config.mode === 'pass' || config.mode === 'group';
  const named = isGroup && players.length > 0;
  const left = Math.max(0, prefs.timerSeconds - secs);
  const progressPct = deck.length > 0 ? Math.min(100, ((idx + 1) / deck.length) * 100) : 100;

  useEffect(() => {
    if (!running || done) return;
    const id = setInterval(() => setSecs((s) => Math.min(s + 1, prefs.timerSeconds)), 1000);
    return () => clearInterval(id);
  }, [running, done, prefs.timerSeconds]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next !== 'active') setRunning(false);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (running && left === 0 && !firedTimeUp.current) {
      firedTimeUp.current = true;
      notifyWarning();
    }
  }, [running, left]);

  const advance = useCallback(() => {
    const current = deck[idxRef.current];
    if (current) markSeen(current);
    setIdx((i) => Math.min(i + 1, deck.length));
    setSecs(0);
    firedTimeUp.current = false;
  }, [deck, markSeen]);

  const goPrev = useCallback(() => {
    if (idxRef.current <= 0) return;
    tapLight();
    setIdx((i) => Math.max(0, i - 1));
    setSecs(0);
    firedTimeUp.current = false;
  }, []);

  const flyNext = useCallback(() => {
    tapMedium();
    cardRef.current?.fly(-1);
  }, []);

  const goDeeper = useCallback(() => {
    tapMedium();
    onGoDeeper(Math.min(10, depth + 3));
  }, [depth, onGoDeeper]);

  const savedCount = saved.length;
  const isCurrentSaved = useMemo(
    () => isSaved(question),
    [isSaved, question],
  );

  const timerLabel = running
    ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`
    : '▶';
  const lowTime = running && left < LOW_TIME_SECONDS;
  const timerColor = lowTime ? p.color.danger : p.ink.a75;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.endSessionA11y}
          onPress={() => {
            tapLight();
            onExit();
          }}
          style={({ pressed }) => [styles.circleBtn, pressed && styles.circleBtnPressed]}
        >
          <Icon name="close" size={16} color={p.ink.a70} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.turnLine}>
            {named ? t.playerTurn(players[idx % players.length]) : t.yourTurn}
          </Text>
          <Text style={styles.progressLine}>
            {done
              ? t.deckProgress(deck.length, depth)
              : t.cardProgress(Math.min(idx + 1, deck.length), deck.length, depth)}
          </Text>
        </View>

        {prefs.showTimer ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={running ? t.pauseTimerA11y : t.startTimerA11y}
            onPress={() => {
              tapLight();
              firedTimeUp.current = false;
              setSecs(0);
              setRunning((r) => !r);
            }}
            style={[
              styles.timerPill,
              {
                backgroundColor: lowTime ? 'rgba(217,56,90,.16)' : p.surface.s06,
                borderColor: lowTime ? p.color.danger : p.surface.border,
              },
            ]}
          >
            {running && <Icon name="clock" size={12} color={timerColor} />}
            <Text style={[styles.timerText, { color: timerColor }]}>
              {timerLabel}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.circleSpacer} />
        )}
      </View>

      {!done && (
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPct}%`, backgroundColor: config.hue },
            ]}
          />
        </View>
      )}

      {done ? (
        <View style={styles.doneWrap}>
          <View style={styles.doneIconBadge}>
            <Icon name="sparkle" size={28} color={p.color.accent} />
          </View>
          <Text style={styles.doneTitle}>{t.deckDone}</Text>
          <Text style={styles.doneBody}>
            {savedCount === 0 ? t.keptNothing : t.keptSome(savedCount)}
          </Text>
          <View style={styles.doneActions}>
            {depth < 10 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.turnItUp}
                onPress={goDeeper}
                style={({ pressed }) => [styles.donePrimary, pressed && styles.donePrimaryPressed]}
              >
                <Text style={styles.donePrimaryText}>{t.turnItUp}</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.done}
              onPress={() => {
                tapLight();
                onExit();
              }}
              style={({ pressed }) => [styles.doneSecondary, pressed && styles.doneSecondaryPressed]}
            >
              <Text style={styles.doneSecondaryText}>{t.done}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.playArea}>
          <QuestionCard
            ref={cardRef}
            cardIndex={idx}
            totalCards={deck.length}
            question={question}
            relLabel={config.sourceLabel}
            relHue={config.hue}
            relImage={REL_IMAGES[config.rel]}
            bandLabel={bandLabel}
            hint={isGroup ? t.hintPass : t.hintSolo}
            saved={isCurrentSaved}
            onToggleSave={() => toggleSaved(question, config.rel, depth)}
            onAdvance={advance}
          />

          <View style={styles.actions}>
            {idx > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.prevCardA11y}
                onPress={goPrev}
                style={({ pressed }) => [styles.prevBtn, pressed && styles.passPressed]}
              >
                <Icon name="arrow-left" size={18} color={p.ink.a75} />
              </Pressable>
            )}
            {prefs.allowSkip && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.passA11y}
                onPress={flyNext}
                style={({ pressed }) => [styles.pass, pressed && styles.passPressed]}
              >
                <Text style={styles.passText}>{t.pass}</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isGroup ? t.answeredPassOnA11y : t.nextCard}
              onPress={flyNext}
              style={({ pressed }) => [styles.next, pressed && styles.nextPressed]}
            >
              <Text style={styles.nextText}>{isGroup ? t.answeredPassOn : t.nextCard}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const makeStyles = (t: Typo, p: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: p.color.bg, paddingHorizontal: 20 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    circleBtn: {
      width: 38,
      height: 38,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.surface.border,
    },
    circleBtnPressed: { backgroundColor: p.surface.s10 },
    circleSpacer: { width: 64, height: 38 },
    headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
    turnLine: { fontFamily: t.font.sansMedium, fontWeight: '700', fontSize: 14.5, color: p.color.ink },
    progressLine: { fontFamily: t.font.sans, fontSize: 11.5, color: p.ink.a55, marginTop: 2 },
    timerPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      minWidth: 64,
      height: 36,
      paddingHorizontal: 11,
      borderRadius: radius.pill,
      borderWidth: 1,
      justifyContent: 'center',
    },
    timerText: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 12 },
    progressBarTrack: {
      height: 5,
      borderRadius: 99,
      backgroundColor: p.surface.s07,
      overflow: 'hidden',
      marginBottom: 16,
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 99,
    },
    playArea: { flex: 1 },
    actions: { flexDirection: 'row', gap: 9, marginTop: 20 },
    prevBtn: {
      width: 50,
      paddingVertical: 15,
      borderRadius: radius.lg,
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pass: {
      paddingVertical: 15,
      paddingHorizontal: 18,
      borderRadius: radius.lg,
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      justifyContent: 'center',
    },
    passPressed: { backgroundColor: p.surface.s10 },
    passText: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 14.5, color: p.ink.a75 },
    next: {
      flex: 1,
      paddingVertical: 15,
      borderRadius: radius.lg,
      backgroundColor: p.color.accent,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    nextPressed: { backgroundColor: p.color.accentHover },
    nextText: { fontFamily: t.font.sansMedium, fontWeight: '700', fontSize: 15.5, color: p.color.onAccent },
    doneWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      paddingHorizontal: 18,
    },
    doneIconBadge: {
      width: 56,
      height: 56,
      borderRadius: 20,
      backgroundColor: p.accentAlpha.a16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    doneTitle: {
      fontFamily: t.font.serif,
      fontWeight: '700',
      fontSize: 28,
      lineHeight: t.line(28, 34),
      color: p.color.ink,
      textAlign: 'center',
    },
    doneBody: {
      fontFamily: t.font.sans,
      fontSize: 14.5,
      lineHeight: t.line(14.5, 21),
      color: p.ink.a60,
      textAlign: 'center',
    },
    doneActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
    donePrimary: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: radius.md,
      backgroundColor: p.color.accent,
    },
    donePrimaryPressed: { backgroundColor: p.color.accentHover },
    donePrimaryText: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 14.5,
      color: p.color.onAccent,
    },
    doneSecondary: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: radius.md,
      backgroundColor: p.surface.s07,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
    },
    doneSecondaryPressed: { backgroundColor: p.surface.s10 },
    doneSecondaryText: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 14.5, color: p.color.ink },
  });
