import express from 'express';
import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:' + (process.env.VAPID_EMAIL || 'admin@hrroadways.com'),
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn('VAPID keys not configured. Push notifications will not work.');
}

// In-memory storage for subscriptions (in production, use a database)
let subscriptions = [];

// Subscribe to notifications
router.post('/subscribe', (req, res) => {
  try {
    const subscription = req.body;
    
    // Check if subscription already exists
    const exists = subscriptions.some(sub => 
      sub.endpoint === subscription.endpoint
    );
    
    if (!exists) {
      subscriptions.push(subscription);
      console.log('New subscription added:', subscription.endpoint);
    }
    
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Unsubscribe from notifications
router.post('/unsubscribe', (req, res) => {
  try {
    const subscription = req.body;
    
    subscriptions = subscriptions.filter(sub => 
      sub.endpoint !== subscription.endpoint
    );
    
    console.log('Subscription removed:', subscription.endpoint);
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscription error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Send notification to all subscribers
router.post('/send', async (req, res) => {
  try {
    const { title, body, icon, data } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const notificationPayload = JSON.stringify({
      title,
      body: body || '',
      icon: icon || '/assets/icons/icon-192x192.png',
      data: data || {}
    });
    
    // Send notifications to all subscribers
    const promises = subscriptions.map(sub => 
      webpush.sendNotification(sub, notificationPayload)
        .catch(err => {
          console.error('Error sending notification:', err);
          // Remove invalid subscriptions
          if (err.statusCode === 410) {
            subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint);
          }
        })
    );
    
    await Promise.all(promises);
    
    res.status(200).json({ 
      message: 'Notifications sent successfully',
      count: subscriptions.length
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

// Send notification to specific user
router.post('/send-to-user', async (req, res) => {
  try {
    const { endpoint, title, body, icon, data } = req.body;
    
    if (!endpoint || !title) {
      return res.status(400).json({ error: 'Endpoint and title are required' });
    }
    
    const subscription = subscriptions.find(sub => sub.endpoint === endpoint);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    const notificationPayload = JSON.stringify({
      title,
      body: body || '',
      icon: icon || '/assets/icons/icon-192x192.png',
      data: data || {}
    });
    
    await webpush.sendNotification(subscription, notificationPayload);
    
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification to user:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Get subscription count
router.get('/subscriptions/count', (req, res) => {
  res.status(200).json({ count: subscriptions.length });
});

// Expose VAPID public key to the frontend (safe to share)
router.get('/vapid-public-key', (req, res) => {
  try {
    const key = process.env.VAPID_PUBLIC_KEY || '';
    res.status(200).json({ publicKey: key });
  } catch (error) {
    res.status(500).json({ publicKey: '' });
  }
});

export default router;