#!/usr/bin/env node
/**
 * Generates valid signed Azolla Pro Unlock Codes (`AZOLLA-XXXX-XXXX`)
 * Usage: npm run gen:code [count]
 */

const SECRET_SALT = 'AZOLLA_DEEPTALK_PRO_2026_V1';
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function computeSignature(seed) {
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
  let out = '';
  let val = (h1 ^ h2) >>> 0;
  for (let i = 0; i < 4; i++) {
    out += ALPHABET[val % ALPHABET.length];
    val = Math.floor(val / ALPHABET.length);
  }
  return out;
}

function randomSeed() {
  let s = '';
  for (let i = 0; i < 4; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return s;
}

const count = Math.max(1, parseInt(process.argv[2] || '5', 10));
console.log(`\nGenerated ${count} Azolla Pro Unlock Code(s):\n`);
for (let i = 0; i < count; i++) {
  const seed = randomSeed();
  const sig = computeSignature(seed);
  console.log(`  AZOLLA-${seed}-${sig}`);
}
console.log('');
