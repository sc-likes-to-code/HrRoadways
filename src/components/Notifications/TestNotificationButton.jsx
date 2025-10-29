import React, { useState, useEffect } from 'react';
import { Bell, Send } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { showNotification, requestNotificationPermission, subscribeToPush, sendSubscriptionToBackend } from '../../utils/notifications';
import { simulateBusDelay, simulateRouteCancellation, simulateTrafficUpdate } from '../../services/notificationService';
import { toast } from 'react-toastify';

const TestNotificationButton = () => {
  const { permission, updatePermission } = useNotification();
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-refresh permission when user returns from browser settings
  useEffect(() => {
    const refreshPermission = () => {
      try {
        const p = typeof Notification !== 'undefined' ? Notification.permission : 'default';
        updatePermission(p);
      } catch (_) {}
    };
    window.addEventListener('focus', refreshPermission);
    document.addEventListener('visibilitychange', refreshPermission);
    return () => {
      window.removeEventListener('focus', refreshPermission);
      document.removeEventListener('visibilitychange', refreshPermission);
    };
  }, [updatePermission]);

  const enableNotifications = async () => {
    try {
      setStatusMessage('');
      setErrorMessage('');
      const granted = await requestNotificationPermission();
      // Re-read effective permission from the browser to avoid stale state
      const currentPermission = typeof Notification !== 'undefined' ? Notification.permission : (granted ? 'granted' : 'default');
      updatePermission(currentPermission);
      if (currentPermission === 'granted') {
        // If VAPID not configured, skip push subscription gracefully
        const vapidPublicKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
        if (vapidPublicKey && 'serviceWorker' in navigator && 'PushManager' in window) {
          try {
            const subscription = await subscribeToPush();
            await sendSubscriptionToBackend(subscription);
            setStatusMessage('Push subscription registered.');
          } catch (subErr) {
            console.error('Push subscription failed:', subErr);
            setErrorMessage('Push subscription failed. Basic notifications will still work.');
          }
        } else {
          setStatusMessage('Permission granted. Push not configured (missing VAPID). Showing basic notifications only.');
        }
        showNotification('Notifications Enabled', {
          body: 'You will receive important updates here.',
          icon: '/assets/icons/icon-192x192.png'
        });
      } else if (currentPermission === 'denied') {
        setErrorMessage('Notifications are blocked by the browser. Enable them in site settings and retry.');
      } else {
        setStatusMessage('Permission not selected. Please confirm the prompt.');
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      setErrorMessage('Failed to enable notifications. Check browser settings.');
    }
  };

  const testBasicNotification = () => {
    showNotification('Test Notification', {
      body: 'This is a test notification from HrRoadways!',
      icon: '/assets/icons/icon-192x192.png'
    });
  };

  const testBusDelay = async () => {
    try {
      await simulateBusDelay({
        route: 'Delhi-Chandigarh Express',
        delay: '15 minutes',
        estimatedTime: '10:30 AM'
      });
      showNotification('Delay Simulation', {
        body: 'Bus delay notification sent successfully!',
        icon: '/assets/icons/icon-192x192.png'
      });
    } catch (error) {
      console.error('Error simulating bus delay:', error);
    }
  };

  const testRouteCancellation = async () => {
    try {
      await simulateRouteCancellation({
        route: 'Rohtak-Hisar Local',
        reason: 'Road construction work'
      });
      showNotification('Cancellation Simulation', {
        body: 'Route cancellation notification sent successfully!',
        icon: '/assets/icons/icon-192x192.png'
      });
    } catch (error) {
      console.error('Error simulating route cancellation:', error);
    }
  };

  const testTrafficUpdate = async () => {
    try {
      await simulateTrafficUpdate({
        route: 'Gurgaon-Ambala Highway',
        update: 'Accident near Karnal',
        impact: '20 minutes delay expected'
      });
      showNotification('Traffic Simulation', {
        body: 'Traffic update notification sent successfully!',
        icon: '/assets/icons/icon-192x192.png'
      });
    } catch (error) {
      console.error('Error simulating traffic update:', error);
    }
  };

  if (permission !== 'granted') {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Enable Notifications
        </h3>
        <p className="text-sm mb-3 text-gray-600 dark:text-gray-300">Get delay, cancellation and traffic alerts.</p>
        {permission === 'denied' && (
          <div className="text-xs mb-3 text-red-600 dark:text-red-400">
            Notifications are blocked by the browser. Enable them in site settings and retry.
            <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-300">
              Steps: Click the lock icon in the address bar → Site settings → Notifications → Allow, then return and press Retry.
            </div>
          </div>
        )}
        {statusMessage && (
          <p className="text-xs mb-2 text-green-600 dark:text-green-400">{statusMessage}</p>
        )}
        {errorMessage && (
          <p className="text-xs mb-2 text-red-600 dark:text-red-400">{errorMessage}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={enableNotifications}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {permission === 'denied' ? 'Retry' : 'Allow Notifications'}
          </button>
          <button
            onClick={() => toast.info('In-app alert enabled. System notifications are still blocked.', { position: 'bottom-right' })}
            className="px-3 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
          >
            Use In-App Alert
          </button>
          {permission === 'denied' && (
            <a
              href={navigator.userAgent.includes('Edg') ? `edge://settings/content/siteDetails?site=${encodeURIComponent(location.origin)}` : `chrome://settings/content/siteDetails?site=${encodeURIComponent(location.origin)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
            >
              Open Site Settings
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <Bell className="w-5 h-5 text-blue-500" />
        Test Notifications
      </h3>
      {statusMessage && (
        <p className="text-xs mb-2 text-green-600 dark:text-green-400">{statusMessage}</p>
      )}
      {errorMessage && (
        <p className="text-xs mb-2 text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
      <div className="flex flex-col gap-2">
        <button
          onClick={testBasicNotification}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          <Send className="w-4 h-4" />
          Basic Notification
        </button>
        <button
          onClick={testBusDelay}
          className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          <Send className="w-4 h-4" />
          Bus Delay
        </button>
        <button
          onClick={testRouteCancellation}
          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          <Send className="w-4 h-4" />
          Route Cancellation
        </button>
        <button
          onClick={testTrafficUpdate}
          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          <Send className="w-4 h-4" />
          Traffic Update
        </button>
      </div>
    </div>
  );
};

export default TestNotificationButton;