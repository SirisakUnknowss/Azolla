import { BlurView } from 'expo-blur';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '../i18n';
import { color, ink, radius, surface, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight } from '../util/haptics';

export type TabId = 'home' | 'saved' | 'packs';

const TAB_IDS: readonly TabId[] = ['home', 'saved', 'packs'];

/** Floating pill tab bar — the canvas's `backdrop-filter:blur(18px)` shell. */
export function TabBar({ active, onSelect }: { active: TabId; onSelect: (id: TabId) => void }) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const styles = useStyles(makeStyles);
  const names: Record<TabId, string> = {
    home: t.tabPlay,
    saved: t.tabKept,
    packs: t.tabPacks,
  };

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 16) + 14 }]} pointerEvents="box-none">
      <BlurView intensity={40} tint="dark" style={styles.shell}>
        {TAB_IDS.map((id) => {
          const on = id === active;
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
              <Text style={[styles.label, on && styles.labelOn]}>{names[id]}</Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const makeStyles = (t: Typo) =>
  StyleSheet.create({
    wrap: { position: 'absolute', left: 14, right: 14 },
    shell: {
      flexDirection: 'row',
      gap: 4,
      padding: 6,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: surface.borderSoft,
      backgroundColor: color.tabShell,
      overflow: 'hidden',
    },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: radius.pill },
    tabOn: { backgroundColor: color.ink },
    tabPressed: { backgroundColor: surface.s07 },
    label: { fontFamily: t.font.sansMedium, fontSize: 13, color: ink.a60 },
    labelOn: { color: color.cardInk },
  });
