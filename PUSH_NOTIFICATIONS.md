# Push Notifications Implementation

This document describes the implementation of push notifications for the HrRoadways application.

## Overview

The push notification system allows users to receive real-time alerts about:
- Bus delays
- Route cancellations
- Traffic conditions affecting ETA
- AI-predicted delays (future enhancement)

## Technical Architecture

### Frontend (React + Vite)

1. **Service Worker**: Handles push events and displays notifications
2. **Notification Context**: Manages notification state across the application
3. **Notification Components**:
   - NotificationSettings: UI for users to manage notification preferences
   - NotificationTest: Component for testing notification functionality
4. **Utility Functions**: Helper functions for requesting permissions and showing notifications
5. **API Client**: Service for communicating with backend notification endpoints

### Backend (Node.js + Express)

1. **Notification Routes**: API endpoints for managing subscriptions and sending notifications
2. **Web Push Integration**: Uses the `web-push` library to send push notifications
3. **Subscription Management**: Stores user subscriptions (in-memory for development)
4. **Simulation Endpoints**: API endpoints for testing notifications

## File Structure

```
src/
├── components/
│   └── Notifications/
│       ├── NotificationSettings.jsx
│       └── NotificationTest.jsx
├── contexts/
│   └── NotificationContext.jsx
├── styles/
│   └── NotificationSettings.css
├── utils/
│   └── notifications.js
├── services/
│   └── notificationService.js
├── App.jsx (updated with NotificationProvider)
└── main.jsx (updated with service worker registration)

Backend/
├── routes/
│   └── notifications.js
├── utils/
│   └── notificationEvents.js
├── mainServer.js (updated with notifications route)
├── server.js (updated with simulation endpoints)
└── .env.example (updated with VAPID keys)
```

## Setup Instructions

### 1. Generate VAPID Keys

Run the following command to generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

### 2. Configure Environment Variables

Add the following to your `.env` files:

**Frontend (.env):**
```
VITE_PUBLIC_VAPID_KEY=your_generated_public_key_here
```

**Backend (Backend/.env):**
```
VAPID_EMAIL=admin@hrroadways.com
VAPID_PUBLIC_KEY=your_generated_public_key_here
VAPID_PRIVATE_KEY=your_generated_private_key_here
```

### 3. Install Dependencies

```bash
# In the Backend directory
npm install web-push
```

## Usage

### Notification Settings

Users can manage their notification preferences through the Notification Settings page (`/notifications`).

### Receiving Notifications

The service worker automatically handles incoming push events and displays notifications to the user.

### Testing Notifications

Use the simulation endpoints to test notifications:

```bash
# Simulate bus delay
curl -X POST http://localhost:4000/api/simulate/delay \
  -H "Content-Type: application/json" \
  -d '{"route": "Delhi-Rohtak", "delay": "15 minutes", "estimatedTime": "10:30 AM"}'

# Simulate route cancellation
curl -X POST http://localhost:4000/api/simulate/cancellation \
  -H "Content-Type: application/json" \
  -d '{"route": "Chandigarh-Hisar", "reason": "Road construction"}'

# Simulate traffic update
curl -X POST http://localhost:4000/api/simulate/traffic \
  -H "Content-Type: application/json" \
  -d '{"route": "Gurgaon-Ambala", "update": "Accident on NH1", "impact": "20 minutes delay"}'
```

## Future Enhancements

1. **AI-based Predicted Delays**: Integrate machine learning models to predict delays
2. **Multilingual Notifications**: Support for notifications in multiple languages
3. **Mobile Push Notifications**: Integration with Firebase Cloud Messaging (FCM)
4. **Database Storage**: Store subscriptions in a persistent database
5. **User-specific Notifications**: Target notifications to specific users or routes

## Security Considerations

1. VAPID keys should be kept secure and not exposed in client-side code
2. Only the public VAPID key should be exposed to the frontend
3. Subscriptions should be validated before sending notifications
4. Implement rate limiting for notification endpoints

## Troubleshooting

1. **Notifications not showing**: Ensure the service worker is properly registered
2. **Permission denied**: Check browser notification settings
3. **VAPID key errors**: Verify that both public and private keys are correctly configured
4. **Subscription failures**: Check network connectivity and server configuration