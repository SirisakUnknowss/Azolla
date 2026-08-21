import type { Relationship } from '../decks';
import type { LevelledDeck } from '../levels';

import { BEST_FRIEND } from './bestFriend';
import { COLLEAGUE } from './colleague';
import { FAMILY } from './family';
import { LOVER } from './lover';
import { NEW_FRIEND } from './newFriend';
import { OLD_FRIEND } from './oldFriend';
import { STRANGER } from './stranger';

/** Ten questions per level, per relationship — 700 in all, in both languages. */
export const DECKS: Readonly<Record<Relationship, LevelledDeck>> = {
  'New friend': NEW_FRIEND,
  'Old friend': OLD_FRIEND,
  'Best friend': BEST_FRIEND,
  Lover: LOVER,
  Family: FAMILY,
  Colleague: COLLEAGUE,
  Stranger: STRANGER,
};
