import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyorWOfuTEJc6BXxdEbZEzfT0M6wjZ1Nc",
  authDomain: "bi3o-c3d58.firebaseapp.com",
  projectId: "bi3o-c3d58",
  storageBucket: "bi3o-c3d58.firebasestorage.app",
  messagingSenderId: "716056845870",
  appId: "1:716056845870:web:c428779b93dd831e1549bf",
  measurementId: "G-JFJ1RWLNQ9",
};

// Initialize Firebase
const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize Firebase Messaging with browser support check
const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    console.log('Firebase Messaging is not supported in this browser');
    return null;
  } catch (err) {
    console.error('Error initializing Firebase Messaging:', err);
    return null;
  }
})();

// Correctly export a promise that resolves to messaging instance (or null)
export const getMessagingObject = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    return null;
  } catch (err) {
    console.error("Messaging not supported:", err);
    return null;
  }
};

export const auth = getAuth(firebaseApp);

const ensureNotificationPermission = async () => {
  try {
    if (typeof window === 'undefined' || typeof Notification === 'undefined') {
      return 'unsupported';
    }
    if (window.location && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      return 'insecure';
    }
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'error';
  }
};

// fetchToken function
export const fetchToken = async (setTokenFound, setFcmToken) => {
  try {
    const messagingInstance = await messaging;
    if (!messagingInstance) {
      console.log('Messaging not available');
      return null;
    }

    const perm = await ensureNotificationPermission();
    if (perm !== 'granted') {
      setTokenFound(false);
      if (setFcmToken) setFcmToken(null);
      return null;
    }

    let swReg = undefined;
    try {
      if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
        swReg = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
        if (!swReg) {
          swReg = await navigator.serviceWorker.ready;
        }
      }
    } catch {}

    const currentToken = await getToken(messagingInstance, {
      vapidKey: "BDAtSmLHFf8w5KMOBfajwXNev1Bq0gmhZIwuqywzpWJ9bQuwONCE8gBwC2LJz5OIlm2Xe7kQlzol8eE-AeWTz-w",
      serviceWorkerRegistration: swReg,
    });

    if (currentToken) {
      setTokenFound(true);
      if (setFcmToken) setFcmToken(currentToken);
      return currentToken;
    } else {
      setTokenFound(false);
      if (setFcmToken) setFcmToken(null);
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
    setTokenFound(false);
    if (setFcmToken) setFcmToken(null);
    return null;
  }
};

// onMessageListener function
export const onMessageListener = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const messaging = await getMessagingObject();
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } catch (err) {
      reject(err);
    }
  });
