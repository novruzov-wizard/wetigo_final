// Web Push subscription helpers — register the SW push subscription with the backend.
import { push } from './api';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function pushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/** Ask permission, subscribe via the SW, and register the subscription on the backend. */
export async function enablePush(): Promise<{ ok: boolean; reason?: string }> {
  if (!pushSupported()) return { ok: false, reason: 'unsupported' };
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return { ok: false, reason: 'denied' };

  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const { publicKey } = await push.key();
    if (!publicKey) return { ok: false, reason: 'no-key' };
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }
  await push.subscribe(sub.toJSON());
  return { ok: true };
}

/** Show a branded notification immediately on this device (works even before any server push). */
export async function showLocalNotification(title: string, body: string): Promise<void> {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const opts: NotificationOptions = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  };
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, opts);
      return;
    }
  } catch { /* fall through */ }
  try { new Notification(title, opts); } catch { /* ignore */ }
}

/**
 * Idempotently make sure the backend has THIS device's push subscription.
 * Safe to call on load and before sending a test — fixes cases where the
 * original subscribe POST failed (e.g. an expired token) so the device was
 * "enabled" in the browser but unknown to the server.
 */
export async function ensurePush(): Promise<boolean> {
  try {
    if (!pushSupported() || Notification.permission !== 'granted') return false;
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      const { publicKey } = await push.key();
      if (!publicKey) return false;
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }
    await push.subscribe(sub.toJSON());   // upsert on the backend
    return true;
  } catch {
    return false;
  }
}

export async function disablePush(): Promise<void> {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    try { await push.unsubscribe(sub.endpoint); } catch { /* ignore */ }
    try { await sub.unsubscribe(); } catch { /* ignore */ }
  }
}
