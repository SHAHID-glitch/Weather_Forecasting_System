const weatherService = require('../services/weatherService');
const logger = require('../utils/logger');
const { formatForecastResponse } = require('../utils/formatters');

/**
 * Get forecast by city name
 */
exports.getForecastByCity = async (req, res, next) => {
  try {
    const { city, country, days = 5 } = req.query;
    const location = country ? `${city},${country}` : city;
    const forecastDays = Math.min(parseInt(days), 16);

    logger.info(`Fetching ${forecastDays}-day forecast for: ${location}`);

    const forecastData = await weatherService.getForecast({ 
      city: location,
      days: forecastDays 
    });
    const formattedData = formatForecastResponse(forecastData);

    res.status(200).json({
      success: true,
      data: formattedData,
      cached: forecastData.cached || false,
    });
  } catch (error) {
    logger.error(`Error fetching forecast: ${error.message}`);
    next(error);
  }
};

/**
 * Get forecast by coordinates
 */
exports.getForecastByCoordinates = async (req, res, next) => {
  try {
    const { lat, lon, days = 5 } = req.query;
    const forecastDays = Math.min(parseInt(days), 16);

    logger.info(`Fetching ${forecastDays}-day forecast for coordinates: ${lat}, ${lon}`);

    const forecastData = await weatherService.getForecast({ 
      lat: parseFloat(lat), 
      lon: parseFloat(lon),
      days: forecastDays 
    });
    const formattedData = formatForecastResponse(forecastData);

    res.status(200).json({
      success: true,
      data: formattedData,
      cached: forecastData.cached || false,
    });
  } catch (error) {
    logger.error(`Error fetching forecast by coordinates: ${error.message}`);
    next(error);
  }
};

/**
 * Get hourly forecast
 */
exports.getHourlyForecast = async (req, res, next) => {
  try {
    const { city, country } = req.query;
    const location = country ? `${city},${country}` : city;

    logger.info(`Fetching hourly forecast for: ${location}`);

    const forecastData = await weatherService.getHourlyForecast({ city: location });
    
    res.status(200).json({
      success: true,
      data: forecastData,
      cached: forecastData.cached || false,
    });
  } catch (error) {
    logger.error(`Error fetching hourly forecast: ${error.message}`);
    next(error);
  }
};
