/**
 * Subscription state, and the one hook screens use to ask "is this locked?".
 *
 * The store SDK is native-only: on web, and in any build without SDK keys
 * configured, `configure` is skipped entirely and everyone reads as free. That
 * is deliberate — a missing key should degrade to the free tier, never crash
 * the app or silently unlock paid content.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';
import Purchases, { type PurchasesPackage } from 'react-native-purchases';

import type { DeckPackId, Relationship } from '../data/decks';

import {
  FREE_MAX_LEVEL,
  FREE_PACKS,
  FREE_RELATIONSHIPS,
  PRO_ENTITLEMENT,
  RC_KEY_ANDROID,
  RC_KEY_IOS,
} from './config';

/** The key for this platform, or undefined where purchases cannot run at all. */
const apiKey = Platform.select({ ios: RC_KEY_IOS, android: RC_KEY_ANDROID });

/** Whether a real store is reachable. False on web and in unconfigured builds. */
export const STORE_AVAILABLE = Platform.OS !== 'web' && !!apiKey;

export type Subscription = {
  isPro: boolean;
  /** False until the first customer-info read lands, so nothing flashes locked. */
  ready: boolean;
  /** Empty when the store is unavailable or the offering has no packages. */
  packages: PurchasesPackage[];
  /** Resolves true when the purchase completed and the entitlement is active. */
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
  /** Unlocks Pro in local/web preview when native store billing is unavailable. */
  unlockPreview: () => void;
  /** Highest depth this user may deal from. */
  maxLevel: number;
  isLevelLocked: (level: number) => boolean;
  isRelationshipLocked: (rel: Relationship) => boolean;
  isPackLocked: (pack: DeckPackId | 'custom') => boolean;
};

const SubscriptionContext = createContext<Subscription | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  // Nothing to wait for when there is no store, so an unconfigured build is
  // ready immediately rather than holding every screen behind a spinner.
  const [ready, setReady] = useState(!STORE_AVAILABLE);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  useEffect(() => {
    if (!STORE_AVAILABLE || !apiKey) return;
    let alive = true;

    Purchases.configure({ apiKey });

    // The listener covers renewals, cancellations and purchases made outside
    // the app; the initial read covers the launch itself.
    const listener = (info: { entitlements: { active: Record<string, unknown> } }) => {
      if (alive) setIsPro(!!info.entitlements.active[PRO_ENTITLEMENT]);
    };
    Purchases.addCustomerInfoUpdateListener(listener);

    Purchases.getCustomerInfo()
      .then((info) => {
        if (!alive) return;
        setIsPro(!!info.entitlements.active[PRO_ENTITLEMENT]);
      })
      // A failed lookup means unknown, which has to mean free — never unlock
      // paid content because the network was down.
      .catch(() => {})
      .finally(() => {
        if (alive) setReady(true);
      });

    Purchases.getOfferings()
      .then((offerings) => {
        if (alive) setPackages(offerings.current?.availablePackages ?? []);
      })
      .catch(() => {});

    return () => {
      alive = false;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    if (!STORE_AVAILABLE) return false;
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const active = !!customerInfo.entitlements.active[PRO_ENTITLEMENT];
      setIsPro(active);
      return active;
    } catch {
      // Includes the user simply cancelling, which is not an error worth
      // surfacing — the paywall just stays open.
      return false;
    }
  }, []);

  const restore = useCallback(async () => {
    if (!STORE_AVAILABLE) return false;
    try {
      const info = await Purchases.restorePurchases();
      const active = !!info.entitlements.active[PRO_ENTITLEMENT];
      setIsPro(active);
      return active;
    } catch {
      return false;
    }
  }, []);

  const unlockPreview = useCallback(() => {
    setIsPro(true);
  }, []);

  const value = useMemo<Subscription>(
    () => ({
      isPro,
      ready,
      packages,
      purchase,
      restore,
      unlockPreview,
      maxLevel: isPro ? 10 : FREE_MAX_LEVEL,
      isLevelLocked: (level) => !isPro && level > FREE_MAX_LEVEL,
      isRelationshipLocked: (rel) => !isPro && !FREE_RELATIONSHIPS.includes(rel),
      isPackLocked: (pack) =>
        !isPro && (pack === 'custom' || !FREE_PACKS.includes(pack)),
    }),
    [isPro, ready, packages, purchase, restore, unlockPreview],
  );

  return (
    <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
  );
}

export function useSubscription(): Subscription {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used inside <SubscriptionProvider>');
  return ctx;
}

export { PRO_ENTITLEMENT } from './config';
