/**
 * Question taxonomy — the language-independent half of the content model.
 *
 * Relationships, hues, modes, packs and depth bands are identified by stable
 * ids that never change with the language; the words that go on screen live in
 * `content.en.ts` / `content.th.ts` and are looked up with `contentFor(lang)`.
 * Ids are also what persisted state is keyed on, so switching language never
 * rewrites the stored blob.
 */

import type { Lang } from '../i18n/lang';

import { EN } from './content.en';
import { TH } from './content.th';
import type { Content } from './content';

export type Relationship =
  | 'New friend'
  | 'Old friend'
  | 'Best friend'
  | 'Lover'
  | 'Family'
  | 'Colleague'
  | 'Stranger';

export type ModeId = 'solo' | 'pass' | 'group';
export type PackId = 'first' | 'years' | 'after' | 'repair' | 'custom';
/** The four shipped packs — "custom" is the user's own and has no content entry. */
export type DeckPackId = Exclude<PackId, 'custom'>;
export type BandId = 'warm' | 'real' | 'honest' | 'final';

/** [accent, soft] per relationship. */
export const HUES: Record<Relationship, readonly [string, string]> = {
  'New friend': ['#7ec4ff', 'rgba(126,196,255,.18)'],
  'Old friend': ['#f0b429', 'rgba(240,180,41,.18)'],
  'Best friend': ['#8ee6a8', 'rgba(142,230,168,.18)'],
  Lover: ['#ff6b8a', 'rgba(255,107,138,.18)'],
  Family: ['#c39bff', 'rgba(195,155,255,.18)'],
  Colleague: ['#9fb3c8', 'rgba(159,179,200,.18)'],
  Stranger: ['#ffd48a', 'rgba(255,212,138,.18)'],
};

export const RELATIONSHIPS = Object.keys(HUES) as Relationship[];

/** Render order for the play modes and the pack list. */
export const MODE_IDS: readonly ModeId[] = ['solo', 'pass', 'group'];
export const PACK_IDS: readonly DeckPackId[] = ['first', 'years', 'after', 'repair'];

const CONTENT: Record<Lang, Content> = { en: EN, th: TH };

export function contentFor(lang: Lang): Content {
  return CONTENT[lang];
}

/** Upper bound of each band, in order. */
const BAND_MAX: readonly { max: number; id: BandId }[] = [
  { max: 3, id: 'warm' },
  { max: 6, id: 'real' },
  { max: 8, id: 'honest' },
  { max: 10, id: 'final' },
];

export function bandFor(depth: number): BandId {
  return (BAND_MAX.find((b) => depth <= b.max) ?? BAND_MAX[3]).id;
}

/**
 * Where in a deck a session opens. Deeper levels skip the warm-up cards,
 * matching `startIdx` in the canvas.
 */
export function startIndexFor(depth: number): number {
  return depth <= 3 ? 0 : depth <= 6 ? 3 : 6;
}

export type { Content } from './content';
