const axios = require('axios');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlmNWIxMmZlOTY3MjNjNDE1NzZlNjMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTUyNzQzNzgsImV4cCI6MTc1NTg3OTE3OH0.CHq2XFlUF7lFYWc8c4QyAf9SUfauio8ZE00O70mr1FQ';
const BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testAPIs() {
  console.log('🧪 Testing StoreTrack APIs...\n');
  
  try {
    // Test 1: Get Items
    console.log('1️⃣ GET /items');
    const itemsRes = await api.get('/items');
    console.log(`✅ Found ${itemsRes.data.length} items`);
    
    // Test 2: Create Item
    console.log('\n2️⃣ POST /items');
    const newItem = {
      name: 'Test Product ' + Date.now(),
      category: 'Test Category',
      price: 99.99,
      stockQuantity: 50
    };
    const createRes = await api.post('/items', newItem);
    console.log(`✅ Created item: ${createRes.data.item.name}`);
    const itemId = createRes.data.item._id;
    
    // Test 3: Get Single Item
    console.log('\n3️⃣ GET /items/:id');
    const singleItemRes = await api.get(`/items/${itemId}`);
    console.log(`✅ Retrieved item: ${singleItemRes.data.name}`);
    
    // Test 4: Update Item
    console.log('\n4️⃣ PUT /items/:id');
    const updateRes = await api.put(`/items/${itemId}`, { stockQuantity: 100 });
    console.log(`✅ Updated stock to: ${updateRes.data.stockQuantity}`);
    
    // Test 5: Create Order
    console.log('\n5️⃣ POST /orders');
    const orderData = {
      items: [{ itemId: itemId, quantity: 5 }],
      customerName: 'Test Customer'
    };
    const orderRes = await api.post('/orders', orderData);
    console.log(`✅ Created order #${orderRes.data.orderId}`);
    const orderId = orderRes.data._id;
    
    // Test 6: Get Orders
    console.log('\n6️⃣ GET /orders');
    const ordersRes = await api.get('/orders');
    console.log(`✅ Found ${ordersRes.data.length} orders`);
    
    // Test 7: Update Order Status
    console.log('\n7️⃣ PUT /orders/:id/status');
    const statusRes = await api.put(`/orders/${orderId}/status`, { status: 'completed' });
    console.log(`✅ Updated order status to: ${statusRes.data.status}`);
    
    // Test 8: Get Stock History
    console.log('\n8️⃣ GET /stock-history');
    const historyRes = await api.get('/stock-history');
    console.log(`✅ Found ${historyRes.data.length} stock history records`);
    
    // Test 9: Low Stock Report
    console.log('\n9️⃣ GET /reports/low-stock');
    const lowStockRes = await api.get('/reports/low-stock');
    console.log(`✅ Found ${lowStockRes.data.length} low stock items`);
    
    // Test 10: Sales Report
    console.log('\n🔟 GET /reports/sales');
    const salesRes = await api.get('/reports/sales');
    console.log(`✅ Sales report: Total revenue $${salesRes.data.totalRevenue || 0}`);
    
    console.log('\n✨ All tests passed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('URL:', error.config.url);
    }
  }
}

testAPIs();