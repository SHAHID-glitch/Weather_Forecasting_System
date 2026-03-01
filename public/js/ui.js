/**
 * UI Manager - Handles all UI updates and rendering
 */

class UIManager {
    constructor() {
        this.elements = {
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            errorMessage: document.getElementById('errorMessage'),
            currentWeather: document.getElementById('currentWeather'),
            forecastWeather: document.getElementById('forecastWeather'),
            hourlyWeather: document.getElementById('hourlyWeather'),
        };
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.hideError();
        this.elements.loading.classList.remove('hidden');
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        this.elements.loading.classList.add('hidden');
    }

    /**
     * Show error message
     */
    showError(message) {
        this.hideLoading();
        this.elements.errorMessage.textContent = message;
        this.elements.error.classList.remove('hidden');
    }

    /**
     * Hide error message
     */
    hideError() {
        this.elements.error.classList.add('hidden');
    }

    /**
     * Get weather icon emoji
     */
    getWeatherIcon(weatherMain, icon) {
        const iconMap = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Smoke': '💨',
            'Haze': '🌫️',
            'Dust': '💨',
            'Fog': '🌫️',
            'Sand': '💨',
            'Ash': '🌋',
            'Squall': '💨',
            'Tornado': '🌪️',
        };
        
        return iconMap[weatherMain] || '🌤️';
    }

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    /**
     * Format time
     */
    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }

    /**
     * Get short day name
     */
    getShortDay(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    /**
     * Render current weather
     */
    renderCurrentWeather(data) {
        const weather = data.data;
        const icon = this.getWeatherIcon(weather.current.weather.main);
        
        const html = `
            <div class="weather-header">
                <h2 class="location-name">
                    ${weather.location.name}${weather.location.country ? `, ${weather.location.country}` : ''}
                </h2>
                <p class="weather-date">${this.formatDate(weather.current.datetime)}</p>
            </div>

            <div class="weather-main">
                <div class="weather-temp-section">
                    <div class="weather-icon-large">${icon}</div>
                    <div class="temperature-display">${Math.round(weather.current.temperature.current)}°C</div>
                    <div class="weather-description">${weather.current.weather.description}</div>
                    <div class="feels-like">Feels like ${Math.round(weather.current.temperature.feels_like)}°C</div>
                </div>

                <div class="weather-details">
                    <div class="detail-item">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        </svg>
                        <div class="detail-content">
                            <h4>Humidity</h4>
                            <p>${weather.current.atmospheric.humidity}%</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
                        </svg>
                        <div class="detail-content">
                            <h4>Wind Speed</h4>
                            <p>${weather.current.wind.speed} m/s</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                        </svg>
                        <div class="detail-content">
                            <h4>Pressure</h4>
                            <p>${weather.current.atmospheric.pressure} hPa</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="1" y1="12" x2="23" y2="12"/>
                            <polyline points="17 8 12 3 7 8"/>
                        </svg>
                        <div class="detail-content">
                            <h4>Visibility</h4>
                            <p>${(weather.current.atmospheric.visibility / 1000).toFixed(1)} km</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="weather-extras">
                <div class="extra-item">
                    <h4>Min Temperature</h4>
                    <p>${Math.round(weather.current.temperature.min)}°C</p>
                </div>
                <div class="extra-item">
                    <h4>Max Temperature</h4>
                    <p>${Math.round(weather.current.temperature.max)}°C</p>
                </div>
                <div class="extra-item">
                    <h4>Cloud Coverage</h4>
                    <p>${weather.current.clouds.coverage}%</p>
                </div>
                ${weather.current.sunrise ? `
                <div class="extra-item">
                    <h4>Sunrise</h4>
                    <p>${this.formatTime(weather.current.sunrise)}</p>
                </div>
                ` : ''}
                ${weather.current.sunset ? `
                <div class="extra-item">
                    <h4>Sunset</h4>
                    <p>${this.formatTime(weather.current.sunset)}</p>
                </div>
                ` : ''}
            </div>
        `;

        this.elements.currentWeather.innerHTML = html;
    }

    /**
     * Render forecast weather
     */
    renderForecast(data) {
        const forecast = data.data;
        
        // Group by day (take data from same day at noon)
        const dailyForecasts = [];
        const seenDates = new Set();
        
        forecast.forecast.forEach((item, index) => {
            const date = new Date(item.datetime);
            const dateKey = date.toDateString();
            
            // Take one forecast per day (prefer afternoon forecasts)
            if (!seenDates.has(dateKey) || date.getHours() === 12) {
                seenDates.add(dateKey);
                const existingIndex = dailyForecasts.findIndex(f => 
                    new Date(f.datetime).toDateString() === dateKey
                );
                
                if (existingIndex >= 0) {
                    dailyForecasts[existingIndex] = item;
                } else {
                    dailyForecasts.push(item);
                }
            }
        });

        const html = dailyForecasts.slice(0, 10).map((item, index) => {
            const icon = this.getWeatherIcon(item.weather.main);
            const date = new Date(item.datetime);
            const dayName = index === 0 ? 'Today' : this.getShortDay(item.datetime);
            
            return `
                <div class="forecast-card" style="--index: ${index}">
                    <div class="forecast-date">${dayName}</div>
                    <div class="forecast-date">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div class="forecast-icon">${icon}</div>
                    <div class="forecast-temp">${Math.round(item.temperature.current)}°C</div>
                    <div class="forecast-temp-range">
                        ${Math.round(item.temperature.min)}° / ${Math.round(item.temperature.max)}°
                    </div>
                    <div class="forecast-description">${item.weather.description}</div>
                </div>
            `;
        }).join('');

        this.elements.forecastWeather.innerHTML = html;
    }

    /**
     * Render hourly forecast
     */
    renderHourly(data) {
        const hourly = data.data.hourly;
        
        const html = `
            <div class="hourly-scroll">
                ${hourly.map((item, index) => {
                    const icon = this.getWeatherIcon(item.weather.main);
                    const date = new Date(item.datetime);
                    const time = date.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        hour12: true 
                    });
                    
                    return `
                        <div class="hourly-card">
                            <div class="hourly-time">${time}</div>
                            <div class="hourly-icon">${icon}</div>
                            <div class="hourly-temp">${Math.round(item.temperature)}°C</div>
                            <div class="hourly-details">
                                💧 ${item.humidity}%<br>
                                💨 ${item.wind_speed.toFixed(1)} m/s
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        this.elements.hourlyWeather.innerHTML = html;
    }

    /**
     * Clear all weather data
     */
    clearWeather() {
        this.elements.currentWeather.innerHTML = '';
        this.elements.forecastWeather.innerHTML = '';
        this.elements.hourlyWeather.innerHTML = '';
    }
}

// Create singleton instance
const uiManager = new UIManager();
