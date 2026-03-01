# Quick Start Guide

Get your Weather Forecasting System up and running in 5 minutes!

## Step 1: Prerequisites

Make sure you have:
- ✅ Node.js installed ([Download here](https://nodejs.org/))
- ✅ A code editor (VS Code, Notepad++, etc.)
- ✅ A web browser (Chrome, Firefox, Edge, Safari)

## Step 2: Get an API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

**Note:** It may take a few minutes for your API key to activate.

## Step 3: Setup the Project

### Option A: Using the Setup Script (Windows)

1. Open the folder in File Explorer
2. Double-click `setup.bat`
3. Wait for dependencies to install
4. Edit `.env` file and paste your API key

### Option B: Manual Setup

1. Open terminal in the project folder
2. Run:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```
4. Open `.env` and replace `your_openweathermap_api_key_here` with your actual API key

Your `.env` should look like:
```env
PORT=3000
NODE_ENV=development
WEATHER_API_KEY=abc123xyz789yourkeyhere
WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
CACHE_TTL=600
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
API_VERSION=v1
```

## Step 4: Start the Server

Run one of these commands:

**Development mode (recommended for testing):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
Weather Forecasting API server running on port 3000
Environment: development
API Version: v1
```

## Step 5: Access the Application

Open your browser and go to:

```
http://localhost:3000
```

You should see the weather application interface!

## Step 6: Try It Out

1. **Search for a city:**
   - Type "London" in the search box
   - Click Search or press Enter
   - Weather data appears!

2. **Use your location:**
   - Click the location button (📍)
   - Allow location access when prompted
   - Your local weather loads automatically

3. **Explore views:**
   - Click "Current" for real-time weather
   - Click "Forecast" for 7-day predictions
   - Click "Hourly" for 48-hour forecast

## Troubleshooting

### "Cannot connect to weather API"
- ✅ Make sure the server is running
- ✅ Check that port 3000 is not already in use
- ✅ Restart the server with `npm start`

### "Invalid API key"
- ✅ Verify you copied the entire API key
- ✅ Wait 10-15 minutes for the key to activate
- ✅ Check you pasted it correctly in `.env` file

### "Location not found"
- ✅ Check the city name spelling
- ✅ Try adding country code: "Paris, FR"
- ✅ Try a major city like "London" or "Tokyo"

### Server won't start
- ✅ Check if Node.js is installed: `node --version`
- ✅ Delete `node_modules` folder and run `npm install` again
- ✅ Check if another app is using port 3000

## What's Next?

### Using the API Directly

Test API endpoints with PowerShell:

```powershell
# Get current weather
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/weather/current?city=London"

# Get 7-day forecast
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/forecast/city?city=Paris&days=7"
```

Or with curl:

```bash
curl "http://localhost:3000/api/v1/weather/current?city=London"
```

### Learn More

- 📖 [API Documentation](README.md) - Complete API reference
- 📖 [Frontend Guide](public/README.md) - Frontend customization
- 📖 [Testing Guide](API_TESTING.md) - API testing examples

## Common Use Cases

### 1. Check Weather for Multiple Cities

Use the multiple cities endpoint:

```powershell
$body = @{
    cities = @("London", "Paris", "Tokyo", "New York")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/weather/multiple" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### 2. Get Weather by Coordinates

If you have GPS coordinates:

```
http://localhost:3000/api/v1/weather/coordinates?lat=51.5074&lon=-0.1278
```

### 3. Check Hourly Forecast

For detailed hour-by-hour predictions:

```
http://localhost:3000/api/v1/forecast/hourly?city=Tokyo
```

## Tips

1. **Cache is your friend:** Data is cached for 10 minutes to save API calls
2. **Recent searches:** Your last 5 searches are saved in the browser
3. **Mobile friendly:** Works great on phones and tablets
4. **Rate limits:** 100 requests per 15 minutes per IP
5. **Country codes:** Use ISO 3166 codes (US, GB, FR, etc.)

## Need Help?

- Check the logs in the `logs/` folder
- Open browser console (F12) for frontend errors
- Review [README.md](README.md) for detailed documentation
- Ensure your `.env` file is configured correctly

## Success! 🎉

You now have a fully functional weather forecasting system with:
- ✅ Modern web interface
- ✅ RESTful API
- ✅ Current weather data
- ✅ 7-day forecasts
- ✅ Hourly predictions

Enjoy your weather application!
