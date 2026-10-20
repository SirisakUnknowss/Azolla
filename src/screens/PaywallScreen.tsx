import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PurchasesPackage } from 'react-native-purchases';

import { Icon } from '../components/Icon';
import { BRAND_LOGO } from '../data/decks';
import { useI18n } from '../i18n';
import { STORE_AVAILABLE, useSubscription } from '../subscription';
import {
  PROMPTPAY_ID,
  SUPPORT_EMAIL,
  WEB_CHECKOUT_URL_MONTHLY,
  WEB_CHECKOUT_URL_YEARLY,
} from '../subscription/config';
import { useTheme } from '../theme';
import { radius, screenPad, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight, tapMedium } from '../util/haptics';
import { buildPromptPayPayload } from '../util/promptpay';

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
  const { packages, purchase, restore, redeemCode, isPro } = useSubscription();
  const [selected, setSelected] = useState<string>('yearly');
  const [busy, setBusy] = useState(false);
  const [showWebPay, setShowWebPay] = useState(false);
  const [licenseInput, setLicenseInput] = useState('');
  const [notice, setNotice] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (packages.length === 0) return;
    const preferred = packages.find(isYearly) ?? packages[0];
    setSelected(preferred.identifier);
  }, [packages]);

  useEffect(() => {
    if (isPro) onClose();
  }, [isPro, onClose]);

  const selectedAmount = selected === 'yearly' ? 590 : 99;
  const selectedPlanLabel =
    selected === 'yearly'
      ? lang === 'th'
        ? 'รายปี (฿590)'
        : 'Yearly (฿590)'
      : lang === 'th'
        ? 'รายเดือน (฿99)'
        : 'Monthly (฿99)';

  const checkoutUrl =
    selected === 'yearly' ? WEB_CHECKOUT_URL_YEARLY : WEB_CHECKOUT_URL_MONTHLY;

  const buy = async () => {
    if (!STORE_AVAILABLE) {
      tapMedium();
      setNotice(null);
      if (checkoutUrl) {
        Linking.openURL(checkoutUrl);
      }
      setShowWebPay(true);
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

  const handleRedeem = async () => {
    const trimmed = licenseInput.trim();
    if (!trimmed || busy) {
      setNotice({
        text:
          lang === 'th'
            ? 'กรุณากรอกรหัสปลดล็อก (Unlock Code / License Key) ก่อนกดยืนยัน'
            : 'Please enter your Unlock Code or License Key first.',
        isError: true,
      });
      return;
    }
    tapMedium();
    setBusy(true);
    setNotice(null);
    const ok = await redeemCode(trimmed);
    setBusy(false);
    if (ok) {
      onClose();
    } else {
      setNotice({
        text:
          lang === 'th'
            ? 'รหัสปลดล็อกไม่ถูกต้อง กรุณาตรวจสอบรหัสอีกครั้ง'
            : 'Invalid unlock code or license key. Please check and try again.',
        isError: true,
      });
    }
  };

  const doRestore = async () => {
    if (busy) return;
    tapLight();
    setBusy(true);
    const ok = await restore();
    setBusy(false);
    if (ok) {
      setNotice({ text: t.proRestored });
    } else if (!STORE_AVAILABLE) {
      setShowWebPay(true);
      setNotice({
        text:
          lang === 'th'
            ? 'หากมีรหัสปลดล็อกอยู่แล้ว สามารถกรอกในช่องด้านล่างเพื่อกู้คืนสิทธิ์ Pro ได้ทันที'
            : 'Enter your Unlock Code or License Key below to restore Pro on this device.',
      });
    } else {
      setNotice({ text: t.proRestoreFailed, isError: true });
    }
  };

  const sendSlipEmail = () => {
    tapLight();
    const subject = encodeURIComponent(`แจ้งชำระเงิน Azolla Pro — แพ็กเกจ${selectedPlanLabel}`);
    const body = encodeURIComponent(
      lang === 'th'
        ? `สวัสดีทีมงาน Azolla,\n\nฉันได้ชำระเงินสมัคร Azolla Pro แพ็กเกจ ${selectedPlanLabel} เรียบร้อยแล้ว (แนบสลิปการโอนเงินมาพร้อมอีเมลฉบับนี้)\n\nรบกวนส่งรหัสปลดล็อก (Unlock Code) ให้ด้วยครับ/ค่ะ`
        : `Hi Azolla team,\n\nI have completed payment for Azolla Pro (${selectedPlanLabel}). Please find my payment receipt attached and send my Unlock Code.`,
    );
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
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
      price: lang === 'th' ? '฿590 / ปี' : '฿590 / yr',
      sub: lang === 'th' ? 'เฉลี่ยเพียง ฿49 / เดือน' : 'Just ฿49 / month',
    },
    {
      id: 'monthly',
      yearly: false,
      price: lang === 'th' ? '฿99 / เดือน' : '฿99 / mo',
      sub: lang === 'th' ? 'ยกเลิกได้ทุกเมื่อ' : 'Cancel anytime',
    },
  ];

  const qrPayload = PROMPTPAY_ID
    ? buildPromptPayPayload(PROMPTPAY_ID, selectedAmount)
    : '';
  const qrImageUrl = qrPayload
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(qrPayload)}`
    : '';

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 36 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.proBadge}>
            <Icon name="crown" size={14} color="#d97706" />
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

        {!showWebPay && (
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
            <Text style={styles.ctaText}>
              {!STORE_AVAILABLE
                ? lang === 'th'
                  ? `ดำเนินการชำระเงิน · ฿${selectedAmount}`
                  : `Continue to Payment · ฿${selectedAmount}`
                : t.proCta}
            </Text>
          </Pressable>
        )}

        {!STORE_AVAILABLE && showWebPay && (
          <View style={styles.webPayCard}>
            <Text style={styles.webPayTitle}>
              {lang === 'th'
                ? `ชำระเงินแพ็กเกจ${selectedPlanLabel}`
                : `Complete Payment — ${selectedPlanLabel}`}
            </Text>

            {qrImageUrl ? (
              <View style={styles.qrSection}>
                <View style={styles.qrBox}>
                  <Image
                    source={{ uri: qrImageUrl }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.qrHint}>
                  {lang === 'th'
                    ? `สแกน QR พร้อมเพย์ด้วยแอปธนาคารใดก็ได้ (ยอดชำระ ฿${selectedAmount}.00)`
                    : `Scan Thai PromptPay QR with any banking app (Amount: ฿${selectedAmount}.00)`}
                </Text>
              </View>
            ) : (
              <Text style={styles.webPayStep}>
                {lang === 'th'
                  ? '1. กดปุ่มด้านล่างเพื่อชำระเงิน หรือแจ้งรับ QR พร้อมเพย์และส่งสลิปเพื่อรับรหัสปลดล็อก (Unlock Code)'
                  : '1. Click below to complete payment or send your transfer receipt to receive your Unlock Code.'}
              </Text>
            )}

            <View style={styles.webPayButtons}>
              {!!checkoutUrl && (
                <Pressable
                  accessibilityRole="link"
                  onPress={() => {
                    tapLight();
                    Linking.openURL(checkoutUrl);
                  }}
                  style={({ pressed }) => [
                    styles.checkoutLinkBtn,
                    pressed && styles.ctaPressed,
                  ]}
                >
                  <Icon name="external" size={14} color={p.color.onAccent} />
                  <Text style={styles.checkoutLinkText}>
                    {lang === 'th'
                      ? 'ชำระผ่านบัตรเครดิต / ลิงก์ชำระเงินออนไลน์'
                      : 'Pay via Online Checkout Link'}
                  </Text>
                </Pressable>
              )}

              <Pressable
                accessibilityRole="button"
                onPress={sendSlipEmail}
                style={({ pressed }) => [
                  styles.slipBtn,
                  pressed && { backgroundColor: p.surface.s10 },
                ]}
              >
                <Icon name="external" size={14} color={p.color.accent} />
                <Text style={styles.slipBtnText}>
                  {lang === 'th'
                    ? 'ส่งสลิปโอนเงินเพื่อรับรหัสปลดล็อก Pro'
                    : 'Send Payment Slip to Get Unlock Code'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {!STORE_AVAILABLE && (
          <View style={styles.redeemBox}>
            <Text style={styles.redeemLabel}>
              {lang === 'th'
                ? 'มีรหัสปลดล็อก (Unlock Code / License Key) แล้ว?'
                : 'Already have an Unlock Code or License Key?'}
            </Text>
            <View style={styles.redeemRow}>
              <TextInput
                value={licenseInput}
                onChangeText={setLicenseInput}
                onSubmitEditing={handleRedeem}
                placeholder={lang === 'th' ? 'เช่น AZOLLA-XXXX-XXXX' : 'e.g. AZOLLA-XXXX-XXXX'}
                placeholderTextColor={p.ink.a40}
                autoCapitalize="characters"
                autoCorrect={false}
                style={styles.redeemInput}
              />
              <Pressable
                accessibilityRole="button"
                onPress={handleRedeem}
                disabled={busy}
                style={({ pressed }) => [
                  styles.redeemBtn,
                  pressed && styles.ctaPressed,
                  busy && styles.ctaBusy,
                ]}
              >
                <Text style={styles.redeemBtnText}>
                  {lang === 'th' ? 'ยืนยันรหัส' : 'Verify'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {notice && (
          <View
            style={[
              styles.noticeBox,
              notice.isError && {
                backgroundColor: 'rgba(217, 56, 90, 0.1)',
                borderColor: 'rgba(217, 56, 90, 0.35)',
              },
            ]}
          >
            <Icon
              name={notice.isError ? 'shield' : 'check'}
              size={15}
              color={notice.isError ? p.color.danger : p.color.accent}
            />
            <Text
              style={[
                styles.notice,
                notice.isError && { color: p.color.danger },
              ]}
            >
              {notice.text}
            </Text>
          </View>
        )}

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
      backgroundColor: 'rgba(245, 158, 11, 0.14)',
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.35)',
    },
    eyebrow: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 11.5,
      color: '#b45309',
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
      marginBottom: 20,
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
    plans: { gap: 10, marginBottom: 18 },
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
    webPayCard: {
      padding: 16,
      borderRadius: radius.xl,
      backgroundColor: p.surface.s045,
      borderWidth: 1,
      borderColor: p.accentAlpha.a28,
      marginBottom: 16,
      gap: 12,
    },
    webPayTitle: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 15,
      color: p.color.ink,
    },
    webPayStep: {
      fontFamily: t.font.sans,
      fontSize: 13,
      lineHeight: t.line(13, 19),
      color: p.ink.a70,
    },
    qrSection: {
      alignItems: 'center',
      gap: 10,
      paddingVertical: 6,
    },
    qrBox: {
      padding: 12,
      borderRadius: radius.lg,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
    },
    qrImage: {
      width: 190,
      height: 190,
    },
    qrHint: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 12.5,
      color: p.ink.a70,
      textAlign: 'center',
    },
    webPayButtons: {
      gap: 9,
    },
    checkoutLinkBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 13,
      paddingHorizontal: 16,
      borderRadius: radius.md,
      backgroundColor: p.color.accent,
    },
    checkoutLinkText: {
      fontFamily: t.font.sansMedium,
      fontWeight: '700',
      fontSize: 14,
      color: p.color.onAccent,
    },
    slipBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: radius.md,
      backgroundColor: p.surface.s06,
      borderWidth: 1,
      borderColor: p.accentAlpha.a28,
    },
    slipBtnText: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 13.5,
      color: p.color.accentSoft,
    },
    redeemBox: {
      padding: 15,
      borderRadius: radius.xl,
      backgroundColor: p.surface.s045,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      marginBottom: 16,
      gap: 10,
    },
    redeemLabel: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 13,
      color: p.ink.a75,
    },
    redeemRow: {
      flexDirection: 'row',
      gap: 8,
    },
    redeemInput: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 13,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      backgroundColor: p.surface.s05,
      color: p.color.ink,
      fontFamily: t.font.sansMedium,
      fontSize: 13.5,
      letterSpacing: 0.6,
    },
    redeemBtn: {
      paddingHorizontal: 16,
      justifyContent: 'center',
      borderRadius: radius.sm,
      backgroundColor: p.color.accent,
    },
    redeemBtnText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 13,
      color: p.color.onAccent,
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
