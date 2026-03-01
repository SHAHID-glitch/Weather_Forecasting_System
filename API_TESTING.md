# API Testing Examples

This document provides comprehensive examples for testing the Weather Forecasting API.

## Prerequisites

- API server running on `http://localhost:3000`
- Valid API key configured in `.env` file

## Testing Tools

### 1. Using cURL

#### Get Current Weather by City
```bash
curl "http://localhost:3000/api/v1/weather/current?city=London"
```

#### Get Current Weather with Country Code
```bash
curl "http://localhost:3000/api/v1/weather/current?city=London&country=GB"
```

#### Get Weather by Coordinates
```bash
curl "http://localhost:3000/api/v1/weather/coordinates?lat=51.5074&lon=-0.1278"
```

#### Get Multiple Cities Weather
```bash
curl -X POST http://localhost:3000/api/v1/weather/multiple \
  -H "Content-Type: application/json" \
  -d '{
    "cities": ["London", "Paris", "New York", "Tokyo", "Sydney"]
  }'
```

#### Get 7-Day Forecast
```bash
curl "http://localhost:3000/api/v1/forecast/city?city=Paris&days=7"
```

#### Get Hourly Forecast
```bash
curl "http://localhost:3000/api/v1/forecast/hourly?city=Tokyo"
```

#### Health Check
```bash
curl "http://localhost:3000/health"
```

---

### 2. Using PowerShell (Windows)

#### Get Current Weather
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/weather/current?city=London" -Method Get
```

#### Get Multiple Cities Weather
```powershell
$body = @{
    cities = @("London", "Paris", "Tokyo")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/weather/multiple" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

#### Get Forecast
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/forecast/city?city=Berlin&days=5" -Method Get
```

---

### 3. Using Python

```python
import requests

BASE_URL = "http://localhost:3000/api/v1"

# Get current weather
response = requests.get(f"{BASE_URL}/weather/current", params={
    "city": "London",
    "country": "GB"
})
print(response.json())

# Get multiple cities
response = requests.post(f"{BASE_URL}/weather/multiple", json={
    "cities": ["London", "Paris", "Tokyo"]
})
print(response.json())

# Get forecast
response = requests.get(f"{BASE_URL}/forecast/city", params={
    "city": "Paris",
    "days": 7
})
print(response.json())
```

---

### 4. Using JavaScript (Node.js)

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// Get current weather
async function getCurrentWeather() {
  const response = await axios.get(`${BASE_URL}/weather/current`, {
    params: { city: 'London', country: 'GB' }
  });
  console.log(response.data);
}

// Get multiple cities
async function getMultipleCities() {
  const response = await axios.post(`${BASE_URL}/weather/multiple`, {
    cities: ['London', 'Paris', 'Tokyo']
  });
  console.log(response.data);
}

// Get forecast
async function getForecast() {
  const response = await axios.get(`${BASE_URL}/forecast/city`, {
    params: { city: 'Paris', days: 7 }
  });
  console.log(response.data);
}

getCurrentWeather();
getMultipleCities();
getForecast();
```

---

### 5. Using JavaScript (Browser/Fetch)

```javascript
const BASE_URL = 'http://localhost:3000/api/v1';

// Get current weather
fetch(`${BASE_URL}/weather/current?city=London`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Get multiple cities
fetch(`${BASE_URL}/weather/multiple`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    cities: ['London', 'Paris', 'Tokyo']
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## Common Test Cases

### Valid Requests

```bash
# Major world cities
curl "http://localhost:3000/api/v1/weather/current?city=London"
curl "http://localhost:3000/api/v1/weather/current?city=Paris"
curl "http://localhost:3000/api/v1/weather/current?city=New%20York"
curl "http://localhost:3000/api/v1/weather/current?city=Tokyo"

# With country codes
curl "http://localhost:3000/api/v1/weather/current?city=London&country=GB"
curl "http://localhost:3000/api/v1/weather/current?city=Paris&country=FR"

# Coordinates
curl "http://localhost:3000/api/v1/weather/coordinates?lat=40.7128&lon=-74.0060"
```

### Error Cases

```bash
# Missing required parameter
curl "http://localhost:3000/api/v1/weather/current"

# Invalid city name
curl "http://localhost:3000/api/v1/weather/current?city=InvalidCityName123456"

# Invalid coordinates
curl "http://localhost:3000/api/v1/weather/coordinates?lat=200&lon=300"

# Invalid country code
curl "http://localhost:3000/api/v1/weather/current?city=London&country=INVALID"
```

---

## Response Examples

### Successful Response
```json
{
  "success": true,
  "data": {
    "location": {
      "name": "London",
      "country": "GB",
      "coordinates": {
        "lat": 51.5074,
        "lon": -0.1278
      }
    },
    "current": {
      "temperature": {
        "current": 15.5,
        "feels_like": 14.2,
        "unit": "°C"
      },
      "weather": {
        "main": "Clouds",
        "description": "scattered clouds"
      }
    }
  },
  "cached": false
}
```

### Error Response
```json
{
  "success": false,
  "error": "City name is required"
}
```

---

## Performance Testing

### Test Cache Behavior
```bash
# First request (not cached)
time curl "http://localhost:3000/api/v1/weather/current?city=London"

# Second request (cached - should be faster)
time curl "http://localhost:3000/api/v1/weather/current?city=London"
```

### Test Rate Limiting
```bash
# Send multiple requests rapidly
for i in {1..105}; do
  curl "http://localhost:3000/api/v1/weather/current?city=London"
  echo "Request $i"
done
```

---

## Tips

1. **Pretty Print JSON**: Use `jq` for formatted output
   ```bash
   curl "http://localhost:3000/api/v1/weather/current?city=London" | jq
   ```

2. **Save Response**: Save to file for inspection
   ```bash
   curl "http://localhost:3000/api/v1/weather/current?city=London" > response.json
   ```

3. **Include Headers**: See full response with headers
   ```bash
   curl -i "http://localhost:3000/api/v1/weather/current?city=London"
   ```

4. **Verbose Mode**: Debug connection issues
   ```bash
   curl -v "http://localhost:3000/api/v1/weather/current?city=London"
   ```
