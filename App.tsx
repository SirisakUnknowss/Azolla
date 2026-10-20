import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AgeGateModal } from './src/components/AgeGateModal';
import { TabBar, type TabId } from './src/components/TabBar';
import { HUES, type ModeId, type PackId, type Relationship } from './src/data/decks';
import { deckFor, shuffle } from './src/data/session';
import { useI18n } from './src/i18n';
import { HomeScreen } from './src/screens/HomeScreen';
import { PacksScreen } from './src/screens/PacksScreen';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { SessionScreen, type SessionConfig } from './src/screens/SessionScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { StoreProvider, useStore } from './src/state/store';
import { SubscriptionProvider, useSubscription } from './src/subscription';
import { useTheme } from './src/theme';
import { palette } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

type Screen = TabId | 'setup' | 'session';

/** The daily prompt opens a session that is already past the warm-up. */
const DAILY_DEPTH = 5;
/** The "After midnight" pack is written for level 8 and up. */
const AFTER_DARK_DEPTH = 8;

function Root() {
  const store = useStore();
  const { lang, t, content } = useI18n();
  const { mode: themeMode, palette: p } = useTheme();
  const { isPro, maxLevel, isRelationshipLocked, isPackLocked } = useSubscription();
  const [screen, setScreen] = useState<Screen>('home');
  // The paywall sits over whatever screen opened it, so closing it puts the
  // user back exactly where they were rather than at the tab root.
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [pendingAdultAction, setPendingAdultAction] = useState<{
    modeType: 'Dark mode' | 'Sex mode';
    run: () => void;
  } | null>(null);
  const [setupRel, setSetupRel] = useState<Relationship>('New friend');
  const [depth, setDepth] = useState(3);
  const [mode, setMode] = useState<ModeId>('solo');
  const [session, setSession] = useState<SessionConfig | null>(null);

  // Adopt the last-used setup once the persisted blob lands.
  useEffect(() => {
    if (!store.hydrated) return;
    setSetupRel(store.lastRel);
    setDepth(Math.min(store.lastDepth, maxLevel));
    setMode(store.lastMode);
  }, [store.hydrated, store.lastRel, store.lastDepth, store.lastMode, maxLevel]);

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

  const pickRelationship = useCallback(
    (rel: Relationship) => {
      if (isRelationshipLocked(rel)) {
        setPaywallOpen(true);
        return;
      }
      const proceed = () => {
        setSetupRel(rel);
        if (rel === 'Dark mode' || rel === 'Sex mode') {
          setDepth(isPro ? 8 : Math.min(5, maxLevel));
        } else {
          setDepth((d) => Math.min(d, maxLevel));
        }
        setScreen('setup');
      };

      if ((rel === 'Dark mode' || rel === 'Sex mode') && !ageVerified) {
        setPendingAdultAction({ modeType: rel, run: proceed });
        return;
      }
      proceed();
    },
    [ageVerified, isPro, isRelationshipLocked, maxLevel],
  );

  // The one place a level actually turns into cards, so it is also the one
  // place the paid levels have to be enforced. Clamping here rather than
  // trusting the screens means a stale persisted depth from a lapsed
  // subscription cannot keep dealing level 10.
  const dealFor = useCallback(
    (rel: Relationship, level: number) =>
      deckFor(rel, Math.min(level, maxLevel), lang, store.seen),
    [lang, maxLevel, store.seen],
  );

  const startFromSetup = useCallback(() => {
    const safeDepth = Math.min(depth, maxLevel);
    store.rememberSetup(setupRel, safeDepth, mode);
    openSession({
      rel: setupRel,
      sourceLabel: content.rel[setupRel],
      hue: HUES[setupRel][0],
      depth: safeDepth,
      mode,
      deck: dealFor(setupRel, safeDepth),
    });
  }, [content, dealFor, depth, maxLevel, mode, openSession, setupRel, store]);

  // "Turn it up a level" deals a fresh deck rather than skipping ahead in the
  // current one, so the deeper questions are actually new.
  const goDeeper = useCallback(
    (level: number) => {
      if (!session) return;
      // Turning it up is exactly what the subscription is for, so a free user
      // reaching the ceiling gets the offer rather than a silently clamped deck.
      if (level > maxLevel) {
        setPaywallOpen(true);
        return;
      }
      setDepth(level);
      openSession({ ...session, depth: level, deck: dealFor(session.rel, level) });
    },
    [dealFor, maxLevel, openSession, session],
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
      if (isPackLocked(id)) {
        setPaywallOpen(true);
        return;
      }
      const proceed = () => {
        const pack = id === 'custom' ? null : content.packs[id];
        const questions = pack ? pack.questions : store.custom;
        if (questions.length === 0) return;
        openSession({
          rel: id === 'dark' ? 'Dark mode' : id === 'sex' ? 'Sex mode' : store.lastRel,
          sourceLabel: pack ? pack.name : t.yourPack,
          hue:
            id === 'dark'
              ? HUES['Dark mode'][0]
              : id === 'sex'
                ? HUES['Sex mode'][0]
                : p.color.accent,
          // Packs are curated end to end, so they always start at the first card.
          depth:
            id === 'dark' || id === 'sex'
              ? 10
              : id === 'after'
                ? Math.max(depth, AFTER_DARK_DEPTH)
                : depth,
          mode: store.lastMode,
          // A pack is short and curated, so all of it is dealt — shuffled, so a
          // second run through is not the same night.
          deck: shuffle(questions),
        });
      };

      if ((id === 'dark' || id === 'sex') && !ageVerified) {
        setPendingAdultAction({
          modeType: id === 'sex' ? 'Sex mode' : 'Dark mode',
          run: proceed,
        });
        return;
      }
      proceed();
    },
    [
      ageVerified,
      content,
      depth,
      isPackLocked,
      openSession,
      p,
      t,
      store.custom,
      store.lastMode,
      store.lastRel,
    ],
  );

  const leaveSession = useCallback(() => {
    setSession(null);
    setScreen('home');
  }, []);

  const showTabs = screen === 'home' || screen === 'saved' || screen === 'packs';

  return (
    <View style={[styles.outerBackdrop, { backgroundColor: p.color.bgDeep }]}>
      <StatusBar style={themeMode === 'light' ? 'dark' : 'light'} />

      <View
        style={[
          styles.phoneFrame,
          { backgroundColor: p.color.bg, borderColor: p.surface.border },
        ]}
      >
        {screen === 'home' && (
          <HomeScreen
            onPickRelationship={pickRelationship}
            onStartDaily={startDaily}
            onOpenPaywall={() => setPaywallOpen(true)}
          />
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
            onOpenPaywall={() => setPaywallOpen(true)}
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
        {screen === 'packs' && (
          <PacksScreen onPlayPack={playPack} onOpenPaywall={() => setPaywallOpen(true)} />
        )}

        {showTabs && !paywallOpen && <TabBar active={screen} onSelect={setScreen} />}

        {pendingAdultAction && (
          <AgeGateModal
            modeType={pendingAdultAction.modeType}
            onConfirm={() => {
              const fn = pendingAdultAction.run;
              setAgeVerified(true);
              setPendingAdultAction(null);
              fn();
            }}
            onCancel={() => setPendingAdultAction(null)}
          />
        )}

        {paywallOpen && (
          <View style={StyleSheet.absoluteFill}>
            <PaywallScreen onClose={() => setPaywallOpen(false)} />
          </View>
        )}
      </View>
    </View>
  );
}

export default function App() {
  const onLayout = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayout}>
      <SafeAreaProvider>
        <StoreProvider>
          <SubscriptionProvider>
            <Root />
          </SubscriptionProvider>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette('light').color.bg },
  outerBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          borderLeftWidth: 1,
          borderRightWidth: 1,
        }
      : null),
  },
});
