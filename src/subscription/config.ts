/**
 * Where the paywall sits, and the identifiers it is keyed on.
 *
 * Everything the free tier is allowed to reach lives in this file, so the line
 * can be moved without hunting through screens.
 */

import type { DeckPackId, Relationship } from '../data/decks';

/** Entitlement that unlocks everything. Set on both plans in the dashboard. */
export const PRO_ENTITLEMENT = 'pro';

/**
 * The free tier:
 * - Levels 1–5 are free to play; Levels 6–10 require Azolla Pro.
 * - Breaking the ice (New friend, Colleague, Stranger) and trying Dark mode /
 *   Sex mode up to Level 5 are free; deeper close-relationship decks (Lover,
 *   Best friend, Old friend, Family) and Levels 6–10 require Azolla Pro.
 */
export const FREE_MAX_LEVEL = 5;

export const FREE_RELATIONSHIPS: readonly Relationship[] = [
  'New friend',
  'Colleague',
  'Stranger',
  'Dark mode',
  'Sex mode',
];

/** The starter packs tagged "Free" are unlocked out of the box. */
export const FREE_PACKS: readonly DeckPackId[] = ['first', 'years'];

export const RC_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
export const RC_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
