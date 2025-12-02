// Script para probar el Payments Service
const baseUrl = 'http://localhost:3002';

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

// Test 2: Create Payment
async function testCreatePayment() {
  console.log('\n💳 Testing Create Payment...');
  try {
    const response = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '0a8712f5-9337-4411-92f8-d531635a4059',
        amount: 99.99,
        currency: 'USD',
        paymentMethod: 'credit_card',
        description: 'Test payment for premium subscription',
        metadata: {
          plan: 'premium',
          period: 'monthly',
        },
      }),
    });
    const data = await response.json();
    console.log('✅ Payment created:', data);
    return data._id;
  } catch (error) {
    console.error('❌ Create payment failed:', error.message);
  }
}

// Test 3: Get All Payments
async function testGetAllPayments() {
  console.log('\n📋 Testing Get All Payments...');
  try {
    const response = await fetch(`${baseUrl}/payments`);
    const data = await response.json();
    console.log(`✅ Found ${data.length} payment(s):`, data);
  } catch (error) {
    console.error('❌ Get payments failed:', error.message);
  }
}

// Test 4: Get Payment by ID
async function testGetPaymentById(paymentId) {
  console.log('\n🔍 Testing Get Payment by ID...');
  try {
    const response = await fetch(`${baseUrl}/payments/${paymentId}`);
    const data = await response.json();
    console.log('✅ Payment retrieved:', data);
  } catch (error) {
    console.error('❌ Get payment by ID failed:', error.message);
  }
}

// Test 5: Get Payments by User ID
async function testGetPaymentsByUserId(userId) {
  console.log('\n👤 Testing Get Payments by User ID...');
  try {
    const response = await fetch(`${baseUrl}/payments?userId=${userId}`);
    const data = await response.json();
    console.log(`✅ Found ${data.length} payment(s) for user:`, data);
  } catch (error) {
    console.error('❌ Get payments by user failed:', error.message);
  }
}

// Test 6: Process Payment
async function testProcessPayment(paymentId) {
  console.log('\n⚡ Testing Process Payment (simulates approval/rejection)...');
  try {
    const response = await fetch(`${baseUrl}/payments/${paymentId}/process`, {
      method: 'POST',
    });
    const data = await response.json();
    console.log('✅ Payment processed:', data);
    console.log(`   Status: ${data.status === 'completed' ? '✅ APPROVED' : '❌ REJECTED'}`);
  } catch (error) {
    console.error('❌ Process payment failed:', error.message);
  }
}

// Test 7: Update Payment Status
async function testUpdatePayment(paymentId) {
  console.log('\n🔄 Testing Update Payment Status...');
  try {
    const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'refunded',
      }),
    });
    const data = await response.json();
    console.log('✅ Payment updated:', data);
  } catch (error) {
    console.error('❌ Update payment failed:', error.message);
  }
}

// Test 8: Create Multiple Payments
async function testCreateMultiplePayments() {
  console.log('\n💰 Testing Create Multiple Payments...');
  const payments = [
    {
      userId: '0a8712f5-9337-4411-92f8-d531635a4059',
      amount: 49.99,
      currency: 'USD',
      paymentMethod: 'paypal',
      description: 'Basic plan subscription',
    },
    {
      userId: 'f011c202-aeef-4fea-9a43-b4dcb0af1b69',
      amount: 149.99,
      currency: 'USD',
      paymentMethod: 'credit_card',
      description: 'Enterprise plan subscription',
    },
  ];

  for (const payment of payments) {
    try {
      const response = await fetch(`${baseUrl}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment),
      });
      const data = await response.json();
      console.log(`✅ Created payment for $${payment.amount}:`, data.transactionId);
    } catch (error) {
      console.error('❌ Failed to create payment:', error.message);
    }
  }
}

// Test 9: Metrics
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
  console.log('🚀 Starting Payments Service Tests...\n');
  console.log('='.repeat(50));

  await testHealth();
  
  const paymentId = await testCreatePayment();
  
  if (paymentId) {
    await testGetPaymentById(paymentId);
    await testProcessPayment(paymentId);
    await testUpdatePayment(paymentId);
  }
  
  await testCreateMultiplePayments();
  await testGetAllPayments();
  await testGetPaymentsByUserId('0a8712f5-9337-4411-92f8-d531635a4059');
  await testMetrics();

  console.log('\n' + '='.repeat(50));
  console.log('✨ Tests completed!\n');
}

runAllTests();