// Simple API test for notification endpoints
fetch('http://localhost:50001/api/health')
  .then(response => response.json())
  .then(data => console.log('Health check:', data))
  .catch(error => console.error('Health check error:', error));

// Test notification subscription endpoint
fetch('http://localhost:50001/api/notifications/subscriptions/count')
  .then(response => response.json())
  .then(data => console.log('Subscription count:', data))
  .catch(error => console.error('Subscription count error:', error));