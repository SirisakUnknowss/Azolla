/**
 * The question pool, and how a level turns into a night's deck.
 *
 * Every question carries the level it belongs at, 1 to 10. The two languages
 * live side by side in one tuple rather than in parallel files, so a question
 * cannot lose its translation to a stray edit.
 *
 * Intensity by level:
 *   1-2   easy, answerable in a sentence, nothing at stake
 *   3-4   personal but safe — taste, small history, opinions
 *   5-6   real feeling, mild admission
 *   7-8   things usually left unsaid between these two people
 *   9-10  the answers that change something
 */

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** `[English, Thai]` — the pair is the unit, so the two can never drift apart. */
export type QuestionPair = readonly [en: string, th: string];

/** Ten questions per level, per relationship. */
export type LevelledDeck = Readonly<Record<Level, readonly QuestionPair[]>>;

export const LEVELS: readonly Level[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/** How many levels a single session spans. Five × ten questions is one pool. */
const WINDOW = 5;

/**
 * The levels a session at `depth` deals from: the five ending at the chosen
 * level, so the dial is a ceiling and the night ramps up to it rather than
 * sitting at one pitch. Below level 5 the window is clamped to 1-5, which
 * keeps a shallow night from running out of cards.
 */
export function levelsFor(depth: number): Level[] {
  const hi = Math.min(10, Math.max(WINDOW, Math.round(depth)));
  const lo = hi - WINDOW + 1;
  return LEVELS.filter((l) => l >= lo && l <= hi);
}
