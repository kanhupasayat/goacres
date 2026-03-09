const API_URL = import.meta.env.VITE_API_URL || '';

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(ua)) return 'Mobile';
  if (/Tablet|iPad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function initPushNotifications() {
  if (!API_URL) return;
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return;

  try {
    console.log('PUSH: Registering SW...');
    // Register SW but use .ready for guaranteed active registration
    await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
    const reg = await navigator.serviceWorker.ready;
    console.log('PUSH: SW ready, active:', !!reg.active);

    if (Notification.permission === 'denied') { console.log('PUSH: Permission denied'); return; }

    if (Notification.permission === 'granted') {
      console.log('PUSH: Already granted, subscribing...');
      await subscribe(reg);
      return;
    }

    console.log('PUSH: Asking permission...');
    const permission = await Notification.requestPermission();
    console.log('PUSH: Permission result:', permission);
    if (permission === 'granted') {
      await subscribe(reg);
    }
  } catch (e) {
    console.log('PUSH: Error:', e.message || e);
  }
}

async function subscribe(reg) {
  try {
    console.log('PUSH: Fetching VAPID key...');
    const res = await fetch(`${API_URL}/api/push/vapid-key`);
    if (!res.ok) { console.log('PUSH: VAPID fetch failed:', res.status); return; }
    const { publicKey } = await res.json();
    if (!publicKey) { console.log('PUSH: No publicKey in response'); return; }

    const appKey = urlBase64ToUint8Array(publicKey);

    // Check existing subscription
    let subscription = await reg.pushManager.getSubscription();
    console.log('PUSH: Existing subscription:', !!subscription);

    if (subscription) {
      // Verify existing subscription uses same key, otherwise re-subscribe
      const existingKey = subscription.options?.applicationServerKey;
      if (existingKey) {
        const existingArr = new Uint8Array(existingKey);
        const keysMatch = existingArr.length === appKey.length &&
          existingArr.every((v, i) => v === appKey[i]);
        if (!keysMatch) {
          console.log('PUSH: VAPID key changed, re-subscribing...');
          await subscription.unsubscribe();
          subscription = null;
        }
      }
    }

    if (!subscription) {
      console.log('PUSH: Creating subscription...');
      try {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: appKey,
        });
      } catch (subErr) {
        // Storage error — unsubscribe stale data and retry once
        console.log('PUSH: Subscribe failed, clearing stale data and retrying...', subErr.message);
        const stale = await reg.pushManager.getSubscription();
        if (stale) await stale.unsubscribe();
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: appKey,
        });
      }
    }

    console.log('PUSH: Sending to backend...');
    const resp = await fetch(`${API_URL}/api/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        device: getDeviceType(),
      }),
    });
    const data = await resp.json();
    console.log('PUSH: Done!', data.message || data);
  } catch (e) {
    console.log('PUSH: Subscribe error:', e.message || e);
  }
}
