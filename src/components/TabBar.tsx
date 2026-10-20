import { BlurView } from 'expo-blur';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import { useTheme } from '../theme';
import { radius, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';

import { Icon, type IconName } from './Icon';

export type TabId = 'home' | 'saved' | 'packs';

const TAB_IDS: readonly TabId[] = ['home', 'saved', 'packs'];

/** Floating pill tab bar with custom geometric icons and saved count badge. */
export function TabBar({ active, onSelect }: { active: TabId; onSelect: (id: TabId) => void }) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { saved } = useStore();
  const { mode, palette: p } = useTheme();
  const styles = useStyles(makeStyles);
  const names: Record<TabId, string> = {
    home: t.tabPlay,
    saved: t.tabKept,
    packs: t.tabPacks,
  };

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) + 8 }]} pointerEvents="box-none">
      <BlurView intensity={50} tint={mode === 'light' ? 'light' : 'dark'} style={styles.shell}>
        {TAB_IDS.map((id) => {
          const on = id === active;
          const showBadge = id === 'saved' && saved.length > 0;
          const iconName: IconName =
            id === 'home'
              ? 'cards'
              : id === 'saved'
                ? on
                  ? 'bookmark-filled'
                  : 'bookmark'
                : 'sliders';
          const iconColor = on ? p.color.onAccent : p.ink.a60;
          const iconBg = on ? p.color.accent : p.color.tabShell;

          return (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={names[id]}
              onPress={() => {
                if (!on) tapLight();
                onSelect(id);
              }}
              style={({ pressed }) => [
                styles.tab,
                on && styles.tabOn,
                pressed && !on && styles.tabPressed,
              ]}
            >
              <View style={styles.tabContent}>
                <Icon name={iconName} size={15} color={iconColor} bgColor={iconBg} />
                <Text style={[styles.label, on && styles.labelOn]} numberOfLines={1}>
                  {names[id]}
                </Text>
                {showBadge && (
                  <View style={[styles.badge, on && styles.badgeOn]}>
                    <Text style={[styles.badgeText, on && styles.badgeTextOn]}>
                      {saved.length}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const makeStyles = (t: Typo, p: Palette) =>
  StyleSheet.create({
    wrap: { position: 'absolute', left: 16, right: 16 },
    shell: {
      flexDirection: 'row',
      gap: 4,
      padding: 6,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: p.surface.borderStrong,
      backgroundColor: p.color.tabShell,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.14,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 11,
      paddingHorizontal: 8,
      borderRadius: radius.pill,
    },
    tabOn: { backgroundColor: p.color.accent },
    tabPressed: { backgroundColor: p.surface.s07 },
    tabContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    label: { fontFamily: t.font.sansMedium, fontWeight: '600', fontSize: 12.5, color: p.ink.a70 },
    labelOn: { color: p.color.onAccent, fontWeight: '700' },
    badge: {
      minWidth: 18,
      height: 18,
      borderRadius: 99,
      paddingHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.accentAlpha.a16,
    },
    badgeOn: {
      backgroundColor: 'rgba(255,255,255,.24)',
    },
    badgeText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 10,
      color: p.color.accent,
    },
    badgeTextOn: {
      color: p.color.onAccent,
    },
  });
