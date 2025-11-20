const fetch = require('node-fetch');

async function testRegister() {
  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'test1234',
        name: 'Test User',
        companyName: 'Test Company'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (!response.ok) {
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRegister();
