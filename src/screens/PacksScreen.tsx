import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
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

import { LangToggle } from '../components/LangToggle';
import { PACK_IDS, type PackId } from '../data/decks';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import {
  accentAlpha,
  color,
  ink,
  radius,
  screenPad,
  surface,
  type Typo,
} from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';

/**
 * The two setting switches.
 *
 * react-native-web paints the "on" thumb with its own `activeThumbColor` — a
 * Material teal — and ignores `thumbColor` entirely, so the accent has to be
 * handed over twice for the switch to match the app on web.
 */
function SettingSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: surface.s11, true: accentAlpha.a50 }}
      thumbColor={value ? color.accent : '#8d8598'}
      {...(Platform.OS === 'web' ? ({ activeThumbColor: color.accent } as object) : null)}
    />
  );
}

const TIMER_MIN = 30;
const TIMER_MAX = 300;
const TIMER_STEP = 15;

export function PacksScreen({ onPlayPack }: { onPlayPack: (id: PackId) => void }) {
  const insets = useSafeAreaInsets();
  const { custom, addCustom, removeCustom, prefs, setPrefs } = useStore();
  const { t, content } = useI18n();
  const styles = useStyles(makeStyles);
  const [selected, setSelected] = useState<PackId | null>(null);
  const [draft, setDraft] = useState('');

  const submitCustom = () => {
    if (!draft.trim()) return;
    addCustom(draft);
    setDraft('');
  };

  // Thai has no case to lower, so the same call is a no-op there.
  const selectedName =
    selected === 'custom'
      ? t.yourPackLower
      : selected
        ? content.packs[selected].name.toLowerCase()
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
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + (selected ? 180 : 108) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t.packsTitle}</Text>
        <Text style={styles.subtitle}>{t.packsSubtitle}</Text>

        <View style={styles.packList}>
          {PACK_IDS.map((id) => {
            const on = selected === id;
            const pack = content.packs[id];
            return (
              <Pressable
                key={id}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={t.packA11y(pack.name, pack.blurb, pack.questions.length)}
                onPress={() => {
                  tapLight();
                  setSelected(on ? null : id);
                }}
                style={[
                  styles.pack,
                  {
                    backgroundColor: on ? accentAlpha.a12 : surface.s045,
                    borderColor: on ? accentAlpha.a45 : surface.border,
                  },
                ]}
              >
                <View style={styles.packText}>
                  <Text style={styles.packName}>{pack.name}</Text>
                  <Text style={styles.packBlurb}>{pack.blurb}</Text>
                </View>
                <View
                  style={[
                    styles.tag,
                    { backgroundColor: on ? accentAlpha.a22 : surface.s07 },
                  ]}
                >
                  <Text style={[styles.tagText, { color: on ? color.accentSoft : ink.a55 }]}>
                    {pack.tag}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.customBox}>
          <View style={styles.customHead}>
            <View style={styles.customHeadText}>
              <Text style={styles.packName}>{t.writeYourOwn}</Text>
              <Text style={styles.packBlurb}>{t.customCount(custom.length)}</Text>
            </View>
            {custom.length > 0 && (
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
                      selected === 'custom' ? accentAlpha.a22 : surface.s07,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: selected === 'custom' ? color.accentSoft : ink.a55 },
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
              placeholder={t.customPlaceholder}
              placeholderTextColor={ink.a35}
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

          <View style={styles.customList}>
            {custom.map((q) => (
              <View key={q} style={styles.customRow}>
                <Text style={styles.customDash}>—</Text>
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
                  <Text style={styles.customRemove}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionEyebrow}>{t.appSection}</Text>
        <View style={[styles.settings, styles.settingsGap]}>
          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={styles.settingText}>
              <Text style={styles.settingName}>{t.language}</Text>
              <Text style={styles.settingBlurb}>{t.languageBlurb}</Text>
            </View>
            <LangToggle />
          </View>
        </View>

        <Text style={styles.sectionEyebrow}>{t.sessionSection}</Text>
        <View style={styles.settings}>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingName}>{t.turnTimer}</Text>
              <Text style={styles.settingBlurb}>{t.turnTimerBlurb}</Text>
            </View>
            <SettingSwitch
              value={prefs.showTimer}
              onValueChange={(v) => setPrefs({ showTimer: v })}
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
              value={prefs.allowSkip}
              onValueChange={(v) => setPrefs({ allowSkip: v })}
            />
          </View>
        </View>
      </ScrollView>

      {selected && (
        <LinearGradient
          colors={['rgba(20,16,27,0)', color.bg, color.bg]}
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

const makeStyles = (t: Typo) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: color.bg },
    content: { paddingHorizontal: screenPad },
    title: { fontFamily: t.font.serif, fontSize: 36, lineHeight: t.line(36, 38), color: color.ink, marginBottom: 6 },
    subtitle: { fontFamily: t.font.sans, fontSize: 13.5, lineHeight: t.line(13.5, 20), color: ink.a45, marginBottom: 24 },
    packList: { gap: 11, marginBottom: 26 },
    pack: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 14,
      padding: 18,
      borderRadius: radius.xl,
      borderWidth: 1,
    },
    packText: { flex: 1 },
    packName: { fontFamily: t.font.serif, fontSize: 22, lineHeight: t.line(22, 25), color: color.ink, marginBottom: 5 },
    packBlurb: { fontFamily: t.font.sans, fontSize: 12, lineHeight: t.line(12, 17), color: ink.a48 },
    tag: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: radius.pill },
    tagText: { fontFamily: t.font.sansMedium, fontSize: 12 },
    customBox: {
      padding: 18,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: surface.dashedStrong,
      marginBottom: 30,
    },
    customHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
    customHeadText: { flex: 1 },
    inputRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    input: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: surface.borderStrong,
      backgroundColor: surface.s04,
      color: color.ink,
      fontFamily: t.font.sans,
      fontSize: 13.5,
    },
    addBtn: {
      paddingHorizontal: 16,
      justifyContent: 'center',
      borderRadius: radius.sm,
      backgroundColor: surface.s10,
    },
    addBtnPressed: { backgroundColor: surface.s07 },
    addBtnText: { fontFamily: t.font.sansMedium, fontSize: 13.5, color: color.ink },
    customList: { gap: 8 },
    customRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
    customDash: { fontFamily: t.font.sans, fontSize: 13.5, lineHeight: t.line(13.5, 19), color: accentAlpha.a85 },
    customText: { flex: 1, fontFamily: t.font.sans, fontSize: 13.5, lineHeight: t.line(13.5, 19), color: ink.a72 },
    customRemove: { fontFamily: t.font.sans, fontSize: 16, lineHeight: t.line(13.5, 19), color: ink.a35 },
    sectionEyebrow: { ...t.eyebrow, color: ink.a40, marginBottom: 12 },
    settingsGap: { marginBottom: 26 },
    settings: {
      borderRadius: radius.xl,
      backgroundColor: surface.s045,
      borderWidth: 1,
      borderColor: surface.border,
      overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: surface.border,
    },
    settingRowLast: { borderBottomWidth: 0 },
    settingText: { flex: 1 },
    settingName: { fontFamily: t.font.sansMedium, fontSize: 15, color: color.ink },
    settingBlurb: { fontFamily: t.font.sans, fontSize: 11.5, lineHeight: t.line(11.5, 16), color: ink.a45, marginTop: 2 },
    stepper: { flexDirection: 'row', gap: 8 },
    stepBtn: {
      width: 36,
      height: 36,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: surface.s07,
    },
    stepGlyph: { fontFamily: t.font.sansMedium, fontSize: 18, color: color.ink },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: 26,
      paddingHorizontal: screenPad,
    },
    cta: {
      paddingVertical: 17,
      borderRadius: radius.lg,
      backgroundColor: color.accent,
      alignItems: 'center',
    },
    ctaPressed: { backgroundColor: color.accentHover },
    ctaText: { fontFamily: t.font.sansMedium, fontSize: 16, color: color.onAccent },
  });
