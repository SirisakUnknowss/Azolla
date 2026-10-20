/**
 * Where the paywall sits, and the identifiers it is keyed on.
 */

import { RELATIONSHIPS, type DeckPackId, type Relationship } from '../data/decks';

/** Entitlement that unlocks everything. Set on both plans in the dashboard. */
export const PRO_ENTITLEMENT = 'pro';

/**
 * All 10 depth levels, all relationship decks, and all themed packs are
 * unlocked out of the box so the app is never cluttered with padlocks.
 */
export const FREE_MAX_LEVEL = 10;

export const FREE_RELATIONSHIPS: readonly Relationship[] = RELATIONSHIPS;

export const FREE_PACKS: readonly DeckPackId[] = [
  'dark',
  'sex',
  'first',
  'years',
  'after',
  'repair',
];

export const RC_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
export const RC_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
