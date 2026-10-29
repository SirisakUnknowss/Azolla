import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../components/Icon';
import { LangToggle } from '../components/LangToggle';
import { ThemeToggle } from '../components/ThemeToggle';
import { PACK_IDS, PACK_IMAGES, type PackId } from '../data/decks';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import { useSubscription } from '../subscription';
import { useTheme } from '../theme';
import { radius, screenPad, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';
import { COFFEE_URL, PRIVACY_URL, TERMS_URL } from '../util/links';

function SettingSwitch({
  value,
  onValueChange,
  p,
}: {
  value: boolean;
  onValueChange: (next: boolean) => void;
  p: Palette;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: p.surface.s11, true: p.accentAlpha.a50 }}
      thumbColor={value ? p.color.accent : '#8d8598'}
      {...(Platform.OS === 'web' ? ({ activeThumbColor: p.color.accent } as object) : null)}
    />
  );
}

const TIMER_MIN = 30;
const TIMER_MAX = 300;
const TIMER_STEP = 15;

export function PacksScreen({
  onPlayPack,
  onOpenPaywall,
}: {
  onPlayPack: (id: PackId) => void;
  onOpenPaywall: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { custom, addCustom, removeCustom, prefs, setPrefs } = useStore();
  const { lang, t, content } = useI18n();
  const { palette: p } = useTheme();
  const { isPro, isPackLocked } = useSubscription();
  const styles = useStyles(makeStyles);
  const [selected, setSelected] = useState<PackId | null>(null);
  const [draft, setDraft] = useState('');

  const customLocked = isPackLocked('custom');

  const submitCustom = () => {
    if (customLocked) {
      onOpenPaywall();
      return;
    }
    if (!draft.trim()) return;
    addCustom(draft);
    setDraft('');
  };

  const selectedName =
    selected === 'custom'
      ? t.yourPackLower
      : selected
        ? content.packs[selected].name
        : '';

  const adjustTimer = (delta: number) => {
    const next = Math.min(TIMER_MAX, Math.max(TIMER_MIN, prefs.timerSeconds + delta));
    if (next === prefs.timerSeconds) return;
    tapLight();
    setPrefs({ timerSeconds: next });
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + (selected ? 180 : 112) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t.packsTitle}</Text>
        <Text style={styles.subtitle}>{t.packsSubtitle}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPro ? 'Azolla Pro active' : t.proCta}
          onPress={() => {
            tapLight();
            if (!isPro) onOpenPaywall();
          }}
          style={({ pressed }) => [styles.proBannerWrap, pressed && !isPro && { opacity: 0.92 }]}
        >
          <LinearGradient
            colors={[p.accentAlpha.a16, p.accentAlpha.a04]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proBanner}
          >
            <View style={styles.proBannerIcon}>
              <Icon name={isPro ? 'check' : 'crown'} size={18} color={p.color.onAccent} />
            </View>
            <View style={styles.proBannerText}>
              <Text style={styles.proBannerTitle}>
                {isPro
                  ? lang === 'th'
                    ? 'สถานะสมาชิก: Azolla Pro'
                    : 'Membership: Azolla Pro'
                  : lang === 'th'
                    ? 'อัปเกรดเป็น Azolla Pro'
                    : 'Upgrade to Azolla Pro'}
              </Text>
              <Text style={styles.proBannerSub}>
                {isPro
                  ? lang === 'th'
                    ? 'ปลดล็อกครบทุกสำรับ ทุกระดับความลึก และเขียนคำถามเองได้ไม่จำกัด'
                    : 'All decks, all 10 depth levels, and custom cards unlocked'
                  : lang === 'th'
                    ? 'ปลดล็อกครบทั้ง 900 คำถาม · ทุกระดับความลึก 1–10 · เขียนคำถามเอง'
                    : 'Unlock all 900 questions · Levels 1–10 · Custom deck'}
              </Text>
            </View>
            {!isPro && (
              <View style={styles.proBannerBtn}>
                <Text style={styles.proBannerBtnText}>{t.proBadge}</Text>
              </View>
            )}
          </LinearGradient>
        </Pressable>

        <Text style={styles.sectionEyebrow}>{t.themedPacksSection}</Text>
        <View style={styles.packList}>
          {PACK_IDS.map((id) => {
            const on = selected === id;
            const pack = content.packs[id];
            const img = PACK_IMAGES[id];
            const locked = isPackLocked(id);
            return (
              <Pressable
                key={id}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={
                  locked
                    ? t.lockedA11y(pack.name)
                    : t.packA11y(pack.name, pack.blurb, pack.questions.length)
                }
                onPress={() => {
                  tapLight();
                  if (locked) {
                    onOpenPaywall();
                    return;
                  }
                  setSelected(on ? null : id);
                }}
                style={[
                  styles.pack,
                  {
                    backgroundColor: on ? p.surface.s09 : p.surface.s045,
                    borderColor: on ? p.color.accent : p.surface.borderStrong,
                  },
                ]}
              >
                <Image source={img} style={styles.packImage} resizeMode="cover" />
                <View style={styles.packText}>
                  <Text style={styles.packName}>{pack.name}</Text>
                  <Text style={styles.packBlurb}>{pack.blurb}</Text>
                  <Text style={styles.packCountText}>
                    {t.packQuestionsCount(pack.questions.length)}
                  </Text>
                </View>
                {locked ? (
                  <View style={styles.proTag}>
                    <Icon name="lock" size={12} color="#d97706" />
                    <Text style={styles.proTagText}>{t.proBadge}</Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.tag,
                      { backgroundColor: on ? p.color.accent : p.accentAlpha.a12 },
                    ]}
                  >
                    {on ? (
                      <Icon name="check" size={14} color={p.color.onAccent} />
                    ) : (
                      <Text style={[styles.tagText, { color: p.color.accentSoft }]}>
                        {pack.tag}
                      </Text>
                    )}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.customBox}>
          <View style={styles.customHead}>
            <View style={styles.packIconWrap}>
              <Icon name="pen" size={18} color={p.color.accent} />
            </View>
            <View style={styles.customHeadText}>
              <Text style={styles.packName}>{t.writeYourOwn}</Text>
              <Text style={styles.packBlurb}>{t.customCount(custom.length)}</Text>
            </View>
            {customLocked && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.lockedA11y(t.writeYourOwn)}
                onPress={() => {
                  tapLight();
                  onOpenPaywall();
                }}
                style={styles.proTag}
              >
                <Icon name="lock" size={12} color="#d97706" />
                <Text style={styles.proTagText}>{t.proBadge}</Text>
              </Pressable>
            )}
            {!customLocked && custom.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: selected === 'custom' }}
                accessibilityLabel={t.selectYourPackA11y}
                onPress={() => {
                  tapLight();
                  setSelected(selected === 'custom' ? null : 'custom');
                }}
                style={[
                  styles.tag,
                  {
                    backgroundColor:
                      selected === 'custom' ? p.color.accent : p.accentAlpha.a12,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: selected === 'custom' ? p.color.onAccent : p.color.accentSoft },
                  ]}
                >
                  {selected === 'custom' ? t.selected : t.select}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.inputRow}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={submitCustom}
              editable={!customLocked}
              placeholder={t.customPlaceholder}
              placeholderTextColor={p.ink.a40}
              returnKeyType="done"
              style={styles.input}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.addQuestionA11y}
              onPress={submitCustom}
              style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
            >
              <Text style={styles.addBtnText}>{t.add}</Text>
            </Pressable>
          </View>

          {custom.length > 0 && (
            <View style={styles.customList}>
              {custom.map((q) => (
                <View key={q} style={styles.customRow}>
                  <Text style={styles.customDash}>•</Text>
                  <Text style={styles.customText}>{q}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t.removeA11y(q)}
                    hitSlop={8}
                    onPress={() => {
                      tapLight();
                      removeCustom(q);
                    }}
                  >
                    <Icon name="close" size={14} color={p.ink.a45} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.sectionEyebrow}>{t.appSection}</Text>
        <View style={[styles.settings, styles.settingsGap]}>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingName}>{t.language}</Text>
              <Text style={styles.settingBlurb}>{t.languageBlurb}</Text>
            </View>
            <LangToggle />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingName}>{t.theme}</Text>
              <Text style={styles.settingBlurb}>{t.themeBlurb}</Text>
            </View>
            <ThemeToggle />
          </View>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t.privacyPolicyA11y}
            onPress={() => {
              tapLight();
              Linking.openURL(PRIVACY_URL);
            }}
            style={styles.settingRow}
          >
            <View style={styles.settingText}>
              <Text style={styles.settingName}>{t.privacyPolicy}</Text>
              <Text style={styles.settingBlurb}>{t.privacyPolicyBlurb}</Text>
            </View>
            <Icon name="external" size={16} color={p.ink.a55} />
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={lang === 'th' ? 'เปิดข้อกำหนดการใช้งาน' : 'Open Terms of Use'}
            onPress={() => {
              tapLight();
              Linking.openURL(TERMS_URL);
            }}
            style={styles.settingRow}
          >
            <View style={styles.settingText}>
              <Text style={styles.settingName}>
                {lang === 'th' ? 'ข้อกำหนดการใช้งาน (EULA)' : 'Terms of Use (EULA)'}
              </Text>
              <Text style={styles.settingBlurb}>
                {lang === 'th'
                  ? 'เงื่อนไขการสมัครสมาชิกและเกณฑ์อายุผู้เล่น 18+'
                  : 'Subscription terms and 18+ mature content policy'}
              </Text>
            </View>
            <Icon name="external" size={16} color={p.ink.a55} />
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t.buyCoffeeA11y}
            onPress={() => {
              tapLight();
              Linking.openURL(COFFEE_URL);
            }}
            style={[styles.settingRow, styles.settingRowLast]}
          >
            <View style={styles.settingText}>
              <Text style={styles.settingName}>{t.buyCoffee}</Text>
              <Text style={styles.settingBlurb}>{t.buyCoffeeBlurb}</Text>
            </View>
            <Icon name="coffee" size={16} color={p.color.accent} />
          </Pressable>
        </View>

        <Text style={styles.sectionEyebrow}>{t.sessionSection}</Text>
        <View style={styles.settings}>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingName}>{t.turnTimer}</Text>
              <Text style={styles.settingBlurb}>{t.turnTimerBlurb}</Text>
            </View>
            <SettingSwitch
              key={`showTimer-${p.color.accent}`}
              value={prefs.showTimer}
              onValueChange={(v) => setPrefs({ showTimer: v })}
              p={p}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingName}>{t.timePerTurn}</Text>
              <Text style={styles.settingBlurb}>
                {t.minutes(
                  `${Math.floor(prefs.timerSeconds / 60)}:${String(prefs.timerSeconds % 60).padStart(2, '0')}`,
                )}
              </Text>
            </View>
            <View style={styles.stepper}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.lessTimeA11y}
                onPress={() => adjustTimer(-TIMER_STEP)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepGlyph}>−</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.moreTimeA11y}
                onPress={() => adjustTimer(TIMER_STEP)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepGlyph}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={styles.settingText}>
              <Text style={styles.settingName}>{t.allowPassing}</Text>
              <Text style={styles.settingBlurb}>{t.allowPassingBlurb}</Text>
            </View>
            <SettingSwitch
              key={`allowSkip-${p.color.accent}`}
              value={prefs.allowSkip}
              onValueChange={(v) => setPrefs({ allowSkip: v })}
              p={p}
            />
          </View>
        </View>
      </ScrollView>

      {selected && (
        <LinearGradient
          colors={[p.color.bgFade, p.color.bg, p.color.bg]}
          locations={[0, 0.45, 1]}
          style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 84 }]}
          pointerEvents="box-none"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.dealFrom(selectedName)}
            onPress={() => {
              tapLight();
              onPlayPack(selected);
            }}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text style={styles.ctaText}>{t.dealFrom(selectedName)}</Text>
          </Pressable>
        </LinearGradient>
      )}
    </View>
  );
}

const makeStyles = (t: Typo, p: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: p.color.bg },
    content: { paddingHorizontal: screenPad },
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
      fontSize: 13.5,
      lineHeight: t.line(13.5, 20),
      color: p.ink.a55,
      marginBottom: 22,
    },
    sectionEyebrow: { ...t.eyebrow, color: p.ink.a50, marginBottom: 10 },
    proBannerWrap: {
      marginBottom: 22,
      borderRadius: radius.xl,
      overflow: 'hidden',
    },
    proBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 15,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: p.accentAlpha.a28,
    },
    proBannerIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor: p.color.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    proBannerText: {
      flex: 1,
      gap: 2,
    },
    proBannerTitle: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 15,
      color: p.color.ink,
    },
    proBannerSub: {
      fontFamily: t.font.sans,
      fontSize: 12,
      lineHeight: t.line(12, 16),
      color: p.ink.a60,
    },
    proBannerBtn: {
      paddingVertical: 6,
      paddingHorizontal: 11,
      borderRadius: radius.pill,
      backgroundColor: p.color.accent,
    },
    proBannerBtnText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 11,
      color: p.color.onAccent,
    },
    packList: { gap: 11, marginBottom: 20 },
    pack: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: 15,
      borderRadius: radius.xl,
      borderWidth: 1.5,
    },
    packImage: {
      width: 52,
      height: 52,
      borderRadius: 14,
      backgroundColor: p.surface.s06,
    },
    packIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: p.surface.s06,
      alignItems: 'center',
      justifyContent: 'center',
    },
    packText: { flex: 1 },
    packName: {
      fontFamily: t.font.serif,
      fontWeight: '700',
      fontSize: 16.5,
      lineHeight: t.line(16.5, 22),
      color: p.color.ink,
      marginBottom: 2,
    },
    packBlurb: {
      fontFamily: t.font.sans,
      fontSize: 12,
      lineHeight: t.line(12, 17),
      color: p.ink.a55,
    },
    packCountText: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 11,
      color: p.color.accentSoft,
      marginTop: 4,
    },
    tag: {
      paddingVertical: 6,
      paddingHorizontal: 11,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagText: { fontFamily: t.font.sansBold, fontWeight: '700', fontSize: 11.5 },
    proTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: radius.pill,
      backgroundColor: 'rgba(245, 158, 11, 0.14)',
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.32)',
    },
    proTagText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 10.5,
      color: '#b45309',
    },
    customBox: {
      padding: 16,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      backgroundColor: p.surface.s045,
      marginBottom: 28,
    },
    customHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    customHeadText: { flex: 1 },
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
      fontSize: 13.5,
    },
    addBtn: {
      paddingHorizontal: 16,
      justifyContent: 'center',
      borderRadius: radius.sm,
      backgroundColor: p.color.accent,
    },
    addBtnPressed: { backgroundColor: p.color.accentHover },
    addBtnText: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 13.5, color: p.color.onAccent },
    customList: { gap: 8, marginTop: 12 },
    customRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    customDash: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 14,
      lineHeight: t.line(13.5, 19),
      color: p.color.accent,
    },
    customText: {
      flex: 1,
      fontFamily: t.font.sans,
      fontSize: 13.5,
      lineHeight: t.line(13.5, 19),
      color: p.ink.a75,
    },
    settingsGap: { marginBottom: 26 },
    settings: {
      borderRadius: radius.xl,
      backgroundColor: p.surface.s045,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: p.surface.border,
    },
    settingRowLast: { borderBottomWidth: 0 },
    settingText: { flex: 1 },
    settingName: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 14.5, color: p.color.ink },
    settingBlurb: {
      fontFamily: t.font.sans,
      fontSize: 12,
      lineHeight: t.line(12, 16),
      color: p.ink.a55,
      marginTop: 2,
    },
    stepper: { flexDirection: 'row', gap: 8 },
    stepBtn: {
      width: 36,
      height: 36,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surface.s07,
    },
    stepGlyph: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 18, color: p.color.ink },
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
    ctaText: { fontFamily: t.font.sansMedium, fontWeight: '700', fontSize: 15.5, color: p.color.onAccent },
  });
