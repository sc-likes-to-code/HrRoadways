/**
 * Utility functions for sending notification events
 */

// In-memory storage for user subscriptions and preferences
// In production, this should be stored in a database
let userSubscriptions = new Map();

/**
 * Add a user subscription
 * @param {string} userId - User identifier
 * @param {object} subscription - Push subscription object
 * @param {object} preferences - User notification preferences
 */
export const addUserSubscription = (userId, subscription, preferences = {}) => {
  userSubscriptions.set(userId, {
    subscription,
    preferences,
    createdAt: new Date()
  });
};

/**
 * Remove a user subscription
 * @param {string} userId - User identifier
 */
export const removeUserSubscription = (userId) => {
  userSubscriptions.delete(userId);
};

/**
 * Get user subscription
 * @param {string} userId - User identifier
 * @returns {object|null} User subscription data
 */
export const getUserSubscription = (userId) => {
  return userSubscriptions.get(userId) || null;
};

/**
 * Get all user subscriptions
 * @returns {Map} All user subscriptions
 */
export const getAllUserSubscriptions = () => {
  return userSubscriptions;
};

/**
 * Send bus delay notification
 * @param {string} route - Bus route
 * @param {string} delay - Delay information
 * @param {string} estimatedTime - Estimated arrival time
 */
export const sendBusDelayNotification = async (route, delay, estimatedTime) => {
  const notificationData = {
    title: 'Bus Delay Alert',
    body: `Bus on route ${route} is delayed by ${delay}. Estimated arrival: ${estimatedTime}`,
    data: { 
      type: 'delay',
      route,
      delay,
      estimatedTime
    }
  };
  
  // In a real implementation, this would send to the notifications API
  console.log('Bus delay notification:', notificationData);
  return notificationData;
};

/**
 * Send route cancellation notification
 * @param {string} route - Bus route
 * @param {string} reason - Cancellation reason
 */
export const sendRouteCancellationNotification = async (route, reason) => {
  const notificationData = {
    title: 'Route Cancellation',
    body: `Route ${route} has been cancelled. Reason: ${reason}`,
    data: { 
      type: 'cancellation',
      route,
      reason
    }
  };
  
  console.log('Route cancellation notification:', notificationData);
  return notificationData;
};

/**
 * Send traffic update notification
 * @param {string} route - Bus route
 * @param {string} update - Traffic update information
 * @param {string} impact - Impact on travel time
 */
export const sendTrafficUpdateNotification = async (route, update, impact) => {
  const notificationData = {
    title: 'Traffic Update',
    body: `Traffic on route ${route}: ${update}. Impact: ${impact}`,
    data: { 
      type: 'traffic',
      route,
      update,
      impact
    }
  };
  
  console.log('Traffic update notification:', notificationData);
  return notificationData;
};

/**
 * Send AI predicted delay notification
 * @param {string} route - Bus route
 * @param {string} predictedDelay - Predicted delay
 * @param {string} confidence - Confidence level
 */
export const sendPredictedDelayNotification = async (route, predictedDelay, confidence) => {
  const notificationData = {
    title: 'Predicted Delay Alert',
    body: `AI predicts ${route} will be delayed by ${predictedDelay} (Confidence: ${confidence}%)`,
    data: { 
      type: 'predicted_delay',
      route,
      predictedDelay,
      confidence
    }
  };
  
  console.log('Predicted delay notification:', notificationData);
  return notificationData;
};

export default {
  addUserSubscription,
  removeUserSubscription,
  getUserSubscription,
  getAllUserSubscriptions,
  sendBusDelayNotification,
  sendRouteCancellationNotification,
  sendTrafficUpdateNotification,
  sendPredictedDelayNotification
};