/**
 * Main Application Controller
 * Handles user interactions and coordinates between API and UI
 */

class WeatherApp {
    constructor() {
        this.currentCity = null;
        this.currentCountry = null;
        this.currentView = 'current';
        this.forecastDays = 5;
        this.recentSearches = this.loadRecentSearches();
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        this.setupEventListeners();
        this.renderRecentSearches();
        await this.checkAPIHealth();
        
        // Load default city or last searched city
        const defaultCity = this.recentSearches[0] || 'London';
        await this.searchWeather(defaultCity);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search button
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });

        // Enter key on search input
        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Location button
        document.getElementById('locationBtn').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Forecast day buttons
        document.querySelectorAll('.forecast-day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeForecastDays(parseInt(e.target.dataset.days));
            });
        });
    }

    /**
     * Check if API is healthy
     */
    async checkAPIHealth() {
        const healthy = await weatherAPI.checkHealth();
        if (!healthy) {
            uiManager.showError('Cannot connect to weather API. Please try again in a moment.');
        }
    }

    /**
     * Handle search button click
     */
    async handleSearch() {
        const input = document.getElementById('cityInput');
        const city = input.value.trim();
        
        if (!city) {
            uiManager.showError('Please enter a city name');
            return;
        }

        await this.searchWeather(city);
    }

    /**
     * Search weather by city name
     */
    async searchWeather(city) {
        try {
            // Parse city and country if format is "City, Country"
            const parts = city.split(',').map(s => s.trim());
            this.currentCity = parts[0];
            this.currentCountry = parts[1] || null;

            uiManager.showLoading();
            uiManager.clearWeather();

            // Fetch data based on current view
            await this.loadCurrentView();

            // Update recent searches
            this.addToRecentSearches(this.currentCity);
            
            // Clear input
            document.getElementById('cityInput').value = '';
            
            uiManager.hideLoading();
        } catch (error) {
            uiManager.showError(error.message || 'Failed to fetch weather data');
            console.error('Search error:', error);
        }
    }

    /**
     * Get user's current location
     */
    getCurrentLocation() {
        if (!navigator.geolocation) {
            uiManager.showError('Geolocation is not supported by your browser');
            return;
        }

        uiManager.showLoading();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    await this.searchWeatherByCoords(latitude, longitude);
                } catch (error) {
                    uiManager.showError(error.message || 'Failed to fetch weather data');
                }
            },
            (error) => {
                uiManager.hideLoading();
                uiManager.showError('Unable to get your location. Please check your browser permissions.');
                console.error('Geolocation error:', error);
            }
        );
    }

    /**
     * Search weather by coordinates
     */
    async searchWeatherByCoords(lat, lon) {
        try {
            uiManager.showLoading();
            uiManager.clearWeather();

            if (this.currentView === 'current') {
                const data = await weatherAPI.getCurrentWeatherByCoordinates(lat, lon);
                uiManager.renderCurrentWeather(data);
                
                // Update current city from response
                this.currentCity = data.data.location.name;
                this.currentCountry = data.data.location.country;
                this.addToRecentSearches(this.currentCity);
            } else if (this.currentView === 'forecast') {
                const data = await weatherAPI.getForecastByCoordinates(lat, lon, this.forecastDays);
                uiManager.renderForecast(data);
            } else if (this.currentView === 'hourly') {
                // Get city name first, then fetch hourly
                const currentData = await weatherAPI.getCurrentWeatherByCoordinates(lat, lon);
                this.currentCity = currentData.data.location.name;
                const hourlyData = await weatherAPI.getHourlyForecast(this.currentCity);
                uiManager.renderHourly(hourlyData);
            }

            uiManager.hideLoading();
        } catch (error) {
            uiManager.showError(error.message || 'Failed to fetch weather data');
            console.error('Coords search error:', error);
        }
    }

    /**
     * Switch between views (current, forecast, hourly)
     */
    async switchView(view) {
        this.currentView = view;

        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update view sections
        document.querySelectorAll('.weather-view').forEach(section => {
            section.classList.toggle('active', section.id === `${view}View`);
        });

        // Load data for the new view if we have a city
        if (this.currentCity) {
            await this.loadCurrentView();
        }
    }

    /**
     * Load data for current view
     */
    async loadCurrentView() {
        try {
            uiManager.showLoading();

            if (this.currentView === 'current') {
                const data = await weatherAPI.getCurrentWeatherByCity(this.currentCity, this.currentCountry);
                uiManager.renderCurrentWeather(data);
            } else if (this.currentView === 'forecast') {
                const data = await weatherAPI.getForecastByCity(this.currentCity, this.currentCountry, this.forecastDays);
                uiManager.renderForecast(data);
            } else if (this.currentView === 'hourly') {
                const data = await weatherAPI.getHourlyForecast(this.currentCity, this.currentCountry);
                uiManager.renderHourly(data);
            }

            uiManager.hideLoading();
        } catch (error) {
            uiManager.showError(error.message || 'Failed to fetch weather data');
            throw error;
        }
    }

    /**
     * Change number of forecast days
     */
    async changeForecastDays(days) {
        this.forecastDays = days;

        // Update button states
        document.querySelectorAll('.forecast-day-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.days) === days);
        });

        // Reload forecast if we're on forecast view
        if (this.currentView === 'forecast' && this.currentCity) {
            try {
                uiManager.showLoading();
                const data = await weatherAPI.getForecastByCity(this.currentCity, this.currentCountry, this.forecastDays);
                uiManager.renderForecast(data);
                uiManager.hideLoading();
            } catch (error) {
                uiManager.showError(error.message || 'Failed to fetch forecast data');
            }
        }
    }

    /**
     * Add city to recent searches
     */
    addToRecentSearches(city) {
        // Remove if already exists
        this.recentSearches = this.recentSearches.filter(c => 
            c.toLowerCase() !== city.toLowerCase()
        );
        
        // Add to beginning
        this.recentSearches.unshift(city);
        
        // Keep only last 5
        this.recentSearches = this.recentSearches.slice(0, 5);
        
        // Save to localStorage
        this.saveRecentSearches();
        this.renderRecentSearches();
    }

    /**
     * Render recent searches
     */
    renderRecentSearches() {
        const container = document.getElementById('recentSearches');
        
        if (this.recentSearches.length === 0) {
            container.innerHTML = '';
            return;
        }

        const html = this.recentSearches.map(city => `
            <div class="recent-search-tag" data-city="${city}">
                📍 ${city}
            </div>
        `).join('');

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.recent-search-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.searchWeather(tag.dataset.city);
            });
        });
    }

    /**
     * Load recent searches from localStorage
     */
    loadRecentSearches() {
        try {
            const saved = localStorage.getItem('recentSearches');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    /**
     * Save recent searches to localStorage
     */
    saveRecentSearches() {
        try {
            localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
        } catch (error) {
            console.error('Failed to save recent searches:', error);
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();
    
    // Make app globally accessible for debugging
    window.weatherApp = app;
});
