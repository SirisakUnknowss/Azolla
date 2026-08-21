import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { ModeId, Relationship } from '../data/decks';
import { keyFor } from '../data/questions';
import {
  DEFAULT_STATE,
  loadState,
  saveState,
  SEEN_LIMIT,
  today,
  yesterday,
  type PersistedState,
  type Prefs,
  type SavedQuestion,
} from './storage';

const MAX_PLAYERS = 6;

type Store = PersistedState & {
  /** False until the persisted blob has been read, so we never flash defaults. */
  hydrated: boolean;
  toggleSaved: (q: string, rel: Relationship, depth: number) => void;
  isSaved: (q: string) => boolean;
  /** Takes the stored key, not the wording — see `data/questions.ts`. */
  removeSaved: (key: string) => void;
  /** Records a question as dealt, so later sessions lead with fresh ones. */
  markSeen: (q: string) => void;
  addCustom: (q: string) => void;
  removeCustom: (q: string) => void;
  addPlayer: (name: string) => void;
  removePlayer: (index: number) => void;
  setPrefs: (patch: Partial<Prefs>) => void;
  rememberSetup: (rel: Relationship, depth: number, mode: ModeId) => void;
  /** Records a play for today and rolls the streak forward. */
  markPlayed: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    loadState().then((loaded) => {
      if (!alive) return;
      setState(loaded);
      hydratedRef.current = true;
      setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Write through on every change, but never before hydration — otherwise the
  // first render would overwrite the stored blob with defaults.
  useEffect(() => {
    if (!hydratedRef.current) return;
    saveState(state);
  }, [state]);

  // Kept questions are filed under a language-independent key, so starring a
  // question in one language shows it starred in the other.
  const toggleSaved = useCallback((q: string, rel: Relationship, depth: number) => {
    const key = keyFor(q);
    setState((s) =>
      s.saved.some((x) => x.key === key)
        ? { ...s, saved: s.saved.filter((x) => x.key !== key) }
        : { ...s, saved: [{ key, q, rel, depth, at: Date.now() }, ...s.saved] },
    );
  }, []);

  const isSaved = useCallback(
    (q: string) => {
      const key = keyFor(q);
      return state.saved.some((x) => x.key === key);
    },
    [state.saved],
  );

  const removeSaved = useCallback((key: string) => {
    setState((s) => ({ ...s, saved: s.saved.filter((x) => x.key !== key) }));
  }, []);

  const markSeen = useCallback((q: string) => {
    const key = keyFor(q);
    setState((s) =>
      s.seen[0] === key
        ? s
        : { ...s, seen: [key, ...s.seen.filter((k) => k !== key)].slice(0, SEEN_LIMIT) },
    );
  }, []);

  const addCustom = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setState((s) => (s.custom.includes(trimmed) ? s : { ...s, custom: [...s.custom, trimmed] }));
  }, []);

  const removeCustom = useCallback((q: string) => {
    setState((s) => ({ ...s, custom: s.custom.filter((c) => c !== q) }));
  }, []);

  const addPlayer = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((s) =>
      s.players.length >= MAX_PLAYERS ? s : { ...s, players: [...s.players, trimmed] },
    );
  }, []);

  const removePlayer = useCallback((index: number) => {
    setState((s) => ({ ...s, players: s.players.filter((_, i) => i !== index) }));
  }, []);

  const setPrefs = useCallback((patch: Partial<Prefs>) => {
    setState((s) => ({ ...s, prefs: { ...s.prefs, ...patch } }));
  }, []);

  const rememberSetup = useCallback((rel: Relationship, depth: number, mode: ModeId) => {
    setState((s) => ({ ...s, lastRel: rel, lastDepth: depth, lastMode: mode }));
  }, []);

  const markPlayed = useCallback(() => {
    setState((s) => {
      const day = today();
      if (s.streak.lastPlayed === day) return s;
      const continued = s.streak.lastPlayed === yesterday();
      return {
        ...s,
        streak: { count: continued ? s.streak.count + 1 : 1, lastPlayed: day },
      };
    });
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      hydrated,
      toggleSaved,
      isSaved,
      removeSaved,
      markSeen,
      addCustom,
      removeCustom,
      addPlayer,
      removePlayer,
      setPrefs,
      rememberSetup,
      markPlayed,
    }),
    [
      state,
      hydrated,
      toggleSaved,
      isSaved,
      removeSaved,
      markSeen,
      addCustom,
      removeCustom,
      addPlayer,
      removePlayer,
      setPrefs,
      rememberSetup,
      markPlayed,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
