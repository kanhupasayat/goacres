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
    // Step 1: Unregister ALL old service workers and start fresh
    const existingRegs = await navigator.serviceWorker.getRegistrations();
    for (const reg of existingRegs) {
      await reg.unregister();
    }

    // Step 2: Register fresh service worker
    const registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });

    // Wait for the new SW to be active
    if (registration.installing) {
      await new Promise((resolve) => {
        registration.installing.addEventListener('statechange', (e) => {
          if (e.target.state === 'activated') resolve();
        });
      });
    } else {
      await navigator.serviceWorker.ready;
    }

    // Step 3: If already denied, stop
    if (Notification.permission === 'denied') return;

    // Step 4: If already granted, just subscribe
    if (Notification.permission === 'granted') {
      await subscribe(registration);
      return;
    }

    // Step 5: Ask permission
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await subscribe(registration);
    }
  } catch (e) {
    console.log('Push setup error:', e);
  }
}

async function subscribe(registration) {
  try {
    // Get VAPID public key from backend
    const res = await fetch(`${API_URL}/api/push/vapid-key`);
    if (!res.ok) return;
    const { publicKey } = await res.json();
    if (!publicKey) return;

    // Always unsubscribe old and create fresh subscription
    const oldSub = await registration.pushManager.getSubscription();
    if (oldSub) {
      await oldSub.unsubscribe();
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // Send fresh subscription to backend
    await fetch(`${API_URL}/api/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        device: getDeviceType(),
      }),
    });
  } catch (e) {
    console.log('Push subscribe error:', e);
  }
}
