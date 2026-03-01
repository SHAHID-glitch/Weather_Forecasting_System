# Weather Forecasting System

A comprehensive weather forecasting solution with both REST API and modern web interface. Built with Node.js, Express, and vanilla JavaScript.

## 🌟 Features

### API Features
- ✅ Current weather data by city name or coordinates
- ✅ Multi-day weather forecasts (up to 16 days)
- ✅ Hourly weather predictions (48 hours)
- ✅ Multiple cities weather lookup
- ✅ Built-in caching for improved performance
- ✅ Rate limiting to prevent API abuse
- ✅ Input validation and error handling
- ✅ Comprehensive logging system
- ✅ CORS enabled for cross-origin requests
- ✅ Security headers with Helmet

### Frontend Features
- ✅ Modern, responsive web interface
- ✅ Real-time weather display with beautiful UI
- ✅ Search by city or use current location
- ✅ Multiple view modes (Current, Forecast, Hourly)
- ✅ Recent searches with localStorage
- ✅ Smooth animations and transitions
- ✅ Mobile-friendly design

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Caching**: Node-Cache
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Express Rate Limit

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available at [openweathermap.org](https://openweathermap.org/api))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Weather forcasting system"
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=3000
NODE_ENV=development
WEATHER_API_KEY=your_api_key_here
WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
CACHE_TTL=600
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
API_VERSION=v1
```

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

### Accessing the Application

- **Web Interface**: Open `http://localhost:3000` in your browser
- **API Endpoints**: `http://localhost:3000/api/v1/...`
- **API Info**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

#### 1. Health Check
Check if the API is running.

**GET** `/health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-03-01T12:00:00.000Z",
  "uptime": 123.456
}
```

---

#### 2. Get Current Weather by City

**GET** `/api/v1/weather/current`

**Query Parameters:**
- `city` (required): City name
- `country` (optional): ISO 3166 country code (e.g., "US", "GB")

**Example:**
```bash
curl "http://localhost:3000/api/v1/weather/current?city=London&country=GB"
```

**Response:**
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
      "timestamp": 1709294400,
      "datetime": "2026-03-01T12:00:00.000Z",
      "temperature": {
        "current": 15.5,
        "feels_like": 14.2,
        "min": 13.0,
        "max": 17.0,
        "unit": "°C"
      },
      "weather": {
        "main": "Clouds",
        "description": "scattered clouds",
        "icon": "03d"
      },
      "wind": {
        "speed": 5.5,
        "direction": 240,
        "unit": "m/s"
      }
    }
  },
  "cached": false
}
```

---

#### 3. Get Current Weather by Coordinates

**GET** `/api/v1/weather/coordinates`

**Query Parameters:**
- `lat` (required): Latitude (-90 to 90)
- `lon` (required): Longitude (-180 to 180)

**Example:**
```bash
curl "http://localhost:3000/api/v1/weather/coordinates?lat=51.5074&lon=-0.1278"
```

---

#### 4. Get Weather for Multiple Cities

**POST** `/api/v1/weather/multiple`

**Request Body:**
```json
{
  "cities": ["London", "Paris", "New York", "Tokyo"]
}
```

**Limits:**
- Maximum 10 cities per request

**Example:**
```bash
curl -X POST http://localhost:3000/api/v1/weather/multiple \
  -H "Content-Type: application/json" \
  -d '{"cities": ["London", "Paris", "Tokyo"]}'
```

---

#### 5. Get Weather Forecast by City

**GET** `/api/v1/forecast/city`

**Query Parameters:**
- `city` (required): City name
- `country` (optional): ISO 3166 country code
- `days` (optional): Number of forecast days (1-16, default: 5)

**Example:**
```bash
curl "http://localhost:3000/api/v1/forecast/city?city=London&days=7"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": {
      "name": "London",
      "country": "GB"
    },
    "forecast": [
      {
        "timestamp": 1709294400,
        "datetime": "2026-03-01T12:00:00.000Z",
        "temperature": {
          "current": 15.5,
          "min": 13.0,
          "max": 17.0,
          "unit": "°C"
        },
        "weather": {
          "main": "Rain",
          "description": "light rain"
        },
        "probability_of_precipitation": 0.45
      }
    ],
    "count": 56
  }
}
```

---

#### 6. Get Weather Forecast by Coordinates

**GET** `/api/v1/forecast/coordinates`

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude
- `days` (optional): Number of forecast days (1-16, default: 5)

**Example:**
```bash
curl "http://localhost:3000/api/v1/forecast/coordinates?lat=51.5074&lon=-0.1278&days=5"
```

---

#### 7. Get Hourly Forecast

**GET** `/api/v1/forecast/hourly`

**Query Parameters:**
- `city` (required): City name
- `country` (optional): ISO 3166 country code

**Example:**
```bash
curl "http://localhost:3000/api/v1/forecast/hourly?city=London"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": {
      "name": "London"
    },
    "hourly": [
      {
        "timestamp": 1709294400,
        "datetime": "2026-03-01T12:00:00.000Z",
        "temperature": 15.5,
        "humidity": 65,
        "pop": 0.2
      }
    ]
  }
}
```

---

## Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": "Location not found. Please check the city name or coordinates."
}
```

**Common Error Codes:**
- `400`: Bad Request (Invalid parameters)
- `404`: Not Found (Location not found)
- `429`: Too Many Requests (Rate limit exceeded)
- `500`: Internal Server Error

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP address
- Configurable via environment variables

---

## Caching

Responses are cached for 10 minutes (default) to reduce API calls and improve performance. Cache TTL is configurable via `CACHE_TTL` environment variable (in seconds).
              # Business logic
│   ├── weatherController.js
│   └── forecastController.js
├── middleware/              # Validation & error handling
│   ├── errorHandler.js
│   └── validation.js
├── routes/                  # API routes
│   ├── weatherRoutes.js
│   └── forecastRoutes.js
├── services/               # External API integration
│   └── weatherService.js
├── utils/                  # Helper functions
│   ├── formatters.js
│   └── logger.js
├── public/                 # Frontend files
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── ui.js
│   │   └── app.js
│   └── README.md
├── logs/                   # Application logs
├── .env.example
├── .gitignore
├── package.json
├── server.js              # Main entry point
├── setup.bat             # Quick setup script
├── README.md
└── API_TESTINGrmatters.js
│   └── logger.js
├── logs/
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `WEATHER_API_KEY` | OpenWeatherMap API key | (required) |
| `WEATHER_API_BASE_URL` | Weather API base URL | https://api.openweathermap.org/data/2.5 |
| `CACHE_TTL` | Cache TTL in seconds | 600 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `API_VERSION` | API version | v1 |

---

## Testing

You can test the API using curl, Postman, or any HTTP client.

### Example with curl:
```bash
# Get current weather
curl "http://localhost:3000/api/v1/weather/current?city=London"

# Get forecast
curl "http://localhost:3000/api/v1/forecast/city?city=Paris&days=7"

# Multiple cities
curl -X POST http://localhost:3000/api/v1/weather/multiple \
  -H "Content-Type: application/json" \
  -d '{"cities": ["London", "Paris", "Tokyo"]}'
```

---

## Logging

Logs are stored in the `logs/` directory:
- `combined.log`: All logs
- `error.log`: Error logs only
- `exceptions.log`: Uncaught exceptions
- `rejections.log`: Unhandled promise rejections

---

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-Origin Resource Sharing
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schema validation
- **Error Handling**: Secure error messages

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

MIT License - feel free to use this project for learning or production purposes.

---

## Support

For issues or questions, please open an issue on the repository.

---

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Built with Node.js, Express, and vanilla JavaScript
- Fonts by [Google Fonts](https://fonts.google.com/)

---

## Future Enhancements

### Backend
- [ ] Add user authentication and API keys
- [ ] Implement database for historical data
- [ ] Add weather alerts/notifications
- [ ] Support for more weather APIs
- [ ] GraphQL endpoint
- [ ] Air quality data
- [ ] UV index information
- [ ] Webhooks for weather updates

### Frontend
- [ ] Weather maps integration
- [ ] Dark mode toggle
- [ ] Historical weather data charts
- [ ] Multiple location comparison
- [ ] Weather widgets for sharing
- [ ] Offline support with Service Workers
- [ ] Progressive Web App (PWA) features
- [ ] Social media sharing
