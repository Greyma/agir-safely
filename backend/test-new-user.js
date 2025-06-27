import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function testNewUser() {
  console.log('🧪 Testing new user login...\n');

  try {
    // Test login with new user credentials
    console.log('Testing login with test123@gmail.com...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test123@gmail.com',
        password: 'test12345'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ New user login successful!');
      console.log('   User:', loginData.user.name);
      console.log('   Email:', loginData.user.email);
      console.log('   Token:', loginData.token.substring(0, 20) + '...');
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ New user login failed:', errorData.message);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  console.log('\n🎉 New user test completed!');
}

// Run the test
testNewUser(); 