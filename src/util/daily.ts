const MS_PER_DAY = 86_400_000;

/**
 * The daily prompt is a pure function of the local calendar day, so every
 * launch on the same day shows the same question without storing anything.
 * The pools are the same length in every language, so the day picks the same
 * question whichever one is on.
 */
export function dailyIndex(poolSize: number, now: Date = new Date()): number {
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayNumber = Math.floor(local.getTime() / MS_PER_DAY);
  return ((dayNumber % poolSize) + poolSize) % poolSize;
}

export function dailyQuestion(pool: readonly string[], now: Date = new Date()): string {
  return pool[dailyIndex(pool.length, now)];
}
