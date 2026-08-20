import * as Haptics from 'expo-haptics';

/**
 * Haptics are decorative — a device without a taptic engine (or a simulator)
 * rejects these, and that must never surface as an unhandled rejection.
 */
export function tapLight() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function tapMedium() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function notifyWarning() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
}
