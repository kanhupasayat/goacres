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
    await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
    const reg = await navigator.serviceWorker.ready;
    console.log('PUSH: SW ready, active:', !!reg.active);

    if (Notification.permission === 'denied') { console.log('PUSH: Permission denied'); return; }

    if (Notification.permission === 'granted') {
      console.log('PUSH: Already granted, subscribing...');
      await subscribe(reg);
      return;
    }

    // Permission not yet asked — show custom prompt banner (user gesture required)
    console.log('PUSH: Showing notification banner...');
    showNotificationBanner(reg);
  } catch (e) {
    console.log('PUSH: Error:', e.message || e);
  }
}

function showNotificationBanner(reg) {
  // Don't show if already dismissed recently
  const dismissed = localStorage.getItem('push_banner_dismissed');
  if (dismissed && Date.now() - Number(dismissed) < 3 * 24 * 60 * 60 * 1000) return; // 3 days

  const banner = document.createElement('div');
  banner.id = 'push-banner';
  banner.innerHTML = `
    <div class="push-banner-content">
      <span class="push-banner-icon">🔔</span>
      <p>Naye plots ki notification paana chahte ho?</p>
      <div class="push-banner-buttons">
        <button id="push-banner-yes">Haan, Allow Karo</button>
        <button id="push-banner-no">Baad Me</button>
      </div>
    </div>
  `;

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    #push-banner {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99997;
      width: calc(100% - 32px);
      max-width: 420px;
      background: #1a1a2e;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      animation: pushBannerSlide 0.4s ease-out;
    }
    @keyframes pushBannerSlide {
      from { transform: translateX(-50%) translateY(100px); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    .push-banner-content { text-align: center; }
    .push-banner-icon { font-size: 28px; display: block; margin-bottom: 8px; }
    .push-banner-content p {
      color: #fff;
      font-size: 15px;
      margin: 0 0 16px;
      font-family: 'Poppins', sans-serif;
    }
    .push-banner-buttons { display: flex; gap: 10px; justify-content: center; }
    #push-banner-yes {
      background: var(--primary-red, #FF0000);
      color: #fff;
      border: none;
      padding: 10px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
    }
    #push-banner-no {
      background: transparent;
      color: #999;
      border: 1px solid #333;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 14px;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(banner);

  document.getElementById('push-banner-yes').addEventListener('click', async () => {
    banner.remove();
    console.log('PUSH: User clicked allow...');
    const permission = await Notification.requestPermission();
    console.log('PUSH: Permission result:', permission);
    if (permission === 'granted') {
      await subscribe(reg);
    }
  });

  document.getElementById('push-banner-no').addEventListener('click', () => {
    banner.remove();
    localStorage.setItem('push_banner_dismissed', String(Date.now()));
  });
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

    // Instant confirmation so the user knows it actually worked — only the
    // first time (not on every auto-subscribe / page reload).
    // Also serves as an end-to-end test of the service worker + display.
    if (!localStorage.getItem('push_welcomed')) {
      try {
        await reg.showNotification('GOACRES 🔔', {
          body: 'Notifications on ho gaye! Naye plots aate hi aapko sabse pehle update milega.',
          icon: 'https://goacres.in/notification-icon.png',
          badge: 'https://goacres.in/notification-badge.png',
          tag: 'goacres-welcome',
        });
        localStorage.setItem('push_welcomed', '1');
      } catch (notifErr) {
        console.log('PUSH: Welcome notification failed:', notifErr.message || notifErr);
      }
    }
  } catch (e) {
    console.log('PUSH: Subscribe error:', e.message || e);
  }
}
