import React, { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { Image, type ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { shareQuestion } from '../util/share';

import { Icon } from './Icon';

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
  cardIndex: number;
  totalCards?: number;
  question: string;
  relLabel: string;
  relHue: string;
  relImage?: ImageSourcePropType;
  bandLabel: string;
  hint: string;
  saved: boolean;
  onToggleSave: () => void;
  onAdvance: () => void;
};

export const QuestionCard = forwardRef<QuestionCardHandle, Props>(function QuestionCard(
  {
    cardIndex,
    totalCards,
    question,
    relLabel,
    relHue,
    relImage,
    bandLabel,
    hint,
    saved,
    onToggleSave,
    onAdvance,
  },
  ref,
) {
  const { lang, t } = useI18n();
  const { palette: p } = useTheme();
  const styles = useStyles(makeStyles);
  const [copied, setCopied] = useState(false);
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

  useLayoutEffect(() => {
    x.value = 0;
    y.value = 22;
    scale.value = 0.97;
    opacity.value = 1;
    settling.value = false;
    setCopied(false);
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

  const handleShare = async () => {
    tapLight();
    const res = await shareQuestion(question, relLabel);
    if (res === 'copied') {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const numStr = `#${String(cardIndex + 1).padStart(2, '0')}${totalCards ? ` / ${totalCards}` : ''}`;

  return (
    <View style={styles.stack}>
      <View style={styles.under2} />
      <View style={styles.under1} />

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.card, cardStyle]}
          accessibilityRole="text"
          accessibilityLabel={`${relLabel}, ${bandLabel}. ${question}`}
        >
          <View style={[styles.topAccentBar, { backgroundColor: relHue }]} />

          <View style={styles.cardInner}>
            <View style={styles.cardTop}>
              <View style={styles.relPill}>
                {relImage ? (
                  <Image source={relImage} style={styles.relThumb} resizeMode="cover" />
                ) : (
                  <View style={[styles.dot, { backgroundColor: relHue }]} />
                )}
                <Text style={styles.relLabel}>{relLabel}</Text>
              </View>
              <View style={styles.topRightRow}>
                <View style={styles.bandPill}>
                  <Text style={styles.bandLabel}>{bandLabel}</Text>
                </View>
                <Text style={styles.cardNum}>{numStr}</Text>
              </View>
            </View>

            <View style={styles.questionWrap}>
              <Text style={styles.question}>{question}</Text>
              <Text style={styles.watermark}>AZOLLA · DEEPTALK</Text>
            </View>

            <View style={styles.cardBottom}>
              <Text style={styles.hint} numberOfLines={1}>
                {hint}
              </Text>
              <View style={styles.cardActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={lang === 'th' ? 'แชร์คำถามนี้' : 'Share this question'}
                  hitSlop={8}
                  onPress={handleShare}
                  style={({ pressed }) => [
                    styles.shareBtn,
                    pressed && { backgroundColor: p.surface.s10 },
                  ]}
                >
                  <Icon
                    name={copied ? 'check' : 'share'}
                    size={13}
                    color={copied ? p.color.accent : p.ink.a70}
                  />
                  <Text
                    style={[
                      styles.starGlyph,
                      { color: copied ? p.color.accent : p.ink.a70 },
                    ]}
                  >
                    {copied
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
                  accessibilityLabel={saved ? t.unkeepQuestionA11y : t.keepQuestionA11y}
                  accessibilityState={{ selected: saved }}
                  hitSlop={10}
                  onPress={() => {
                    tapLight();
                    onToggleSave();
                  }}
                  style={[
                    styles.starBtn,
                    {
                      backgroundColor: saved ? relHue : p.surface.s06,
                      borderColor: saved ? relHue : p.surface.borderStrong,
                    },
                  ]}
                >
                  <Icon
                    name={saved ? 'bookmark-filled' : 'bookmark'}
                    size={13}
                    color={saved ? '#ffffff' : p.ink.a70}
                    bgColor={saved ? relHue : p.color.card}
                  />
                  <Text
                    style={[
                      styles.starGlyph,
                      { color: saved ? '#ffffff' : p.ink.a70 },
                    ]}
                  >
                    {saved ? t.keptBtn : t.keepBtn}
                  </Text>
                </Pressable>
              </View>
            </View>
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
      left: 16,
      right: 16,
      top: 16,
      bottom: -8,
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.surface.border,
    },
    under1: {
      ...underShared,
      left: 8,
      right: 8,
      top: 8,
      bottom: -4,
      backgroundColor: p.surface.s08,
      borderWidth: 1,
      borderColor: p.surface.border,
    },
    card: {
      flex: 1,
      borderRadius: radius.card,
      backgroundColor: p.color.card,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    topAccentBar: {
      height: 6,
      width: '100%',
    },
    cardInner: {
      flex: 1,
      paddingVertical: 22,
      paddingHorizontal: 22,
      justifyContent: 'space-between',
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    topRightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    cardNum: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 11,
      color: p.ink.a40,
    },
    relPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      paddingVertical: 4,
      paddingLeft: 5,
      paddingRight: 11,
      borderRadius: radius.pill,
      backgroundColor: p.surface.s06,
    },
    relThumb: {
      width: 22,
      height: 22,
      borderRadius: 99,
    },
    dot: { width: 8, height: 8, borderRadius: 99 },
    relLabel: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 11,
      color: p.ink.a75,
    },
    bandPill: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: radius.pill,
      backgroundColor: p.surface.s05,
    },
    bandLabel: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 11,
      color: p.ink.a55,
    },
    questionWrap: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 18,
    },
    question: {
      fontFamily: t.font.serif,
      fontWeight: '700',
      fontSize: 25,
      lineHeight: t.line(25, 34),
      color: p.color.cardInk,
    },
    watermark: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 10,
      letterSpacing: 1.8,
      color: p.ink.a35,
    },
    cardBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: p.surface.border,
    },
    hint: {
      fontFamily: t.font.sans,
      fontSize: 11.5,
      color: p.ink.a50,
      flex: 1,
    },
    cardActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    shareBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 8,
      paddingHorizontal: 11,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      backgroundColor: p.surface.s06,
      justifyContent: 'center',
    },
    starBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 13,
      borderRadius: radius.pill,
      borderWidth: 1,
      justifyContent: 'center',
    },
    starGlyph: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 12,
    },
  });
