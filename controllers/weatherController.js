const weatherService = require('../services/weatherService');
const logger = require('../utils/logger');
const { formatWeatherResponse } = require('../utils/formatters');

/**
 * Get current weather by city name
 */
exports.getCurrentWeatherByCity = async (req, res, next) => {
  try {
    const { city, country } = req.query;
    const location = country ? `${city},${country}` : city;

    logger.info(`Fetching current weather for: ${location}`);

    const weatherData = await weatherService.getCurrentWeather({ city: location });
    const formattedData = formatWeatherResponse(weatherData);

    res.status(200).json({
      success: true,
      data: formattedData,
      cached: weatherData.cached || false,
    });
  } catch (error) {
    logger.error(`Error fetching weather: ${error.message}`);
    next(error);
  }
};

/**
 * Get current weather by coordinates
 */
exports.getCurrentWeatherByCoordinates = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    logger.info(`Fetching current weather for coordinates: ${lat}, ${lon}`);

    const weatherData = await weatherService.getCurrentWeather({ 
      lat: parseFloat(lat), 
      lon: parseFloat(lon) 
    });
    const formattedData = formatWeatherResponse(weatherData);

    res.status(200).json({
      success: true,
      data: formattedData,
      cached: weatherData.cached || false,
    });
  } catch (error) {
    logger.error(`Error fetching weather by coordinates: ${error.message}`);
    next(error);
  }
};

/**
 * Get current weather for multiple cities
 */
exports.getMultipleCitiesWeather = async (req, res, next) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of city names',
      });
    }

    if (cities.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 cities allowed per request',
      });
    }

    logger.info(`Fetching weather for multiple cities: ${cities.join(', ')}`);

    const weatherPromises = cities.map(city => 
      weatherService.getCurrentWeather({ city })
        .then(data => formatWeatherResponse(data))
        .catch(error => ({ 
          city, 
          error: error.message 
        }))
    );

    const results = await Promise.all(weatherPromises);

    res.status(200).json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    logger.error(`Error fetching multiple cities weather: ${error.message}`);
    next(error);
  }
};
