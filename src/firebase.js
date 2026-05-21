import { initializeApp, getApps, getApp } from "firebase/app";

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

export const getMessagingObject = async () => {
  try {
    const { getMessaging, isSupported } = await import("firebase/messaging");
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

let _auth = null;
let _authPromise = null;
export const getAuthInstance = () => {
  if (_auth) return Promise.resolve(_auth);
  if (!_authPromise) {
    _authPromise = import("firebase/auth").then(({ getAuth }) => {
      _auth = getAuth(firebaseApp);
      return _auth;
    });
  }
  return _authPromise;
};

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
    const { getToken } = await import("firebase/messaging");
    const messagingInstance = await getMessagingObject();
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
      const { onMessage } = await import("firebase/messaging");
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } catch (err) {
      reject(err);
    }
  });
