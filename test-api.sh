#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlmNWIxMmZlOTY3MjNjNDE1NzZlNjMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTUyNzQzNzgsImV4cCI6MTc1NTg3OTE3OH0.CHq2XFlUF7lFYWc8c4QyAf9SUfauio8ZE00O70mr1FQ"
BASE_URL="http://localhost:3000/api"

echo "🧪 Testing StoreTrack APIs..."
echo ""

# Test 1: Get Items
echo "1️⃣ GET /items"
curl --noproxy localhost -X GET "$BASE_URL/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -s | head -100
echo ""

# Test 2: Create Item
echo "2️⃣ POST /items"
ITEM_DATA='{"name":"TestItem'$(date +%s)'","category":"Electronics","price":299.99,"stockQuantity":25}'
ITEM_RESPONSE=$(curl --noproxy localhost -X POST "$BASE_URL/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$ITEM_DATA" \
  -s)
echo "$ITEM_RESPONSE" | head -100

# Extract item ID
ITEM_ID=$(echo "$ITEM_RESPONSE" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4 | head -1)
echo "Created item ID: $ITEM_ID"
echo ""

# Test 3: Get single item
if [ ! -z "$ITEM_ID" ]; then
  echo "3️⃣ GET /items/$ITEM_ID"
  curl --noproxy localhost -X GET "$BASE_URL/items/$ITEM_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -s | head -100
  echo ""
fi

# Test 4: Create Order
echo "4️⃣ POST /orders"
ORDER_DATA='{"items":[{"item":"'$ITEM_ID'","quantity":2}],"customerName":"Test Customer"}'
ORDER_RESPONSE=$(curl --noproxy localhost -X POST "$BASE_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$ORDER_DATA" \
  -s)
echo "$ORDER_RESPONSE" | head -100
echo ""

# Test 5: Get Orders
echo "5️⃣ GET /orders"
curl --noproxy localhost -X GET "$BASE_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -s | head -100
echo ""

# Test 6: Stock History
echo "6️⃣ GET /stock-history"
curl --noproxy localhost -X GET "$BASE_URL/stock-history" \
  -H "Authorization: Bearer $TOKEN" \
  -s | head -100
echo ""

# Test 7: Low Stock Report
echo "7️⃣ GET /reports/low-stock"
curl --noproxy localhost -X GET "$BASE_URL/reports/low-stock" \
  -H "Authorization: Bearer $TOKEN" \
  -s | head -100
echo ""

# Test 8: Sales Report
echo "8️⃣ GET /reports/sales"
curl --noproxy localhost -X GET "$BASE_URL/reports/sales" \
  -H "Authorization: Bearer $TOKEN" \
  -s | head -100
echo ""

echo "✅ API testing complete!"