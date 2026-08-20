import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ModeId, Relationship } from '../data/decks';
import { keyFor } from '../data/questions';
import { deviceLang, LANGS, type Lang } from '../i18n/lang';

const KEY = 'deeptalk:v1';

export type SavedQuestion = {
  /** Language-independent identity — see `data/questions.ts`. */
  key: string;
  /** The wording it was kept in, and the fallback for questions the user wrote. */
  q: string;
  rel: Relationship;
  depth: number;
  /** Epoch ms, so the kept list can stay newest-first across launches. */
  at: number;
};

export type Prefs = {
  /** Seconds on the turn timer. 30–300 in steps of 15, per the design props. */
  timerSeconds: number;
  showTimer: boolean;
  allowSkip: boolean;
  lang: Lang;
};

export type Streak = {
  count: number;
  /** Local calendar day of the last played session, as YYYY-MM-DD. */
  lastPlayed: string | null;
};

export type PersistedState = {
  saved: SavedQuestion[];
  custom: string[];
  players: string[];
  prefs: Prefs;
  streak: Streak;
  /** Last setup choices, so the app opens where the user left off. */
  lastRel: Relationship;
  lastDepth: number;
  lastMode: ModeId;
};

export const DEFAULT_STATE: PersistedState = {
  saved: [],
  custom: [],
  players: [],
  prefs: { timerSeconds: 90, showTimer: true, allowSkip: true, lang: deviceLang() },
  streak: { count: 0, lastPlayed: null },
  lastRel: 'Lover',
  lastDepth: 4,
  lastMode: 'pass',
};

/** Local calendar day as YYYY-MM-DD — deliberately not UTC. */
export function today(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function yesterday(d: Date = new Date()): string {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return today(y);
}

/**
 * Merge field-by-field rather than spreading blindly: a persisted blob written
 * by an older build may be missing keys that the current build reads.
 */
function reconcile(raw: unknown): PersistedState {
  if (!raw || typeof raw !== 'object') return DEFAULT_STATE;
  const r = raw as Partial<PersistedState>;
  return {
    saved: Array.isArray(r.saved)
      ? r.saved
          .filter((s) => s && typeof s.q === 'string')
          // Blobs written before the app spoke two languages carry no key.
          .map((s) => ({ ...s, key: typeof s.key === 'string' ? s.key : keyFor(s.q) }))
      : [],
    custom: Array.isArray(r.custom) ? r.custom.filter((c) => typeof c === 'string') : [],
    players: Array.isArray(r.players) ? r.players.filter((p) => typeof p === 'string') : [],
    prefs: {
      ...DEFAULT_STATE.prefs,
      ...(r.prefs ?? {}),
      // An unknown language code should not leave the app with no strings.
      lang: LANGS.includes(r.prefs?.lang as Lang) ? (r.prefs?.lang as Lang) : DEFAULT_STATE.prefs.lang,
    },
    streak: { ...DEFAULT_STATE.streak, ...(r.streak ?? {}) },
    lastRel: r.lastRel ?? DEFAULT_STATE.lastRel,
    lastDepth: typeof r.lastDepth === 'number' ? r.lastDepth : DEFAULT_STATE.lastDepth,
    lastMode: r.lastMode ?? DEFAULT_STATE.lastMode,
  };
}

export async function loadState(): Promise<PersistedState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? reconcile(JSON.parse(raw)) : DEFAULT_STATE;
  } catch {
    // A corrupt or unreadable blob should never block the app from opening.
    return DEFAULT_STATE;
  }
}

export async function saveState(state: PersistedState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Persistence is best-effort; the session in memory stays authoritative.
  }
}
