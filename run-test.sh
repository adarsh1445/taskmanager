#!/bin/bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' 

cleanup() {
    echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
    docker-compose -f docker-compose.test.yml down
}

trap cleanup EXIT

echo -e "${YELLOW}Building and starting containers...${NC}"
docker-compose -f docker-compose.test.yml up -d

echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
while ! curl --fail http://localhost:8000/ >/dev/null 2>&1; do
    sleep 2
done
sleep 10

echo -e "${YELLOW}Running backend tests...${NC}"
TEST_RESULT=0 
docker-compose -f docker-compose.test.yml exec backend \
    pytest -v --cov=app --cov-report=term-missing tests/ || TEST_RESULT=$?

if [ $TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}All backend tests passed successfully!${NC}"
else
    echo -e "${RED}Some backend tests failed. See output above for details.${NC}"
fi

echo -e "${YELLOW}Waiting for frontend to be ready...${NC}"
while ! curl --fail http://localhost:5173/ >/dev/null 2>&1; do
    sleep 2
done

echo -e "${YELLOW}Running frontend tests...${NC}"
docker-compose -f docker-compose.test.yml exec frontend \
    npm run test -- --watchAll=false || TEST_RESULT=$?

if [ $TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}Frontend tests passed successfully!${NC}"
else
    echo -e "${RED}Some frontend tests failed. See output above for details.${NC}"
fi

exit $TEST_RESULT