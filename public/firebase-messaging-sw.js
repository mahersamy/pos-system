importScripts('https://www.gstatic.com/firebasejs/11.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBRtmJnj7sqGifU9uAxrwF6EIrWVkNUdTw',
  authDomain: 'pos-system-8ba1e.firebaseapp.com',
  projectId: 'pos-system-8ba1e',
  storageBucket: 'pos-system-8ba1e.firebasestorage.app',
  messagingSenderId: '886665894686',
  appId: '1:886665894686:web:eb342925c0423ac050070f',
});

const messaging = firebase.messaging();

// Handles FCM push messages when app tab is CLOSED or in background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.image || '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Opens/focuses the app when user clicks the notification toast.
// Supports a 'url' field in the FCM data payload for deep-linking.
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification);
  const targetUrl = (event.notification.data && event.notification.data['url']) || '/';
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus an already-open tab that matches the target URL
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab at the target URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }),
  );
});
