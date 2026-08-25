import React, { forwardRef, useCallback, useImperativeHandle, useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useI18n } from '../i18n';
import { useTheme } from '../theme';
import { radius, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';

/** Horizontal travel, in points, that commits a swipe. */
const COMMIT_DISTANCE = 90;
/** Degrees of tilt at full commit distance, matching `drag / 22` in the canvas. */
const TILT_DIVISOR = 22;
const EXIT_MS = 200;
const ENTER_MS = 260;

export type QuestionCardHandle = {
  /** Fly the card off-screen, then report the advance. -1 exits left, 1 right. */
  fly: (direction: -1 | 1) => void;
};

type Props = {
  /** Position in the deck. Drives the deal-in animation, so two identical
   *  question strings in a row still animate. */
  cardIndex: number;
  question: string;
  relLabel: string;
  relHue: string;
  bandLabel: string;
  hint: string;
  saved: boolean;
  onToggleSave: () => void;
  onAdvance: () => void;
};

export const QuestionCard = forwardRef<QuestionCardHandle, Props>(function QuestionCard(
  { cardIndex, question, relLabel, relHue, bandLabel, hint, saved, onToggleSave, onAdvance },
  ref,
) {
  const { t } = useI18n();
  const { palette: p } = useTheme();
  const styles = useStyles(makeStyles);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const settling = useSharedValue(false);

  const fly = useCallback(
    (direction: -1 | 1) => {
      if (settling.value) return;
      settling.value = true;
      x.value = withTiming(direction * 420, { duration: EXIT_MS });
      y.value = withTiming(-40, { duration: EXIT_MS });
      opacity.value = withTiming(0, { duration: EXIT_MS }, (done) => {
        if (done) runOnJS(onAdvance)();
      });
    },
    [onAdvance, opacity, settling, x, y],
  );

  useImperativeHandle(ref, () => ({ fly }), [fly]);

  // Deal the next card in: it rises from below at 96%, as in the canvas's
  // "in" phase. Runs before paint so the incoming card is never drawn at the
  // outgoing card's off-screen position.
  useLayoutEffect(() => {
    x.value = 0;
    y.value = 26;
    scale.value = 0.96;
    opacity.value = 1;
    settling.value = false;
    y.value = withTiming(0, { duration: ENTER_MS });
    scale.value = withTiming(1, { duration: ENTER_MS });
  }, [cardIndex, x, y, scale, opacity, settling]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (settling.value) return;
      x.value = e.translationX;
    })
    .onEnd((e) => {
      if (settling.value) return;
      if (Math.abs(e.translationX) > COMMIT_DISTANCE) {
        const dir: -1 | 1 = e.translationX > 0 ? 1 : -1;
        runOnJS(fly)(dir);
      } else {
        x.value = withTiming(0, { duration: 220 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${x.value / TILT_DIVISOR}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.stack}>
      {/* Two resting cards peeking out from under the live one. */}
      <View style={styles.under2} />
      <View style={styles.under1} />

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.card, cardStyle]}
          accessibilityRole="text"
          accessibilityLabel={`${relLabel}, ${bandLabel}. ${question}`}
        >
          <View style={styles.cardTop}>
            <View style={styles.relRow}>
              <View style={[styles.dot, { backgroundColor: relHue }]} />
              <Text style={styles.relLabel}>{relLabel}</Text>
            </View>
            <Text style={styles.bandLabel}>{bandLabel}</Text>
          </View>

          <Text style={styles.question}>{question}</Text>

          <View style={styles.cardBottom}>
            <Text style={styles.hint}>{hint}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={saved ? t.unkeepQuestionA11y : t.keepQuestionA11y}
              accessibilityState={{ selected: saved }}
              hitSlop={10}
              onPress={() => {
                tapLight();
                onToggleSave();
              }}
              style={[
                styles.star,
                { backgroundColor: saved ? relHue : 'rgba(18,39,26,.08)' },
              ]}
            >
              <Text style={[styles.starGlyph, { color: saved ? p.color.cardInk : 'rgba(18,39,26,.45)' }]}>
                ★
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const underShared = {
  position: 'absolute' as const,
  borderRadius: radius.card,
};

const makeStyles = (t: Typo, p: Palette) =>
  StyleSheet.create({
    stack: { flex: 1 },
    under2: {
      ...underShared,
      left: 14,
      right: 14,
      top: 16,
      bottom: -6,
      backgroundColor: p.surface.s05,
    },
    under1: {
      ...underShared,
      left: 7,
      right: 7,
      top: 8,
      bottom: -3,
      backgroundColor: p.surface.s08,
    },
    card: {
      flex: 1,
      borderRadius: radius.card,
      backgroundColor: p.color.card,
      paddingVertical: 26,
      paddingHorizontal: 24,
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOpacity: 0.45,
      shadowRadius: 30,
      shadowOffset: { width: 0, height: 24 },
      elevation: 12,
    },
    cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    relRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    dot: { width: 8, height: 8, borderRadius: 99 },
    relLabel: {
      fontFamily: t.font.sansBold,
      fontSize: 10,
      letterSpacing: 1.6,
      color: 'rgba(18,39,26,.55)',
    },
    bandLabel: {
      fontFamily: t.font.sansBold,
      fontSize: 10,
      letterSpacing: 1.6,
      color: 'rgba(18,39,26,.35)',
    },
    question: {
      fontFamily: t.font.serif,
      fontSize: 34,
      lineHeight: t.line(34, 38),
      color: p.color.cardInk,
      paddingVertical: 14,
    },
    cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    hint: { fontFamily: t.font.sans, fontSize: 11.5, color: 'rgba(18,39,26,.4)', flexShrink: 1 },
    star: { width: 36, height: 36, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    starGlyph: { fontSize: 16, lineHeight: 20 },
  });
