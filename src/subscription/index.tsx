/**
 * Subscription state, and the one hook screens use to ask "is this locked?".
 *
 * Supports:
 * 1. Native App Store / Google Play billing via RevenueCat (`STORE_AVAILABLE === true`)
 * 2. Web Payment via PromptPay QR / Gumroad / Checkout Link + verified License/Unlock Code
 *    persisted in AsyncStorage (`@azolla:pro_license_v1`).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { isValidSignedCode, verifyLicenseOrCode } from '../util/license';

import {
  FREE_MAX_LEVEL,
  FREE_PACKS,
  FREE_RELATIONSHIPS,
  PRO_ENTITLEMENT,
  RC_KEY_ANDROID,
  RC_KEY_IOS,
} from './config';

const LICENSE_STORAGE_KEY = '@azolla:pro_license_v1';

/** The key for this platform, or undefined where purchases cannot run at all. */
const apiKey = Platform.select({ ios: RC_KEY_IOS, android: RC_KEY_ANDROID });

/** Whether a real native store is reachable. False on web and in unconfigured builds. */
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
  /** Verifies a Gumroad License Key or signed Azolla Unlock Code and activates Pro if valid. */
  redeemCode: (code: string) => Promise<boolean>;
  /** Highest depth this user may deal from. */
  maxLevel: number;
  isLevelLocked: (level: number) => boolean;
  isRelationshipLocked: (rel: Relationship) => boolean;
  isPackLocked: (pack: DeckPackId | 'custom') => boolean;
};

const SubscriptionContext = createContext<Subscription | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [ready, setReady] = useState(!STORE_AVAILABLE);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  // Check persisted Web/License unlock code on mount
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(LICENSE_STORAGE_KEY)
      .then(async (savedCode) => {
        if (!alive || !savedCode) return;
        const ok = isValidSignedCode(savedCode) || (await verifyLicenseOrCode(savedCode));
        if (alive && ok) setIsPro(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!STORE_AVAILABLE || !apiKey) return;
    let alive = true;

    Purchases.configure({ apiKey });

    const listener = (info: { entitlements: { active: Record<string, unknown> } }) => {
      if (alive) setIsPro(!!info.entitlements.active[PRO_ENTITLEMENT]);
    };
    Purchases.addCustomerInfoUpdateListener(listener);

    Purchases.getCustomerInfo()
      .then((info) => {
        if (!alive) return;
        if (info.entitlements.active[PRO_ENTITLEMENT]) {
          setIsPro(true);
        }
      })
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
      return false;
    }
  }, []);

  const restore = useCallback(async () => {
    if (STORE_AVAILABLE) {
      try {
        const info = await Purchases.restorePurchases();
        const active = !!info.entitlements.active[PRO_ENTITLEMENT];
        if (active) {
          setIsPro(true);
          return true;
        }
      } catch {
        // Fall through to check local saved license
      }
    }
    try {
      const savedCode = await AsyncStorage.getItem(LICENSE_STORAGE_KEY);
      if (savedCode && (await verifyLicenseOrCode(savedCode))) {
        setIsPro(true);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, []);

  const redeemCode = useCallback(async (code: string) => {
    const ok = await verifyLicenseOrCode(code);
    if (!ok) return false;
    try {
      await AsyncStorage.setItem(LICENSE_STORAGE_KEY, code.trim().toUpperCase());
    } catch {
      // Ignore storage error
    }
    setIsPro(true);
    return true;
  }, []);

  const value = useMemo<Subscription>(
    () => ({
      isPro,
      ready,
      packages,
      purchase,
      restore,
      redeemCode,
      maxLevel: isPro ? 10 : FREE_MAX_LEVEL,
      isLevelLocked: (level) => !isPro && level > FREE_MAX_LEVEL,
      isRelationshipLocked: (rel) => !isPro && !FREE_RELATIONSHIPS.includes(rel),
      isPackLocked: (pack) =>
        !isPro && (pack === 'custom' || !FREE_PACKS.includes(pack)),
    }),
    [isPro, ready, packages, purchase, restore, redeemCode],
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
