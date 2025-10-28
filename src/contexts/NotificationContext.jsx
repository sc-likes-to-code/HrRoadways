import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadNotificationPreferences } from '../utils/notifications';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [permission, setPermission] = useState('default'); // default, granted, denied
  const [preferences, setPreferences] = useState({
    delays: true,
    cancellations: true,
    traffic: true,
    routes: []
  });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
    }
    
    // Check notification permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    
    // Load saved preferences
    const savedPrefs = loadNotificationPreferences();
    if (savedPrefs) {
      setPreferences(savedPrefs);
    }
  }, []);

  const updatePermission = (newPermission) => {
    setPermission(newPermission);
  };

  const updatePreferences = (newPreferences) => {
    setPreferences(newPreferences);
  };

  const value = {
    permission,
    preferences,
    isSupported,
    updatePermission,
    updatePreferences
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};