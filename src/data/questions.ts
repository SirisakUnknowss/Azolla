/**
 * Stable identity for a question, independent of the language it is read in.
 *
 * Kept questions are stored under one of these keys, so a question starred in
 * English is still starred — and reads in Thai — after the language changes.
 * The key is derived from the English wording rather than from a position in a
 * file, so adding, removing or reordering questions leaves every other key
 * alone. Questions the user wrote themselves are their own key: they are not
 * translated and there is nothing to look them up in.
 */

import type { Lang } from '../i18n/lang';

import { contentFor, PACK_IDS, RELATIONSHIPS } from './decks';
import { LEVELS, type QuestionPair } from './levels';
import { DECKS } from './pool';

export type QuestionKey = string;

const TEXT_TO_KEY = new Map<string, QuestionKey>();
const KEY_TO_TEXT = new Map<QuestionKey, Partial<Record<Lang, string>>>();

/** FNV-1a over the English wording — short, stable, and no ids to maintain. */
function hash(text: string): QuestionKey {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `q${h.toString(36)}`;
}

function index(en: string, th: string) {
  const key = hash(en);
  TEXT_TO_KEY.set(en, key);
  TEXT_TO_KEY.set(th, key);
  KEY_TO_TEXT.set(key, { en, th });
}

function indexPair(pair: QuestionPair) {
  index(pair[0], pair[1]);
}

for (const rel of RELATIONSHIPS) {
  for (const level of LEVELS) DECKS[rel][level].forEach(indexPair);
}

// Packs and the daily pool still live in the per-language content files, so
// they are paired up by position on the way in.
{
  const en = contentFor('en');
  const th = contentFor('th');
  for (const id of PACK_IDS) {
    en.packs[id].questions.forEach((q, i) => index(q, th.packs[id].questions[i]));
  }
  en.daily.forEach((q, i) => index(q, th.daily[i]));
}

/** The key a question is filed under. Unknown text is its own key. */
export function keyFor(question: string): QuestionKey {
  return TEXT_TO_KEY.get(question) ?? question;
}

/** How a key reads in `lang`, or null if it is a question the user wrote. */
export function textFor(key: QuestionKey, lang: Lang): string | null {
  return KEY_TO_TEXT.get(key)?.[lang] ?? null;
}
