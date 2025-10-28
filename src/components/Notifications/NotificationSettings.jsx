import React, { useState, useEffect } from 'react';
import '../../styles/NotificationSettings.css';

const NotificationSettings = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [subscriptions, setSubscriptions] = useState({
    delays: true,
    cancellations: true,
    traffic: true,
    routes: []
  });

  useEffect(() => {
    // Check if browser supports notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
    
    // Load saved preferences
    const savedPrefs = localStorage.getItem('notificationPrefs');
    if (savedPrefs) {
      setSubscriptions(JSON.parse(savedPrefs));
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;
    
    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      
      if (permissionResult === 'granted') {
        // Register service worker and subscribe to push
        await registerServiceWorker();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.VITE_PUBLIC_VAPID_KEY)
      });
      
      // Send subscription to backend
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const toggleSubscription = (type) => {
    const newSubscriptions = {
      ...subscriptions,
      [type]: !subscriptions[type]
    };
    setSubscriptions(newSubscriptions);
    localStorage.setItem('notificationPrefs', JSON.stringify(newSubscriptions));
  };

  const addRouteSubscription = (route) => {
    if (!subscriptions.routes.includes(route)) {
      const newSubscriptions = {
        ...subscriptions,
        routes: [...subscriptions.routes, route]
      };
      setSubscriptions(newSubscriptions);
      localStorage.setItem('notificationPrefs', JSON.stringify(newSubscriptions));
    }
  };

  const removeRouteSubscription = (route) => {
    const newSubscriptions = {
      ...subscriptions,
      routes: subscriptions.routes.filter(r => r !== route)
    };
    setSubscriptions(newSubscriptions);
    localStorage.setItem('notificationPrefs', JSON.stringify(newSubscriptions));
  };

  if (!isSupported) {
    return (
      <div className="notification-settings">
        <h2>Notifications Not Supported</h2>
        <p>Your browser doesn't support push notifications.</p>
      </div>
    );
  }

  return (
    <div className="notification-settings p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
      
      {permission === 'default' && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p className="mb-2">Enable push notifications to receive real-time alerts about bus delays, cancellations, and traffic updates.</p>
          <button 
            onClick={requestPermission}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enable Notifications
          </button>
        </div>
      )}
      
      {permission === 'granted' && (
        <div className="mb-4 p-3 bg-green-50 rounded">
          <p className="text-green-700">Notifications are enabled</p>
        </div>
      )}
      
      {permission === 'denied' && (
        <div className="mb-4 p-3 bg-red-50 rounded">
          <p className="text-red-700">Notifications are blocked. Please enable them in your browser settings.</p>
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 border-b">
          <span>Bus Delays</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={subscriptions.delays}
              onChange={() => toggleSubscription('delays')}
              disabled={permission !== 'granted'}
            />
            <span className="slider round"></span>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-2 border-b">
          <span>Route Cancellations</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={subscriptions.cancellations}
              onChange={() => toggleSubscription('cancellations')}
              disabled={permission !== 'granted'}
            />
            <span className="slider round"></span>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-2 border-b">
          <span>Traffic Updates</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={subscriptions.traffic}
              onChange={() => toggleSubscription('traffic')}
              disabled={permission !== 'granted'}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Subscribe to Specific Routes</h3>
        <div className="flex">
          <input 
            type="text" 
            placeholder="Enter route name"
            id="routeInput"
            className="flex-1 px-3 py-2 border rounded-l"
          />
          <button 
            onClick={() => {
              const input = document.getElementById('routeInput');
              if (input.value.trim()) {
                addRouteSubscription(input.value.trim());
                input.value = '';
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-r"
            disabled={permission !== 'granted'}
          >
            Add
          </button>
        </div>
        
        <div className="mt-2">
          {subscriptions.routes.map((route, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded mb-1">
              <span>{route}</span>
              <button 
                onClick={() => removeRouteSubscription(route)}
                className="text-red-600 hover:text-red-800"
                disabled={permission !== 'granted'}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;