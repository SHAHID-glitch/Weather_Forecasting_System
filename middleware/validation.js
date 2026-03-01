const Joi = require('joi');

/**
 * Validate city query parameter
 */
exports.validateCity = (req, res, next) => {
  const schema = Joi.object({
    city: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'City name is required',
      'string.min': 'City name must be at least 2 characters',
      'string.max': 'City name cannot exceed 100 characters',
      'any.required': 'City name is required',
    }),
    country: Joi.string().length(2).optional().messages({
      'string.length': 'Country code must be 2 characters (ISO 3166)',
    }),
    days: Joi.number().integer().min(1).max(16).optional(),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }

  next();
};

/**
 * Validate coordinates query parameters
 */
exports.validateCoordinates = (req, res, next) => {
  const schema = Joi.object({
    lat: Joi.number().min(-90).max(90).required().messages({
      'number.base': 'Latitude must be a number',
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required',
    }),
    lon: Joi.number().min(-180).max(180).required().messages({
      'number.base': 'Longitude must be a number',
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required',
    }),
    days: Joi.number().integer().min(1).max(16).optional(),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }

  next();
};
