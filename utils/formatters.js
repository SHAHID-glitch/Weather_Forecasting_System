/**
 * Format current weather response
 */
exports.formatWeatherResponse = (data) => {
  if (!data || !data.main) {
    return null;
  }

  return {
    location: {
      name: data.name,
      country: data.sys?.country,
      coordinates: {
        lat: data.coord?.lat,
        lon: data.coord?.lon,
      },
    },
    current: {
      timestamp: data.dt,
      datetime: new Date(data.dt * 1000).toISOString(),
      timezone: data.timezone,
      temperature: {
        current: data.main.temp,
        feels_like: data.main.feels_like,
        min: data.main.temp_min,
        max: data.main.temp_max,
        unit: '°C',
      },
      weather: {
        main: data.weather[0]?.main,
        description: data.weather[0]?.description,
        icon: data.weather[0]?.icon,
      },
      atmospheric: {
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        visibility: data.visibility,
        sea_level: data.main.sea_level,
      },
      wind: {
        speed: data.wind?.speed,
        direction: data.wind?.deg,
        gust: data.wind?.gust,
        unit: 'm/s',
      },
      clouds: {
        coverage: data.clouds?.all,
        unit: '%',
      },
      rain: data.rain,
      snow: data.snow,
      sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toISOString() : null,
      sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toISOString() : null,
    },
  };
};

/**
 * Format forecast response
 */
exports.formatForecastResponse = (data) => {
  if (!data || !data.list) {
    return null;
  }

  return {
    location: {
      name: data.city?.name,
      country: data.city?.country,
      coordinates: {
        lat: data.city?.coord?.lat,
        lon: data.city?.coord?.lon,
      },
      timezone: data.city?.timezone,
    },
    forecast: data.list.map(item => ({
      timestamp: item.dt,
      datetime: new Date(item.dt * 1000).toISOString(),
      temperature: {
        current: item.main.temp,
        feels_like: item.main.feels_like,
        min: item.main.temp_min,
        max: item.main.temp_max,
        unit: '°C',
      },
      weather: {
        main: item.weather[0]?.main,
        description: item.weather[0]?.description,
        icon: item.weather[0]?.icon,
      },
      atmospheric: {
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        sea_level: item.main.sea_level,
      },
      wind: {
        speed: item.wind?.speed,
        direction: item.wind?.deg,
        gust: item.wind?.gust,
        unit: 'm/s',
      },
      clouds: {
        coverage: item.clouds?.all,
        unit: '%',
      },
      probability_of_precipitation: item.pop,
      rain: item.rain,
      snow: item.snow,
    })),
    count: data.list.length,
  };
};

/**
 * Convert temperature units
 */
exports.convertTemperature = (temp, from, to) => {
  if (from === to) return temp;

  // Convert to Celsius first
  let celsius = temp;
  if (from === 'fahrenheit') {
    celsius = (temp - 32) * (5 / 9);
  } else if (from === 'kelvin') {
    celsius = temp - 273.15;
  }

  // Convert from Celsius to target unit
  if (to === 'fahrenheit') {
    return (celsius * (9 / 5)) + 32;
  } else if (to === 'kelvin') {
    return celsius + 273.15;
  }

  return celsius;
};

/**
 * Get wind direction from degrees
 */
exports.getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};
