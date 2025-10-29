/**
 * Notification utility functions for HrRoadways
 */

// Show a notification to the user
export const showNotification = (title, options = {}) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    // Fallback to regular browser notifications
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
    return;
  }

  // Use service worker to show notification
  navigator.serviceWorker.ready.then(registration => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      // As a soft fallback, try showing a basic Notification (may still be blocked)
      try {
        if (Notification.permission === 'granted') {
          new Notification(title, options);
        }
      } catch (_) {}
      return;
    }
    registration.showNotification(title, {
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-192x192.png',
      ...options
    });
  });
};

// Request permission for notifications
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications.');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Subscribe to push notifications
export const subscribeToPush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Get existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      return subscription;
    }
    
    // Get VAPID public key from environment (Vite exposes via import.meta.env)
    let vapidPublicKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
    
    // Fallback: fetch from backend if not set on frontend
    if (!vapidPublicKey) {
      try {
        const res = await fetch('/api/notifications/vapid-public-key');
        if (res.ok) {
          const json = await res.json();
          vapidPublicKey = json.publicKey || '';
        }
      } catch (_) {
        // ignore fetch errors, handled below
      }
    }
    
    if (!vapidPublicKey) {
      throw new Error('VAPID public key is not configured');
    }
    
    // Subscribe to push notifications
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    throw error;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    return false;
  }
};

// Convert base64 string to Uint8Array for VAPID key
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// Save user notification preferences
export const saveNotificationPreferences = (preferences) => {
  try {
    localStorage.setItem('notificationPrefs', JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Failed to save notification preferences:', error);
    return false;
  }
};

// Load user notification preferences
export const loadNotificationPreferences = () => {
  try {
    const prefs = localStorage.getItem('notificationPrefs');
    return prefs ? JSON.parse(prefs) : null;
  } catch (error) {
    console.error('Failed to load notification preferences:', error);
    return null;
  }
};

// Send subscription to backend
export const sendSubscriptionToBackend = async (subscription) => {
  try {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send subscription: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to send subscription to backend:', error);
    throw error;
  }
};

// Send notification event to backend
export const sendNotificationEvent = async (eventData) => {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send notification event: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to send notification event to backend:', error);
    throw error;
  }
};