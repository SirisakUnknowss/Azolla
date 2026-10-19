import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PurchasesPackage } from 'react-native-purchases';

import { useI18n } from '../i18n';
import { STORE_AVAILABLE, useSubscription } from '../subscription';
import { useTheme } from '../theme';
import { radius, screenPad, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight, tapMedium } from '../util/haptics';

/** Annual packages read as yearly; everything else is billed monthly. */
function isYearly(pkg: PurchasesPackage): boolean {
  return String(pkg.packageType).toUpperCase() === 'ANNUAL';
}

export function PaywallScreen({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { palette: p } = useTheme();
  const styles = useStyles(makeStyles);
  const { packages, purchase, restore, isPro } = useSubscription();
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Default to the yearly plan when the offering has one, which is both the
  // better deal and the one most people mean to pick.
  useEffect(() => {
    if (selected || packages.length === 0) return;
    const preferred = packages.find(isYearly) ?? packages[0];
    setSelected(preferred.identifier);
  }, [packages, selected]);

  // Nothing left to sell once the entitlement is active.
  useEffect(() => {
    if (isPro) onClose();
  }, [isPro, onClose]);

  const buy = async () => {
    const pkg = packages.find((x) => x.identifier === selected);
    if (!pkg || busy) return;
    tapMedium();
    setBusy(true);
    const ok = await purchase(pkg);
    setBusy(false);
    if (ok) onClose();
  };

  const doRestore = async () => {
    if (busy) return;
    tapLight();
    setBusy(true);
    const ok = await restore();
    setBusy(false);
    setNotice(ok ? t.proRestored : t.proRestoreFailed);
  };

  const features = [
    t.proFeatureLevels,
    t.proFeatureDecks,
    t.proFeaturePacks,
    t.proFeatureCustom,
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t.proName}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.proCloseA11y}
            hitSlop={10}
            onPress={() => {
              tapLight();
              onClose();
            }}
            style={styles.closeBtn}
          >
            <Text style={styles.closeGlyph}>×</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>{t.proTitle}</Text>
        <Text style={styles.subtitle}>{t.proSubtitle}</Text>

        <View style={styles.features}>
          {features.map((line) => (
            <View key={line} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{line}</Text>
            </View>
          ))}
        </View>

        {!STORE_AVAILABLE ? (
          <View style={styles.unavailable}>
            <Text style={styles.unavailableText}>{t.proUnavailable}</Text>
          </View>
        ) : packages.length === 0 ? (
          <Text style={styles.loading}>{t.proLoading}</Text>
        ) : (
          <View style={styles.plans}>
            {packages.map((pkg) => {
              const on = pkg.identifier === selected;
              const yearly = isYearly(pkg);
              return (
                <Pressable
                  key={pkg.identifier}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={`${yearly ? t.proYearly : t.proMonthly} ${pkg.product.priceString}`}
                  onPress={() => {
                    tapLight();
                    setSelected(pkg.identifier);
                  }}
                  style={[
                    styles.plan,
                    {
                      borderColor: on ? p.color.accent : p.surface.border,
                      backgroundColor: on ? p.accentAlpha.a12 : p.surface.s045,
                    },
                  ]}
                >
                  <View style={styles.planText}>
                    <Text style={styles.planName}>
                      {yearly ? t.proYearly : t.proMonthly}
                    </Text>
                    {yearly && <Text style={styles.planNote}>{t.proYearlyNote}</Text>}
                  </View>
                  <Text style={styles.planPrice}>{pkg.product.priceString}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {notice && <Text style={styles.notice}>{notice}</Text>}

        {STORE_AVAILABLE && packages.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.proCta}
            onPress={buy}
            disabled={busy}
            style={({ pressed }) => [
              styles.cta,
              pressed && styles.ctaPressed,
              busy && styles.ctaBusy,
            ]}
          >
            <Text style={styles.ctaText}>{t.proCta}</Text>
          </Pressable>
        )}

        <View style={styles.footerActions}>
          {STORE_AVAILABLE && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.proRestore}
              onPress={doRestore}
              disabled={busy}
            >
              <Text style={styles.footerLink}>{t.proRestore}</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.proCloseA11y}
            onPress={() => {
              tapLight();
              onClose();
            }}
          >
            <Text style={styles.footerLink}>{t.proClose}</Text>
          </Pressable>
        </View>

        <Text style={styles.terms}>{t.proTerms}</Text>
      </ScrollView>
    </View>
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
      marginBottom: 26,
    },
    eyebrow: { ...t.eyebrow, color: p.color.accent },
    closeBtn: {
      width: 34,
      height: 34,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surface.s07,
    },
    closeGlyph: { fontFamily: t.font.sans, fontSize: 20, color: p.ink.a70, lineHeight: 24 },
    title: {
      fontFamily: t.font.serif,
      fontSize: 36,
      lineHeight: t.line(36, 39),
      color: p.color.ink,
      marginBottom: 10,
    },
    subtitle: {
      fontFamily: t.font.sans,
      fontSize: 14,
      lineHeight: t.line(14, 21),
      color: p.ink.a55,
      marginBottom: 28,
    },
    features: { gap: 13, marginBottom: 30 },
    featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
    featureDot: {
      width: 6,
      height: 6,
      borderRadius: 99,
      backgroundColor: p.color.accent,
      marginTop: 7,
    },
    featureText: {
      flex: 1,
      fontFamily: t.font.sans,
      fontSize: 14,
      lineHeight: t.line(14, 20),
      color: p.ink.a75,
    },
    plans: { gap: 10, marginBottom: 20 },
    plan: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderRadius: radius.lg,
      borderWidth: 1,
    },
    planText: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    planName: { fontFamily: t.font.sansMedium, fontSize: 15.5, color: p.color.ink },
    planNote: {
      fontFamily: t.font.sansBold,
      fontSize: 9.5,
      letterSpacing: 0.8,
      color: p.color.onAccent,
      backgroundColor: p.color.accent,
      paddingVertical: 3,
      paddingHorizontal: 7,
      borderRadius: radius.pill,
      overflow: 'hidden',
    },
    planPrice: { fontFamily: t.font.sansMedium, fontSize: 15.5, color: p.color.ink },
    unavailable: {
      paddingVertical: 22,
      paddingHorizontal: 18,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: p.surface.dashed,
      marginBottom: 20,
    },
    unavailableText: {
      fontFamily: t.font.sans,
      fontSize: 13.5,
      lineHeight: t.line(13.5, 20),
      color: p.ink.a55,
      textAlign: 'center',
    },
    loading: {
      fontFamily: t.font.sans,
      fontSize: 13.5,
      color: p.ink.a45,
      textAlign: 'center',
      marginBottom: 20,
    },
    notice: {
      fontFamily: t.font.sans,
      fontSize: 13,
      lineHeight: t.line(13, 19),
      color: p.color.accentSoft,
      textAlign: 'center',
      marginBottom: 14,
    },
    cta: {
      paddingVertical: 17,
      borderRadius: radius.lg,
      backgroundColor: p.color.accent,
      alignItems: 'center',
      marginBottom: 18,
    },
    ctaPressed: { backgroundColor: p.color.accentHover },
    ctaBusy: { opacity: 0.6 },
    ctaText: { fontFamily: t.font.sansMedium, fontSize: 16, color: p.color.onAccent },
    footerActions: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 22,
      marginBottom: 22,
    },
    footerLink: { fontFamily: t.font.sansMedium, fontSize: 13, color: p.ink.a55 },
    terms: {
      fontFamily: t.font.sans,
      fontSize: 10.5,
      lineHeight: t.line(10.5, 15),
      color: p.ink.a35,
      textAlign: 'center',
    },
  });
