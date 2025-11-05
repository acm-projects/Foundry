#!/bin/bash

# Test Backend Connectivity

echo "=================================="
echo "Testing Backend Server"
echo "=================================="

# Check if local backend is running
echo ""
echo "1. Testing LOCAL backend (http://127.0.0.1:8000)..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://127.0.0.1:8000/ 2>/dev/null || echo "❌ Local backend not responding"

# Check if deployed backend is running
echo ""
echo "2. Testing DEPLOYED backend (http://54.173.156.44)..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://54.173.156.44/ 2>/dev/null || echo "❌ Deployed backend not responding"

# Test deploy endpoint with sample data
echo ""
echo "3. Testing /canvas/deploy endpoint..."
curl -X POST http://54.173.156.44/canvas/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [
      {
        "id": "EC2:test123",
        "type": "EC2",
        "position": {"x": 0, "y": 0},
        "data": {
          "label": "EC2",
          "name": "test-server",
          "imageID": "Ubuntu",
          "instanceType": "t3.micro"
        }
      }
    ],
    "edges": [],
    "viewport": {"x": 0, "y": 0, "zoom": 1}
  }'

echo ""
echo ""
echo "=================================="
echo "Test Complete"
echo "=================================="
