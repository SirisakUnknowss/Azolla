import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QuestionCard, type QuestionCardHandle } from '../components/QuestionCard';
import { bandFor, type ModeId, type Relationship } from '../data/decks';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import { useTheme } from '../theme';
import { radius, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { notifyWarning, tapLight, tapMedium } from '../util/haptics';

const LOW_TIME_SECONDS = 15;

export type SessionConfig = {
  /** Bumped on every deal; keys the screen so a new deck resets the session. */
  id: number;
  /** Relationship the kept questions are filed under. */
  rel: Relationship;
  /** What the card's top-left label reads — a relationship or a pack name. */
  sourceLabel: string;
  hue: string;
  depth: number;
  mode: ModeId;
  deck: readonly string[];
};

type Props = {
  config: SessionConfig;
  onExit: () => void;
  /** Deals a new, deeper deck — the screen is remounted with it. */
  onGoDeeper: (depth: number) => void;
};

export function SessionScreen({ config, onExit, onGoDeeper }: Props) {
  const insets = useSafeAreaInsets();
  const { players, saved, prefs, toggleSaved, markSeen } = useStore();
  const { t, content, typo } = useI18n();
  const { palette: p } = useTheme();
  const styles = useStyles(makeStyles);
  const cardRef = useRef<QuestionCardHandle>(null);

  const [idx, setIdx] = useState(0);
  // Read through a ref so `advance` keeps one identity for the whole session:
  // it is handed to the card as an animation callback, and a new function per
  // card would rebuild the card's imperative handle on every deal.
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
  // Turns are only called by name when names were actually entered.
  const named = isGroup && players.length > 0;
  const left = Math.max(0, prefs.timerSeconds - secs);

  // Tick the turn timer. It only advances while the session is on screen and
  // the app is in the foreground.
  useEffect(() => {
    if (!running || done) return;
    // Clamp at the limit so the counter parks at 0:00 instead of running past it.
    const id = setInterval(() => setSecs((s) => Math.min(s + 1, prefs.timerSeconds)), 1000);
    return () => clearInterval(id);
  }, [running, done, prefs.timerSeconds]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next !== 'active') setRunning(false);
    });
    return () => sub.remove();
  }, []);

  // One warning buzz when the turn runs out, then the timer parks at 0:00.
  useEffect(() => {
    if (running && left === 0 && !firedTimeUp.current) {
      firedTimeUp.current = true;
      notifyWarning();
    }
  }, [running, left]);

  const advance = useCallback(() => {
    // Record the card being left behind, so later sessions open on new ones.
    const current = deck[idxRef.current];
    if (current) markSeen(current);
    setIdx((i) => Math.min(i + 1, deck.length));
    setSecs(0);
    firedTimeUp.current = false;
  }, [deck, markSeen]);

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
    () => saved.some((s) => s.q === question),
    [saved, question],
  );

  const timerLabel = running
    ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`
    : '▶';
  const lowTime = running && left < LOW_TIME_SECONDS;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 14, paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
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
          <Text style={styles.backGlyph}>←</Text>
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
              styles.circleBtn,
              { backgroundColor: lowTime ? 'rgba(255,107,138,.22)' : p.surface.s07 },
            ]}
          >
            <Text style={[styles.timerText, { color: lowTime ? p.color.danger : p.ink.a70 }]}>
              {timerLabel}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.circleSpacer} />
        )}
      </View>

      {done ? (
        <View style={styles.doneWrap}>
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
            question={question}
            relLabel={typo.upper(config.sourceLabel)}
            relHue={config.hue}
            bandLabel={typo.upper(bandLabel)}
            hint={isGroup ? t.hintPass : t.hintSolo}
            saved={isCurrentSaved}
            onToggleSave={() => toggleSaved(question, config.rel, depth)}
            onAdvance={advance}
          />

          <View style={styles.actions}>
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
      marginBottom: 18,
    },
    circleBtn: {
      width: 38,
      height: 38,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surface.s07,
    },
    circleBtnPressed: { backgroundColor: p.surface.s11 },
    circleSpacer: { width: 38, height: 38 },
    backGlyph: { fontFamily: t.font.sans, fontSize: 18, color: p.ink.a70 },
    headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
    turnLine: { fontFamily: t.font.sansMedium, fontSize: 14, color: p.color.ink },
    progressLine: { fontFamily: t.font.sans, fontSize: 11, color: p.ink.a42, marginTop: 2 },
    timerText: { fontFamily: t.font.sansMedium, fontSize: 11 },
    playArea: { flex: 1 },
    actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
    pass: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: radius.lg,
      backgroundColor: p.surface.s07,
      justifyContent: 'center',
    },
    passPressed: { backgroundColor: p.surface.s11 },
    passText: { fontFamily: t.font.sansMedium, fontSize: 15, color: p.ink.a75 },
    next: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: radius.lg,
      backgroundColor: p.color.accent,
      alignItems: 'center',
    },
    nextPressed: { backgroundColor: p.color.accentHover },
    nextText: { fontFamily: t.font.sansMedium, fontSize: 15.5, color: p.color.onAccent },
    doneWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      paddingHorizontal: 18,
    },
    doneTitle: { fontFamily: t.font.serif, fontSize: 34, lineHeight: t.line(34, 37), color: p.color.ink, textAlign: 'center' },
    doneBody: {
      fontFamily: t.font.sans,
      fontSize: 14,
      lineHeight: t.line(14, 21),
      color: p.ink.a50,
      textAlign: 'center',
    },
    doneActions: { flexDirection: 'row', gap: 10, marginTop: 6 },
    donePrimary: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: radius.md,
      backgroundColor: p.color.accent,
    },
    donePrimaryPressed: { backgroundColor: p.color.accentHover },
    donePrimaryText: { fontFamily: t.font.sansMedium, fontSize: 14, color: p.color.onAccent },
    doneSecondary: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: radius.md,
      backgroundColor: p.surface.s08,
    },
    doneSecondaryPressed: { backgroundColor: p.surface.s11 },
    doneSecondaryText: { fontFamily: t.font.sansMedium, fontSize: 14, color: p.color.ink },
  });
