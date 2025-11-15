# 🚀 API Testing Guide - Haryana Roadways

Comprehensive guide for testing the Haryana Roadways backend API using `curl` commands.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Base URL](#base-url)
- [API Endpoints](#api-endpoints)
  - [Health Check](#1-health-check)
  - [Smart Route Search](#2-smart-route-search)
  - [Record Route Selection](#3-record-route-selection)
- [Request/Response Details](#requestresponse-details)
- [Common Errors](#common-errors)
- [Advanced Usage](#advanced-usage)

---

## Prerequisites

1. **Backend server must be running**:
   ```bash
   npm run server
   ```

2. **Required tools**:
   - `curl` (pre-installed on most Linux/Mac systems)
   - `jq` (optional, for pretty JSON formatting)
   - Access to port `50001` (or port specified in `.env`)

3. **Environment setup**:
   - Ensure `.env` file exists with proper configuration
   - Default port: `50001`
   - Google Maps API key (optional, for distance/duration data)

---

## Base URL

**Local Development:**
```
http://localhost:50001
```

**Production:**
```
https://your-domain.com
```

All API endpoints are prefixed with `/api/`

---

## API Endpoints

### 1. Health Check

**Purpose:** Verify the backend server is running and responsive.

**Endpoint:**
```
GET /api/health
```

**Example Request:**
```bash
curl http://localhost:50001/api/health
```

**Example Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-23T17:30:45.123Z"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Server health status (`OK` or error message) |
| `timestamp` | string | ISO 8601 timestamp of the response |

**Use Cases:**
- Verify server is running before running tests
- Health monitoring in CI/CD pipelines
- Load balancer health checks

---

### 2. Smart Route Search

**Purpose:** Find AI-powered bus routes between two locations with smart ranking and optional travel time/distance data.

**Endpoint:**
```
POST /api/smartRoute
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "source": "string",      // Required: Starting location
  "destination": "string", // Required: Destination location
  "userId": "string"       // Optional: User ID for personalized recommendations (defaults to 'default')
}
```

#### Example 1: Basic Route Search

**Request:**
```bash
curl -X POST http://localhost:50001/api/smartRoute \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Chandigarh",
    "destination": "Delhi"
  }'
```

**Example Response:**
```json
{
  "routes": [
    {
      "busName": "Chandigarh to Delhi Express",
      "travelTime": "4 hours 30 mins",
      "distance": "245 km",
      "type": "Express",
      "eta": 45,
      "stops": ["Sector 17", "Sector 22", "Zirakpur", "Ambala", "Karnal", "Delhi"]
    },
    {
      "busName": "EcoRoute Chandigarh Express",
      "travelTime": "4 hours 50 mins",
      "distance": "245 km",
      "type": "Eco-Friendly",
      "eta": 50,
      "stops": ["Sector 17", "Zirakpur", "Ambala Bypass", "Delhi Border", "Delhi"]
    }
  ],
  "totalRoutesFound": 3,
  "aiPowered": true
}
```

#### Example 2: Route Search with User ID

**Request:**
```bash
curl -X POST http://localhost:50001/api/smartRoute \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Hisar",
    "destination": "Chandigarh",
    "userId": "user123"
  }'
```

**Example Response:**
```json
{
  "routes": [
    {
      "busName": "Hisar to Rohtak Direct",
      "travelTime": "N/A",
      "distance": "N/A",
      "type": "Standard",
      "eta": 60,
      "stops": ["Hisar Bus Stand", "Beri", "Tohana", "Jind", "Rohtak"]
    }
  ],
  "totalRoutesFound": 1,
  "aiPowered": true
}
```

#### Example 3: No Routes Found

**Request:**
```bash
curl -X POST http://localhost:50001/api/smartRoute \
  -H "Content-Type: application/json" \
  -d '{
    "source": "UnknownCity",
    "destination": "AnotherUnknownCity"
  }'
```

**Example Response:**
```json
{
  "routes": [],
  "totalRoutesFound": 0,
  "aiPowered": true
}
```

### 3. Record Route Selection

**Purpose:** Record a user's route selection for AI learning and personalization.

**Endpoint:**
```
POST /api/smartRoute/select-route
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "string",      // Optional: User ID (defaults to 'default')
  "routeName": "string",   // Required: Name of the selected route
  "source": "string",      // Required: Starting location
  "destination": "string"  // Required: Destination location
}
```

#### Example: Record Route Selection

**Request:**
```bash
curl -X POST http://localhost:50001/api/smartRoute/select-route \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "routeName": "Chandigarh to Delhi Express",
    "source": "Chandigarh",
    "destination": "Delhi"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Route selection recorded for personalization"
}
```

---

## Request/Response Details

### Smart Route Response Schema

**Route Object Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `busName` | string | Yes | Display name of the bus service |
| `travelTime` | string | No | Estimated travel time (from Google Maps API) |
| `distance` | string | No | Total distance (from Google Maps API) |
| `type` | string | Yes | Route type (Express, Eco-Friendly, Local, Standard) |
| `eta` | number | Yes | Estimated time of arrival in minutes |
| `stops` | array[string] | Yes | List of intermediate stops |

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `routes` | array | Array of route objects (max 5, AI-ranked) |
| `totalRoutesFound` | number | Total number of routes found before AI ranking |
| `aiPowered` | boolean | Whether AI ranking was applied |

### Route Selection Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the route selection was recorded |
| `message` | string | Success or error message |

### Google Maps Integration

If `GOOGLE_MAPS_API_KEY` is configured in `.env`, the API automatically fetches:
- **Distance**: Actual road distance between source and destination
- **Duration**: Estimated travel time based on traffic conditions

**Without Google Maps API:**

### Google Maps Integration

If `GOOGLE_MAPS_API_KEY` is configured in `.env`, the API automatically fetches:
- **Distance**: Actual road distance between source and destination
- **Duration**: Estimated travel time based on traffic conditions

**Without Google Maps API:**
- Routes are returned from local database
- `distance` and `duration` fields may be empty or estimated

**With Google Maps API:**
- Real-time distance and duration data
- More accurate travel estimates
- Traffic-aware routing

---

## Common Errors

### 1. Connection Refused
```bash
curl: (7) Failed to connect to localhost port 50001: Connection refused
```

**Solution:**
- Ensure backend server is running: `npm run server`
- Check if port `50001` is in use: `lsof -i :50001`
- Verify `.env` file has correct `PORT` value

### 2. Invalid JSON
```json
{
  "error": "Invalid JSON payload"
}
```

**Solution:**
- Check JSON syntax (missing quotes, commas, brackets)
- Ensure `Content-Type: application/json` header is set
- Validate JSON with online validators

### 3. Missing Required Fields
```json
{
  "error": "Missing required field: source"
}
```

**Solution:**
- Ensure both `source` and `destination` are provided
- Check field names are spelled correctly (case-sensitive)

### 4. Server Error (500)
```json
{
  "message": "Something went wrong!"
}
```

**Solution:**
- Check server logs for detailed error
- Verify database file exists: `./Databases/State_Database/Haryana.json`
- Ensure database JSON is valid

---

## Advanced Usage

### Pretty Print with `jq`

Install `jq` for formatted JSON output:

```bash
# Install jq
sudo apt install jq  # Ubuntu/Debian
brew install jq      # macOS

# Use with curl
curl -s http://localhost:50001/api/health | jq

curl -s -X POST http://localhost:50001/api/smartRoute \
  -H "Content-Type: application/json" \
  -d '{"source": "Chandigarh", "destination": "Delhi"}' | jq
```

### Save Response to File

```bash
curl -X POST http://localhost:50001/api/smartRoute \
  -H "Content-Type: application/json" \
  -d '{"source": "Chandigarh", "destination": "Delhi"}' \
  -o response.json

# View saved response
cat response.json | jq
```

### Verbose Output (Debug Mode)

```bash
curl -v -X POST http://localhost:50001/api/smartRoute \
  -H "Content-Type: application/json" \
  -d '{"source": "Chandigarh", "destination": "Delhi"}'
```

Shows:
- Request headers
- Response headers
- Connection details
- SSL/TLS handshake info

### Measure Response Time

```bash
curl -w "\nTime: %{time_total}s\n" \
  -X POST http://localhost:50001/api/smartRoute \
  -H "Content-Type: application/json" \
  -d '{"source": "Chandigarh", "destination": "Delhi"}'
```

### Batch Testing Multiple Routes

Create a test script:

```bash
#!/bin/bash
# test_routes.sh

routes=(
  "Chandigarh:Delhi"
  "Hisar:Chandigarh"
  "Rohtak:Gurgaon"
  "Ambala:Karnal"
)

for route in "${routes[@]}"; do
  IFS=':' read -r source destination <<< "$route"
  echo "Testing: $source → $destination"
  
  curl -s -X POST http://localhost:50001/api/smartRoute \
    -H "Content-Type: application/json" \
    -d "{\"source\": \"$source\", \"destination\": \"$destination\"}" | jq -r '.totalRoutes'
  
  echo "---"
done
```

Run:
```bash
chmod +x test_routes.sh
./test_routes.sh
```

### Authentication (If Implemented)

If API key authentication is added:

```bash
curl -X POST http://localhost:50001/api/smartRoute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{"source": "Chandigarh", "destination": "Delhi"}'
```

---

## Environment Variables

Key environment variables affecting API behavior:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port (override with `.env`) |
| `NODE_ENV` | development | Environment mode (`development` or `production`) |
| `GOOGLE_MAPS_API_KEY` | - | Google Maps API key for distance/duration |
| `DB_PATH` | `./Databases/State_Database/Haryana.json` | Path to bus database |

---

## Testing Checklist

Before submitting a PR or deploying, test:

- [ ] Health check returns `200 OK`
- [ ] Smart route with valid cities returns routes
- [ ] Smart route with invalid cities returns empty array
- [ ] Missing `source` field returns error
- [ ] Missing `destination` field returns error
- [ ] Invalid JSON payload returns error
- [ ] Server handles concurrent requests
- [ ] Response time is under 2 seconds for typical queries

---

## Additional Resources

- **Backend Code**: `backend/mainServer.js`
- **Route Logic**: `backend/routes/smartRoute.js`
- **Database**: `Databases/State_Database/Haryana.json`
- **README**: Main project documentation
- **ROUTES_GUIDE.md**: Detailed routing documentation

---

## Contributing

Found a bug or want to add more examples? 
- Open an issue: [GitHub Issues](https://github.com/paras-lehana/haryana-roadways/issues)
- Submit a PR with your improvements
- Update this documentation when adding new endpoints

---

**Last Updated:** October 23, 2025  
**API Version:** 1.0  
**Maintainer:** Haryana Roadways Development Team
