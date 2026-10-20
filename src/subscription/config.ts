/**
 * Where the paywall sits, and the identifiers it is keyed on.
 *
 * Everything the free tier is allowed to reach lives in this file, so the line
 * can be moved without hunting through screens. The strings must match what is
 * configured in the RevenueCat dashboard exactly — change them here and there
 * together, never one side alone, or every paying user reads as unsubscribed.
 */

import type { DeckPackId, Relationship } from '../data/decks';

/** Entitlement that unlocks everything. Set on both plans in the dashboard. */
export const PRO_ENTITLEMENT = 'pro';

/**
 * The free tier.
 *
 * Chosen to match what the app is for: breaking the ice is free, and what you
 * pay for is going deeper with the people already close to you.
 */
export const FREE_MAX_LEVEL = 5;

export const FREE_RELATIONSHIPS: readonly Relationship[] = [
  'New friend',
  'Colleague',
  'Stranger',
  'Dark mode',
  'Sex mode',
];

/** The starter packs tagged "Free" in content are unlocked out of the box. */
export const FREE_PACKS: readonly DeckPackId[] = ['dark', 'sex', 'first', 'years'];

/**
 * Public SDK keys, which ship inside the binary by design — they identify the
 * app to RevenueCat and cannot authorise anything on their own. Left undefined
 * until configured, which the provider treats as "no store available" rather
 * than an error, so the app still runs on web and in a bare checkout.
 */
export const RC_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
export const RC_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
