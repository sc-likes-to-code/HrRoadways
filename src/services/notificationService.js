/**
 * Notification Service API Client
 */

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:50001';
const API_BASE_URL = `${BACKEND_BASE_URL}/api/notifications`;

/**
 * Subscribe to push notifications
 * @param {Object} subscription - Push subscription object
 * @returns {Promise<Object>} Response from the server
 */
export const subscribeToNotifications = async (subscription) => {
  const response = await fetch(`${API_BASE_URL}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to subscribe: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Unsubscribe from push notifications
 * @param {Object} subscription - Push subscription object
 * @returns {Promise<Object>} Response from the server
 */
export const unsubscribeFromNotifications = async (subscription) => {
  const response = await fetch(`${API_BASE_URL}/unsubscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to unsubscribe: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Send notification to all subscribers
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Response from the server
 */
export const sendNotificationToAll = async (notificationData) => {
  const response = await fetch(`${API_BASE_URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notificationData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to send notification: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Send notification to specific user
 * @param {Object} notificationData - Notification data including endpoint
 * @returns {Promise<Object>} Response from the server
 */
export const sendNotificationToUser = async (notificationData) => {
  const response = await fetch(`${API_BASE_URL}/send-to-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notificationData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to send notification to user: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Get subscription count
 * @returns {Promise<Object>} Subscription count
 */
export const getSubscriptionCount = async () => {
  const response = await fetch(`${API_BASE_URL}/subscriptions/count`);
  
  if (!response.ok) {
    throw new Error(`Failed to get subscription count: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Simulate bus delay notification
 * @param {Object} delayData - Delay information
 * @returns {Promise<Object>} Response from the server
 */
export const simulateBusDelay = async (delayData) => {
  const response = await fetch(`${BACKEND_BASE_URL}/api/simulate/delay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(delayData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to simulate bus delay: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Simulate route cancellation notification
 * @param {Object} cancellationData - Cancellation information
 * @returns {Promise<Object>} Response from the server
 */
export const simulateRouteCancellation = async (cancellationData) => {
  const response = await fetch(`${BACKEND_BASE_URL}/api/simulate/cancellation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cancellationData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to simulate route cancellation: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Simulate traffic update notification
 * @param {Object} trafficData - Traffic information
 * @returns {Promise<Object>} Response from the server
 */
export const simulateTrafficUpdate = async (trafficData) => {
  const response = await fetch(`${BACKEND_BASE_URL}/api/simulate/traffic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trafficData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to simulate traffic update: ${response.statusText}`);
  }
  
  return response.json();
};

export default {
  subscribeToNotifications,
  unsubscribeFromNotifications,
  sendNotificationToAll,
  sendNotificationToUser,
  getSubscriptionCount,
  simulateBusDelay,
  simulateRouteCancellation,
  simulateTrafficUpdate
};