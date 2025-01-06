#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Create payment
echo -e "${BLUE}Creating payment order...${NC}"
PAYMENT_RESPONSE=$(curl -X POST http://localhost:3001/api/payments/create \
-H "Content-Type: application/json" \
-d '{
  "email":"test@test.com",
  "cryptocurrency":"USDT",
  "amount":"10.5",
  "bookId":"1"
}')

# Extract details
ORDER_ID=$(echo $PAYMENT_RESPONSE | jq -r '.orderId')
AMOUNT=$(echo $PAYMENT_RESPONSE | jq -r '.amount')
ADDRESS=$(echo $PAYMENT_RESPONSE | jq -r '.paymentAddress')

# Display details
echo -e "\n${GREEN}Payment Details:${NC}"
echo "Order ID: $ORDER_ID"
echo "Amount: $AMOUNT USDT"
echo "Address: $ADDRESS"
echo "Network: TRC20 (TRON)"
echo "Network Fee: $(echo $PAYMENT_RESPONSE | jq -r '.networkFee')"
echo "Expected Wait Time: $(echo $PAYMENT_RESPONSE | jq -r '.waitTime')"

# Generate QR code data
AMOUNT_SUN=$(echo "$AMOUNT * 1000000" | bc | cut -d'.' -f1)
TRON_URI="tron://transfer?toAddress=${ADDRESS}&amount=${AMOUNT_SUN}&tokenId=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
echo -e "\n${GREEN}TRC20 USDT Payment QR Code:${NC}"
echo $TRON_URI

# Monitor status
echo -e "\n${BLUE}Monitoring payment status...${NC}"
ATTEMPTS=0
MAX_ATTEMPTS=60

check_status() {
    local response=$(curl -s http://localhost:3001/api/payments/status/$1)
    echo $response
}

while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
    STATUS_RESPONSE=$(check_status $ORDER_ID)
    STATUS=$(echo $STATUS_RESPONSE | jq -r '.status // "pending"')
    VERIFIED=$(echo $STATUS_RESPONSE | jq -r '.verified // false')
    
    if [ "$STATUS" = "completed" ] || [ "$VERIFIED" = "true" ]; then
        echo -e "\n${GREEN}Payment confirmed!${NC}"
        echo $STATUS_RESPONSE | jq '.'
        break
    elif [ "$STATUS" = "pending" ]; then
        echo -n "."
        ATTEMPTS=$((ATTEMPTS + 1))
        sleep 5
    else
        echo -e "\n${RED}Enter transaction hash when payment is sent${NC}"
        read -p "Transaction hash (or 'q' to quit): " TX_HASH
        if [ "$TX_HASH" = "q" ]; then
            break
        elif [ ! -z "$TX_HASH" ]; then
            echo -e "\n${BLUE}Verifying transaction...${NC}"
            VERIFY_RESPONSE=$(curl -s "http://localhost:3001/api/payments/verify/$ORDER_ID/$TX_HASH")
            echo $VERIFY_RESPONSE | jq '.'
            [ "$(echo $VERIFY_RESPONSE | jq -r '.success')" = "true" ] && break
        fi
    fi
done

[ $ATTEMPTS -eq $MAX_ATTEMPTS ] && echo -e "\n${RED}Timeout reached. Check status manually.${NC}"