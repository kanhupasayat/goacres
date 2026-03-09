// GOACRES Push Notification Service Worker v3

// Force new SW to activate immediately
self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  const showNotif = async () => {
    let title = 'GOACRES';
    let options = {
      body: 'Naya plot available hai!',
      icon: 'https://goacres.in/notification-icon.png',
      badge: 'https://goacres.in/notification-badge.png',
      tag: 'goacres-' + Date.now(),
    };

    if (event.data) {
      try {
        const data = event.data.json();
        title = data.title || 'GOACRES';
        options = {
          body: data.body || '',
          icon: 'https://goacres.in/notification-icon.png',
          badge: 'https://goacres.in/notification-badge.png',
          image: data.image || undefined,
          data: { url: data.url || 'https://goacres.in' },
          tag: 'goacres-' + Date.now(),
          actions: [
            { action: 'open', title: 'Abhi Dekho' },
          ],
          requireInteraction: true,
          vibrate: [200, 100, 200],
        };
      } catch (e) {
        options.body = event.data.text();
      }
    }

    await self.registration.showNotification(title, options);
  };

  event.waitUntil(showNotif());
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification.data?.url || 'https://goacres.in';
  event.waitUntil(clients.openWindow(url));
});
