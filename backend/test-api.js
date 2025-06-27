import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Agir Safely API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${API_BASE}/`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test login with default credentials
    console.log('\n2. Testing login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful');
      console.log('   User:', loginData.user.name);
      console.log('   Token:', loginData.token.substring(0, 20) + '...');

      // Test protected route
      console.log('\n3. Testing protected route...');
      const protectedResponse = await fetch(`${API_BASE}/api/protected`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      if (protectedResponse.ok) {
        const protectedData = await protectedResponse.json();
        console.log('✅ Protected route accessible');
        console.log('   Message:', protectedData.message);
      } else {
        console.log('❌ Protected route failed');
      }

      // Test profile route
      console.log('\n4. Testing profile route...');
      const profileResponse = await fetch(`${API_BASE}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Profile route accessible');
        console.log('   User profile:', profileData.user.name);
      } else {
        console.log('❌ Profile route failed');
      }

    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData.message);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  console.log('\n🎉 API testing completed!');
}

// Run the test
testAPI(); 