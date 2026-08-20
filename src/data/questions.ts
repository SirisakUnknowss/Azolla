/**
 * Stable identity for a question, independent of the language it is read in.
 *
 * Kept questions are stored under one of these keys, so a question starred in
 * English is still starred — and reads in Thai — after the language changes.
 * Questions the user wrote themselves are their own key: they are not
 * translated and there is nothing to look them up in.
 */

import { LANGS, type Lang } from '../i18n/lang';

import { contentFor, PACK_IDS, RELATIONSHIPS } from './decks';

export type QuestionKey = string;

const TEXT_TO_KEY = new Map<string, QuestionKey>();
const KEY_TO_TEXT = new Map<QuestionKey, Partial<Record<Lang, string>>>();

function index(key: QuestionKey, lang: Lang, text: string) {
  // First writer wins: a string that appears in two decks keeps the identity of
  // the deck that registered it, rather than flip-flopping between them.
  if (!TEXT_TO_KEY.has(text)) TEXT_TO_KEY.set(text, key);
  const byLang = KEY_TO_TEXT.get(key) ?? {};
  byLang[lang] = text;
  KEY_TO_TEXT.set(key, byLang);
}

for (const lang of LANGS) {
  const content = contentFor(lang);
  for (const rel of RELATIONSHIPS) {
    content.decks[rel].forEach((q, i) => index(`deck:${rel}:${i}`, lang, q));
  }
  for (const id of PACK_IDS) {
    content.packs[id].questions.forEach((q, i) => index(`pack:${id}:${i}`, lang, q));
  }
  content.daily.forEach((q, i) => index(`daily:${i}`, lang, q));
}

/** The key a question is filed under. Unknown text is its own key. */
export function keyFor(question: string): QuestionKey {
  return TEXT_TO_KEY.get(question) ?? question;
}

/** How a key reads in `lang`, or null if it is a question the user wrote. */
export function textFor(key: QuestionKey, lang: Lang): string | null {
  return KEY_TO_TEXT.get(key)?.[lang] ?? null;
}
