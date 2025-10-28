import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { requestNotificationPermission, subscribeToPush, sendSubscriptionToBackend } from '../../utils/notifications';

const NotificationTest = () => {
  const { permission, updatePermission, isSupported } = useNotification();

  const handleRequestPermission = async () => {
    try {
      const granted = await requestNotificationPermission();
      updatePermission(granted ? 'granted' : 'denied');
      
      if (granted) {
        // Subscribe to push notifications
        const subscription = await subscribeToPush();
        // Send subscription to backend
        await sendSubscriptionToBackend(subscription);
        console.log('Subscribed to push notifications');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <h2>Notifications Not Supported</h2>
        <p>Your browser doesn't support push notifications.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Notification Test</h2>
      
      <div className="mb-4">
        <p className="mb-2">Current permission status: <strong>{permission}</strong></p>
        
        {permission === 'default' && (
          <button 
            onClick={handleRequestPermission}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Request Notification Permission
          </button>
        )}
        
        {permission === 'granted' && (
          <div className="p-3 bg-green-100 text-green-700 rounded">
            <p>Notifications are enabled</p>
          </div>
        )}
        
        {permission === 'denied' && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            <p>Notifications are blocked. Please enable them in your browser settings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTest;