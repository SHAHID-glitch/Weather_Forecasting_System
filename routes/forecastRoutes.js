const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
const { validateCity, validateCoordinates } = require('../middleware/validation');

/**
 * @route   GET /api/v1/forecast/city
 * @desc    Get weather forecast by city name
 * @query   city - City name (required)
 * @query   country - Country code (optional)
 * @query   days - Number of days (default: 5, max: 16)
 * @access  Public
 */
router.get('/city', validateCity, forecastController.getForecastByCity);

/**
 * @route   GET /api/v1/forecast/coordinates
 * @desc    Get weather forecast by coordinates
 * @query   lat - Latitude (required)
 * @query   lon - Longitude (required)
 * @query   days - Number of days (default: 5, max: 16)
 * @access  Public
 */
router.get('/coordinates', validateCoordinates, forecastController.getForecastByCoordinates);

/**
 * @route   GET /api/v1/forecast/hourly
 * @desc    Get hourly forecast by city
 * @query   city - City name (required)
 * @query   country - Country code (optional)
 * @access  Public
 */
router.get('/hourly', validateCity, forecastController.getHourlyForecast);

module.exports = router;
