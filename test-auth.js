// Script para probar el Auth Service
const baseUrl = 'http://localhost:3001';

// Test 1: Health Check
async function testHealth() {
  console.log('\n🏥 Testing Health Check...');
  try {
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
  } catch (error) {
    console.error('❌ Health Check failed:', error.message);
  }
}

// Test 2: Register User
async function testRegister() {
  console.log('\n📝 Testing User Registration...');
  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'matias@example.com',
        password: 'test123456',
        firstName: 'Matias',
        lastName: 'Developer',
      }),
    });
    const data = await response.json();
    console.log('✅ Registration successful:', data);
    return data.accessToken;
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
  }
}

// Test 3: Login
async function testLogin() {
  console.log('\n🔐 Testing Login...');
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'matias@example.com',
        password: 'test123456',
      }),
    });
    const data = await response.json();
    console.log('✅ Login successful:', data);
    return data.accessToken;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
  }
}

// Test 4: Get Profile (protected route)
async function testProfile(token) {
  console.log('\n👤 Testing Profile (Protected Route)...');
  try {
    const response = await fetch(`${baseUrl}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log('✅ Profile retrieved:', data);
  } catch (error) {
    console.error('❌ Profile retrieval failed:', error.message);
  }
}

// Test 5: Get all users (protected route)
async function testGetUsers(token) {
  console.log('\n👥 Testing Get All Users (Protected Route)...');
  try {
    const response = await fetch(`${baseUrl}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log('✅ Users retrieved:', data);
  } catch (error) {
    console.error('❌ Get users failed:', error.message);
  }
}

// Test 6: Metrics
async function testMetrics() {
  console.log('\n📊 Testing Metrics...');
  try {
    const response = await fetch(`${baseUrl}/metrics`);
    const data = await response.text();
    console.log('✅ Metrics available (showing first 200 chars):', data.substring(0, 200) + '...');
  } catch (error) {
    console.error('❌ Metrics retrieval failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Auth Service Tests...\n');
  console.log('='.repeat(50));

  await testHealth();
  const registerToken = await testRegister();
  
  if (registerToken) {
    await testProfile(registerToken);
    await testGetUsers(registerToken);
  }
  
  await testLogin();
  await testMetrics();

  console.log('\n' + '='.repeat(50));
  console.log('✨ Tests completed!\n');
}

runAllTests();