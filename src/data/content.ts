/** The shape every language file fills in. */
import type { BandId, DeckPackId, ModeId, Relationship } from './decks';

export type Content = {
  /** Display name of each relationship. The key stays English — it is an id. */
  rel: Record<Relationship, string>;
  blurb: Record<Relationship, string>;
  decks: Record<Relationship, readonly string[]>;
  modes: Record<ModeId, { name: string; blurb: string }>;
  packs: Record<
    DeckPackId,
    { name: string; blurb: string; tag: string; questions: readonly string[] }
  >;
  bands: Record<BandId, string>;
  /** The pool the daily prompt rotates through. Same length in every language. */
  daily: readonly string[];
};
