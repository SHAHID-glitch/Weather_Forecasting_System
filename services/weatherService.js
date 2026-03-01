const axios = require('axios');
const NodeCache = require('node-cache');
const logger = require('../utils/logger');

// Initialize cache with TTL from env or default 10 minutes
const cache = new NodeCache({ 
  stdTTL: parseInt(process.env.CACHE_TTL) || 600,
  checkperiod: 120 
});

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = process.env.WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5';

/**
 * Make API request to OpenWeatherMap
 */
const makeWeatherApiRequest = async (endpoint, params) => {
  try {
    if (!API_KEY) {
      throw new Error('Weather API key is not configured. Please set WEATHER_API_KEY in .env file');
    }

    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      params: {
        ...params,
        appid: API_KEY,
        units: 'metric', // Use metric units (Celsius)
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      const message = error.response.data.message || 'Unknown error';
      
      if (statusCode === 404) {
        throw new Error('Location not found. Please check the city name or coordinates.');
      } else if (statusCode === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (statusCode === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`Weather API error: ${message}`);
    }
    
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

/**
 * Get current weather data
 */
exports.getCurrentWeather = async (params) => {
  const cacheKey = params.city 
    ? `current_${params.city}` 
    : `current_${params.lat}_${params.lon}`;

  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    logger.info(`Returning cached weather data for: ${cacheKey}`);
    return { ...cachedData, cached: true };
  }

  // Build request params
  const requestParams = params.city 
    ? { q: params.city }
    : { lat: params.lat, lon: params.lon };

  // Fetch from API
  const data = await makeWeatherApiRequest('weather', requestParams);
  
  // Cache the result
  cache.set(cacheKey, data);
  logger.info(`Cached weather data for: ${cacheKey}`);

  return data;
};

/**
 * Get weather forecast
 */
exports.getForecast = async (params) => {
  const cacheKey = params.city 
    ? `forecast_${params.city}_${params.days || 5}` 
    : `forecast_${params.lat}_${params.lon}_${params.days || 5}`;

  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    logger.info(`Returning cached forecast data for: ${cacheKey}`);
    return { ...cachedData, cached: true };
  }

  // Build request params
  const requestParams = params.city 
    ? { q: params.city, cnt: (params.days || 5) * 8 } // 8 timestamps per day (3-hour intervals)
    : { lat: params.lat, lon: params.lon, cnt: (params.days || 5) * 8 };

  // Fetch from API
  const data = await makeWeatherApiRequest('forecast', requestParams);
  
  // Cache the result
  cache.set(cacheKey, data);
  logger.info(`Cached forecast data for: ${cacheKey}`);

  return data;
};

/**
 * Get hourly forecast
 */
exports.getHourlyForecast = async (params) => {
  const cacheKey = params.city 
    ? `hourly_${params.city}` 
    : `hourly_${params.lat}_${params.lon}`;

  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    logger.info(`Returning cached hourly forecast for: ${cacheKey}`);
    return { ...cachedData, cached: true };
  }

  // Build request params - get 48 hours of data
  const requestParams = params.city 
    ? { q: params.city, cnt: 16 } // Next 48 hours
    : { lat: params.lat, lon: params.lon, cnt: 16 };

  // Fetch from API
  const data = await makeWeatherApiRequest('forecast', requestParams);
  
  // Process hourly data
  const hourlyData = {
    location: data.city,
    hourly: data.list.map(item => ({
      timestamp: item.dt,
      datetime: new Date(item.dt * 1000).toISOString(),
      temperature: item.main.temp,
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      weather: item.weather[0],
      wind_speed: item.wind.speed,
      wind_direction: item.wind.deg,
      clouds: item.clouds.all,
      pop: item.pop, // Probability of precipitation
    })),
  };
  
  // Cache the result
  cache.set(cacheKey, hourlyData);
  logger.info(`Cached hourly forecast for: ${cacheKey}`);

  return hourlyData;
};

/**
 * Clear cache
 */
exports.clearCache = () => {
  cache.flushAll();
  logger.info('Cache cleared');
};

/**
 * Get cache stats
 */
exports.getCacheStats = () => {
  return cache.getStats();
};
