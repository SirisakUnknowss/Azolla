import { Platform, Share } from 'react-native';

/**
 * Shares a formatted question card via the native share sheet (iOS/Android),
 * Web Share API, or clipboard fallback on desktop browsers.
 * Returns `'shared'` | `'copied'` | `'dismissed'`.
 */
export async function shareQuestion(
  question: string,
  deckLabel: string,
): Promise<'shared' | 'copied' | 'dismissed'> {
  const text = `“${question}”\n— Azolla (${deckLabel})`;

  if (Platform.OS === 'web') {
    const nav = typeof navigator !== 'undefined' ? navigator : undefined;
    if (nav && typeof nav.share === 'function') {
      try {
        await nav.share({ title: 'Azolla', text });
        return 'shared';
      } catch {
        // Fall through to clipboard copy if user cancels or desktop browser blocks share
      }
    }
    if (nav?.clipboard?.writeText) {
      try {
        await nav.clipboard.writeText(text);
        return 'copied';
      } catch {
        return 'dismissed';
      }
    }
    return 'dismissed';
  }

  try {
    const res = await Share.share({ message: text });
    return res.action === Share.sharedAction ? 'shared' : 'dismissed';
  } catch {
    return 'dismissed';
  }
}
