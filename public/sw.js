// GOACRES Push Notification Service Worker

self.addEventListener('push', function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || '',
      icon: data.icon || '/logo.png',
      badge: '/logo.png',
      data: { url: data.url || '/' },
      vibrate: [200, 100, 200],
      requireInteraction: true,
    };
    event.waitUntil(self.registration.showNotification(data.title || 'GOACRES', options));
  } catch (e) {
    // fallback for plain text
    event.waitUntil(self.registration.showNotification('GOACRES', { body: event.data.text() }));
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
