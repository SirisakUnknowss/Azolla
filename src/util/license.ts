/**
 * Dual License Verifier for Web:
 * 1. Verifies signed Azolla Unlock Codes (`AZOLLA-XXXX-XXXX`) issued after PromptPay payment.
 * 2. Verifies Gumroad License Keys via Gumroad's free `/v2/licenses/verify` API when configured.
 */

import { GUMROAD_PRODUCT_ID } from '../subscription/config';

const SECRET_SALT = 'AZOLLA_DEEPTALK_PRO_2026_V1';

function computeSignature(seed: string): string {
  const clean = seed.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const input = `${clean}:${SECRET_SALT}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= c * 31;
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let out = '';
  let val = (h1 ^ h2) >>> 0;
  for (let i = 0; i < 4; i++) {
    out += alphabet[val % alphabet.length];
    val = Math.floor(val / alphabet.length);
  }
  return out;
}

/**
 * Generates a valid signed unlock code for a given 4-char seed (e.g. `AZOLLA-8F3K-XXXX`).
 */
export function generateUnlockCode(seed: string): string {
  const cleanSeed = seed.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4).padEnd(4, '9');
  const sig = computeSignature(cleanSeed);
  return `AZOLLA-${cleanSeed}-${sig}`;
}

/**
 * Checks whether a user-entered code is a valid signed Azolla Unlock Code.
 */
export function isValidSignedCode(raw: string): boolean {
  const trimmed = raw.trim().toUpperCase();
  const match = /^AZOLLA-([A-Z0-9]{4})-([A-Z0-9]{4})$/.exec(trimmed);
  if (!match) return false;
  const [, seed, sig] = match;
  return computeSignature(seed) === sig;
}

/**
 * Verifies a License Key or Unlock Code:
 * - First checks if it's a valid signed `AZOLLA-XXXX-XXXX` code.
 * - Otherwise, if `GUMROAD_PRODUCT_ID` is configured, verifies against Gumroad's free API.
 */
export async function verifyLicenseOrCode(code: string): Promise<boolean> {
  const trimmed = code.trim();
  if (!trimmed) return false;

  if (isValidSignedCode(trimmed)) {
    return true;
  }

  if (GUMROAD_PRODUCT_ID) {
    try {
      const body = new URLSearchParams({
        product_id: GUMROAD_PRODUCT_ID,
        license_key: trimmed,
        increment_uses_count: 'true',
      });
      const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { success?: boolean; purchase?: { refunded?: boolean } };
      return !!data.success && !data.purchase?.refunded;
    } catch {
      return false;
    }
  }

  return false;
}
