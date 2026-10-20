import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../components/Icon';
import { LangToggle } from '../components/LangToggle';
import { ThemeToggle } from '../components/ThemeToggle';
import { BRAND_LOGO, HUES, REL_IMAGES, RELATIONSHIPS, type Relationship } from '../data/decks';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import { useSubscription } from '../subscription';
import { useTheme } from '../theme';
import { radius, screenPad, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { dailyQuestion } from '../util/daily';
import { tapLight } from '../util/haptics';

type Props = {
  onPickRelationship: (rel: Relationship) => void;
  onStartDaily: (question: string) => void;
  onOpenPaywall: () => void;
};

const CLASSIC_RELATIONSHIPS = RELATIONSHIPS.filter(
  (id) => id !== 'Dark mode' && id !== 'Sex mode',
);

export function HomeScreen({ onPickRelationship, onStartDaily, onOpenPaywall }: Props) {
  const insets = useSafeAreaInsets();
  const { streak } = useStore();
  const { lang, t, content } = useI18n();
  const { palette: p } = useTheme();
  const { isPro, isRelationshipLocked } = useSubscription();
  const styles = useStyles(makeStyles);
  const daily = useMemo(() => dailyQuestion(content.daily), [content]);

  const streakLabel = streak.count === 0 ? t.startStreak : t.streakDays(streak.count);

  const gridRelationships = CLASSIC_RELATIONSHIPS.slice(0, 6);
  const lastRelationship = CLASSIC_RELATIONSHIPS[6];

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 116 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image source={BRAND_LOGO} style={styles.brandLogo} resizeMode="cover" />
          <Text style={styles.wordmark}>Azolla</Text>
          <View style={styles.streakPill}>
            <Icon name="flame" size={12} color={p.color.accent} />
            <Text style={styles.streakText}>{streakLabel}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPro ? 'Azolla Pro active' : t.proCta}
            onPress={() => {
              tapLight();
              if (!isPro) onOpenPaywall();
            }}
            style={[
              styles.proHeaderBtn,
              isPro && { backgroundColor: p.color.accent, borderColor: p.color.accent },
            ]}
          >
            <Icon
              name={isPro ? 'check' : 'sparkle'}
              size={11}
              color={isPro ? p.color.onAccent : p.color.accent}
            />
            <Text
              style={[
                styles.proHeaderBtnText,
                isPro && { color: p.color.onAccent },
              ]}
            >
              {isPro ? 'PRO' : t.proBadge}
            </Text>
          </Pressable>
          <ThemeToggle />
          <LangToggle />
        </View>
      </View>

      <Text style={styles.title}>{t.homeTitle}</Text>
      <Text style={styles.subtitle}>{t.homeSubtitle}</Text>

      <LinearGradient
        colors={[p.accentAlpha.a16, p.accentAlpha.a04]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.daily}
      >
        <View style={styles.dailyTopRow}>
          <View style={styles.dailyBadge}>
            <Icon name="sparkle" size={12} color={p.color.accent} />
            <Text style={styles.dailyEyebrow}>{t.dailyEyebrow}</Text>
          </View>
        </View>
        <Text style={styles.dailyQuestion}>"{daily}"</Text>
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

      <Text style={styles.sectionTitle}>
        {lang === 'th' ? 'โหมดพิเศษ · ด้านมืด & 18+' : 'SPECIAL MODES · AFTER DARK & 18+'}
      </Text>

      <View style={styles.specialRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${t.darkModeTitle}. ${t.darkModeDesc}`}
          onPress={() => {
            tapLight();
            onPickRelationship('Dark mode');
          }}
          style={({ pressed }) => [styles.specialCardWrap, pressed && { opacity: 0.93 }]}
        >
          <LinearGradient
            colors={['#1a0b18', '#2a0f21', '#140914']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.specialCardDark}
          >
            <View style={styles.specialCoverWrap}>
              <Image
                source={REL_IMAGES['Dark mode']}
                style={styles.specialCover}
                resizeMode="cover"
              />
              <View style={styles.darkBadge}>
                <Icon name="flame" size={11} color="#ff4d88" />
                <Text style={styles.darkBadgeText}>{t.darkModeBadge}</Text>
              </View>
            </View>
            <View style={styles.specialBody}>
              <Text style={styles.specialTitle} numberOfLines={1}>
                {content.rel['Dark mode']}
              </Text>
              <Text style={styles.specialDesc} numberOfLines={2}>
                {content.blurb['Dark mode']}
              </Text>
              <View style={styles.darkCtaBtn}>
                <Text style={styles.specialCtaText}>{t.darkModeCta}</Text>
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${t.sexModeTitle}. ${t.sexModeDesc}`}
          onPress={() => {
            tapLight();
            onPickRelationship('Sex mode');
          }}
          style={({ pressed }) => [styles.specialCardWrap, pressed && { opacity: 0.93 }]}
        >
          <LinearGradient
            colors={['#2b0922', '#470d34', '#1f0618']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.specialCardSex}
          >
            <View style={styles.specialCoverWrap}>
              <Image
                source={REL_IMAGES['Sex mode']}
                style={styles.specialCover}
                resizeMode="cover"
              />
              <View style={styles.sexBadge}>
                <Icon name="heart" size={11} color="#ff5ca8" />
                <Text style={styles.sexBadgeText}>{t.sexModeBadge}</Text>
              </View>
            </View>
            <View style={styles.specialBody}>
              <Text style={styles.specialTitle} numberOfLines={1}>
                {content.rel['Sex mode']}
              </Text>
              <Text style={styles.specialDesc} numberOfLines={2}>
                {content.blurb['Sex mode']}
              </Text>
              <View style={styles.sexCtaBtn}>
                <Text style={styles.specialCtaText}>{t.sexModeCta}</Text>
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>{t.sectionRelationships}</Text>

      <View style={styles.grid}>
        {gridRelationships.map((id) => {
          const [hue, soft] = HUES[id];
          const img = REL_IMAGES[id];
          const name = content.rel[id];
          const blurb = content.blurb[id];
          const locked = isRelationshipLocked(id);
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={locked ? t.lockedA11y(name) : `${name}. ${blurb}`}
              onPress={() => {
                tapLight();
                onPickRelationship(id);
              }}
              style={({ pressed }) => [
                styles.relCard,
                pressed && styles.relCardPressed,
              ]}
            >
              <View style={styles.relCoverWrap}>
                <Image source={img} style={styles.relCover} resizeMode="cover" />
                <View style={styles.relBadgePos}>
                  {locked ? (
                    <View style={styles.proPill}>
                      <Icon name="lock" size={10} color="#ffffff" />
                      <Text style={styles.proPillText}>{t.proBadge}</Text>
                    </View>
                  ) : (
                    <View style={[styles.freePill, { backgroundColor: hue }]}>
                      <Text style={styles.freePillText}>{t.freeBadge}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={[styles.relAccentBar, { backgroundColor: hue }]} />
              <View style={[styles.relBody, { backgroundColor: soft }]}>
                <Text style={styles.relName} numberOfLines={1}>
                  {name}
                </Text>
                <Text style={styles.relBlurb} numberOfLines={2}>
                  {blurb}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {lastRelationship && (() => {
        const id = lastRelationship;
        const [hue, soft] = HUES[id];
        const img = REL_IMAGES[id];
        const name = content.rel[id];
        const blurb = content.blurb[id];
        const locked = isRelationshipLocked(id);
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={locked ? t.lockedA11y(name) : `${name}. ${blurb}`}
            onPress={() => {
              tapLight();
              onPickRelationship(id);
            }}
            style={({ pressed }) => [
              styles.wideRelCard,
              pressed && styles.relCardPressed,
            ]}
          >
            <Image source={img} style={styles.wideRelImage} resizeMode="cover" />
            <View style={styles.wideRelBody}>
              <View style={styles.wideRelHeader}>
                <Text style={styles.relName}>{name}</Text>
                {locked ? (
                  <View style={styles.proPill}>
                    <Icon name="lock" size={10} color="#ffffff" />
                    <Text style={styles.proPillText}>{t.proBadge}</Text>
                  </View>
                ) : (
                  <View style={[styles.freePill, { backgroundColor: hue }]}>
                    <Text style={styles.freePillText}>{t.freeBadge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.relBlurb}>{blurb}</Text>
            </View>
          </Pressable>
        );
      })()}
    </ScrollView>
  );
}

const makeStyles = (t: Typo, p: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: p.color.bg },
    content: { paddingHorizontal: screenPad },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 18,
    },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    brandLogo: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: p.accentAlpha.a16,
    },
    wordmark: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 18,
      color: p.color.ink,
    },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    proHeaderBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 5,
      paddingHorizontal: 9,
      borderRadius: radius.pill,
      backgroundColor: p.accentAlpha.a12,
      borderWidth: 1,
      borderColor: p.accentAlpha.a28,
    },
    proHeaderBtnText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 10.5,
      color: p.color.accentSoft,
    },
    streakPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 4,
      paddingHorizontal: 9,
      borderRadius: radius.pill,
      backgroundColor: p.accentAlpha.a12,
      borderWidth: 1,
      borderColor: p.accentAlpha.a22,
    },
    streakText: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 11,
      color: p.color.accentSoft,
    },
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
      fontSize: 14,
      lineHeight: t.line(14, 20),
      color: p.ink.a60,
      marginBottom: 18,
    },
    daily: {
      marginBottom: 24,
      borderRadius: radius.xl,
      padding: 18,
      borderWidth: 1,
      borderColor: p.accentAlpha.a28,
    },
    dailyTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    dailyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: radius.pill,
      backgroundColor: p.accentAlpha.a16,
    },
    dailyEyebrow: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 10.5,
      color: p.color.accentSoft,
    },
    dailyQuestion: {
      fontFamily: t.font.serif,
      fontWeight: '600',
      fontSize: 18,
      lineHeight: t.line(18, 25),
      color: p.color.ink,
      marginBottom: 14,
    },
    dailyCta: {
      alignSelf: 'flex-start',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: radius.pill,
      backgroundColor: p.color.accent,
    },
    dailyCtaPressed: { backgroundColor: p.color.accentHover },
    dailyCtaText: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 13.5,
      color: p.color.onAccent,
    },
    sectionTitle: {
      ...t.eyebrow,
      color: p.ink.a55,
      marginBottom: 11,
    },
    specialRow: {
      flexDirection: 'row',
      gap: 11,
      marginBottom: 26,
    },
    specialCardWrap: {
      flex: 1,
      borderRadius: radius.xl,
      overflow: 'hidden',
      shadowColor: '#be185d',
      shadowOpacity: 0.2,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    },
    specialCardDark: {
      flex: 1,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: 'rgba(255, 77, 136, 0.35)',
      overflow: 'hidden',
    },
    specialCardSex: {
      flex: 1,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: 'rgba(255, 92, 168, 0.42)',
      overflow: 'hidden',
    },
    specialCoverWrap: {
      width: '100%',
      height: 112,
      position: 'relative',
    },
    specialCover: {
      width: '100%',
      height: '100%',
    },
    darkBadge: {
      position: 'absolute',
      top: 9,
      left: 9,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: radius.pill,
      backgroundColor: 'rgba(20, 9, 20, 0.84)',
      borderWidth: 1,
      borderColor: 'rgba(255, 77, 136, 0.45)',
    },
    sexBadge: {
      position: 'absolute',
      top: 9,
      left: 9,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: radius.pill,
      backgroundColor: 'rgba(31, 6, 24, 0.84)',
      borderWidth: 1,
      borderColor: 'rgba(255, 92, 168, 0.5)',
    },
    darkBadgeText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 9.5,
      color: '#ff6ea0',
    },
    sexBadgeText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 9.5,
      color: '#ff85c0',
    },
    specialBody: {
      padding: 13,
      flex: 1,
      justifyContent: 'space-between',
      gap: 6,
    },
    specialTitle: {
      fontFamily: t.font.serif,
      fontWeight: '700',
      fontSize: 16.5,
      color: '#fdf2f8',
    },
    specialDesc: {
      fontFamily: t.font.sans,
      fontSize: 11.5,
      lineHeight: t.line(11.5, 16),
      color: 'rgba(253, 242, 248, 0.76)',
      marginBottom: 4,
    },
    darkCtaBtn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: radius.pill,
      backgroundColor: '#e11d48',
      alignItems: 'center',
    },
    sexCtaBtn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: radius.pill,
      backgroundColor: '#db2777',
      alignItems: 'center',
    },
    specialCtaText: {
      fontFamily: t.font.sansMedium,
      fontWeight: '700',
      fontSize: 12,
      color: '#ffffff',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 11,
      marginBottom: 11,
    },
    relCard: {
      flexGrow: 1,
      flexBasis: '46%',
      borderRadius: radius.xl,
      overflow: 'hidden',
      backgroundColor: p.color.card,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    relCardPressed: { opacity: 0.9, borderColor: p.color.accent },
    relCoverWrap: {
      width: '100%',
      height: 98,
      position: 'relative',
      backgroundColor: p.surface.s06,
    },
    relCover: {
      width: '100%',
      height: '100%',
    },
    relBadgePos: {
      position: 'absolute',
      top: 8,
      right: 8,
    },
    relAccentBar: {
      height: 3,
      width: '100%',
    },
    freePill: {
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: radius.pill,
    },
    freePillText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 10,
      color: '#ffffff',
    },
    proPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: radius.pill,
      backgroundColor: 'rgba(18, 22, 31, 0.76)',
    },
    proPillText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 10,
      color: '#ffffff',
    },
    relBody: {
      padding: 12,
      gap: 3,
      flex: 1,
    },
    relName: {
      fontFamily: t.font.sansMedium,
      fontWeight: '700',
      fontSize: 15.5,
      color: p.color.ink,
    },
    relBlurb: {
      fontFamily: t.font.sans,
      fontSize: 12,
      lineHeight: t.line(12, 16),
      color: p.ink.a60,
    },
    wideRelCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: radius.xl,
      overflow: 'hidden',
      backgroundColor: p.color.card,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    wideRelImage: {
      width: 96,
      height: 96,
      backgroundColor: p.surface.s06,
    },
    wideRelBody: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 4,
    },
    wideRelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
  });
