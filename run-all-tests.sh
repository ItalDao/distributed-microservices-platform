#!/bin/bash

echo "================================================"
echo "    TESTING SUITE - DISTRIBUTED MICROSERVICES"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo -e "${YELLOW}🧪 Running Frontend Tests...${NC}"
cd frontend
npm test -- --run --reporter=json > frontend-test-results.json 2>&1
FRONTEND_EXIT=$?

if [ $FRONTEND_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend tests PASSED${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}❌ Frontend tests FAILED${NC}"
    ((FAILED_TESTS++))
fi

echo ""
echo -e "${YELLOW}🧪 Running Auth Service Tests...${NC}"
cd ../services/auth-service
npm test -- --run --coverage > auth-test-results.txt 2>&1
AUTH_EXIT=$?

if [ $AUTH_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Auth Service tests PASSED${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}❌ Auth Service tests FAILED${NC}"
    ((FAILED_TESTS++))
fi

echo ""
echo -e "${YELLOW}🧪 Running Payments Service Tests...${NC}"
cd ../payments-service
npm test -- --run > payments-test-results.txt 2>&1
PAYMENTS_EXIT=$?

if [ $PAYMENTS_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Payments Service tests PASSED${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}❌ Payments Service tests FAILED${NC}"
    ((FAILED_TESTS++))
fi

echo ""
echo -e "${YELLOW}🧪 Running Notifications Service Tests...${NC}"
cd ../notifications-service
npm test -- --run > notifications-test-results.txt 2>&1
NOTIFICATIONS_EXIT=$?

if [ $NOTIFICATIONS_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Notifications Service tests PASSED${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}❌ Notifications Service tests FAILED${NC}"
    ((FAILED_TESTS++))
fi

echo ""
echo "================================================"
echo "                   TEST SUMMARY"
echo "================================================"
echo -e "Total Test Suites: 4"
echo -e "Passed: ${GREEN}${PASSED_TESTS}${NC}"
echo -e "Failed: ${RED}${FAILED_TESTS}${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}⚠️ SOME TESTS FAILED${NC}"
    echo ""
    echo "Test Results:"
    echo "- Frontend: frontend-test-results.json"
    echo "- Auth Service: services/auth-service/auth-test-results.txt"
    echo "- Payments Service: services/payments-service/payments-test-results.txt"
    echo "- Notifications: services/notifications-service/notifications-test-results.txt"
    exit 1
fi
