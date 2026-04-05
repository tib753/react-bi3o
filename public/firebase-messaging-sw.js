importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBsRmaG3zvH6AozTsCdr4TXI_JZzf3QlOQ",
  authDomain: "bi3o-c3d58.firebaseapp.com",
  projectId: "bi3o-c3d58",
  storageBucket: "bi3o-c3d58.firebasestorage.app",
  messagingSenderId: "716056845870",
  appId: "1:716056845870:web:c428779b93dd831e1549bf",
  measurementId: "G-JFJ1RWLNQ9"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/logo.png', // تأكد من وجود هذا الملف في المجلد العام
    data: payload.data || {}
  };

  // Show the notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event);
  event.notification.close();
  
  // Handle notification click action
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
