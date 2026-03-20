/**
 * Weather API Client
 * Handles all API communications with the backend
 */

class WeatherAPI {
    constructor() {
        // Use same-origin API path to support local and deployed environments.
        this.baseURL = '/api/v1';
        this.timeout = 10000; // 10 seconds
    }

    /**
     * Make HTTP request with error handling
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout. Please try again.');
            }
            throw error;
        }
    }

    /**
     * Get current weather by city name
     */
    async getCurrentWeatherByCity(city, country = null) {
        const params = new URLSearchParams({ city });
        if (country) params.append('country', country);
        
        return this.request(`/weather/current?${params}`);
    }

    /**
     * Get current weather by coordinates
     */
    async getCurrentWeatherByCoordinates(lat, lon) {
        const params = new URLSearchParams({ lat, lon });
        return this.request(`/weather/coordinates?${params}`);
    }

    /**
     * Get weather for multiple cities
     */
    async getMultipleCitiesWeather(cities) {
        return this.request('/weather/multiple', {
            method: 'POST',
            body: JSON.stringify({ cities }),
        });
    }

    /**
     * Get weather forecast by city
     */
    async getForecastByCity(city, country = null, days = 5) {
        const params = new URLSearchParams({ city, days });
        if (country) params.append('country', country);
        
        return this.request(`/forecast/city?${params}`);
    }

    /**
     * Get weather forecast by coordinates
     */
    async getForecastByCoordinates(lat, lon, days = 5) {
        const params = new URLSearchParams({ lat, lon, days });
        return this.request(`/forecast/coordinates?${params}`);
    }

    /**
     * Get hourly forecast
     */
    async getHourlyForecast(city, country = null) {
        const params = new URLSearchParams({ city });
        if (country) params.append('country', country);
        
        return this.request(`/forecast/hourly?${params}`);
    }

    /**
     * Check API health
     */
    async checkHealth() {
        try {
            const response = await fetch('/health');
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Create a singleton instance
const weatherAPI = new WeatherAPI();
