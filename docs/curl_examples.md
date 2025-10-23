# 🚀 API Testing Guide - Haryana Roadways

Comprehensive guide for testing the Haryana Roadways backend API using `curl` commands.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Base URL](#base-url)
- [API Endpoints](#api-endpoints)
  - [Health Check](#1-health-check)
  - [Smart Route Search](#2-smart-route-search)
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

**Purpose:** Find bus routes between two locations with optional travel time and distance data.

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
  "destination": "string"  // Required: Destination location
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
      "busNumber": "HR-51C-0123",
      "busName": "Chandigarh Express",
      "from": "Chandigarh",
      "to": "Delhi",
      "via": ["Ambala", "Karnal", "Panipat"],
      "departureTime": "06:00 AM",
      "arrivalTime": "10:30 AM",
      "frequency": "Daily",
      "fare": "₹250",
      "busType": "AC Deluxe",
      "distance": "245 km",
      "duration": "4 hours 30 mins"
    },
    {
      "busNumber": "HR-51D-0456",
      "busName": "Morning Express",
      "from": "Chandigarh",
      "to": "Delhi",
      "via": ["Ambala", "Panipat"],
      "departureTime": "08:00 AM",
      "arrivalTime": "12:00 PM",
      "frequency": "Daily",
      "fare": "₹200",
      "busType": "Non-AC",
      "distance": "245 km",
      "duration": "4 hours"
    }
  ],
  "totalRoutes": 2
}
```

#### Example 2: Route with Multiple Via Points

**Request:**
```bash
curl -X POST http://localhost:50001/api/smartRoute \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Hisar",
    "destination": "Chandigarh"
  }'
```

**Example Response:**
```json
{
  "routes": [
    {
      "busNumber": "HR-34A-0789",
      "busName": "Hisar-Chandigarh Express",
      "from": "Hisar",
      "to": "Chandigarh",
      "via": ["Jind", "Kurukshetra", "Ambala", "Panchkula"],
      "departureTime": "05:30 AM",
      "arrivalTime": "10:00 AM",
      "frequency": "Daily",
      "fare": "₹180",
      "busType": "AC",
      "distance": "195 km",
      "duration": "4 hours 30 mins"
    }
  ],
  "totalRoutes": 1
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
  "totalRoutes": 0,
  "message": "No routes found between UnknownCity and AnotherUnknownCity"
}
```

---

## Request/Response Details

### Smart Route Response Schema

**Route Object Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `busNumber` | string | Yes | Unique bus identification number |
| `busName` | string | Yes | Display name of the bus service |
| `from` | string | Yes | Starting location |
| `to` | string | Yes | Final destination |
| `via` | array[string] | No | Intermediate stops (if any) |
| `departureTime` | string | Yes | Departure time (format: `HH:MM AM/PM`) |
| `arrivalTime` | string | Yes | Arrival time (format: `HH:MM AM/PM`) |
| `frequency` | string | Yes | Service frequency (e.g., "Daily", "Mon-Fri") |
| `fare` | string | Yes | Ticket price in rupees |
| `busType` | string | Yes | Bus category (AC, Non-AC, Deluxe, etc.) |
| `distance` | string | No | Total distance (populated with Google Maps API) |
| `duration` | string | No | Estimated travel time (populated with Google Maps API) |

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
