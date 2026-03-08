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
  // Check support
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  // Don't ask again if already denied or granted
  if (Notification.permission === 'denied') return;
  if (Notification.permission === 'granted') {
    // Already granted, just ensure subscription is active
    await subscribe();
    return;
  }

  // Ask permission
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    await subscribe();
  }
}

async function subscribe() {
  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    // Get VAPID public key from backend
    const res = await fetch(`${API_URL}/api/push/vapid-key`);
    if (!res.ok) return;
    const { publicKey } = await res.json();
    if (!publicKey) return;

    // Check existing subscription
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }

    // Send subscription to backend
    await fetch(`${API_URL}/api/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        device: getDeviceType(),
      }),
    });
  } catch (e) {
    // Silent fail — don't bother user
  }
}
