const axios = require('axios');

async function testAPI() {
  try {
    // Test health check
    const healthResponse = await axios.get('http://localhost:50001/api/health');
    console.log('Health check:', healthResponse.data);
    
    // Test notification subscription count
    const subscriptionResponse = await axios.get('http://localhost:50001/api/notifications/subscriptions/count');
    console.log('Subscription count:', subscriptionResponse.data);
    
    // Test simulate bus delay
    const delayResponse = await axios.post('http://localhost:50001/api/simulate/delay', {
      route: 'Delhi-Chandigarh Express',
      delay: '15 minutes',
      estimatedTime: '10:30 AM'
    });
    console.log('Delay simulation:', delayResponse.data);
    
    // Test simulate route cancellation
    const cancellationResponse = await axios.post('http://localhost:50001/api/simulate/cancellation', {
      route: 'Rohtak-Hisar Local',
      reason: 'Road construction work'
    });
    console.log('Cancellation simulation:', cancellationResponse.data);
    
    // Test simulate traffic update
    const trafficResponse = await axios.post('http://localhost:50001/api/simulate/traffic', {
      route: 'Gurgaon-Ambala Highway',
      update: 'Accident near Karnal',
      impact: '20 minutes delay expected'
    });
    console.log('Traffic simulation:', trafficResponse.data);
    
    console.log('All API tests completed successfully!');
  } catch (error) {
    console.error('API test error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
    }
  }
}

testAPI();