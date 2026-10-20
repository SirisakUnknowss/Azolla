import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PurchasesPackage } from 'react-native-purchases';

import { Icon } from '../components/Icon';
import { BRAND_LOGO } from '../data/decks';
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

const PRIVACY_URL = 'https://sirisakunknowss.github.io/DeepTalk/privacy.html';
const TERMS_URL = 'https://sirisakunknowss.github.io/DeepTalk/terms.html';

export function PaywallScreen({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { lang, t } = useI18n();
  const { palette: p } = useTheme();
  const styles = useStyles(makeStyles);
  const { packages, purchase, restore, isPro } = useSubscription();
  const [selected, setSelected] = useState<string>('yearly');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Default to the yearly plan when the offering has one, which is both the
  // better deal and the one most people mean to pick.
  useEffect(() => {
    if (packages.length === 0) return;
    const preferred = packages.find(isYearly) ?? packages[0];
    setSelected(preferred.identifier);
  }, [packages]);

  // Nothing left to sell once the entitlement is active.
  useEffect(() => {
    if (isPro) onClose();
  }, [isPro, onClose]);

  const buy = async () => {
    if (!STORE_AVAILABLE) {
      tapMedium();
      setNotice(t.proUnavailable);
      return;
    }
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
    if (!STORE_AVAILABLE) {
      setNotice(t.proUnavailable);
      return;
    }
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

  const previewPlans = [
    {
      id: 'yearly',
      yearly: true,
      price: lang === 'th' ? '฿590 / ปี' : '$19.99 / yr',
      sub: lang === 'th' ? 'เฉลี่ยเพียง ฿49 / เดือน' : 'Just $1.66 / month',
    },
    {
      id: 'monthly',
      yearly: false,
      price: lang === 'th' ? '฿99 / เดือน' : '$2.99 / mo',
      sub: lang === 'th' ? 'ยกเลิกได้ทุกเมื่อ' : 'Cancel anytime',
    },
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.proBadge}>
            <Icon name="sparkle" size={13} color={p.color.accent} />
            <Text style={styles.eyebrow}>{t.proName}</Text>
          </View>
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
            <Icon name="close" size={16} color={p.ink.a70} />
          </Pressable>
        </View>

        <LinearGradient
          colors={[p.accentAlpha.a16, p.accentAlpha.a04]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <Image source={BRAND_LOGO} style={styles.heroLogo} resizeMode="cover" />
            <View style={styles.heroTextWrap}>
              <Text style={styles.title}>{t.proTitle}</Text>
              <Text style={styles.subtitle}>{t.proSubtitle}</Text>
            </View>
          </View>

          <View style={styles.features}>
            {features.map((line) => (
              <View key={line} style={styles.featureRow}>
                <View style={styles.featureCheck}>
                  <Icon name="check" size={12} color={p.color.onAccent} />
                </View>
                <Text style={styles.featureText}>{line}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {STORE_AVAILABLE && packages.length === 0 ? (
          <Text style={styles.loading}>{t.proLoading}</Text>
        ) : STORE_AVAILABLE ? (
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
                      borderColor: on ? p.color.accent : p.surface.borderStrong,
                      backgroundColor: on ? p.accentAlpha.a12 : p.surface.s045,
                    },
                  ]}
                >
                  <View style={styles.planLeft}>
                    <View style={[styles.radio, { borderColor: on ? p.color.accent : p.surface.ring }]}>
                      {on && <View style={styles.radioDot} />}
                    </View>
                    <View>
                      <View style={styles.planText}>
                        <Text style={styles.planName}>
                          {yearly ? t.proYearly : t.proMonthly}
                        </Text>
                        {yearly && <Text style={styles.planNote}>{t.proYearlyNote}</Text>}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.planPrice}>{pkg.product.priceString}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.plans}>
            {previewPlans.map((plan) => {
              const on = plan.id === selected;
              return (
                <Pressable
                  key={plan.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={`${plan.yearly ? t.proYearly : t.proMonthly} ${plan.price}`}
                  onPress={() => {
                    tapLight();
                    setSelected(plan.id);
                  }}
                  style={[
                    styles.plan,
                    {
                      borderColor: on ? p.color.accent : p.surface.borderStrong,
                      backgroundColor: on ? p.accentAlpha.a12 : p.surface.s045,
                    },
                  ]}
                >
                  <View style={styles.planLeft}>
                    <View style={[styles.radio, { borderColor: on ? p.color.accent : p.surface.ring }]}>
                      {on && <View style={styles.radioDot} />}
                    </View>
                    <View>
                      <View style={styles.planText}>
                        <Text style={styles.planName}>
                          {plan.yearly ? t.proYearly : t.proMonthly}
                        </Text>
                        {plan.yearly && <Text style={styles.planNote}>{t.proYearlyNote}</Text>}
                      </View>
                      <Text style={styles.planSub}>{plan.sub}</Text>
                    </View>
                  </View>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {notice && (
          <View style={styles.noticeBox}>
            <Icon name="lock" size={14} color={p.color.accent} />
            <Text style={styles.notice}>{notice}</Text>
          </View>
        )}

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

        <View style={styles.footerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.proRestore}
            onPress={doRestore}
            disabled={busy}
          >
            <Text style={styles.footerLink}>{t.proRestore}</Text>
          </Pressable>
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
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t.privacyPolicyA11y}
            onPress={() => {
              tapLight();
              Linking.openURL(PRIVACY_URL);
            }}
          >
            <Text style={styles.footerLink}>{t.privacyPolicy}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={lang === 'th' ? 'ข้อกำหนดการใช้งาน' : 'Terms of Use'}
            onPress={() => {
              tapLight();
              Linking.openURL(TERMS_URL);
            }}
          >
            <Text style={styles.footerLink}>
              {lang === 'th' ? 'ข้อกำหนดการใช้งาน' : 'Terms of Use'}
            </Text>
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
      marginBottom: 18,
    },
    proBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 5,
      paddingHorizontal: 11,
      borderRadius: radius.pill,
      backgroundColor: p.accentAlpha.a16,
      borderWidth: 1,
      borderColor: p.accentAlpha.a28,
    },
    eyebrow: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 11.5,
      color: p.color.accentSoft,
      letterSpacing: 0.4,
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surface.s07,
      borderWidth: 1,
      borderColor: p.surface.border,
    },
    heroCard: {
      padding: 20,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: p.accentAlpha.a28,
      marginBottom: 22,
    },
    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 18,
    },
    heroLogo: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: p.accentAlpha.a16,
    },
    heroTextWrap: { flex: 1 },
    title: {
      fontFamily: t.font.serif,
      fontWeight: '700',
      fontSize: 24,
      lineHeight: t.line(24, 30),
      color: p.color.ink,
      marginBottom: 4,
    },
    subtitle: {
      fontFamily: t.font.sans,
      fontSize: 13,
      lineHeight: t.line(13, 18),
      color: p.ink.a60,
    },
    features: { gap: 11 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
    featureCheck: {
      width: 22,
      height: 22,
      borderRadius: 99,
      backgroundColor: p.color.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureText: {
      flex: 1,
      fontFamily: t.font.sansMedium,
      fontWeight: '500',
      fontSize: 13.5,
      lineHeight: t.line(13.5, 19),
      color: p.color.ink,
    },
    plans: { gap: 10, marginBottom: 20 },
    plan: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 15,
      paddingHorizontal: 16,
      borderRadius: radius.xl,
      borderWidth: 1.5,
    },
    planLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 99,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioDot: { width: 10, height: 10, borderRadius: 99, backgroundColor: p.color.accent },
    planText: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    planName: { fontFamily: t.font.sansMedium, fontWeight: '700', fontSize: 15.5, color: p.color.ink },
    planSub: {
      fontFamily: t.font.sans,
      fontSize: 11.5,
      color: p.ink.a55,
      marginTop: 2,
    },
    planNote: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 10,
      color: p.color.onAccent,
      backgroundColor: p.color.accent,
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: radius.pill,
      overflow: 'hidden',
    },
    planPrice: { fontFamily: t.font.sansBold, fontWeight: '700', fontSize: 15.5, color: p.color.ink },
    loading: {
      fontFamily: t.font.sans,
      fontSize: 13.5,
      color: p.ink.a45,
      textAlign: 'center',
      marginBottom: 20,
    },
    noticeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: radius.md,
      backgroundColor: p.accentAlpha.a12,
      borderWidth: 1,
      borderColor: p.accentAlpha.a28,
      marginBottom: 16,
    },
    notice: {
      flex: 1,
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 12.5,
      lineHeight: t.line(12.5, 18),
      color: p.color.accentSoft,
    },
    cta: {
      paddingVertical: 16,
      borderRadius: radius.lg,
      backgroundColor: p.color.accent,
      alignItems: 'center',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.16,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    ctaPressed: { backgroundColor: p.color.accentHover },
    ctaBusy: { opacity: 0.6 },
    ctaText: { fontFamily: t.font.sansMedium, fontWeight: '700', fontSize: 16, color: p.color.onAccent },
    footerActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 18,
      marginBottom: 20,
    },
    footerLink: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 13, color: p.ink.a55 },
    terms: {
      fontFamily: t.font.sans,
      fontSize: 11,
      lineHeight: t.line(11, 16),
      color: p.ink.a40,
      textAlign: 'center',
    },
  });
