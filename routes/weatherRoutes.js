const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { validateCity, validateCoordinates } = require('../middleware/validation');

/**
 * @route   GET /api/v1/weather/current
 * @desc    Get current weather by city name
 * @query   city - City name (required)
 * @query   country - Country code (optional)
 * @access  Public
 */
router.get('/current', validateCity, weatherController.getCurrentWeatherByCity);

/**
 * @route   GET /api/v1/weather/coordinates
 * @desc    Get current weather by coordinates
 * @query   lat - Latitude (required)
 * @query   lon - Longitude (required)
 * @access  Public
 */
router.get('/coordinates', validateCoordinates, weatherController.getCurrentWeatherByCoordinates);

/**
 * @route   GET /api/v1/weather/multiple
 * @desc    Get current weather for multiple cities
 * @body    cities - Array of city names (required)
 * @access  Public
 */
router.post('/multiple', weatherController.getMultipleCitiesWeather);

module.exports = router;
