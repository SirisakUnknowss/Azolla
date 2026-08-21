/**
 * Turning a relationship and a level into the night's cards.
 *
 * A session no longer walks a fixed list. It draws the pool for the chosen
 * level — five levels of ten questions, so fifty cards — shuffles it, and puts
 * the questions this phone has not dealt before at the front. Opening a second
 * session at the same level therefore leads with what you have not seen rather
 * than repeating the first one.
 */

import type { Lang } from '../i18n/lang';

import type { Relationship } from './decks';
import { levelsFor, type QuestionPair } from './levels';
import { DECKS } from './pool';
import { keyFor } from './questions';

/** Every question available at `depth` for this relationship. */
export function poolFor(rel: Relationship, depth: number): QuestionPair[] {
  return levelsFor(depth).flatMap((level) => [...DECKS[rel][level]]);
}

/** Fisher-Yates, on a copy. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * The dealt deck, in the active language: unseen questions first, each half
 * shuffled, so the order is different every time even once the pool is used up.
 */
export function buildDeck(
  pool: readonly QuestionPair[],
  lang: Lang,
  seen: readonly string[],
): string[] {
  const already = new Set(seen);
  const fresh: QuestionPair[] = [];
  const repeats: QuestionPair[] = [];
  for (const pair of pool) {
    (already.has(keyFor(pair[0])) ? repeats : fresh).push(pair);
  }
  const index = lang === 'th' ? 1 : 0;
  return [...shuffle(fresh), ...shuffle(repeats)].map((pair) => pair[index]);
}

/** A deck for a relationship at a level, ready to deal. */
export function deckFor(
  rel: Relationship,
  depth: number,
  lang: Lang,
  seen: readonly string[],
): string[] {
  return buildDeck(poolFor(rel, depth), lang, seen);
}
