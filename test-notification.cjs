const axios = require('axios');

async function testNotification() {
  try {
    // Test bus delay notification
    const delayResponse = await axios.post('http://localhost:50001/api/simulate/delay', {
      route: 'Delhi-Chandigarh Express',
      delay: '15 minutes',
      estimatedTime: '10:30 AM'
    });
    
    console.log('Delay notification response:', delayResponse.data);
    
    // Test route cancellation notification
    const cancellationResponse = await axios.post('http://localhost:50001/api/simulate/cancellation', {
      route: 'Rohtak-Hisar Local',
      reason: 'Road construction work'
    });
    
    console.log('Cancellation notification response:', cancellationResponse.data);
    
    // Test traffic update notification
    const trafficResponse = await axios.post('http://localhost:50001/api/simulate/traffic', {
      route: 'Gurgaon-Ambala Highway',
      update: 'Accident near Karnal',
      impact: '20 minutes delay expected'
    });
    
    console.log('Traffic notification response:', trafficResponse.data);
    
  } catch (error) {
    console.error('Error testing notifications:', error.message);
    console.error('Status code:', error.response?.status);
    console.error('Response data:', error.response?.data);
  }
}

testNotification();