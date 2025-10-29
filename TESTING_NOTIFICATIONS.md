# Testing Push Notifications

## Prerequisites

1. Backend server running on port 50001
2. Frontend server running on port 5173

## Servers Setup

1. Start backend server:
   ```
   node Backend/mainServer.js
   ```

2. Start frontend server:
   ```
   npm run dev
   ```

## Testing Methods

### 1. Manual Browser Testing

1. Open your browser and navigate to http://localhost:5173
2. Go to the Notification Settings page at http://localhost:5173/notifications
3. Click "Enable Notifications" to request permission
4. Grant permission when prompted by the browser

### 2. API Endpoint Testing

The following API endpoints are available for testing:

1. **Health Check**: `GET http://localhost:50001/api/health`
2. **Notification Subscription Count**: `GET http://localhost:50001/api/notifications/subscriptions/count`
3. **Simulate Bus Delay**: `POST http://localhost:50001/api/simulate/delay`
4. **Simulate Route Cancellation**: `POST http://localhost:50001/api/simulate/cancellation`
5. **Simulate Traffic Update**: `POST http://localhost:50001/api/simulate/traffic`

### 3. Using the Test HTML Page

1. Open http://localhost:5173/test-notification.html in your browser
2. Use the buttons to:
   - Request notification permission
   - Send a test notification
   - Simulate different notification types

### 4. Using curl (Windows PowerShell)

```powershell
# Test health check
Invoke-WebRequest -Uri "http://localhost:50001/api/health" -Method GET

# Simulate bus delay
Invoke-WebRequest -Uri "http://localhost:50001/api/simulate/delay" -Method POST -Headers @{"Content-Type"="application/json"} -Body "{\"route\": \"Delhi-Chandigarh Express\", \"delay\": \"15 minutes\", \"estimatedTime\": \"10:30 AM\"}"

# Simulate route cancellation
Invoke-WebRequest -Uri "http://localhost:50001/api/simulate/cancellation" -Method POST -Headers @{"Content-Type"="application/json"} -Body "{\"route\": \"Rohtak-Hisar Local\", \"reason\": \"Road construction work\"}"

# Simulate traffic update
Invoke-WebRequest -Uri "http://localhost:50001/api/simulate/traffic" -Method POST -Headers @{"Content-Type"="application/json"} -Body "{\"route\": \"Gurgaon-Ambala Highway\", \"update\": \"Accident near Karnal\", \"impact\": \"20 minutes delay expected\"}"
```

## Expected Results

1. **Permission Request**: Browser should show a permission dialog
2. **Test Notification**: Should display a notification in the browser
3. **Simulation Endpoints**: Should return success messages
4. **Console Logs**: Backend should log notification events

## Troubleshooting

1. **"VAPID keys not configured" warning**: This is expected in development. Push notifications will still work for testing.
2. **CORS errors**: Make sure the CORS configuration in Backend/.env is correct
3. **Port conflicts**: Make sure no other processes are using ports 50001 or 5173
4. **Notification not showing**: Ensure browser permissions are granted and notifications are not blocked

## Notification Types

1. **Bus Delays**: Alerts when buses are running behind schedule
2. **Route Cancellations**: Notifications when routes are cancelled
3. **Traffic Updates**: Information about traffic conditions affecting routes
4. **User Preferences**: Users can choose which notifications to receive

The notification feature is now ready for testing!