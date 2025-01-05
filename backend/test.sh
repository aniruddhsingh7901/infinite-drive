#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Testing Payment Flow"

# Create a book
echo -e "\n${GREEN}1. Creating a book...${NC}"
BOOK_RESPONSE=$(curl -s -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Infinite Drive",
    "description": "Transform your life with powerful mindset techniques",
    "price": 49.99,
    "formats": ["PDF", "EPUB"],
    "coverImage": "cover-url",
    "fileKeys": {
      "PDF": "pdf-key",
      "EPUB": "epub-key"
    }
  }')
BOOK_ID=$(echo $BOOK_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Book ID: $BOOK_ID"

# Create an order
echo -e "\n${GREEN}2. Creating an order...${NC}"
ORDER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d "{
    \"bookId\": \"$BOOK_ID\",
    \"customerEmail\": \"test@example.com\",
    \"format\": \"PDF\",
    \"amount\": 49.99
  }")
ORDER_ID=$(echo $ORDER_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Order ID: $ORDER_ID"

# Create payment
echo -e "\n${GREEN}3. Creating payment...${NC}"
PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/payments/create \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": \"$ORDER_ID\"
  }")
echo "Payment Response: $PAYMENT_RESPONSE"

# Check payment status
echo -e "\n${GREEN}4. Checking payment status...${NC}"
STATUS_RESPONSE=$(curl -s http://localhost:5000/api/payments/status/$ORDER_ID)
echo "Status Response: $STATUS_RESPONSE"

# Simulate webhook
echo -e "\n${GREEN}5. Simulating webhook...${NC}"
WEBHOOK_RESPONSE=$(curl -s -X POST http://localhost:5000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -H "X-CC-Webhook-Signature: test_signature" \
  -d "{
    \"id\": \"test_event\",
    \"type\": \"charge:confirmed\",
    \"data\": {
      \"id\": \"test_charge\",
      \"metadata\": {
        \"orderId\": \"$ORDER_ID\",
        \"customerEmail\": \"test@example.com\"
      }
    }
  }")
echo "Webhook Response: $WEBHOOK_RESPONSE"

echo -e "\n${GREEN}Testing Complete!${NC}"