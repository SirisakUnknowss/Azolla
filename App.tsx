// Imported one weight at a time: the family entry point pulls every weight
// (and every italic) into the bundle — 38 faces instead of the 8 the app sets.
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif/400Regular';
import { NotoSansThai_400Regular } from '@expo-google-fonts/noto-sans-thai/400Regular';
import { NotoSansThai_500Medium } from '@expo-google-fonts/noto-sans-thai/500Medium';
import { NotoSansThai_700Bold } from '@expo-google-fonts/noto-sans-thai/700Bold';
import { NotoSerifThai_400Regular } from '@expo-google-fonts/noto-serif-thai/400Regular';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TabBar, type TabId } from './src/components/TabBar';
import { HUES, type ModeId, type PackId, type Relationship } from './src/data/decks';
import { deckFor, shuffle } from './src/data/session';
import { useI18n } from './src/i18n';
import { HomeScreen } from './src/screens/HomeScreen';
import { PacksScreen } from './src/screens/PacksScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { SessionScreen, type SessionConfig } from './src/screens/SessionScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { StoreProvider, useStore } from './src/state/store';
import { color } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

type Screen = TabId | 'setup' | 'session';

/** The daily prompt opens a session that is already past the warm-up. */
const DAILY_DEPTH = 5;
/** The "After midnight" pack is written for level 8 and up. */
const AFTER_DARK_DEPTH = 8;

function Root() {
  const store = useStore();
  const { lang, t, content } = useI18n();
  const [screen, setScreen] = useState<Screen>('home');
  const [setupRel, setSetupRel] = useState<Relationship>('Lover');
  const [depth, setDepth] = useState(4);
  const [mode, setMode] = useState<ModeId>('pass');
  const [session, setSession] = useState<SessionConfig | null>(null);

  // Adopt the last-used setup once the persisted blob lands.
  useEffect(() => {
    if (!store.hydrated) return;
    setSetupRel(store.lastRel);
    setDepth(store.lastDepth);
    setMode(store.lastMode);
  }, [store.hydrated, store.lastRel, store.lastDepth, store.lastMode]);

  // Every deal gets a new id, which keys the session screen and so resets the
  // card index, the timer and the level with the new deck.
  const dealtRef = useRef(0);
  const openSession = useCallback(
    (config: Omit<SessionConfig, 'id'>) => {
      store.markPlayed();
      dealtRef.current += 1;
      setSession({ ...config, id: dealtRef.current });
      setScreen('session');
    },
    [store],
  );

  const pickRelationship = useCallback((rel: Relationship) => {
    setSetupRel(rel);
    setScreen('setup');
  }, []);

  const dealFor = useCallback(
    (rel: Relationship, level: number) => deckFor(rel, level, lang, store.seen),
    [lang, store.seen],
  );

  const startFromSetup = useCallback(() => {
    store.rememberSetup(setupRel, depth, mode);
    openSession({
      rel: setupRel,
      sourceLabel: content.rel[setupRel],
      hue: HUES[setupRel][0],
      depth,
      mode,
      deck: dealFor(setupRel, depth),
    });
  }, [content, dealFor, depth, mode, openSession, setupRel, store]);

  // "Turn it up a level" deals a fresh deck rather than skipping ahead in the
  // current one, so the deeper questions are actually new.
  const goDeeper = useCallback(
    (level: number) => {
      if (!session) return;
      setDepth(level);
      openSession({ ...session, depth: level, deck: dealFor(session.rel, level) });
    },
    [dealFor, openSession, session],
  );

  const startDaily = useCallback(
    (question: string) => {
      // The daily question is dealt first, then the session rolls on into the
      // relationship deck the user played last.
      const rest = dealFor(store.lastRel, DAILY_DEPTH).filter((q) => q !== question);
      openSession({
        rel: store.lastRel,
        sourceLabel: t.todayLabel,
        hue: HUES[store.lastRel][0],
        depth: DAILY_DEPTH,
        mode: store.lastMode,
        deck: [question, ...rest],
      });
    },
    [dealFor, openSession, t, store.lastRel, store.lastMode],
  );

  const playPack = useCallback(
    (id: PackId) => {
      const pack = id === 'custom' ? null : content.packs[id];
      const questions = pack ? pack.questions : store.custom;
      if (questions.length === 0) return;
      openSession({
        rel: store.lastRel,
        sourceLabel: pack ? pack.name : t.yourPack,
        hue: color.accent,
        // Packs are curated end to end, so they always start at the first card.
        depth: id === 'after' ? Math.max(depth, AFTER_DARK_DEPTH) : depth,
        mode: store.lastMode,
        // A pack is short and curated, so all of it is dealt — shuffled, so a
        // second run through is not the same night.
        deck: shuffle(questions),
      });
    },
    [content, depth, openSession, t, store.custom, store.lastMode, store.lastRel],
  );

  const leaveSession = useCallback(() => {
    setSession(null);
    setScreen('home');
  }, []);

  const showTabs = screen === 'home' || screen === 'saved' || screen === 'packs';

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {screen === 'home' && (
        <HomeScreen onPickRelationship={pickRelationship} onStartDaily={startDaily} />
      )}

      {screen === 'setup' && (
        <SetupScreen
          rel={setupRel}
          depth={depth}
          mode={mode}
          onChangeDepth={setDepth}
          onChangeMode={setMode}
          onBack={() => setScreen('home')}
          onStart={startFromSetup}
        />
      )}

      {screen === 'session' && session && (
        <SessionScreen
          key={session.id}
          config={session}
          onExit={leaveSession}
          onGoDeeper={goDeeper}
        />
      )}

      {screen === 'saved' && <SavedScreen />}
      {screen === 'packs' && <PacksScreen onPlayPack={playPack} />}

      {showTabs && <TabBar active={screen} onSelect={setScreen} />}
    </View>
  );
}

export default function App() {
  // Both face sets are bundled: the Latin pair carries no Thai glyphs, and on
  // Android a custom typeface gets no fallback, so the language switch has to
  // have its faces already in hand.
  const [fontsLoaded, fontError] = useFonts({
    InstrumentSerif_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    NotoSerifThai_400Regular,
    NotoSansThai_400Regular,
    NotoSansThai_500Medium,
    NotoSansThai_700Bold,
  });

  // A font that fails to download should not strand the user on the splash
  // screen — the system face is an acceptable fallback.
  const ready = fontsLoaded || !!fontError;

  const onLayout = useCallback(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayout}>
      <SafeAreaProvider>
        <StoreProvider>
          <Root />
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
});
